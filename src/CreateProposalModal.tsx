import { useState } from 'react';
import { X, Lock, Check, Sparkles, Plus, Trash2, FileText, LayoutTemplate } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { validateContent } from './utils/validation';

interface CreateProposalModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
}

export const CreateProposalModal = ({ isOpen, onClose, onSubmit }: CreateProposalModalProps) => {
    const [type, setType] = useState<'proposal' | 'paid_post'>('proposal');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [stakeAmount, setStakeAmount] = useState(0.1);
    const [options, setOptions] = useState(['Yes', 'No']); // For Proposal

    // For Paid Post
    const [teaser, setTeaser] = useState('');
    const [hiddenContent, setHiddenContent] = useState('');
    const [price, setPrice] = useState(1);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [validationError, setValidationError] = useState<string | null>(null);

    const handleAddOption = () => {
        if (options.length < 5) {
            setOptions([...options, '']);
        }
    };

    const handleRemoveOption = (index: number) => {
        if (options.length > 2) {
            const newOptions = options.filter((_, i) => i !== index);
            setOptions(newOptions);
        }
    };

    const handleOptionChange = (index: number, value: string) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const handleInvalid = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        (e.target as HTMLInputElement | HTMLTextAreaElement).setCustomValidity('Please fill out this field.');
    };

    const handleInput = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        (e.target as HTMLInputElement | HTMLTextAreaElement).setCustomValidity('');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setValidationError(null);

        // Validation for Title
        const titleVal = validateContent(title, { fieldName: 'Title' });
        if (!titleVal.isValid) {
            setValidationError(titleVal.error || 'Invalid Title');
            return;
        }

        if (type === 'proposal') {
            if (options.some(opt => !opt.trim())) {
                setValidationError('All options must be filled.');
                return;
            }
            if (description.trim()) {
                const descVal = validateContent(description, { fieldName: 'Description' });
                if (!descVal.isValid) {
                    setValidationError(descVal.error || 'Invalid Description');
                    return;
                }
            }
        } else {
            const teaserVal = validateContent(teaser, { fieldName: 'Teaser' });
            if (!teaserVal.isValid) {
                setValidationError(teaserVal.error || 'Invalid Teaser');
                return;
            }
            const contentVal = validateContent(hiddenContent, { fieldName: 'Hidden Content' });
            if (!contentVal.isValid) {
                setValidationError(contentVal.error || 'Invalid Hidden Content');
                return;
            }
        }

        setIsSubmitting(true);

        // Immediate submission to handoff to App.tsx ZK flow
        if (type === 'proposal') {
            onSubmit({ type: 'proposal', title, description, stakeAmount, options });
        } else {
            onSubmit({ type: 'paid_post', title, teaser, hiddenContent, price });
        }

        setIsSubmitting(false);
        // Reset fields
        setTitle('');
        setDescription('');
        setStakeAmount(0.1);
        setOptions(['Yes', 'No']);
        setTeaser('');
        setHiddenContent('');
        setPrice(50);

        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="modal-overlay">
                    <motion.div
                        className="modal-container"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                    >
                        <button className="modal-close" onClick={onClose}>
                            <X size={24} />
                        </button>

                        <div className="modal-header">
                            {type === 'proposal' ? <Lock size={32} color="#10B981" /> : <Lock size={32} color="#FFD700" />}
                            <h2>Create New Content</h2>
                            <p>All content is encrypted and anonymously posted.</p>
                        </div>

                        <div className="modal-tabs">
                            <button
                                className={`modal-tab ${type === 'proposal' ? 'active' : ''}`}
                                onClick={() => setType('proposal')}
                            >
                                <LayoutTemplate size={16} /> Proposal
                            </button>
                            <button
                                className={`modal-tab ${type === 'paid_post' ? 'active' : ''}`}
                                onClick={() => setType('paid_post')}
                            >
                                <FileText size={16} /> Paid Post
                            </button>
                        </div>

                        {validationError && (
                            <div className="validation-error" style={{ marginBottom: '15px' }}>
                                {validationError}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>{type === 'proposal' ? 'Question / Proposal Title' : 'Post Title'}</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder={type === 'proposal' ? "e.g., Should we increase rewards?" : "e.g., Alpha Leak: New Partnership"}
                                    required
                                    onInvalid={handleInvalid}
                                    onInput={handleInput}
                                    autoFocus
                                />
                            </div>

                            {type === 'proposal' ? (
                                <>
                                    <div className="form-group">
                                        <label>Description (Optional)</label>
                                        <textarea
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            placeholder="Provide context..."
                                            rows={3}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Voting Options</label>
                                        <div className="options-list">
                                            {options.map((option, index) => (
                                                <div key={index} className="option-input-row">
                                                    <input
                                                        type="text"
                                                        value={option}
                                                        onChange={(e) => handleOptionChange(index, e.target.value)}
                                                        placeholder={`Option ${index + 1}`}
                                                        required
                                                        onInvalid={handleInvalid}
                                                        onInput={handleInput}
                                                    />
                                                    {options.length > 2 && (
                                                        <button type="button" className="btn-remove-option" onClick={() => handleRemoveOption(index)}>
                                                            <Trash2 size={16} />
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                        {options.length < 5 && (
                                            <button type="button" className="btn-add-option" onClick={handleAddOption}>
                                                <Plus size={16} /> Add Option
                                            </button>
                                        )}
                                    </div>
                                    <div className="form-group">
                                        <label>Stake Amount (ALEO)</label>
                                        <div className="price-selection-group">
                                            <div className="price-input-wrapper emerald">
                                                <input
                                                    type="number"
                                                    min="0.1"
                                                    max="1000"
                                                    step="0.1"
                                                    value={stakeAmount}
                                                    onChange={(e) => setStakeAmount(Number(e.target.value))}
                                                    className="price-field-input"
                                                />
                                                <span className="price-field-suffix">ALEO</span>
                                            </div>
                                            <div className="quick-price-choices">
                                                {[0.1, 0.5, 1, 5, 10].map((val) => (
                                                    <button
                                                        key={val}
                                                        type="button"
                                                        className={`price-choice-btn emerald ${stakeAmount === val ? 'active' : ''}`}
                                                        onClick={() => setStakeAmount(val)}
                                                    >
                                                        {val}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="form-group">
                                        <label>Public Teaser (Visible to everyone)</label>
                                        <textarea
                                            value={teaser}
                                            onChange={(e) => setTeaser(e.target.value)}
                                            placeholder="Hook the reader without revealing the secret..."
                                            rows={2}
                                            required
                                            onInvalid={handleInvalid}
                                            onInput={handleInput}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Hidden Content (Blurred until paid)</label>
                                        <textarea
                                            value={hiddenContent}
                                            onChange={(e) => setHiddenContent(e.target.value)}
                                            placeholder="The valuable alpha, code, or data..."
                                            rows={4}
                                            required
                                            onInvalid={handleInvalid}
                                            onInput={handleInput}
                                            style={{ borderColor: '#FFD700' }}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Unlock Price (ALEO)</label>
                                        <div className="price-selection-group">
                                            <div className="price-input-wrapper">
                                                <input
                                                    type="number"
                                                    min="0.1"
                                                    max="1000"
                                                    step="0.1"
                                                    value={price}
                                                    onChange={(e) => setPrice(Number(e.target.value))}
                                                    className="price-field-input"
                                                />
                                                <span className="price-field-suffix">ALEO</span>
                                            </div>
                                            <div className="quick-price-choices">
                                                {[0.1, 0.5, 1, 5, 10].map((val) => (
                                                    <button
                                                        key={val}
                                                        type="button"
                                                        className={`price-choice-btn ${price === val ? 'active' : ''}`}
                                                        onClick={() => setPrice(val)}
                                                    >
                                                        {val}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}

                            <div className="modal-actions">
                                <button type="button" className="btn-cancel" onClick={onClose}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn-submit" disabled={isSubmitting}>
                                    {isSubmitting ? (
                                        <>
                                            <Sparkles size={18} className="spinning" />
                                            {type === 'proposal' ? 'Generating Proof...' : 'Encrypting Content...'}
                                        </>
                                    ) : (
                                        <>
                                            <Check size={18} />
                                            {type === 'proposal' ? 'Publish Proposal' : 'Post Paid Content'}
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                    <div className="modal-backdrop" onClick={onClose} />
                </div>
            )}
        </AnimatePresence>
    );
};
