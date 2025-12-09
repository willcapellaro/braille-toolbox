import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Checkbox,
  FormControlLabel,
  Grid,
  useTheme,
} from '@mui/material';
import dotDecoderData from '../../data/dot-decoder-content.json';

interface BrailleCellToggleProps {
  dots: string;
  onDotsChange: (dots: string) => void;
}

interface DotPosition {
  top: string;
  left: string;
}

const BrailleCellToggle: React.FC<BrailleCellToggleProps> = ({ dots, onDotsChange }) => {
  const [decodedMeaning, setDecodedMeaning] = useState('');
  const theme = useTheme();

  // Braille dot positions (standard 2x3 arrangement)
  const dotPositions: DotPosition[] = [
    { top: '20%', left: '25%' },   // Dot 1
    { top: '50%', left: '25%' },   // Dot 2
    { top: '80%', left: '25%' },   // Dot 3
    { top: '20%', left: '75%' },   // Dot 4
    { top: '50%', left: '75%' },   // Dot 5
    { top: '80%', left: '75%' },   // Dot 6
  ];

  useEffect(() => {
    // Look up the meaning of the current dot pattern
    const data = (dotDecoderData as any)[dots];
    const meaning = data ? `${data.title}: ${data.description}` : 'Unknown pattern';
    setDecodedMeaning(meaning);
  }, [dots]);

  const toggleDot = (dotIndex: number) => {
    const dotsArray = dots.split('');
    dotsArray[dotIndex] = dotsArray[dotIndex] === '1' ? '0' : '1';
    const newDots = dotsArray.join('');
    onDotsChange(newDots);
  };

  const clearAllDots = () => {
    onDotsChange('000000');
  };

  const setAllDots = () => {
    onDotsChange('111111');
  };

  return (
    <Paper
      elevation={1}
      sx={{
        p: 3,
        backgroundColor: 'background.default',
        borderRadius: 2,
      }}
    >
      <Typography variant="h6" gutterBottom>
        Braille Dot Decoder
      </Typography>
      
      <Grid container spacing={3} alignItems="center">
        {/* Braille Cell Visual */}
        <Grid item xs={12} sm={6}>
          <Box
            sx={{
              position: 'relative',
              width: 120,
              height: 180,
              mx: 'auto',
              backgroundColor: theme.palette.background.paper,
              border: `2px solid ${theme.palette.primary.main}`,
              borderRadius: 2,
              cursor: 'pointer',
            }}
          >
            {dotPositions.map((position, index) => {
              const isActive = dots[index] === '1';
              return (
                <Box
                  key={index}
                  onClick={() => toggleDot(index)}
                  sx={{
                    position: 'absolute',
                    top: position.top,
                    left: position.left,
                    transform: 'translate(-50%, -50%)',
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    backgroundColor: isActive 
                      ? theme.palette.primary.main 
                      : theme.palette.grey[300],
                    border: `2px solid ${theme.palette.primary.main}`,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: 'translate(-50%, -50%) scale(1.2)',
                      boxShadow: `0 0 8px ${theme.palette.primary.main}50`,
                    },
                  }}
                  aria-label={`Dot ${index + 1} ${isActive ? 'active' : 'inactive'}`}
                />
              );
            })}
          </Box>
          
          {/* Dot Labels */}
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="caption" display="block">
              Pattern: {dots}
            </Typography>
            <Box sx={{ mt: 1, display: 'flex', gap: 1, justifyContent: 'center' }}>
              <Typography variant="caption" onClick={clearAllDots} sx={{ cursor: 'pointer', color: 'primary.main' }}>
                Clear All
              </Typography>
              <Typography variant="caption">|</Typography>
              <Typography variant="caption" onClick={setAllDots} sx={{ cursor: 'pointer', color: 'primary.main' }}>
                Set All
              </Typography>
            </Box>
          </Box>
        </Grid>

        {/* Decoded Meaning */}
        <Grid item xs={12} sm={6}>
          <Box>
            <Typography variant="subtitle1" gutterBottom color="primary">
              Decoded Meaning:
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              {decodedMeaning}
            </Typography>
            
            {/* Checkbox Controls for Accessibility */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              {[1, 2, 3, 4, 5, 6].map((dotNum) => (
                <FormControlLabel
                  key={dotNum}
                  control={
                    <Checkbox
                      size="small"
                      checked={dots[dotNum - 1] === '1'}
                      onChange={() => toggleDot(dotNum - 1)}
                      sx={{ py: 0.5 }}
                    />
                  }
                  label={`Dot ${dotNum}`}
                  sx={{ 
                    '& .MuiFormControlLabel-label': { 
                      fontSize: '0.875rem' 
                    } 
                  }}
                />
              ))}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default BrailleCellToggle;