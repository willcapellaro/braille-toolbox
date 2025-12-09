import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Paper,
  InputBase,
  IconButton,
  Box,
  Chip,
  Typography,
  Collapse,
  useTheme,
  Tooltip,
} from '@mui/material';
import { Search, Clear, TouchApp } from '@mui/icons-material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import BrailleCellToggle from './BrailleCellToggle';
import { convertTextToBraille } from '../../utils/brailleConverter';

const SearchModule: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [brailleDots, setBrailleDots] = useState('000000');
  const [showBrailleCell, setShowBrailleCell] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const theme = useTheme();

  // Initialize from URL params
  useEffect(() => {
    const query = searchParams.get('q') || '';
    const dots = searchParams.get('dots') || '';
    setSearchQuery(query);
    if (dots) {
      setBrailleDots(dots);
      setShowBrailleCell(true);
    }
  }, [searchParams]);

  const updateUrl = useCallback((query: string, dots?: string) => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (dots && dots !== '000000') params.set('dots', dots);
    setSearchParams(params);
  }, [setSearchParams]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchQuery(value);
    updateUrl(value, showBrailleCell ? brailleDots : undefined);
  };

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search results or perform search action
      navigate(`/?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setBrailleDots('000000');
    setShowBrailleCell(false);
    setSearchParams(new URLSearchParams());
  };

  const toggleBrailleCell = () => {
    const newShow = !showBrailleCell;
    setShowBrailleCell(newShow);
    if (newShow) {
      updateUrl(searchQuery, brailleDots);
    } else {
      updateUrl(searchQuery);
    }
  };

  const handleDotsChange = (newDots: string) => {
    setBrailleDots(newDots);
    updateUrl(searchQuery, newDots);
  };

  const quickActions = [
    { label: 'Letters A-Z', action: () => navigate('/?section=letters') },
    { label: 'Numbers', action: () => navigate('/?section=numbers') },
    { label: 'Punctuation', action: () => navigate('/?section=punctuation') },
    { label: 'Contractions', action: () => navigate('/?section=contractions') },
  ];

  const brailleOutput = searchQuery ? convertTextToBraille(searchQuery) : '';

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mb: 4 }}>
      <Paper
        elevation={2}
        sx={{
          p: 2,
          borderRadius: 3,
          background: theme.palette.mode === 'light' 
            ? 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)'
            : 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)',
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        {/* Main Search Bar */}
        <Box
          component="form"
          onSubmit={handleSearchSubmit}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            mb: showBrailleCell ? 2 : 0,
          }}
        >
          {/* Braille Cell Toggle Button */}
          <Tooltip title="Toggle dot decoder">
            <IconButton
              onClick={toggleBrailleCell}
              sx={{
                color: showBrailleCell ? 'primary.main' : 'text.secondary',
                '&:hover': {
                  backgroundColor: 'primary.light',
                  color: 'primary.main',
                },
              }}
            >
              <TouchApp />
            </IconButton>
          </Tooltip>

          {/* Search Input */}
          <InputBase
            placeholder="Type text to see in braille, or use the dot decoder..."
            value={searchQuery}
            onChange={handleSearchChange}
            sx={{
              flex: 1,
              fontSize: '1.1rem',
              px: 2,
              py: 1,
              backgroundColor: 'background.paper',
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`,
              '&:focus-within': {
                borderColor: 'primary.main',
                boxShadow: `0 0 0 2px ${theme.palette.primary.main}20`,
              },
            }}
          />

          {/* Search Button */}
          <IconButton
            type="submit"
            sx={{
              backgroundColor: 'primary.main',
              color: 'primary.contrastText',
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
            }}
          >
            <Search />
          </IconButton>

          {/* Clear Button */}
          {(searchQuery || showBrailleCell) && (
            <IconButton onClick={handleClearSearch} color="inherit">
              <Clear />
            </IconButton>
          )}
        </Box>

        {/* Braille Output */}
        {brailleOutput && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Braille output:
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontFamily: 'braille',
                fontSize: '1.5rem',
                color: 'primary.main',
                letterSpacing: '0.1em',
              }}
            >
              {brailleOutput}
            </Typography>
          </Box>
        )}

        {/* Braille Cell Decoder */}
        <Collapse in={showBrailleCell}>
          <BrailleCellToggle
            dots={brailleDots}
            onDotsChange={handleDotsChange}
          />
        </Collapse>

        {/* Quick Actions */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mr: 1, alignSelf: 'center' }}>
            Quick access:
          </Typography>
          {quickActions.map((action) => (
            <Chip
              key={action.label}
              label={action.label}
              onClick={action.action}
              size="small"
              variant="outlined"
              sx={{
                '&:hover': {
                  backgroundColor: 'primary.light',
                  color: 'primary.contrastText',
                },
              }}
            />
          ))}
        </Box>
      </Paper>
    </Box>
  );
};

export default SearchModule;