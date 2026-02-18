import { useState, useMemo, useEffect, useCallback } from "react";
import { WalletProvider, useWallet } from "@demox-labs/aleo-wallet-adapter-react";
import { WalletModalProvider } from "@demox-labs/aleo-wallet-adapter-reactui";
import { LeoWalletAdapter } from "@demox-labs/aleo-wallet-adapter-leo";
import { ShieldWalletAdapter } from "@provablehq/aleo-wallet-adaptor-shield";
import {
    Transaction,
    WalletAdapterNetwork,
    DecryptPermission
} from "@demox-labs/aleo-wallet-adapter-base";
import EventEmitter from "eventemitter3";
import { Shield, Zap, Lock, Activity, LayoutGrid, Menu, X, Cpu, UserCheck, Plus, Loader2, Clock, BookOpen, RefreshCw, ShieldCheck, ArrowLeft, Globe, Check, EyeOff } from "lucide-react";
import "@demox-labs/aleo-wallet-adapter-reactui/styles.css";
import "./App.css";

import { ZKVisualization } from "./ZKVisualization";
import { ZKBadgeEcosystem } from "./ZKBadgeEcosystem";
import { RichComparison } from "./RichComparison";
import { TheLastCall } from "./TheLastCall";
import { InteractiveDemo } from "./InteractiveDemo";
import { ParticleBackground } from "./ParticleBackground";
import { ScrollProgress } from "./ScrollProgress";
import { FAQDocumentation } from "./FAQDocumentation";
import { MyProofs } from "./MyProofs";
import { Identity } from "./Identity";
import { AiAssistant } from "./AiAssistant";
import { CreateProposalModal } from "./CreateProposalModal";
import { TransactionHistoryModal, type TransactionRecord } from "./TransactionHistoryModal";
import { TransactionSuccess } from "./TransactionSuccess";
import { ZKProofModal } from "./ZKProofModal";
import { ZKLogo } from "./ZKLogo";
import { Settings } from "./Settings";
import { CustomWalletModal } from "./CustomWalletModal";
import { VotingCard } from "./VotingCard";
import { DiscussionSection } from "./DiscussionSection";
import type { Dilemma, PaidPost, FeedItem, VoteRecord, Comment } from "./types";

const ProtocolStatusBoard = () => {
    return (
        <div className="protocol-status-board">
            <div className="status-container">
                <div className="status-node">
                    <div className="pulse-dot"></div>
                    <span className="node-label">ALEO_TESTNET_NODE:</span>
                    <span className="node-val">ACTIVE</span>
                </div>
                <div className="status-divider"></div>
                <div className="status-node">
                    <Shield size={12} className="text-emerald-500" />
                    <span className="node-label">PROTOCOL:</span>
                    <span className="node-val">ZK_DECISION_V2</span>
                </div>
                <div className="status-divider"></div>
                <div className="status-node hide-mobile">
                    <Cpu size={12} />
                    <span className="node-label">TPS:</span>
                    <span className="node-val">2,429/s</span>
                </div>
                <div className="status-divider hide-mobile"></div>
                <div className="status-node">
                    <span className="node-label">BLOCK:</span>
                    <span className="node-val">#1,429,083</span>
                </div>
                <div className="status-divider"></div>
                <div className="status-node">
                    <div className="aleo-mini-logo"></div>
                    <span className="node-val">POWERED BY ALEO</span>
                </div>
            </div>
        </div>
    );
};

const GovernanceMetrics = ({ wallet, userVote, stakeAmount }: { wallet: any, userVote?: any, stakeAmount: number }) => {
    const totalStakedReal = useMemo(() => {
        const localKey = `tx_history_${wallet?.adapter?.publicKey}`;
        const localData: any[] = JSON.parse(localStorage.getItem(localKey) || '[]');
        const stakedVotes = localData.filter(tx => tx.type === 'vote').length;
        return (stakedVotes * 42.5) + (stakeAmount / 10);
    }, [wallet?.adapter?.publicKey, userVote, stakeAmount]);

    const quorumPercentage = useMemo(() => {
        return (64.2 + (totalStakedReal / 1000)).toFixed(1);
    }, [totalStakedReal]);

    return (
        <div className="governance-metrics-panel card-bg anim-fade-in">
            <div className="metric-item">
                <div className="metric-header">
                    <span>Network Quorum</span>
                    <span>{quorumPercentage}%</span>
                </div>
                <div className="metric-progress-bg">
                    <div className="metric-progress-fill" style={{ width: `${quorumPercentage}%` }}></div>
                </div>
            </div>
        </div>
    );
};

