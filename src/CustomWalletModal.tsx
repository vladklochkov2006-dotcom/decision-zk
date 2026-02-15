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
    const [connectingWallet, setConnectingWallet] = React.useState<string | null>(null);

    if (!isOpen) return null;

    const handleSelectWallet = async (walletAdapter: any) => {
        if (connectingWallet) return;
        setConnectingWallet(walletAdapter.name);
        try {
            // Select the wallet first
            select(walletAdapter.name);
            // Initiate connection with required arguments
            await walletAdapter.connect(
                DecryptPermission.UponRequest,
                WalletAdapterNetwork.TestnetBeta
            );
            // Close modal after successful initiation
            onClose();
        } catch (error) {
            console.error("Connection failed:", error);
            setConnectingWallet(null);
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

                        const isConnecting = connectingWallet === wallet.adapter.name;

                        return (
                            <button
                                key={wallet.adapter.name}
                                className={`wallet-option ${isConnecting ? 'connecting' : ''}`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleSelectWallet(wallet.adapter);
                                }}
                                disabled={!!connectingWallet}
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
                                    <span className={`wallet-status ${wallet.readyState === 'Installed' || wallet.readyState === 'Loadable' ? 'detected' : ''}`}>
                                        {isConnecting ? 'Connecting...' : (wallet.readyState === 'Installed' || wallet.readyState === 'Loadable' ? 'Detected' : 'Connect')}
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
