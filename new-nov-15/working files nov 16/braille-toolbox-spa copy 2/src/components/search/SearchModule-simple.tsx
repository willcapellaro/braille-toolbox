import React, { useState } from 'react';
import { 
  Paper, 
  InputBase, 
  IconButton, 
  Box, 
  Typography,
  Container 
} from '@mui/material';
import { Search } from '@mui/icons-material';

const SearchModule: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Typography variant="h6" color="text.secondary">
          🔍 Central Search & Braille Decoder
        </Typography>
      </Box>
      
      <Paper
        elevation={3}
        sx={{
          p: '8px 4px',
          display: 'flex',
          alignItems: 'center',
          borderRadius: 3,
          backgroundColor: 'white',
        }}
      >
        {/* Braille Cell Placeholder */}
        <Box 
          sx={{ 
            width: 60, 
            height: 40, 
            backgroundColor: '#f5f5f5', 
            borderRadius: 1, 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mr: 2,
            border: '2px solid #ddd'
          }}
        >
          <Typography variant="caption" color="text.secondary">
            ⠿
          </Typography>
        </Box>
        
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Search braille characters, type to convert text..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          inputProps={{ 'aria-label': 'search braille characters' }}
        />
        
        <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
          <Search />
        </IconButton>
      </Paper>
      
      {searchQuery && (
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Searching for: "{searchQuery}"
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default SearchModule;