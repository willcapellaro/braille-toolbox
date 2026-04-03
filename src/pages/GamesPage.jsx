import { Box, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Link as MuiLink } from '@mui/material';

const GAMES = [
  {
    path: '/games/solitaire',
    title: 'Braille Solitaire',
    description: 'Klondike solitaire with a standard 52-card deck in braille notation.',
  },
];

export default function GamesPage() {
  return (
    <Box sx={{ pb: 4 }}>
      <Typography variant="h5" component="h1" sx={{ mb: 0.5 }}>Games</Typography>
      <Typography variant="body2" sx={{ mb: 3, opacity: 0.7 }}>
        Braille learning through play.
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {GAMES.map((g) => (
          <Box key={g.path} sx={{ borderBottom: 1, borderColor: 'divider', pb: 1.5 }}>
            <MuiLink component={RouterLink} to={g.path} underline="hover" variant="h6">
              {g.title}
            </MuiLink>
            <Typography variant="body2" sx={{ mt: 0.25, opacity: 0.7 }}>{g.description}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
