import React, { useState, useRef, useEffect } from 'react';
import {
  Container,
  Button,
  Box,
  Tab,
  Tabs,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Input,
} from '@mui/material';
import { SummaryResult } from './types';
import config from './config';

function TabPanel({ children, value, index }: { children: React.ReactNode; value: number; index: number }) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [result, setResult] = useState<SummaryResult>({
    summary: '',
    actionItems: [],
    status: 'idle'
  });
  const [statusQueryUri, setStatusQueryUri] = useState<string | null>(null);

  // Polling for summary completion
  useEffect(() => {
    // Only poll if we're in processing state and have a statusQueryUri
    if (result.status === 'processing' && statusQueryUri) {
      const intervalId = setInterval(async () => {
        try {
          await checkSummaryStatus(statusQueryUri);
        } catch (error) {
          console.error('Error checking status:', error);
        }
      }, config.polling.intervalMs);

      // Clean up interval on unmount or when status changes
      return () => clearInterval(intervalId);
    }
  }, [result.status, statusQueryUri]);

  const checkSummaryStatus = async (statusUrl: string) => {
    try {
      const response = await fetch(statusUrl);

      if (!response.ok) {
        throw new Error('Failed to check summary status');
      }

      const data = await response.json();

      // Check the runtimeStatus to determine if processing is complete
      if (data.runtimeStatus === 'Completed' && data.output) {
        // Parse the output which is a JSON string
        const outputData = JSON.parse(data.output);
        
        setResult({
          summary: outputData.summary || '',
          actionItems: Array.isArray(outputData.action_items) ? outputData.action_items : [],
          status: 'completed'
        });
      }
      // If still running, continue polling
    } catch (error) {
      console.error('Error checking status:', error);
    }
  };

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > config.fileValidation.maxSizeBytes) {
      return `File is too large. Maximum size is ${config.fileValidation.maxSizeBytes / (1024 * 1024)}MB`;
    }

    // Check file extension
    const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;
    if (!config.fileValidation.supportedExtensions.includes(fileExtension)) {
      return `Unsupported file type. Supported formats: ${config.fileValidation.supportedExtensions.join(', ')}`;
    }

    // Check MIME type
    if (!config.fileValidation.supportedFormats.includes(file.type)) {
      return `Invalid file format. Supported formats: ${config.fileValidation.supportedFormats.map(format => format.split('/')[1]).join(', ')}`;
    }

    return null;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const error = validateFile(selectedFile);

      if (error) {
        setResult({
          ...result,
          status: 'error',
          error,
        });
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }

      setFile(selectedFile);
      // Clear any previous errors
      if (result.status === 'error') {
        setResult({
          summary: '',
          actionItems: [],
          status: 'idle'
        });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) return;

    setResult({ ...result, status: 'loading' });

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${config.api.baseUrl}${config.api.endpoints.processAudio}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to process audio');

      const data = await response.json();

      // Check if this is an async process (returns statusQueryGetUri)
      if (data.statusQueryGetUri) {
        setStatusQueryUri(data.statusQueryGetUri);
        setResult({
          summary: '',
          actionItems: [],
          status: 'processing'
        });
      } else {
        // If it's a synchronous response with results
        setResult({
          summary: data.summary,
          actionItems: Array.isArray(data.actionItems) ? data.actionItems : [],
          status: 'completed'
        });
      }
    } catch (error) {
      setResult({
        ...result,
        status: 'error',
        error: error instanceof Error ? error.message : 'An error occurred'
      });
    }
  };

  // Calculate progress indicator
  const getProgressMessage = () => {
    if (result.status === 'loading') {
      return 'Uploading audio file...';
    } else if (result.status === 'processing') {
      return 'Processing your podcast. This may take a few minutes...';
    }
    return '';
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Podcast Summarizer
        </Typography>

        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <form onSubmit={handleSubmit}>
            <Input
              type="file"
              inputRef={fileInputRef}
              onChange={handleFileChange}
              fullWidth
              inputProps={{
                accept: config.fileValidation.supportedFormats.join(','),
              }}
              sx={{ mb: 2 }}
            />
            <Box sx={{
              backgroundColor: 'rgba(0, 0, 0, 0.03)',
              p: 1,
              borderRadius: 1,
              mb: 2
            }}>
              <Typography variant="caption" display="block" color="text.secondary">
                <strong>Supported formats:</strong> {config.fileValidation.supportedExtensions.join(', ')}
                <br />
                <strong>Maximum file size:</strong> {config.fileValidation.maxSizeBytes / (1024 * 1024)}MB
              </Typography>
            </Box>
            <Button
              fullWidth
              variant="contained"
              type="submit"
              disabled={!file || result.status === 'loading' || result.status === 'processing'}
              sx={{ mt: 2 }}
            >
              {(result.status === 'loading' || result.status === 'processing') ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Analyze Audio'
              )}
            </Button>
          </form>
        </Paper>

        {result.status === 'error' && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {result.error}
          </Alert>
        )}

        {(result.status === 'loading' || result.status === 'processing') && (
          <Alert severity="info" sx={{ mb: 2 }}>
            {getProgressMessage()}
          </Alert>
        )}

        {result.status === 'completed' && (
          <Paper elevation={3}>
            <Tabs
              value={tabValue}
              onChange={(_, newValue) => setTabValue(newValue)}
              centered
            >
              <Tab label="Summary" />
              <Tab label="Action Items" />
            </Tabs>

            <TabPanel value={tabValue} index={0}>
              {result.summary}
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <ul>
                {result.actionItems.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </TabPanel>
          </Paper>
        )}
      </Box>
    </Container>
  );
}

export default App;