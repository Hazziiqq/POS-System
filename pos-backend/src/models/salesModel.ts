import pool from "../config/db";

// Initialize Sales table and ensure customer_id exists
export const initSalesTable = async () => {
  // create base table (old columns). if table already exists this will do nothing.
  await pool.query(`
    CREATE TABLE IF NOT EXISTS sales (
      id SERIAL PRIMARY KEY,
      product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
      quantity INTEGER NOT NULL,
      total_price NUMERIC(10, 2) NOT NULL,
      sale_date TIMESTAMP DEFAULT NOW()
    );
  `);

  // Add customer_id column if missing (safe, no-op if already present)
  await pool.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'sales' AND column_name = 'customer_id'
      ) THEN
        ALTER TABLE sales
        ADD COLUMN customer_id INTEGER REFERENCES customers(id) ON DELETE SET NULL;
      END IF;
    END
    $$;
  `);

  console.log("Sales table ready");
};

// Add a new sale (safe stock deduction + optional customer_id)
export const addSale = async (
  productId: number,
  quantity: number,
  totalPrice: number,
  customerId?: number
) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const productResult = await client.query(
      "SELECT stock FROM products WHERE id = $1 FOR UPDATE",
      [productId]
    );

    if (productResult.rows.length === 0) {
      throw new Error("Product not found");
    }

    const currentStock = productResult.rows[0].stock;
    if (currentStock < quantity) {
      throw new Error("Not enough stock available");
    }

    await client.query(
      "UPDATE products SET stock = stock - $1 WHERE id = $2",
      [quantity, productId]
    );

    const saleResult = await client.query(
      `INSERT INTO sales (product_id, quantity, total_price, customer_id)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [productId, quantity, totalPrice, customerId ?? null]
    );

    await client.query("COMMIT");
    return saleResult.rows[0];
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

// Get all sales with product & customer names
export const getSales = async () => {
  const result = await pool.query(`
    SELECT 
      s.id,
      s.quantity,
      s.total_price,
      s.sale_date,
      p.name AS product_name,
      c.name AS customer_name
    FROM sales s
    LEFT JOIN products p ON s.product_id = p.id
    LEFT JOIN customers c ON s.customer_id = c.id
    ORDER BY s.id DESC;
  `);
  return result.rows;
};

export const getSalesByCustomer = async (customerId: number) => {
  const result = await pool.query(
    `SELECT * FROM sales WHERE customer_id = $1 ORDER BY id DESC`,
    [customerId]
  );
  return result.rows;
};

export const deleteSale = async (id: number) => {
  const result = await pool.query(
    `DELETE FROM sales WHERE id = $1 RETURNING *`,
    [id]
  );
  return result.rows[0];
};
