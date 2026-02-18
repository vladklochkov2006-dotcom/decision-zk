
import React, { useState, useEffect } from 'react';
import { X, Copy, Check, CheckCircle, RefreshCw, Loader2 } from 'lucide-react';
import './TransactionHistoryModal.css';


export interface TransactionRecord {
    id: string;
    status: string;
    method: string;
    created_at: string;
    address?: string; // New: owner address
    programId?: string; // New: program name
    type?: string; // New: action type
}

interface TransactionHistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    pendingItems?: TransactionRecord[];
    walletAddress: string | null;
}

export const TransactionHistoryModal: React.FC<TransactionHistoryModalProps> = ({
    isOpen, onClose, pendingItems = [], walletAddress
}) => {
    const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Initial Fetch
    const fetchTransactions = async () => {
        if (!walletAddress) {
            setTransactions([]);
            return;
        }

        setIsLoading(true);

        // Fetch from LocalStorage (scoped by address)
        const localKey = `tx_history_${walletAddress}`;
        const localData = JSON.parse(localStorage.getItem(localKey) || '[]');

        const now = Date.now();
        const STALE_TIMEOUT = 10 * 60 * 1000; // 10 minutes

        // Expire stale items
        const updatedData = localData.map((tx: any) => {
            const isPending = tx.status === 'Pending' || tx.status === 'Processing...';
            const isStale = (now - new Date(tx.created_at).getTime() > STALE_TIMEOUT);
            if (isPending && isStale) {
                return { ...tx, status: 'Failed' };
            }
            return tx;
        });

        // Filter out irrelevant programs (safety check for local data)
        const finalData = updatedData.filter((tx: any) => tx.programId === 'private_decision_v5.aleo');

        setTransactions(finalData);
        setIsLoading(false);
    };



    useEffect(() => {
        if (isOpen) {
            fetchTransactions();
        }
    }, [isOpen, walletAddress]);

    // Reset on wallet change
    useEffect(() => {
        setTransactions([]);
    }, [walletAddress]);

    // List ALL transactions (pending + DB + Local)
    const displayTransactions = React.useMemo(() => {
        const pendingMap = new Map(pendingItems.map(p => [p.id, p]));
        const dbIds = new Set(transactions.map(t => t.id));

        // Use DB transactions as base, but override with pending data if it's more "terminal" (Success/Failed)
        const merged = transactions.map(tx => {
            const pending = pendingMap.get(tx.id);
            if (pending && (pending.status === 'Success' || pending.status === 'Failed')) {
                return { ...tx, status: pending.status };
            }
            return tx;
        });

        // Add pending items that aren't in DB yet
        pendingItems.forEach(p => {
            if (!dbIds.has(p.id)) {
                merged.push(p);
            }
        });

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
                            <p>No transactions found for this account.</p>
                            <span className="wait-text">Perform an action to see it here.</span>
                        </div>
                    ) : (
                        <table className="tx-table">
                            <thead>
                                <tr>
                                    <th>Tx Hash</th>
                                    <th>Method</th>
                                    <th>Time</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {displayTransactions.map((tx) => (
                                    <tr key={tx.id} className={tx.status === 'Pending' ? 'pending-row' : ''}>
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
                                                {tx.status === 'Pending' || tx.status === 'Processing...' || tx.status === 'Broadcasted' ? <Loader2 className="spin-icon" size={12} /> :
                                                    tx.status === 'Success' || tx.status === 'Settled' || tx.status === 'Finalized' ? <CheckCircle size={12} /> :
                                                        tx.status === 'Failed' ? <X size={12} /> : null}
                                                {tx.status}
                                            </span>
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

