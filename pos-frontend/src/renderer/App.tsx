import { MemoryRouter as Router, Routes, Route } from "react-router-dom";
import ThemeProvider from "./theme/themeProvider";
import "./App.css";

import Home from "./components/Home";
import Dashboard from "./components/Dashboard";
import Products from "./components/Products";
import Sales from "./components/Sales";
import Reports from "./components/Reports";
import Settings from "./components/Settings";
import Customers from "./components/Customers";

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/* Home layout (Sidebar + Topbar) */}
          <Route path="/" element={<Home />}>
            {/* Nested routes appear in <Outlet /> inside Home.tsx */}
            <Route index element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="sales" element={<Sales />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}
