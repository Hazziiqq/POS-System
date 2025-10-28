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
  const client = await pool.connect(); // Get a DB client for the transaction

  try {
    await client.query("BEGIN");

    // Step 1: Check current stock
    const productResult = await client.query(
      "SELECT stock FROM products WHERE id = $1 FOR UPDATE",
      [productId]
    );

    if (productResult.rows.length === 0) {
      throw new Error("Product not found");
    }

    const currentStock = productResult.rows[0].stock;

    // Step 2: Ensure sufficient stock
    if (currentStock < quantity) {
      throw new Error("Not enough stock available");
    }

    // Step 3: Deduct the sold quantity from stock
    await client.query(
      "UPDATE products SET stock = stock - $1 WHERE id = $2",
      [quantity, productId]
    );

    // Step 4: Insert the sale
    const saleResult = await client.query(
      `INSERT INTO sales (product_id, quantity, total_price)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [productId, quantity, totalPrice]
    );

    await client.query("COMMIT");
    return saleResult.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
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


