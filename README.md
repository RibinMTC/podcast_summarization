# Podcast Summarizer

A simple web application that analyzes audio files (like podcasts) and generates summaries and action items. This project is designed for educational and testing purposes.

## Features

- Audio file upload support (MP3, WAV, M4A, OGG)
- Automatic summary generation
- Action items extraction
- Simple and clean user interface
- Configurable backend API

## Tech Stack

### Frontend
- React (Create React App)
- TypeScript
- Material-UI (MUI) for components
- Environment-based configuration

### Backend
- Python
- FastAPI
- CORS support
- File upload handling

## Project Structure

```
podcast-summarizer/
├── src/                    # Frontend source code
│   ├── config/            # Configuration files
│   │   └── index.ts      # Main config with types
│   ├── App.tsx           # Main React component
│   ├── types.ts          # TypeScript type definitions
│   └── index.tsx         # React entry point
├── server.py              # Python backend server
├── .env                   # Environment variables
├── .env.development       # Development-specific variables
└── public/               # Static assets
```

## Configuration

The application uses environment variables and a TypeScript configuration file for managing settings:

### Environment Variables (.env)
```env
REACT_APP_API_URL=http://localhost:54239
REACT_APP_API_ENDPOINT=/api/process-audio
```

### TypeScript Config (src/config/index.ts)
- API base URL and endpoints
- Supported audio formats
- Other application settings

## Setup and Running

1. Install dependencies:
   ```bash
   # Frontend dependencies
   npm install

   # Backend dependencies
   pip install fastapi uvicorn python-multipart
   ```

2. Start the backend server:
   ```bash
   python server.py
   ```
   The server will run on http://localhost:54239

3. Start the frontend development server:
   ```bash
   npm start
   ```
   The application will open in your browser at http://localhost:59022

## Usage

1. Open the application in your browser
2. Click the file input or drag and drop an audio file
3. Supported formats: MP3, WAV, M4A, OGG
4. Click "Analyze Audio" to process the file
5. View the generated summary and action items in the tabs below

## Development

### Adding New Features

1. Backend:
   - Add new endpoints in `server.py`
   - Update the API configuration in `.env` files
   - Add new processing logic for audio files

2. Frontend:
   - Update configuration in `src/config/index.ts`
   - Add new components in `src/`
   - Update types in `src/types.ts`

### Configuration Best Practices

1. Environment Variables:
   - Use `.env` for default values
   - Use `.env.development` for development-specific settings
   - Use `.env.production` for production settings (not included)
   - Always prefix React environment variables with `REACT_APP_`

2. TypeScript Configuration:
   - Keep all configuration types in `config/index.ts`
   - Use interfaces for type safety
   - Provide default values for all settings

## Notes

- This is a demonstration project for educational purposes
- The backend currently returns mock data
- In a production environment, you would need to:
  - Implement proper audio processing
  - Add error handling
  - Add security measures
  - Add file size limits
  - Add proper file cleanup
  - Add user authentication
  - Add proper logging
  - Add proper testing

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - feel free to use this code for learning and testing purposes.
