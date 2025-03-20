interface Config {
  api: {
    baseUrl: string;
    endpoints: {
      processAudio: string;
      getSummary: string;
    };
  };
  fileValidation: {
    maxSizeBytes: number;
    supportedFormats: string[];
    supportedExtensions: string[];
  };
  polling: {
    intervalMs: number;
  };
}

const config: Config = {
  api: {
    baseUrl: process.env.REACT_APP_API_URL || 'http://localhost:7071',
    endpoints: {
      processAudio: process.env.REACT_APP_API_ENDPOINT || '/api/podcast-summarizer/process-audio',
      getSummary: '/api/podcast-summarizer/summary'
    },
  },
  fileValidation: {
    maxSizeBytes: 50 * 1024 * 1024, // 50MB max file size
    supportedFormats: [
      'audio/mpeg',  // .mp3
      'audio/wav',   // .wav
      'audio/m4a',   // .m4a
      'audio/x-m4a', // .m4a (alternative MIME type)
      'audio/ogg',   // .ogg
    ],
    supportedExtensions: ['.mp3', '.wav', '.m4a', '.ogg'],
  },
  polling: {
    intervalMs: 5000 // Check every 5 seconds
  }
};

export default config;