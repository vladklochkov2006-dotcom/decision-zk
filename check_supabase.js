import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    console.log("Checking Supabase 'transactions' table...");
    const { data, error, count } = await supabase
        .from('transactions')
        .select('*', { count: 'exact' });

    if (error) {
        console.error("Error:", error);
    } else {
        console.log(`Found ${data.length} records in Supabase.`);
        console.log("Sample IDs:", data.slice(0, 3).map(d => d.id));
    }
}

check();
