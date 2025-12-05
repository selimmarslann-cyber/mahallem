import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { config } from "dotenv";
import { resolve } from "path";
import { readFileSync } from "fs";
import { memoryCache } from "@/lib/cache/memoryCache";
import { withRateLimit } from "@/lib/middleware/rateLimit";
import { logger } from "@/lib/utils/logger";
import {
  createErrorResponse,
  createSuccessResponse,
  getErrorCodeFromStatus,
  getStatusFromErrorCode,
} from "@/lib/utils/apiError";

const SESSION_TTL = 3600; // 1 saat session TTL

// System prompt sabiti
const HIZMETGO_SYSTEM_PROMPT = `sen hizmetgo ustasısın.

amaç:
kullanıcının istediği işe fiyat çıkarabilmek için gereken temel bilgileri hızlıca toplamak ve ilan taslağı oluşturmak.

davranış kuralları:
- sohbet etme, açıklama yapma, tavsiye verme, paragraf yazma.
- cevapların 1 cümlelik özet + sadece gerekli sorular şeklinde olsun (2-4 soru yeterli, gereksiz soru sorma).
- kullanıcıyı dışarı yönlendirme, reklam yapma, teşekkür etme, "iyi günler" deme.
- gereksiz teknik detay, renk, dekor, marka, ürün önerisi yasak.
- her mesaj mutlaka sorularla bitsin.
- mantıksız soru sorma, kategoriye göre otomatik uyum sağla.
- kategoriye uygun olmayan sorular sorma (örnek: protez tırnak için "ulaşım kolay mı", "eşyalı mı" gibi sorular mantıksız).
- kullanıcı zaten bilgi verdiğinde aynı bilgiyi tekrar sorma.

toplanacak temel bilgiler (kategoriye göre sadece gerekli olanları sor):
1) il / ilçe (her zaman gerekli)
2) ne zaman yapılacak? (acil / tarih - her zaman gerekli)
3) tahmini bütçe (bilmiyorsa "bilmiyorum" demesi yeterli - her zaman gerekli)
4) alan veya büyüklük (sadece uygunsa: m2, metre, oda sayısı, basit tanım)
5) çalışma şartları (sadece uygunsa: erişim kolay mı, zemin durumu, engel var mı, eşyalı mı)
6) malzeme durumu (sadece uygunsa: malzemeli mi sadece işçilik mi)
7) özel durumlar (sadece uygunsa: alet var mı? ürün hazır mı? ölçü alınabilir mi?)

önemli: kategoriye uygun olmayan bilgileri sorma. örnek: protez tırnak için sadece il/ilçe, tarih, bütçe yeterli. "ulaşım", "eşyalı mı", "erişim" gibi sorular mantıksız.

kategoriye göre akıllı adaptasyon (sadece gerekli soruları sor):
- protez tırnak / kuaför / güzellik / estetik / saç kesimi / makyaj: sadece il/ilçe, tarih, bütçe. başka soru sorma.
- boya: oda/alan, eşya durumu, malzeme, tarih.
- tesisat/elektrik: arıza kısa tanımı, erişim, malzeme.
- nakliye: nereden-nereye, kat/asansör, eşya listesi.
- montaj: ürün hazır mı, montaj yeri, erişim.
- küpeşte/demir: alan/ölçü, erişim, malzeme.
- temizlik: m2, boş mu eşyalı mı, ne zaman.
- bahçe işleri: zemin düz mü, alet var mı, alan kaç m2.
- diğer hizmetler: kategori mantığına göre sadece gerekli bilgileri sor. gereksiz soru sorma.

her mesaj şablonu:
1) kullanıcının söylediğini tek cümlede özetle.
2) ardından sadece gerekli soruları sor (kategoriye göre 2-4 soru yeterli, gereksiz soru sorma).

bitiş:
tüm bilgiler alındığında (il/ilçe, tarih, bütçe + kategoriye özel bilgiler) sadece şu cümleyi yaz:
"ilan taslağınız hazır, onaylıyor musunuz?"
başka hiçbir şey ekleme.

önemli: kullanıcı bir mesajda tüm gerekli bilgileri vermişse (örnek: "istanbul avcılar yarın 500 tl"), direkt "ilan taslağınız hazır, onaylıyor musunuz?" yaz. gereksiz soru sorma.`;

// .env dosyasını manuel yükle
if (typeof window === "undefined") {
  const envPath = resolve(process.cwd(), ".env");
  config({ path: envPath, override: true });

  try {
    const envContent = readFileSync(envPath, "utf8");
    const envLines = envContent.split("\n");
    for (const line of envLines) {
      if (line.startsWith("OPENAI_API_KEY=")) {
        const keyValue = line.replace("OPENAI_API_KEY=", "").trim();
        if (keyValue) {
          process.env.OPENAI_API_KEY = keyValue;
        }
        break;
      }
    }
  } catch (e) {
    // .env okunamazsa sessizce devam et
  }
}

