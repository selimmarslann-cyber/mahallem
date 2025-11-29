-- ============================================
-- SUPPORT SYSTEM MIGRATION
-- Destek sistemi: support_tickets, support_messages
-- Created: 2025-11-29
-- ============================================

-- ============================================
-- ENUMS
-- ============================================
CREATE TYPE support_ticket_status AS ENUM ('OPEN', 'BOT_RESOLVED', 'ADMIN_OPEN', 'ADMIN_REPLIED', 'RESOLVED', 'CLOSED');
CREATE TYPE support_ticket_category AS ENUM ('GENERAL', 'TECHNICAL', 'PAYMENT', 'REFUND', 'ACCOUNT', 'BUSINESS', 'ORDER', 'REFERRAL', 'OTHER');
CREATE TYPE support_message_type AS ENUM ('USER', 'BOT', 'ADMIN');

-- ============================================
-- 1. SUPPORT_TICKETS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  name TEXT,
  category support_ticket_category NOT NULL DEFAULT 'GENERAL',
  subject TEXT NOT NULL,
  status support_ticket_status NOT NULL DEFAULT 'OPEN',
  priority INTEGER NOT NULL DEFAULT 3,
  assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
  resolved_by UUID REFERENCES users(id) ON DELETE SET NULL,
  is_bot_resolved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  resolved_at TIMESTAMPTZ,
  closed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_support_tickets_user_id ON support_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_support_tickets_category ON support_tickets(category);
CREATE INDEX IF NOT EXISTS idx_support_tickets_assigned_to ON support_tickets(assigned_to);
CREATE INDEX IF NOT EXISTS idx_support_tickets_created_at ON support_tickets(created_at);
CREATE INDEX IF NOT EXISTS idx_support_tickets_priority ON support_tickets(priority);

-- ============================================
-- 2. SUPPORT_MESSAGES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS support_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
  type support_message_type NOT NULL DEFAULT 'USER',
  content TEXT NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  admin_id UUID REFERENCES users(id) ON DELETE SET NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_support_messages_ticket_id ON support_messages(ticket_id);
CREATE INDEX IF NOT EXISTS idx_support_messages_created_at ON support_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_support_messages_is_read ON support_messages(is_read);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_messages ENABLE ROW LEVEL SECURITY;

-- Support tickets: users can view their own tickets
CREATE POLICY "Users can view own support tickets" ON support_tickets FOR SELECT USING (
  user_id IS NULL OR auth.uid()::text = user_id::text
);
CREATE POLICY "Users can create support tickets" ON support_tickets FOR INSERT WITH CHECK (
  user_id IS NULL OR auth.uid()::text = user_id::text
);

-- Support messages: users can view messages in their tickets
CREATE POLICY "Users can view messages in own tickets" ON support_messages FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM support_tickets 
    WHERE support_tickets.id = support_messages.ticket_id 
    AND (support_tickets.user_id IS NULL OR support_tickets.user_id::text = auth.uid()::text)
  )
);
CREATE POLICY "Users can create messages in own tickets" ON support_messages FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM support_tickets 
    WHERE support_tickets.id = support_messages.ticket_id 
    AND (support_tickets.user_id IS NULL OR support_tickets.user_id::text = auth.uid()::text)
  )
);

COMMENT ON TABLE support_tickets IS 'Destek talepleri tablosu';
COMMENT ON TABLE support_messages IS 'Destek mesajları tablosu';
