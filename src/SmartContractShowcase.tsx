import { motion } from 'framer-motion';
import { Code2, Lock, Zap } from 'lucide-react';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2
        }
    }
};

const codeVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1
    }
};

export const SmartContractShowcase = () => {
    return (
        <section className="contract-showcase-section">
            <motion.div
                className="showcase-container"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={containerVariants}
            >
                <motion.h2 className="showcase-title" variants={codeVariants}>
                    Built on Aleo Smart Contracts
                </motion.h2>
                <motion.p className="showcase-subtitle" variants={codeVariants}>
                    Zero-knowledge proofs generated client-side, verified on-chain
                </motion.p>

                <div className="contracts-grid">
                    <motion.div className="contract-card" variants={codeVariants}>
                        <div className="contract-header">
                            <div className="contract-icon">
                                <Lock size={24} color="#00D9FF" />
                            </div>
                            <div>
                                <h3>Anonymous Voting</h3>
                                <p>ZK-proof generation</p>
                            </div>
                        </div>
                        <div className="code-block">
                            <pre><code>{`transition vote_private(
  proposal_id: u64,
  vote: bool,
  stake: u64
) -> VoteProof {
  
  // Generate ZK-proof
  let proof: field = hash_to_field(
    proposal_id,
    vote,
    stake,
    self.caller
  );
  
  return VoteProof {
    proof: proof,
    nullifier: hash(self.caller)
  };
}`}</code></pre>
                        </div>
                        <div className="contract-badge">
                            <Code2 size={14} />
                            <span>vote_private.aleo</span>
                        </div>
                    </motion.div>

                    <motion.div className="contract-card" variants={codeVariants}>
                        <div className="contract-header">
                            <div className="contract-icon">
                                <Zap size={24} color="#00FF88" />
                            </div>
                            <div>
                                <h3>Instant Settlement</h3>
                                <p>On-chain verification</p>
                            </div>
                        </div>
                        <div className="code-block">
                            <pre><code>{`transition verify_and_count(
  proof: VoteProof,
  proposal_id: u64
) -> u64 {
  
  // Verify ZK-proof
  assert(verify_proof(
    proof.proof,
    proposal_id
  ));
  
  // Update count atomically
  let count: u64 = 
    votes.get_or_use(
      proposal_id, 
      0u64
    );
    
  return count + 1u64;
}`}</code></pre>
                        </div>
                        <div className="contract-badge">
                            <Code2 size={14} />
                            <span>verify_count.aleo</span>
                        </div>
                    </motion.div>
                </div>

                <motion.div className="showcase-footer" variants={codeVariants}>
                    <div className="footer-stat">
                        <span className="stat-number">100%</span>
                        <span className="stat-label">Client-side privacy</span>
                    </div>
                    <div className="footer-stat">
                        <span className="stat-number">{'<2s'}</span>
                        <span className="stat-label">Proof verification</span>
                    </div>
                    <div className="footer-stat">
                        <span className="stat-number">0</span>
                        <span className="stat-label">Trusted parties</span>
                    </div>
                </motion.div>
            </motion.div>
        </section>
    );
};
