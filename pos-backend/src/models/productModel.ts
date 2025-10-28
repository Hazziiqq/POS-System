import pool from "../config/db";

// Create products table 
export const initProductTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      price NUMERIC(10, 2) NOT NULL,
      stock INTEGER DEFAULT 0,
      category VARCHAR(50),
      created_at TIMESTAMP DEFAULT NOW()
    );
  `;
  await pool.query(query);
  console.log("Products table ready");
};

// Add new product
export const addProduct = async (name: string, price: number, stock: number, category: string) => {
  const query = `
    INSERT INTO products (name, price, stock, category)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
  const result = await pool.query(query, [name, price, stock, category]);
  return result.rows[0];
};

// Get all products
export const getProducts = async () => {
  const result = await pool.query("SELECT * FROM products ORDER BY id ASC");
  return result.rows;
};

// Update product 
export const updateProduct = async (
  id: number,
  name: string,
  price: number,
  stock: number,
  category: string
) => {
  const query = `
    UPDATE products 
    SET name = $1, price = $2, stock = $3, category = $4
    WHERE id = $5
    RETURNING *;
  `;
  const result = await pool.query(query, [name, price, stock, category, id]);
  return result.rows[0];
};

// Delete product
export const deleteProduct = async (id: number) => {
  const query = `DELETE FROM products WHERE id = $1 RETURNING *;`;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

