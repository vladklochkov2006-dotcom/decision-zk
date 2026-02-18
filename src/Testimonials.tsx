import { motion } from 'framer-motion';
import { useRef } from 'react';
import { useInView } from 'framer-motion';
import { Quote } from 'lucide-react';

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
    hidden: { y: 40, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1
    }
};

const testimonials = [
    {
        quote: "Decision.ZK solved our biggest problem: board members were voting based on who else voted, not on merit. Now we get genuine opinions.",
        author: "Sarah Chen",
        role: "DAO Governance Lead",
        company: "DeFi Protocol",
        avatar: "SC"
    },
    {
        quote: "Our investment committee can finally vote without whale influence. The ZK-proofs ensure privacy while maintaining full auditability.",
        author: "Marcus Rodriguez",
        role: "Investment Manager",
        company: "Crypto Fund",
        avatar: "MR"
    },
    {
        quote: "Whistleblowing is now truly anonymous. Employees can report issues without fear, and we can verify the reports are legitimate.",
        author: "Lisa Thompson",
        role: "Chief Compliance Officer",
        company: "Fortune 500",
        avatar: "LT"
    }
];

export const Testimonials = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section className="testimonials-section" ref={ref}>
            <motion.div
                className="testimonials-container"
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                variants={containerVariants}
            >
                <motion.h2 className="testimonials-title" variants={cardVariants}>
                    Trusted by Decision Makers
                </motion.h2>
                <motion.p className="testimonials-subtitle" variants={cardVariants}>
                    Real teams solving real problems with zero-knowledge governance
                </motion.p>

                <motion.div className="testimonials-grid" variants={containerVariants}>
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={index}
                            className="testimonial-card"
                            variants={cardVariants}
                        >
                            <div className="quote-icon">
                                <Quote size={24} color="#10B981" />
                            </div>
                            <p className="testimonial-quote">"{testimonial.quote}"</p>
                            <div className="testimonial-author">
                                <div className="author-avatar">{testimonial.avatar}</div>
                                <div className="author-info">
                                    <div className="author-name">{testimonial.author}</div>
                                    <div className="author-role">{testimonial.role}</div>
                                    <div className="author-company">{testimonial.company}</div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </motion.div>
        </section>
    );
};
