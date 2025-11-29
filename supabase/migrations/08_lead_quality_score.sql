-- ============================================
-- LEAD QUALITY SCORE SYSTEM MIGRATION
-- ============================================
-- Lead kalitesi skorlama sistemi
-- Created: 2024-01-XX
-- ============================================

-- ============================================
-- 1. LEAD_QUALITY_SCORES TABLOSU
-- ============================================
CREATE TABLE IF NOT EXISTS lead_quality_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  overall_score DECIMAL(5,2) NOT NULL DEFAULT 0 CHECK (overall_score >= 0 AND overall_score <= 100),
  description_quality_score DECIMAL(5,2) DEFAULT 0, -- Açıklama kalitesi (0-30)
  category_match_score DECIMAL(5,2) DEFAULT 0, -- Kategori eşleşme skoru (0-20)
  location_quality_score DECIMAL(5,2) DEFAULT 0, -- Konum bilgisi kalitesi (0-20)
  urgency_score DECIMAL(5,2) DEFAULT 0, -- Aciliyet skoru (0-15)
  budget_indication_score DECIMAL(5,2) DEFAULT 0, -- Bütçe belirtme skoru (0-15)
  calculated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(listing_id) -- Her ilan için bir skor
);

CREATE INDEX IF NOT EXISTS idx_lead_quality_scores_listing ON lead_quality_scores(listing_id);
CREATE INDEX IF NOT EXISTS idx_lead_quality_scores_overall ON lead_quality_scores(overall_score DESC);

-- ============================================
-- 2. LISTINGS TABLOSUNA QUALITY_SCORE KOLONU
-- ============================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'listings' 
    AND column_name = 'quality_score'
  ) THEN
    ALTER TABLE listings 
      ADD COLUMN quality_score DECIMAL(5,2) DEFAULT 0 CHECK (quality_score >= 0 AND quality_score <= 100);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_listings_quality_score ON listings(quality_score DESC);

-- ============================================
-- 3. FONKSİYON: LEAD QUALITY SCORE HESAPLA
-- ============================================
CREATE OR REPLACE FUNCTION calculate_lead_quality_score(
  p_listing_id UUID
)
RETURNS DECIMAL AS $$
DECLARE
  v_listing RECORD;
  v_description_quality DECIMAL := 0;
  v_category_match DECIMAL := 0;
  v_location_quality DECIMAL := 0;
  v_urgency_score DECIMAL := 0;
  v_budget_score DECIMAL := 0;
  v_overall_score DECIMAL := 0;
  v_description_length INT;
  v_has_address BOOLEAN;
  v_has_price_range BOOLEAN;
BEGIN
  -- İlan bilgilerini al
  SELECT 
    description,
    address,
    price_range,
    priority,
    service_category_id,
    level
  INTO v_listing
  FROM listings
  WHERE id = p_listing_id;

  IF NOT FOUND THEN
    RETURN 0;
  END IF;

  -- 1. Description Quality Score (0-30 puan)
  v_description_length := LENGTH(COALESCE(v_listing.description, ''));
  IF v_description_length >= 200 THEN
    v_description_quality := 30; -- 200+ karakter = mükemmel
  ELSIF v_description_length >= 100 THEN
    v_description_quality := 20; -- 100-199 karakter = iyi
  ELSIF v_description_length >= 50 THEN
    v_description_quality := 10; -- 50-99 karakter = orta
  ELSE
    v_description_quality := 0; -- 50'den az = düşük
  END IF;

  -- 2. Category Match Score (0-20 puan)
  -- Kategori seçilmişse ve level uygunsa
  IF v_listing.service_category_id IS NOT NULL AND v_listing.level IS NOT NULL THEN
    v_category_match := 20; -- Kategori ve level var = tam puan
  ELSIF v_listing.service_category_id IS NOT NULL THEN
    v_category_match := 10; -- Sadece kategori var = yarım puan
  ELSE
    v_category_match := 0; -- Kategori yok = 0 puan
  END IF;

  -- 3. Location Quality Score (0-20 puan)
  v_has_address := v_listing.address IS NOT NULL AND LENGTH(v_listing.address) > 0;
  IF v_has_address THEN
    -- Adres detaylı mı kontrol et
    IF v_listing.address LIKE '%mahalle%' OR v_listing.address LIKE '%sokak%' OR v_listing.address LIKE '%cadde%' THEN
      v_location_quality := 20; -- Detaylı adres = tam puan
    ELSE
      v_location_quality := 10; -- Basit adres = yarım puan
    END IF;
  ELSE
    v_location_quality := 0; -- Adres yok = 0 puan
  END IF;

  -- 4. Urgency Score (0-15 puan)
  -- Priority'ye göre skor
  IF v_listing.priority = 'acil' THEN
    v_urgency_score := 15; -- Acil = tam puan (daha hızlı yanıt alır)
  ELSIF v_listing.priority = 'normal' THEN
    v_urgency_score := 10; -- Normal = orta puan
  ELSE
    v_urgency_score := 5; -- Esnek = düşük puan
  END IF;

  -- 5. Budget Indication Score (0-15 puan)
  v_has_price_range := v_listing.price_range IS NOT NULL AND LENGTH(v_listing.price_range) > 0;
  IF v_has_price_range THEN
    -- Fiyat aralığı belirtilmişse
    IF v_listing.price_range LIKE '%TL%' OR v_listing.price_range LIKE '%₺%' THEN
      v_budget_score := 15; -- Fiyat belirtilmiş = tam puan
    ELSE
      v_budget_score := 10; -- Bütçe belirtilmiş ama fiyat yok = yarım puan
    END IF;
  ELSE
    v_budget_score := 0; -- Bütçe belirtilmemiş = 0 puan
  END IF;

  -- Toplam skor
  v_overall_score := v_description_quality + v_category_match + 
                     v_location_quality + v_urgency_score + v_budget_score;

  RETURN v_overall_score;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 4. FONKSİYON: LEAD QUALITY SCORE GÜNCELLE
