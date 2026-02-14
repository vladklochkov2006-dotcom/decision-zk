import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
    {
        question: "What makes Decision.ZK different from traditional DAOs?",
        answer: "Decision.ZK uses zero-knowledge proofs to keep votes completely private until the reveal phase. This eliminates herd mentality, whale influence, and bribery - problems that plague traditional transparent governance systems."
    },
    {
        question: "How do I earn Reputation?",
        answer: "Reputation is earned by participating in proposals. Consistent participation builds your governance weight, allowing your voice to carry more value over time."
    },
    {
        question: "Is it faster than traditional voting?",
        answer: "Aleo's ZK circuits verify proofs in under 2 seconds. Traditional multi-sig DAOs can take 3-5 business days for proposal execution. Decision.ZK settles instantly after the reveal phase, with cryptographic guarantees instead of trust assumptions."
    },
    {
        question: "What is ZK-Reputation and how is it earned?",
        answer: "ZK-Reputation is a non-transferable score based on your prediction accuracy. When markets settle, accurate voters earn reputation points. Unlike token-weighted systems, this rewards skill over wealth, creating meritocratic governance."
    },
    {
        question: "Can I see how others voted before the reveal?",
        answer: "No - that's the core feature. All votes are encrypted using Aleo's zero-knowledge circuits. Even the smart contract can't decrypt individual votes until the reveal phase triggers. This prevents bandwagon effects and strategic voting."
    },
    {
        question: "What happens if I lose my private key?",
        answer: "Your ZK-Reputation is tied to your wallet address. If you lose your key, you lose access to your reputation score. We recommend using hardware wallets and secure backup methods. Your voting history remains verifiable on-chain via zero-knowledge proofs."
    },
    {
        question: "How fast are settlements compared to traditional governance?",
        answer: "Aleo's ZK circuits verify proofs in under 2 seconds. Traditional multi-sig DAOs can take 3-5 business days for proposal execution. Decision.ZK settles instantly after the reveal phase, with cryptographic guarantees instead of trust assumptions."
    },
    {
        question: "Is my voting data truly private?",
        answer: "Yes. Your vote is encrypted client-side before leaving your device. The blockchain only sees zero-knowledge proofs - mathematical statements that you voted validly, without revealing your choice. Not even node operators can decrypt your vote."
    }
];

export const FAQ = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <section className="faq-section">
            <div className="faq-container">
                <motion.h2
                    className="faq-title"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    Frequently Asked Questions
                </motion.h2>
                <motion.p
                    className="faq-subtitle"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                >
                    Everything you need to know about zero-knowledge governance
                </motion.p>

                <div className="faq-list">
                    {faqs.map((faq, index) => (
                        <motion.div
                            key={index}
                            className="faq-item"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <button
                                className={`faq-question ${openIndex === index ? 'active' : ''}`}
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                            >
                                <span>{faq.question}</span>
                                <motion.div
                                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <ChevronDown size={20} />
                                </motion.div>
                            </button>
                            <AnimatePresence>
                                {openIndex === index && (
                                    <motion.div
                                        className="faq-answer"
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <p>{faq.answer}</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
