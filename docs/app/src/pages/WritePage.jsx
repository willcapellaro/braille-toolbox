import { Box, IconButton, Slider, Stack, TextField, Tooltip, Typography } from '@mui/material';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import { useState } from 'react';

export default function WritePage() {
  const [text, setText] = useState('');
  const [isFlipped, setIsFlipped] = useState(false);
  const [fontSize, setFontSize] = useState(10.8);

  const flipTransform = isFlipped ? 'scaleX(-1)' : 'scaleX(1)';

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Write in Braille
      </Typography>

      <Stack spacing={2} component="form" sx={{ width: '100%' }}>
        <TextField
          label="Input"
          multiline
          minRows={6}
          value={text}
          onChange={(event) => setText(event.target.value)}
          inputProps={{
            style: {
              fontFamily:
                'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
            },
          }}
          fullWidth
        />

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="subtitle1">Braille Preview</Typography>
          <Tooltip title="Flip horizontal">
            <IconButton
              aria-label="Flip horizontal"
              onClick={() => setIsFlipped((value) => !value)}
              size="small"
            >
              <SwapHorizIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2" sx={{ minWidth: 90 }}>
            Font size
          </Typography>
          <Slider
            value={fontSize}
            onChange={(_, value) => setFontSize(value)}
            min={3}
            max={16}
            step={0.2}
            sx={{ maxWidth: 320 }}
            valueLabelDisplay="auto"
          />
          <Typography variant="caption" color="text.secondary">
            {fontSize.toFixed(1)}rem
          </Typography>
        </Box>

        <Box
          role="status"
          aria-live="polite"
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            p: 2,
            minHeight: 160,
            backgroundColor: 'common.white',
            transform: flipTransform,
            fontFamily: '"BraillePreview", "Source Sans 3", sans-serif',
            fontSize: `${fontSize}rem`,
            lineHeight: 1.1,
            overflowWrap: 'anywhere',
          }}
        >
          {text}
        </Box>
      </Stack>
    </Box>
  );
}
