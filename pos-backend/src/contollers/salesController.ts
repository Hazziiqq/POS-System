import { Request, Response } from "express";
import pool from "../config/db";
import { addSale, getSales } from "../models/salesModel";

// Add new sale (and reduce stock)
export const createSale = async (req: Request, res: Response) => {
  try {
    const { product_id, quantity } = req.body;

    if (!product_id || !quantity) {
      return res.status(400).json({ message: "Product ID and quantity are required" });
    }

    // Check product existence and stock
    const productResult = await pool.query("SELECT * FROM products WHERE id = $1", [product_id]);
    const product = productResult.rows[0];

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ message: "Insufficient stock" });
    }

    // Calculate total price
    const totalPrice = Number(product.price) * quantity;

    // Add sale record
    const sale = await addSale(product_id, quantity, totalPrice);

    // Update stock
    await pool.query("UPDATE products SET stock = stock - $1 WHERE id = $2", [quantity, product_id]);

    res.status(201).json({ message: "Sale recorded successfully", sale });
  } catch (error) {
    console.error("Error creating sale:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all sales
export const getAllSales = async (req: Request, res: Response) => {
  try {
    const sales = await getSales();
    res.status(200).json(sales);
  } catch (error) {
    console.error("Error fetching sales:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
