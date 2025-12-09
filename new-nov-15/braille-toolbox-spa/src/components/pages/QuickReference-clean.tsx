import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Paper,
  Grid,
  Chip,
  Divider
} from '@mui/material';
import { ViewModule, Info } from '@mui/icons-material';
import { DynamicBrailleCell } from '../../utils/brailleCellGenerator';

// Alphabet organized in decades
const DECADE_A_J = [
  { char: 'A', pattern: '100000' },
  { char: 'B', pattern: '110000' },
  { char: 'C', pattern: '100100' },
  { char: 'D', pattern: '100110' },
  { char: 'E', pattern: '100010' },
  { char: 'F', pattern: '110100' },
  { char: 'G', pattern: '110110' },
  { char: 'H', pattern: '110010' },
  { char: 'I', pattern: '010100' },
  { char: 'J', pattern: '010110' }
];

const DECADE_K_T = [
  { char: 'K', pattern: '101000' },
  { char: 'L', pattern: '111000' },
  { char: 'M', pattern: '101100' },
  { char: 'N', pattern: '101110' },
  { char: 'O', pattern: '101010' },
  { char: 'P', pattern: '111100' },
  { char: 'Q', pattern: '111110' },
  { char: 'R', pattern: '111010' },
  { char: 'S', pattern: '011100' },
  { char: 'T', pattern: '011110' }
];

const DECADE_U_Z = [
  { char: 'U', pattern: '101001' },
  { char: 'V', pattern: '111001' },
  { char: 'X', pattern: '101101' },
  { char: 'Y', pattern: '101111' },
  { char: 'Z', pattern: '101011' }
];

const LETTER_W = [
  { char: 'W', pattern: '010111' }
];

type ViewMode = 'quick' | 'explainer';

const QuickReference: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('quick');

  const handleModeChange = (_: React.MouseEvent<HTMLElement>, newMode: ViewMode | null) => {
    if (newMode !== null) {
      setViewMode(newMode);
    }
  };

  const DecadeStrip: React.FC<{ title: string; letters: typeof DECADE_A_J; description?: string }> = ({ 
    title, 
    letters, 
    description 
  }) => (
    <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom color="primary.main">
        {title}
      </Typography>
      {viewMode === 'explainer' && description && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {description}
        </Typography>
      )}
      <Box sx={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: 2, 
        justifyContent: 'flex-start',
        alignItems: 'center'
      }}>
        {letters.map((letter) => (
          <Box 
            key={letter.char} 
            sx={{ 
              textAlign: 'center',
              minWidth: '60px'
            }}
          >
            <DynamicBrailleCell 
              pattern={letter.pattern} 
              character={letter.char} 
              size="medium" 
            />
            <Typography variant="h6" sx={{ mt: 1, fontWeight: 'bold' }}>
              {letter.char}
            </Typography>
            {viewMode === 'explainer' && (
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                {letter.pattern}
              </Typography>
            )}
          </Box>
        ))}
      </Box>
    </Paper>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Mode Toggle */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={handleModeChange}
          size="large"
          sx={{ 
            '& .MuiToggleButton-root': {
              px: 4,
              py: 1.5
            }
          }}
        >
          <ToggleButton value="quick">
            <ViewModule sx={{ mr: 1 }} />
            Quick Reference
          </ToggleButton>
          <ToggleButton value="explainer">
            <Info sx={{ mr: 1 }} />
            Braille Explainer
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Alphabet Decades */}
      <DecadeStrip 
        title="A-J (Base Patterns)" 
        letters={DECADE_A_J}
        description={viewMode === 'explainer' ? 'The first 10 letters use only the top 4 dots. These are the foundation patterns that repeat in other decades.' : undefined}
      />
      
      <DecadeStrip 
        title="K-T (Base + Dot 3)" 
        letters={DECADE_K_T}
        description={viewMode === 'explainer' ? 'Letters K-T use the same patterns as A-J, but with dot 3 added to each pattern.' : undefined}
      />
      
      <DecadeStrip 
        title="U, V, X, Y, Z (Base + Dots 3,6)" 
        letters={DECADE_U_Z}
        description={viewMode === 'explainer' ? 'These letters use the base patterns with both dots 3 and 6 added.' : undefined}
      />
      
      <DecadeStrip 
        title="W (Special Case)" 
        letters={LETTER_W}
        description={viewMode === 'explainer' ? 'W was added later to the braille system and has its own unique pattern.' : undefined}
      />

      {/* Explainer Mode Extra Content */}
      {viewMode === 'explainer' && (
        <Paper elevation={1} sx={{ p: 3, mt: 4, backgroundColor: 'background.default' }}>
          <Typography variant="h6" gutterBottom color="primary.main">
            💡 Learning Tips
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom>
                Pattern Recognition
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Notice how the first decade (A-J) creates the base patterns. Each subsequent decade builds on these foundations by adding specific dots.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom>
                Numbers
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Numbers 1-9 and 0 use the same patterns as letters A-J, preceded by a number sign (⠼).
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      )}
    </Container>
  );
};

export default QuickReference;