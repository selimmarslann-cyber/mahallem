/**
 * Hizmetgo - Hizmet Arama ve Eşleştirme Servisi
 * 
 * Bu dosya, kullanıcı aramalarını kategori ve alt hizmetlerle eşleştiren
 * fonksiyonları içerir.
 */

import { SERVICE_CATEGORIES } from '../data/service-categories';
import { ServiceCategory, SearchResult } from '../types/service-categories';

/**
 * Türkçe karakterleri normalize eder (ı -> i, ş -> s, vb.)
 */
function normalizeTurkish(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/ı/g, 'i')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/İ/g, 'i')
    .replace(/Ğ/g, 'g')
    .replace(/Ü/g, 'u')
    .replace(/Ş/g, 's')
    .replace(/Ö/g, 'o')
    .replace(/Ç/g, 'c');
}

/**
 * Arama string'ini temizler ve normalize eder
 */
function cleanSearchQuery(query: string): string {
  return normalizeTurkish(query);
}

/**
 * Anahtar kelimelerde arama yapar
 */
function matchesKeyword(searchQuery: string, keyword: string): boolean {
  const normalizedQuery = cleanSearchQuery(searchQuery);
  const normalizedKeyword = cleanSearchQuery(keyword);
  
  // Tam eşleşme
  if (normalizedKeyword === normalizedQuery) {
    return true;
  }
  
  // İçeriyor mu kontrolü
  if (normalizedKeyword.includes(normalizedQuery) || normalizedQuery.includes(normalizedKeyword)) {
    return true;
  }
  
  // Kelime bazlı eşleşme (boşluklarla ayrılmış)
  const queryWords = normalizedQuery.split(/\s+/);
  const keywordWords = normalizedKeyword.split(/\s+/);
  
  // En az bir kelime eşleşiyorsa
  for (const qWord of queryWords) {
    if (qWord.length >= 3) { // 3 harften kısa kelimeleri atla
      for (const kWord of keywordWords) {
        if (kWord.includes(qWord) || qWord.includes(kWord)) {
          return true;
        }
      }
    }
  }
  
  return false;
}

/**
 * Kategori için eşleşme skoru hesaplar
 */
function calculateCategoryScore(
  searchQuery: string,
  category: ServiceCategory
): { score: number; matchedKeywords: string[] } {
  let score = 0;
  const matchedKeywords: string[] = [];
  
  // Kategori anahtar kelimelerinde arama
  for (const keyword of category.keywords) {
    if (matchesKeyword(searchQuery, keyword)) {
      score += 10; // Kategori anahtar kelimesi eşleşmesi
      matchedKeywords.push(keyword);
    }
  }
  
  // Alt hizmet anahtar kelimelerinde arama
  for (const subService of category.subServices) {
    for (const keyword of subService.keywords) {
      if (matchesKeyword(searchQuery, keyword)) {
        score += 5; // Alt hizmet anahtar kelimesi eşleşmesi
        if (!matchedKeywords.includes(keyword)) {
          matchedKeywords.push(keyword);
        }
      }
    }
  }
  
  return { score, matchedKeywords };
}

/**
 * Arama yapar ve en iyi eşleşen kategorileri döndürür
 * 
 * @param query Kullanıcının arama sorgusu
 * @param limit Maksimum sonuç sayısı (varsayılan: 5)
 * @returns Eşleşen kategoriler, skor sırasına göre
 */
export function searchServiceCategories(
  query: string,
  limit: number = 5
): SearchResult[] {
  if (!query || query.trim().length === 0) {
    return [];
  }
  
  const results: SearchResult[] = [];
  
  // Her kategori için skor hesapla
  for (const category of SERVICE_CATEGORIES) {
    const { score, matchedKeywords } = calculateCategoryScore(query, category);
    
    if (score > 0) {
      results.push({
        category,
        matchScore: score,
        matchedKeywords,
      });
    }
  }
  
  // Skora göre sırala (yüksekten düşüğe)
  results.sort((a, b) => b.matchScore - a.matchScore);
  
  // Limit'e göre kes
  return results.slice(0, limit);
}

/**
 * En iyi eşleşen kategoriyi döndürür
 * 
 * @param query Kullanıcının arama sorgusu
 * @returns En iyi eşleşen kategori veya null
 */
export function findBestMatch(query: string): SearchResult | null {
  const results = searchServiceCategories(query, 1);
  return results.length > 0 ? results[0] : null;
}

/**
 * Kategori ID'sine göre kategori bulur
 * 
 * @param categoryId Kategori ID'si
 * @returns Kategori veya null
 */
export function getCategoryById(categoryId: string): ServiceCategory | null {
  return SERVICE_CATEGORIES.find(cat => cat.id === categoryId) || null;
}

/**
 * Alt hizmet ID'sine göre alt hizmet bulur
 * 
 * @param categoryId Kategori ID'si
 * @param subServiceId Alt hizmet ID'si
 * @returns Alt hizmet veya null
 */
export function getSubServiceById(
  categoryId: string,
  subServiceId: string
): { category: ServiceCategory; subService: any } | null {
  const category = getCategoryById(categoryId);
  if (!category) {
    return null;
  }
  
  const subService = category.subServices.find(sub => sub.id === subServiceId);
  if (!subService) {
    return null;
  }
  
  return { category, subService };
}

/**
 * Tüm kategorileri döndürür
 */
export function getAllCategories(): ServiceCategory[] {
  return SERVICE_CATEGORIES;
}

