import pool from "../config/db";

// Create customers table
export const initCustomerTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS customers (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100),
      phone VARCHAR(20),
      address TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `;
  await pool.query(query);
  console.log("Customers table ready");
};

// Add a new customer
export const addCustomer = async (
  name: string,
  email: string,
  phone: string,
  address: string
) => {
  const result = await pool.query(
    `INSERT INTO customers (name, email, phone, address)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [name, email, phone, address]
  );
  return result.rows[0];
};

// Get all customers
export const getCustomers = async () => {
  const result = await pool.query(`SELECT * FROM customers ORDER BY id ASC`);
  return result.rows;
};

// Update a customer
export const updateCustomer = async (
  id: number,
  name: string,
  email: string,
  phone: string,
  address: string
) => {
  const result = await pool.query(
    `UPDATE customers 
     SET name = $1, email = $2, phone = $3, address = $4
     WHERE id = $5
     RETURNING *`,
    [name, email, phone, address, id]
  );
  return result.rows[0];
};

// Delete a customer
export const deleteCustomer = async (id: number) => {
  const result = await pool.query(
    `DELETE FROM customers WHERE id = $1 RETURNING *`,
    [id]
  );
  return result.rows[0];
};
