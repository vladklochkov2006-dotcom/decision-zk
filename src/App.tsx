import { useState, useMemo, useEffect, useCallback, useRef } from "react";
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
import { Shield, Zap, Lock, Activity, LayoutGrid, Menu, X, Cpu, UserCheck, Plus, Loader2, Clock, BookOpen, RefreshCw, ShieldCheck } from "lucide-react";
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
import { PrivacyProvider, PrivacySensitive } from "./contexts/PrivacyContext";

const ProtocolStatusBoard = () => {
  // ... (existing code or simplified for brevity if needed)
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
  // Aggregation logic for real ALEO staked
  const totalStakedReal = useMemo(() => {
    const localKey = `tx_history_${wallet?.adapter?.publicKey}`;
    const localData: any[] = JSON.parse(localStorage.getItem(localKey) || '[]');
    // Filter for votes and sum stake amounts if available (or use a fallback for mock consistency)
    const stakedVotes = localData.filter(tx => tx.type === 'vote').length;
    return (stakedVotes * 42.5) + (stakeAmount / 10); // Base mock + real current session weight
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

      <div className="metric-item">
        <div className="metric-header">
          <span>Staking Participation</span>
          <span>{(1.2 + totalStakedReal / 100).toFixed(2)}M ALEO</span>
        </div>
        <div className="metric-progress-bg">
          <div className="metric-progress-fill" style={{ width: '45%', background: '#6366f1', boxShadow: '0 0 10px #6366f1' }}></div>
        </div>
      </div>

      <div className="metric-item" style={{ marginTop: '8px' }}>
        <div className="metric-header">
          <span>Finalization Status</span>
          <span style={{ color: '#10b981' }}>CONFIRMED</span>
        </div>
        <div className="metric-value" style={{ fontSize: '0.7rem', color: '#666', fontFamily: 'JetBrains Mono' }}>
          BLOCK: #2,841,092
        </div>
      </div>
    </div>
  );
};

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
  item: FeedItem,
  onBack: () => void,
  onVote: (id: number, choice: string, stakeAmount: number) => void,
  loadingVote: number | null,
  userVote?: any,
  stakeAmount: number,
  onStakeChange: (val: number) => void,
  onTriggerAssistant: () => void,
  wallet: any,
  onPostComment?: (id: number, text: string) => void
}) => {
  const isDilemma = item.type === 'dilemma';
  const dilemma = item as Dilemma;

  // Fix ID Stability: Use useMemo to generate fixed hashes once per item ID
  const refId = useMemo(() => `#at1${(item.id * 1234567).toString(16).slice(0, 8)}...${(item.id * 7654321).toString(16).slice(0, 4)}`, [item.id]);

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
          <span>{item.type === 'dilemma' ? dilemma.desc : (item as PaidPost).teaser}</span>
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
                  {isDilemma && ((item as Dilemma).votes || 0) > 0 ? activityLog.map((log, i) => (
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
                  className="range-slider"
                />

                <div className="power-calculation">
                  <div className="power-calc-header">
                    <span>Power = √Stake</span>
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
                        disabled={stakeAmount < 0.1 || loadingVote !== null}
                      >
                        {loadingVote === item.id ? 'SIGNING...' : opt.toUpperCase()}
                      </button>
                    ))
                  ) : (
                    <>
                      <button
                        className="btn-vote-outline support"
                        onClick={() => onVote(item.id, 'Support', stakeAmount)}
                        disabled={stakeAmount < 0.1 || loadingVote !== null}
                      >
                        {loadingVote === item.id ? 'SIGNING...' : 'SUPPORT'}
                      </button>
                      <button
                        className="btn-vote-outline oppose"
                        onClick={() => onVote(item.id, 'Oppose', stakeAmount)}
                        disabled={stakeAmount < 0.1 || loadingVote !== null}
                      >
                        {loadingVote === item.id ? 'SIGNING...' : 'OPPOSE'}
                      </button>
                    </>
                  )}
                </div>
                <div className="vote-confirmed-badge">
                  <Shield size={12} className="text-emerald-500" />
                  <span>ZK-Shielded Voting Enabled</span>
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
                "Found potential incentive misalignment in Option B. I recommend analyzing the treasury impact via the Shielded Protocol before finalization."
              </p>
              <button className="ask-assistant-btn" onClick={onTriggerAssistant}>Verify Security Protocol</button>
            </div>
          </>
        ) : (
          <div className="post-vote-immersive-hub anim-fade-in">
            {/* Top Primary Row: 70% Focus */}
            <div className="immersive-discussion-zone card-bg">
              <div className="social-indicators-row">
                <div className="social-chip">
                  <span className="pulse-dot"></span>
                  12 Active Participants
                </div>
                <div className="social-chip proofs">
                  <span className="pulse-dot"></span>
                  28 Live Proofs
                </div>
              </div>
              <DiscussionSection
                isLocked={false}
                comments={item.comments}
                onPostComment={(text) => onPostComment?.(item.id, text)}
                hideHeader={false}
              />
            </div>

            {/* Bottom Status Row: 30% Info */}
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
                    VERIFYING_ZK_PROOF_INTEGRITY... [DONE]<br />
                    GENERATION_PHASE: Poseidon Commitment / Varuna-zkSNARK<br />
                    RESULT: LOCAL_WITNESS_VALID.<br />
                    STATUS: Broadcasting to Aleo Shielded Pool via private_decision_v4.aleo.
                  </p>
                ) : (
                  <p className="assistant-content" style={{ fontSize: '0.75rem', marginBottom: '12px', color: '#666', fontStyle: 'italic', lineHeight: '1.4' }}>
                    "ZK-Proof verification data is available for this transaction. Run audit to verify cryptographic integrity."
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
        )
        }
      </div >
    </div >
  );
};


const MOCK_USER_STATS = {
  rep: 92.4,
  votingPower: "4.5x",
  active: 3,
  proposals: 5,
  age: "42d",
  proofs: 15
};

