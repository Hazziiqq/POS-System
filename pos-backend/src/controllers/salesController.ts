import { Request, Response } from "express";
import { Sale } from "../models/salesModel";
import { Product } from "../models/productModel";
import { AppDataSource } from "../config/data-source";

// Add new sale
export const createSale = async (req: Request, res: Response) => {
  const { product_id, quantity, customer_id } = req.body;

  if (!product_id || !quantity || quantity <= 0) {
    return res.status(400).json({ message: "Invalid product or quantity" });
  }

  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const productRepo = queryRunner.manager.getRepository(Product);
    const saleRepo = queryRunner.manager.getRepository(Sale);

    const product = await productRepo.findOne({ where: { id: product_id } });
    if (!product) throw new Error("Product not found");

    if (product.stock < quantity) throw new Error("Not enough stock");

    // Deduct stock
    product.stock -= quantity;
    await productRepo.save(product);

    const totalPrice = Number(product.selling_price) * quantity;
    const sale = saleRepo.create({
      product_id,
      quantity,
      total_price: totalPrice,
      customer_id,
    });
    await saleRepo.save(sale);

    await queryRunner.commitTransaction();
    res.status(201).json({ message: "Sale recorded successfully", sale });
  } catch (err: any) {
    await queryRunner.rollbackTransaction();
    console.error("Error creating sale:", err.message);
    res.status(500).json({ message: err.message || "Internal server error" });
  } finally {
    await queryRunner.release();
  }
};

// Get all sales
export const getAllSales = async (req: Request, res: Response) => {
  try {
    const sales = await Sale.find({
      relations: ["product", "customer"],
      order: { id: "DESC" },
    });
    res.status(200).json({ message: "Sales fetched successfully", sales });
  } catch (err) {
    console.error("Error fetching sales:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

