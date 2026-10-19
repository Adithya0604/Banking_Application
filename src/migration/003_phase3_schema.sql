CREATE TABLE IF NOT EXISTS ledger_accounts(
                                        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                                        account_id UUID REFERENCES accounts(id) ON DELETE RESTRICT,
                                        type VARCHAR(30) NOT NULL,
                                        currency VARCHAR(5) NOT NULL DEFAULT 'INR',
                                        status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'FROZEN', 'CLOSED')),
                                        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS transaction_journal(
                                        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                                        reference_id VARCHAR(100) NOT NULL UNIQUE,
                                        event_type VARCHAR(30) NOT NULL CHECK (event_type IN ('DEPOSIT', 'TRANSFER', 'WITHDRWAL', 'FEE')),
                                        description TEXT ,
                                        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ledger_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    journal_id UUID NOT NULL REFERENCES transaction_journal(id) ON DELETE RESTRICT,
    ledger_account_id UUID NOT NULL REFERENCES ledger_accounts(id) ON DELETE RESTRICT,
    direction VARCHAR(6) NOT NULL CHECK (direction IN ('DEBIT', 'CREDIT')),
    amount_paise BIGINT NOT NULL CHECK (amount_paise > 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ledger_entries_journal_id ON ledger_entries (journal_id);
CREATE INDEX IF NOT EXISTS idx_ledger_entries_account_id ON ledger_entries (ledger_account_id);
CREATE INDEX IF NOT EXISTS idx_ledger_entries_account_created ON ledger_entries (ledger_account_id, created_at DESC);

COMMIT;