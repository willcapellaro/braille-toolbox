import React, { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  FormControlLabel,
  Switch,
  Paper,
  Tabs,
  Tab,
  useTheme,
} from '@mui/material';
import { School, TouchApp, Edit } from '@mui/icons-material';

interface BrailleCharacter {
  id: string;
  character: string;
  dots: string;
  description: string;
  category: 'letters' | 'numbers' | 'punctuation' | 'contractions';
  svgPath?: string;
}

// Sample braille data - this would normally come from a data file
const brailleCharacters: BrailleCharacter[] = [
  // Letters A-J (first line)
  { id: 'a', character: 'a', dots: '⠁', description: 'Letter A', category: 'letters', svgPath: 'dot1_a.svg' },
  { id: 'b', character: 'b', dots: '⠃', description: 'Letter B', category: 'letters', svgPath: 'dot12_b.svg' },
  { id: 'c', character: 'c', dots: '⠉', description: 'Letter C', category: 'letters', svgPath: 'dot14_c.svg' },
  { id: 'd', character: 'd', dots: '⠙', description: 'Letter D', category: 'letters', svgPath: 'dot145_d.svg' },
  { id: 'e', character: 'e', dots: '⠑', description: 'Letter E', category: 'letters', svgPath: 'dot15_e.svg' },
  { id: 'f', character: 'f', dots: '⠋', description: 'Letter F', category: 'letters', svgPath: 'dot124_f.svg' },
  { id: 'g', character: 'g', dots: '⠛', description: 'Letter G', category: 'letters', svgPath: 'dot1245_g.svg' },
  { id: 'h', character: 'h', dots: '⠓', description: 'Letter H', category: 'letters', svgPath: 'dot125_h.svg' },
  { id: 'i', character: 'i', dots: '⠊', description: 'Letter I', category: 'letters', svgPath: 'dot24_i.svg' },
  { id: 'j', character: 'j', dots: '⠚', description: 'Letter J', category: 'letters', svgPath: 'dot245_j.svg' },
  
  // Letters K-T (second line)
  { id: 'k', character: 'k', dots: '⠅', description: 'Letter K', category: 'letters', svgPath: 'dot13_k.svg' },
  { id: 'l', character: 'l', dots: '⠇', description: 'Letter L', category: 'letters', svgPath: 'dot123_l.svg' },
  { id: 'm', character: 'm', dots: '⠍', description: 'Letter M', category: 'letters', svgPath: 'dot134_m.svg' },
  { id: 'n', character: 'n', dots: '⠝', description: 'Letter N', category: 'letters', svgPath: 'dot1345_n.svg' },
  { id: 'o', character: 'o', dots: '⠕', description: 'Letter O', category: 'letters', svgPath: 'dot135_o.svg' },
  { id: 'p', character: 'p', dots: '⠏', description: 'Letter P', category: 'letters', svgPath: 'dot1234_p.svg' },
  { id: 'q', character: 'q', dots: '⠟', description: 'Letter Q', category: 'letters', svgPath: 'dot12345_q.svg' },
  { id: 'r', character: 'r', dots: '⠗', description: 'Letter R', category: 'letters', svgPath: 'dot1235_r.svg' },
  { id: 's', character: 's', dots: '⠎', description: 'Letter S', category: 'letters', svgPath: 'dot234_s.svg' },
  { id: 't', character: 't', dots: '⠞', description: 'Letter T', category: 'letters', svgPath: 'dot2345_t.svg' },

  // Numbers
  { id: '1', character: '1', dots: '⠼⠁', description: 'Number 1', category: 'numbers', svgPath: 'num1.svg' },
  { id: '2', character: '2', dots: '⠼⠃', description: 'Number 2', category: 'numbers', svgPath: 'num2.svg' },
  { id: '3', character: '3', dots: '⠼⠉', description: 'Number 3', category: 'numbers', svgPath: 'num3.svg' },
  { id: '4', character: '4', dots: '⠼⠙', description: 'Number 4', category: 'numbers', svgPath: 'num4.svg' },
  { id: '5', character: '5', dots: '⠼⠑', description: 'Number 5', category: 'numbers', svgPath: 'num5.svg' },

  // Punctuation
  { id: 'period', character: '.', dots: '⠲', description: 'Period', category: 'punctuation', svgPath: 'comp_period.svg' },
  { id: 'comma', character: ',', dots: '⠂', description: 'Comma', category: 'punctuation', svgPath: 'comp_comma.svg' },
  { id: 'question', character: '?', dots: '⠦', description: 'Question mark', category: 'punctuation', svgPath: 'comp_question.svg' },
  { id: 'exclamation', character: '!', dots: '⠖', description: 'Exclamation mark', category: 'punctuation', svgPath: 'comp_exclamation.svg' },

  // Common contractions
  { id: 'and', character: 'and', dots: '⠯', description: 'Word: and', category: 'contractions', svgPath: 'con_and.svg' },
  { id: 'for', character: 'for', dots: '⠿', description: 'Word: for', category: 'contractions', svgPath: 'con_for.svg' },
  { id: 'the', character: 'the', dots: '⠮', description: 'Word: the', category: 'contractions', svgPath: 'con_the.svg' },
  { id: 'with', character: 'with', dots: '⠾', description: 'Word: with', category: 'contractions', svgPath: 'con_with.svg' },
];

