import { useState, useEffect, useCallback } from 'react';
import { useWallet } from '@demox-labs/aleo-wallet-adapter-react';

export const useHasVoted = (proposalId: number) => {
    const { publicKey } = useWallet();
    const [hasVoted, setHasVotedState] = useState(false);
    const [voteData, setVoteDataState] = useState<any>(null);

    const getStorageKey = useCallback((address: string, id: number) => {
        return `vote_${address}_${id}`;
    }, []);

    const checkVoteStatus = useCallback(() => {
        if (!publicKey) {
            setHasVotedState(false);
            setVoteDataState(null);
            return;
        }

        const key = getStorageKey(publicKey, proposalId);
        const stored = localStorage.getItem(key);

        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                setHasVotedState(true);
                setVoteDataState(parsed);
            } catch (e) {
                console.error("Failed to parse vote data", e);
                setHasVotedState(false);
                setVoteDataState(null);
            }
        } else {
            setHasVotedState(false);
            setVoteDataState(null);
        }
    }, [publicKey, proposalId, getStorageKey]);

    useEffect(() => {
        checkVoteStatus();

        // Listen for storage changes (external/console)
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === null || (publicKey && e.key === getStorageKey(publicKey, proposalId))) {
                checkVoteStatus();
            }
        };

        // Listen for custom events to sync across components in the same tab
        const handleSync = (e: any) => {
            if (e.detail && e.detail.proposalId === proposalId) {
                checkVoteStatus();
            }
        };

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('vote_updated', handleSync);
        window.addEventListener('focus', checkVoteStatus);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('vote_updated', handleSync);
            window.removeEventListener('focus', checkVoteStatus);
        };
    }, [checkVoteStatus, proposalId, publicKey, getStorageKey]);

    const saveVote = (data: any) => {
        if (!publicKey) return;

        const key = getStorageKey(publicKey, proposalId);
        localStorage.setItem(key, JSON.stringify(data));

        // Update local state
        setHasVotedState(true);
        setVoteDataState(data);

        // Dispatch event to sync other hook instances
        window.dispatchEvent(new CustomEvent('vote_updated', {
            detail: { proposalId, wallet: publicKey }
        }));
    };

    return { hasVoted, voteData, saveVote, checkVoteStatus };
};
