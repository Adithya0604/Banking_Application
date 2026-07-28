-- Enable UUID extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Customers Table
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING_KYC',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Customer Credentials Table
CREATE TABLE IF NOT EXISTS customer_credentials (
    customer_id UUID PRIMARY KEY REFERENCES customers(id) ON DELETE CASCADE,
    password_hash VARCHAR(255) NOT NULL,
    failed_attempts INT DEFAULT 0,
    locked_until TIMESTAMP WITH TIME ZONE NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Customer Addresses Table
CREATE TABLE IF NOT EXISTS customer_addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    address_type VARCHAR(20) NOT NULL DEFAULT 'RESIDENTIAL',
    street_line1 VARCHAR(255) NOT NULL,
    street_line2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    country VARCHAR(100) NOT NULL DEFAULT 'India',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. KYC Verifications Table
CREATE TABLE IF NOT EXISTS kyc_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    document_type VARCHAR(50) NOT NULL, -- e.g., TAX_IDENTIFIER, PASSPORT
    document_hash VARCHAR(64) NOT NULL, -- SHA-256 hash of plain document ID
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    rejection_reason TEXT,
    verified_at TIMESTAMP WITH TIME ZONE NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Accounts Table
CREATE TABLE IF NOT EXISTS accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_number VARCHAR(34) UNIQUE NOT NULL, -- Standard routing / IBAN format
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
    account_type VARCHAR(20) NOT NULL DEFAULT 'SAVINGS',
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    currency VARCHAR(3) NOT NULL DEFAULT 'INR',
    cached_balance BIGINT NOT NULL DEFAULT 0, -- Stored in subunits (e.g. Paise/Cents)
    version INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Cards Table
CREATE TABLE IF NOT EXISTS cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE RESTRICT,
    card_number VARCHAR(16) UNIQUE NOT NULL, -- 16-digit string generated via Luhn Algorithm
    cvv_hash VARCHAR(255) NOT NULL,
    expiry_month INT NOT NULL,
    expiry_year INT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);