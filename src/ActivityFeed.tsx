import { useState, useEffect } from 'react';
import { Activity, Shield, Zap, FileText, User } from 'lucide-react';
import './App.css';

export interface ActivityItem {
    id: number;
    type: 'vote' | 'identity' | 'proposal' | 'delegation';
    text: string;
    time: string;
    isUser?: boolean;
    txId?: string;
}

export const ActivityFeed = ({ newActivity }: { newActivity?: ActivityItem | null }) => {
    const [activities, setActivities] = useState<ActivityItem[]>([
        { id: 1, type: 'vote', text: "Wallet...8x29 voted Support", time: "2s ago" },
        { id: 2, type: 'identity', text: "Identity...9a12 verified Humanity", time: "12s ago" },
        { id: 3, type: 'vote', text: "Wallet...3m44 voted Oppose", time: "45s ago" },
        { id: 4, type: 'delegation', text: "Wallet...7k99 delegated 500 ZK-Rep", time: "1m ago" },
        { id: 5, type: 'proposal', text: "New Proposal: Treasury Allocation", time: "2m ago" },
        { id: 6, type: 'vote', text: "Wallet...2p11 voted Support", time: "3m ago" }
    ]);

    // Add user activity when it changes
    useEffect(() => {
        if (newActivity) {
            setActivities(prev => [newActivity, ...prev].slice(0, 10));
        }
    }, [newActivity]);

    useEffect(() => {
        const interval = setInterval(() => {
            const types: ('vote' | 'identity' | 'proposal' | 'delegation')[] = ['vote', 'identity', 'vote', 'delegation'];
            const randomType = types[Math.floor(Math.random() * types.length)];
            const randomWallet = "Wallet..." + Math.random().toString(36).substring(2, 6);

            let text = "";
            switch (randomType) {
                case 'vote':
                    text = `${randomWallet} voted ${Math.random() > 0.5 ? 'Support' : 'Oppose'}`;
                    break;
                case 'identity':
                    text = `Identity...${Math.random().toString(36).substring(2, 6)} verified Humanity`;
                    break;
                case 'delegation':
                    text = `${randomWallet} delegated ${Math.floor(Math.random() * 1000)} ZK-Rep`;
                    break;
                case 'proposal':
                    text = "New Proposal created";
                    break;
            }

            const newActivity: ActivityItem = {
                id: Date.now(),
                type: randomType,
                text: text,
                time: "Just now"
            };

            setActivities(prev => [newActivity, ...prev].slice(0, 10));
        }, 4000);

        return () => clearInterval(interval);
    }, []);

    const getIcon = (type: string) => {
        switch (type) {
            case 'vote': return <Zap size={14} color="#FFD700" />;
            case 'identity': return <Shield size={14} color="#00D9FF" />;
            case 'proposal': return <FileText size={14} color="#A855F7" />;
            case 'delegation': return <User size={14} color="#4ade80" />;
            default: return <Activity size={14} />;
        }
    };

    return (
        <div className="activity-feed">
            <div className="feed-header">
                <h3><Activity size={16} /> Live Network</h3>
                <span className="live-dot"></span>
            </div>
            <div className="feed-list">
                {activities.map(item => (
                    <div key={item.id} className={`feed-item slide-in ${item.isUser ? 'user-activity' : ''}`}>
                        <div className="feed-icon">
                            {getIcon(item.type)}
                        </div>
                        <div className="feed-content">
                            <p>{item.text}</p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                <span>{item.time}</span>
                                {item.txId && (
                                    <a
                                        href={`https://testnet.explorer.provable.com/transaction/${item.txId}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ color: '#FFD700', fontSize: '10px', textDecoration: 'none', borderBottom: '1px dotted #FFD700' }}
                                    >
                                        View Proof ↗
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