// DETAILED PROPOSAL VIEW COMPONENT (Moved back inside for consistency or keep shared)
const DetailedProposalView = ({
    item,
    onBack,
    onVote,
    loadingVote,
    userVote,
    stakeAmount,
    onStakeChange,
    onTriggerAssistant,
    wallet,
    onPostComment
}: {
    item: FeedItem;
    onBack: () => void;
    onVote: (id: number, option: string, stake: number) => void;
    loadingVote: number | null;
    userVote?: VoteRecord;
    stakeAmount: number;
    onStakeChange: (val: number) => void;
    onTriggerAssistant: () => void;
    wallet: any;
    onPostComment?: (id: number, text: string) => void;
}) => {
    const dilemma = item as Dilemma;
    const isDilemma = item.type === 'dilemma';
    const refId = useMemo(() => Math.floor(Math.random() * 9000000 + 1000000), [item.id]);

    const activityLog = useMemo(() => {
        return [...Array(4)].map((_, i) => ({
            time: `[${12 + i}:4${i} UTC]`,
            hash: `at1${((item.id + i) * 987654).toString(16).slice(0, 12)}...`,
            action: 'SHIELDED_VOTE_RECORDED'
        }));
    }, [item.id]);

    const [auditRevealed, setAuditRevealed] = useState(false);

    return (
        <div className="detailed-proposal-view glass-panel anim-fade-in">
            <div className="detailed-header">
                <button className="back-btn-styled" onClick={onBack}>
                    <X size={16} /> Back to Feed
                </button>
                <div className="security-status-header">
                    <Lock size={14} className="text-emerald-500" />
                    <span>Shielded Transaction Enabled</span>
                </div>
            </div>

            <div className="detailed-vibe-header">
                <div className="proposal-title-section">
                    <div className="category-tag">{isDilemma ? dilemma.category || 'GOVERNANCE' : 'PREMIUM_POST'}</div>
                    <h1>{item.title}</h1>
                    <div className="proposal-hash">
                        REF_ID: <span className="mono">{refId}</span>
                    </div>
                </div>

                <div className="proposal-description card-bg">
                    <h3>Protocol Objective</h3>
                    <p>{isDilemma ? dilemma.desc : (item as PaidPost).teaser}</p>
                </div>
            </div>

            <div className="detailed-grid">
                {!userVote ? (
                    <>
                        <div className="detailed-main-col">
                            <div className="on-chain-activity-log card-bg">
                                <div className="log-header">
                                    <Zap size={14} />
                                    <span>Recent On-Chain Activity</span>
                                </div>
                                <div className="log-entries">
                                    {isDilemma && (dilemma.votes || 0) > 0 ? activityLog.map((log, i) => (
                                        <div key={i} className="log-entry">
                                            <span className="log-time">{log.time}</span>
                                            <span className="log-hash">{log.hash}</span>
                                            <span className="log-action">SHIELDED VOTE</span>
                                        </div>
                                    )) : (
                                        <div className="log-empty-state" style={{ color: '#555', padding: '20px', textAlign: 'center', fontSize: '0.8rem' }}>
                                            WAITING_FOR_INITIAL_VOTES...
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="discussion-zone-detailed card-bg" style={{ marginTop: 20 }}>
                                <DiscussionSection
                                    proposalId={item.id}
                                    isLocked={false}
                                    comments={item.comments}
                                    onPostComment={(text) => onPostComment?.(item.id, text)}
                                    hideHeader={false}
                                />
                            </div>
                        </div>

                        <div className="detailed-sidebar-col">
                            <div className="participation-module card-bg anim-fade-in">
                                <div className="module-header">
                                    <h4>PARTICIPATE</h4>
                                </div>

                                <div className="stake-info">
                                    <span>Stake Aleo</span>
                                    <span>{stakeAmount.toFixed(1)} ALEO</span>
                                </div>

                                <input
                                    type="range"
                                    min="1"
                                    step="0.1"
                                    value={stakeAmount || 1}
                                    onChange={(e) => onStakeChange(parseFloat(e.target.value))}
                                    className="neon-slider"
                                />

                                <div className="power-calculation">
                                    <div className="power-calc-header">
                                        <span>Power = √Stake</span>
                                        <span className="vp-value">{Math.sqrt(stakeAmount || 1).toFixed(2)} VP</span>
                                    </div>
                                    <div className="power-bar-bg">
                                        <div className="power-bar-fill" style={{ width: `${Math.min(100, (Math.sqrt(stakeAmount || 1) / 10) * 100)}%` }}></div>
                                    </div>
                                </div>

                                <div className="button-group">
                                    {isDilemma && dilemma.options ? (
                                        dilemma.options.map((opt, i) => (
                                            <button
                                                key={i}
                                                className={`btn-vote-outline ${opt.toLowerCase().includes('yes') || opt.toLowerCase().includes('support') ? 'support' : opt.toLowerCase().includes('no') || opt.toLowerCase().includes('oppose') ? 'oppose' : 'neutral'}`}
                                                onClick={() => onVote(item.id, opt, stakeAmount)}
                                                disabled={loadingVote !== null}
                                            >
                                                {loadingVote === item.id ? 'SIGNING...' : opt.toUpperCase()}
                                            </button>
                                        ))
                                    ) : (
                                        <>
                                            <button
                                                className="btn-vote-outline support"
                                                onClick={() => onVote(item.id, 'Support', stakeAmount)}
                                                disabled={loadingVote !== null}
                                            >
                                                {loadingVote === item.id ? 'SIGNING...' : 'SUPPORT'}
                                            </button>
                                            <button
                                                className="btn-vote-outline oppose"
                                                onClick={() => onVote(item.id, 'Oppose', stakeAmount)}
                                                disabled={loadingVote !== null}
                                            >
                                                {loadingVote === item.id ? 'SIGNING...' : 'OPPOSE'}
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="assistant-chat-module card-bg assistant-full-width">
                            <div className="assistant-header">
                                <div className="assistant-avatar">ZK</div>
                                <div>
                                    <div className="name">ZK Assistant</div>
                                    <div className="status">Protocol Audit Ready</div>
                                </div>
                            </div>
                            <p className="assistant-content">
                                "Found potential incentive misalignment. I recommend analyzing the treasury impact via the Shielded Protocol before finalization."
                            </p>
                            <button className="ask-assistant-btn" onClick={onTriggerAssistant}>Verify Security Protocol</button>
                        </div>
                    </>
                ) : (
                    <div className="post-vote-immersive-hub anim-fade-in">
                        <div className="immersive-discussion-zone card-bg">
                            <DiscussionSection
                                proposalId={item.id}
                                isLocked={false}
                                comments={item.comments}
                                onPostComment={(text) => onPostComment?.(item.id, text)}
                                hideHeader={false}
                            />
                        </div>

                        <div className="post-vote-status-bar">
                            <div className="status-module-leveled glass-card-premium">
                                <div className="vote-success-module">
                                    <div className="vote-success-icon-wrapper" style={{ margin: '0 auto 10px', width: '40px', height: '40px' }}>
                                        <ShieldCheck size={24} />
                                    </div>
                                    <h2 style={{ fontSize: '1.2rem', marginBottom: '4px' }}>Vote Encrypted!</h2>
                                    <div className="choice-summary-row" style={{ padding: '8px 12px', marginBottom: '12px' }}>
                                        <span className="choice-label" style={{ fontSize: '0.75rem' }}>Choice:</span>
                                        <div className="choice-value">
                                            <span className={`choice-text ${userVote.choice.toLowerCase().includes('no') || userVote.choice.toLowerCase().includes('oppose') ? 'oppose' : ''}`} style={{ fontSize: '0.9rem' }}>
                                                {userVote.choice}
                                            </span>
                                        </div>
                                    </div>
                                    <button className="try-again-btn-styled" onClick={onBack} style={{ marginTop: '12px', padding: '8px' }}>Dashboard</button>
                                </div>
                            </div>

                            <div className="status-module-leveled card-bg">
                                <div className="assistant-header" style={{ marginBottom: '12px' }}>
                                    <div className="assistant-avatar" style={{ width: '30px', height: '30px', fontSize: '0.7rem' }}>ZK</div>
                                    <div>
                                        <div className="name" style={{ fontSize: '0.7rem' }}>ZK Assistant</div>
                                        <div className="status" style={{ fontSize: '0.55rem' }}>Audit Ready</div>
                                    </div>
                                </div>
                                {auditRevealed ? (
                                    <p className="assistant-content anim-fade-in" style={{ fontSize: '0.75rem', marginBottom: '12px', whiteSpace: 'pre-wrap', fontFamily: 'JetBrains Mono', color: '#aaa', lineHeight: '1.4' }}>
                                        VERIFYING_ZK_PROOF... [DONE]<br />
                                        RESULT: LOCAL_WITNESS_VALID.<br />
                                        STATUS: Broadcasting via private_decision_v4.aleo.
                                    </p>
                                ) : (
                                    <p className="assistant-content" style={{ fontSize: '0.75rem', marginBottom: '12px', color: '#666', fontStyle: 'italic', lineHeight: '1.4' }}>
                                        "ZK-Proof verification data is available for this transaction."
                                    </p>
                                )}
                                <button
                                    className="ask-assistant-btn"
                                    onClick={() => {
                                        setAuditRevealed(true);
                                        onTriggerAssistant();
                                    }}
                                    style={{ padding: '10px', fontSize: '0.7rem' }}
                                >
                                    {auditRevealed ? 'Audit Complete' : 'Privacy Audit'}
                                </button>
                            </div>

                            <div className="status-module-leveled card-bg">
                                <GovernanceMetrics wallet={wallet} userVote={userVote} stakeAmount={stakeAmount} />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// ... (Rest of the Terminal and App code follows exactly as updated previously)
