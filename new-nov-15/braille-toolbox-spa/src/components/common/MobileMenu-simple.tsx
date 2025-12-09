import React from 'react';
import { Link } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
} from '@mui/material';

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ open, onClose }) => {
  const navigationItems = [
    { path: '/', label: 'Quick Reference', icon: '📚' },
    { path: '/intro', label: 'Learn Braille', icon: '🎓' },
    { path: '/write-in-braille', label: 'Write', icon: '✏️' },
  ];

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: 280,
          boxSizing: 'border-box',
        },
      }}
    >
      <Box sx={{ p: 2, borderBottom: '1px solid #eee' }}>
        <Typography variant="h6" sx={{ fontFamily: 'Francois One, sans-serif' }}>
          ⠃ Braille Toolbox
        </Typography>
      </Box>
      
      <List>
        {navigationItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              component={Link}
              to={item.path}
              onClick={onClose}
            >
              <ListItemIcon>
                <Typography component="span" sx={{ fontSize: '1.5rem' }}>
                  {item.icon}
                </Typography>
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default MobileMenu;