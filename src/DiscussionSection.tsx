import { useState } from 'react';
import { Send, User, Lock, Check, Shield, Trophy, Crown, Activity, MessageSquare } from 'lucide-react';
import type { Comment } from './types';
import './App.css';
import { validateContent } from './utils/validation';

interface DiscussionSectionProps {
    isLocked?: boolean;
    lockedMessage?: string;
    comments?: Comment[];
    onPostComment?: (text: string) => void;
    hideHeader?: boolean;
}

export const DiscussionSection: React.FC<DiscussionSectionProps> = ({
    isLocked = false,
    lockedMessage = "Content locked.",
    comments = [],
    onPostComment,
    hideHeader = false
}) => {
    const [newComment, setNewComment] = useState('');
    const [validationError, setValidationError] = useState<string | null>(null);

    const handlePostComment = (e: React.FormEvent) => {
        e.preventDefault();
        setValidationError(null);

        if (!onPostComment) return;

        const validation = validateContent(newComment, { fieldName: 'Comment' });
        if (!validation.isValid) {
            setValidationError(validation.error || 'Invalid content');
            return;
        }

        onPostComment(newComment);
        setNewComment('');
    };

    return (
        <div className="discussion-section">
            {!hideHeader && (
                <div className="discussion-header">
                    <MessageSquare size={16} />
                    <span>Anonymous Discussion</span>
                    <div className="active-dot"></div>
                </div>
            )}

            <div className={`comments-container ${isLocked ? 'locked' : ''}`}>
                {comments.map((comment) => (
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
                ))}

                {comments.length === 0 && (
                    <div className="empty-discussion" style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                        No comments yet. Be the first to speak anonymously.
                    </div>
                )}

                {isLocked && (
                    <div className="discussion-lock-overlay">
                        <Lock size={20} className="text-amber-500 mb-2" />
                        <span className="font-bold text-amber-500">{lockedMessage}</span>
                    </div>
                )}
            </div>

            {validationError && <div className="validation-error">{validationError}</div>}
            <form className="comment-form" onSubmit={handlePostComment}>
                <div className="comment-flex-container">
                    <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder={isLocked ? "Discussion locked..." : "Add an anonymous comment..."}
                        className="comment-input"
                        disabled={isLocked}
                    />
                    <button type="submit" className="comment-submit-btn" disabled={!newComment.trim() || isLocked}>
                        <Send size={16} />
                    </button>
                </div>
            </form>
        </div>
    );
};