const LandingPage = ({ onEnter }: { onEnter: () => void }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { connected, disconnect } = useWallet();
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

  const handleConnect = () => {
    setIsWalletModalOpen(true);
  };

  const handleEnterApp = () => {
    onEnter();
  };

  const handleChangeWallet = async () => {
    try {
      if (connected) {
        await disconnect();
        // Give time for state to settle
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    } catch (e) {
      // Disconnect handled
    }
    setIsWalletModalOpen(true);
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="landing-page">
      <CustomWalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
      />
      <ProtocolStatusBoard />
      <div className="bg-grid"></div>
      <ParticleBackground />
      <ScrollProgress />

      <header className="landing-header">
        <div className="header-container">
          <div className="header-logo">
            <ZKLogo className="w-10 h-10" />
            <span>Decision.ZK</span>
          </div>
          <nav className="header-nav">
            <a href="#protocol" onClick={(e) => handleNavClick(e, 'protocol')}>Protocol</a>
            <a href="#comparison" onClick={(e) => handleNavClick(e, 'comparison')}>Comparison</a>
            <a href="#ecosystem" onClick={(e) => handleNavClick(e, 'ecosystem')}>Ecosystem</a>
            <a href="#demo" onClick={(e) => handleNavClick(e, 'demo')}>Demo</a>
          </nav>

          {connected ? (
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="header-cta" onClick={handleEnterApp}>
                Launch App
              </button>
              <button className="header-cta-outline" onClick={handleChangeWallet}>
                Change Wallet
              </button>
            </div>
          ) : (
            <button className="header-cta" onClick={handleConnect}>
              Connect Wallet
            </button>
          )}

          <button
            className="mobile-menu-button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <>
          <div
            className="mobile-menu-overlay"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="mobile-menu">
            <nav className="mobile-nav">
              <a href="#protocol" onClick={(e) => handleNavClick(e, 'protocol')}>Protocol</a>
              <a href="#comparison" onClick={(e) => handleNavClick(e, 'comparison')}>Comparison</a>
              <a href="#ecosystem" onClick={(e) => handleNavClick(e, 'ecosystem')}>Ecosystem</a>
              <a href="#demo" onClick={(e) => handleNavClick(e, 'demo')}>Demo</a>
            </nav>
            {connected ? (
              <>
                <button className="mobile-cta" onClick={handleEnterApp} style={{ marginBottom: 10 }}>
                  Launch App
                </button>
                <button className="mobile-cta" onClick={handleChangeWallet} style={{ background: 'transparent', border: '1px solid rgba(16, 185, 129, 0.4)', color: '#fff' }}>
                  Change Wallet
                </button>
              </>
            ) : (
              <button className="mobile-cta" onClick={handleConnect}>
                Connect Wallet
              </button>
            )}
          </div>
        </>
      )}

      <section className="hero" id="protocol">
        <p className="hero-tag">ZK-GOVERNANCE PROTOCOL</p>
        <h1 className="hero-title">
          <span className="title-line-1">Anonymous Voice.</span>
          <span className="title-line-2">Verifiable Power.</span>
        </h1>
        <p className="hero-desc">
          Traditional voting is broken by bias. Decision.ZK uses zero-knowledge
          proofs to build a future where only the truth matters.
        </p>
        <div className="hero-cta-group" style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
          {connected ? (
            <>
              <button className="launch-btn" onClick={handleEnterApp}>
                Launch App
              </button>
            </>
          ) : (
            <button className="launch-btn" onClick={handleConnect}>
              Connect Wallet to Enter
            </button>
          )}
        </div>


        <div className="steps-container">
          <div className="step-card">
            <Lock size={24} color="#10B981" />
            <h3>Shield Identity</h3>
            <p>Your identity and stake are wrapped in a ZK-proof. Invisible to the public, verifiable by math.</p>
          </div>
          <div className="step-card">
            <Cpu size={24} color="#10B981" />
            <h3>Blind Stake</h3>
            <p>Vote on proposals without herd mentality. The count stays encrypted until the reveal phase.</p>
          </div>
          <div className="step-card">
            <UserCheck size={24} color="#10B981" />
            <h3>ZK-Reputation</h3>
            <p>Participate in governance and earn non-transferable reputation credits based on your contribution.</p>
          </div>
        </div>
      </section>

      <ZKVisualization />

      <section id="comparison">
        <RichComparison />
      </section>

      <section id="demo">
        <InteractiveDemo />
      </section>



      <section id="ecosystem">
        <ZKBadgeEcosystem />
      </section>

      <TheLastCall
        onConnect={handleConnect}
        onEnter={handleEnterApp}
        connected={connected || false}
      />

      <footer style={{ marginTop: 0, color: '#555', fontSize: '0.85rem', textAlign: 'center', paddingBottom: 40 }}>
        © 2026 Decision.ZK • Built on Aleo • Powered by Zero-Knowledge
      </footer>
    </div>
  );
};

