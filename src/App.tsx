import { useState, useMemo, useEffect, useCallback } from "react";
import { WalletProvider, useWallet } from "@demox-labs/aleo-wallet-adapter-react";
import { WalletModalProvider, WalletMultiButton } from "@demox-labs/aleo-wallet-adapter-reactui";
import { LeoWalletAdapter } from "@demox-labs/aleo-wallet-adapter-leo";
import { ShieldWalletAdapter } from "@provablehq/aleo-wallet-adaptor-shield";
import {
  Transaction,
  WalletAdapterNetwork,
  DecryptPermission
} from "@demox-labs/aleo-wallet-adapter-base";
import EventEmitter from "eventemitter3";
import { Shield, Zap, Lock, Activity, LayoutGrid, Menu, X, Cpu, UserCheck, Plus, Loader2, Clock, BookOpen } from "lucide-react";
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
import { ZKBadge } from "./ZKBadge";
import { MyProofs } from "./MyProofs";
import { Identity } from "./Identity";
import { AiAssistant } from "./AiAssistant";
import { CreateProposalModal } from "./CreateProposalModal";
import { TransactionHistoryModal, type TransactionRecord } from "./TransactionHistoryModal";
import { TransactionSuccess } from "./TransactionSuccess";
import { ZKProofModal } from "./ZKProofModal";
import { ZKLogo } from "./ZKLogo";
import { Settings } from "./Settings";
import { supabase } from "./supabaseClient";

const MOCK_USER_STATS = {
  rep: 92.4,
  votingPower: "4.5x",
  active: 3,
  proposals: 5,
  age: "42d",
  proofs: 15
};

import { CustomWalletModal } from "./CustomWalletModal";
import { VotingCard } from "./VotingCard";
import { DiscussionSection } from "./DiscussionSection";
import type { Dilemma, PaidPost, FeedItem, VoteRecord } from "./types";

