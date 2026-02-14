import { useState, useEffect } from "react";

// Тип даних для одного поста
type Post = {
    id: number;
    author: string;
    content: string;
    timestamp: string;
    ipfsHash?: string;
};

export const Feed = () => {
    // 1. Фейкові дані (імітуємо, що ми їх скачали з блокчейну)
    const [posts, setPosts] = useState<Post[]>([
        {
            id: 1,
            author: "aleo1y06sn...hvxqyluw5m", // Твоя адреса (приклад)
            content: "Це мій перший пост у децентралізованій мережі PrivateFeed! 🚀",
            timestamp: "10 хв тому",
            ipfsHash: "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco"
        },
        {
            id: 2,
            author: "aleo1KB9...zkPy2",
            content: "Анонімність - це право, а не привілей. #ZeroKnowledge",
            timestamp: "1 година тому",
            ipfsHash: "bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi"
        },
        {
            id: 3,
            author: "aleo1Guest...UserX",
            content: "Хто знає, коли запускається Mainnet?",
            timestamp: "2 години тому",
        }
    ]);

    return (
        <div className="feed-container">
            <h2 className="feed-title">Останні новини</h2>

            <div className="feed-list">
                {posts.map((post) => (
                    <div key={post.id} className="post-card">

                        {/* Шапка поста: Автор + Час */}
                        <div className="post-header">
                            <div className="author-avatar">
                                {/* Генеруємо аватарку з перших літер адреси */}
                                {post.author.substring(5, 7).toUpperCase()}
                            </div>
                            <div className="post-info">
                                <span className="author-name">
                                    {post.author.slice(0, 6)}...{post.author.slice(-4)}
                                </span>
                                <span className="post-time">{post.timestamp}</span>
                            </div>
                        </div>

                        {/* Тіло поста */}
                        <div className="post-content">
                            {post.content}
                        </div>

                        {/* Футер: Хеш IPFS (якщо є) */}
                        {post.ipfsHash && (
                            <div className="post-footer">
                                <span className="ipfs-badge">IPFS</span>
                                <a
                                    href={`https://gateway.pinata.cloud/ipfs/${post.ipfsHash}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="ipfs-link"
                                >
                                    {post.ipfsHash.slice(0, 10)}...
                                </a>
                            </div>
                        )}

                    </div>
                ))}
            </div>
        </div>
    );
};