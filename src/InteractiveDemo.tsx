import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Lock, Eye, CheckCircle, Check, Sparkles, EyeOff } from 'lucide-react';

const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export const InteractiveDemo = () => {
    const [selectedVote, setSelectedVote] = useState<'yes' | 'no' | null>(null);
    const [isEncrypting, setIsEncrypting] = useState(false);
    const [isEncrypted, setIsEncrypted] = useState(false);
    const [showProof, setShowProof] = useState(false);

    const handleVote = (vote: 'yes' | 'no') => {
        setSelectedVote(vote);
        setIsEncrypted(false);
        setShowProof(false);
    };

    const handleEncrypt = () => {
        setIsEncrypting(true);

        // Simulate encryption process
        setTimeout(() => {
            setIsEncrypted(true);
            setIsEncrypting(false);

            // Generate fake ZK-proof
            // (Proof generation handled by explorer view in this demo)
        }, 1500);
    };

    const resetDemo = () => {
        setSelectedVote(null);
        setIsEncrypting(false);
        setIsEncrypted(false);
        setShowProof(false);
    };

    return (
        <section className="interactive-demo-section">
            <motion.div
                className="demo-container"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={containerVariants}
            >
                <h2 className="demo-title">Try It Yourself</h2>
                <p className="demo-subtitle">
                    Vote on a proposal and see how your choice is encrypted with zero-knowledge proofs
                </p>

                <div className="demo-card">
                    <div className="demo-proposal">
                        <h3>Sample Proposal</h3>
                        <p>Should we allocate 50,000 Credits to marketing budget for Q2?</p>
                    </div>

                    <div className="demo-voting">
                        <div className="vote-buttons">
                            <motion.button
                                className={`vote-btn vote-yes ${selectedVote === 'yes' ? 'selected' : ''}`}
                                onClick={() => handleVote('yes')}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                disabled={isEncrypting || isEncrypted}
                            >
                                <Check size={20} />
                                Vote Yes
                            </motion.button>
                            <motion.button
                                className={`vote-btn vote-no ${selectedVote === 'no' ? 'selected' : ''}`}
                                onClick={() => handleVote('no')}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                disabled={isEncrypting || isEncrypted}
                            >
                                <EyeOff size={20} />
                                Vote No
                            </motion.button>
                        </div>

                        <AnimatePresence mode="wait">
                            {selectedVote && !isEncrypted && (
                                <motion.button
                                    className="encrypt-btn"
                                    onClick={handleEncrypt}
                                    disabled={isEncrypting}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {isEncrypting ? (
                                        <>
                                            <Sparkles size={20} className="spinning" />
                                            Generating ZK-Proof...
                                        </>
                                    ) : (
                                        <>
                                            <Lock size={20} />
                                            Encrypt & Submit
                                        </>
                                    )}
                                </motion.button>
                            )}
                        </AnimatePresence>

                        <AnimatePresence>
                            {isEncrypted && (
                                <motion.div
                                    className="proof-result explorer-receipt"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                >
                                    <div className="receipt-header">
                                        <div className="receipt-icon">
                                            <CheckCircle size={32} color="#00FF88" className="glow-icon" />
                                        </div>
                                        <div>
                                            <h4 className="broadcast-title">Transaction Successfully Broadcasted</h4>
                                            <p className="privacy-subtitle-small">
                                                Public Blockchain View: No personal data revealed.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="explorer-view-demo">
                                        <div className="explorer-row-demo">
                                            <span className="label">From:</span>
                                            <span className="value encrypted-text-demo">
                                                {showProof ? (
                                                    <span className="revealed-demo">aleo1...uw5m (You)</span>
                                                ) : (
                                                    <span className="masked-demo">aleo1zkq...[ENCRYPTED]</span>
                                                )}
                                            </span>
                                        </div>

                                        <div className="explorer-row-demo">
                                            <span className="label">Contract:</span>
                                            <span className="value mono-demo">DecisionZK.aleo / vote_private</span>
                                        </div>

                                        <div className="explorer-row-demo vertical-demo">
                                            <span className="label">Choice & Amount:</span>
                                            <div className="data-blob-demo">
                                                {showProof ? (
                                                    <div className="revealed-data-demo">
                                                        <span className="vote-choice-demo">Choice: {selectedVote === 'yes' ? 'YES' : 'NO'}</span>
                                                        <span className="vote-amount-demo">Amount: 50 Credits</span>
                                                    </div>
                                                ) : (
                                                    <div className="encrypted-blob-demo">
                                                        <span className="blob-hex-demo">0x4a7f8...b2e9 (ZK-Blob)</span>
                                                    </div>
                                                )}
                                                <p className="blob-note-demo">The network verifies the proof, not the data.</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="reveal-control-demo">
                                        <button
                                            className={`reveal-btn-demo ${showProof ? 'active revealed' : ''}`}
                                            onClick={() => setShowProof(!showProof)}
                                        >
                                            <Eye size={14} className={showProof ? 'active-icon' : ''} />
                                            {showProof ? 'Hide Personal Data' : 'Click to Reveal Personal Data'}
                                        </button>
                                        <p className="reveal-disclaimer-demo">ONLY REVEALED LOCALLY ON YOUR DEVICE</p>
                                    </div>

                                    <button className="reset-btn" onClick={resetDemo}>
                                        Try Another Vote
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <div className="demo-info">
                    <div className="info-badge">
                        <Sparkles size={16} color="#10B981" />
                        <span>This is a simulation. Real voting happens in the app.</span>
                    </div>
                </div>
            </motion.div>
        </section>
    );
};
