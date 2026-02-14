import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

// 1. Try loading default .env
dotenv.config();

// 2. If variables are missing, try loading .env.local (Vite standard)
if (!process.env.VITE_SUPABASE_URL || !process.env.VITE_SUPABASE_KEY) {
    const localEnvPath = path.resolve(process.cwd(), '.env.local');
    if (fs.existsSync(localEnvPath)) {
        console.log("Loading environment from .env.local...");
        dotenv.config({ path: localEnvPath });
    }
}

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("❌ Missing VITE_SUPABASE_URL or VITE_SUPABASE_KEY in .env");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const ALEO_API_URL = "https://api.explorer.provable.com/v1/testnet/transaction";

async function checkTransactions() {
    console.log(`\n🔄 Checking for pending transactions... [${new Date().toLocaleTimeString()}]`);

    // 1. Get Pending Transactions from Supabase
    const { data: transactions, error } = await supabase
        .from('transactions')
        .select('id')
        .eq('status', 'Pending');

    if (error) {
        console.error("Error fetching transactions:", error.message);
        return;
    }

    if (!transactions || transactions.length === 0) {
        console.log("No pending transactions.");
        return;
    }

    console.log(`Found ${transactions.length} pending transactions.`);

    // 2. Check each transaction
    for (const tx of transactions) {
        const txId = tx.id;
        try {
            // Skip if it's a UUID (locally generated, not yet on chain or needs resolution)
            // The worker focuses on resolving on-chain status.
            // If your app saves UUIDs, this worker might 404 on them until they are resolved to real IDs by the frontend
            // OR you can try to resolve them here if you have a way.
            // For now, assuming we are checking IDs that might be on chain.

            const response = await fetch(`${ALEO_API_URL}/${txId}`);

            if (response.status === 404) {
                process.stdout.write(`.`); // Pending/Not found yet
                continue;
            }

            if (!response.ok) {
                console.warn(`\n⚠️ API Error for ${txId}: ${response.statusText}`);
                continue;
            }

            const data = await response.json();

            // Check status in the response
            // Structure depends on API, usually 'status': 'accepted' or 'finalized'
            // Adjust property access based on actual API response structure
            // Common Aleo Explorer response: { "status": "accepted", ... } or { "type": "execute", "status": "..." }

            const status = data.status;
            // Also check explicit "Accepted" or "Finalized"

            if (status === 'accepted' || status === 'finalized' || data.type === 'execute') {
                console.log(`\n✅ Transaction ${txId} confirmed! Status: ${status}`);

                // 3. Update Supabase
                const { error: updateError } = await supabase
                    .from('transactions')
                    .update({ status: 'Success', updated_at: new Date().toISOString() })
                    .eq('id', txId);

                if (updateError) {
                    console.error(`Failed to update ${txId}:`, updateError.message);
                } else {
                    console.log(`Database updated for ${txId}`);
                }
            } else {
                // Still processing or other status
                process.stdout.write(`.`);
            }

        } catch (e) {
            console.error(`\nError checking ${txId}:`, e.message);
        }
    }
}

// Run immediately then interval
checkTransactions();
setInterval(checkTransactions, 15000); // 15 seconds
