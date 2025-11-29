-- ============================================
-- REFERRAL TABLES MIGRATION
-- Referral sistemi tabloları: referral_codes, referral_relations, referral_rewards
-- Created: 2024-01-XX
-- ============================================

-- ============================================
-- 1. REFERRAL_CODES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS referral_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  code TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_referral_codes_code ON referral_codes(code);
CREATE INDEX IF NOT EXISTS idx_referral_codes_user_id ON referral_codes(user_id);

-- ============================================
-- 2. REFERRAL_RELATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS referral_relations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  referred_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  level INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(referred_user_id, level)
);

CREATE INDEX IF NOT EXISTS idx_referral_relations_referrer_user_id ON referral_relations(referrer_user_id);
CREATE INDEX IF NOT EXISTS idx_referral_relations_referred_user_id ON referral_relations(referred_user_id);
CREATE INDEX IF NOT EXISTS idx_referral_relations_level ON referral_relations(level);

-- ============================================
-- 3. REFERRAL_REWARDS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS referral_rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  level INTEGER NOT NULL,
  gross_commission DECIMAL(10, 2) NOT NULL,
  share_rate DECIMAL(5, 4) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_referral_rewards_user_id ON referral_rewards(user_id);
CREATE INDEX IF NOT EXISTS idx_referral_rewards_order_id ON referral_rewards(order_id);
CREATE INDEX IF NOT EXISTS idx_referral_rewards_level ON referral_rewards(level);
CREATE INDEX IF NOT EXISTS idx_referral_rewards_created_at ON referral_rewards(created_at);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================
ALTER TABLE referral_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_relations ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_rewards ENABLE ROW LEVEL SECURITY;

-- Referral codes: users can view their own codes
CREATE POLICY "Users can view own referral codes" ON referral_codes FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can insert own referral codes" ON referral_codes FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Referral relations: users can view their own relations
CREATE POLICY "Users can view own referral relations" ON referral_relations FOR SELECT USING (
  auth.uid()::text = referrer_user_id::text OR auth.uid()::text = referred_user_id::text
);

-- Referral rewards: users can view their own rewards
CREATE POLICY "Users can view own referral rewards" ON referral_rewards FOR SELECT USING (auth.uid()::text = user_id::text);

COMMENT ON TABLE referral_codes IS 'Kullanici referral kodlari tablosu';
COMMENT ON TABLE referral_relations IS 'Referral iliskileri tablosu (referrer-referred)';
COMMENT ON TABLE referral_rewards IS 'Referral odulleri tablosu';

