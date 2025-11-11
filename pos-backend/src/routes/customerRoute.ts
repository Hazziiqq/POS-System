import express from "express";
import {
  createCustomer,
  getAllCustomers,
  editCustomer,
  removeCustomer,
} from "../controllers/customerController";

const router = express.Router();

// Add new customer
router.post("/", createCustomer);

// Get all customers
router.get("/", getAllCustomers);

// Update a customer
router.put("/:id", editCustomer);

// Delete a customer
router.delete("/:id", removeCustomer);

export default router;
