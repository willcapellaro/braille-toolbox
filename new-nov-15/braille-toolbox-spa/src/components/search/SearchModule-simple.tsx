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