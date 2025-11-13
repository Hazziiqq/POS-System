import React, { useState } from "react";
import { Box, Drawer, List, ListItemButton, ListItemText, Typography, Toolbar, AppBar, CssBaseline,
} from "@mui/material";
import { useNavigate, Outlet } from "react-router-dom";

const drawerWidth = 220;

const Home: React.FC = () => {
  const [selected, setSelected] = useState("Dashboard");
  const navigate = useNavigate();

  const menuItems = [
    { name: "Dashboard", path: "/" },
    { name: "Products", path: "/products" },
    { name: "Sales", path: "/sales" },
    { name: "Reports", path: "/reports" },
    { name: "Settings", path: "/settings" },
    
  ];

  const handleMenuClick = (item: any) => {
    setSelected(item.name);
    navigate(item.path);
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", bgcolor: "background.default" }}>
      <CssBaseline />

      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "#2A2A3B",
            color: "white",
            borderRight: "1px solid rgba(255,255,255,0.1)",
          },
        }}
      >
        <Toolbar>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            POS System
          </Typography>
        </Toolbar>

        <List>
          {menuItems.map((item) => (
            <ListItemButton
              key={item.name}
              selected={selected === item.name}
              onClick={() => handleMenuClick(item)}
              sx={{
                borderRadius: 1,
                mx: 1,
                mb: 1,
                "&.Mui-selected": {
                  backgroundColor: "primary.main",
                  color: "white",
                },
              }}
            >
              <ListItemText primary={item.name} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          backgroundColor: "background.default",
          color: "text.primary",
        }}
      >
        {/* Top Bar */}
        <AppBar
          position="static"
          sx={{
            backgroundColor: "#2A2A3B",
            color: "white",
            mb: 3,
            borderRadius: 2,
          }}
        >
          <Toolbar>
            <Typography variant="h6">{selected}</Typography>
          </Toolbar>
        </AppBar>

        {/* Here the page (Dashboard, Products, etc.) will render */}
        <Outlet />
      </Box>
    </Box>
  );
};

export default Home;
