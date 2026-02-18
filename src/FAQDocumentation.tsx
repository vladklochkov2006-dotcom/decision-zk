import React, { useState } from 'react';
import { ParticleBackground } from './ParticleBackground';
import {
    ArrowLeft, BookOpen, Vote, Code, Clock, Check, Unlock, ShieldCheck, Zap,
    Database, FileCode, Plus, Github, Star, GitFork, LayoutGrid,
    Shield, Lock, CheckCircle, FileText, Settings as GearIcon
} from 'lucide-react';
import { motion } from 'framer-motion';
import './FAQDocumentation.css';

// Animated ZK Diagram Component
const ZKDiagram = () => {
    return (
        <div className="animated-diagram">
            {/* Step 1: Secret Data (User Side) */}
            <motion.div
                className="diagram-node"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
            >
                <div className="node-icon active">
                    <Lock size={28} />
                </div>
                <div className="node-label">Secret Vote<br /><span style={{ fontSize: '0.7rem', opacity: 0.6 }}>(Stays on Device)</span></div>
            </motion.div>

            {/* Path 1: User to Circuit */}
            <div className="diagram-path" style={{ width: '12%', left: '25%', top: '48%' }}>
                <div className="path-pulse"></div>
            </div>

            {/* Step 2: ZK-Circuit (The Magic) */}
            <motion.div
                className="diagram-node"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
            >
                <div className="node-icon">
                    <GearIcon size={28} className="circuit-gear" />
                </div>
                <div className="node-label">ZK-Circuit<br /><span style={{ fontSize: '0.7rem', opacity: 0.6 }}>(Generates Proof)</span></div>
            </motion.div>

            {/* Path 2: Circuit to Verifier */}
            <div className="diagram-path" style={{ width: '12%', left: '52%', top: '48%' }}>
                <motion.div
                    className="path-pulse"
                    animate={{ x: ['-100%', '400%'] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                ></motion.div>
            </div>

            {/* Step 3: The Proof (The ONLY thing that travels) */}
            <motion.div
                className="diagram-node"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.5 }}
            >
                <div className="node-icon active" style={{ borderColor: '#F59E0B', color: '#F59E0B' }}>
                    <FileText size={28} />
                </div>
                <div className="node-label">ZK-Proof<br /><span style={{ fontSize: '0.7rem', opacity: 0.6 }}>(Publicly Verifiable)</span></div>
            </motion.div>

            {/* Path 3: Proof to Verifier */}
            <div className="diagram-path" style={{ width: '10%', left: '72%', top: '48%' }}>
                <div className="path-pulse"></div>
            </div>

            {/* Step 4: Verifier (The Tally) */}
            <motion.div
                className="diagram-node"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1.8, duration: 0.6 }}
            >
                <motion.div
                    className="node-icon success"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 2, delay: 2 }}
                >
                    <CheckCircle size={28} />
                </motion.div>
                <div className="node-label">Verifier<br /><span style={{ fontSize: '0.7rem', opacity: 0.6 }}>(Confirmed ✅)</span></div>
            </motion.div>
        </div>
    );
};

// Typewriter Code Component
const TypewriterCode = ({ code, delay = 15 }: { code: string; delay?: number }) => {
    const [displayedCode, setDisplayedCode] = React.useState(''); // Use React.useState since we removed useState import in previous step or just revert import too

    React.useEffect(() => { // Re-adding useEffect
        setDisplayedCode('');
        let i = 0;
        const timer = setInterval(() => {
            if (i < code.length) {
                setDisplayedCode(code.substring(0, i + 1));
                i++;
            } else {
                clearInterval(timer);
            }
        }, delay);
        return () => clearInterval(timer);
    }, [code, delay]);

    return (
        <pre>
            {displayedCode}
            <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                style={{ borderLeft: '2px solid #10B981', marginLeft: '2px' }}
            >
                &nbsp;
            </motion.span>
        </pre>
    );
};

interface FAQCategory {
    id: string;
    title: string;
    description: string;
    icon: any;
    color: string;
    questions: Array<{
        id: string;
        question: string;
        answer: string;
        visual?: React.ReactNode;
    }>;
}

