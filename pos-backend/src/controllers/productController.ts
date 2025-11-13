import { Request, Response } from "express";
import { addProduct, getProducts, updateProduct, deleteProduct } from "../models/productModel";

// Add a new product
export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, price, purchase_price, selling_price, stock, category } = req.body;

    if (!name || price === undefined || selling_price === undefined) {
      return res.status(400).json({ message: "Name, selling price, and price are required" });
    }

    const newProduct = await addProduct(
      name,
      price,
      purchase_price || 0,
      selling_price,
      stock || 0,
      category
    );

    res.status(201).json({
      message: "Product added successfully",
      product: newProduct,
    });
  } catch (error: any) {
    console.error("Error creating product:", error.message);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

// Get all products
export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await getProducts();
    res.status(200).json({
      message: "Products fetched successfully",
      products,
    });
  } catch (error: any) {
    console.error("Error fetching products:", error.message);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

// Update a product
export const editProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, price, purchase_price, selling_price, stock, category } = req.body;

    if (!id || !name || price === undefined || selling_price === undefined) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const updated = await updateProduct(
      Number(id),
      name,
      price,
      purchase_price || 0,
      selling_price,
      stock || 0,
      category
    );

    if (!updated) return res.status(404).json({ message: "Product not found" });

    res.status(200).json({
      message: "Product updated successfully",
      product: updated,
    });
  } catch (error: any) {
    console.error("Error updating product:", error.message);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

// Delete product
export const removeProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deleted = await deleteProduct(Number(id));

    if (!deleted) return res.status(404).json({ message: "Product not found" });

    res.status(200).json({
      message: "Product deleted successfully",
      product: deleted,
    });
  } catch (error: any) {
    console.error("Error deleting product:", error.message);
    res.status(500).json({ message: error.message || "Server error" });
  }
};
