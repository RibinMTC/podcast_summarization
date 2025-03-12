export interface SummaryResult {
    summary: string;
    actionItems: string[];
    status: 'idle' | 'loading' | 'completed' | 'error';
    error?: string;
}