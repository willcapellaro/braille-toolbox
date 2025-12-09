import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton, 
  Box,
  Button,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Menu as MenuIcon, Settings as SettingsIcon } from '@mui/icons-material';
import SettingsDialog from '../settings/SettingsDialog';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();

  const navigationItems = [
    { path: '/', label: 'Quick Reference', icon: '📚' },
    { path: '/intro', label: 'Learn Braille', icon: '🎓' },
    { path: '/write-in-braille', label: 'Write', icon: '✏️' },
  ];

  return (
    <>
    <AppBar position="static" elevation={1}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box display="flex" alignItems="center">
          {isMobile && (
            <IconButton 
              edge="start" 
              color="inherit" 
              aria-label="menu" 
              onClick={onMenuClick}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Box display="flex" alignItems="center" gap={1}>
            <Typography component="span" sx={{ fontSize: '1.5rem' }}>⠃</Typography>
            <Typography 
              variant="h6" 
              component={Link}
              to="/"
              sx={{ 
                fontFamily: 'Francois One, sans-serif',
                textDecoration: 'none',
                color: 'inherit',
                fontWeight: 'bold'
              }}
            >
              Braille Toolbox
            </Typography>
          </Box>
        </Box>

        {!isMobile && (
          <Box display="flex" gap={1}>
            {navigationItems.map((item) => (
              <Button
                key={item.path}
                color="inherit"
                component={Link}
                to={item.path}
                sx={{
                  backgroundColor: location.pathname === item.path ? 'rgba(255,255,255,0.1)' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                  },
                }}
                startIcon={<span>{item.icon}</span>}
              >
                {item.label}
              </Button>
            ))}
          </Box>
        )}

        {/* Settings Button */}
        <IconButton
          color="inherit"
          onClick={() => setSettingsOpen(true)}
          sx={{ ml: 1 }}
          aria-label="Settings"
        >
          <SettingsIcon />
        </IconButton>
      </Toolbar>
    </AppBar>

    {/* Settings Dialog */}
    <SettingsDialog
      open={settingsOpen}
      onClose={() => setSettingsOpen(false)}
    />
  </>
  );
};

export default Header;