import { Rocket, Coins, CheckCircle } from 'lucide-react';

export const Roadmap = () => {
    return (
        <section className="roadmap-section">
            <div className="roadmap-container">
                <h2 className="roadmap-title">Roadmap</h2>
                <p className="roadmap-subtitle">Building the future of anonymous governance</p>

                <div className="roadmap-timeline">
                    <div className="roadmap-item">
                        <div className="roadmap-icon active">
                            <Rocket size={24} color="#00D9FF" />
                        </div>
                        <div className="roadmap-content">
                            <h3>Testnet Launch</h3>
                            <p>Deploy Decision.ZK on Aleo testnet with core voting mechanics</p>
                            <span className="roadmap-status current">Current Phase</span>
                        </div>
                    </div>

                    <div className="roadmap-connector"></div>

                    <div className="roadmap-item">
                        <div className="roadmap-icon">
                            <Coins size={24} color="#A855F7" />
                        </div>
                        <div className="roadmap-content">
                            <h3>ZK-Reputation Mining</h3>
                            <p>Launch reputation system with accuracy-based rewards and ZK-Badges</p>
                            <span className="roadmap-status upcoming">Q2 2026</span>
                        </div>
                    </div>

                    <div className="roadmap-connector"></div>

                    <div className="roadmap-item">
                        <div className="roadmap-icon">
                            <CheckCircle size={24} color="#00FF88" />
                        </div>
                        <div className="roadmap-content">
                            <h3>Mainnet</h3>
                            <p>Full production deployment with enterprise governance features</p>
                            <span className="roadmap-status upcoming">Q3 2026</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
