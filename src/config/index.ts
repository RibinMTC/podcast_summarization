interface Config {
    api: {
      baseUrl: string;
      endpoints: {
        processAudio: string;
      };
    };
    fileValidation: {
      maxSizeBytes: number;
      supportedFormats: string[];
      supportedExtensions: string[];
    };
  }
  
  const config: Config = {
    api: {
      baseUrl: process.env.REACT_APP_API_URL || 'http://localhost:54239',
      endpoints: {
        processAudio: process.env.REACT_APP_API_ENDPOINT || '/api/process-audio',
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
  };
  
  export default config;