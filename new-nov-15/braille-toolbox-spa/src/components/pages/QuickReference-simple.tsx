import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  Button,
  Chip,
  Paper,
  Tab,
  Tabs,
  FormControlLabel,
  Switch
} from '@mui/material';
import { School, Search, Create, TouchApp } from '@mui/icons-material';
// Import your real content
import dotDecoderContent from '../../data/dot-decoder-content.json';

const QuickReference: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [slateMode, setSlateMode] = useState(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // Convert your dot decoder content to display format
  const convertToDisplayData = () => {
    const letters = [];
    const numbers = [];
    const patterns = Object.keys(dotDecoderContent);
    
    for (const pattern of patterns) {
      const data = dotDecoderContent[pattern as keyof typeof dotDecoderContent];
      if (typeof data === 'object' && data.title) {
        // Extract letter/number from title
        const titleLower = data.title.toLowerCase();
        
        if (titleLower.includes('letter ')) {
          const letter = titleLower.replace('letter ', '').replace('the ', '').trim();
          if (letter.length === 1) {
            letters.push({
              pattern,
              character: letter,
              title: data.title,
              description: data.description,
              svgPath: `letter-${letter}.svg`
            });
          }
        } else if (titleLower.includes('number ')) {
          const number = titleLower.replace('number ', '').replace('the ', '').trim();
          if (!isNaN(Number(number))) {
            numbers.push({
              pattern,
              character: number,
              title: data.title,
              description: data.description,
              svgPath: `letter-${number}.svg`
            });
          }
        }
      }
    }
    
    return { letters: letters.slice(0, 20), numbers: numbers.slice(0, 10) };
  };

  const { letters, numbers } = convertToDisplayData();

  // Get current category data
  const getCurrentData = () => {
    switch(activeTab) {
      case 0: return letters;
      case 1: return numbers;
      case 2: return []; // punctuation - add later
      case 3: return []; // contractions - add later
      default: return letters;
    }
  };

  const BrailleCharacterCard: React.FC<{ character: any }> = ({ character }) => (
    <Card 
      elevation={1}
      sx={{
        textAlign: 'center',
        p: 2,
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 3,
        },
        transform: slateMode ? 'scaleX(-1)' : 'none',
        minHeight: 200
      }}
    >
      <Box sx={{ mb: 2, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img 
          src={`/imgs/${character.svgPath}`} 
          alt={character.title}
          style={{ 
            maxHeight: '70px', 
            maxWidth: '70px',
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
          }}
          onError={(e) => {
            // Fallback to Unicode braille if SVG fails
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const fallback = document.createElement('div');
            fallback.style.fontSize = '3rem';
            fallback.style.lineHeight = '1';
            fallback.textContent = '⠿'; // placeholder braille
            target.parentNode?.appendChild(fallback);
          }}
        />
      </Box>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
        {character.character.toUpperCase()}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        {character.title}
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.75rem' }}>
        {character.description?.substring(0, 60)}{character.description?.length > 60 ? '...' : ''}
      </Typography>
      <Chip label={`Pattern: ${character.pattern}`} size="small" variant="outlined" sx={{ mt: 1, fontSize: '0.7rem' }} />
    </Card>
  );
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 6 }}>
        {/* Hero Section */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h1" component="h1" sx={{ mb: 2 }}>
            Braille Toolbox
          </Typography>
          <Typography variant="h2" component="h2" sx={{ mb: 3, color: 'primary.main' }}>
            Quick Reference Guide
          </Typography>
          <Typography variant="body1" sx={{ maxWidth: 600, mx: 'auto', mb: 4 }}>
            Your comprehensive braille learning companion. Explore letters, numbers, punctuation, and contractions with interactive visual references.
          </Typography>
          
          {/* Navigation Buttons */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap', mb: 4 }}>
            <Button
              component={Link}
              to="/intro"
              variant="contained"
              size="large"
              startIcon={<School />}
              sx={{ minWidth: 180 }}
            >
              Learn Braille
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={<Search />}
              sx={{ minWidth: 180 }}
            >
              Search & Decode
            </Button>
          </Box>
        </Box>

        {/* Braille Reference Controls */}
        <Paper elevation={1} sx={{ p: 3, mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Tabs value={activeTab} onChange={handleTabChange} aria-label="braille character categories">
              <Tab label="Letters" />
              <Tab label="Numbers" />
              <Tab label="Punctuation" />
              <Tab label="Contractions" />
            </Tabs>
            
            <FormControlLabel
              control={
                <Switch
                  checked={slateMode}
                  onChange={(e) => setSlateMode(e.target.checked)}
                  color="primary"
                />
              }
              label="Slate Mode (Flip Horizontally)"
            />
          </Box>
          
          {slateMode && (
            <Box sx={{ mt: 2, p: 2, backgroundColor: 'info.light', borderRadius: 1 }}>
              <Typography variant="body2">
                📝 <strong>Slate Mode:</strong> Characters are flipped horizontally to simulate writing from right-to-left 
                as you would when using a slate and stylus, where dots are punched from the back.
              </Typography>
            </Box>
          )}
        </Paper>

        {/* Braille Character Grid */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          {getCurrentData().length > 0 ? (
            getCurrentData().map((character, index) => (
              <Grid item xs={6} sm={4} md={3} lg={2} key={`${character.pattern}-${index}`}>
                <BrailleCharacterCard character={character} />
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Paper sx={{ p: 4, textAlign: 'center', backgroundColor: 'grey.50' }}>
                <Typography variant="h6" color="text.secondary">
                  {activeTab === 2 ? 'Punctuation characters coming soon!' : 
                   activeTab === 3 ? 'Contraction characters coming soon!' : 
                   'Loading braille characters...'}
                </Typography>
              </Paper>
            </Grid>
          )}
        </Grid>

        {/* Learning Tips */}
        <Paper sx={{ p: 4, backgroundColor: 'grey.50' }}>
          <Typography variant="h6" gutterBottom>
            💡 Learning Tips
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle2" color="primary" gutterBottom>
                Pattern Recognition
              </Typography>
              <Typography variant="body2">
                Notice how letters a-j use only the top 4 dots. This pattern repeats for k-t (adding dot 3) and the remaining letters.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle2" color="primary" gutterBottom>
                Numbers
              </Typography>
              <Typography variant="body2">
                Numbers use the same patterns as letters a-j, preceded by a number sign. So '1' is the number sign followed by the pattern for 'a'.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle2" color="primary" gutterBottom>
                Contractions
              </Typography>
              <Typography variant="body2">
                Braille uses contractions to save space. Many characters serve double duty as both letters and common word contractions.
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
};

export default QuickReference;