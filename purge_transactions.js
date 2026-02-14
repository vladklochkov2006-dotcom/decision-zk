import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials in .env");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function purge() {
    console.log("🚀 Starting Nuclear Purge of 'transactions' table...");

    // Use a filter that catches everything (created before year 2100)
    const { data, error, count } = await supabase
        .from('transactions')
        .delete({ count: 'exact' })
        .lt('created_at', '2100-01-01T00:00:00Z');

    if (error) {
        console.error("❌ Error purging transactions:", error);
        console.log("Tip: Check if RLS (Row Level Security) is blocking deletes for the 'anon' role.");
    } else {
        console.log(`✅ Successfully cleared ${count || 0} transaction records! 🧼`);
        console.log("Please refresh your browser (F5) to see the empty history.");
    }
}

purge();