const LandingPage = ({ onEnter, theme }: { onEnter: () => void, theme: 'dark' | 'neon' }) => {
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
      console.warn("Disconnect error:", e);
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
      <div className="bg-grid"></div>
      <ParticleBackground theme={theme} />
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
              <button className="header-cta" onClick={handleChangeWallet} style={{ background: 'transparent', border: '1px solid #00D9FF', color: '#fff' }}>
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
                <button className="mobile-cta" onClick={handleChangeWallet} style={{ background: '#333', color: '#fff' }}>
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
        <div className="hero-badges">
          <span className="hero-badge badge-aleo">
            <Zap size={14} /> POWERED BY ALEO
          </span>
          <span className="hero-badge badge-zk">
            <ZKLogo className="w-3.5 h-3.5" /> ZERO-KNOWLEDGE PROOFS
          </span>
        </div>
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
            <Lock size={24} color="#00D9FF" />
            <h3>Shield Identity</h3>
            <p>Your identity and stake are wrapped in a ZK-proof. Invisible to the public, verifiable by math.</p>
          </div>
          <div className="step-card">
            <Cpu size={24} color="#00D9FF" />
            <h3>Blind Stake</h3>
            <p>Vote on proposals without herd mentality. The count stays encrypted until the reveal phase.</p>
          </div>
          <div className="step-card">
            <UserCheck size={24} color="#00D9FF" />
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

      <ZKBadge />

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
  setPublicBalance,
  privateBalance,
  setPrivateBalance,
  theme,
  setTheme
}: {
  onExit: () => void;
  publicBalance: number;
  setPublicBalance: React.Dispatch<React.SetStateAction<number>>;
  privateBalance: number;
  setPrivateBalance: React.Dispatch<React.SetStateAction<number>>;
  theme: 'dark' | 'neon';
  setTheme: React.Dispatch<React.SetStateAction<'dark' | 'neon'>>;
}) => {
  const { connected, wallet } = useWallet();
  const [activeTab, setActiveTab] = useState('feed');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false);

  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [toastIsClosing, setToastIsClosing] = useState(false);

  const handleShieldInternal = () => {
    if (publicBalance <= 0) return;
    setTimeout(() => {
      setPrivateBalance(prev => prev + 5.00);
      setPublicBalance(prev => Math.max(0, prev - 5.00));
    }, 2000);
  };

  // WALLET GATEWAY CHECK
  if (!connected) {
    return (
      <div className="wallet-gateway-overlay">
        <div className="gateway-content">
          <div className="gateway-icon">
            <Lock size={64} color="#00D9FF" className="gateway-lock" />
          </div>
          <h2 className="gateway-title">System Locked</h2>
          <p className="gateway-desc">
            Access to the Zero-Knowledge Governance Terminal requires a secure wallet connection.
            Your identity remains chemically separated from your actions.
          </p>
          <div className="gateway-actions">
            <WalletMultiButton />
          </div>
          <button
            onClick={onExit}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#666',
              marginTop: 24,
              cursor: 'pointer',
              fontSize: '0.9rem',
              textDecoration: 'underline'
            }}
          >
            Return to Landing Page
          </button>
        </div>
      </div>
    );
  }

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
      price: 50,
      isUnlocked: false,
      author: "Deployer.aleo",
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

  const handleCreateProposal = async (data: any) => {
    let newItem: FeedItem | null = null;
    let txId: string | undefined;

    setZkStage('GENERATING');
    setZkModalOpen(true);

    if (wallet && connected && wallet.adapter?.publicKey) {
      try {
        await new Promise(r => setTimeout(r, 2000));

        const transaction = createAleoTransaction(
          wallet.adapter,
          'testnetbeta' as WalletAdapterNetwork,
          'v_klochkov_private_decision_v1.aleo',
          'create_dilemma',
          ['12345field', (data.type === 'paid_post').toString(), (data.price || 0) + 'u64', (feedItems.length + 1) + 'u64'],
          250_000,
          false
        );

        setZkStage('SIGNING');
        const result = await (wallet.adapter as any).requestTransaction(transaction);

        setZkStage('BROADCASTING');
        await new Promise(r => setTimeout(r, 2000));
        setZkModalOpen(false); // Close ZK modal

        // Resolve ID
        if (typeof result === 'object' && result !== null) {
          txId = (result as any).transactionId || (result as any).id || JSON.stringify(result);
        } else {
          txId = String(result);
        }

        // Shield Wallet Polling
        if (wallet.adapter.name === 'Shield Wallet' && txId && txId.startsWith('shield')) {
          try {
            txId = await pollShieldTransaction(wallet.adapter, txId);
          } catch (pollErr) { console.error(pollErr); }
        }

        // console.log("Proposal TX ID:", txId);

        // Success Toast & Optimistic UI
        if (txId) {
          setLastTxId(txId);
          const optimisticItem: TransactionRecord = {
            id: txId,
            status: 'Pending',
            method: 'Create Proposal',
            created_at: new Date().toISOString()
          };
          setOptimisticTransactions(prev => [optimisticItem, ...prev]);

          setShowSuccessToast(true);
          setToastIsClosing(false);
          setTimeout(() => setToastIsClosing(true), 5000);
          setTimeout(() => setShowSuccessToast(false), 5500);

          // Finalize in background
          setTimeout(async () => {
            setOptimisticTransactions(prev => prev.map(tx => tx.id === txId ? { ...tx, status: 'Success' } : tx));
          }, 10000);
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

  const [loadingUnlock, setLoadingUnlock] = useState<number | null>(null);

  const handleUnlock = async (postId: number) => {
    if (loadingUnlock === postId) return;

    if (!connected) {
      alert("Please connect wallet first");
      return;
    }
    if (wallet && connected && wallet.adapter?.publicKey) {
      setZkModalOpen(true);
      setZkStage('GENERATING');

      try {
        await new Promise(r => setTimeout(r, 2000));

        const transaction = createAleoTransaction(
          wallet.adapter,
          'testnetbeta' as WalletAdapterNetwork,
          'v_klochkov_private_decision_v1.aleo',
          'unlock_content',
          [`${postId}u64`],
          250_000,
          false
        );

        setZkStage('SIGNING');
        const result = await (wallet.adapter as any).requestTransaction(transaction);

        setZkStage('BROADCASTING');
        await new Promise(r => setTimeout(r, 2000));
        setZkModalOpen(false);

        // Resolve ID
        let txId: string;
        if (typeof result === 'object' && result !== null) {
          txId = (result as any).transactionId || (result as any).id || JSON.stringify(result);
        } else {
          txId = String(result);
        }

        // Shield Wallet Polling
        if (wallet.adapter.name === 'Shield Wallet' && txId && txId.startsWith('shield')) {
          try {
            txId = await pollShieldTransaction(wallet.adapter, txId);
          } catch (pollErr) { console.error(pollErr); }
        }


        if (txId) {
          setLastTxId(txId);
          const optimisticItem: TransactionRecord = {
            id: txId,
            status: 'Pending',
            method: 'Unlock Content',
            created_at: new Date().toISOString()
          };
          setOptimisticTransactions(prev => [optimisticItem, ...prev]);

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

          // Finalize
          setTimeout(async () => {
            setOptimisticTransactions(prev => prev.map(tx => tx.id === txId ? { ...tx, status: 'Success' } : tx));
          }, 10000);
        }

        setLoadingUnlock(null);

      } catch (e) {
        console.warn("Unlock failed:", e);
        setLoadingUnlock(null);
        setZkStage('ERROR');
      }
    }
  };

  const [userVotes, setUserVotes] = useState<Record<number, VoteRecord>>({});
  const [loadingVote, setLoadingVote] = useState<number | null>(null);
  const [lastTxId, setLastTxId] = useState<string | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [zkModalOpen, setZkModalOpen] = useState(false);
  const [zkStage, setZkStage] = useState<'GENERATING' | 'SIGNING' | 'BROADCASTING' | 'SUCCESS' | 'ERROR'>('GENERATING');




  const [optimisticTransactions, setOptimisticTransactions] = useState<TransactionRecord[]>([]);

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
      const transaction = createAleoTransaction(
        wallet.adapter,
        'testnetbeta' as WalletAdapterNetwork,
        'v_klochkov_private_decision_v1.aleo',
        'vote_private',
        [`${dilemmaId}u64`, choice.toString()],
        250_000,
        false
      );

      setZkStage('SIGNING');
      const result = await (wallet.adapter as any).requestTransaction(transaction);

      setZkStage('BROADCASTING');
      await new Promise(r => setTimeout(r, 2000));
      setZkModalOpen(false);

      let initialId: string;
      if (typeof result === 'object' && result !== null) {
        initialId = (result as any).transactionId || (result as any).id || JSON.stringify(result);
      } else {
        initialId = String(result);
      }

      // Shield Wallet: If ID starts with "shield", poll for the real one
      if (wallet.adapter.name === 'Shield Wallet' && initialId.startsWith('shield')) {
        try {
          const finalId = await pollShieldTransaction(wallet.adapter, initialId);
          initialId = finalId;
        } catch (pollErr) {
          console.error("Polling failed, using initial ID", pollErr);
        }
      }

      await supabase
        .from('transactions')
        .insert([{ id: initialId, status: 'Pending', method: 'Vote Private' }]);

      setLastTxId(initialId);
      setUserVotes(prev => ({ ...prev, [dilemmaId]: { choice: option, txId: initialId, status: 'Pending' } }));

      const optimisticItem: TransactionRecord = {
        id: initialId,
        status: 'Pending', // Show as Pending initially for demo realism
        method: 'Vote Private',
        created_at: new Date().toISOString()
      };
      setOptimisticTransactions(prev => [optimisticItem, ...prev]);

      setShowSuccessToast(true);
      setToastIsClosing(false);

      // Start fade-out after 5 seconds
      setTimeout(() => setToastIsClosing(true), 5000);
      // Actually remove after 5.5 seconds
      setTimeout(() => setShowSuccessToast(false), 5500);

      // ARTIFICIAL FINALIZATION (Simulate 10s wait for on-chain inclusion)
      setTimeout(async () => {
        // SIMULATE RANDOM FAILURE (10% chance) TO DEMONSTRATE ROLLBACK
        const randomFail = Math.random() < 0.1;

        if (randomFail) {
          // ROLLBACK
          // console.warn("Simulated Transaction Failure - Rolling back UI");
          setUserVotes(prev => {
            const next = { ...prev };
            delete next[dilemmaId]; // Remove local vote
            return next;
          });
          setOptimisticTransactions(prev => prev.map(tx => tx.id === initialId ? { ...tx, status: 'Failed' } : tx));

          // Trigger Error Toast (Reusing Success Toast logic for simplicity, normally would use separate Error Toast)
          // Ideally, we would have a specific error notification here.
          // For now, we update the status to Failed in the list.

          await supabase
            .from('transactions')
            .update({ status: 'Failed' })
            .eq('id', initialId);

        } else {
          // SUCCESS PATH
          // 1. Update UI
          setUserVotes(prev => ({ ...prev, [dilemmaId]: { ...prev[dilemmaId], status: 'Confirmed' } }));
          setOptimisticTransactions(prev =>
            prev.map(tx => tx.id === initialId ? { ...tx, status: 'Success' } : tx)
          );

          // 2. Persist to Supabase (Permanently)
          try {
            const { error } = await supabase
              .from('transactions')
              .update({ status: 'Success' })
              .eq('id', initialId);

            if (error) {
              await supabase.from('transactions').upsert([{
                id: initialId,
                status: 'Success',
                method: 'Vote Private'
              }]);
            }
          } catch (err) {
            console.error("Critical DB Sync Error:", err);
          }
        }
      }, 10000);

    } catch (e: any) {
      console.error("VOTE ERROR:", e);
      setZkStage('ERROR');
      // Do not clear the entire optimistic transactions array
    } finally {
      setLoadingVote(null);
    }
  };


  if (showFAQ) {
    return (
      <div className="terminal-overlay">
        <ParticleBackground theme={theme} />
        <FAQDocumentation onBack={() => setShowFAQ(false)} />
      </div>
    );
  }

  return (
    <div className={`terminal-overlay ${theme === 'neon' ? 'neon-mode' : ''}`}>
      <ParticleBackground theme={theme} />
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

        <div className="sidebar-create-section">
          <button className="create-proposal-btn" onClick={() => setIsCreateModalOpen(true)}>
            <Plus size={18} /> New Proposal
          </button>
        </div>

        <div className="sidebar-footer">
          <div className="need-help-card">
            <div className="help-icon">
              <BookOpen size={24} color={theme === 'neon' ? "#A855F7" : "#00D9FF"} />
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
            theme={theme}
            onThemeChange={setTheme}
          />
        ) : (
          <div className="terminal-content-wrapper">
            <header className="terminal-header">
              <div>
                <h1>Global Feed</h1>
                <p>Private governance and exclusive zero-knowledge content.</p>
              </div>
              <div className="header-stats-simple">
                <div className="stat-item">
                  <span className="value">{MOCK_USER_STATS.rep}</span>
                  <span className="label">ZK-REP</span>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-item">
                  <span className="value">{feedItems.length}</span>
                  <span className="label">Active</span>
                </div>
              </div>
            </header>
            <div style={{ paddingBottom: 50 }}>
              {feedItems.map(item => {
                if (item.type === 'dilemma') {
                  const dilemma = item as Dilemma;
                  return (
                    <VotingCard
                      key={dilemma.id}
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
                    />
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


                      <div className="author-meta">
                        <div className="author-avatar"></div>
                        <span>Posted by {post.author}</span>
                        <span style={{ marginLeft: 'auto', color: '#555' }}>2h ago</span>
                      </div>

                      <DiscussionSection
                        proposalId={post.id}
                        isLocked={!post.isUnlocked}
                        lockedMessage="Unlock content to join the anonymous discussion."
                        initialComments={post.comments}
                      />
                    </div>
                  );
                }
              })}
            </div>
          </div>
        )}
      </main>

      <aside className="terminal-right-sidebar">
        <AiAssistant
          onOpenSettings={() => setActiveTab('settings')}
          publicBalance={publicBalance}
          privateBalance={privateBalance}
          onShield={handleShieldInternal}
        />
      </aside>

      <TransactionHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        pendingItems={optimisticTransactions}
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
        onClose={() => setZkModalOpen(false)}
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
  readonly icon = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgdmlld0JveD0iMCAwIDUxMiA1MTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI1MTIiIGhlaWdodD0iNTEyIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTI0LjU5NSAyNzguMzc2VjExMy40MDNIMjU2LjIwNlY0MjguNTYyQzI1NS4zMjQgNDI4LjI0OCAxMjQuNTk1IDM4MS41NzggMTI0LjU5NSAyNzguMzc2WiIgZmlsbD0idXJsKCNwYWludDBfbGluZWFyXzVfMTUpIi8+CjxwYXRoIGQ9Ik0zODcuODI1IDI3OC4zNzZWMTEzLjQwM0gyNTYuMjE0VjQyOC41NjJDMjU3LjA5NiA0MjguMjQ4IDM4Ny44MjUgMzgxLjU3OCAzODcuODI1IDI3OC4zNzZaIiBmaWxsPSJ1cmwoI3BhaW50MV9saW5lYXJfNV8xNSkiLz4KPHBhdGggb3BhY2l0eT0iMC4xIiBkPSJNMjU2LjIwNiA0NDAuNzcxQzI1NS4zMTkgNDQwLjQ1NiAxMTQuNDIgMzg1LjY0NiAxMTQuNDIgMjgyLjQ0NVYxMDMuMjI4SDI1Ni4yMDZWNDQwLjc3MVpNMzk4IDEwMy4yMjhWMjgyLjQ0NUMzOTggMzg1LjYzNSAyNTcuMTMgNDQwLjQ0NSAyNTYuMjE1IDQ0MC43NzFWMTAzLjIyOEgzOThaIiBmaWxsPSJibGFjayIvPgo8ZGVmcz4KPGxpbmVhckdyYWRpZW50IGlkPSJwYWludDBfbGluZWFyXzVfMTUiIHgxPSIxOTAuNDAyIiB5MT0iMTEzLjQwMyIgeDI9IjE5MC40MDIiIHkyPSI0MjguNTY0IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CjxzdG9wLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLW9wYWNpdHk9IjAiLz4KPC9saW5lYXJHcmFkaWVudD4KPGxpbmVhckdyYWRpZW50IGlkPSJwYWludDFfbGluZWFyXzVfMTUiIHgxPSIzMjIuMDE4IiB5MT0iMTEzLjQwMyIgeDI9IjMyMi4wMTgiIHkyPSI0MjguNTY0IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CjxzdG9wIHN0b3Atb3BhY2l0eT0iMCIvPgo8c3RvcCBvZmZzZXQ9IjEiLz4KPC9saW5lYXJHcmFkaWVudD4KPC9kZWZzPgo8L3N2Zz4K";
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
}

