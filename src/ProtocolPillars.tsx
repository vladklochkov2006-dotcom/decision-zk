import { motion } from 'framer-motion';
import { Server, Award, Zap } from 'lucide-react';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
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

export const ProtocolPillars = () => {
    return (
        <section className="protocol-pillars-section" id="terminal">
            <motion.div
                className="protocol-pillars-container"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={containerVariants}
            >
                <motion.h2 className="protocol-pillars-title" variants={cardVariants}>
                    Protocol Pillars
                </motion.h2>
                <motion.p className="protocol-pillars-subtitle" variants={cardVariants}>
                    The technological foundation of Decision.ZK
                </motion.p>

                <motion.div className="pillars-grid" variants={containerVariants}>
                    <motion.div className="pillar-card" variants={cardVariants}>
                        <div className="pillar-icon">
                            <Server size={40} color="#00D9FF" />
                        </div>
                        <h3>Infrastructure</h3>
                        <p>
                            ZK-proofs generated locally on the client side. No unencrypted data ever
                            touches the network. Your vote is encrypted before it leaves your device.
                        </p>
                        <div className="pillar-badge">Client-Side Privacy</div>
                    </motion.div>

                    <motion.div className="pillar-card" variants={cardVariants}>
                        <div className="pillar-icon">
                            <Award size={40} color="#A855F7" />
                        </div>
                        <h3>Meritocracy</h3>
                        <p>
                            A reputation system that values decision accuracy over financial stake.
                            Earn influence through proven judgment, not wallet size.
                        </p>
                        <div className="pillar-badge">Accuracy-Based Power</div>
                    </motion.div>

                    <motion.div className="pillar-card" variants={cardVariants}>
                        <div className="pillar-icon">
                            <Zap size={40} color="#00FF88" />
                        </div>
                        <h3>Finality</h3>
                        <p>
                            Instant settlement powered by Aleo's private execution environment.
                            Results are final and verifiable within seconds, not days.
                        </p>
                        <div className="pillar-badge">Aleo-Powered</div>
                    </motion.div>
                </motion.div>
            </motion.div>
        </section>
    );
};
