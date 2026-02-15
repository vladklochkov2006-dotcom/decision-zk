import React, { useState } from 'react';
import { Loader2, Check, EyeOff, Scale, Timer, Users, ShieldCheck, Landmark } from 'lucide-react';
import type { Dilemma, VoteRecord } from './types';
import { VoteConfirmation } from './VoteConfirmation';
import { DiscussionSection } from './DiscussionSection';
import './VotingCard.css';

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

    // Helpers for icons
    const getCategoryIcon = (cat?: string) => {
        if (cat === 'Treasury') return <Landmark size={14} />;
        if (cat === 'Security') return <ShieldCheck size={14} />;
        return <Scale size={14} />;
    };

    return (
        <div className="glass-card">
            {/* 1. Header Row */}
            <div className="card-header-row">
                <div className="card-category">
                    {getCategoryIcon(dilemma.category)}
                    <span>{dilemma.category || 'Governance'}</span>
                </div>
                <div className={`status-chip ${dilemma.status === 'Active' ? 'active' : 'closed'}`}>
                    {dilemma.status === 'Active' && <div className="status-dot"></div>}
                    {dilemma.status.toUpperCase()}
                </div>
            </div>

            {/* 2. Title & Desc */}
            <h3>{dilemma.title}</h3>
            <p className="card-desc">{dilemma.desc}</p>

            {/* 3. Metadata Row */}
            <div className="metadata-grid">
                <div className="meta-box">
                    <Timer size={20} />
                    <span className="meta-value">{dilemma.timeLeft || '24h'}</span>
                    <span className="meta-label">Time Left</span>
                </div>
                <div className="meta-box">
                    <Users size={20} />
                    <span className="meta-value">{dilemma.participants || dilemma.votes}</span>
                    <span className="meta-label">Voted</span>
                </div>
                <div className="meta-box">
                    <ShieldCheck size={20} />
                    <span className="meta-value">{dilemma.privacyLevel || 'ZK-Max'}</span>
                    <span className="meta-label">Privacy</span>
                </div>
            </div>

            {/* 4. Staking Slider */}
            <div className="neon-slider-container">
                <div className="flex justify-between text-xs text-gray-500 mb-2 uppercase tracking-wider font-bold">
                    <span>Stake Reputation</span>
                    <span className="text-cyan-400">{stakeAmount.toFixed(1)} ZK-REP</span>
                </div>
                <input
                    type="range"
                    className="neon-slider"
                    min="0"
                    max="10"
                    step="0.5"
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(parseFloat(e.target.value))}
                    disabled={!!userVote || loadingVote === dilemma.id || dilemma.status !== 'Active'}
                    style={{ opacity: dilemma.status !== 'Active' ? 0.5 : 1, cursor: dilemma.status !== 'Active' ? 'not-allowed' : 'pointer' }}
                />
            </div>

            {/* 5. Actions */}
            <div className="vote-actions-row">
                {dilemma.status !== 'Active' ? (
                    <div className="w-full text-center p-4 border border-gray-800 rounded-xl bg-black/20 text-gray-400 font-mono text-sm uppercase tracking-widest">
                        Voting Closed • {dilemma.status}
                    </div>
                ) : userVote ? (
                    <div className="vote-result-grid">
                        <VoteConfirmation
                            choice={userVote.choice}
                            txId={userVote.txId}
                            userAddress={walletAddress}
                            onRetry={() => onRetryVote(dilemma.id)}
                            onManualIdEntered={(manualId) => onManualVoteId(dilemma.id, manualId)}
                        />
                        <div style={{ marginTop: 0 }}>
                            <DiscussionSection proposalId={dilemma.id} initialComments={dilemma.comments} />
                        </div>
                    </div>
                ) : dilemma.options ? (
                    // Multi-option support
                    dilemma.options.map((option, idx) => (
                        <button
                            key={idx}
                            className="btn-vote-outline"
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
                    // Binary Support/Oppose
                    <>
                        <button
                            className="btn-vote-outline support"
                            disabled={!!loadingVote}
                            onClick={() => {
                                setSelectedOptionDuringLoading("Support");
                                onVote(dilemma.id, "Support", stakeAmount);
                            }}
                        >
                            {loadingVote === dilemma.id && selectedOptionDuringLoading === "Support" ? <Loader2 className="spin-icon" size={18} /> : <Check size={18} />}
                            {loadingVote === dilemma.id && selectedOptionDuringLoading === "Support" ? "Signing..." : "Support"}
                        </button>
                        <button
                            className="btn-vote-outline oppose"
                            disabled={!!loadingVote}
                            onClick={() => {
                                setSelectedOptionDuringLoading("Oppose");
                                onVote(dilemma.id, "Oppose", stakeAmount);
                            }}
                        >
                            {loadingVote === dilemma.id && selectedOptionDuringLoading === "Oppose" ? <Loader2 className="spin-icon" size={18} /> : <EyeOff size={18} />}
                            {loadingVote === dilemma.id && selectedOptionDuringLoading === "Oppose" ? "Signing..." : "Oppose"}
                        </button>
                    </>
                )}
            </div>

            {!userVote && (
                <div style={{ marginTop: 20 }}>
                    <DiscussionSection
                        proposalId={dilemma.id}
                        isLocked={true}
                        lockedMessage="Vote to join the anonymous discussion."
                        initialComments={dilemma.comments}
                    />
                </div>
            )}
        </div>
    );
};
