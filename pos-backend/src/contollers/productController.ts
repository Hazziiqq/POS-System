import { Request, Response } from "express";
import { addProduct, getProducts } from "../models/productModel";

// controller 1: Add a new product
export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, price, stock, category } = req.body;

    // Validation 
    if (!name || !price) {
      return res.status(400).json({ message: "Name and price are required" });
    }

    // Call model function to add a new product
    const newProduct = await addProduct(name, price, stock, category);

    res.status(201).json({
      message: "Product added successfully",
      product: newProduct,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Server error" });
  }
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
