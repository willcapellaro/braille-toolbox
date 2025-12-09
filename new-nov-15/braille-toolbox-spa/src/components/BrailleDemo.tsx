import React from 'react';
import { Box, Card, CardContent, Typography, Grid } from '@mui/material';
import { DynamicBrailleCell } from '../utils/brailleCellGenerator';
import { useSettings } from '../contexts/SettingsContext';

/**
 * Demo component to showcase the braille cell generator with settings
 */
export const BrailleDemo: React.FC = () => {
  const { settings } = useSettings();

  const sampleCharacters = [
    { pattern: '100000', char: 'A', description: 'Letter A' },
    { pattern: '101000', char: 'B', description: 'Letter B' }, 
    { pattern: '110000', char: 'C', description: 'Letter C' },
    { pattern: '110100', char: 'D', description: 'Letter D' },
    { pattern: '100100', char: 'E', description: 'Letter E' },
    { pattern: '111000', char: 'F', description: 'Letter F' },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Braille Cell Generator Demo
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 3 }}>
        Current settings: {settings.colorMode} mode, Primary hue: {settings.primaryHue}°, 
        High contrast: {settings.highContrast ? 'on' : 'off'}
        {settings.outlineBox !== 'off' && `, Outline box: ${settings.outlineBox}`}
        {settings.ghostDots !== 'off' && `, Ghost dots: ${settings.ghostDots}`}
        {settings.dotShadow && `, Dot shadow enabled`}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Sample Letters (A-F)
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: 3, 
                alignItems: 'center',
                justifyContent: 'center',
                p: 2 
              }}>
                {sampleCharacters.map((item, index) => (
                  <Box key={index} sx={{ textAlign: 'center' }}>
                    <DynamicBrailleCell 
                      pattern={item.pattern}
                      character={item.char}
                      size="large"
                    />
                    <Typography variant="h6" sx={{ mt: 1 }}>
                      {item.char}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {item.description}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Size Variations
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
                <Box sx={{ textAlign: 'center' }}>
                  <DynamicBrailleCell pattern="100000" character="A" size="small" />
                  <Typography variant="caption" display="block">Small</Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <DynamicBrailleCell pattern="100000" character="A" size="medium" />
                  <Typography variant="caption" display="block">Medium</Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <DynamicBrailleCell pattern="100000" character="A" size="large" />
                  <Typography variant="caption" display="block">Large</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};