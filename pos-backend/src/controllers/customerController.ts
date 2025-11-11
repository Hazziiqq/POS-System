import { Request, Response } from "express";
import { addCustomer, getCustomers, updateCustomer, deleteCustomer } from "../models/customerModel";

// Create new customer
export const createCustomer = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, address } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Customer name is required" });
    }

    const newCustomer = await addCustomer(name, email, phone, address);
    res.status(201).json({ message: "Customer added successfully", customer: newCustomer });
  } catch (error) {
    console.error("Error creating customer:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all customers
export const getAllCustomers = async (req: Request, res: Response) => {
  try {
    const customers = await getCustomers();
    res.status(200).json({ message: "Customers fetched successfully", customers });
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update a customer
export const editCustomer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, phone, address } = req.body;

    const updated = await updateCustomer(Number(id), name, email, phone, address);
    if (!updated) return res.status(404).json({ message: "Customer not found" });

    res.status(200).json({ message: "Customer updated successfully", customer: updated });
  } catch (error) {
    console.error("Error updating customer:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a customer
export const removeCustomer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await deleteCustomer(Number(id));
    if (!deleted) return res.status(404).json({ message: "Customer not found" });

    res.status(200).json({ message: "Customer deleted successfully", customer: deleted });
  } catch (error) {
    console.error("Error deleting customer:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
