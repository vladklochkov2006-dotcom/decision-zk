import { Check, Clock, Shield } from "lucide-react";
import { PrivacySensitive } from "./contexts/PrivacyContext";
import "./App.css";

export const MyProofs = ({ stats }: { stats?: any }) => {
    // Mock data for proof history
    const proofs = [
        {
            id: "0x123...abc",
            action: "Voted Support",
            proposal: "Allocate 20% to ZK-Hardware",
            time: "2h ago",
            reputation: "+2.5 REP",
            status: "Verified"
        },
        {
            id: "0x456...def",
            action: "Created Proposal",
            proposal: "Quadratic Voting Implementation",
            time: "1d ago",
            reputation: "+5.0 REP",
            status: "Verified"
        },
        {
            id: "0x789...ghi",
            action: "Voted Oppose",
            proposal: "Reduce Staking Minimum",
            time: "3d ago",
            reputation: "+1.0 REP",
            status: "Verified"
        }
    ];

    const displayStats = stats || { rep: 92.4, proofs: 15, alpha: 12.5, delegation: 5.0 };

    return (
        <div className="my-proofs-container">
            <header className="terminal-header">
                <div>
                    <h1>My ZK Proofs</h1>
                    <p>Your on-chain activity verified by zero-knowledge proofs</p>
                </div>
                <div className="header-stats-simple">
                    <div className="stat-item">
                        <PrivacySensitive>
                            <span className="value">{displayStats.rep}</span>
                        </PrivacySensitive>
                        <span className="label">ZK-REP</span>
                    </div>
                    <div className="stat-divider"></div>
                    <div className="stat-item">
                        <PrivacySensitive>
                            <span className="value">+{displayStats.alpha}</span>
                        </PrivacySensitive>
                        <span className="label">Alpha Rewards</span>
                    </div>
                    <div className="stat-divider"></div>
                    <div className="stat-item">
                        <PrivacySensitive>
                            <span className="value">+{displayStats.delegation}</span>
                        </PrivacySensitive>
                        <span className="label">Delegation</span>
                    </div>
                </div>
            </header>

            <div className="proofs-list">
                {proofs.map((proof, index) => (
                    <div key={index} className="proof-card">
                        <div className="proof-icon">
                            <Shield size={20} color="#10B981" />
                        </div>
                        <div className="proof-details">
                            <div className="proof-title">
                                {proof.action}
                                <span className="proof-id">{proof.id}</span>
                            </div>
                            <div className="proof-proposal">{proof.proposal}</div>
                        </div>
                        <div className="proof-meta">
                            <div className="proof-status">
                                <Check size={14} /> {proof.status}
                            </div>
                            <div className="proof-time">
                                <Clock size={14} /> {proof.time}
                            </div>
                            <PrivacySensitive>
                                <div className="proof-rep">{proof.reputation}</div>
                            </PrivacySensitive>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
