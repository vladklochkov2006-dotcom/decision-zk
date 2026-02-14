import { useState } from 'react';
import { Send, User } from 'lucide-react';
import './App.css';

interface Comment {
    id: number;
    author: string;
    text: string;
    time: string;
}

interface CommentsSectionProps {
    proposalId: number;
}

export const CommentsSection = ({ proposalId }: CommentsSectionProps) => {
    const [comments, setComments] = useState<Comment[]>([
        { id: 1, author: "Anon #492", text: "This is critical for scaling. We need higher proving speeds immediately.", time: "2m ago" },
        { id: 2, author: "Anon #105", text: "I'm concerned about the initial cost, but the long-term payoff seems worth it.", time: "15m ago" },
        { id: 3, author: "Anon #883", text: "Has anyone verified the hardware specs proposed?", time: "1h ago" }
    ]);
    const [newComment, setNewComment] = useState('');

    const handlePostComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        const comment: Comment = {
            id: Date.now(),
            author: "You (Anon)",
            text: newComment,
            time: "Just now"
        };

        setComments([comment, ...comments]);
        setNewComment('');
    };

    return (
        <div className="comments-section">
            <div className="comments-header">
                <h4>Anonymous Discussion</h4>
                <div className="live-indicator">
                    <span className="dot"></span> Live
                </div>
            </div>

            <div className="comments-list">
                {comments.map((comment) => (
                    <div key={comment.id} className={`comment-bubble ${comment.author.includes('You') ? 'my-comment' : ''}`}>
                        <div className="comment-meta">
                            <span className="comment-author">
                                <User size={12} /> {comment.author}
                            </span>
                            <span className="comment-time">{comment.time}</span>
                        </div>
                        <p className="comment-text">{comment.text}</p>
                    </div>
                ))}
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
