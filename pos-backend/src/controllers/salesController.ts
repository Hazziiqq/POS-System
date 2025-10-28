import { Request, Response } from "express";
import pool from "../config/db";
import { addSale, getSales } from "../models/salesModel";

// Add new sale
export const createSale = async (req: Request, res: Response) => {
  try {
    const { product_id, quantity } = req.body;

    // Input validation
    if (product_id === undefined || quantity === undefined) {
      return res.status(400).json({ message: "Product ID and quantity are required" });
    }

    if (typeof product_id !== "number" || typeof quantity !== "number") {
      return res.status(400).json({ message: "Product ID and quantity must be numbers" });
    }

    if (!Number.isInteger(quantity) || quantity <= 0) {
      return res.status(400).json({ message: "Quantity must be a positive integer" });
    }

    //Fetch product details
    const productResult = await pool.query("SELECT * FROM products WHERE id = $1", [product_id]);
    const product = productResult.rows[0];

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check available stock before sale
    if (product.stock < quantity) {
      return res.status(400).json({ message: "Not enough stock available" });
    }

    // 💰 Calculate total price
    const totalPrice = Number(product.price) * quantity;

    // Perform sale (handles stock deduction & insertion)
    const sale = await addSale(product_id, quantity, totalPrice);

    res.status(201).json({
      message: "Sale recorded successfully and stock updated.",
      sale,
    });
  } catch (error: any) {
    console.error("Error creating sale:", error.message);
    res.status(500).json({
      message: error.message || "Internal server error",
    });
  }
};

// Get all sales
export const getAllSales = async (req: Request, res: Response) => {
  try {
    const sales = await getSales();
    res.status(200).json({
      message: "Sales fetched successfully",
      sales,
    });
  } catch (error) {
    console.error("Error fetching sales:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
