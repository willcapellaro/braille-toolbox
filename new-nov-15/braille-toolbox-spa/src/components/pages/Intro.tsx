import React from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  Divider,
} from '@mui/material';
import { School, Visibility, TouchApp } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const Intro: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h2" component="h1" gutterBottom sx={{ fontFamily: 'Francois One' }}>
          Introduction to Braille
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{ mb: 4 }}>
          Learn the fundamentals of the braille writing system
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* What is Braille */}
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ fontFamily: 'Francois One' }}>
              What is Braille?
            </Typography>
            <Typography variant="body1" paragraph>
              Think of braille as the same alphabet that we use in English, but made for touch reading. 
              Braille works by creating tactile shapes that people who are blind can learn to read by touch. 
              Each braille character, or <strong>cell</strong>, is made of up to six dots in a two-by-three arrangement.
            </Typography>
            <Typography variant="body1" paragraph>
              This system was invented by Louis Braille in 1824 when he was just 15 years old. 
              It has become the standard reading and writing system for people who are blind or visually impaired worldwide.
            </Typography>
          </Paper>

          <Paper elevation={2} sx={{ p: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ fontFamily: 'Francois One' }}>
              The Braille Cell
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Box sx={{ mr: 4 }}>
                <svg width="80" height="120" viewBox="0 0 80 120">
                  <rect x="10" y="10" width="60" height="100" fill="none" stroke="#9333ea" strokeWidth="2" rx="8"/>
                  <circle cx="30" cy="30" r="8" fill="#9333ea"/>
                  <circle cx="30" cy="60" r="8" fill="#9333ea"/>
                  <circle cx="30" cy="90" r="8" fill="#9333ea"/>
                  <circle cx="50" cy="30" r="8" fill="#9333ea"/>
                  <circle cx="50" cy="60" r="8" fill="#9333ea"/>
                  <circle cx="50" cy="90" r="8" fill="#9333ea"/>
                  <text x="20" y="120" fontSize="12" fill="#666" textAnchor="middle">1 2 3</text>
                  <text x="60" y="120" fontSize="12" fill="#666" textAnchor="middle">4 5 6</text>
                </svg>
              </Box>
              <Box>
                <Typography variant="body1" paragraph>
                  Each braille cell consists of six possible dot positions, arranged in two columns of three dots each. 
                  The dots are numbered 1, 2, 3 down the left side and 4, 5, 6 down the right side.
                </Typography>
                <Typography variant="body1">
                  Different combinations of these dots create the 63 possible characters in the braille code.
                </Typography>
              </Box>
            </Box>
          </Paper>

          <Paper elevation={2} sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ fontFamily: 'Francois One' }}>
              Letters and Numbers
            </Typography>
            <Typography variant="body1" paragraph>
              The braille alphabet follows a logical pattern. The first ten letters (a-j) use only the top four dots. 
              The next ten letters (k-t) add dot 3, and the remaining letters add both dots 3 and 6, 
              with 'w' being a special exception.
            </Typography>
            <Typography variant="body1" paragraph>
              Numbers in braille use the same patterns as letters a-j, but are preceded by a number sign (dots 3, 4, 5, 6).
            </Typography>
          </Paper>
        </Grid>

        {/* Getting Started */}
        <Grid item xs={12} md={4}>
          <Card elevation={3} sx={{ mb: 3 }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Visibility sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Quick Reference
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Browse the complete braille character set and common contractions
              </Typography>
              <Button 
                component={Link} 
                to="/" 
                variant="contained" 
                color="primary"
                fullWidth
              >
                View Reference
              </Button>
            </CardContent>
          </Card>

          <Card elevation={3} sx={{ mb: 3 }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <TouchApp sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Try the Dot Decoder
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Click dots to build braille characters and see their meanings
              </Typography>
              <Button 
                component={Link} 
                to="/dot-decoder" 
                variant="contained" 
                color="secondary"
                fullWidth
              >
                Start Decoding
              </Button>
            </CardContent>
          </Card>

          <Card elevation={3}>
            <CardContent sx={{ textAlign: 'center' }}>
              <School sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Practice Writing
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Type text and see it converted to braille instantly
              </Typography>
              <Button 
                component={Link} 
                to="/write-in-braille" 
                variant="contained" 
                color="success"
                fullWidth
              >
                Start Writing
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Divider sx={{ my: 6 }} />

      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom sx={{ fontFamily: 'Francois One' }}>
          Ready to Learn More?
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Explore the interactive tools above to start your braille learning journey. 
          Each tool is designed to help you understand different aspects of the braille writing system.
        </Typography>
        <Button 
          component={Link} 
          to="/" 
          variant="outlined" 
          size="large"
          sx={{ mt: 2 }}
        >
          Back to Quick Reference
        </Button>
      </Box>
    </Container>
  );
};

export default Intro;