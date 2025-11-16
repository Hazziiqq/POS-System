import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Purchase } from "../models/purchaseModel";
import { Product } from "../models/productModel";

// Create a new purchase
export const createPurchase = async (req: Request, res: Response) => {
  try {
    const { product_id, quantity, cost_price } = req.body;

    if (!product_id || !quantity || !cost_price) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const purchaseRepo = AppDataSource.getRepository(Purchase);
    const productRepo = AppDataSource.getRepository(Product);

    const product = await productRepo.findOneBy({ id: product_id });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const totalCost = Number(quantity) * Number(cost_price);

    // Update product stock & cost price
    product.stock += Number(quantity);
    product.cost_price = Number(cost_price);
    await productRepo.save(product);

    // Save purchase entry
    const purchase = purchaseRepo.create({
      product,
      quantity,
      cost_price,
      total_cost: totalCost,
    });

    await purchaseRepo.save(purchase);

    return res.status(201).json({
      message: "Purchase added successfully",
      purchase,
    });
  } catch (error: any) {
    console.error("Purchase error:", error);
    return res.status(500).json({ message: error.message });
  }
};

// Get all purchases
export const getAllPurchases = async (req: Request, res: Response) => {
  try {
    const purchaseRepo = AppDataSource.getRepository(Purchase);

    const purchases = await purchaseRepo.find({
      relations: ["product"],
      order: { id: "DESC" },
    });

    return res.status(200).json({
      message: "Purchases fetched successfully",
      purchases,
    });
  } catch (error) {
    console.error("Fetch purchase error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
