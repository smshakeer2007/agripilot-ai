-- AgriPilot AI - PostgreSQL Database Schema
-- Compatible with Supabase and Standard PostgreSQL

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    farm_name VARCHAR(255) NOT NULL,
    farming_sector VARCHAR(100) DEFAULT 'Horticulture',
    farming_approach VARCHAR(100) DEFAULT 'Integrated Pest Management (IPM)',
    primary_goal VARCHAR(100) DEFAULT 'Maximize Yield & Reduce Disease',
    risk_alert_threshold VARCHAR(50) DEFAULT 'Medium',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Fields Table
CREATE TABLE IF NOT EXISTS fields (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    crop_type VARCHAR(100) NOT NULL,
    acreage NUMERIC(10, 2) NOT NULL DEFAULT 1.0,
    soil_type VARCHAR(100) NOT NULL DEFAULT 'Loamy',
    status VARCHAR(50) NOT NULL DEFAULT 'Healthy',
    risk_level VARCHAR(50) NOT NULL DEFAULT 'Low',
    location VARCHAR(255) DEFAULT 'Field Block Main',
    health_score NUMERIC(5, 2) DEFAULT 85.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Advisories Table
CREATE TABLE IF NOT EXISTS advisories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    field_id UUID REFERENCES fields(id) ON DELETE SET NULL,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Open',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Messages Table
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    advisory_id UUID NOT NULL REFERENCES advisories(id) ON DELETE CASCADE,
    sender_type VARCHAR(50) NOT NULL CHECK (sender_type IN ('farmer', 'agent', 'ai')),
    content TEXT NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. AI Analyses Table
CREATE TABLE IF NOT EXISTS ai_analyses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    advisory_id UUID NOT NULL REFERENCES advisories(id) ON DELETE CASCADE,
    message_id UUID REFERENCES messages(id) ON DELETE SET NULL,
    category VARCHAR(100) NOT NULL,
    diagnosis VARCHAR(255) NOT NULL,
    confidence_score NUMERIC(5, 2) NOT NULL DEFAULT 0.85,
    severity VARCHAR(50) NOT NULL,
    priority VARCHAR(50) NOT NULL,
    risk_level VARCHAR(50) NOT NULL,
    summary TEXT NOT NULL,
    organic_remedy TEXT NOT NULL,
    chemical_remedy TEXT NOT NULL,
    recommended_action TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Insights Table
CREATE TABLE IF NOT EXISTS insights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    insight_type VARCHAR(100) NOT NULL,
    severity VARCHAR(50) NOT NULL DEFAULT 'Medium',
    recommended_action TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_fields_user_id ON fields(user_id);
CREATE INDEX IF NOT EXISTS idx_advisories_user_id ON advisories(user_id);
CREATE INDEX IF NOT EXISTS idx_advisories_field_id ON advisories(field_id);
CREATE INDEX IF NOT EXISTS idx_messages_advisory_id ON messages(advisory_id);
CREATE INDEX IF NOT EXISTS idx_ai_analyses_advisory_id ON ai_analyses(advisory_id);
CREATE INDEX IF NOT EXISTS idx_insights_user_id ON insights(user_id);
