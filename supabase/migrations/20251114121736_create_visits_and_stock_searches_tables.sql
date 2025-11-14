/*
  # Create visits and stock searches tables

  1. New Tables
    - `visits`
      - `id` (uuid, primary key, auto-generated)
      - `created_at` (timestamp with time zone, default now())
      - `page` (text, default 'home')
    
    - `stock_searches`
      - `id` (uuid, primary key, auto-generated)
      - `created_at` (timestamp with time zone, default now())
      - `stock_code` (text, user input stock symbol)
      - `session_id` (text, unique session identifier)
  
  2. Performance
    - Add indexes on created_at columns for efficient date-based queries
  
  3. Security
    - Enable RLS on both tables
    - Allow anonymous users to INSERT into both tables
    - Allow anonymous users to SELECT from visits table (for statistics)
    - Deny SELECT on stock_searches table (privacy protection)
*/

-- Create visits table
CREATE TABLE IF NOT EXISTS visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  page TEXT DEFAULT 'home'
);

-- Create stock_searches table
CREATE TABLE IF NOT EXISTS stock_searches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  stock_code TEXT NOT NULL,
  session_id TEXT NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_visits_created_at ON visits(created_at);
CREATE INDEX IF NOT EXISTS idx_stock_searches_created_at ON stock_searches(created_at);

-- Enable Row Level Security
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_searches ENABLE ROW LEVEL SECURITY;

-- Create policy for visits: allow anonymous insert
CREATE POLICY "Allow anonymous insert visits" ON visits
  FOR INSERT TO anon WITH CHECK (true);

-- Create policy for visits: allow anonymous select (for statistics)
CREATE POLICY "Allow anonymous select visits" ON visits
  FOR SELECT TO anon USING (true);

-- Create policy for stock_searches: allow anonymous insert
CREATE POLICY "Allow anonymous insert stock_searches" ON stock_searches
  FOR INSERT TO anon WITH CHECK (true);