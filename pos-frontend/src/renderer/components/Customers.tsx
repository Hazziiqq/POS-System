import React, { useEffect, useState } from "react";
import { Box, Typography, CircularProgress, Paper, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions,
} from "@mui/material";
import { fetchCustomers, addCustomer, Customer } from "../api/customersApi";

const Customers: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  // Load customers
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchCustomers();
        setCustomers(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch customers");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleAddOpen = () => setAddOpen(true);
  const handleAddClose = () => {
    setAddOpen(false);
    setNewCustomer({ name: "", email: "", phone: "", address: "" });
  };

  const handleAddSave = async () => {
    if (!newCustomer.name.trim()) {
      alert("Name is required");
      return;
    }

    try {
      const added = await addCustomer(newCustomer);
      setCustomers([added.customer, ...customers]);
      handleAddClose();
    } catch (err) {
      console.error(err);
      alert("Failed to add customer");
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
        <Typography variant="h5">Customers</Typography>
        <Button variant="contained" onClick={handleAddOpen}>
          Add Customer
        </Button>
      </Box>

      {customers.map((cust) => (
        <Paper
          key={cust.id}
          sx={{
            p: 2,
            mb: 2,
            backgroundColor: "#2A2A3B",
            color: "white",
            borderRadius: 2,
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
            {cust.name}
          </Typography>
          {cust.email && <Typography>Email: {cust.email}</Typography>}
          {cust.phone && <Typography>Phone: {cust.phone}</Typography>}
          {cust.address && <Typography>Address: {cust.address}</Typography>}
        </Paper>
      ))}

      {/* Add Customer Dialog */}
      <Dialog open={addOpen} onClose={handleAddClose}>
        <DialogTitle>Add Customer</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Name"
            value={newCustomer.name}
            onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
            required
          />
          <TextField
            label="Email"
            value={newCustomer.email}
            onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
          />
          <TextField
            label="Phone"
            value={newCustomer.phone}
            onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
          />
          <TextField
            label="Address"
            value={newCustomer.address}
            onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddClose}>Cancel</Button>
          <Button variant="contained" onClick={handleAddSave} disabled={!newCustomer.name.trim()}>
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Customers;
