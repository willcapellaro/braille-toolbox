import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  FormControlLabel,
  Switch,
  Alert,
  Divider,
  Chip,
  Grid,
} from '@mui/material';
import { Copy, Clear, FlipToFront, Share } from '@mui/icons-material';
import useBrailleConverter from '../../hooks/useBrailleConverter';

const WriteInBraille: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [flipText, setFlipText] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const { convertToBraille } = useBrailleConverter();

  // URL parameter integration for sharing
  useEffect(() => {
    const text = searchParams.get('text') || '';
    const flip = searchParams.get('fliptext') === 'true';
    if (text) {
      setInputText(decodeURIComponent(text));
    }
    setFlipText(flip);
  }, [searchParams]);

  const updateUrl = (text: string, flip: boolean) => {
    const params = new URLSearchParams();
    if (text.trim()) {
      if (flip) {
        params.set('fliptext', text);
      } else {
        params.set('text', text);
      }
    }
    setSearchParams(params);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const text = event.target.value;
    setInputText(text);
    updateUrl(text, flipText);
  };

  const handleFlipToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const flip = event.target.checked;
    setFlipText(flip);
    updateUrl(inputText, flip);
  };

  const handleCopy = async () => {
    const brailleOutput = convertToBraille(inputText);
    try {
      await navigator.clipboard.writeText(brailleOutput);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 3000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleShare = () => {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 3000);
    });
  };

  const handleClear = () => {
    setInputText('');
    setFlipText(false);
    setSearchParams(new URLSearchParams());
  };

  const brailleOutput = inputText ? convertToBraille(inputText) : '';
  const characterCount = inputText.length;
  const wordCount = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;

  const sampleTexts = [
    'Hello World',
    'The quick brown fox',
    'Braille is amazing',
    'Learning is fun',
  ];

  const setSampleText = (text: string) => {
    setInputText(text);
    updateUrl(text, flipText);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontFamily: 'Francois One' }}>
          Write in Braille
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Type any text and see it converted to braille instantly
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} lg={8}>
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Input Text
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                value={inputText}
                onChange={handleInputChange}
                placeholder="Type your text here..."
                variant="outlined"
                sx={{
                  '& .MuiInputBase-input': {
                    fontSize: '1.1rem',
                    lineHeight: 1.6,
                  }
                }}
              />
              
              {/* Text Stats */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1, mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Characters: {characterCount} | Words: {wordCount}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button size="small" onClick={handleCopy} startIcon={<Copy />}>
                    Copy Braille
                  </Button>
                  <Button size="small" onClick={handleShare} startIcon={<Share />}>
                    Share URL
                  </Button>
                  <Button size="small" onClick={handleClear} startIcon={<Clear />}>
                    Clear
                  </Button>
                </Box>
              </Box>

              {/* Controls */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={flipText}
                      onChange={handleFlipToggle}
                      color="primary"
                    />
                  }
                  label="Flip for Slate & Stylus"
                />
                <Chip icon={<FlipToFront />} label="Slate Mode" variant={flipText ? 'filled' : 'outlined'} />
              </Box>

              {flipText && (
                <Alert severity="info" sx={{ mb: 2 }}>
                  <strong>Slate Mode:</strong> Text is flipped horizontally for writing with a slate and stylus. 
                  When you turn the paper over, the braille will read correctly.
                </Alert>
              )}
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Braille Output */}
            <Box>
              <Typography variant="h6" gutterBottom>
                Braille Output
              </Typography>
              <Paper
                variant="outlined"
                sx={{
                  p: 3,
                  minHeight: 100,
                  backgroundColor: 'background.default',
                  transform: flipText ? 'scaleX(-1)' : 'none',
                }}
              >
                {brailleOutput ? (
                  <Typography
                    variant="body1"
                    sx={{
                      fontFamily: 'braille, monospace',
                      fontSize: '1.5rem',
                      lineHeight: 1.8,
                      wordSpacing: '0.2em',
                      letterSpacing: '0.1em',
                      whiteSpace: 'pre-wrap',
                    }}
                    dangerouslySetInnerHTML={{ __html: brailleOutput }}
                  />
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                    Your braille output will appear here...
                  </Typography>
                )}
              </Paper>
            </Box>
          </Paper>

          {copySuccess && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Content copied to clipboard successfully!
            </Alert>
          )}
        </Grid>

        <Grid item xs={12} lg={4}>
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Sample Texts
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Try these sample texts to see how braille conversion works:
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {sampleTexts.map((text) => (
                <Button
                  key={text}
                  variant="outlined"
                  size="small"
                  onClick={() => setSampleText(text)}
                  sx={{ justifyContent: 'flex-start' }}
                >
                  {text}
                </Button>
              ))}
            </Box>
          </Paper>

          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              About This Tool
            </Typography>
            <Typography variant="body2" paragraph>
              This converter transforms regular text into Unified English Braille (UEB), 
              the standard braille code used in English-speaking countries.
            </Typography>
            <Typography variant="body2" paragraph>
              Features include:
            </Typography>
            <ul style={{ fontSize: '0.875rem', paddingLeft: '1.2rem' }}>
              <li>Letter-by-letter conversion</li>
              <li>Number handling with number signs</li>
              <li>Basic punctuation support</li>
              <li>URL sharing for collaboration</li>
              <li>Slate and stylus mode</li>
            </ul>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default WriteInBraille;