const faqCategories: FAQCategory[] = [
    {
        id: 'zk-basics',
        title: 'ZK Basics',
        description: 'Learn about zero-knowledge proofs, privacy, and cryptographic fundamentals',
        icon: BookOpen,
        color: '#10B981',
        questions: [
            {
                id: 'what-is-zk',
                question: 'What are zero-knowledge proofs?',
                answer: 'Zero-knowledge proofs (ZKPs) are cryptographic methods that allow one party to prove to another that a statement is true without revealing anything beyond the validity of the statement itself. In governance, this means proving you voted correctly without revealing WHO or WHAT you voted for.',
                visual: <ZKDiagram />
            },
            {
                id: 'why-privacy',
                question: 'Why is privacy important in governance?',
                answer: 'Privacy prevents herd mentality, whale influence, and bribery. When votes are public, people tend to follow the majority or powerful stakeholders. ZKPs ensure that every decision is independent and based on individual conviction.',
                visual: (
                    <div className="faq-visual-container">
                        <div className="faq-table-container">
                            <table className="faq-table">
                                <thead>
                                    <tr>
                                        <th>Feature</th>
                                        <th>Public Voting</th>
                                        <th className="winning-column">ZK Voting</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Vote Privacy</td>
                                        <td className="negative">✘ Public</td>
                                        <td className="positive winning-column">✔ Encrypted</td>
                                    </tr>
                                    <tr>
                                        <td>Coercion Resistance</td>
                                        <td className="negative">✘ Low</td>
                                        <td className="positive winning-column">✔ High</td>
                                    </tr>
                                    <tr>
                                        <td>Verification</td>
                                        <td className="exposed-text">⚠️ Public Ledger (Exposed)</td>
                                        <td className="positive winning-column">✔ Trust Math</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="zk-caption">Technical Comparison: Transparency vs. Privacy</div>
                    </div>
                )
            },
            {
                id: 'how-secure',
                question: 'How secure are zero-knowledge proofs?',
                answer: 'ZK-proofs are mathematically secure and rely on the same cryptographic principles as modern encryption. Aleo\'s zkSNARKs are verified on-chain.',
                visual: (
                    <div className="faq-code-block">
                        <div className="code-header">aleo_proof_verification.leo</div>
                        <TypewriterCode code={`program vote_check.aleo {
    transition verify(
    public root: field,
    private ticket: field
) -> bool {
        // Math matches, privacy preserved
        return true;
    }
} `} />
                    </div>
                )
            }
        ]
    },
    {
        id: 'voting-guide',
        title: 'Voting Guide',
        description: 'Step-by-step instructions for casting votes, earning reputation, and participating',
        icon: Vote,
        color: '#F59E0B',
        questions: [
            {
                id: 'how-to-vote',
                question: 'How do I cast a vote?',
                answer: 'Connect your Aleo wallet, browse active proposals, and click "Vote Support" or "Vote Oppose". Your client generates a zero-knowledge proof locally.',
                visual: (
                    <motion.div
                        className="faq-steps"
                        initial="hidden"
                        animate="visible"
                        variants={{
                            visible: { transition: { staggerChildren: 0.3 } }
                        }}
                    >
                        {[
                            { color: '#10B981', text: 'Connect Wallet' },
                            { color: '#F59E0B', text: 'Select Option' },
                            { color: '#00ff88', text: 'Generate ZK Proof' },
                            { color: '#ffffff', text: 'Submit On-Chain' }
                        ].map((step, idx) => (
                            <React.Fragment key={idx}>
                                <motion.div
                                    className="step-item"
                                    variants={{
                                        hidden: { opacity: 0, y: 10 },
                                        visible: { opacity: 1, y: 0 }
                                    }}
                                >
                                    <div className="step-num" style={{ borderColor: step.color, color: step.color }}>{idx + 1}</div>
                                    <div className="step-text">{step.text}</div>
                                </motion.div>
                                {idx < 3 && (
                                    <motion.div
                                        className="step-line"
                                        initial={{ scaleX: 0 }}
                                        animate={{ scaleX: 1 }}
                                        transition={{ delay: (idx + 1) * 0.3, duration: 0.4 }}
                                        style={{ transformOrigin: 'left' }}
                                    />
                                )}
                            </React.Fragment>
                        ))}
                    </motion.div>
                )
            },
            {
                id: 'reputation-system',
                question: 'How does the reputation system work?',
                answer: 'ZK-Reputation is earned by consistent governance participation. Active voters earn non-transferable reputation points based on their stake weight and history, regardless of the outcome.',
                visual: (
                    <div className="faq-visual-container">
                        <motion.div
                            className="reputation-formula"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="formula-row">
                                <motion.span className="var" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 3 }}>Participation_Score</motion.span>
                                <span className="op">×</span>
                                <span className="var">Stake_Weight</span>
                                <span className="op">=</span>
                                <span className="result">Reputation_Gain</span>
                            </div>
                            <div className="formula-note">* Capped at 100 points per cycle</div>
                        </motion.div>
                    </div>
                )
            },
            {
                id: 'reveal-phase',
                question: 'What happens during the reveal phase?',
                answer: 'After the voting deadline, the reveal phase begins. Smart contracts decrypt all votes simultaneously using time-locked cryptography. Results are tallied on-chain, and reputation is distributed to active participants.',
                visual: (
                    <div className="faq-visual-container">
                        <motion.div
                            className="timeline-visual"
                            initial="hidden"
                            animate="visible"
                            variants={{
                                visible: { transition: { staggerChildren: 0.5 } }
                            }}
                        >
                            <motion.div className="timeline-item done" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
                                <div className="point"><Check size={12} /></div>
                                <div className="label">Voting Ends</div>
                            </motion.div>
                            <motion.div
                                className="timeline-line"
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ delay: 0.2, duration: 1 }}
                                style={{ transformOrigin: 'left', background: 'linear-gradient(90deg, #10B981, #F59E0B)' }}
                            />
                            <motion.div className="timeline-item active" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
                                <div className="point pulse"><Clock size={12} /></div>
                                <div className="label">Time-Lock Expired</div>
                            </motion.div>
                            <motion.div
                                className="timeline-line"
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ delay: 1.2, duration: 1 }}
                                style={{ transformOrigin: 'left' }}
                            />
                            <motion.div className="timeline-item" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
                                <div className="point"><Unlock size={12} /></div>
                                <div className="label">Decryption & Tally</div>
                            </motion.div>
                        </motion.div>
                        <div className="zk-caption">Automatic on-chain process</div>
                    </div>
                )
            },
            {
                id: 'vote-change',
                question: 'Can I change my vote?',
                answer: 'No. Once submitted, votes are immutable and encrypted on-chain. This prevents strategic voting and ensures commitment to your initial decision.',
                visual: (
                    <div className="faq-visual-container">
                        <div className="security-lock-visual">
                            <div className="lock-icon-wrapper">
                                <ShieldCheck size={48} color="#10B981" />
                            </div>
                            <div className="lock-text">Vote Immutable</div>
                            <div className="lock-sub">Recorded on Block #1,294,002</div>
                        </div>
                    </div>
                )
            }
        ]
    },
    {
        id: 'technical',
        title: 'Technical Details',
        description: 'Architecture, smart contracts, Aleo integration, and advanced topics',
        icon: Code,
        color: '#00FF88',
        questions: [
            {
                id: 'aleo-integration',
                question: 'How does Decision.ZK integrate with Aleo?',
                answer: 'Decision.ZK uses Aleo\'s zkSNARK circuits for vote encryption and proof generation. All voting logic runs in Aleo smart contracts, ensuring trustless execution and on-chain verification.',
                visual: (
                    <div className="faq-visual-container">
                        <div className="integration-diagram">
                            <motion.div className="int-box app" whileHover={{ y: -5 }}>
                                <LayoutGrid size={20} />
                                <span>App</span>
                            </motion.div>
                            <div className="int-arrow">
                                <motion.div
                                    animate={{ x: [0, 10, 0], opacity: [0.3, 1, 0.3] }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                >
                                    <Zap size={16} />
                                </motion.div>
                                <span>ZK Proof</span>
                            </div>
                            <motion.div
                                className="int-box aleo"
                                animate={{ boxShadow: ["0 0 0px #10B981", "0 0 15px #10B981", "0 0 0px #10B981"] }}
                                transition={{ repeat: Infinity, duration: 3 }}
                            >
                                <Shield size={20} />
                                <span>Aleo</span>
                            </motion.div>
                            <div className="int-arrow">
                                <motion.div
                                    animate={{ x: [0, 5, 0], scale: [1, 1.2, 1] }}
                                    transition={{ repeat: Infinity, duration: 2.5 }}
                                >
                                    <Database size={16} />
                                </motion.div>
                                <span>State</span>
                            </div>
                            <motion.div className="int-box contract" whileHover={{ scale: 1.05 }}>
                                <FileCode size={20} />
                                <span>Contract</span>
                            </motion.div>
                        </div>
                    </div>
                )
            },
            {
                id: 'gas-fees',
                question: 'What are the transaction costs?',
                answer: 'Aleo transactions cost under $0.01 due to efficient zero-knowledge circuits. Unlike Ethereum\'s volatile gas fees, Aleo provides stable, predictable costs for all operations.',
                visual: (
                    <motion.div
                        className="faq-table-container"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <table className="faq-table">
                            <thead>
                                <tr>
                                    <th>Network</th>
                                    <th>Avg Fee</th>
                                    <th>Privacy</th>
                                </tr>
                            </thead>
                            <tbody>
                                <motion.tr whileHover={{ backgroundColor: 'rgba(0, 255, 136, 0.05)' }}>
                                    <td>Decision.ZK</td>
                                    <td className="positive">&lt; $0.01</td>
                                    <td className="positive">Full</td>
                                </motion.tr>
                                <tr>
                                    <td>Ethereum</td>
                                    <td className="negative">~ $2.50</td>
                                    <td className="negative">None</td>
                                </tr>
                            </tbody>
                        </table>
                    </motion.div>
                )
            },
            {
                id: 'wallet-support',
                question: 'Which wallets are supported?',
                answer: 'Currently, Decision.ZK supports Leo Wallet and Shield Wallet, the leading privacy-first wallets for Aleo. More integrations are on our roadmap.',
                visual: (
                    <div className="faq-visual-container">
                        <motion.div
                            className="wallet-grid"
                            initial="hidden"
                            animate="visible"
                            variants={{
                                visible: { transition: { staggerChildren: 0.1 } }
                            }}
                        >
                            <motion.div
                                className="wallet-item leo active"
                                variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } }}
                            >
                                <div className="wallet-icon-box">
                                    <img src="/leo-wallet.png" alt="Leo Wallet" style={{ width: 32, height: 32, borderRadius: 6 }} />
                                </div>
                                <span>Leo Wallet</span>
                                <div className="status-badge">Supported</div>
                            </motion.div>
                            <motion.div
                                className="wallet-item shield active"
                                variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } }}
                            >
                                <div className="wallet-icon-box" style={{ background: 'transparent' }}>
                                    <img src="/shield-wallet.png" alt="Shield Wallet" style={{ width: 32, height: 32, borderRadius: 6 }} />
                                </div>
                                <span>Shield Wallet</span>
                                <div className="status-badge">Supported</div>
                            </motion.div>
                            <motion.div
                                className="wallet-item generic coming-soon"
                                variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } }}
                            >
                                <div className="wallet-icon-box" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', borderStyle: 'dashed' }}>
                                    <Plus size={24} opacity={0.3} />
                                </div>
                                <span>Upcoming...</span>
                                <div className="status-badge fade">Soon</div>
                            </motion.div>
                        </motion.div>
                    </div>
                )
            },
            {
                id: 'open-source',
                question: 'Is the code open source?',
                answer: 'Yes! All smart contracts and frontend code are open source on GitHub. You can audit the ZK circuits, voting logic, and reputation algorithms yourself.',
                visual: (
                    <div className="faq-visual-container">
                        <motion.div
                            className="github-card"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{ y: -5, boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
                        >
                            <div className="gh-header">
                                <Github size={24} />
                                <span>decision-zk/core</span>
                            </div>
                            <div className="gh-stats">
                                <div className="stat">
                                    <Star size={16} /> 0
                                </div>
                                <div className="stat">
                                    <GitFork size={16} /> 0
                                </div>
                            </div>
                            <div className="gh-status">
                                <div className="dot"></div> Public Repository
                            </div>
                        </motion.div>
                    </div>
                )
            }
        ]
    }
];

