import React from 'react';
import { X, AlertCircle } from 'lucide-react';
import './ErrorModal.css';

interface ErrorModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    onClose: () => void;
}

export const ErrorModal: React.FC<ErrorModalProps> = ({ isOpen, title, message, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="error-modal-overlay" onClick={onClose}>
            <div className="error-modal-container" onClick={(e) => e.stopPropagation()}>
                <button className="error-modal-close" onClick={onClose}>
                    <X size={20} />
                </button>

                <div className="error-modal-icon">
                    <AlertCircle size={48} />
                </div>

                <h2 className="error-modal-title">{title}</h2>
                <p className="error-modal-message">{message}</p>

                <button className="error-modal-btn" onClick={onClose}>
                    Close
                </button>
            </div>
        </div>
    );
};
