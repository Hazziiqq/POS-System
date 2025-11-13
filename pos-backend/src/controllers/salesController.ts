import { Request, Response } from "express";
import { addSale, getSales } from "../models/salesModel";

// Add new sale
export const createSale = async (req: Request, res: Response) => {
  try {
    const { product_id, quantity, customer_id } = req.body;

    // Validation
    if (product_id === undefined || quantity === undefined) {
      return res.status(400).json({ message: "Product ID and quantity are required" });
    }

    if (typeof product_id !== "number" || typeof quantity !== "number") {
      return res.status(400).json({ message: "Product ID and quantity must be numbers" });
    }

    if (!Number.isInteger(quantity) || quantity <= 0) {
      return res.status(400).json({ message: "Quantity must be a positive integer" });
    }

    // Add sale (deduct stock inside model)
    const sale = await addSale(product_id, quantity, customer_id);

    res.status(201).json({
      message: "Sale recorded successfully",
      sale, // contains selling_price, purchase_price, profit
    });
  } catch (error: any) {
    console.error("Error creating sale:", error.message);
    res.status(500).json({ message: error.message || "Internal server error" });
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

