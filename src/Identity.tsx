import { useState } from "react";
import { Shield, Smartphone, Globe, Download, Share2, Copy, Check, Loader2, QrCode, X } from "lucide-react";
import { useWallet } from "@demox-labs/aleo-wallet-adapter-react";
import { PrivacySensitive } from "./contexts/PrivacyContext";
import "./App.css";

export const Identity = ({ stats }: { stats?: any }) => {
    const { publicKey } = useWallet();
    const [isProving, setIsProving] = useState(false);
    const [proofStatus, setProofStatus] = useState<'none' | 'generating' | 'sent' | 'verified'>('none');
    const [showQR, setShowQR] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    const address = publicKey || "aleo1y06snde...z2hvxqyluw5m";
    const truncatedAddress = publicKey ? `${publicKey.slice(0, 6)}...${publicKey.slice(-4)}` : "aleo1...9x5a";

    const displayStats = stats || { rep: 92.4, age: "42d", proposals: 5, votingPower: "4.5x" };

    const handleCopy = () => {
        navigator.clipboard.writeText(address);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const handleProveIdentity = () => {
        setProofStatus('generating');
        setIsProving(true);

        setTimeout(() => {
            setProofStatus('sent');
            setTimeout(() => {
                setProofStatus('verified');
                setIsProving(false);
                // In a real app, this would trigger an on-chain update
            }, 2000);
        }, 3000);
    };

    return (
        <div className="identity-container">
            <header className="terminal-header">
                <div>
                    <h1>ZK Identity</h1>
                    <p>Manage your decentralized identity and reputation</p>
                </div>
            </header>

            <div className="identity-grid">
                <div className="identity-card main-card">
                    <div className="id-header">
                        <div className="id-avatar-wrapper">
                            <div className="id-avatar pulse-avatar">
                                <Shield size={40} color="#10B981" />
                            </div>
                            <div className="id-shield-status">
                                <Check size={10} /> Active Shield
                            </div>
                        </div>
                        <div className="id-info">
                            <h3>Anonymous User</h3>
                            <div className="id-shield-label">Identity Shield: Active</div>
                            <div className="id-address" onClick={handleCopy}>
                                <PrivacySensitive>
                                    <span>{truncatedAddress}</span>
                                </PrivacySensitive>
                                {isCopied ? <Check size={14} color="#00FF88" className="copy-icon" /> : <Copy size={14} className="copy-icon" />}
                            </div>
                        </div>
                        <div className="id-badge">
                            <Shield size={14} /> Verified
                        </div>
                    </div>

                    <div className="id-stats">
                        <div className="id-stat-box">
                            <span className="label">ZK-REP</span>
                            <PrivacySensitive>
                                <span className="value">{displayStats.rep}</span>
                            </PrivacySensitive>
                        </div>
                        <div className="id-stat-box highlight">
                            <span className="label">Voting Power</span>
                            <PrivacySensitive>
                                <span className="value">{displayStats.votingPower}</span>
                            </PrivacySensitive>
                        </div>
                        <div className="id-stat-box">
                            <span className="label">Delegated To You</span>
                            <PrivacySensitive>
                                <span className="value">12.5</span>
                            </PrivacySensitive>
                        </div>
                    </div>

                    <div className="id-explanation">
                        <p>
                            Your voting weight is calculated <strong>anonymously</strong> based on your Credentials.
                            More verified factors = greater influence on decisions without revealing PII.
                        </p>
                    </div>
                </div>

                <div className="identity-card credentials-card">
                    <div className="card-header-flex">
                        <h3>Credentials</h3>
                        <button
                            className={`prove-btn ${proofStatus === 'verified' ? 'success' : ''}`}
                            onClick={handleProveIdentity}
                            disabled={isProving || proofStatus === 'verified'}
                        >
                            {proofStatus === 'generating' ? (
                                <><Loader2 size={14} className="spin" /> Generating ZK...</>
                            ) : proofStatus === 'sent' ? (
                                <><Check size={14} /> Proof Sent</>
                            ) : proofStatus === 'verified' ? (
                                <><Check size={14} /> Identity Verified</>
                            ) : (
                                "Prove Identity"
                            )}
                        </button>
                    </div>

                    <div className="credential-item">
                        <div className="cred-icon pulse-icon"><Smartphone size={20} /></div>
                        <div className="cred-info">
                            <h4>Humanity Verified</h4>
                            <p>Verified via ZK-Proof • No PII shared</p>
                        </div>
                        <div className="cred-status active">Active</div>
                    </div>

                    <div className="credential-item">
                        <div className="cred-icon pulse-icon"><Globe size={20} /></div>
                        <div className="cred-info">
                            <h4>Social Graph</h4>
                            <p>Verified via ZK-Proof • No PII shared</p>
                        </div>
                        <div className="cred-status active">Active</div>
                    </div>
                </div>

                <div className="identity-actions">
                    <button className="btn-action">
                        <Download size={18} /> Export Data
                    </button>
                    <button className="btn-action highlight" onClick={() => setShowQR(true)}>
                        <Share2 size={18} /> Share Anonymous Proof
                    </button>
                </div>
            </div>

            {/* QR Code Modal for Selective Disclosure */}
            {showQR && (
                <div className="qr-overlay" onClick={() => setShowQR(false)}>
                    <div className="qr-modal" onClick={e => e.stopPropagation()}>
                        <button className="close-qr" onClick={() => setShowQR(false)}><X size={20} /></button>
                        <div className="qr-header">
                            <QrCode size={48} color="#10B981" />
                            <h3>Selective Disclosure</h3>
                        </div>
                        <p>
                            This is a one-time cryptographic proof of your <strong>Humanity</strong>.
                            Scan to verify real-person status without revealing wallet or profile data.
                        </p>
                        <div className="qr-placeholder">
                            <div className="qr-inner">
                                {/* Synthetic QR code lines */}
                                {[...Array(8)].map((_, i) => (
                                    <div key={i} className="qr-line" style={{ width: `${Math.random() * 100}%` }}></div>
                                ))}
                            </div>
                        </div>
                        <div className="qr-footer">
                            Expires in 5:00
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
