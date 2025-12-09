import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Button,
  Card,
  CardContent,
  Alert,
} from '@mui/material';
import { Refresh, Help } from '@mui/icons-material';
import BrailleCellToggle from '../search/BrailleCellToggle';

const DotDecoder: React.FC = () => {
  const [dotPattern, setDotPattern] = useState('100000');
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const urlPattern = searchParams.get('pattern');
    if (urlPattern && /^[01]{6}$/.test(urlPattern)) {
      setDotPattern(urlPattern);
    }
  }, [searchParams]);

  const updateUrl = (pattern: string) => {
    const params = new URLSearchParams();
    if (pattern !== '000000') {
      params.set('pattern', pattern);
    }
    setSearchParams(params);
  };

  const handlePatternChange = (newPattern: string) => {
    setDotPattern(newPattern);
    updateUrl(newPattern);
  };

  const resetPattern = () => {
    setDotPattern('000000');
    setSearchParams(new URLSearchParams());
  };

  const setRandomPattern = () => {
    // Generate a random valid braille pattern (at least one dot)
    let pattern = '';
    for (let i = 0; i < 6; i++) {
      pattern += Math.random() > 0.5 ? '1' : '0';
    }
    // Ensure at least one dot is active
    if (pattern === '000000') {
      pattern = '100000';
    }
    handlePatternChange(pattern);
  };

  const commonPatterns = [
    { pattern: '100000', description: 'Letter A' },
    { pattern: '110000', description: 'Letter B' },
    { pattern: '100100', description: 'Letter C' },
    { pattern: '111111', description: 'Word: for' },
    { pattern: '010000', description: 'Comma' },
    { pattern: '010011', description: 'Period' },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontFamily: 'Francois One' }}>
          Dot Decoder
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Click the dots to build braille characters and discover their meanings
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} lg={8}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5">
                Interactive Braille Cell
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  size="small"
                  onClick={resetPattern}
                  startIcon={<Refresh />}
                >
                  Clear All
                </Button>
                <Button
                  size="small"
                  onClick={setRandomPattern}
                  variant="outlined"
                >
                  Random
                </Button>
              </Box>
            </Box>

            <BrailleCellToggle
              dots={dotPattern}
              onDotsChange={handlePatternChange}
            />
          </Paper>

          <Paper elevation={1} sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              <Help sx={{ mr: 1, verticalAlign: 'middle' }} />
              How to Use
            </Typography>
            <Typography variant="body2" paragraph>
              Click on the dots in the braille cell above to activate or deactivate them. 
              Each combination of dots creates a different braille character.
            </Typography>
            <Alert severity="info">
              <strong>Tip:</strong> Try clicking different combinations of dots to explore the braille alphabet. 
              The meaning will update automatically as you change the pattern.
            </Alert>
          </Paper>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Common Patterns
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Try these common braille patterns:
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {commonPatterns.map((item) => (
                <Button
                  key={item.pattern}
                  variant="outlined"
                  size="small"
                  onClick={() => handlePatternChange(item.pattern)}
                  sx={{ 
                    justifyContent: 'flex-start',
                    textAlign: 'left',
                    backgroundColor: dotPattern === item.pattern ? 'primary.light' : 'transparent',
                  }}
                >
                  <Box>
                    <Typography variant="body2" component="div">
                      {item.description}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Pattern: {item.pattern}
                    </Typography>
                  </Box>
                </Button>
              ))}
            </Box>
          </Paper>

          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                About Braille Patterns
              </Typography>
              <Typography variant="body2" paragraph>
                Braille uses a 6-dot cell arranged in 2 columns and 3 rows. 
                The dots are numbered 1-2-3 down the left column and 4-5-6 down the right column.
              </Typography>
              <Typography variant="body2" paragraph>
                There are 64 possible combinations (including the blank space), 
                creating a rich system for representing letters, numbers, punctuation, and contractions.
              </Typography>
              <Typography variant="body2">
                This decoder follows the Unified English Braille (UEB) standard, 
                which is used in most English-speaking countries.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DotDecoder;