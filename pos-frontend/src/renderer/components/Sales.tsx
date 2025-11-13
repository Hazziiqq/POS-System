import React, { useEffect, useState } from "react";
import { Box, Typography, CircularProgress, Paper, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, } from "@mui/material";
import { fetchSale, addSale } from "../api/salesApi";
import { fetchProducts } from "../api/productApi";
import { fetchCustomers, addCustomer } from "../api/customersApi";

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
  customer_id?: number | null;
}

interface NewCustomer {
  name: string;
  phone: string;
  address: string;
}

const Sales: React.FC = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [addOpen, setAddOpen] = useState(false);
  const [newSale, setNewSale] = useState<NewSale>({
    product_id: 0,
    quantity: 1,
    customer_id: null,
  });

  const [useNewCustomer, setUseNewCustomer] = useState(false);
  const [newCustomer, setNewCustomer] = useState<NewCustomer>({
    name: "",
    phone: "",
    address: "",
  });

  // Load data
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
    setNewSale({ product_id: 0, quantity: 1, customer_id: null });
    setUseNewCustomer(false);
    setNewCustomer({ name: "", phone: "", address: "" });
  };

  const handleAddSave = async () => {
    try {
      if (!newSale.product_id || newSale.quantity <= 0) {
        alert("Please select a valid product and quantity.");
        return;
      }

      let customerId = newSale.customer_id;

      // If new customer info provided, create it first
      if (useNewCustomer) {
        if (!newCustomer.name || !newCustomer.phone) {
          alert("Please provide at least name and phone for the new customer.");
          return;
        }
        const createdCustomer = await addCustomer(newCustomer);
        customerId = createdCustomer.id;
      }

      const payload = {
        product_id: newSale.product_id,
        quantity: newSale.quantity,
        ...(customerId ? { customer_id: customerId } : {}),
      };

      const added = await addSale(payload);
      setSales([added.sale, ...sales]);
      handleAddClose();
    } catch (err: any) {
      console.error(err);
      alert("Failed to add sale: " + (err.message || ""));
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
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h5">Sales</Typography>
        <Button variant="contained" onClick={handleAddOpen}>
          Add Sale
        </Button>
      </Box>

      {/* Sales Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Product</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Total Price</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sales.map((sale) => (
              <TableRow key={sale.id}>
                <TableCell>{sale.id}</TableCell>
                <TableCell>{sale.product_name}</TableCell>
                <TableCell>{sale.quantity}</TableCell>
                <TableCell>₨{sale.total_price}</TableCell>
                <TableCell>{sale.customer_name || "N/A"}</TableCell>
                <TableCell>{new Date(sale.sale_date).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Sale Dialog */}
      <Dialog open={addOpen} onClose={handleAddClose}>
        <DialogTitle>Add Sale</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField
            select
            label="Product"
            value={newSale.product_id}
            onChange={(e) =>
              setNewSale((prev) => ({ ...prev, product_id: Number(e.target.value) }))
            }
            helperText="Select a product"
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
            type="number"
            label="Quantity"
            value={newSale.quantity}
            onChange={(e) =>
              setNewSale((prev) => ({ ...prev, quantity: Number(e.target.value) }))
            }
          />

          {/* Customer selection */}
          <TextField
            select
            label="Customer"
            value={newSale.customer_id ?? (useNewCustomer ? -1 : 0)}
            onChange={(e) => {
              const val = Number(e.target.value);
              if (val === -1) {
                setUseNewCustomer(true);
                setNewSale((prev) => ({ ...prev, customer_id: null }));
              } else {
                setUseNewCustomer(false);
                setNewSale((prev) => ({ ...prev, customer_id: val }));
              }
            }}
            helperText="Select existing customer or add new"
          >
            <MenuItem value={0}>-- No Customer --</MenuItem>
            {customers.map((c) => (
              <MenuItem key={c.id} value={c.id}>
                {c.name}
              </MenuItem>
            ))}
            <MenuItem value={-1}>+ Add New Customer</MenuItem>
          </TextField>

          {/* New customer fields */}
          {useNewCustomer && (
            <>
              <TextField
                label="Customer Name"
                value={newCustomer.name}
                onChange={(e) => setNewCustomer((prev) => ({ ...prev, name: e.target.value }))}
              />
              <TextField
                label="Phone Number"
                value={newCustomer.phone}
                onChange={(e) => setNewCustomer((prev) => ({ ...prev, phone: e.target.value }))}
              />
              <TextField
                label="Address"
                value={newCustomer.address}
                onChange={(e) => setNewCustomer((prev) => ({ ...prev, address: e.target.value }))}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddClose}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleAddSave}
            disabled={!newSale.product_id || newSale.quantity <= 0}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Sales;
