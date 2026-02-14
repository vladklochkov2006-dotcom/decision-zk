import React from 'react';
import { useWallet } from '@demox-labs/aleo-wallet-adapter-react';
import { DecryptPermission, WalletAdapterNetwork } from "@demox-labs/aleo-wallet-adapter-base";
import { X } from 'lucide-react';
import './CustomWalletModal.css';

interface CustomWalletModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const CustomWalletModal: React.FC<CustomWalletModalProps> = ({ isOpen, onClose }) => {
    const { wallets, select } = useWallet();

    if (!isOpen) return null;

    const handleSelectWallet = async (walletAdapter: any) => {
        try {
            // Select the wallet first
            select(walletAdapter.name);
            // Initiate connection with required arguments
            // Note: Provable (Shield) expects network to be passed, Leo expects it too.
            // Using TestnetBeta as standard for now, wrapper handles conversion if needed.
            await walletAdapter.connect(
                DecryptPermission.UponRequest,
                WalletAdapterNetwork.TestnetBeta
            );
            // Close modal after successful initiation
            onClose();
        } catch (error) {
            console.error("Connection failed:", error);
        }
    };

    return (
        <div className="wallet-modal-overlay" onClick={onClose}>
            <div className="wallet-modal-glass" onClick={e => e.stopPropagation()}>
                <div className="wallet-modal-header">
                    <h2>Select Wallet</h2>
                    <button className="close-btn" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <div className="wallet-list">
                    {wallets && wallets.map((wallet) => {
                        // Strict safety check to prevent crashes
                        if (!wallet || !wallet.adapter || !wallet.adapter.name) return null;

                        return (
                            <button
                                key={wallet.adapter.name}
                                className="wallet-option"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleSelectWallet(wallet.adapter);
                                }}
                            >
                                <div className="wallet-icon">
                                    {wallet.adapter.icon ? (
                                        <img src={wallet.adapter.icon} alt={wallet.adapter.name} />
                                    ) : (
                                        <div style={{ width: 32, height: 32, background: '#ccc', borderRadius: '50%' }}></div>
                                    )}
                                </div>
                                <div className="wallet-info">
                                    <span className="wallet-name">{wallet.adapter.name}</span>
                                    <span className="wallet-status">
                                        {wallet.readyState === 'Installed' ? 'Detected' : 'Not Detected'}
                                    </span>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
