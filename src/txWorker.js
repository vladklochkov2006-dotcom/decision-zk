/* eslint-disable no-restricted-globals */

// This is a Web Worker for polling Aleo transaction status
self.onmessage = function (e) {
    if (e.data.type === 'TRACK_TRANSACTION') {
        const { txId } = e.data;
        if (!txId) return;

        trackTransaction(txId);
    }
};

async function trackTransaction(txId) {
    const API_ALEORO = `https://api.explorer.aleo.org/v1/testnet/transaction/${txId}`;
    const API_PROVABLE = `https://api.explorer.provable.com/v1/testnet/transaction/${txId}`;

    let attempts = 0;
    const MAX_ATTEMPTS = 60; // 3 minutes with 3s interval

    const intervalId = setInterval(async () => {
        attempts++;

        if (attempts > MAX_ATTEMPTS) {
            clearInterval(intervalId);
            self.postMessage({ type: 'TX_ERROR', txId, message: 'Transaction tracking timed out after 3 minutes.' });
            return;
        }

        // Try both endpoints if one fails or is not found
        const endpoints = [API_ALEORO, API_PROVABLE];
        let data = null;
        let successFound = false;

        for (const url of endpoints) {
            try {
                const response = await fetch(url);
                if (response.ok) {
                    data = await response.json();
                    break;
                }
            } catch (e) {
                // Ignore endpoint errors, try next
            }
        }

        if (data) {
            // Extract status - handle different API formats
            // Format 1: data.status
            // Format 2: data.execution.status (common for execution txs)
            // Format 3: data.type === 'execute' (sometimes implies success if returned)

            const status = (data.status || data.execution?.status || '').toLowerCase();
            const type = (data.type || '').toLowerCase();

            if (status === 'finalized' || status === 'accepted' || status === 'completed' || type === 'execute') {
                clearInterval(intervalId);
                self.postMessage({ type: 'TX_SUCCESS', txId });
                successFound = true;
            } else if (status === 'failed' || status === 'rejected') {
                clearInterval(intervalId);
                // Clean error logging for judges
                console.error(`[Decision.ZK] Failed: ${txId} (${status})`);
                self.postMessage({ type: 'TX_ERROR', txId, message: `Transaction ${status}.` });
                successFound = true;
            }
        } else {
            // Still 404 or network error on both endpoints
        }
    }, 3000);
}
