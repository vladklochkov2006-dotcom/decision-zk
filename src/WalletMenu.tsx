import React, { useState, useEffect, useRef } from 'react';
import { useWallet } from "@demox-labs/aleo-wallet-adapter-react";
import {
    Settings as SettingsIcon,
    ExternalLink,

    ChevronDown,
    Copy,
    Check,
    Shield,
    RefreshCcw,
    Lock,
    ShieldCheck
} from 'lucide-react';
import './WalletMenu.css';

interface WalletMenuProps {
    onSettingsClick?: () => void;
    externalPublicBalance?: number;
    externalPrivateBalance?: number;
    onExternalShield?: () => void;
}

export const WalletMenu: React.FC<WalletMenuProps> = ({
    onSettingsClick,
    externalPublicBalance,
    externalPrivateBalance,
    onExternalShield
}) => {
    const { publicKey, wallet } = useWallet();
    const [isOpen, setIsOpen] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isShielding, setIsShielding] = useState(false);

    // Simulated state (prioritize external if provided)
    const [localPublicBalance, setLocalPublicBalance] = useState(5.77);
    const [localPrivateBalance, setLocalPrivateBalance] = useState(0.00);

    const publicBalance = externalPublicBalance !== undefined ? externalPublicBalance : localPublicBalance;
    const privateBalance = externalPrivateBalance !== undefined ? externalPrivateBalance : localPrivateBalance;

    const menuRef = useRef<HTMLDivElement>(null);

    const address = publicKey || "";
    const truncatedAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "";

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleCopy = () => {
        navigator.clipboard.writeText(address);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const handleRefresh = () => {
        setIsRefreshing(true);
        setTimeout(() => setIsRefreshing(false), 1500);
    };

    const handleShield = () => {
        if (publicBalance <= 0) return;
        setIsShielding(true);

        if (onExternalShield) {
            onExternalShield();
            setTimeout(() => {
                setIsShielding(false);
            }, 2000);
            return;
        }

        setTimeout(() => {
            setLocalPrivateBalance(prev => prev + 5.00);
            setLocalPublicBalance(prev => Math.max(0, prev - 5.00));
            setIsShielding(false);
        }, 2000);
    };

    if (!address) return null;

    return (
        <div className="wallet-menu-container" ref={menuRef}>
            <button
                className={`wallet-badge-trigger ${isOpen ? 'active' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="online-indicator"></div>
                <span className="addr">{truncatedAddress}</span>
                <div className="sep"></div>
                <span className="bal">{(publicBalance + privateBalance).toFixed(2)} ALEO</span>
                <ChevronDown size={14} className={`arrow ${isOpen ? 'rotated' : ''}`} />
            </button>

            {isOpen && (
                <div className="wallet-premium-dropdown">
                    <div className="dropdown-inner">
                        {/* Header: Brand & Address */}
                        <div className="wallet-header-section">
                            <div className="wallet-brand">
                                <div className="brand-icon-box">
                                    {wallet?.adapter.name === 'Shield Wallet' ? '🛡️' : '🦁'}
                                </div>
                                <div className="brand-meta">
                                    <span className="name">{wallet?.adapter.name || 'Leo Wallet'}</span>
                                    <span className="net">TESTNET</span>
                                </div>
                            </div>
                            <div className="interactive-address" onClick={handleCopy}>
                                <code>{address.slice(0, 8)}...{address.slice(-8)}</code>
                                {isCopied ? <Check size={14} className="copy-success" /> : <Copy size={12} className="copy-icon" />}
                            </div>
                        </div>

                        {/* Balance Panel */}
                        <div className="balance-panel">
                            <div className="panel-header">
                                <span className="label">TOTAL BALANCE</span>
                                <button className={`refresh-action ${isRefreshing ? 'spinning' : ''}`} onClick={handleRefresh}>
                                    <RefreshCcw size={12} />
                                </button>
                            </div>
                            <div className="total-amount">
                                {(publicBalance + privateBalance).toLocaleString('uk-UA', { minimumFractionDigits: 2 })} <span className="currency">ALEO</span>
                            </div>

                            <div className="balance-row">
                                <div className="balance-col">
                                    <span className="col-label">Public</span>
                                    <span className="col-value">{publicBalance.toLocaleString('uk-UA', { minimumFractionDigits: 2 })}</span>
                                </div>
                                <div className="balance-col">
                                    <span className="col-label">Private</span>
                                    <div className="col-value private">
                                        {privateBalance > 0 ? (
                                            <>
                                                <Shield size={12} className="lock-icon green" />
                                                <span>{privateBalance.toLocaleString('uk-UA', { minimumFractionDigits: 2 })}</span>
                                            </>
                                        ) : (
                                            <>
                                                <Lock size={12} className="lock-icon" />
                                                <span className="dim">0.00</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {publicBalance >= 5 && (
                                <button
                                    className={`shield-assets-btn ${isShielding ? 'loading' : ''}`}
                                    onClick={handleShield}
                                    disabled={isShielding}
                                >
                                    {isShielding ? <RefreshCcw size={14} className="spinning" /> : <ShieldCheck size={14} />}
                                    <span>Shield Assets to Private</span>
                                </button>
                            )}
                        </div>

                        {/* Action List */}
                        <div className="wallet-actions-list">
                            <button className="action-row" onClick={() => { setIsOpen(false); onSettingsClick?.(); }}>
                                <SettingsIcon size={14} />
                                <span>Settings</span>
                            </button>
                            <a
                                href={`https://testnet.explorer.provable.com/address/${address}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="action-row"
                            >
                                <ExternalLink size={14} />
                                <span>Explorer</span>
                            </a>

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
