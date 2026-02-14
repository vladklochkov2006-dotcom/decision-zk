import { useState } from 'react';
import { Send, User, Lock, Check, Shield, Trophy, Crown, Activity, MessageSquare } from 'lucide-react';
import type { Comment } from './types';
import './App.css';



interface DiscussionSectionProps {
    proposalId: number;
    isLocked?: boolean;
    lockedMessage?: string;
    initialComments?: Comment[];
}

export const DiscussionSection = ({ proposalId, isLocked = false, lockedMessage = "Unlock content to join the anonymous discussion.", initialComments }: DiscussionSectionProps) => {
    const [comments, setComments] = useState<Comment[]>(initialComments || [
        { id: 1, author: "Anon #492", text: "This is critical for scaling. We need higher proving speeds immediately.", time: "2m ago", status: "Top 5% Staker" },
        { id: 2, author: "Anon #105", text: "I'm concerned about the initial cost, but the long-term payoff seems worth it.", time: "15m ago", status: "Verifier Node" },
        { id: 3, author: "Anon #883", text: "Has anyone verified the hardware specs proposed?", time: "1h ago" },
        { id: 4, author: "Anon #011", text: "My node is ready. Let's push this update.", time: "2h ago", status: "15% Reputation Stake" },
        { id: 5, author: "Anon #772", text: "Wait, is this compatible with the new Leo version?", time: "3h ago" },
        { id: 6, author: "Anon #999", text: "Buying more ZK-REP just to vote YES on this.", time: "5h ago", status: "Whale Holder" }
    ]);
    const [newComment, setNewComment] = useState('');

    const handlePostComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        const comment: Comment = {
            id: Date.now(),
            author: "You (Anon)",
            text: newComment,
            time: "Just now",
            status: "Token Holder"
        };

        setComments([comment, ...comments]);
        setNewComment('');
    };

    if (isLocked) {
        return (
            <div className="discussion-locked-container" style={{
                padding: '20px',
                background: 'rgba(0,0,0,0.3)',
                borderRadius: '8px',
                marginTop: '15px',
                border: '1px border #333',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#666',
                gap: '10px'
            }}>
                <Lock size={24} style={{ opacity: 0.5 }} />
                <span style={{ fontSize: '0.9rem' }}>{lockedMessage}</span>
            </div>
        );
    }

    return (
        <div className="comments-section">
            <div className="comments-header">
                <h4>Anonymous Discussion</h4>
                <div className="live-indicator">
                    <span className="dot"></span> Live
                </div>
            </div>

            <div className="comments-list">
                {comments.length === 0 ? (
                    <div className="empty-state" style={{
                        textAlign: 'center',
                        padding: '40px 20px',
                        color: '#666',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '12px'
                    }}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '50%',
                            background: 'rgba(0, 217, 255, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '4px'
                        }}>
                            <MessageSquare size={24} color="#00D9FF" style={{ opacity: 0.8 }} />
                        </div>
                        <p style={{ fontSize: '0.95rem', fontWeight: 500, color: '#aaa' }}>No insider info yet.</p>
                        <p style={{ fontSize: '0.85rem', maxWidth: '250px', lineHeight: '1.4' }}>
                            Be the first to unlock this content and share your alpha!
                        </p>
                    </div>
                ) : (
                    comments.map((comment) => (
                        <div key={comment.id} className={`comment-bubble ${comment.author.includes('You') ? 'my-comment' : ''}`}>
                            <div className="comment-meta">
                                <span className="comment-author">
                                    <User size={12} /> {comment.author}
                                    {comment.status && (
                                        <span className={`token-holder-badge ${comment.status.includes('Staker') || comment.status.includes('Whale') ? 'gold' :
                                            comment.status.includes('Verifier') ? 'purple' : ''
                                            }`}>
                                            {comment.status.includes('Staker') ? <Trophy size={10} /> :
                                                comment.status.includes('Verifier') ? <Shield size={10} /> :
                                                    comment.status.includes('Whale') ? <Crown size={10} /> :
                                                        comment.status.includes('Reputation') ? <Activity size={10} /> :
                                                            <Check size={10} />}
                                            {comment.status}
                                        </span>
                                    )}
                                </span>
                                <span className="comment-time">{comment.time}</span>
                            </div>
                            <p className="comment-text">{comment.text}</p>
                        </div>
                    ))
                )}
            </div>

            <form className="comment-form" onSubmit={handlePostComment}>
                <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add an anonymous comment..."
                    className="comment-input"
                />
                <button type="submit" className="comment-submit-btn" disabled={!newComment.trim()}>
                    <Send size={16} />
                </button>
            </form>
        </div>
    );
};