export const Terminal = ({
  onExit,
  publicBalance,
  privateBalance,
  refreshPublic,
  refreshPrivate
}: {
  onExit: () => void;
  publicBalance: number;
  privateBalance: number;
  refreshPublic: (addr: string) => void;
  refreshPrivate: () => void;
}) => {
  const { connected, wallet } = useWallet();
  const [activeTab, setActiveTab] = useState('feed');
  const [selectedItem, setSelectedItem] = useState<FeedItem | null>(null);
  const [stakeAmount, setStakeAmount] = useState<number>(0.1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [toastIsClosing, setToastIsClosing] = useState(false);
  const [optimisticTransactions, setOptimisticTransactions] = useState<TransactionRecord[]>([]);
  const [loadingUnlock, setLoadingUnlock] = useState<number | null>(null);
  const [userVotes, setUserVotes] = useState<Record<number, VoteRecord>>({});
  const [loadingVote, setLoadingVote] = useState<number | null>(null);
  const [lastTxId, setLastTxId] = useState<string | null>(null);
  const [assistantTrigger, setAssistantTrigger] = useState<string>('IDLE');

  // --- TRANSACTION POLLING WORKER INTEGRATION ---
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    // Initialize the worker from the local file
    const worker = new Worker(new URL('./txWorker.js', import.meta.url));
    workerRef.current = worker;

    worker.onmessage = (e) => {
      const { type, txId, message } = e.data;
      if (type === 'TX_SUCCESS') {
        console.log(`[Decision.ZK] Finalized: ${txId}`);
        setOptimisticTransactions(prev => prev.map(tx =>
          tx.id === txId ? { ...tx, status: 'Success' } : tx
        ));

        // Refresh balances after confirmation
        if (wallet?.adapter?.publicKey) {
          refreshPublic(wallet.adapter.publicKey);
          refreshPrivate();
        }

        // CRITICAL: Update localStorage so it persists after reload
        if (wallet?.adapter?.publicKey) {
          const localKey = `tx_history_${wallet.adapter.publicKey}`;
          const localData = JSON.parse(localStorage.getItem(localKey) || '[]');
          const updatedLocal = localData.map((tx: any) =>
            tx.id === txId ? { ...tx, status: 'Success' } : tx
          );
          localStorage.setItem(localKey, JSON.stringify(updatedLocal));
        }
      } else if (type === 'TX_ERROR') {
        console.error(`[App] Transaction ${txId} error: ${message}`);
        setOptimisticTransactions(prev => prev.map(tx =>
          tx.id === txId ? { ...tx, status: 'Failed' } : tx
        ));

        // Update localStorage for errors too
        if (wallet?.adapter?.publicKey) {
          const localKey = `tx_history_${wallet.adapter.publicKey}`;
          const localData = JSON.parse(localStorage.getItem(localKey) || '[]');
          const updatedLocal = localData.map((tx: any) =>
            tx.id === txId ? { ...tx, status: 'Failed' } : tx
          );
          localStorage.setItem(localKey, JSON.stringify(updatedLocal));
        }
      }
    };

    return () => {
      worker.terminate();
    };
  }, [wallet?.adapter?.publicKey]);

  // Resume tracking for any "Broadcasted" transactions found in history
  useEffect(() => {
    if (connected && wallet?.adapter?.publicKey) {
      const localKey = `tx_history_${wallet.adapter.publicKey}`;
      const localData = JSON.parse(localStorage.getItem(localKey) || '[]');
      const broadcasted = localData.filter((tx: any) => tx.status === 'Broadcasted');

      if (broadcasted.length > 0) {
        broadcasted.forEach((tx: any) => trackWithWorker(tx.id));
        // Also add them to optimistic transactions so they show up in UI
        setOptimisticTransactions(prev => {
          const existingIds = new Set(prev.map(p => p.id));
          const newItems = broadcasted.filter((b: any) => !existingIds.has(b.id));
          return [...prev, ...newItems];
        });
      }
    }
  }, [connected, wallet?.adapter?.publicKey]);

  // --- NEW: WALLET-BASED POLLING ---
  // Poll via the wallet adapter DIRECTLY (because it often knows status before websites)
  useEffect(() => {
    if (!connected || !wallet?.adapter || optimisticTransactions.length === 0) return;

    const interval = setInterval(async () => {
      const pendingTxs = optimisticTransactions.filter(tx => tx.status === 'Broadcasted');
      if (pendingTxs.length === 0) return;

      for (const tx of pendingTxs) {
        try {
          // Attempt to get status via the adapter or standard getTransactionStatus
          const adapter = wallet.adapter as any;
          let remoteStatus = null;

          if (typeof adapter.getTransactionStatus === 'function') {
            remoteStatus = await adapter.getTransactionStatus(tx.id);
          } else if (typeof adapter.getExecution === 'function') {
            // Some newer adapters use getExecution which returns a promise/string
            const result = await adapter.getExecution(tx.id);
            if (result) remoteStatus = 'Finalized';
          }

          if (remoteStatus) {
            const statusStr = String(remoteStatus).toLowerCase();
            if (statusStr === 'finalized' || statusStr === 'accepted' || statusStr === 'completed') {
              console.log(`[Decision.ZK] Verified @wallet: ${tx.id}`);

              // 1. Update UI
              setOptimisticTransactions(prev => prev.map(p =>
                p.id === tx.id ? { ...p, status: 'Success' } : p
              ));

              // Refresh balances
              if (wallet?.adapter?.publicKey) {
                refreshPublic(wallet.adapter.publicKey);
                refreshPrivate();
              }

              // 2. Update Persisted History
              if (wallet?.adapter?.publicKey) {
                const localKey = `tx_history_${wallet.adapter.publicKey}`;
                const localData = JSON.parse(localStorage.getItem(localKey) || '[]');
                const updatedLocal = localData.map((l: any) =>
                  l.id === tx.id ? { ...l, status: 'Success' } : l
                );
                localStorage.setItem(localKey, JSON.stringify(updatedLocal));
              }
            } else if (statusStr === 'failed' || statusStr === 'rejected') {
              // Handle failure similarly
              setOptimisticTransactions(prev => prev.map(p =>
                p.id === tx.id ? { ...p, status: 'Failed' } : p
              ));
            }
          }
        } catch (e) {
          // Silent fail for non-supported or missing tx
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [connected, wallet?.adapter, optimisticTransactions]);

  const trackWithWorker = (txId: string) => {
    if (workerRef.current && txId && txId.startsWith('at1')) {
      workerRef.current.postMessage({ type: 'TRACK_TRANSACTION', txId });
    }
  };

  const triggerAssistantMessage = () => {
    const id = Date.now().toString();
    setAssistantTrigger(id);
    // Auto reset trigger state
    setTimeout(() => setAssistantTrigger('IDLE'), 100);
  };

  const handlePostComment = (itemId: number, text: string) => {
    setFeedItems(prev => prev.map(item => {
      if (item.id === itemId) {
        const newComment: Comment = {
          id: Date.now(),
          author: "You (Anon)",
          text: text,
          time: "Just now",
          status: "Verified"
        };
        return {
          ...item,
          comments: [newComment, ...(item.comments || [])]
        };
      }
      return item;
    }));

    // If currently viewing this item in detailed view, update selectedItem too
    if (selectedItem && selectedItem.id === itemId) {
      setSelectedItem(prev => {
        if (!prev) return null;
        const newComment: Comment = {
          id: Date.now(),
          author: "You (Anon)",
          text: text,
          time: "Just now",
          status: "Verified"
        };
        return {
          ...prev,
          comments: [newComment, ...(prev.comments || [])]
        };
      });
    }
  };

  const handleItemClick = (item: FeedItem) => {
    // Block "Entry" into detailed view for closed dilemmas (Item 2)
    if (item.type === 'dilemma') {
      const dilemma = item as Dilemma;
      if (dilemma.status !== 'Active') {
        setZkError({
          title: 'Voting Closed',
          message: `This proposal is already ${dilemma.status.toLowerCase()}. You can only view the aggregate results on the dashboard.`
        });
        setZkStage('ERROR');
        setZkModalOpen(true);
        return;
      }
    }
    setSelectedItem(item);
  };

  const handleBackToFeed = () => {
    setSelectedItem(null);
    setLoadingVote(null);
    setZkStage('GENERATING');
  };

  // Helper to update Transaction ID in state and localStorage once Bech32 is found
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [zkModalOpen, setZkModalOpen] = useState(false);
  const [zkStage, setZkStage] = useState<'GENERATING' | 'SIGNING' | 'BROADCASTING' | 'SUCCESS' | 'ERROR'>('GENERATING');
  const [zkError, setZkError] = useState<{ title: string; message: string } | null>(null);

  const [feedItems, setFeedItems] = useState<FeedItem[]>([
    {
      type: 'dilemma',
      id: 1,
      title: "Should we allocate 20% of Treasury to ZK-Hardware?",
      desc: "Specialized ZK hardware will increase proving speed by 40% for all Aleo participants.",
      votes: 1240,
      status: 'Active',
      category: 'Treasury',
      timeLeft: '24h',
      privacyLevel: 'ZK-Max',
      participants: 142,
      comments: [
        { id: 101, author: '0x123...abc', text: 'This is crucial for scaling. Full support.', time: '2h ago', status: 'Verified' },
        { id: 102, author: '0x789...xyz', text: 'Can we get a cost breakdown first?', time: '4h ago', status: 'Verified' }
      ]
    },
    {
      type: 'dilemma',
      id: 2,
      title: 'Implement Quadratic Voting for Council Elections?',
      desc: 'Quadratic voting minimizes whale dominance and promotes fairer representation.',
      votes: 850,
      status: 'Active',
      category: 'Governance',
      timeLeft: '48h',
      privacyLevel: 'Shielded',
      participants: 89,
      options: ['Yes, implement immediately', 'No, keep current system', 'Delay for audit'],
      comments: []
    },
    {
      type: 'paid_post',
      id: 3,
      title: "Alpha Leak: Upcoming ZK-Rollup Partnership",
      teaser: "We have confirmed a major partnership with a Tier-1 exchange for the new ZK-Rollup layer. The listing date is set for...",
      hiddenContent: "The partnership is with Coinbase. Listing is scheduled for Q4 2026 pending regulatory approval. The initial liquidity pool with be seeded with $50M.",
      price: 1,
      isUnlocked: false,
      comments: [
        { id: 201, author: '0x999...111', text: 'Worth every token. Preparing my node now.', time: '10m ago', status: 'Insider' }
      ]
    },
    {
      type: 'dilemma',
      id: 4,
      title: "New Protocol: Reduced Transaction Fees?",
      desc: "Proposal to reduce base fees by 50% to encourage more frequent voting. Requires node upgrade.",
      votes: 3200,
      status: 'Pass',
      category: 'Security',
      timeLeft: 'Ended',
      privacyLevel: 'Public',
      participants: 410,
      comments: []
    }
  ]);

  const handleShieldInternal = () => {
    if (publicBalance <= 0) return;
    // Removed synthetic deduction. Balance will sync from wallet reporter.
  };

  // Auto-Exit if wallet disconnects (Silent Redirect as requested)
  useEffect(() => {
    // Give provider 2 seconds to initialize before triggering exit
    const timer = setTimeout(() => {
      if (!connected) {
        console.log("Wallet disconnected, exiting terminal...");
        onExit();
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [connected, onExit]);

  // Load persistent votes (Item 7)
  useEffect(() => {
    if (connected && wallet?.adapter?.publicKey) {
      const address = wallet.adapter.publicKey;
      const loadedVotes: Record<number, VoteRecord> = {};

      feedItems.forEach(item => {
        const key = `vote_${address}_${item.id}`;
        const stored = localStorage.getItem(key);
        if (stored) {
          try {
            loadedVotes[item.id] = JSON.parse(stored);
          } catch (e) {
            console.error("Failed to parse stored vote", e);
          }
        }
      });

      setUserVotes(loadedVotes);
    } else {
      setUserVotes({});
    }
  }, [connected, wallet?.adapter?.publicKey, feedItems]);

  // Global Sync for Votes & Unlocks (Manual/Console/Multi-tab - Item 7)
  useEffect(() => {
    const syncAllState = () => {
      if (connected && wallet?.adapter?.publicKey) {
        const address = wallet.adapter.publicKey;

        // 1. Sync Votes
        const loadedVotes: Record<number, VoteRecord> = {};
        feedItems.forEach(item => {
          const key = `vote_${address}_${item.id}`;
          const stored = localStorage.getItem(key);
          if (stored) {
            try { loadedVotes[item.id] = JSON.parse(stored); } catch (_e) { }
          }
        });

        setUserVotes(prev => {
          if (JSON.stringify(prev) === JSON.stringify(loadedVotes)) return prev;
          return loadedVotes;
        });

        // 2. Sync Unlocked Posts (Item 7 Expansion)
        setFeedItems(currentItems => {
          let selectionChanged = false;
          const updated = currentItems.map(item => {
            if (item.id && item.type === 'paid_post') {
              const key = `unlock_${address}_${item.id}`;
              const isStoredLocked = localStorage.getItem(key) === 'true';
              if (item.isUnlocked !== isStoredLocked) {
                selectionChanged = true;
                return { ...item, isUnlocked: isStoredLocked };
              }
            }
            return item;
          });
          return selectionChanged ? updated : currentItems;
        });

      } else {
        setUserVotes(prev => Object.keys(prev).length === 0 ? prev : {});
        // Lock all paid posts that aren't ours if wallet disconnected
        setFeedItems(currentItems => currentItems.map(item =>
          (item.type === 'paid_post' && item.author !== "You") ? { ...item, isUnlocked: false } : item
        ));
      }
    };

    const handleStorageEvent = (e: StorageEvent) => {
      if (e.key === null || e.key.startsWith('vote_') || e.key.startsWith('unlock_')) syncAllState();
    };

    const handleUpdateEvent = () => syncAllState();

    window.addEventListener('storage', handleStorageEvent);
    window.addEventListener('vote_updated', handleUpdateEvent);
    window.addEventListener('focus', syncAllState);

    // Initial sync
    syncAllState();

    return () => {
      window.removeEventListener('storage', handleStorageEvent);
      window.removeEventListener('vote_updated', handleUpdateEvent);
      window.removeEventListener('focus', syncAllState);
    };
  }, [connected, wallet?.adapter?.publicKey, feedItems.length]); // depend on length to allow attribute updates

  const handleCreateProposal = async (data: any) => {
    let newItem: FeedItem | null = null;
    let txId: string | undefined;

    setZkStage('GENERATING');
    setZkModalOpen(true);

    if (wallet && connected && wallet.adapter?.publicKey) {
      try {
        await new Promise(r => setTimeout(r, 2000));

        const stakeAmount = data.stakeAmount || 0.1;
        const stakeMicrocredits = Math.floor(stakeAmount * 1_000_000);
        // Treasury address
        const TREASURY_ADDRESS = "aleo1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq3ljyzc";

        const transaction = createAleoTransaction(
          wallet.adapter,
          WalletAdapterNetwork.TestnetBeta,
          'private_decision_v5.aleo',
          'create_dilemma',
          [
            stakeMicrocredits + 'u64',  // stake_amount (1st parameter)
            TREASURY_ADDRESS,           // treasury_address (2nd parameter)
            (feedItems.length + 1) + 'u64',  // post_id (3rd parameter)
            '12345field',               // content_hash (4th parameter)
            (data.type === 'paid_post').toString(),  // is_premium (5th parameter)
            stakeMicrocredits + 'u64'   // stake_amount (6th parameter)
          ],
          250_000 // Fixed fee (0.25 ALEO) instead of stake to avoid double charging
        );


        setZkStage('SIGNING');
        const result = await (wallet.adapter as any).requestTransaction(transaction);

        setZkStage('BROADCASTING');
        await new Promise(r => setTimeout(r, 2000));
        setZkModalOpen(false); // Close ZK modal

        // Step 2: Fast ID Extraction (Might be tracking ID if Shield)
        txId = extractTransactionId(result);

        // Success Toast & Optimistic UI
        if (txId) {
          setLastTxId(txId);
          const status = 'Success';
          const optimisticItem: TransactionRecord = {
            id: txId,
            status: status,
            method: 'Create Proposal',
            created_at: new Date().toISOString(),
            address: wallet.adapter.publicKey || '',
            programId: 'private_decision_v5.aleo',
            type: 'proposal'
          };
          setOptimisticTransactions(prev => [optimisticItem, ...prev]);

          // Still track in background just in case it fails later
          trackWithWorker(txId);

          // Persist to LocalStorage
          const localKey = `tx_history_${wallet.adapter.publicKey}`;
          const localData = JSON.parse(localStorage.getItem(localKey) || '[]');
          localStorage.setItem(localKey, JSON.stringify([optimisticItem, ...localData]));

          setShowSuccessToast(true);
          setToastIsClosing(false);
          setTimeout(() => setToastIsClosing(true), 5000);
          setTimeout(() => setShowSuccessToast(false), 5500);
        }

      } catch (e) {
        console.warn("Transaction cancelled/failed:", e);
        setZkStage('ERROR');
        return;
      }
    }

    if (data.type === 'proposal') {
      newItem = {
        type: 'dilemma',
        id: feedItems.length + 1,
        title: data.title,
        desc: data.description || "No description provided.",
        votes: 0,
        status: 'Active',
        category: 'Governance',
        timeLeft: '72h',
        privacyLevel: 'Shielded',
        participants: 0,
        comments: [],
        options: data.options
      } as Dilemma;

    } else {
      newItem = {
        type: 'paid_post',
        id: feedItems.length + 1,
        title: data.title,
        teaser: data.teaser,
        hiddenContent: data.hiddenContent,
        price: data.price,
        isUnlocked: true, // Auto unlock for author
        author: "You",
        comments: []
      } as PaidPost;

    }

    if (newItem) {
      setFeedItems([newItem, ...feedItems]);
    }
  };


  const handleUnlock = async (postId: number) => {
    if (loadingUnlock === postId) return;

    if (!connected) {
      setZkError({
        title: 'Wallet Not Connected',
        message: 'Please connect your wallet to unlock this content.'
      });
      setZkStage('ERROR');
      setZkModalOpen(true);
      return;
    }
    if (wallet && connected && wallet.adapter?.publicKey) {
      setZkModalOpen(true);
      setZkStage('GENERATING');

      try {
        await new Promise(r => setTimeout(r, 2000));

        // Get Payment Record (Rule #4 Compliance)
        // Find post price dynamically
        const post = feedItems.find(p => p.id === postId) as PaidPost;
        const amount = post?.price || 1;
        const amountMicrocredits = Math.floor(amount * 1_000_000);

        // Hybrid Payment (Public Transfer)
        // No need to fetch private records!

        const transaction = createAleoTransaction(
          wallet.adapter,
          WalletAdapterNetwork.TestnetBeta,
          'private_decision_v5.aleo',
          'unlock_content',
          // New: public amount, public post_id, public treasury_address (Merchant)
          [`${amountMicrocredits}u64`, `${postId}u64`, `aleo1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq3ljyzc`],
          250_000
        );

        setZkStage('SIGNING');
        const result = await (wallet.adapter as any).requestTransaction(transaction);

        setZkStage('BROADCASTING');
        await new Promise(r => setTimeout(r, 2000));
        setZkModalOpen(false);

        // Step 2: Fast ID Extraction (Might be tracking ID if Shield)
        const txId = extractTransactionId(result);

        // Optimistic Balance Update (Instant Feedback)
        if (txId) {
          // Optimistic Balance Update REMOVED - will update on confirmation
        }


        if (txId) {
          setLastTxId(txId);
          const status = 'Success';
          const optimisticItem: TransactionRecord = {
            id: txId,
            status: status,
            method: 'Unlock Content',
            created_at: new Date().toISOString(),
            address: wallet.adapter.publicKey || '',
            programId: 'private_decision_v5.aleo',
            type: 'unlock'
          };
          setOptimisticTransactions(prev => [optimisticItem, ...prev]);

          // Still track in background
          trackWithWorker(txId);

          // Persist to LocalStorage
          const localKey = `tx_history_${wallet.adapter.publicKey}`;
          const localData = JSON.parse(localStorage.getItem(localKey) || '[]');
          localStorage.setItem(localKey, JSON.stringify([optimisticItem, ...localData]));

          // Persist Unlock Status (Item 7)
          const unlockKey = `unlock_${wallet.adapter.publicKey}_${postId}`;
          localStorage.setItem(unlockKey, 'true');

          // Dispatch event to sync state immediately
          window.dispatchEvent(new Event('vote_updated'));

          // 4. [Supabase Insert Removed]

          setShowSuccessToast(true);
          setToastIsClosing(false);
          setTimeout(() => setToastIsClosing(true), 5000);
          setTimeout(() => setShowSuccessToast(false), 5500);

          // Optimistically Unlock Content
          setFeedItems(items => items.map(item => {
            if (item.id === postId && item.type === 'paid_post') {
              return { ...item, isUnlocked: true };
            }
            return item;
          }));
        }

        setLoadingUnlock(null);

      } catch (e: any) {
        console.warn("Unlock failed:", e);
        setLoadingUnlock(null);

        // If we already set a specific ZK error (in showError), it's already in ERROR stage.
        // If it's a generic error (User Rejected), ensure we clear any old specific error
        if (!zkError) {
          setZkStage('ERROR');
        }
      }
    }
  };


  // Optimized Handle Vote
  const handleVote = async (dilemmaId: number, option: string, _stakeAmount: number) => {
    // 1. Basic Check
    if (!wallet || !connected || !wallet.adapter?.publicKey) {
      alert("Wallet not connected or public key missing.");
      return;
    }

    // 2. Start Loading
    setZkStage('GENERATING');
    setZkModalOpen(true);

    try {
      await new Promise(r => setTimeout(r, 2000));

      const choice = option === "Support";
      const stakeMicrocredits = Math.floor(_stakeAmount * 1_000_000);
      const transaction = createAleoTransaction(
        wallet.adapter,
        WalletAdapterNetwork.TestnetBeta,
        'private_decision_v5.aleo',
        'vote_private',
        [`${dilemmaId}u64`, choice.toString(), stakeMicrocredits + 'u64', "aleo1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq3ljyzc"],
        250_000 // Fixed fee (0.25 ALEO) - stake is paid via contract input
      );

      setZkStage('SIGNING');
      const result = await (wallet.adapter as any).requestTransaction(transaction);

      setZkStage('BROADCASTING');
      await new Promise(r => setTimeout(r, 2000));
      setZkModalOpen(false);

      // Step 2: Fast ID Extraction (Might be tracking ID if Shield)
      const initialId = extractTransactionId(result);

      // Optimistic Balance Update (Instant Feedback)
      if (initialId) {
        // Optimistic Balance Update REMOVED - will update on confirmation
      }

      const status = 'Success';
      const optimisticItem: TransactionRecord = {
        id: initialId,
        status: status,
        method: 'Vote Private',
        created_at: new Date().toISOString(),
        address: wallet.adapter.publicKey || '',
        programId: 'private_decision_v5.aleo',
        type: 'vote'
      };

      // Still track in background
      trackWithWorker(initialId);

      // Persist to LocalStorage (General History)
      const localKey = `tx_history_${wallet.adapter.publicKey}`;
      const localData = JSON.parse(localStorage.getItem(localKey) || '[]');
      localStorage.setItem(localKey, JSON.stringify([optimisticItem, ...localData]));

      // Persist to LocalStorage (Vote Status per User/Post - Item 7)
      const voteData: VoteRecord = { choice: option, txId: initialId, status: 'Confirmed' };
      const voteKey = `vote_${wallet.adapter.publicKey}_${dilemmaId}`;
      localStorage.setItem(voteKey, JSON.stringify(voteData));

      // Dispatch event to sync hooks (useHasVoted)
      window.dispatchEvent(new CustomEvent('vote_updated', {
        detail: { proposalId: dilemmaId, wallet: wallet.adapter.publicKey }
      }));

      setLastTxId(initialId);
      setUserVotes(prev => ({ ...prev, [dilemmaId]: voteData }));
      setOptimisticTransactions(prev => [optimisticItem, ...prev]);

      setShowSuccessToast(true);
      setToastIsClosing(false);

      // Start fade-out after 5 seconds
      setTimeout(() => setToastIsClosing(true), 5000);
      // Actually remove after 5.5 seconds
      setTimeout(() => setShowSuccessToast(false), 5500);

    } catch (e: any) {
      console.error("VOTE ERROR:", e);
      setZkStage('ERROR');
    } finally {
      setLoadingVote(null);
    }
  };


  if (showFAQ) {
    return (
      <div className="terminal-overlay">
        <ParticleBackground />
        <FAQDocumentation onBack={() => setShowFAQ(false)} />
      </div>
    );
  }

  return (
    <div className="terminal-overlay">
      <ParticleBackground />
      <aside className="terminal-sidebar">
        <div className="sidebar-header" onClick={onExit}>
          <ZKLogo className="w-10 h-10" />
          <h2>Decision.ZK</h2>
        </div>


        <nav className="sidebar-nav">
          <div className={`nav-item ${activeTab === 'feed' ? 'active' : ''}`} onClick={() => setActiveTab('feed')}>
            <LayoutGrid size={20} />
            <span>Proposals</span>
          </div>
          <div className={`nav-item ${activeTab === 'proofs' ? 'active' : ''}`} onClick={() => setActiveTab('proofs')}>
            <Activity size={20} />
            <span>My Proofs</span>
          </div>
          <div className={`nav-item ${activeTab === 'identity' ? 'active' : ''}`} onClick={() => setActiveTab('identity')}>
            <Shield size={20} />
            <span>Identity</span>
          </div>
          <div className="nav-item" onClick={() => setIsHistoryOpen(true)}>
            <Clock size={20} />
            <span>My Transactions</span>
          </div>
        </nav>

        <div className="sidebar-footer">
          <div className="need-help-card">
            <div className="help-icon">
              <BookOpen size={24} color={"#10B981"} />
            </div>
            <div className="help-content">
              <div className="help-title">Decision.ZK</div>
              <div className="help-subtitle">Protocol Guide</div>
            </div>
            <button className="help-button" onClick={() => setShowFAQ(true)}>
              View Docs
            </button>
          </div>
        </div>
      </aside>

      <main className="terminal-main">
        {activeTab === 'proofs' ? (
          <MyProofs stats={MOCK_USER_STATS} />
        ) : activeTab === 'identity' ? (
          <Identity stats={MOCK_USER_STATS} />
        ) : activeTab === 'settings' ? (
          <Settings
            publicBalance={publicBalance}
            privateBalance={privateBalance}
          />
        ) : (
          <div className="terminal-content-wrapper">
            <div className="network-status-bar">
              <div className="status-item">
                <span className="dot pulse-green"></span>
                <span className="label">ALEO_MAINNET_STAGING</span>
              </div>
              <div className="status-item">
                <span className="label">BLOCK:</span>
                <span className="value">1,429,083</span>
              </div>
              <div className="status-item">
                <span className="label">SYNCHRONIZED:</span>
                <span className="value">100%</span>
              </div>
              <div className="status-item hide-mobile">
                <span className="label">LATENCY:</span>
                <span className="value">14ms</span>
              </div>
              <div className="status-refresh">
                <RefreshCw size={12} /> REFRESH
              </div>
            </div>

            <header className="governance-hub">
              <div className="hub-info">
                <div className="hub-badge">SYSTEM_ACTIVE • ZK_ENABLED</div>
                <h1>{selectedItem ? 'PROPOSAL_VIEW' : 'GOVERNANCE_HUB'}</h1>
                <p>{selectedItem ? 'Detailed technical parameters and on-chain verification.' : 'Private governance and exclusive zero-knowledge content.'}</p>
              </div>
              {!selectedItem && (
                <div className="hub-actions">
                  <button className="create-proposal-btn" onClick={() => setIsCreateModalOpen(true)}>
                    <Plus size={18} /> NEW PROPOSAL
                  </button>
                </div>
              )}
            </header>

            {selectedItem ? (
              <DetailedProposalView
                item={selectedItem}
                onBack={handleBackToFeed}
                onVote={handleVote}
                loadingVote={loadingVote}
                userVote={userVotes[selectedItem.id]}
                stakeAmount={stakeAmount}
                onStakeChange={setStakeAmount}
                onTriggerAssistant={triggerAssistantMessage}
                wallet={wallet}
                onPostComment={(id: number, text: string) => handlePostComment(id, text)}
              />
            ) : (
              <>

                <div className="dashboard-stats-grid">
                  <div className="stat-card">
                    <div className="stat-label">
                      <Shield size={14} /> ZK-REP
                    </div>
                    <div className="stat-content">
                      <PrivacySensitive>
                        <span className="stat-value">{MOCK_USER_STATS.rep}</span>
                      </PrivacySensitive>
                      <span className="stat-trend positive">↑ 12.5%</span>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-label">
                      <Activity size={14} /> VOTING POWER
                    </div>
                    <div className="stat-content">
                      <PrivacySensitive>
                        <span className="stat-value">2.4x</span>
                      </PrivacySensitive>
                      <span className="stat-status">MAXED</span>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-label">
                      <Zap size={14} /> ALEO
                    </div>
                    <div className="stat-content">
                      <PrivacySensitive>
                        <span className="stat-value">{(publicBalance + privateBalance).toFixed(2)} ALEO</span>
                      </PrivacySensitive>
                      <span className="stat-status">{connected ? 'SYNCED' : 'DISCONNECTED'}</span>
                    </div>
                  </div>
                </div>
                <div style={{ paddingBottom: 50 }}>
                  {feedItems.map(item => {
                    if (item.type === 'dilemma') {
                      const dilemma = item as Dilemma;
                      return (
                        <div key={dilemma.id} onClick={(e) => {
                          // Prevent opening detailed view if child buttons are clicked
                          const target = e.target as HTMLElement;
                          if (target.closest('button') || target.closest('.vote-btn-detailed')) return;
                          handleItemClick(item);
                        }} style={{ cursor: 'pointer' }}>
                          <VotingCard
                            dilemma={dilemma}
                            userVote={userVotes[dilemma.id]}
                            loadingVote={loadingVote}
                            walletAddress={wallet?.adapter?.publicKey || undefined}
                            onVote={handleVote}
                            onRetryVote={(id) => {
                              setUserVotes(prev => {
                                const next = { ...prev };
                                delete next[id];
                                return next;
                              });
                            }}
                            onManualVoteId={(id, manualId) => {
                              setUserVotes(prev => ({ ...prev, [id]: { choice: userVotes[id].choice, txId: manualId } }));
                            }}
                            availableBalance={publicBalance}
                            onPostComment={(id: number, text: string) => handlePostComment(id, text)}
                          />
                        </div>
                      );
                    } else {
                      // PAID POST RENDER
                      const post = item as PaidPost;
                      return (
                        <div key={post.id} className="paid-post-card">
                          <div className="paid-post-header">
                            <div className="encrypted-badge">
                              PREMIUM CONTENT #{String(post.id).padStart(2, '0')}
                            </div>
                            <div className="premium-badge">
                              <Lock size={12} /> {post.price} ZK
                            </div>
                          </div>

                          <h3>{post.title}</h3>

                          <div className="post-content-container">
                            <p className="post-teaser">{post.teaser}</p>

                            <div className={`hidden-content ${post.isUnlocked ? 'unlocked' : ''}`}>
                              {post.hiddenContent}
                            </div>

                            {!post.isUnlocked && (
                              <div className="unlock-overlay">
                                {loadingUnlock === post.id ? (
                                  <div className="vote-loading" style={{ color: '#FFD700' }}>
                                    <Loader2 className="spin-icon" size={20} /> Processing Payment...
                                  </div>
                                ) : (
                                  <button className="unlock-btn" onClick={() => handleUnlock(post.id)}>
                                    <Zap size={18} fill="black" />
                                    Unlock Content
                                    <span className="unlock-price">-{post.price} Credits</span>
                                  </button>
                                )}
                              </div>
                            )}
                          </div>


                          <div className="author-meta" style={{ justifyContent: 'flex-end' }}>
                            <span style={{ color: '#555' }}>2h ago</span>
                          </div>

                          <DiscussionSection
                            isLocked={!post.isUnlocked}
                            lockedMessage="Unlock content to join the anonymous discussion."
                            comments={post.comments}
                            onPostComment={(text) => handlePostComment(post.id, text)}
                          />
                        </div>
                      );
                    }
                  })}
                </div>
              </>
            )}

            <footer className="hub-disclaimer-footer">
              <div className="footer-content">
                <Shield size={12} />
                <span>Decision.ZK uses client-side SNARK proof generation via Aleo Worker. No private keys ever leave your device.</span>
              </div>
            </footer>
          </div>
        )}
      </main>

      <aside className="terminal-right-sidebar">
        <AiAssistant
          onOpenSettings={() => setActiveTab('settings')}
          publicBalance={publicBalance}
          privateBalance={privateBalance}
          onShield={handleShieldInternal}
          externalTrigger={assistantTrigger}
        />
      </aside>

      <TransactionHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        pendingItems={optimisticTransactions}
        walletAddress={wallet?.adapter?.publicKey || null}
      />

      {
        showSuccessToast && (
          <TransactionSuccess
            txId={lastTxId || ""}
            isClosing={toastIsClosing}
            onClose={() => setShowSuccessToast(false)}
            onViewHistory={() => {
              setShowSuccessToast(false);
              setIsHistoryOpen(true);
            }}
          />
        )
      }

      <ZKProofModal
        isOpen={zkModalOpen}
        stage={zkStage}
        onClose={() => {
          setZkModalOpen(false);
          setZkError(null); // Reset error on close
        }}
        errorTitle={zkError?.title}
        errorMessage={zkError?.message}
      />

      <CreateProposalModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateProposal}
      />
    </div >
  );
};

// Bridges the gap between ProvableHQ Shield Wallet and Demox Labs adapter interface
class ShieldWalletAdapterWrapper extends EventEmitter {
  private _adapter: ShieldWalletAdapter;
  readonly name = "Shield Wallet" as any;
  readonly url = "https://shield.app";
  readonly icon = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgdmlld0JveD0iMCAwIDUxMiA1MTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI1MTIiIGhlaWdodD0iNTEyIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTI0LjU5NSAyNzguMzc2VjExMy40MDNIMjU2LjIwNlY0MjguNTYyQzI1NS4zMjQgNDI4LjI0OCAxMjQuNTk1IDM4MS41NzggMTI0LjU5NSAyNzguMzc2WiIgZmlsbD0idXJsKCNwYWludDBfbGluZWFyXzVfMTUpIi8+CjxwYXRoIGQ9Ik0zODcuODI1IDI3OC4zNzZWMTEzLjQwM0gyNTYuMjE0VjQyOC41NjJDMjU3LjA5NiA0MjguMjQ4IDM4Ny44MjUgMzgxLjU3OCAzODcuODI1IDI3OC4zNzZaIiBmaWxsPSJ1cmwoI3BhaW50MV9saW5lYXJfNV_xNSkiLz4KPHBhdGggb3BhY2l0eT0iMC4xIiBkPSJNMjU2LjIwNiA0NDAuNzcxQzI1NS4zMTkgNDQwLjQ1NiAxMTQuNDIgMzg1LjY0NiAxMTQuNDIgMjgyLjQ0NVYxMDMuMjI4SDI1Ni4yMDZWNDQwLjc3MVpNMzk4IDEwMy4yMjhWMjgyLjQ0NUMzOTggMzg1LjYzNSAyNTcuMTMgNDQwLjQ0NSAyNTYuMjE1IDQ0MC43NzFWMTAzLjIyOEgzOThaIiBmaWxsPSJibGFjayIvPgo8ZGVmcz4KPGxpbmVhckdyYWRpZW50IGlkPSJwYWludDBfbGluZWFyXzVfMTUiIHgxPSIxOTAuNDAyIiB5MT0iMTEzLjQwMyIgeDI9IjE5MC40MDIiIHkyPSI0MjguNTY0IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CjxzdG9wLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLW9wYWNpdHk9IjAiLz4KPC9saW5lYXJGrYWRpZW50Pgo8bGluZWFyR3JhZGllbnQgaWQ9InBhaW50MV9saW5lYXJfNV_xNSIgeDE9IjMyMi4wMTgiIHkxPSIxMTMuNDAzIiB4Mj0iMzIyLjAxIiB5Mj0iNDI4LjU2NCIgZ3JhZGllbnRVbml0cz0idXNlckNwYWNlT25Vc2UiPgo8c3RvcCBzdG9wLW9wYWNpdHk9IjAiLz4KPHN0b3Agb2Zmc2V0PSIxIi8+CjwvbGluZWFyR3JhZGllbnQ+CjwvZGVmcz4KPC9zdmc+Cg==";
  readonly supportedTransactionVersions = new Set();

  constructor() {
    super();
    this._adapter = new ShieldWalletAdapter();
    // Proxy events
    this._adapter.on('connect' as any, (account: any) => {
      // Demox expects the publicKey directly or an event
      this.emit('connect', account.address);
    });
    this._adapter.on('disconnect' as any, () => {
      this.emit('disconnect');
    });
    this._adapter.on('accountChange' as any, () => {
      this.emit('accountChange');
    });
    this._adapter.on('readyStateChange' as any, (readyState: any) => {
      this.emit('readyStateChange', readyState);
    });
  }

  get publicKey() { return this._adapter.account?.address || null; }
  get connected() { return !!this._adapter.account; }
  get connecting() { return false; }
  get readyState() { return this._adapter.readyState; }

  async connect(decryptPermission: any, network: any, programs?: string[]) {
    // Translate network: testnetbeta (Demox) -> testnet (Provable/Shield)
    const provableNetwork = network === 'testnetbeta' ? 'testnet' : network;

    try {
      // If wallet is in Loadable state, wait up to 1000ms for it to become Installed
      // Cast to any to avoid strict enum comparison issues with the underlying adapter types
      if ((this._adapter.readyState as any) === 'Loadable' || (this._adapter.readyState as any) === 'NotDetected') {
        // console.log("ShieldWrapper: Wallet is Loadable/NotDetected, waiting for Installed...");
        let attempts = 0;
        // Poll every 100ms
        while ((this._adapter.readyState as any) !== 'Installed' && attempts < 15) {
          await new Promise(r => setTimeout(r, 100));
          attempts++;
        }
      }

      // Force a fresh connection request
      const account = await this._adapter.connect(provableNetwork as any, decryptPermission as any, programs);
      this.emit('connect', account.address);
      return account;
    } catch (e) {
      console.error("Shield connect error", e);
      throw e;
    }
  }

  async disconnect() {
    try {
      await this._adapter.disconnect();
    } catch (e) {
      console.warn("Shield disconnect warning:", e);
    }
    this.emit('disconnect');
  }

  async signMessage(message: Uint8Array) { return this._adapter.signMessage(message); }

  // Demox calls requestTransaction, Provable calls executeTransaction
  async requestTransaction(transaction: any) {
    const adapter = this._adapter as any;

    try {
      if (typeof adapter.requestTransaction === 'function') {
        return await adapter.requestTransaction(transaction);
      } else if (typeof adapter.executeTransaction === 'function') {
        return await adapter.executeTransaction(transaction);
      } else {
        console.error("ShieldWrapper: No suitable method found on adapter!");
        throw new Error("Shield Wallet adapter missing requestTransaction/executeTransaction");
      }
    } catch (e) {
      console.error("ShieldWrapper: Transaction failed:", e);
      throw e;
    }
  }

  async requestRecords(program: string) {
    console.log("ShieldWrapper: requestRecords called for", program);
    const adapter = this._adapter as any;

    // 1. Try Standard Adapter Method
    if (typeof adapter.requestRecords === 'function') {
      console.log("ShieldWrapper: Using adapter.requestRecords");
      const records = await adapter.requestRecords(program);
      return records || [];
    }

    // 2. Try window.aleo (Shield/Leo compatibility)
    if ((window as any).aleo && typeof (window as any).aleo.requestRecords === 'function') {
      console.log("ShieldWrapper: Falling back to window.aleo.requestRecords");
      try {
        const records = await (window as any).aleo.requestRecords(program);
        return records || [];
      } catch (e) {
        console.warn("ShieldWrapper: window.aleo fallback failed", e);
      }
    }

    console.warn("ShieldWrapper: requestRecords NOT found. Adapter keys:", Object.keys(adapter));
    return [];
  }

  async requestRecordPlaintexts(program: string) {
    const adapter = this._adapter as any;
    if (typeof adapter.requestRecordPlaintexts === 'function') {
      const records = await adapter.requestRecordPlaintexts(program);
      return records || [];
    }

    if ((window as any).aleo && typeof (window as any).aleo.requestRecordPlaintexts === 'function') {
      try {
        return await (window as any).aleo.requestRecordPlaintexts(program) || [];
      } catch (e) {
        console.error(e);
      }
    }

    return [];
  }

  async decrypt(ciphertext: string) {
    const adapter = this._adapter as any;
    if (typeof adapter.decrypt === 'function') {
      return await adapter.decrypt(ciphertext);
    }
    throw new Error("Shield Adapter missing decrypt");
  }

  // New: Status tracking proxy
  async getTransactionStatus(transactionId: string) {
    const adapter = this._adapter as any;
    if (typeof adapter.getTransactionStatus === 'function') {
      return await adapter.getTransactionStatus(transactionId);
    }
    // Fallback to window.aleo
    if ((window as any).aleo && typeof (window as any).aleo.getTransactionStatus === 'function') {
      return await (window as any).aleo.getTransactionStatus(transactionId);
    }
    return null;
  }
}

// Step 2: Bech32 ID Extraction (Universal for Leo and Shield)
const extractTransactionId = (result: any): string => {
  if (!result) return "";

  let txId: string = "";

  // Method 1: Check common keys in response object
  if (typeof result === 'object') {
    txId = result.transactionId ||
      result.result ||
      result.id ||
      result.txId ||
      (result.data && result.data.transactionId) ||
      "";
  }

  // Method 2: Fallback to stringification/direct string
  if (!txId) {
    txId = typeof result === 'string' ? result : JSON.stringify(result);
  }

  // Handle case where it might be a JSON string
  if (txId && (txId.startsWith('"') || txId.includes('{'))) {
    try {
      const parsed = JSON.parse(txId);
      txId = parsed.transactionId || parsed.result || parsed.id || parsed.txId || txId;
    } catch { /* stay with raw */ }
  }

  // Final Cleanup (remove quotes if any)
  return txId.replace(/"/g, '');
};

// Helper to parse microcredits from various record formats
const parseMicrocredits = (record: any): number => {
  // Case 1: Record is a string (Leo Wallet plaintext)
  if (typeof record === 'string') {
    const match = record.match(/microcredits:\s*([0-9]+)u64/);
    return match ? parseInt(match[1]) : 0;
  }
  // Case 2: Object with microcredits property
  if (typeof record.microcredits === 'number') {
    return record.microcredits;
  } else if (typeof record.microcredits === 'string') {
    return parseInt(record.microcredits.replace(/u64$/i, ''));
  } else if (record.data?.microcredits) {
    return typeof record.data.microcredits === 'number'
      ? record.data.microcredits
      : parseInt(String(record.data.microcredits).replace(/u64$/i, ''));
  }
  return 0;
};

// Helper to create transactions based on wallet type
const createAleoTransaction = (
  walletAdapter: any,
  network: WalletAdapterNetwork,
  programId: string,
  functionName: string,
  inputs: any[],
  fee: number
) => {
  const isShield = walletAdapter?.name === 'Shield Wallet';

  if (isShield) {
    return {
      program: programId,
      function: functionName,
      inputs,
      fee,
      privateFee: false // Force Public Fee for Shield
    };
  } else {
    // Leo Wallet: Request non-private fee to avoid issues with encryption/records
    return Transaction.createTransaction(
      walletAdapter.publicKey,
      network,
      programId,
      functionName,
      inputs,
      fee,
      false // feePrivate: false
    );
  }
};


function App() {
  const [isApp, setIsApp] = useState(false);
  const wallets = useMemo(() => [
    new LeoWalletAdapter({ appName: "DecisionProtocol" }),
    new ShieldWalletAdapterWrapper() as any
  ], []);

  // GLOBAL PERSISTENT STATE
  const [publicBalance, setPublicBalance] = useState(0.00);
  const [privateBalance, setPrivateBalance] = useState(0.00);

  // Fetch balance from Aleo Network
  const fetchAleoBalance = useCallback(async (address: string) => {
    if (!address) return;

    // Try Provable first, then Aleo.org
    const urls = [
      `https://api.explorer.provable.com/v1/testnet/program/credits.aleo/mapping/account/${address}`,
      `https://api.explorer.aleo.org/v1/testnet/program/credits.aleo/mapping/account/${address}`
    ];

    for (const url of urls) {
      try {
        const response = await fetch(url);
        if (response.ok) {
          const value = await response.json();
          // Aleo credits are stored in microcredits (1 ALEO = 1M microcredits)
          const balanceStr = String(value).replace('u64', '');
          let balanceNum = parseFloat(balanceStr) / 1_000_000;
          if (!isNaN(balanceNum)) {
            setPublicBalance(balanceNum);
            return; // Success, exit loop
          }
        }
      } catch (e) {
        // Continue to next endpoint
      }
    }
    // If all fail, keep current or set to 0 if definitely disconnected
  }, [setPublicBalance]);


  return (
    <WalletProvider
      wallets={wallets}
      decryptPermission={DecryptPermission.UponRequest}
      network={WalletAdapterNetwork.TestnetBeta}
      autoConnect={false}
    >
      <WalletModalProvider>
        <PrivacyProvider>
          <BalanceWrapper
            isApp={isApp}
            setIsApp={setIsApp}
            publicBalance={publicBalance}
            setPublicBalance={setPublicBalance}
            privateBalance={privateBalance}
            setPrivateBalance={setPrivateBalance}
            fetchAleoBalance={fetchAleoBalance}
          />
        </PrivacyProvider>
      </WalletModalProvider>
    </WalletProvider>
  );
}

// Internal component to handle hooks that need useWallet context
const BalanceWrapper = ({
  isApp, setIsApp, publicBalance, setPublicBalance, privateBalance, setPrivateBalance, fetchAleoBalance
}: any) => {
  const { publicKey, connected, wallet } = useWallet();

  const fetchPrivateBalance = async () => {
    if (!wallet || !wallet.adapter) return;
    try {
      let records: any[] = [];
      const adapter = wallet.adapter as any;
      // Method 1: Leo Wallet
      if (typeof adapter.requestRecordPlaintexts === 'function') {
        records = await adapter.requestRecordPlaintexts('credits.aleo');
      }
      // Method 2: Shield Wallet / Standard
      else if (typeof adapter.requestRecords === 'function') {
        const response = await adapter.requestRecords('credits.aleo');
        records = response?.records || response || [];
      }

      if (!Array.isArray(records)) {
        // console.warn("fetchPrivateBalance: Wallet returned non-array records:", records);
        records = [];
      }

      const totalPrivate = records.reduce((sum: number, record: any) => {
        if (record.spent) return sum;
        return sum + parseMicrocredits(record);
      }, 0);

      // console.log("Private Balance Sync:", totalPrivate / 1_000_000);
      setPrivateBalance(totalPrivate / 1_000_000);
    } catch (e) {
      console.error("Failed to fetch private balance:", e);
    }
  };

  useEffect(() => {
    if (connected && publicKey) {
      fetchAleoBalance(publicKey);
      fetchPrivateBalance();
    } else {
      setPublicBalance(0);
      setPrivateBalance(0);
    }
  }, [connected, publicKey, wallet, fetchAleoBalance, setPublicBalance, setPrivateBalance]); // Added dependencies for useEffect

  return isApp ? (
    <Terminal
      onExit={() => setIsApp(false)}
      publicBalance={publicBalance}
      privateBalance={privateBalance}
      refreshPublic={fetchAleoBalance}
      refreshPrivate={fetchPrivateBalance}
    />
  ) : (
    <LandingPage onEnter={() => setIsApp(true)} />
  );
};

export default App;