// OpenAI client oluştur
function getOpenAIClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error(
      "OPENAI_API_KEY environment variable bulunamadı. Lütfen .env dosyasına ekleyin.",
    );
  }

  // BaseURL'i açıkça belirt - Groq'a gitmesini engelle
  return new OpenAI({
    apiKey: apiKey,
    baseURL: "https://api.openai.com/v1",
  });
}

async function aiChatHandler(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      userId,
      message,
      sessionId,
      action,
      initialCategory,
      conversationHistory = [],
    } = body;

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 401 });
    }

    // Session ID oluştur veya kullan
    const currentSessionId = sessionId || `${userId}-${Date.now()}`;

    // Session mesajlarını cache'den al veya oluştur
    let sessionMessages =
      memoryCache.get<Array<{ role: string; content: string }>>(
        `ai:session:${currentSessionId}`,
      ) || [];

    // Kullanıcı mesajını ekle
    const userMessage =
      action === "initial" && initialCategory
        ? `${initialCategory} hizmeti için bilgi topla. ${message}`
        : message;

    sessionMessages.push({ role: "user", content: userMessage });

    // Conversation history'yi formatla - frontend'den gelen history'yi kullan
    // Eğer frontend history göndermediyse, session'dan al (mevcut kullanıcı mesajı hariç)
    const formattedMessages =
      conversationHistory.length > 0
        ? conversationHistory.map((m: any) => ({
            role: m.role,
            content: m.content,
          }))
        : sessionMessages.slice(0, -1).map((m) => ({
            role: m.role,
            content: m.content,
          }));

    // OpenAI çağrısı - System prompt HER ZAMAN en başta
    const openai = getOpenAIClient();
    const messages = [
      { role: "system" as const, content: HIZMETGO_SYSTEM_PROMPT },
      ...formattedMessages,
      { role: "user" as const, content: userMessage },
    ];

    // Timeout kontrolü (10 saniye)
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("AI_TIMEOUT")), 10000);
    });

    let completion;
    try {
      completion = (await Promise.race([
        openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: messages,
          temperature: 0.4,
          max_tokens: 700, // Token limiti - gereksiz tüketimi engelle
        }),
        timeoutPromise,
      ])) as any;
    } catch (timeoutError: any) {
      if (timeoutError.message === "AI_TIMEOUT") {
        logger.error("AI chat timeout", {
          userId,
          sessionId: currentSessionId,
        });
        const errorResponse = createErrorResponse(
          "INTERNAL_ERROR",
          "AI yanıt verme süresi aşıldı. Lütfen tekrar deneyin.",
        );
        return NextResponse.json(errorResponse, { status: 500 });
      }
      throw timeoutError;
    }

    const reply = completion.choices[0].message.content || "";

    // AI cevabını session'a ekle
    sessionMessages.push({ role: "assistant", content: reply });
    // Cache'e kaydet (TTL ile)
    memoryCache.set(
      `ai:session:${currentSessionId}`,
      sessionMessages,
      SESSION_TTL,
    );

    // İlan tamamlandı mı kontrolü
    const isComplete =
      reply.toLowerCase().includes("ilan") ||
      reply.toLowerCase().includes("hazır") ||
      reply.toLowerCase().includes("oluştur");

    const successResponse = createSuccessResponse({
      reply,
      sessionId: currentSessionId,
      isComplete,
      message: reply,
      content: reply,
      text: reply,
      aiResponse: reply,
    });

    return NextResponse.json(successResponse);
  } catch (err: any) {
    logger.error("AI Error", err);

    const errorResponse = createErrorResponse(
      getErrorCodeFromStatus(500),
      err.message || "AI yanıt veremedi",
    );

    return NextResponse.json(errorResponse, {
      status: getStatusFromErrorCode(getErrorCodeFromStatus(500)),
    });
  }
}

// Export with rate limiting (20 requests per 15 minutes for AI chat)
export const POST = withRateLimit(aiChatHandler, {
  maxRequests: 20,
  windowMs: 15 * 60 * 1000,
  getIdentifier: async (req) => {
    try {
      const body = await req.clone().json();
      const userId = body.userId;
      if (userId) {
        return `user:${userId}`;
      }
    } catch {
      // Body parse hatası durumunda IP kullan
    }
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded
      ? forwarded.split(",")[0]
      : req.headers.get("x-real-ip") || "unknown";
    return `ip:${ip}`;
  },
});
