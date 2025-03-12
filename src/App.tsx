import React, { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Box,
  Tab,
  Tabs,
  Typography,
  Paper,
  CircularProgress,
  Alert,
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
  const [url, setUrl] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [result, setResult] = useState<SummaryResult>({
    summary: '',
    actionItems: [],
    status: 'idle'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url) return;

    setResult({ ...result, status: 'loading' });

    try {
      // TODO: Replace with actual API call
      const response = await fetch('YOUR_AZURE_FUNCTION_URL', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) throw new Error('Failed to process video');

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
            <TextField
              fullWidth
              label="YouTube URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              margin="normal"
              variant="outlined"
              placeholder="Paste YouTube URL here"
            />
            <Button
              fullWidth
              variant="contained"
              type="submit"
              disabled={!url || result.status === 'loading'}
              sx={{ mt: 2 }}
            >
              {result.status === 'loading' ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Summarize'
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
