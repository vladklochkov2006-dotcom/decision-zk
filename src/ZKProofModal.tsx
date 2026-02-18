import React from 'react';
import { Shield, PenTool, Rocket, Check, Loader2, AlertCircle, X } from 'lucide-react';
import './ZKProofModal.css';

interface ZKProofModalProps {
    isOpen: boolean;
    stage: 'GENERATING' | 'SIGNING' | 'BROADCASTING' | 'SUCCESS' | 'ERROR';
    onClose: () => void;
    errorTitle?: string;
    errorMessage?: string;
}

export const ZKProofModal: React.FC<ZKProofModalProps> = ({ isOpen, stage, onClose, errorTitle, errorMessage }) => {

    if (!isOpen) return null;

    const getStepStatus = (stepStage: string) => {
        if (stage === 'ERROR') return 'pending';
        const order = ['GENERATING', 'SIGNING', 'BROADCASTING', 'SUCCESS'];
        const currentIndex = order.indexOf(stage);
        const stepIndex = order.indexOf(stepStage);

        if (currentIndex > stepIndex) return 'completed';
        if (currentIndex === stepIndex) return 'active';
        return 'pending';
    };

    return (
        <div className="zk-modal-overlay">
            <div className="zk-modal-glass">
                {stage === 'ERROR' ? (
                    <div className="zk-error-container">
                        <div className="error-icon-wrapper">
                            <AlertCircle size={48} color="#FF4D4D" />
                        </div>
                        <h2>{errorTitle || "Transaction Failed"}</h2>
                        <p>{errorMessage || "The transaction was rejected or an error occurred during execution. Please check your wallet and try again."}</p>
                        <button className="zk-modal-close-btn" onClick={onClose}>
                            Dismiss & Close
                        </button>
                    </div>
                ) : (
                    <div className="zk-stepper-container">
                        <div className="zk-modal-top-actions">
                            <button className="close-icon-btn" onClick={onClose}>
                                <X size={20} />
                            </button>
                        </div>
                        <h2>Processing Vote</h2>

                        {/* Step 1: Generating Proof */}
                        <div className={`zk-step ${getStepStatus('GENERATING')}`}>
                            <div className="step-icon">
                                {getStepStatus('GENERATING') === 'completed' ? <Check size={20} /> : <Shield size={20} />}
                            </div>
                            <div className="step-content">
                                <h3>Generating Proof</h3>
                                <p>Encrypting your vote locally...</p>
                            </div>
                            {stage === 'GENERATING' && <Loader2 className="step-spinner" size={18} />}
                        </div>

                        {/* Step 2: Wallet Signature */}
                        <div className={`zk-step ${getStepStatus('SIGNING')}`}>
                            <div className="step-icon">
                                {getStepStatus('SIGNING') === 'completed' ? <Check size={20} /> : <PenTool size={20} />}
                            </div>
                            <div className="step-content">
                                <h3>Wallet Signature</h3>
                                <p>Waiting for approval...</p>
                            </div>
                            {stage === 'SIGNING' && <div className="pulse-dot"></div>}
                        </div>

                        {/* Step 3: Broadcasting */}
                        <div className={`zk-step ${getStepStatus('BROADCASTING')}`}>
                            <div className="step-icon">
                                {getStepStatus('BROADCASTING') === 'completed' ? <Check size={20} /> : <Rocket size={20} />}
                            </div>
                            <div className="step-content">
                                <h3>Broadcasting</h3>
                                <p>Sending to Aleo network</p>
                            </div>
                            {stage === 'BROADCASTING' && <Loader2 className="step-spinner" size={18} />}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