const QuickReference: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(0);
  const [slateMode, setSlateMode] = useState(false);
  const theme = useTheme();

  const section = searchParams.get('section');

  const filteredCharacters = useMemo(() => {
    const categories = ['letters', 'numbers', 'punctuation', 'contractions'];
    if (section && categories.includes(section)) {
      return brailleCharacters.filter(char => char.category === section);
    }
    
    // Filter by active tab
    if (activeTab === 1) return brailleCharacters.filter(char => char.category === 'numbers');
    if (activeTab === 2) return brailleCharacters.filter(char => char.category === 'punctuation');
    if (activeTab === 3) return brailleCharacters.filter(char => char.category === 'contractions');
    
    // Default to letters
    return brailleCharacters.filter(char => char.category === 'letters');
  }, [section, activeTab]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const CharacterCard: React.FC<{ character: BrailleCharacter }> = ({ character }) => (
    <Card 
      elevation={1}
      sx={{
        textAlign: 'center',
        p: 2,
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[4],
        },
        transform: slateMode ? 'scaleX(-1)' : 'none',
      }}
    >
      <Box sx={{ mb: 2, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {character.svgPath ? (
          <img 
            src={`/braille/${character.svgPath}`} 
            alt={`Braille ${character.description}`}
            style={{ maxWidth: '50px', maxHeight: '50px' }}
          />
        ) : (
          <Typography variant="h3" color="primary" sx={{ fontFamily: 'braille' }}>
            {character.dots}
          </Typography>
        )}
      </Box>
      <Typography variant="h6" component="div" gutterBottom>
        {character.character}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {character.description}
      </Typography>
    </Card>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Welcome Section */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h2" component="h1" gutterBottom sx={{ fontFamily: 'Francois One' }}>
          Braille Toolbox
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{ mb: 3 }}>
          Your comprehensive braille reference and learning companion
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Explore braille characters, learn contractions, and practice writing. 
          Everything you need to understand and use braille effectively.
        </Typography>
        
        {/* Quick Action Buttons */}
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
            component={Link}
            to="/write-in-braille"
            variant="outlined"
            size="large"
            startIcon={<Edit />}
            sx={{ minWidth: 180 }}
          >
            Write in Braille
          </Button>
        </Box>
      </Box>

      {/* Controls */}
      <Paper elevation={1} sx={{ p: 2, mb: 4 }}>
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
              <strong>Slate Mode:</strong> Characters are flipped horizontally for use with a slate and stylus, 
              where you write from right to left to create the correct pattern when the paper is turned over.
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Character Grid */}
      <Grid container spacing={3}>
        {filteredCharacters.map((character) => (
          <Grid item xs={6} sm={4} md={3} lg={2} key={character.id}>
            <CharacterCard character={character} />
          </Grid>
        ))}
      </Grid>

      {/* Helpful Tips */}
      <Paper elevation={2} sx={{ mt: 6, p: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ fontFamily: 'Francois One' }}>
          Getting Started Tips
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom color="primary">
              Pattern Recognition
            </Typography>
            <Typography variant="body2">
              Notice how the first 10 letters (a-j) use only the top 4 dots. 
              This pattern is repeated for k-t (adding dot 3) and the remaining letters.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom color="primary">
              Numbers
            </Typography>
            <Typography variant="body2">
              Numbers use the same patterns as letters a-j, preceded by a number sign. 
              So '1' is the number sign followed by the pattern for 'a'.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom color="primary">
              Contractions
            </Typography>
            <Typography variant="body2">
              Braille uses contractions to save space. Common words like "and", "the", 
              and "for" have their own special symbols.
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default QuickReference;