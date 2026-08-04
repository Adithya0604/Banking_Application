
-- 7. Refresh Token 
CREATE TABLE IF NOT EXISTS refresh_tokens(
id UUID PRIMARY key DEFAULT gen_random_uuid(),
customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
token_hash VARCHAR(64) UNIQUE NOT NULL, 
family_id UUID NOT NULL,
is_revoked BOOLEAN NOT NULL DEFAULT FALSE, 
expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
user_agent TEXT,
ip_address VARCHAR(45), 
created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

--Fast lookup during POST /auth/refresh (O(1) speed)
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_hash ON refresh_tokens(token_hash);

-- Fast lookup when revoking an entire session family during a breach
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_family on refresh_tokens(family_id);

-- Fast lookup for "Log out of all devices" for a specific user
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_customer ON refresh_tokens(customer_id);
