import { Shield, TrendingUp, Target, Award, Eye, EyeOff } from 'lucide-react';

export const ZKBadge = () => {
    return (
        <section className="zk-badge-section">
            <div className="zk-badge-container">
                <div className="zk-badge-header">
                    <h2>Anonymous Reputation</h2>
                    <p>Prove your track record without revealing your identity</p>
                </div>

                <div className="zk-badge-showcase">
                    {/* Left: Badge Card */}
                    <div className="reputation-card">
                        <div className="card-header">
                            <Shield size={28} color="#00D9FF" />
                            <span className="card-title">ZK-Reputation Badge</span>
                        </div>

                        <div className="stats-grid">
                            <div className="stat-box">
                                <div className="stat-icon">
                                    <Target size={20} color="#00FF88" />
                                </div>
                                <div className="stat-value">92.4</div>
                                <div className="stat-label">Reputation Score</div>
                            </div>

                            <div className="stat-box">
                                <div className="stat-icon">
                                    <TrendingUp size={20} color="#00D9FF" />
                                </div>
                                <div className="stat-value">127</div>
                                <div className="stat-label">Decisions</div>
                            </div>

                            <div className="stat-box">
                                <div className="stat-icon">
                                    <Award size={20} color="#A855F7" />
                                </div>
                                <div className="stat-value">Top 5%</div>
                                <div className="stat-label">Rank</div>
                            </div>
                        </div>

                        <div className="verification-footer">
                            <div className="verification-item verified">
                                <Shield size={16} />
                                <span>Verified on Aleo</span>
                            </div>
                            <div className="verification-item hidden">
                                <EyeOff size={16} />
                                <span>Identity: Hidden</span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Explanation */}
                    <div className="zk-badge-explanation">
                        <div className="explanation-header">
                            <Eye size={24} color="#00D9FF" />
                            <h3>What You See</h3>
                        </div>
                        <p className="explanation-text">
                            This user has made <strong>127 governance contributions</strong> with a <strong>92.4 Reputation Score</strong>,
                            placing them in the <strong>top 5%</strong> of all participants.
                        </p>

                        <div className="explanation-header" style={{ marginTop: '30px' }}>
                            <EyeOff size={24} color="#A855F7" />
                            <h3>What Stays Private</h3>
                        </div>
                        <p className="explanation-text">
                            Their wallet address, voting history, and stake amounts remain completely hidden.
                            Only the <strong>mathematical proof</strong> of their performance is visible.
                        </p>

                        <div className="zk-badge-highlight">
                            <span className="highlight-icon">🔒</span>
                            <span>Reputation without surveillance</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
