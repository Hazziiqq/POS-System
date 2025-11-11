import React, { useEffect, useState } from "react";
import { Box, Typography, CircularProgress, Paper, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem,
} from "@mui/material";
import { fetchSale, addSale } from "../api/salesApi";
import { fetchProducts } from "../api/productApi";
import { fetchCustomers } from "../api/customersApi";

interface Sale {
  id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  total_price: number;
  sale_date: string;
  customer_name?: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
}

interface Customer {
  id: number;
  name: string;
}

interface NewSale {
  product_id: number;
  quantity: number;
  customer_id?: number;
}

const Sales = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [newSale, setNewSale] = useState<NewSale>({
    product_id: 0,
    quantity: 1,
    customer_id: undefined,
  });

  // Load sales, products, and customers
  useEffect(() => {
    const loadData = async () => {
      try {
        const [salesData, productsData, customersData] = await Promise.all([
          fetchSale(),
          fetchProducts(),
          fetchCustomers(),
        ]);
        setSales(salesData);
        setProducts(productsData);
        setCustomers(customersData);
      } catch (err: any) {
        setError(err.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Dialog handlers
  const handleAddOpen = () => setAddOpen(true);
  const handleAddClose = () => {
    setAddOpen(false);
    setNewSale({ product_id: 0, quantity: 1, customer_id: undefined });
  };

  const handleAddSave = async () => {
    try {
      if (!newSale.product_id || newSale.quantity <= 0) {
        alert("Please select a valid product and quantity.");
        return;
      }

      const added = await addSale(newSale);
      setSales([added.sale, ...sales]);
      handleAddClose();
    } catch (err: any) {
      console.error(err);
      alert("Failed to add sale");
    }
  };

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
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h5">Sales</Typography>
        <Button variant="contained" onClick={handleAddOpen}>
          Add Sale
        </Button>
      </Box>

      {sales.map((sale) => (
        <Paper
          key={sale.id}
          sx={{
            p: 2,
            mb: 2,
            backgroundColor: "#2A2A3B",
            color: "white",
            borderRadius: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
              {sale.product_name}
            </Typography>
            <Typography variant="body2">Quantity: {sale.quantity}</Typography>
            <Typography variant="body2">Total: ₨{sale.total_price}</Typography>
            <Typography variant="body2">
              Customer: {sale.customer_name || "N/A"}
            </Typography>
            <Typography variant="body2">
              Date: {new Date(sale.sale_date).toLocaleDateString()}
            </Typography>
          </Box>
        </Paper>
      ))}

      {/* Add Sale Dialog */}
      <Dialog open={addOpen} onClose={handleAddClose}>
        <DialogTitle>Add Sale</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            select
            label="Product"
            value={newSale.product_id}
            onChange={(e) =>
              setNewSale((prev) => ({ ...prev, product_id: Number(e.target.value) }))
            }
            helperText="Select a product for this sale"
          >
            <MenuItem value={0} disabled>
              -- Select a product --
            </MenuItem>
            {products.map((p) => (
              <MenuItem key={p.id} value={p.id} disabled={p.stock === 0}>
                {p.name} (₨{p.price}) {p.stock === 0 ? "- Out of stock" : ""}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Customer"
            value={newSale.customer_id || 0}
            onChange={(e) =>
              setNewSale((prev) => ({
                ...prev,
                customer_id: Number(e.target.value) || undefined,
              }))
            }
            helperText="Select a customer (optional)"
          >
            <MenuItem value={0}>-- No Customer --</MenuItem>
            {customers.map((c) => (
              <MenuItem key={c.id} value={c.id}>
                {c.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Quantity"
            type="number"
            value={newSale.quantity}
            onChange={(e) =>
              setNewSale((prev) => ({ ...prev, quantity: Number(e.target.value) }))
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddClose}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleAddSave}
            disabled={newSale.product_id === 0 || newSale.quantity <= 0}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Sales;
