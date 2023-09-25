export interface ChatMessage {
    type?: string;
    text?: string;
    date?: number;
    user?: {
        avatar?: string;
        name?: string
    }
    reply?: boolean;
    files?: any[];
    quote?: string;
    avatar?: string;
}