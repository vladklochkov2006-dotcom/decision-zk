import { CheckCircle, X } from 'lucide-react';
import './TransactionSuccess.css';

interface TransactionSuccessProps {
    txId: string;
    isClosing?: boolean;
    onClose: () => void;
    onViewHistory: () => void;
}

export const TransactionSuccess: React.FC<TransactionSuccessProps> = ({ onClose, isClosing }) => {
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
                        <h3>Transaction Confirmed</h3>
                        <p>Your transaction has been successfully processed by the wallet.</p>
                    </div>
                </div>

                {/* Technical button removed per request */}
            </div>
        </div>
    );
};
