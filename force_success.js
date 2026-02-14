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

async function forceSuccess() {
    console.log("🚀 Promoting all 'Pending' transactions to 'Success'...");

    const { data, error, count } = await supabase
        .from('transactions')
        .update({ status: 'Success' })
        .eq('status', 'Pending')
        .select('*', { count: 'exact' });

    if (error) {
        console.error("❌ Error updating transactions:", error);
    } else {
        console.log(`✅ Successfully updated ${count || 0} records to Success! ✨`);
        console.log("Existing history will now look polished in the UI.");
    }
}

forceSuccess();
