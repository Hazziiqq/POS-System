import { Request, Response } from "express";
import { Product } from "../models/productModel";
import { AppDataSource } from "../config/data-source";

// Get repository
const productRepo = AppDataSource.getRepository(Product);

// Add a new product
export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, price, purchase_price, selling_price, stock, category } = req.body;

    if (!name || price === undefined || selling_price === undefined) {
      return res.status(400).json({ message: "Name, selling price, and price are required" });
    }

    const newProduct = productRepo.create({
      name,
      price,
      purchase_price: purchase_price || 0,
      selling_price,
      stock: stock || 0,
      category,
    });

    const savedProduct = await productRepo.save(newProduct);

    res.status(201).json({
      message: "Product added successfully",
      product: savedProduct,
    });
  } catch (error: any) {
    console.error("Error creating product:", error.message);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

// Get all products
export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await productRepo.find({ order: { id: "ASC" } });
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

    const existingProduct = await productRepo.findOneBy({ id: Number(id) });
    if (!existingProduct) return res.status(404).json({ message: "Product not found" });

    existingProduct.name = name;
    existingProduct.price = price;
    existingProduct.purchase_price = purchase_price || 0;
    existingProduct.selling_price = selling_price;
    existingProduct.stock = stock || 0;
    existingProduct.category = category;

    const updatedProduct = await productRepo.save(existingProduct);

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
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

    const productToDelete = await productRepo.findOneBy({ id: Number(id) });
    if (!productToDelete) return res.status(404).json({ message: "Product not found" });

    await productRepo.remove(productToDelete);

    res.status(200).json({
      message: "Product deleted successfully",
      product: productToDelete,
    });
  } catch (error: any) {
    console.error("Error deleting product:", error.message);
    res.status(500).json({ message: error.message || "Server error" });
  }
};
