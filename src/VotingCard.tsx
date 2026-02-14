import React, { useState } from 'react';
import { Lock, Zap, Activity, Loader2, Check, EyeOff } from 'lucide-react';
import type { Dilemma, VoteRecord } from './types';
import { VoteConfirmation } from './VoteConfirmation';
import { DiscussionSection } from './DiscussionSection';

interface VotingCardProps {
    dilemma: Dilemma;
    userVote?: VoteRecord;
    loadingVote?: number | null;
    walletAddress?: string;
    onVote: (id: number, choice: string, stakeAmount: number) => void;
    onRetryVote: (id: number) => void;
    onManualVoteId: (id: number, txId: string) => void;
}

export const VotingCard: React.FC<VotingCardProps> = ({
    dilemma,
    userVote,
    loadingVote,
    walletAddress,
    onVote,
    onRetryVote,
    onManualVoteId
}) => {
    const [stakeAmount, setStakeAmount] = useState(0);
    const [selectedOptionDuringLoading, setSelectedOptionDuringLoading] = useState<string | null>(null);

    return (
        <div className="encrypted-card">
            <div className="badge-container">
                <div className="encrypted-badge">
                    ENCRYPTED PROPOSAL #{String(dilemma.id).padStart(2, '0')}
                </div>
                {dilemma.status === 'Active' && <span className="status-badge active">Active</span>}
                {dilemma.status === 'Pass' && <span className="status-badge pass">Pass</span>}
            </div>

            <h3>{dilemma.title}</h3>
            <p className="dilemma-desc">{dilemma.desc}</p>

            {/* Staking Slider */}
            <div className="reputation-staking-box">
                <div className="staking-header">
                    <span className="staking-label">Reputation Staking (Optional)</span>
                    <span className="staking-value">{stakeAmount.toFixed(1)} ZK-REP</span>
                </div>
                <input
                    type="range"
                    className="staking-slider"
                    min="0"
                    max="10"
                    step="0.5"
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(parseFloat(e.target.value))}
                    disabled={!!userVote || loadingVote === dilemma.id}
                />
                <div className="staking-info">
                    <Zap size={10} />
                    Stake ZK-REP to increase voting power. Correct decisions earn 2x bonus.
                </div>
            </div>

            <div className={`dilemma-actions ${dilemma.options ? 'custom-options' : ''}`}>
                {userVote ? (
                    <div className="vote-result-container">
                        <VoteConfirmation
                            choice={userVote.choice}
                            txId={userVote.txId}
                            userAddress={walletAddress}
                            onRetry={() => onRetryVote(dilemma.id)}
                            onManualIdEntered={(manualId) => onManualVoteId(dilemma.id, manualId)}
                        />
                        <DiscussionSection proposalId={dilemma.id} initialComments={dilemma.comments} />
                    </div>
                ) : dilemma.options ? (
                    dilemma.options.map((option, idx) => (
                        <button
                            key={idx}
                            className="vote-option-btn"
                            disabled={!!loadingVote}
                            onClick={() => {
                                setSelectedOptionDuringLoading(option);
                                onVote(dilemma.id, option, stakeAmount);
                            }}
                        >
                            {loadingVote === dilemma.id && selectedOptionDuringLoading === option ? (
                                <><Loader2 className="spin-icon" size={16} /> Signing...</>
                            ) : option}
                        </button>
                    ))
                ) : (
                    <>
                        <button
                            className="vote-support"
                            disabled={!!loadingVote}
                            onClick={() => {
                                setSelectedOptionDuringLoading("Support");
                                onVote(dilemma.id, "Support", stakeAmount);
                            }}
                        >
                            {loadingVote === dilemma.id && selectedOptionDuringLoading === "Support" ? <Loader2 className="spin-icon" size={18} /> : <Check size={18} />}
                            {loadingVote === dilemma.id && selectedOptionDuringLoading === "Support" ? "Signing..." : "Vote Support"}
                        </button>
                        <button
                            className="vote-oppose"
                            disabled={!!loadingVote}
                            onClick={() => {
                                setSelectedOptionDuringLoading("Oppose");
                                onVote(dilemma.id, "Oppose", stakeAmount);
                            }}
                        >
                            {loadingVote === dilemma.id && selectedOptionDuringLoading === "Oppose" ? <Loader2 className="spin-icon" size={18} /> : <EyeOff size={18} />}
                            {loadingVote === dilemma.id && selectedOptionDuringLoading === "Oppose" ? "Signing..." : "Vote Oppose"}
                        </button>
                    </>
                )}
            </div>


            {!userVote && (
                <DiscussionSection
                    proposalId={dilemma.id}
                    isLocked={true}
                    lockedMessage="Vote to join the anonymous discussion."
                    initialComments={dilemma.comments}
                />
            )}

            <div className="dilemma-meta">
                <div className="meta-item">
                    <Zap size={14} />
                    <span>Ends in 24h</span>
                </div>
                <div className="meta-item">
                    <Activity size={14} />
                    <span>{dilemma.votes} votes</span>
                </div>
                <div className="meta-item">
                    <Lock size={14} />
                    <span>ZK-Encrypted</span>
                </div>
            </div>
        </div>
    );
};
