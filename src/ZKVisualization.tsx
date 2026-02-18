import { useState } from 'react';
import { Eye, EyeOff, ArrowRight, Shield } from 'lucide-react';

export const ZKVisualization = () => {
    const [isShielded, setIsShielded] = useState(false);

    const generateFakeHash = () => {
        const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let hash = 'at1v';
        for (let i = 0; i < 60; i++) {
            hash += chars[Math.floor(Math.random() * chars.length)];
        }
        return hash.substring(0, 64);
    };

    const [hash] = useState(generateFakeHash());

    return (
        <section className="zk-viz-section">
            <div className="zk-viz-container">
                <h2 className="zk-viz-title">See ZK-Proofs in Action</h2>
                <p className="zk-viz-subtitle">
                    Watch how your vote transforms into an encrypted proof
                </p>

                <div className="zk-cards-wrapper">
                    <div className="zk-card zk-card-left">
                        <div className="zk-card-header">
                            <Eye size={20} color="#10B981" />
                            <span>Your Choice</span>
                        </div>
                        <div className="zk-card-body">
                            <div className={`vote-choice ${isShielded ? 'hidden' : 'visible'}`}>
                                <div className="vote-option selected">
                                    <div className="vote-radio"></div>
                                    <span>✓ Support Proposal</span>
                                </div>
                            </div>
                            {isShielded && (
                                <div className="shielded-message">
                                    <EyeOff size={24} color="#10B981" />
                                    <p>Hidden from public</p>
                                </div>
                            )}
                        </div>
                        <div className="zk-card-footer">
                            Visible only to you
                        </div>
                    </div>

                    <div className="zk-arrow">
                        <ArrowRight size={32} color="#F59E0B" />
                    </div>

                    <div className="zk-card zk-card-right">
                        <div className="zk-card-header">
                            <Shield size={20} color="#F59E0B" />
                            <span>Encrypted Record</span>
                        </div>
                        <div className="zk-card-body">
                            <div className={`encrypted-hash ${isShielded ? 'visible' : 'hidden'}`}>
                                <code>{hash}</code>
                            </div>
                            {!isShielded && (
                                <div className="placeholder-message">
                                    <p>Click "Shield My Vote" to encrypt</p>
                                </div>
                            )}
                        </div>
                        <div className="zk-card-footer">
                            Visible on-chain
                        </div>
                    </div>
                </div>

                <button
                    className="shield-button"
                    onClick={() => setIsShielded(!isShielded)}
                >
                    {isShielded ? 'Reset' : 'Shield My Vote'}
                </button>

                <div className="zk-explanation">
                    <div className="explanation-badge">
                        <span>🔒</span>
                        Your choice is converted into a <strong>SNARK Proof</strong> locally
                    </div>
                    <p>
                        The blockchain only sees the encrypted proof, never your actual vote.
                        This is how Decision.ZK achieves true privacy.
                    </p>
                </div>
            </div>
        </section>
    );
};
