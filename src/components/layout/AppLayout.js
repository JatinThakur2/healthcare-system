import React, { useState, useRef } from "react";
import { Outlet, useNavigate, Link } from "react-router-dom";
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Person as PersonIcon,
  BarChart as BarChartIcon,
  ExitToApp as LogoutIcon,
  ChevronLeft as ChevronLeftIcon,
} from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";

const drawerWidth = 240;

const AppLayout = () => {
  const { user, logout, isMainHead } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const drawerRef = useRef(null);

  const [open, setOpen] = useState(!isMobile);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleDrawerToggle = () => {
    // If closing the drawer, move focus to a safe element first
    if (open && drawerRef.current) {
      // Find the active element and check if it's inside the drawer
      const activeElement = document.activeElement;
      if (drawerRef.current.contains(activeElement)) {
        // Move focus to the menu button or another safe element
        const menuButton = document.getElementById("menu-button");
        if (menuButton) {
          menuButton.focus();
        }
      }
    }

    // Then toggle the drawer state
    setOpen(!open);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const menuItems = [
    {
      text: "Dashboard",
      icon: <DashboardIcon />,
      path: isMainHead ? "/" : "/doctor-dashboard",
      role: ["mainHead", "doctor"],
    },
    {
      text: "Doctors",
      icon: <PeopleIcon />,
      path: "/doctors",
      role: ["mainHead"],
    },
    {
      text: "Patients",
      icon: <PersonIcon />,
      path: "/patients",
      role: ["mainHead", "doctor"],
    },
    {
      text: "Reports",
      icon: <BarChartIcon />,
      path: "/reports",
      role: ["mainHead", "doctor"],
    },
  ];

  const filteredMenuItems = menuItems.filter((item) =>
    item.role.includes(user?.role)
  );

  return (
    <Box sx={{ display: "flex" }}>
      {/* Fixed App Bar - No border radius */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          borderRadius: 0, // Ensure no border radius
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)", // Subtle shadow instead of rounded corners
        }}
      >
        <Toolbar>
          <IconButton
            id="menu-button"
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Healthcare Information System
          </Typography>
          <IconButton
            onClick={handleProfileMenuOpen}
            size="large"
            edge="end"
            color="inherit"
          >
            <Avatar sx={{ width: 32, height: 32, bgcolor: "secondary.main" }}>
              {user?.name?.charAt(0) || "U"}
            </Avatar>
          </IconButton>
          <Menu
            id="profile-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                mt: 1.5,
                borderRadius: 1, // Small radius for menu only
                "& .MuiAvatar-root": {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                },
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <MenuItem>
              <Avatar>{user?.name?.charAt(0) || "U"}</Avatar>
              <Typography sx={{ ml: 1 }}>{user?.name}</Typography>
            </MenuItem>
            <Divider />
            <MenuItem>
              <ListItemIcon>
                <PersonIcon fontSize="small" />
              </ListItemIcon>
              Profile
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Drawer - No border radius */}
      <Drawer
        ref={drawerRef}
        variant={isMobile ? "temporary" : "persistent"}
        open={isMobile ? open : open}
        onClose={isMobile ? handleDrawerToggle : undefined}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            borderRadius: 0, // Ensure no border radius
            borderRight: "1px solid rgba(0, 0, 0, 0.12)", // Simple border instead
          },
        }}
        keepMounted
        disablePortal
      >
        <Toolbar />
        <Box sx={{ overflow: "auto" }} tabIndex="-1">
          {!isMobile && (
            <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
              <IconButton onClick={handleDrawerToggle} tabIndex="0">
                <ChevronLeftIcon />
              </IconButton>
            </Box>
          )}
          <List>
            {filteredMenuItems.map((item) => (
              <ListItem
                key={item.text}
                component={Link}
                to={item.path}
                sx={{
                  borderRadius: 0, // No border radius on list items
                  "&.active": {
                    bgcolor: "rgba(0, 0, 0, 0.08)",
                  },
                  "&:hover": {
                    bgcolor: "rgba(0, 0, 0, 0.04)",
                  },
                }}
                onClick={() => {
                  // If on mobile, close drawer after clicking a menu item
                  if (isMobile) {
                    handleDrawerToggle();
                  }
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
            <Divider sx={{ my: 2 }} />
            <ListItem
              onClick={() => {
                // Move focus before closing drawer/logout
                const menuButton = document.getElementById("menu-button");
                if (menuButton) {
                  menuButton.focus();
                }
                handleLogout();
              }}
              sx={{
                borderRadius: 0, // No border radius
                cursor: "pointer",
                "&:hover": {
                  bgcolor: "rgba(0, 0, 0, 0.04)",
                },
              }}
            >
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: "100%",
        }}
      >
        <Toolbar /> {/* This creates space below the AppBar */}
        <Outlet />
      </Box>
    </Box>
  );
};

export default AppLayout;
