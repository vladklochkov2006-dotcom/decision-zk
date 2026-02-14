import { motion } from 'framer-motion';
import { AlertCircle, TrendingUp, Vote } from 'lucide-react';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.1
        }
    }
};

const cardVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1
    }
};

export const BentoUseCases = () => {
    return (
        <section className="bento-section">
            <motion.div
                className="bento-container"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={containerVariants}
            >
                <motion.h2 className="bento-title" variants={cardVariants}>
                    Empowering Truth in Every Sector
                </motion.h2>
                <motion.p className="bento-subtitle" variants={cardVariants}>
                    Real-world applications of anonymous, verifiable decision-making
                </motion.p>

                <motion.div className="bento-grid" variants={containerVariants}>
                    <motion.div className="bento-card bento-large" variants={cardVariants}>
                        <div className="bento-icon">
                            <AlertCircle size={32} color="#00D9FF" />
                        </div>
                        <h3>Whistleblowing</h3>
                        <p>
                            Private reporting in large corporations. Employees can safely report misconduct,
                            vote on ethical proposals, or provide feedback without fear of retaliation.
                            Every voice is mathematically protected.
                        </p>
                        <div className="bento-tag">Corporate Compliance</div>
                    </motion.div>

                    <motion.div className="bento-card" variants={cardVariants}>
                        <div className="bento-icon">
                            <TrendingUp size={32} color="#A855F7" />
                        </div>
                        <h3>Investment DAOs</h3>
                        <p>
                            Blind voting on startup rounds to prevent herd mentality. Members vote
                            independently without seeing others' positions, eliminating groupthink.
                        </p>
                        <div className="bento-tag">DeFi</div>
                    </motion.div>

                    <motion.div className="bento-card" variants={cardVariants}>
                        <div className="bento-icon">
                            <Vote size={32} color="#00D9FF" />
                        </div>
                        <h3>Governance</h3>
                        <p>
                            Reputation-based voting that values expertise over token balance.
                            Your accuracy earns you influence, not your wallet size.
                        </p>
                        <div className="bento-tag">DAO Governance</div>
                    </motion.div>
                </motion.div>
            </motion.div>
        </section>
    );
};
