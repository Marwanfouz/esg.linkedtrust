import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import { MoreVert } from '@mui/icons-material';
import {
  Dashboard,
  Search,
  QrCodeScanner,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

interface HeaderProps {
  onMenuClick?: () => void;
}

const Header: React.FC<HeaderProps> = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const navigationItems = [
    { label: 'Dashboard', path: '/', icon: <Dashboard /> },
    { label: 'Search', path: '/companies', icon: <Search /> },
    { label: 'Scan Product', path: '/scan', icon: <QrCodeScanner /> },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    setAnchorEl(null); // Close mobile menu
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static" elevation={1}>
      <Toolbar sx={{ px: { xs: 2, sm: 3 } }}>
        {/* Logo and Brand */}
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 0, mr: 4 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: 'linear-gradient(45deg, #2563eb 30%, #60a5fa 90%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 1,
            }}
          >
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }}>
              LT
            </Typography>
          </Box>
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: 600,
              color: 'primary.main',
              textDecoration: 'none',
              cursor: 'pointer',
            }}
            onClick={() => handleNavigation('/')}
          >
            LinkedTrust
          </Typography>
        </Box>

        {/* Navigation Items - Desktop */}
        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, gap: 1, justifyContent: 'flex-end' }}>
          {navigationItems.map((item) => (
            <Button
              key={item.path}
              startIcon={item.icon}
              onClick={() => handleNavigation(item.path)}
              sx={{
                textTransform: 'none',
                fontWeight: location.pathname === item.path ? 600 : 500,
                color: location.pathname === item.path ? 'primary.main' : 'text.primary',
                backgroundColor: location.pathname === item.path ? 'rgba(37, 99, 235, 0.1)' : 'transparent',
                borderRadius: 2,
                px: 2,
                py: 1,
                '&:hover': {
                  backgroundColor: 'rgba(37, 99, 235, 0.1)',
                  color: 'primary.main',
                },
              }}
            >
              {item.label}
            </Button>
          ))}
        </Box>

        {/* Navigation Items - Mobile */}
        <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' }, justifyContent: 'flex-end' }}>
          <IconButton
            onClick={handleMenuOpen}
            sx={{
              color: 'text.primary',
              '&:hover': {
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
              },
            }}
          >
            <MoreVert />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            sx={{
              mt: 1,
            }}
          >
            {navigationItems.map((item) => (
              <MenuItem
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                sx={{
                  fontWeight: location.pathname === item.path ? 600 : 400,
                  color: location.pathname === item.path ? 'primary.main' : 'text.primary',
                  backgroundColor: location.pathname === item.path ? 'rgba(37, 99, 235, 0.05)' : 'transparent',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  {item.icon}
                  {item.label}
                </Box>
              </MenuItem>
            ))}
          </Menu>
        </Box>

      </Toolbar>
    </AppBar>
  );
};

export default Header;
