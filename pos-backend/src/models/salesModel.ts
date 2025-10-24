import pool from "../config/db";

// Create sales table 
export const initSalesTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS sales (
      id SERIAL PRIMARY KEY,
      product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
      quantity INTEGER NOT NULL,
      total_price NUMERIC(10, 2) NOT NULL,
      sale_date TIMESTAMP DEFAULT NOW()
    );
  `;
  await pool.query(query);
  console.log("Sales table ready");
};

// Add new sale
export const addSale = async (productId: number, quantity: number, totalPrice: number) => {
  const query = `
    INSERT INTO sales (product_id, quantity, total_price)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  const result = await pool.query(query, [productId, quantity, totalPrice]);
  return result.rows[0];
};

// Get all sales
export const getSales = async () => {
  const result = await pool.query(`
    SELECT s.*, p.name AS product_name
    FROM sales s
    JOIN products p ON s.product_id = p.id
    ORDER BY s.id ASC;
  `);
  return result.rows;
};
