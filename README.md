# Podcast Summarizer

A React application that generates summaries and action items from audio files (podcasts, lectures, etc.).

## Quick Start

1. Install dependencies:
```bash
npm install
pip install fastapi uvicorn python-multipart python-magic
```

2. Start the servers:
```bash
# Backend (http://localhost:54239)
python server.py

# Frontend (http://localhost:59022)
npm start
```

## Features

- Upload audio files (MP3, WAV, M4A, OGG)
- File validation (size, type, format)
- Automatic summary generation
- Action items extraction

## Configuration

### Environment Variables (.env)
```env
REACT_APP_API_URL=http://localhost:54239
REACT_APP_API_ENDPOINT=/api/process-audio
```

### File Validation Settings (src/config/index.ts)
```typescript
fileValidation: {
  maxSizeBytes: 50 * 1024 * 1024, // 50MB
  supportedFormats: ['audio/mpeg', 'audio/wav', ...],
  supportedExtensions: ['.mp3', '.wav', '.m4a', '.ogg']
}
```

## Project Structure

```
src/
├── config/     # Configuration and constants
├── App.tsx     # Main component
└── types.ts    # TypeScript definitions

server.py       # FastAPI backend server
```

## Security Features

- File size limits (50MB max)
- File type validation
- MIME type checking
- CORS configuration

## Notes

- Educational/testing purposes only
- Backend returns mock data
- Frontend includes basic file validation
- No authentication implemented
