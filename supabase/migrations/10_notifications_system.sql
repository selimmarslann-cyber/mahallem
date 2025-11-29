-- ============================================
-- NOTIFICATIONS SYSTEM MIGRATION
-- Bildirim sistemi: notifications, push_tokens
-- Created: 2025-11-29
-- ============================================

-- ============================================
-- ENUMS
-- ============================================
CREATE TYPE notification_type AS ENUM (
  'JOB_CREATED',
  'OFFER_RECEIVED',
  'OFFER_ACCEPTED',
  'OFFER_REJECTED',
  'ORDER_ACCEPTED',
  'ORDER_COMPLETED',
  'ORDER_CANCELLED',
  'REVIEW_RECEIVED',
  'REFERRAL_REWARD',
  'PAYOUT_APPROVED',
  'PAYOUT_REJECTED',
  'PAYOUT_PAID',
  'GENERAL'
);

-- ============================================
-- 1. NOTIFICATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  data JSONB,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);

-- ============================================
-- 2. PUSH_TOKENS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS push_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expo_push_token TEXT NOT NULL,
  device_id TEXT,
  platform TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, expo_push_token)
);

CREATE INDEX IF NOT EXISTS idx_push_tokens_user_id ON push_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_push_tokens_expo_push_token ON push_tokens(expo_push_token);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE push_tokens ENABLE ROW LEVEL SECURITY;

-- Notifications: users can view their own notifications
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid()::text = user_id::text);

-- Push tokens: users can manage their own tokens
CREATE POLICY "Users can manage own push tokens" ON push_tokens FOR ALL USING (auth.uid()::text = user_id::text);

COMMENT ON TABLE notifications IS 'Bildirimler tablosu';
COMMENT ON TABLE push_tokens IS 'Push notification token tablosu';
