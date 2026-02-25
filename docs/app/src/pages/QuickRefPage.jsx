import { Box, Card, CardContent, Grid, Typography } from '@mui/material';
import BrailleCell from '../lib/braille/BrailleCell';
import { getBrailleCells } from '../content';

const quickRefCells = getBrailleCells().slice(0, 12);

export default function QuickRefPage() {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Quick Reference (Phase 1 Rebuild)
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        Central Content is now connected. This preview uses normalized cell data.
      </Typography>

      <Grid container spacing={2}>
        {quickRefCells.map((cell) => (
          <Grid item xs={12} sm={6} md={4} key={cell.id}>
            <Card variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                  <BrailleCell pattern={cell.binary} label={cell.title} />
                  <Typography variant="subtitle2" sx={{ fontFamily: 'monospace' }}>
                    {cell.id}
                  </Typography>
                </Box>
                <Typography variant="subtitle1" sx={{ mb: 0.5 }}>
                  {cell.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {cell.description || 'No description yet.'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