-- ============================================
CREATE OR REPLACE FUNCTION update_lead_quality_score(
  p_listing_id UUID
)
RETURNS VOID AS $$
DECLARE
  v_score DECIMAL;
  v_description_quality DECIMAL;
  v_category_match DECIMAL;
  v_location_quality DECIMAL;
  v_urgency_score DECIMAL;
  v_budget_score DECIMAL;
BEGIN
  -- Skoru hesapla
  v_score := calculate_lead_quality_score(p_listing_id);

  -- Detaylı skorları hesapla (basitleştirilmiş)
  SELECT 
    CASE 
      WHEN LENGTH(COALESCE(description, '')) >= 200 THEN 30
      WHEN LENGTH(COALESCE(description, '')) >= 100 THEN 20
      WHEN LENGTH(COALESCE(description, '')) >= 50 THEN 10
      ELSE 0
    END,
    CASE WHEN service_category_id IS NOT NULL THEN 20 ELSE 0 END,
    CASE WHEN address IS NOT NULL AND LENGTH(address) > 0 THEN 20 ELSE 0 END,
    CASE 
      WHEN priority = 'acil' THEN 15
      WHEN priority = 'normal' THEN 10
      ELSE 5
    END,
    CASE WHEN price_range IS NOT NULL AND LENGTH(price_range) > 0 THEN 15 ELSE 0 END
  INTO v_description_quality, v_category_match, v_location_quality, v_urgency_score, v_budget_score
  FROM listings
  WHERE id = p_listing_id;

  -- lead_quality_scores tablosuna kaydet
  INSERT INTO lead_quality_scores (
    listing_id,
    overall_score,
    description_quality_score,
    category_match_score,
    location_quality_score,
    urgency_score,
    budget_indication_score,
    calculated_at,
    updated_at
  ) VALUES (
    p_listing_id,
    v_score,
    v_description_quality,
    v_category_match,
    v_location_quality,
    v_urgency_score,
    v_budget_score,
    NOW(),
    NOW()
  )
  ON CONFLICT (listing_id) DO UPDATE
  SET overall_score = v_score,
      description_quality_score = v_description_quality,
      category_match_score = v_category_match,
      location_quality_score = v_location_quality,
      urgency_score = v_urgency_score,
      budget_indication_score = v_budget_score,
      updated_at = NOW();

  -- listings tablosundaki quality_score'u güncelle
  UPDATE listings
  SET quality_score = v_score
  WHERE id = p_listing_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 5. TRIGGER: İLAN OLUŞTURULDUĞUNDA SKOR HESAPLA
-- ============================================
CREATE OR REPLACE FUNCTION trigger_calculate_lead_quality_score()
RETURNS TRIGGER AS $$
BEGIN
  -- İlan oluşturulduğunda veya güncellendiğinde skor hesapla
  PERFORM update_lead_quality_score(NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_listing_quality_score ON listings;
CREATE TRIGGER trigger_listing_quality_score
  AFTER INSERT OR UPDATE ON listings
  FOR EACH ROW
  EXECUTE FUNCTION trigger_calculate_lead_quality_score();

-- ============================================
-- 6. RLS POLICIES
-- ============================================
ALTER TABLE lead_quality_scores ENABLE ROW LEVEL SECURITY;

-- Lead quality scores: Herkes okuyabilir (public)
CREATE POLICY "Anyone can view lead quality scores"
  ON lead_quality_scores FOR SELECT
  USING (true);

-- Lead quality scores: Service role yönetebilir
CREATE POLICY "Service role can manage lead quality scores"
  ON lead_quality_scores FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================
-- 7. COMMENTS
-- ============================================
COMMENT ON TABLE lead_quality_scores IS 
  'Lead kalite skorları: İlan kalitesine göre hesaplanan skorlar (0-100)';
COMMENT ON FUNCTION calculate_lead_quality_score IS 
  'Lead kalite skorunu hesaplar (0-100 arası)';
COMMENT ON FUNCTION update_lead_quality_score IS 
  'Lead kalite skorunu hesaplayıp günceller';

