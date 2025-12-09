import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Box,
} from '@mui/material';
import {
  QuickReferences,
  School,
  Edit,
  DonutLarge,
  Build,
  Flip,
} from '@mui/icons-material';

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ open, onClose }) => {
  const location = useLocation();

  const menuItems = [
    { path: '/', label: 'Quick Reference', icon: QuickReferences, description: 'Braille character reference' },
    { path: '/intro', label: 'Learn Braille', icon: School, description: 'Introduction to braille' },
    { path: '/write-in-braille', label: 'Write in Braille', icon: Edit, description: 'Convert text to braille' },
    { path: '/dot-decoder', label: 'Dot Decoder', icon: DonutLarge, description: 'Decode braille patterns' },
    { path: '/braillewriter-help', label: 'Braillewriter Help', icon: Build, description: 'Using a braillewriter' },
    { path: '/slate-stylus', label: 'Slate & Stylus', icon: Flip, description: 'Slate writing reference' },
  ];

  const handleItemClick = () => {
    onClose();
  };

  return (
    <Drawer anchor="left" open={open} onClose={onClose}>
      <Box sx={{ width: 280, pt: 2 }}>
        <Box sx={{ px: 3, pb: 2 }}>
          <Typography variant="h6" sx={{ fontFamily: 'Francois One', fontWeight: 700 }}>
            Navigation
          </Typography>
        </Box>
        <Divider />
        <List>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <ListItem key={item.path} disablePadding>
                <ListItemButton
                  component={Link}
                  to={item.path}
                  onClick={handleItemClick}
                  selected={isActive}
                  sx={{
                    py: 1.5,
                    '&.Mui-selected': {
                      backgroundColor: 'primary.light',
                      color: 'primary.contrastText',
                      '&:hover': {
                        backgroundColor: 'primary.main',
                      },
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: isActive ? 'inherit' : 'text.secondary' }}>
                    <Icon />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    secondary={item.description}
                    primaryTypographyProps={{
                      fontWeight: isActive ? 600 : 400,
                    }}
                    secondaryTypographyProps={{
                      fontSize: '0.75rem',
                      color: isActive ? 'inherit' : 'text.secondary',
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>
    </Drawer>
  );
};

export default MobileMenu;