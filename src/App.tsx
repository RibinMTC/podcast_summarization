import React, { useState, useRef } from 'react';
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

function TabPanel({ children, value, index }: { children: React.ReactNode; value: number; index: number }) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) return;

    setResult({ ...result, status: 'loading' });

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://localhost:54239/api/process-audio', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to process audio');

      const data = await response.json();
      setResult({
        summary: data.summary,
        actionItems: data.actionItems,
        status: 'completed'
      });
    } catch (error) {
      setResult({
        ...result,
        status: 'error',
        error: error instanceof Error ? error.message : 'An error occurred'
      });
    }
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
                accept: 'audio/*',
              }}
              sx={{ mb: 2 }}
            />
            <Typography variant="caption" display="block" gutterBottom>
              Supported formats: MP3, WAV, M4A, etc.
            </Typography>
            <Button
              fullWidth
              variant="contained"
              type="submit"
              disabled={!file || result.status === 'loading'}
              sx={{ mt: 2 }}
            >
              {result.status === 'loading' ? (
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

        {(result.status === 'completed' || result.status === 'loading') && (
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
              {result.status === 'loading' ? (
                <Box display="flex" justifyContent="center" p={3}>
                  <CircularProgress />
                </Box>
              ) : (
                result.summary
              )}
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              {result.status === 'loading' ? (
                <Box display="flex" justifyContent="center" p={3}>
                  <CircularProgress />
                </Box>
              ) : (
                <ul>
                  {result.actionItems.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              )}
            </TabPanel>
          </Paper>
        )}
      </Box>
    </Container>
  );
}

export default App;
