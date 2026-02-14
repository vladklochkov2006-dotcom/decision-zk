-- 1. Create the Transactions Table
CREATE TABLE IF NOT EXISTS public.transactions (
    id TEXT PRIMARY KEY,                       -- Transaction ID or UUID
    status TEXT NOT NULL,                      -- 'Pending', 'Success', 'Failed'
    method TEXT NOT NULL,                      -- e.g., 'Vote Private'
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- 3. Create OPEN Policies for Hackathon (Public Read/Write)
-- Allow anyone to read transactions (for history)
CREATE POLICY "Enable read access for all users" 
ON public.transactions FOR SELECT 
USING (true);

-- Allow anyone to insert new transactions (from frontend)
CREATE POLICY "Enable insert for all users" 
ON public.transactions FOR INSERT 
WITH CHECK (true);

-- Allow anyone to update transactions (e.g., status changes)
CREATE POLICY "Enable update for all users" 
ON public.transactions FOR UPDATE 
USING (true);

-- 4. Auto-update 'updated_at' column
-- Function to update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to call function before update
CREATE TRIGGER update_transactions_updated_at
    BEFORE UPDATE ON public.transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
