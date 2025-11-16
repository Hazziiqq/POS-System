import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Customer } from "../models/customerModel";

const customerRepo = AppDataSource.getRepository(Customer);

// Create new customer
export const createCustomer = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, address } = req.body;
    if (!name) return res.status(400).json({ message: "Customer name is required" });

    const customer = customerRepo.create({ name, email, phone, address });
    await customerRepo.save(customer);

    res.status(201).json({ message: "Customer added successfully", customer });
  } catch (error) {
    console.error("Error creating customer:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all customers
export const getAllCustomers = async (_req: Request, res: Response) => {
  try {
    const customers = await customerRepo.find();
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

    const customer = await customerRepo.findOneBy({ id: Number(id) });
    if (!customer) return res.status(404).json({ message: "Customer not found" });

    customer.name = name;
    customer.email = email;
    customer.phone = phone;
    customer.address = address;

    await customerRepo.save(customer);
    res.status(200).json({ message: "Customer updated successfully", customer });
  } catch (error) {
    console.error("Error updating customer:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a customer
export const removeCustomer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const customer = await customerRepo.findOneBy({ id: Number(id) });
    if (!customer) return res.status(404).json({ message: "Customer not found" });

    await customerRepo.remove(customer);
    res.status(200).json({ message: "Customer deleted successfully", customer });
  } catch (error) {
    console.error("Error deleting customer:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
