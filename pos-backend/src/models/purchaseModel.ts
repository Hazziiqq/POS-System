import pool from "../config/db";

// Create Purchase Table
export const initPurchaseTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS purchases (
      id SERIAL PRIMARY KEY,
      product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
      quantity INTEGER NOT NULL,
      cost_price NUMERIC(10,2) NOT NULL,
      total_cost NUMERIC(12,2) NOT NULL,
      purchase_date TIMESTAMP DEFAULT NOW()
    );
  `;
  await pool.query(query);
  console.log("Purchase table ready");
};

// Add new purchase
export const addPurchase = async ( 
  productId: number,
  quantity: number,
  costPrice: number
) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const totalCost = quantity * costPrice;

    // Step 1: Insert purchase record
    const purchaseResult = await client.query(
      `INSERT INTO purchases (product_id, quantity, cost_price, total_cost)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [productId, quantity, costPrice, totalCost]
    );

    // Step 2: Update stock in products table
    await client.query(
      `UPDATE products SET stock = stock + $1, cost_price = $2 WHERE id = $3`,
      [quantity, costPrice, productId]
    );

    await client.query("COMMIT");
    return purchaseResult.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

// Get all purchases
export const getPurchases = async () => {
  const result = await pool.query(`
    SELECT p.*, pr.name AS product_name
    FROM purchases p
    JOIN products pr ON p.product_id = pr.id
    ORDER BY p.id DESC;
  `);
  return result.rows;
};
