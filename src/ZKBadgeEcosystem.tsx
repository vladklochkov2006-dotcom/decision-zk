import { Award, TrendingUp, Shield } from 'lucide-react';

export const ZKBadgeEcosystem = () => {
    return (
        <section className="zkbadge-section">
            <div className="zkbadge-container">
                <h2 className="zkbadge-title">The ZK-Badge Ecosystem</h2>
                <p className="zkbadge-subtitle">
                    Earn reputation through consistent participation, not wealth
                </p>

                <div className="zkbadge-content">
                    <div className="zkbadge-visual">
                        <div className="badge-card">
                            <div className="badge-header">
                                <Shield size={24} color="#10B981" />
                                <span>ZK-Reputation Badge</span>
                            </div>
                            <div className="badge-stats">
                                <div className="stat">
                                    <div className="stat-label">Reputation Score</div>
                                    <div className="stat-value">92.4</div>
                                </div>
                                <div className="stat">
                                    <div className="stat-label">Decisions</div>
                                    <div className="stat-value">127</div>
                                </div>
                                <div className="stat">
                                    <div className="stat-label">Rank</div>
                                    <div className="stat-value">Top 5%</div>
                                </div>
                            </div>
                            <div className="badge-footer">
                                <div className="badge-status verified">
                                    <Award size={16} /> Verified on Aleo
                                </div>
                                <div className="badge-status private">
                                    <Shield size={16} /> Identity: Hidden
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="zkbadge-explanation">
                        <h3>How It Works</h3>
                        <p>
                            Your consistent participation earns you <strong>non-transferable ZK-badges</strong>. These badges
                            increase your voting power in future proposals without ever revealing your identity
                            or total balance.
                        </p>
                        <div className="zkbadge-features">
                            <div className="feature-item">
                                <TrendingUp size={20} color="#10B981" />
                                <span>Voting power grows with participation score</span>
                            </div>
                            <div className="feature-item">
                                <Shield size={20} color="#F59E0B" />
                                <span>Identity remains mathematically protected</span>
                            </div>
                            <div className="feature-item">
                                <Award size={20} color="#10B981" />
                                <span>Non-transferable reputation prevents gaming</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
