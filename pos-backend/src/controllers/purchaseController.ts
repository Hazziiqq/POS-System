import { Request, Response } from "express";
import { addPurchase, getPurchases } from "../models/purchaseModel";

// Add new purchase
export const createPurchase = async (req: Request, res: Response) => {
  try {
    const { product_id, quantity, cost_price } = req.body;

    if (!product_id || !quantity || !cost_price) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const purchase = await addPurchase(product_id, quantity, cost_price);
    res.status(201).json({ message: "Purchase added successfully", purchase });
  } catch (error: any) {
    console.error("Error creating purchase:", error.message);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

// Get all purchases
export const getAllPurchases = async (req: Request, res: Response) => {
  try {
    const purchases = await getPurchases();
    res.status(200).json({ message: "Purchases fetched successfully", purchases });
  } catch (error) {
    console.error("Error fetching purchases:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
