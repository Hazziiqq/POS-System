import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { fetchTotalSales, fetchTopProducts, fetchLowStock } from "../api/ReportApi";

interface TotalSales {
  totalSales: number;
  totalRevenue: number;
}

interface TopProduct {
  product_name: string;
  total_sold: number;
  total_revenue: number;
}

interface LowStockProduct {
  product_name: string;
  stock: number;
  category?: string;
}

const Reports = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalSales, setTotalSales] = useState<TotalSales | null>(null);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [lowStock, setLowStock] = useState<LowStockProduct[]>([]);

  useEffect(() => {
    const loadReports = async () => {
      try {
        const [totalData, topData, lowData] = await Promise.all([
          fetchTotalSales(),
          fetchTopProducts(),
          fetchLowStock(),
        ]);

        setTotalSales(totalData);
        setTopProducts(topData); // already an array from API
        setLowStock(lowData);    // already an array from API
      } catch (err: any) {
        setError(err.message || "Failed to load reports");
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, []);

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Box sx={{ textAlign: "center", mt: 5, color: "red" }}>
        <Typography variant="h6">{error}</Typography>
      </Box>
    );

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Reports
      </Typography>

      {/* Sales Overview Cards */}
      <Box 
        sx={{ 
          display: "flex", 
          gap: 2, 
          mb: 3,
          flexDirection: { xs: "column", md: "row" }
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Paper sx={{ p: 2, backgroundColor: "#2A2A3B", color: "white" }}>
            <Typography variant="subtitle1">Total Sales</Typography>
            <Typography variant="h6">{totalSales?.totalSales}</Typography>
          </Paper>
        </Box>
        <Box sx={{ flex: 1 }}>
          <Paper sx={{ p: 2, backgroundColor: "#2A2A3B", color: "white" }}>
            <Typography variant="subtitle1">Total Revenue</Typography>
            <Typography variant="h6">₨{totalSales?.totalRevenue}</Typography>
          </Paper>
        </Box>
      </Box>

      {/* Top-Selling Products */}
      <Paper sx={{ p: 2, mb: 3, backgroundColor: "#2A2A3B", color: "white" }}>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Top-Selling Products
        </Typography>
        <List>
          {topProducts.length === 0 ? (
            <ListItem>
              <ListItemText primary="No top products available" />
            </ListItem>
          ) : (
            topProducts.map((product, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={product.product_name}
                  secondary={`Sold: ${product.total_sold} | Revenue: ₨${product.total_revenue}`}
                />
              </ListItem>
            ))
          )}
        </List>
      </Paper>

      {/* Low Stock Products */}
      <Paper sx={{ p: 2, backgroundColor: "#2A2A3B", color: "white" }}>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Low Stock Products
        </Typography>
        <List>
          {lowStock.length === 0 ? (
            <ListItem>
              <ListItemText primary="No low stock products" />
            </ListItem>
          ) : (
            lowStock.map((product, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={product.product_name}
                  secondary={`Stock: ${product.stock}${product.category ? ` | Category: ${product.category}` : ""}`}
                />
              </ListItem>
            ))
          )}
        </List>
      </Paper>
    </Box>
  );
};

export default Reports;
