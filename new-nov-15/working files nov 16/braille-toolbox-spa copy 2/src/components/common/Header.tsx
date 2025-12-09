import React from 'react';
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
import { Menu as MenuIcon, Home, QuickReferences, Edit, Settings } from '@mui/icons-material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUniversalAccess } from '@fortawesome/free-solid-svg-icons';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();

  const navigationItems = [
    { path: '/', label: 'Quick Reference', icon: QuickReferences },
    { path: '/intro', label: 'Learn Braille', icon: Home },
    { path: '/write-in-braille', label: 'Write', icon: Edit },
    { path: '/braillewriter-help', label: 'Tools', icon: Settings },
  ];

  return (
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
            <FontAwesomeIcon icon={faUniversalAccess} size="lg" />
            <Typography 
              variant="h6" 
              component={Link} 
              to="/"
              sx={{ 
                textDecoration: 'none', 
                color: 'inherit',
                fontFamily: 'Francois One',
                fontWeight: 700
              }}
            >
              Braille Toolbox
            </Typography>
          </Box>
        </Box>

        {!isMobile && (
          <Box display="flex" gap={1}>
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Button
                  key={item.path}
                  component={Link}
                  to={item.path}
                  color="inherit"
                  startIcon={<Icon />}
                  sx={{
                    minWidth: 'auto',
                    px: 2,
                    borderRadius: 2,
                    backgroundColor: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.2)',
                    },
                  }}
                >
                  {item.label}
                </Button>
              );
            })}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;