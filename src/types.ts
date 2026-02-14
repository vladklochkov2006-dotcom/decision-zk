export interface Comment {
    id: number;
    author: string;
    text: string;
    time: string;
    status?: string;
}

export interface Dilemma {
    type: 'dilemma';
    id: number;
    title: string;
    desc: string;
    votes: number;
    status: 'Active' | 'Pass' | 'Fail';
    options?: string[];
    comments?: Comment[];
}

export interface PaidPost {
    type: 'paid_post';
    id: number;
    title: string;
    teaser: string;
    hiddenContent: string;
    price: number;
    isUnlocked: boolean;
    author: string;
    comments?: Comment[];
}

export type FeedItem = Dilemma | PaidPost;

export interface VoteRecord {
    choice: string;
    txId?: string;
    status?: 'Pending' | 'Confirmed' | 'Failed';
}
