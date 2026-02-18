import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.8,
            ease: 'easeOut'
        }
    }
};

interface TheLastCallProps {
    onConnect: () => void;
    onEnter: () => void;
    connected: boolean;
}

export const TheLastCall = ({ onConnect, onEnter, connected }: TheLastCallProps) => {
    return (
        <section className="last-call-section">
            <motion.div
                className="last-call-container"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={containerVariants}
            >
                <div className="last-call-content">
                    <h2 className="last-call-title">
                        CHOOSE THE FUTURE IN PRIVATE.<br />
                        GOVERN IN SECONDS.
                    </h2>

                    <motion.button
                        className="last-call-cta"
                        onClick={connected ? onEnter : onConnect}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        style={connected ? {
                            background: 'linear-gradient(135deg, #10B981 0%, #F59E0B 100%)',
                            boxShadow: '0 0 30px rgba(0, 217, 255, 0.4)'
                        } : {}}
                    >
                        {connected ? "LAUNCH APP" : "START ANONYMOUS VOTING"}
                        <ArrowRight size={24} />
                    </motion.button>

                    <p className="last-call-subtitle">
                        SECURED BY ALEO ZERO-KNOWLEDGE EXCELLENCE
                    </p>
                </div>
            </motion.div>
        </section>
    );
};
