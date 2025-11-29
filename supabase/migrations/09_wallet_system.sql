-- ============================================
-- WALLET SYSTEM MIGRATION
-- Cüzdan sistemi: wallets, payout_requests
-- Created: 2025-11-29
-- ============================================

-- ============================================
-- ENUMS
-- ============================================
CREATE TYPE payout_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'PAID');

-- ============================================
-- 1. WALLETS TABLE (if not exists in 05_lead_system.sql)
-- ============================================
CREATE TABLE IF NOT EXISTS wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  balance DECIMAL(10, 2) NOT NULL DEFAULT 0,
  pending_balance DECIMAL(10, 2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'TRY',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_wallets_user_id ON wallets(user_id);

-- ============================================
-- 2. PAYOUT_REQUESTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS payout_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id UUID NOT NULL REFERENCES wallets(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  status payout_status NOT NULL DEFAULT 'PENDING',
  iban TEXT,
  notes TEXT,
  requested_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_payout_requests_wallet_id ON payout_requests(wallet_id);
CREATE INDEX IF NOT EXISTS idx_payout_requests_user_id ON payout_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_payout_requests_status ON payout_requests(status);
CREATE INDEX IF NOT EXISTS idx_payout_requests_requested_at ON payout_requests(requested_at);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE payout_requests ENABLE ROW LEVEL SECURITY;

-- Wallets: users can view their own wallets
CREATE POLICY "Users can view own wallet" ON wallets FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can update own wallet" ON wallets FOR UPDATE USING (auth.uid()::text = user_id::text);

-- Payout requests: users can view their own requests
CREATE POLICY "Users can view own payout requests" ON payout_requests FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can create payout requests" ON payout_requests FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

COMMENT ON TABLE wallets IS 'Kullanıcı cüzdanları tablosu';
COMMENT ON TABLE payout_requests IS 'Çekim talepleri tablosu';
