import { motion, type Variants } from 'framer-motion';
import { Shield, XCircle, AlertTriangle } from 'lucide-react';

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.2
        }
    }
};

const cardVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.5,
            ease: "easeOut"
        }
    }
};

const comparisons = [
    {
        feature: 'Vote Privacy',
        desc: 'How your identity is handled during the voting process.',
        legacy: { text: 'Public addresses', status: 'loss' },
        public: { text: 'Fully Public', status: 'loss' },
        decision: { text: 'Fully Private (ZK-Encrypted)', detail: 'Zero-Knowledge proofs shield your identity mathematically.' }
    },
    {
        feature: 'Settlement Speed',
        desc: 'The time it takes for a vote to be finalized and counted.',
        legacy: { text: '3-5 Days (Manual)', status: 'loss' },
        public: { text: 'Minutes', status: 'warn' },
        decision: { text: 'Instant (Seconds)', detail: 'Decentralized ZK-verifiers settle state updates in real-time.' }
    },
    {
        feature: 'Transaction Cost',
        desc: 'The economic barrier to participating in governance.',
        legacy: { text: '$200+ Hidden', status: 'loss' },
        public: { text: 'Volatile Gas', status: 'warn' },
        decision: { text: '< $0.01 Stable', detail: 'Off-chain proving ensures minimal on-chain state footprint.' }
    },
    {
        feature: 'Audit & Compliance',
        desc: 'How trust is maintained without revealing secrets.',
        legacy: { text: 'Slow Audit', status: 'loss' },
        public: { text: 'Exposed Data', status: 'loss' },
        decision: { text: 'Selective View Keys', detail: 'Give regulators access without exposing data to the public.' }
    },
    {
        feature: 'Trade Secret Risk',
        desc: 'Protection of sensitive business strategy and logic.',
        legacy: { text: 'Leakage Risk', status: 'warn' },
        public: { text: 'CRITICAL Exposure', status: 'loss' },
        decision: { text: 'ZERO Exposure', detail: 'Logic executes locally; only encrypted results reach the chain.' }
    }
];

export const RichComparison = () => {
    return (
        <section className="rich-comparison-section">
            <motion.div
                className="comparison-container"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={containerVariants}
            >
                <div className="comparison-header-labels">
                    <motion.h2 className="comparison-title" variants={cardVariants}>
                        Decision.ZK vs The World
                    </motion.h2>
                    <motion.p className="comparison-subtitle" variants={cardVariants}>
                        Why mathematical privacy is the only sustainable future for governance.
                    </motion.p>
                </div>

                <div className="bento-comparison-grid">
                    {comparisons.map((item, index) => (
                        <motion.div
                            key={index}
                            className="duel-card"
                            variants={cardVariants}
                            whileHover={{ y: -5 }}
                        >
                            <div className="card-top">
                                <span className="feature-category">{item.feature}</span>
                                <p className="feature-description">{item.desc}</p>
                            </div>

                            <div className="duel-content">
                                <div className="side-legacy">
                                    <div className="side-label">LEGACY / PUBLIC</div>
                                    <div className="problem-points">
                                        <div className={`point status-${item.legacy.status}`}>
                                            <XCircle size={14} /> {item.legacy.text}
                                        </div>
                                        <div className={`point status-${item.public.status}`}>
                                            <AlertTriangle size={14} /> {item.public.text}
                                        </div>
                                    </div>
                                    <div className="status-dim">OBSOLETE</div>
                                </div>

                                <div className="duel-divider">
                                    <div className="vs-circle">VS</div>
                                    <div className="laser-beam"></div>
                                </div>

                                <div className="side-zk">
                                    <div className="side-label">THE ZK ADVANTAGE</div>
                                    <div className="zk-winner-box">
                                        <div className="solution-head">
                                            <Shield size={18} className="shield-neon" />
                                            <span className="solution-text">{item.decision.text}</span>
                                        </div>
                                        <p className="solution-detail">{item.decision.detail}</p>
                                    </div>
                                    <div className="status-best">MATHEMATICAL TRUTH</div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </section>
    );
};
