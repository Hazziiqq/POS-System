import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, } from "@mui/material";
import { fetchProducts, addProduct, updateProduct, deleteProduct } from "../api/productApi";

interface Product {
  id: number;
  name: string;
  price: number; 
  purchase_price: number;
  selling_price: number;
  stock: number;
  category: string;
  created_at?: string;
}

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [newProduct, setNewProduct] = useState<Product>({
    id: 0,
    name: "",
    price: 0,
    purchase_price: 0,
    selling_price: 0,
    stock: 0,
    category: "",
  });
  const [editProductData, setEditProductData] = useState<Product | null>(null);

  // Fetch products
  const loadProducts = async () => {
    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch (error) {
      console.error("Error loading products:", error);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Auto-calc profit for Add
  useEffect(() => {
    setNewProduct((prev) => ({
      ...prev,
      price: prev.selling_price - prev.purchase_price,
    }));
  }, [newProduct.purchase_price, newProduct.selling_price]);

  // Auto-calc profit for Edit
  useEffect(() => {
    if (editProductData) {
      setEditProductData((prev) =>
        prev
          ? { ...prev, price: prev.selling_price - prev.purchase_price }
          : prev
      );
    }
  }, [editProductData?.purchase_price, editProductData?.selling_price]);

  // Add Product
  const handleAddOpen = () => setAddOpen(true);
  const handleAddClose = () => {
    setAddOpen(false);
    setNewProduct({
      id: 0,
      name: "",
      price: 0,
      purchase_price: 0,
      selling_price: 0,
      stock: 0,
      category: "",
    });
  };

  const handleAddSave = async () => {
    try {
      await addProduct(newProduct);
      handleAddClose();
      loadProducts();
    } catch (error) {
      console.error("Add product error:", error);
    }
  };

  // Edit Product
  const handleEditOpen = (product: Product) => {
    setEditProductData(product);
    setEditOpen(true);
  };
  const handleEditClose = () => setEditOpen(false);

  const handleEditSave = async () => {
    if (!editProductData) return;
    try {
      await updateProduct(editProductData.id, editProductData);
      handleEditClose();
      loadProducts();
    } catch (error) {
      console.error("Update product error:", error);
    }
  };

  // Delete Product
  const handleDelete = async (id: number) => {
    try {
      await deleteProduct(id);
      loadProducts();
    } catch (error) {
      console.error("Delete product error:", error);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Products
      </Typography>
      <Button variant="contained" onClick={handleAddOpen}>
        Add Product
      </Button>

      {/* Product Table */}
      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Purchase Price</TableCell>
              <TableCell>Selling Price</TableCell>
              <TableCell>Profit</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
              {products.map((p) => (
            <TableRow key={p.id}>
            <TableCell>{p.id}</TableCell>
            <TableCell>{p.name}</TableCell>
            <TableCell>{p.purchase_price}</TableCell>
            <TableCell>{p.selling_price}</TableCell>
            <TableCell>{p.price}</TableCell>
            <TableCell>{p.stock}</TableCell>
            <TableCell>{p.category}</TableCell>
            <TableCell>
            <Button sx={{ color: 'green' }} onClick={() => handleEditOpen(p)}>Edit</Button>
            <Button color="error" onClick={() => handleDelete(p.id)}>Delete</Button>
      </TableCell>
    </TableRow>
  ))}
</TableBody>

        </Table>
      </TableContainer>

      {/* Add Dialog */}
      <Dialog open={addOpen} onClose={handleAddClose}>
        <DialogTitle>Add Product</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Name"
            value={newProduct.name}
            onChange={(e) => setNewProduct((prev) => ({ ...prev, name: e.target.value }))}
          />
          <TextField
            label="Purchase Price"
            type="number"
            value={newProduct.purchase_price}
            onChange={(e) =>
              setNewProduct((prev) => ({ ...prev, purchase_price: Number(e.target.value) }))
            }
          />
          <TextField
            label="Selling Price"
            type="number"
            value={newProduct.selling_price}
            onChange={(e) =>
              setNewProduct((prev) => ({ ...prev, selling_price: Number(e.target.value) }))
            }
          />
          <TextField
            label="Profit"
            type="number"
            value={newProduct.price}
            InputProps={{ readOnly: true }}
          />
          <TextField
            label="Stock"
            type="number"
            value={newProduct.stock}
            onChange={(e) => setNewProduct((prev) => ({ ...prev, stock: Number(e.target.value) }))}
          />
          <TextField
            label="Category"
            value={newProduct.category}
            onChange={(e) => setNewProduct((prev) => ({ ...prev, category: e.target.value }))}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddClose}>Cancel</Button>
          <Button variant="contained" onClick={handleAddSave}>
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onClose={handleEditClose}>
        <DialogTitle>Edit Product</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {editProductData && (
            <>
              <TextField
                label="Name"
                value={editProductData.name}
                onChange={(e) =>
                  setEditProductData((prev) => (prev ? { ...prev, name: e.target.value } : prev))
                }
              />
              <TextField
                label="Purchase Price"
                type="number"
                value={editProductData.purchase_price}
                onChange={(e) =>
                  setEditProductData((prev) =>
                    prev ? { ...prev, purchase_price: Number(e.target.value) } : prev
                  )
                }
              />
              <TextField
                label="Selling Price"
                type="number"
                value={editProductData.selling_price}
                onChange={(e) =>
                  setEditProductData((prev) =>
                    prev ? { ...prev, selling_price: Number(e.target.value) } : prev
                  )
                }
              />
              <TextField
                label="Profit"
                type="number"
                value={editProductData.price}
                InputProps={{ readOnly: true }}
              />
              <TextField
                label="Stock"
                type="number"
                value={editProductData.stock}
                onChange={(e) =>
                  setEditProductData((prev) => (prev ? { ...prev, stock: Number(e.target.value) } : prev))
                }
              />
              <TextField
                label="Category"
                value={editProductData.category}
                onChange={(e) =>
                  setEditProductData((prev) => (prev ? { ...prev, category: e.target.value } : prev))
                }
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>Cancel</Button>
          <Button variant="contained" onClick={handleEditSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Products;
