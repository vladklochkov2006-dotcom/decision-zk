import React, { createContext, useContext, useState, type ReactNode } from 'react';

interface PrivacyContextType {
    isPrivacyMode: boolean;
    togglePrivacyMode: () => void;
}

const PrivacyContext = createContext<PrivacyContextType | undefined>(undefined);

export const PrivacyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isPrivacyMode, setIsPrivacyMode] = useState(false);

    const togglePrivacyMode = () => {
        setIsPrivacyMode(prev => !prev);
    };

    return (
        <PrivacyContext.Provider value={{ isPrivacyMode, togglePrivacyMode }}>
            {children}
        </PrivacyContext.Provider>
    );
};

export const usePrivacy = () => {
    const context = useContext(PrivacyContext);
    if (context === undefined) {
        throw new Error('usePrivacy must be used within a PrivacyProvider');
    }
    return context;
};

export const PrivacySensitive: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { isPrivacyMode } = usePrivacy();

    const privacyStyle: React.CSSProperties = isPrivacyMode ? {
        filter: 'blur(8px)',
        userSelect: 'none',
        pointerEvents: 'none',
        transition: 'filter 0.3s ease'
    } : {
        transition: 'filter 0.3s ease'
    };

    return (
        <span style={privacyStyle}>
            {children}
        </span>
    );
};