// Helper to get category by ID
const getCategoryById = (id: string) => faqCategories.find(c => c.id === id);

interface FAQProps {
    onBack: () => void;
    hideBackButton?: boolean;
}

export const FAQDocumentation = ({ onBack, hideBackButton = false }: FAQProps) => {
    const [selectedCategory, setSelectedCategory] = useState<FAQCategory | null>(null);
    const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);

    // Simple state-based navigation helpers
    const navigateToCategory = (categoryId: string) => {
        const category = getCategoryById(categoryId);
        if (category) {
            setSelectedCategory(category);
            setSelectedQuestion(null);
        }
    };

    const navigateToQuestion = (questionId: string) => {
        setSelectedQuestion(questionId);
    };

    const handleBack = () => {
        if (selectedQuestion) {
            setSelectedQuestion(null);
        } else if (selectedCategory) {
            setSelectedCategory(null);
        } else {
            onBack();
        }
    };

    if (selectedQuestion && selectedCategory) {
        const question = selectedCategory.questions.find(q => q.id === selectedQuestion);

        return (
            <div className="faq-detail-view">
                <ParticleBackground />
                <button className="faq-back-button" onClick={handleBack}>
                    <ArrowLeft size={20} />
                    Back to {selectedCategory.title}
                </button>
                <div className="faq-question-detail">
                    <h2>{question?.question}</h2>
                    <div className="faq-answer-content">
                        <p>{question?.answer}</p>
                        {question?.visual && (
                            <div className="faq-visual-wrapper">
                                {question.visual}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    if (selectedCategory) {
        return (
            <div className="faq-category-view">
                <ParticleBackground />
                <button className="faq-back-button" onClick={handleBack}>
                    <ArrowLeft size={20} />
                    Back to Categories
                </button>
                <div className="faq-doc-header">
                    <div className="category-icon" style={{ backgroundColor: selectedCategory.color + '20', color: selectedCategory.color, margin: '0 auto 20px' }}>
                        <selectedCategory.icon size={40} />
                    </div>
                    <h1>{selectedCategory.title}</h1>
                    <p>{selectedCategory.description}</p>
                </div>
                <div className="faq-questions-list">
                    {selectedCategory.questions.map((q) => (
                        <div
                            key={q.id}
                            className="faq-question-card"
                            onClick={() => navigateToQuestion(q.id)}
                        >
                            <h3>{q.question}</h3>
                            <div className="faq-arrow">→</div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="faq-documentation-view">
            <ParticleBackground />
            {!hideBackButton && (
                <button className="faq-close-button" onClick={onBack}>
                    <ArrowLeft size={20} />
                    Back to Home
                </button>
            )}
            <div className="faq-doc-header">
                <h1>Documentation & FAQ</h1>
                <p>Everything you need to know about Decision.ZK</p>
            </div>
            <div className="faq-categories-grid">
                {faqCategories.map((category) => (
                    <div
                        key={category.id}
                        className="faq-category-card"
                        style={{ '--hover-color': category.color } as any}
                        onClick={() => navigateToCategory(category.id)}
                    >
                        <div className="category-icon" style={{ backgroundColor: category.color + '20', color: category.color }}>
                            <category.icon size={32} />
                        </div>
                        <h3>{category.title}</h3>
                        <p>{category.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};
