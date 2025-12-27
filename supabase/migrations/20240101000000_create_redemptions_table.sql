-- REDEMPTIONS TABLE MIGRATION
-- Stores offline QR-based reward redemptions with status tracking
-- Created for village-first education app

CREATE TABLE IF NOT EXISTS redemptions (
  -- Primary identifiers
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,

  -- Redemption details
  redemption_code TEXT NOT NULL UNIQUE,
  one_time_token TEXT NOT NULL UNIQUE,
  coins_redeemed INTEGER NOT NULL,
  
  -- QR data (for offline verification)
  qr_data JSONB NOT NULL,

  -- Status tracking
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'collected', 'expired', 'rejected')),
  
  -- Verification info
  verified_by TEXT,
  verified_at TIMESTAMP WITH TIME ZONE,
  rejected_reason TEXT,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

  -- Indexes for common queries
  INDEX idx_student_id (student_id),
  INDEX idx_redemption_code (redemption_code),
  INDEX idx_status (status),
  INDEX idx_expires_at (expires_at),
  INDEX idx_created_at (created_at)
);

-- Trigger to update updated_at on row change
CREATE TRIGGER update_redemptions_updated_at
BEFORE UPDATE ON redemptions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE redemptions ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Students can view their own redemptions
CREATE POLICY "Students can view their own redemptions" ON redemptions
  FOR SELECT
  USING (auth.uid()::text = student_id);

-- RLS Policy: Students can insert their own redemptions
CREATE POLICY "Students can insert their own redemptions" ON redemptions
  FOR INSERT
  WITH CHECK (auth.uid()::text = student_id);

-- RLS Policy: Teachers can view redemptions for verification
CREATE POLICY "Teachers can view redemptions for verification" ON redemptions
  FOR SELECT
  USING (
    (SELECT role FROM users WHERE id = auth.uid()) = 'teacher' OR 
    (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
  );

-- RLS Policy: Teachers can update redemptions after verification
CREATE POLICY "Teachers can verify redemptions" ON redemptions
  FOR UPDATE
  USING (
    (SELECT role FROM users WHERE id = auth.uid()) = 'teacher' OR 
    (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
  );

-- Grant permissions
GRANT SELECT ON redemptions TO authenticated;
GRANT INSERT ON redemptions TO authenticated;
GRANT UPDATE ON redemptions TO authenticated;
