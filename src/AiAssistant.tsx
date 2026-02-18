import React, { useState, useEffect, useRef } from 'react';
import { Bot, ShieldCheck, Lock, Send, Cpu } from 'lucide-react';
import { WalletMenu } from './WalletMenu';
import './AiAssistant.css';

interface Message {
    id: number;
    type: 'ai' | 'user';
    text: string;
}

interface AiAssistantProps {
    onOpenSettings?: () => void;
    publicBalance: number;
    privateBalance: number;
    onShield: () => void;
    externalTrigger?: string;
}

export const AiAssistant: React.FC<AiAssistantProps> = ({
    onOpenSettings,
    publicBalance,
    privateBalance,
    onShield,
    externalTrigger
}) => {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            type: 'ai',
            text: "Hello! I am your ZK-Copilot. I can verify the security and privacy of this voting process."
        }
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleQuickAction = (action: 'risks' | 'privacy' | 'aleo' | 'security_audit') => {
        const actionMap = {
            risks: { user: "Analyze Risks", ai: "Analyzing smart contract... No vulnerabilities found. The proposal is safe to execute." },
            privacy: { user: "Privacy Audit", ai: "We use Aleo's Varuna proof system (Marlin-based) Your identity remains hidden, but your vote is mathematically accounted for." },
            aleo: { user: "Aleo Advantage", ai: "Aleo is the only L1 that provides programmable privacy. By using ZK-proofs at the protocol level, we ensure that your governance decisions are truly decentralized and cryptographically shielded. This project leverages Aleo's unique architecture to solve the bias problem in modern DAOs." },
            security_audit: { user: "Security Audit Requested", ai: "VERIFYING_ZK_PROOF_INTEGRITY... [DONE]\nENCRYPTION_PHASE: Poseidon Hash / Marlin-zkSNARK\nResult: VALID. Your shielded vote will be processed via Aleo's Privacy Layer. No leakage detected." }
        };

        const { user: userText, ai: aiResponse } = actionMap[action as keyof typeof actionMap];

        // Add user message
        setMessages(prev => [...prev, { id: Date.now(), type: 'user', text: userText }]);

        // Trigger typing simulation
        setIsTyping(true);

        setTimeout(() => {
            setIsTyping(false);
            setMessages(prev => [...prev, { id: Date.now() + 1, type: 'ai', text: aiResponse }]);
        }, 1500);
    };

    // Watch for external triggers from other components
    useEffect(() => {
        if (externalTrigger && externalTrigger !== 'IDLE') {
            handleQuickAction('security_audit');
        }
    }, [externalTrigger]);

    return (
        <div className="ai-assistant-wrapper">
            {/* Header */}
            <div className="ai-assistant-header">
                <div className="ai-header-top">
                    <div className="ai-bot-info">
                        <div className="ai-bot-icon-container">
                            <Bot size={20} />
                        </div>
                        <div className="ai-header-text">
                            <h3>ZK-Assistant</h3>
                            <div className="ai-status-indicator">
                                <span className="ai-status-dot"></span>
                                <span className="ai-status-label">Online</span>
                            </div>
                        </div>
                    </div>
                    <div className="ai-wallet-section">
                        <WalletMenu
                            onSettingsClick={onOpenSettings}
                            externalPublicBalance={publicBalance}
                            externalPrivateBalance={privateBalance}
                            onExternalShield={onShield}
                        />
                        <div className="powered-by">Powered by Aleo</div>
                    </div>
                </div>
            </div>

            {/* Chat Area */}
            <div className="ai-chat-area">
                {messages.map((msg) => (
                    <div key={msg.id} className={`ai-message-row ${msg.type}`}>
                        <div className="ai-message-bubble">
                            {msg.text}
                        </div>
                    </div>
                ))}

                {isTyping && (
                    <div className="ai-message-row ai">
                        <div className="ai-typing-bubble">
                            <span className="ai-dot"></span>
                            <span className="ai-dot"></span>
                            <span className="ai-dot"></span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Footer / Actions */}
            <div className="ai-assistant-footer">
                <div className="ai-footer-label">Governance Intelligence</div>
                <div className="ai-quick-actions">
                    <button
                        onClick={() => handleQuickAction('risks')}
                        disabled={isTyping}
                        className="ai-action-btn"
                    >
                        <ShieldCheck size={18} />
                        <span>Analyze Proposal Risks</span>
                    </button>

                    <button
                        onClick={() => handleQuickAction('privacy')}
                        disabled={isTyping}
                        className="ai-action-btn"
                    >
                        <Lock size={18} />
                        <span>ZK-Privacy Audit</span>
                    </button>

                    <button
                        onClick={() => handleQuickAction('aleo')}
                        disabled={isTyping}
                        className="ai-action-btn"
                    >
                        <Cpu size={18} />
                        <span>Aleo Advantage</span>
                    </button>
                </div>

                <div className="ai-input-mockup">
                    <input
                        type="text"
                        placeholder="Ask anything..."
                        disabled
                    />
                    <Send size={16} className="ai-send-icon" />
                </div>
            </div>
        </div>
    );
};
