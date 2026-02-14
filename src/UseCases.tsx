import { Building2, Lightbulb, MessageSquare } from 'lucide-react';

export const UseCases = () => {
    return (
        <section className="use-cases-section">
            <div className="use-cases-container">
                <h2 className="use-cases-title">Real-World Use Cases</h2>
                <p className="use-cases-subtitle">
                    Where anonymous, verifiable decision-making matters most
                </p>

                <div className="use-cases-grid">
                    <div className="use-case-card">
                        <div className="use-case-icon">
                            <Building2 size={32} color="#00D9FF" />
                        </div>
                        <h3>Corporate Governance</h3>
                        <p>
                            Conduct anonymous shareholder votes without risk of pressure from management.
                            Board decisions, executive appointments, and strategic pivots remain confidential
                            until official announcement.
                        </p>
                        <div className="use-case-tag">Enterprise</div>
                    </div>

                    <div className="use-case-card">
                        <div className="use-case-icon">
                            <Lightbulb size={32} color="#A855F7" />
                        </div>
                        <h3>Strategic Proposals</h3>
                        <p>
                            Make secret decisions about mergers, acquisitions, or company direction changes.
                            Competitors won't learn about strategic shifts until official release, preserving
                            market advantage.
                        </p>
                        <div className="use-case-tag">Strategy</div>
                    </div>

                    <div className="use-case-card">
                        <div className="use-case-icon">
                            <MessageSquare size={32} color="#00D9FF" />
                        </div>
                        <h3>Whistleblowing & Feedback</h3>
                        <p>
                            Safely collect feedback in large organizations where every voice is mathematically
                            protected. Employees can report issues or vote on policies without fear of
                            retaliation.
                        </p>
                        <div className="use-case-tag">HR & Compliance</div>
                    </div>
                </div>
            </div>
        </section>
    );
};