// Helper to poll for final transaction status
const pollShieldTransaction = async (walletAdapter: any, trackingId: string): Promise<string> => {
  if (typeof (walletAdapter as any).transactionStatus !== 'function') {
    return trackingId; // Fallback if method missing
  }

  // Poll for up to 30 seconds
  for (let i = 0; i < 15; i++) {
    await new Promise(r => setTimeout(r, 2000)); // Wait 2s
    try {
      const status = await (walletAdapter as any).transactionStatus(trackingId);
      // console.log("Shield Poll Status:", status);

      // Check for finalized status or if transactionId changes to on-chain format (at1...)
      if (status.status === 'Completed' || status.status === 'Finalized' || status.status === 'Settled') {
        if (status.transactionId && status.transactionId !== trackingId) {
          // console.log("Shield Polling: Found final ID:", status.transactionId);
          return status.transactionId; // Return real ID
        }
      }

      if (status.transactionId && status.transactionId.startsWith('at1')) {
        // console.log("Shield Polling: Found at1 ID:", status.transactionId);
        return status.transactionId;
      }

    } catch (e) {
      console.warn("Shield poll error:", e);
    }
  }

  return trackingId; // Return original if timeout
};

// Helper to create transactions based on wallet type
const createAleoTransaction = (
  walletAdapter: any,
  network: WalletAdapterNetwork,
  programId: string,
  functionName: string,
  inputs: any[],
  fee: number,
  isBaseFee: boolean = false
) => {
  // console.log("createAleoTransaction: Adapter Name =", walletAdapter?.name);
  if (walletAdapter && walletAdapter.name === 'Shield Wallet') {
    // Shield Wallet: Expects a plain object
    const tx = {
      program: programId,
      function: functionName,
      inputs,
      fee,
      privateFee: false // Force Public Fee for Shield
    };
    // console.log("createAleoTransaction: Generated Shield TX Object:", tx);
    return tx;
  } else {
    // Leo Wallet: Expects the specific Transaction class instance
    return Transaction.createTransaction(
      walletAdapter.publicKey,
      network,
      programId,
      functionName,
      inputs,
      fee,
      isBaseFee
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
  const [theme, setTheme] = useState<'dark' | 'neon'>('dark');

  // Fetch balance from Aleo Network
  const fetchAleoBalance = useCallback(async (address: string) => {
    try {
      // console.log("Fetching balance for:", address);
      const response = await fetch(`https://api.explorer.provable.com/v1/testnet/program/credits.aleo/mapping/account/${address}`);
      if (response.ok) {
        const value = await response.json();
        // Aleo credits are stored in microcredits (1 ALEO = 1M microcredits)
        // Response is usually a string like "5770000u64" or similar
        const balanceStr = String(value).replace('u64', '');
        let balanceNum = parseFloat(balanceStr) / 1_000_000;
        if (isNaN(balanceNum)) balanceNum = 0;
        setPublicBalance(balanceNum);
        // console.log("Public balance updated:", balanceNum);
      } else {
        setPublicBalance(0);
      }
    } catch (e) {
      console.error("Failed to fetch balance:", e);
      setPublicBalance(0);
    }
  }, [setPublicBalance]);

  // Sync theme to document for global CSS variable access
  useEffect(() => {
    if (theme === 'neon') {
      document.documentElement.classList.add('neon-mode');
    } else {
      document.documentElement.classList.remove('neon-mode');
    }
    // Note: Do not remove on unmount if we want persistence while navigating App component states
  }, [theme]);

  return (
    <WalletProvider
      wallets={wallets}
      decryptPermission={DecryptPermission.UponRequest}
      network={WalletAdapterNetwork.TestnetBeta}
      autoConnect={false}
    >
      <WalletModalProvider>
        <BalanceWrapper
          isApp={isApp}
          setIsApp={setIsApp}
          publicBalance={publicBalance}
          setPublicBalance={setPublicBalance}
          privateBalance={privateBalance}
          setPrivateBalance={setPrivateBalance}
          theme={theme}
          setTheme={setTheme}
          fetchAleoBalance={fetchAleoBalance}
        />
      </WalletModalProvider>
    </WalletProvider>
  );
}

// Internal component to handle hooks that need useWallet context
const BalanceWrapper = ({
  isApp, setIsApp, publicBalance, setPublicBalance, privateBalance, setPrivateBalance, theme, setTheme, fetchAleoBalance
}: any) => {
  const { publicKey, connected } = useWallet();

  useEffect(() => {
    if (connected && publicKey) {
      fetchAleoBalance(publicKey);
    } else {
      setPublicBalance(0);
      setPrivateBalance(0);
    }
  }, [connected, publicKey, fetchAleoBalance, setPublicBalance, setPrivateBalance]); // Added dependencies for useEffect

  return isApp ? (
    <Terminal
      onExit={() => setIsApp(false)}
      publicBalance={publicBalance}
      setPublicBalance={setPublicBalance}
      privateBalance={privateBalance}
      setPrivateBalance={setPrivateBalance}
      theme={theme}
      setTheme={setTheme}
    />
  ) : (
    <LandingPage onEnter={() => setIsApp(true)} theme={theme} />
  );
};

export default App;