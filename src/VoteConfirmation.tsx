import React, { useState } from 'react';
import { Lock, Eye, EyeOff, Check } from 'lucide-react';
import './VoteConfirmation.css';

interface VoteConfirmationProps {
    choice: string;
    txId?: string;
    onRetry?: () => void;
}

export const VoteConfirmation: React.FC<VoteConfirmationProps> = ({ choice, txId, onRetry }) => {
    const [showProof, setShowProof] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        if (txId) {
            navigator.clipboard.writeText(txId);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="vote-confirmation-card">
            <div className="vote-conf-header">
                <div className="vote-lock-badge">
                    <Lock size={18} />
                </div>
                <div className="vote-conf-title">
                    <h3>Vote Encrypted!</h3>
                    <p>Your vote is private and verifiable</p>
                </div>
            </div>

            <div className="vote-conf-details">
                {/* Choice Row */}
                <div className="vote-conf-row">
                    <span className="conf-label">Your Choice:</span>
                    <div className="conf-value-bar">
                        <span className="conf-choice-text">{choice}</span>
                        <div className="conf-bar-fill"></div>
                        <div className="conf-bar-fill"></div>
                        <div className="conf-bar-fill"></div>
                        <div className="conf-bar-fill"></div>
                        <div className="conf-bar-fill"></div>
                        <div className="conf-bar-fill"></div>
                    </div>
                </div>

                {/* Proof Toggle Row */}
                {txId && txId.startsWith("at1") && (
                    <div className="vote-conf-row">
                        <span className="conf-label">ZK-Proof:</span>
                        <button
                            className="proof-toggle-btn"
                            onClick={() => setShowProof(!showProof)}
                        >
                            {showProof ? (
                                <><EyeOff size={14} /> Hide Proof</>
                            ) : (
                                <><Eye size={14} /> Show Proof</>
                            )}
                        </button>
                    </div>
                )}

                {/* Proof Display Box */}
                {showProof && txId && txId.startsWith("at1") && (
                    <div className="proof-display-box" onClick={handleCopy} title="Click to copy">
                        <code className="proof-hash-text">
                            {txId}
                        </code>

                        {copied && (
                            <div className="copy-feedback">
                                <Check size={12} /> Copied!
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Action Button */}
            <div className="conf-actions-centered">
                <button className="try-again-btn-refined" onClick={onRetry} disabled={!onRetry}>
                    Try Again
                </button>
            </div>
        </div>
    );
};
