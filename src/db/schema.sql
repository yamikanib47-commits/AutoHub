-- ==============================================================================
-- AutoAce Production Relational Database Schema (PostgreSQL / Supabase Ready)
-- Mirrors the AutoAce Google Sheets prototype database structure 1:1.
-- ==============================================================================

-- 1. Business Configuration Table
CREATE TABLE IF NOT EXISTS business (
    business_id VARCHAR(32) PRIMARY KEY,
    business_name VARCHAR(128) NOT NULL,
    market VARCHAR(64) NOT NULL DEFAULT 'Zambia',
    business_model VARCHAR(255) NOT NULL,
    mission TEXT NOT NULL,
    current_stage VARCHAR(64) NOT NULL,
    commission_rate NUMERIC(5, 4) NOT NULL DEFAULT 0.0300,
    listing_fee NUMERIC(10, 2) NOT NULL DEFAULT 45.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. KPIs Table
CREATE TABLE IF NOT EXISTS kpis (
    kpi_id VARCHAR(32) PRIMARY KEY,
    kpi_name VARCHAR(128) NOT NULL,
    category VARCHAR(64) NOT NULL,
    target VARCHAR(64) NOT NULL,
    current_value VARCHAR(64) NOT NULL,
    period VARCHAR(64) NOT NULL DEFAULT 'Monthly',
    unit VARCHAR(64) NOT NULL,
    status VARCHAR(64) NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Agents Table
CREATE TABLE IF NOT EXISTS agents (
    agent_id VARCHAR(32) PRIMARY KEY,
    agent_name VARCHAR(128) NOT NULL,
    phone VARCHAR(32) NOT NULL,
    city VARCHAR(64) NOT NULL,
    active_leads INTEGER NOT NULL DEFAULT 0,
    completed_deals INTEGER NOT NULL DEFAULT 0,
    commission_earned NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    status VARCHAR(32) NOT NULL DEFAULT 'Active'
);

-- 4. Buyers Table
CREATE TABLE IF NOT EXISTS buyers (
    buyer_id VARCHAR(32) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    phone VARCHAR(32) NOT NULL,
    city VARCHAR(64) NOT NULL,
    budget NUMERIC(12, 2) NOT NULL,
    preferred_make VARCHAR(64) NOT NULL,
    preferred_model VARCHAR(128) NOT NULL,
    preferred_year INTEGER NOT NULL,
    transmission VARCHAR(32) NOT NULL DEFAULT 'Automatic',
    fuel VARCHAR(32) NOT NULL DEFAULT 'Petrol',
    request_status VARCHAR(64) NOT NULL DEFAULT 'New',
    lead_temperature VARCHAR(32) NOT NULL DEFAULT 'Medium',
    assigned_agent_id VARCHAR(32) REFERENCES agents(agent_id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Sellers Table
CREATE TABLE IF NOT EXISTS sellers (
    seller_id VARCHAR(32) PRIMARY KEY,
    seller_name VARCHAR(128) NOT NULL,
    phone VARCHAR(32) NOT NULL,
    location VARCHAR(255) NOT NULL,
    seller_type VARCHAR(64) NOT NULL,
    verification_status VARCHAR(64) NOT NULL DEFAULT 'Pending Verification',
    active_listings INTEGER NOT NULL DEFAULT 0,
    total_sales INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Seller Listings Table
CREATE TABLE IF NOT EXISTS seller_listings (
    listing_id VARCHAR(32) PRIMARY KEY,
    seller_id VARCHAR(32) NOT NULL REFERENCES sellers(seller_id) ON DELETE CASCADE,
    vehicle VARCHAR(255) NOT NULL,
    make VARCHAR(64) NOT NULL,
    model VARCHAR(128) NOT NULL,
    year INTEGER NOT NULL,
    price NUMERIC(12, 2) NOT NULL,
    location VARCHAR(255) NOT NULL,
    transmission VARCHAR(32) NOT NULL DEFAULT 'Automatic',
    fuel VARCHAR(32) NOT NULL DEFAULT 'Petrol',
    condition VARCHAR(64) NOT NULL,
    listing_status VARCHAR(64) NOT NULL DEFAULT 'Active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Connections Table (Bridge between Demand & Supply)
CREATE TABLE IF NOT EXISTS connections (
    connection_id VARCHAR(32) PRIMARY KEY,
    buyer_id VARCHAR(32) NOT NULL REFERENCES buyers(buyer_id) ON DELETE CASCADE,
    listing_id VARCHAR(32) NOT NULL REFERENCES seller_listings(listing_id) ON DELETE CASCADE,
    seller_id VARCHAR(32) NOT NULL REFERENCES sellers(seller_id) ON DELETE CASCADE,
    agent_id VARCHAR(32) NOT NULL REFERENCES agents(agent_id) ON DELETE CASCADE,
    connection_status VARCHAR(64) NOT NULL DEFAULT 'Pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    converted_to_sale BOOLEAN NOT NULL DEFAULT FALSE
);

-- 8. Transactions Table
CREATE TABLE IF NOT EXISTS transactions (
    transaction_id VARCHAR(32) PRIMARY KEY,
    buyer_id VARCHAR(32) NOT NULL REFERENCES buyers(buyer_id) ON DELETE RESTRICT,
    seller_id VARCHAR(32) NOT NULL REFERENCES sellers(seller_id) ON DELETE RESTRICT,
    agent_id VARCHAR(32) NOT NULL REFERENCES agents(agent_id) ON DELETE RESTRICT,
    connection_id VARCHAR(32) NOT NULL REFERENCES connections(connection_id) ON DELETE RESTRICT,
    vehicle VARCHAR(255) NOT NULL,
    sale_value NUMERIC(12, 2) NOT NULL,
    autoace_commission NUMERIC(12, 2) NOT NULL,
    agent_commission NUMERIC(12, 2) NOT NULL,
    autoace_net_revenue NUMERIC(12, 2) NOT NULL,
    transaction_status VARCHAR(64) NOT NULL DEFAULT 'Completed',
    sale_date DATE NOT NULL
);

-- 9. Content Performance Table
CREATE TABLE IF NOT EXISTS content (
    content_id VARCHAR(32) PRIMARY KEY,
    platform VARCHAR(32) NOT NULL,
    content_type VARCHAR(64) NOT NULL,
    topic VARCHAR(255) NOT NULL,
    hook TEXT NOT NULL,
    published_at DATE NOT NULL,
    views INTEGER NOT NULL DEFAULT 0,
    likes INTEGER NOT NULL DEFAULT 0,
    comments INTEGER NOT NULL DEFAULT 0,
    shares INTEGER NOT NULL DEFAULT 0,
    profile_visits INTEGER NOT NULL DEFAULT 0,
    inquiries INTEGER NOT NULL DEFAULT 0,
    buyer_requests INTEGER NOT NULL DEFAULT 0,
    resulting_sales INTEGER NOT NULL DEFAULT 0
);

-- 10. Tasks Table
CREATE TABLE IF NOT EXISTS tasks (
    task_id VARCHAR(32) PRIMARY KEY,
    task VARCHAR(255) NOT NULL,
    category VARCHAR(64) NOT NULL,
    priority VARCHAR(32) NOT NULL DEFAULT 'Medium',
    status VARCHAR(32) NOT NULL DEFAULT 'Pending',
    assigned_to VARCHAR(128) NOT NULL,
    due_date DATE NOT NULL,
    related_buyer_id VARCHAR(32) REFERENCES buyers(buyer_id) ON DELETE SET NULL,
    related_seller_id VARCHAR(32) REFERENCES sellers(seller_id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. Business Events Audit Log Table
CREATE TABLE IF NOT EXISTS business_events (
    event_id VARCHAR(32) PRIMARY KEY,
    event_type VARCHAR(64) NOT NULL,
    description TEXT NOT NULL,
    related_entity_type VARCHAR(64) NOT NULL,
    related_entity_id VARCHAR(64) NOT NULL,
    value NUMERIC(12, 2),
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for Fast Relational Lookups
CREATE INDEX IF NOT EXISTS idx_buyers_status ON buyers(request_status);
CREATE INDEX IF NOT EXISTS idx_buyers_temp ON buyers(lead_temperature);
CREATE INDEX IF NOT EXISTS idx_buyers_agent ON buyers(assigned_agent_id);
CREATE INDEX IF NOT EXISTS idx_listings_seller ON seller_listings(seller_id);
CREATE INDEX IF NOT EXISTS idx_connections_buyer ON connections(buyer_id);
CREATE INDEX IF NOT EXISTS idx_connections_listing ON connections(listing_id);
CREATE INDEX IF NOT EXISTS idx_connections_converted ON connections(converted_to_sale);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(sale_date);
