import React from 'react';

interface ZKLogoProps {
    className?: string;
}

export const ZKLogo: React.FC<ZKLogoProps> = ({ className = "w-10 h-10" }) => {
    return (
        <div className={`zk-logo-container ${className}`} style={{ display: 'inline-block', position: 'relative' }}>
            <svg
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ width: '100%', height: '100%', overflow: 'visible' }}
            >
                <defs>
                    {/* Gradient Definition */}
                    <linearGradient id="zk-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#10B981" />
                        <stop offset="100%" stopColor="#F59E0B" />
                    </linearGradient>

                    {/* Glow Filter */}
                    <filter id="zk-glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>

                    <style>{`
            @keyframes pulse-circuit {
              0%, 100% { opacity: 0.7; transform: scale(1); }
              50% { opacity: 1; transform: scale(1.02); }
            }
            .circuit-inner {
              animation: pulse-circuit 3s infinite ease-in-out;
              transform-origin: center;
            }
          `}</style>
                </defs>

                {/* Shield Outline */}
                <path
                    d="M50 5 L85 20 V50 C85 75 50 95 50 95 C50 95 15 75 15 50 V20 L50 5Z"
                    stroke="url(#zk-gradient)"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter="url(#zk-glow)"
                    style={{ filter: 'drop-shadow(0 0 15px rgba(16, 185, 129, 0.4))' }}
                />

                {/* Interior Circuit Nodes */}
                <g className="circuit-inner">
                    {/* Central Node */}
                    <circle cx="50" cy="50" r="4" fill="url(#zk-gradient)" filter="url(#zk-glow)" />

                    {/* Node Connections */}
                    <path
                        d="M50 50 L35 35 M50 50 L65 35 M50 50 L50 70"
                        stroke="url(#zk-gradient)"
                        strokeWidth="2"
                        strokeDasharray="2 4"
                        filter="url(#zk-glow)"
                    />

                    {/* Secondary Dots */}
                    <circle cx="35" cy="35" r="2.5" fill="url(#zk-gradient)" />
                    <circle cx="65" cy="35" r="2.5" fill="url(#zk-gradient)" />
                    <circle cx="50" cy="70" r="2.5" fill="url(#zk-gradient)" />
                </g>
            </svg>
        </div>
    );
};
