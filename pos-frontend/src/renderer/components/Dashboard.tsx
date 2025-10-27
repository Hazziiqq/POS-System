import React from "react";
import { Typography, Box, AppBar , Toolbar , Paper } from "@mui/material";

const Dashboard = () => {
  return (
   
<Box
  component="main"
  sx={{
    flexGrow: 1,
    p: 3,
    backgroundColor: "background.default",
    color: "text.primary",
  }}
>
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
      { title: "Total Sales Today", value: "₨12,430" },
      { title: "Total Products", value: "128" },
      { title: "Transactions", value: "57" },
      { title: "Low Stock Items", value: "8" },
    ].map((item) => (
      <Paper
        key={item.title}
        sx={{
          p: 2,
          borderRadius: 2,
          textAlign: "center",
          backgroundColor: "#2A2A3B",
        }}
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
          <th align="left">Invoice</th>
          <th align="left">Customer</th>
          <th align="left">Amount</th>
          <th align="left">Date</th>
        </tr>
      </thead>
      <tbody>
        {[
          { id: "INV001", name: "Ali Khan", amount: "₨1,250", date: "Oct 16, 2025" },
          { id: "INV002", name: "Sara Ahmed", amount: "₨980", date: "Oct 16, 2025" },
          { id: "INV003", name: "Bilal Shah", amount: "₨2,340", date: "Oct 15, 2025" },
        ].map((sale) => (
          <tr key={sale.id}>
            <td>{sale.id}</td>
            <td>{sale.name}</td>
            <td>{sale.amount}</td>
            <td>{sale.date}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </Paper>

  {/* Sales Trend Chart Placeholder */}
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
