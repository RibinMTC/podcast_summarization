export interface SummaryResult {
    summary: string;
    actionItems: string[];
    status: 'idle' | 'loading' | 'processing' | 'completed' | 'error';
    error?: string;
  }
  
  export interface UploadResponse {
    podcastId: string;
    message?: string;
  }
  
  export interface SummaryResponse {
    podcastId: string;
    isReady: boolean;
    summary?: string;
    actionItems?: string[];
    status?: string;
    error?: string;
  }