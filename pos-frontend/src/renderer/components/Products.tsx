import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  TextField,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { fetchProducts, updateProduct, deleteProduct, addProduct } from "../api/productApi";

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  category: string;
  created_at: string;
}

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: 0,
    stock: 0,
    category: "",
  });

  // Fetch products
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Edit Handlers
  const handleEditOpen = (product: Product) => setEditProduct(product);
  const handleEditClose = () => setEditProduct(null);
  const handleEditSave = async () => {
    if (editProduct) {
      try {
        const updated = await updateProduct(editProduct.id, editProduct);
        setProducts(
          products.map((p) =>
            p.id === updated.product.id ? updated.product : p
          )
        );
        handleEditClose();
      } catch (err: any) {
        console.error(err);
        alert("Failed to update product");
      }
    }
  };

  // Delete Handler
  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(id);
        setProducts(products.filter((p) => p.id !== id));
      } catch (err: any) {
        console.error(err);
        alert("Failed to delete product");
      }
    }
  };

  // Add Product Handlers
  const handleAddOpen = () => setAddOpen(true);
  const handleAddClose = () => {
    setAddOpen(false);
    setNewProduct({ name: "", price: 0, stock: 0, category: "" });
  };

  const handleAddSave = async () => {
    try {
      const added = await addProduct(newProduct);
      setProducts([added.product, ...products]);
      handleAddClose();
    } catch (err: any) {
      console.error(err);
      alert("Failed to add product");
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
        <Typography variant="h5">Products</Typography>
        <Button variant="contained" onClick={handleAddOpen}>
          Add Product
        </Button>
      </Box>

      <TextField
        label="Search by name or category"
        variant="outlined"
        fullWidth
        sx={{ mb: 3 }}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {filteredProducts.map((product) => (
        <Paper
          key={product.id}
          sx={{
            p: 2,
            mb: 2,
            backgroundColor: product.stock <= 5 ? "#3B1E1E" : "#2A2A3B",
            color: "white",
            borderRadius: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
              {product.name}
            </Typography>
            <Typography variant="body2">Category: {product.category}</Typography>
            <Typography variant="body2">Price: ₨{product.price}</Typography>
            <Typography variant="body2">Stock: {product.stock}</Typography>
          </Box>

          <Box>
            <IconButton sx={{ color: "white" }} onClick={() => handleEditOpen(product)}>
              <EditIcon />
            </IconButton>
            <IconButton sx={{ color: "red" }} onClick={() => handleDelete(product.id)}>
              <DeleteIcon />
            </IconButton>
          </Box>
        </Paper>
      ))}

      {/* Edit Dialog */}
      <Dialog open={!!editProduct} onClose={handleEditClose}>
        <DialogTitle>Edit Product</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Name"
            value={editProduct?.name || ""}
            onChange={(e) => setEditProduct(prev => prev && { ...prev, name: e.target.value })}
          />
          <TextField
            label="Price"
            type="number"
            value={editProduct?.price || 0}
            onChange={(e) => setEditProduct(prev => prev && { ...prev, price: Number(e.target.value) })}
          />
          <TextField
            label="Stock"
            type="number"
            value={editProduct?.stock || 0}
            onChange={(e) => setEditProduct(prev => prev && { ...prev, stock: Number(e.target.value) })}
          />
          <TextField
            label="Category"
            value={editProduct?.category || ""}
            onChange={(e) => setEditProduct(prev => prev && { ...prev, category: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>Cancel</Button>
          <Button variant="contained" onClick={handleEditSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Dialog */}
      <Dialog open={addOpen} onClose={handleAddClose}>
        <DialogTitle>Add Product</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Name"
            value={newProduct.name}
            onChange={(e) => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
          />
          <TextField
            label="Price"
            type="number"
            value={newProduct.price}
            onChange={(e) => setNewProduct(prev => ({ ...prev, price: Number(e.target.value) }))}
          />
          <TextField
            label="Stock"
            type="number"
            value={newProduct.stock}
            onChange={(e) => setNewProduct(prev => ({ ...prev, stock: Number(e.target.value) }))}
          />
          <TextField
            label="Category"
            value={newProduct.category}
            onChange={(e) => setNewProduct(prev => ({ ...prev, category: e.target.value }))}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddClose}>Cancel</Button>
          <Button variant="contained" onClick={handleAddSave}>
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Products;
