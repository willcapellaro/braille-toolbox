import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  Button,
  Chip,
  Paper
} from '@mui/material';
import { School, Search, Create, TouchApp } from '@mui/icons-material';

const QuickReference: React.FC = () => {
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
            Your comprehensive braille learning companion. Explore letters, numbers, punctuation, and contractions in an interactive, accessible format.
          </Typography>
          
          {/* Quick Action Chips */}
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap', mb: 4 }}>
            <Chip label="Letters A-Z" variant="outlined" />
            <Chip label="Numbers 0-9" variant="outlined" />
            <Chip label="Punctuation" variant="outlined" />
            <Chip label="Contractions" variant="outlined" />
          </Box>
        </Box>

        {/* Feature Cards */}
        <Grid container spacing={4} sx={{ mb: 6 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%', textAlign: 'center', '&:hover': { transform: 'translateY(-4px)', transition: 'transform 0.2s' } }}>
              <CardContent sx={{ p: 3 }}>
                <Search sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Search & Decode
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Find any braille character instantly with our interactive search
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%', textAlign: 'center', '&:hover': { transform: 'translateY(-4px)', transition: 'transform 0.2s' } }}>
              <CardContent sx={{ p: 3 }}>
                <Create sx={{ fontSize: 40, color: 'secondary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Write in Braille
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Convert text to braille with real-time preview
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%', textAlign: 'center', '&:hover': { transform: 'translateY(-4px)', transition: 'transform 0.2s' } }}>
              <CardContent sx={{ p: 3 }}>
                <TouchApp sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Interactive Cells
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Click braille dots to build and decode patterns
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%', textAlign: 'center', '&:hover': { transform: 'translateY(-4px)', transition: 'transform 0.2s' } }}>
              <CardContent sx={{ p: 3 }}>
                <School sx={{ fontSize: 40, color: 'secondary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Learn & Practice
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Comprehensive guides and educational resources
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Status Panel */}
        <Paper sx={{ 
          p: 4, 
          textAlign: 'center', 
          backgroundColor: 'primary.main',
          color: 'white',
          borderRadius: 3
        }}>
          <Typography variant="h6" sx={{ mb: 2, color: 'white' }}>
            🚀 Application Status
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 2, p: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 500, color: 'white' }}>
                  ✅ React SPA
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 2, p: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 500, color: 'white' }}>
                  ✅ Material-UI
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 2, p: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 500, color: 'white' }}>
                  ✅ Responsive Design
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 2, p: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 500, color: 'white' }}>
                  ✅ Accessibility Ready
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
        
        {/* Navigation Buttons */}
        <Box sx={{ mt: 6, textAlign: 'center' }}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Getting Started
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button variant="contained" size="large" startIcon={<School />}>
              Start Learning
            </Button>
            <Button variant="outlined" size="large" startIcon={<Search />}>
              Explore Search
            </Button>
            <Button variant="outlined" size="large" startIcon={<Create />}>
              Try Writing
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default QuickReference;