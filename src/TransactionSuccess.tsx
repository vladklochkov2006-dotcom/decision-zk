import React from 'react';
import { CheckCircle, X, Terminal } from 'lucide-react';
import './TransactionSuccess.css';

interface TransactionSuccessProps {
    txId: string;
    isClosing?: boolean;
    onClose: () => void;
    onViewHistory: () => void;
}

export const TransactionSuccess: React.FC<TransactionSuccessProps> = ({ onClose, onViewHistory, isClosing }) => {
    return (
        <div className={`tx-success-container ${isClosing ? 'closing' : ''}`}>
            <div className="tx-success-card basic-toast">
                <button className="close-btn" onClick={onClose}>
                    <X size={18} />
                </button>

                <div className="success-row">
                    <div className="success-icon-wrapper">
                        <CheckCircle size={24} color="#00FF88" />
                    </div>
                    <div className="header-text">
                        <h3>Vote Successfully Broadcasted</h3>
                        <p>Your choices are now secured via ZK-Proof.</p>
                    </div>
                </div>

                <button className="view-history-btn" onClick={onViewHistory}>
                    <Terminal size={14} /> View in System Logs
                </button>
            </div>
        </div>
    );
};
