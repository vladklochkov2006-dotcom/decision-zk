
import React, { useState, useEffect } from 'react';
import { X, ExternalLink, Copy, Check, CheckCircle, RefreshCw, Loader2 } from 'lucide-react';
import { supabase } from './supabaseClient';
import './TransactionHistoryModal.css';

export interface TransactionRecord {
    id: string; // was txId in localStorage
    status: string;
    method: string;
    created_at: string;
}

interface TransactionHistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    pendingItems?: TransactionRecord[];
}

export const TransactionHistoryModal: React.FC<TransactionHistoryModalProps> = ({ isOpen, onClose, pendingItems = [] }) => {
    const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Initial Fetch
    const fetchTransactions = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('transactions')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching transactions:', error);
        } else {
            const fetched = data || [];
            const now = Date.now();
            const STALE_TIMEOUT = 10 * 60 * 1000; // 10 minutes

            // Identification of stale transactions
            const staleTransactions = fetched.filter(tx =>
                (tx.status === 'Pending' || tx.status === 'Processing...') &&
                (now - new Date(tx.created_at).getTime() > STALE_TIMEOUT)
            );

            if (staleTransactions.length > 0) {
                // Batch update stale transactions to 'Failed'
                // console.log(`Found ${staleTransactions.length} stale transactions. Expiring them...`);

                const staleIds = staleTransactions.map(t => t.id);

                // Update local state first for immediate feedback
                const updatedData = fetched.map(tx =>
                    staleIds.includes(tx.id) ? { ...tx, status: 'Failed' } : tx
                );
                setTransactions(updatedData);

                // Update Supabase in background
                await supabase
                    .from('transactions')
                    .update({ status: 'Failed' })
                    .in('id', staleIds);
            } else {
                setTransactions(fetched);
            }
        }
        setIsLoading(false);
    };

    useEffect(() => {
        if (isOpen) {
            fetchTransactions();

            // Subscribe to realtime changes
            const channel = supabase
                .channel('schema-db-changes')
                .on(
                    'postgres_changes',
                    {
                        event: '*', // Listen to INSERT and UPDATE
                        schema: 'public',
                        table: 'transactions',
                    },
                    (payload) => {
                        // console.log('Realtime update:', payload);
                        // Optimistically update or refetch
                        // For simplicity and accuracy, let's refetch (or manually merge)
                        if (payload.eventType === 'INSERT') {
                            setTransactions((prev) => [payload.new as TransactionRecord, ...prev]);
                        } else if (payload.eventType === 'UPDATE') {
                            setTransactions((prev) =>
                                prev.map((tx) =>
                                    tx.id === (payload.new as TransactionRecord).id ? (payload.new as TransactionRecord) : tx
                                )
                            );
                        }
                    }
                )
                .subscribe();

            return () => {
                supabase.removeChannel(channel);
            };
        }
    }, [isOpen]);

    // List ALL transactions (pending + DB)
    const displayTransactions = React.useMemo(() => {
        const dbMap = new Map(transactions.map(t => [t.id, t]));

        // Create a merged list
        const merged = [...transactions];

        pendingItems.forEach(p => {
            const dbItem = dbMap.get(p.id);
            const pStatus = p.status?.toLowerCase();
            const dbStatus = dbItem?.status?.toLowerCase();

            if (!dbItem) {
                // Not in DB yet, show as-is (usually Pending)
                merged.push(p);
            } else if (pStatus === 'success' && dbStatus === 'pending') {
                // Demo Mode: Local state reached Success before DB, override for UI!
                const index = merged.findIndex(m => m.id === p.id);
                if (index !== -1) {
                    // console.log(`[Demo Mode] UI Override: Local Success for ${p.id}`);
                    merged[index] = { ...dbItem, status: 'Success' };
                }
            }
        });

        // Sort by time (newest first)
        return merged.sort((a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
    }, [transactions, pendingItems]);

    const handleCopy = (id: string) => {
        navigator.clipboard.writeText(id);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const formatTxId = (id: string) => {
        if (!id) return '';
        if (id.length < 10) return id;
        return `${id.slice(0, 6)}...${id.slice(-4)}`;
    };

    const formatTime = (isoString: string) => {
        return new Date(isoString).toLocaleString();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content history-modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>📜 Transaction History</h2>
                    <div className="header-actions">
                        <button
                            className={`refresh-btn ${isLoading ? 'spinning' : ''}`}
                            onClick={fetchTransactions}
                            disabled={isLoading}
                            title="Refresh Data"
                        >
                            <RefreshCw size={18} />
                        </button>
                        <button className="close-btn" onClick={onClose}>
                            <X size={24} />
                        </button>
                    </div>
                </div>

                <div className="modal-body">
                    {displayTransactions.length === 0 ? (
                        <div className="empty-state">
                            <p>No confirmed transactions found yet.</p>
                            <span className="wait-text">Transactions will appear here in 1-2 minutes.</span>
                        </div>
                    ) : (
                        <table className="tx-table">
                            <thead>
                                <tr>
                                    <th>Tx Hash</th>
                                    <th>Method</th>
                                    <th>Time</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {displayTransactions.map((tx) => (
                                    <tr key={tx.id} className={pendingItems.some(p => p.id === tx.id) ? 'pending-row' : ''}>
                                        <td>
                                            <div className="tx-hash-cell">
                                                <span className="hash-text">{formatTxId(tx.id)}</span>
                                                <button onClick={() => handleCopy(tx.id)} className="copy-icon-btn">
                                                    {copiedId === tx.id ? <Check size={14} color="#4cd964" /> : <Copy size={14} />}
                                                </button>
                                            </div>
                                        </td>
                                        <td>{tx.method}</td>
                                        <td className="time-cell">{formatTime(tx.created_at)}</td>
                                        <td>
                                            <span className={`status-badge ${tx.status ? tx.status.toLowerCase() : 'unknown'}`}>
                                                {tx.status === 'Pending' || tx.status === 'Processing...' ? <Loader2 className="spin-icon" size={12} /> :
                                                    tx.status === 'Success' || tx.status === 'Settled' || tx.status === 'Finalized' ? <CheckCircle size={12} /> :
                                                        tx.status === 'Failed' ? <X size={12} /> : null}
                                                {tx.status}
                                            </span>
                                        </td>
                                        <td>
                                            {(tx.status === 'Success' || tx.status === 'Settled' || tx.status === 'Finalized') ? (
                                                <a
                                                    href={`https://testnet.explorer.provable.com/transaction/${tx.id}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="explorer-link"
                                                >
                                                    View <ExternalLink size={12} />
                                                </a>
                                            ) : tx.status === 'Failed' ? (
                                                <span className="wait-text" style={{ color: '#ff4444' }}>Failed</span>
                                            ) : (
                                                <span className="wait-text">Processing...</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};
