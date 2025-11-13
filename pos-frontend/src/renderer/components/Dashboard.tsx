import React, { useEffect, useState } from "react";
import { Typography, Box, AppBar, Toolbar, Paper, CircularProgress } from "@mui/material";
import { fetchProducts } from "../api/productApi";
import { fetchSale } from "../api/salesApi";
import { fetchTotalSales } from "../api/ReportApi";
import { fetchCustomers } from "../api/customersApi";

interface Product {
  id: number;
  name: string;
  stock: number;
}

interface Sale {
  id: number;
  product_name: string;
  quantity: number;
  total_price: number;
  sale_date: string;
  customer_id?: number;
  customer_name?: string;
}

interface Customer {
  id: number;
  name: string;
}

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [totalSalesToday, setTotalSalesToday] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [transactionsToday, setTransactionsToday] = useState(0);
  const [lowStockItems, setLowStockItems] = useState(0);
  const [recentSales, setRecentSales] = useState<Sale[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [products, sales, totalSalesData, customers] = await Promise.all([
          fetchProducts(),
          fetchSale(),
          fetchTotalSales(),
          fetchCustomers(),
        ]);

        // Map customer names to sales
        const salesWithNames: Sale[] = sales.map((sale: Sale) => {
          const customer = customers.find((c: Customer) => c.id === sale.customer_id);
          return { ...sale, customer_name: customer ? customer.name : "N/A" };
        });

        setRecentSales(salesWithNames);

        // Products info
        setTotalProducts(products.length);
        setLowStockItems(products.filter((p: Product) => p.stock <= 5).length);

        // Sales info for today
        const today = new Date().toDateString();
        const todaySales = salesWithNames.filter(
          (s: Sale) => new Date(s.sale_date).toDateString() === today
        );
        setTransactionsToday(todaySales.length);
        const todayRevenue = todaySales.reduce((sum, s) => sum + s.total_price, 0);
        setTotalSalesToday(todayRevenue);

        // Recent 5 sales
        const sortedSales = salesWithNames.sort(
          (a, b) => new Date(b.sale_date).getTime() - new Date(a.sale_date).getTime()
        );
        setRecentSales(sortedSales.slice(0, 5));
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
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
    <Box
      component="main"
      sx={{ flexGrow: 1, p: 3, backgroundColor: "background.default", color: "text.primary" }}
    >
      <AppBar
        position="static"
        sx={{ backgroundColor: "#2A2A3B", color: "white", mb: 3, borderRadius: 2 }}
      >
        <Toolbar>
          <Typography variant="h6">Dashboard</Typography>
        </Toolbar>
      </AppBar>

      {/* Summary Cards */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
          gap: 2,
          mb: 3,
        }}
      >
        {[
          { title: "Total Sales Today", value: `₨${totalSalesToday}` },
          { title: "Total Products", value: totalProducts },
          { title: "Transactions Today", value: transactionsToday },
          { title: "Low Stock Items", value: lowStockItems },
        ].map((item) => (
          <Paper
            key={item.title}
            sx={{ p: 2, borderRadius: 2, textAlign: "center", backgroundColor: "#2A2A3B" }}
          >
            <Typography variant="subtitle1" sx={{ color: "gray" }}>
              {item.title}
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: "bold", mt: 1, color: "white" }}>
              {item.value}
            </Typography>
          </Paper>
        ))}
      </Box>

      {/* Recent Sales Table */}
      <Paper sx={{ p: 2, borderRadius: 2, backgroundColor: "#2A2A3B", mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Recent Sales
        </Typography>
        <table style={{ width: "100%", color: "white", borderSpacing: "0 8px" }}>
          <thead style={{ color: "gray" }}>
            <tr>
              <th align="left">Product</th>
              <th align="left">Quantity</th>
              <th align="left">Total</th>
              <th align="left">Customer</th>
              <th align="left">Date</th>
            </tr>
          </thead>
          <tbody>
            {recentSales.map((sale) => (
              <tr key={sale.id}>
                <td>{sale.product_name}</td>
                <td>{sale.quantity}</td>
                <td>₨{sale.total_price}</td>
                <td>{sale.customer_name || "N/A"}</td>
                <td>{new Date(sale.sale_date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Paper>

      {/* Chart Placeholder */}
      <Paper
        sx={{
          p: 2,
          borderRadius: 2,
          backgroundColor: "#2A2A3B",
          height: 250,
          textAlign: "center",
        }}
      >
        <Typography variant="h6" sx={{ mb: 1 }}>
          Sales Trend (Chart Placeholder)
        </Typography>
        <Typography variant="body2" color="gray">
          Chart will appear here later
        </Typography>
      </Paper>
    </Box>
  );
};

export default Dashboard;
