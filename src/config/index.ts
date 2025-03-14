interface Config {
    api: {
      baseUrl: string;
      endpoints: {
        processAudio: string;
      };
    };
    supportedAudioFormats: string[];
  }
  
  const config: Config = {
    api: {
      baseUrl: process.env.REACT_APP_API_URL || 'http://localhost:54239',
      endpoints: {
        processAudio: process.env.REACT_APP_API_ENDPOINT || '/api/process-audio',
      },
    },
    supportedAudioFormats: [
      'audio/mpeg',  // .mp3
      'audio/wav',   // .wav
      'audio/m4a',   // .m4a
      'audio/x-m4a', // .m4a (alternative MIME type)
      'audio/ogg',   // .ogg
    ],
  };
  
  export default config;