import React, { useState } from 'react';
import {
    Wallet,
    Globe,
    Moon,
    Bell,
    Shield,
    ExternalLink,
    Copy,
    Check,
    Zap,
    ShieldCheck,
    Eye,
    Lock
} from 'lucide-react';
import { useWallet } from "@demox-labs/aleo-wallet-adapter-react";
import './Settings.css';

interface SettingsProps {
    publicBalance?: number;
    privateBalance?: number;
    theme?: 'dark' | 'neon';
    onThemeChange?: (theme: 'dark' | 'neon') => void;
}

export const Settings: React.FC<SettingsProps> = ({
    publicBalance = 5.77,
    privateBalance = 0.00,
    theme = 'dark',
    onThemeChange
}) => {
    const { publicKey, wallet } = useWallet();
    const [isCopied, setIsCopied] = useState(false);

    // Simulated settings state
    const [notifications, setNotifications] = useState({
        proposals: true,
        deadlines: true,
        updates: true
    });

    const [selectedLanguage, setSelectedLanguage] = useState('English (US)');
    const address = publicKey || "aleo1y06snde...z2hvxqyluw5m";

    const handleCopy = () => {
        navigator.clipboard.writeText(address);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const toggleNotification = (key: keyof typeof notifications) => {
        setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="settings-container">
            <header className="settings-header">
                <h1>Settings</h1>
                <p>Manage your ZK-identity, preferences and security protocols.</p>
            </header>

            <div className="settings-grid">
                {/* 1. WALLET SECTION */}
                <section className="settings-section">
                    <div className="section-title">
                        <Wallet size={18} />
                        <span>ZK-Account</span>
                    </div>
                    <div className="settings-card wallet-card">
                        <div className="card-row">
                            <div className="row-label">Address</div>
                            <div className="address-box">
                                <code>{address}</code>
                                <button className="icon-action-btn" onClick={handleCopy}>
                                    {isCopied ? <Check size={14} color="#00FF88" /> : <Copy size={14} />}
                                </button>
                            </div>
                        </div>
                        <div className="card-grid">
                            <div className="mini-stat">
                                <span className="label">Balance</span>
                                <span className="value">{(publicBalance + privateBalance).toFixed(2)} ALEO</span>
                                <span className="sub">Public: {publicBalance.toFixed(2)} | Private: {privateBalance.toFixed(2)}</span>
                            </div>
                            <div className="mini-stat">
                                <span className="label">Network</span>
                                <div className="status-tag">
                                    <div className="status-dot"></div>
                                    <span>Testnet</span>
                                </div>
                            </div>
                            <div className="mini-stat">
                                <span className="label">Wallet Type</span>
                                <span className="value">{wallet?.adapter.name || 'Leo Wallet'}</span>
                            </div>
                        </div>
                        <div className="card-actions">
                            <a
                                href={`https://testnet.explorer.provable.com/address/${address}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="settings-link-btn"
                            >
                                <span>View on Explorer</span>
                                <ExternalLink size={14} />
                            </a>
                        </div>
                    </div>
                </section>

                {/* 2. PREFERENCES SECTION */}
                <section className="settings-section">
                    <div className="section-title">
                        <Globe size={18} />
                        <span>System Preferences</span>
                    </div>
                    <div className="settings-card">
                        <div className="card-row flex-row">
                            <div className="row-info">
                                <div className="info-title">Interface Language</div>
                                <div className="info-desc">Choose your preferred language</div>
                            </div>
                            <div className="language-toggle">
                                <button
                                    className={`lang-btn ${selectedLanguage === 'English (US)' ? 'active' : ''}`}
                                    onClick={() => setSelectedLanguage('English (US)')}
                                >
                                    English (US)
                                </button>
                                <button
                                    className={`lang-btn ${selectedLanguage === 'Ukrainian (UA)' ? 'active' : ''}`}
                                    onClick={() => setSelectedLanguage('Ukrainian (UA)')}
                                >
                                    Ukrainian (UA)
                                </button>
                            </div>
                        </div>
                        <div className="card-row flex-row">
                            <div className="row-info">
                                <div className="info-title">Visual Protocol</div>
                                <div className="info-desc">Select interface theme</div>
                            </div>
                            <div className="theme-toggle-mock">
                                <button
                                    className={`theme-btn ${theme === 'dark' ? 'active' : ''}`}
                                    onClick={() => onThemeChange?.('dark')}
                                >
                                    <Moon size={14} /> Dark
                                </button>
                                <button
                                    className={`theme-btn ${theme === 'neon' ? 'active' : ''}`}
                                    onClick={() => onThemeChange?.('neon')}
                                >
                                    <Zap size={14} /> Neon
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 3. NOTIFICATIONS SECTION */}
                <section className="settings-section">
                    <div className="section-title">
                        <Bell size={18} />
                        <span>Alert Protocols</span>
                    </div>
                    <div className="settings-card">
                        <div className="card-row flex-row">
                            <div className="row-info">
                                <div className="info-title">Proposal Resolution</div>
                                <div className="info-desc">Notify when proposals you voted on resolve</div>
                            </div>
                            <button
                                className={`toggle-switch ${notifications.proposals ? 'on' : ''}`}
                                onClick={() => toggleNotification('proposals')}
                            >
                                <div className="switch-handle"></div>
                            </button>
                        </div>
                        <div className="card-row flex-row">
                            <div className="row-info">
                                <div className="info-title">Voting Deadlines</div>
                                <div className="info-desc">Notify when proposals you participated in are about to close (1h remaining)</div>
                            </div>
                            <button
                                className={`toggle-switch ${notifications.deadlines ? 'on' : ''}`}
                                onClick={() => toggleNotification('deadlines')}
                            >
                                <div className="switch-handle"></div>
                            </button>
                        </div>
                        <div className="card-row flex-row">
                            <div className="row-info">
                                <div className="info-title">New Proposals</div>
                                <div className="info-desc">Alert when high-reputation proposals are created</div>
                            </div>
                            <button
                                className={`toggle-switch ${notifications.updates ? 'on' : ''}`}
                                onClick={() => toggleNotification('updates')}
                            >
                                <div className="switch-handle"></div>
                            </button>
                        </div>
                    </div>
                </section>

                {/* 4. PRIVACY SECTION */}
                <section className="settings-section">
                    <div className="section-title">
                        <Shield size={18} />
                        <span>Privacy & Security</span>
                    </div>
                    <div className="settings-card privacy-card">
                        <div className="privacy-header">
                            <ShieldCheck size={24} color="#00FF88" />
                            <span>Zero-Knowledge Privacy Enabled</span>
                        </div>
                        <p className="privacy-desc">
                            Your private votes and identity are cryptographically shielded.
                            Specific private states are processed through Varuna (zk-SNARK) proofs,
                            ensuring mathematical verification without data disclosure.
                        </p>
                        <div className="privacy-features">
                            <div className="feature">
                                <Eye size={14} />
                                <span>Stealth Mode Active</span>
                            </div>
                            <div className="feature">
                                <Lock size={14} />
                                <span>zk-SNARK Verifier Online</span>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};
