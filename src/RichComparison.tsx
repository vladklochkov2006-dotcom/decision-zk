import { motion, type Variants } from 'framer-motion';

const fadeIn: Variants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
};

const rows = [
    {
        feature: 'Vote Privacy',
        traditional: 'Public record',
        publicChain: 'Wallet exposed',
        zk: 'Fully private',
    },
    {
        feature: 'Settlement',
        traditional: '3–5 days',
        publicChain: 'Minutes',
        zk: 'Seconds',
    },
    {
        feature: 'Cost per Vote',
        traditional: '$200+ hidden fees',
        publicChain: 'Volatile gas',
        zk: '< $0.01',
    },
    {
        feature: 'Audit Trail',
        traditional: 'Manual review',
        publicChain: 'Data exposed',
        zk: 'View keys',
    },
    {
        feature: 'Trade Secrets',
        traditional: 'Leakage risk',
        publicChain: 'On-chain exposure',
        zk: 'Zero exposure',
    },
];

export const RichComparison = () => {
    return (
        <section className="rich-comparison-section">
            <motion.div
                className="comparison-container"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } } }}
            >
                <motion.h2 className="comparison-title" variants={fadeIn}>
                    How Decision.ZK compares
                </motion.h2>
                <motion.p className="comparison-subtitle" variants={fadeIn}>
                    Feature-by-feature against traditional and public blockchain governance.
                </motion.p>

                <motion.div className="cmp-table" variants={fadeIn}>
                    {/* Header */}
                    <div className="cmp-row cmp-header">
                        <div className="cmp-cell cmp-feature">Feature</div>
                        <div className="cmp-cell">Traditional</div>
                        <div className="cmp-cell">Public Chain</div>
                        <div className="cmp-cell cmp-highlight-col">Decision.ZK</div>
                    </div>

                    {/* Rows */}
                    {rows.map((row, i) => (
                        <motion.div
                            key={i}
                            className="cmp-row"
                            variants={fadeIn}
                        >
                            <div className="cmp-cell cmp-feature">{row.feature}</div>
                            <div className="cmp-cell cmp-bad">
                                <span className="cmp-x">✗</span>
                                <span>{row.traditional}</span>
                            </div>
                            <div className="cmp-cell cmp-warn">
                                <span className="cmp-x">✗</span>
                                <span>{row.publicChain}</span>
                            </div>
                            <div className="cmp-cell cmp-good cmp-highlight-col">
                                <span className="cmp-check">✓</span>
                                <span>{row.zk}</span>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </motion.div>
        </section>
    );
};
