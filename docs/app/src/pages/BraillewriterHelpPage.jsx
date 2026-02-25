import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Checkbox,
  FormControlLabel,
  IconButton,
  Slider,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
const BraillewriterHelpPage = () => {
  const [text, setText] = useState('');
  const [lockText, setLockText] = useState(false);
  const [speed, setSpeed] = useState(1100); // inverted: lower value = slower, higher = faster
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const imageBoxRef = useRef(null);
  const playbackRef = useRef({
    array: [],
    index: 0,
    timer: null,
    stop: false,
  });

  // Character equivalence mapping for special characters
  const equivalence = [
    { char: ' ', value: 'space' },
    { char: '?', value: 'question-mark' },
    { char: ':', value: 'colon' },
    { char: '\n', value: 'return' },
  ];

  // Get image name for a character
  const getImageName = (char) => {
    const mappedChar = equivalence.find((e) => e.char === char);
    if (mappedChar) {
      return `letter-${mappedChar.value}`;
    }
    return `letter-${char.toLowerCase()}`;
  };

  // Format text for playback (add prefixes for capitals and numbers)
  const formatForPlayback = (inputText) => {
    let formatted = inputText;
    // Replace capitals with prefix
    formatted = formatted.replace(/[A-Z]/g, (match) => `^${match.toLowerCase()}`);
    // Replace numbers with prefix
    formatted = formatted.replace(/[0-9]/g, (match) => `+${match}`);
    return formatted.split('');
  };

  // Recreate image in display area
  const recreateImg = (imageName) => {
    if (!imageBoxRef.current) return;
    imageBoxRef.current.innerHTML = '';
    const img = document.createElement('img');
    img.src = `/imgs/${imageName}.svg`;
    img.alt = imageName;
    img.style.maxWidth = '100%';
    img.style.maxHeight = '100%';
    img.style.objectFit = 'contain';
    imageBoxRef.current.appendChild(img);
  };

  // Clear image display
  const clearImage = () => {
    if (imageBoxRef.current) {
      imageBoxRef.current.innerHTML = '';
    }
  };

  // Play through text character by character
  const play = () => {
    if (!text.trim()) return;

    const formattedArray = formatForPlayback(text);
    playbackRef.current = {
      array: formattedArray,
      index: 0,
      stop: false,
      timer: null,
    };

    setIsPlaying(true);
    setIsPaused(false);
    letterTransition();
  };

  // Transition to next character
  const letterTransition = () => {
    const pb = playbackRef.current;

    if (pb.index < pb.array.length && !pb.stop) {
      const char = pb.array[pb.index];
      const imageName = getImageName(char);
      recreateImg(imageName);
      pb.index += 1;

      pb.timer = setTimeout(() => {
        letterTransition();
      }, actualSpeed);
    } else if (pb.index >= pb.array.length) {
      setIsPlaying(false);
      setIsPaused(false);
      clearImage();
    }
  };

  // Pause playback
  const pausePlayback = () => {
    if (playbackRef.current.timer) {
      clearTimeout(playbackRef.current.timer);
      playbackRef.current.timer = null;
    }
    setIsPaused(true);
    setIsPlaying(false);
  };

  // Resume playback
  const resumePlayback = () => {
    if (isPaused) {
      setIsPlaying(true);
      setIsPaused(false);
      letterTransition();
    }
  };

  // Restart playback
  const restart = () => {
    if (playbackRef.current.timer) {
      clearTimeout(playbackRef.current.timer);
      playbackRef.current.timer = null;
    }
    playbackRef.current.stop = true;
    clearImage();
    setIsPlaying(false);
    setIsPaused(false);
  };

  // Calculate letters per minute for display
  const actualSpeed = 2200 - speed; // inverts direction: left=slow, right=fast
  const lettersPerMinute = Math.round(60000 / actualSpeed);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (playbackRef.current.timer) {
        clearTimeout(playbackRef.current.timer);
      }
    };
  }, []);

  return (
    <Box sx={{ py: 4, maxWidth: 'md', mx: 'auto' }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
        Braillewriter Help
      </Typography>

      <Stack spacing={2}>
        {/* Input Section */}
        <Stack spacing={2}>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, 700))}
            onKeyDown={(e) => {
              if (lockText) {
                e.preventDefault();
              }
            }}
            disabled={lockText}
            placeholder="Enter text here (max 700 characters)"
            inputProps={{
              style: { fontFamily: 'monospace', fontSize: '1rem' },
              maxLength: 700,
            }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="textSecondary">
              {text.length} / 700 characters
            </Typography>
            <FormControlLabel
              control={
                <Checkbox checked={lockText} onChange={(e) => setLockText(e.target.checked)} />
              }
              label="Lock Text"
            />
          </Box>
        </Stack>

        {/* Image Display Section */}
        <Box
          ref={imageBoxRef}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '200px',
            bgcolor: 'white',
            borderRadius: 1,
            border: '2px solid #e0e0e0',
            position: 'relative',
            '&:empty::before': {
              content: '"Character display area"',
              color: '#999',
              fontSize: '0.875rem',
            },
          }}
        />

        {/* Playback Controls */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Tooltip title="Play">
            <span>
              <IconButton
                onClick={play}
                disabled={!text.trim() || isPlaying}
                color="primary"
              >
                <PlayArrowIcon />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title={isPaused ? 'Resume' : 'Pause'}>
            <span>
              <IconButton
                onClick={isPaused ? resumePlayback : pausePlayback}
                disabled={!isPlaying && !isPaused}
                color="primary"
              >
                <PauseIcon />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Restart">
            <span>
              <IconButton onClick={restart} disabled={!isPlaying && !isPaused} color="primary">
                <RestartAltIcon />
              </IconButton>
            </span>
          </Tooltip>

          {/* Speed Control */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 2 }}>
            <Typography variant="body2" sx={{ minWidth: 50, fontSize: '0.875rem' }}>
              Speed
            </Typography>
            <Slider
              value={speed}
              onChange={(_, value) => setSpeed(value)}
              min={100}
              max={2000}
              step={50}
              sx={{ width: 120 }}
              valueLabelDisplay="auto"
            />
            <Typography variant="caption" color="text.secondary" sx={{ minWidth: 40 }}>
              {lettersPerMinute} lpm
            </Typography>
          </Box>
        </Box>
      </Stack>
    </Box>
  );
};

export default BraillewriterHelpPage;
