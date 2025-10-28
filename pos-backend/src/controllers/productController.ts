import { Request, Response } from "express";
import { addProduct, getProducts, updateProduct, deleteProduct } from "../models/productModel";

// controller 1: Add a new product
export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, price, stock, category } = req.body;

    // Validation 
    if ( !name || !price) {
      return res.status(400).json({ message: "Name and price are required" });
    }

    // Call model function to add a new product
    const newProduct = await addProduct(name, price, stock, category);

    res.status(201).json({
      message: "Product added successfully",
      product: newProduct,
    });
   }
   catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: error+"this is error youre looking for"});
  }
  console.log("req body", req.body)
};

// controller 2:  Get all products
export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await getProducts();

    res.status(200).json({
      message: "Products fetched successfully",
      products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// controller 3:  update a product
export const editProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, price, stock, category } = req.body;

    if (!id || !name || !price) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const updated = await updateProduct(Number(id), name, price, stock, category);

    if (!updated) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product updated successfully",
      product: updated,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// controller 4:  delete a product

export const removeProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deleted = await deleteProduct(Number(id));

    if (!deleted) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product deleted successfully",
      product: deleted,
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Server error" });
  }
};