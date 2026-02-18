import { memo } from 'react';


export const ParticleBackground = memo(() => {
    return (
        <div className="aurora-bg" aria-hidden="true">
            <div
                className="aurora-blob aurora-blob-1"
                style={{
                    background: 'radial-gradient(circle, rgba(16, 185, 129, 0.18) 0%, transparent 70%)',
                }}
            />
            <div
                className="aurora-blob aurora-blob-2"
                style={{
                    background: 'radial-gradient(circle, rgba(245, 158, 11, 0.14) 0%, transparent 70%)',
                }}
            />
            <div
                className="aurora-blob aurora-blob-3"
                style={{
                    background: 'radial-gradient(circle, rgba(16, 185, 129, 0.10) 0%, transparent 70%)',
                }}
            />
        </div>
    );
});
