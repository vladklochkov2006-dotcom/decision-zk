import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { TrendingUp, Shield, Zap, Globe } from 'lucide-react';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.2
        }
    }
};

const cardVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1
    }
};

interface StatData {
    icon: typeof TrendingUp;
    value: number;
    suffix?: string;
    prefix?: string;
    label: string;
    color: string;
    decimals?: number;
}

const stats: StatData[] = [
    {
        icon: TrendingUp,
        value: 1247,
        suffix: '+',
        label: 'Votes Cast',
        color: '#00D9FF'
    },
    {
        icon: Shield,
        value: 99.9,
        suffix: '%',
        label: 'Privacy Guaranteed',
        color: '#A855F7',
        decimals: 1
    },
    {
        icon: Zap,
        value: 2,
        prefix: '< ',
        suffix: 's',
        label: 'Settlement Time',
        color: '#00FF88'
    },
    {
        icon: Globe,
        value: 100,
        suffix: '%',
        label: 'Decentralized',
        color: '#00D9FF'
    }
];

const AnimatedNumber = ({ value, decimals = 0, prefix = '', suffix = '' }: { value: number; decimals?: number; prefix?: string; suffix?: string }) => {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    useEffect(() => {
        if (!isInView) return;

        let startTime: number;
        const duration = 2500; // 2.5 seconds

        const animate = (currentTime: number) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);

            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentCount = easeOutQuart * value;

            setCount(currentCount);

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                setCount(value);
            }
        };

        requestAnimationFrame(animate);
    }, [isInView, value]);

    return (
        <span ref={ref}>
            {prefix}
            {count.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            {suffix}
        </span>
    );
};

export const StatsCounter = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section className="stats-section" ref={ref}>
            <motion.div
                className="stats-container"
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                variants={containerVariants}
            >
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <motion.div
                            key={index}
                            className="stat-card"
                            variants={cardVariants}
                        >
                            <div className="stat-icon" style={{ background: `${stat.color}20` }}>
                                <Icon size={32} color={stat.color} />
                            </div>
                            <div className="stat-value">
                                <AnimatedNumber
                                    value={stat.value}
                                    decimals={stat.decimals}
                                    prefix={stat.prefix}
                                    suffix={stat.suffix}
                                />
                            </div>
                            <div className="stat-label">{stat.label}</div>
                        </motion.div>
                    );
                })}
            </motion.div>
        </section>
    );
};
