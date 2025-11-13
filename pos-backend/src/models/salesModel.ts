import pool from "../config/db";

// Initialize sales table
export const initSalesTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS sales (
      id SERIAL PRIMARY KEY,
      product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
      quantity INTEGER NOT NULL,
      total_price NUMERIC(10,2) NOT NULL,
      customer_id INTEGER REFERENCES customers(id) ON DELETE SET NULL,
      sale_date TIMESTAMP DEFAULT NOW()
    );
  `);
  console.log("Sales table ready");
};

// Add a sale (deduct stock safely)
export const addSale = async (
  productId: number,
  quantity: number,
  customerId?: number
) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Lock product row and fetch prices
    const productResult = await client.query(
      "SELECT stock, price AS selling_price, purchase_price FROM products WHERE id=$1 FOR UPDATE",
      [productId]
    );

    if (productResult.rows.length === 0) throw new Error("Product not found");

    const product = productResult.rows[0];
    const currentStock = product.stock;
    const sellingPrice = Number(product.selling_price);
    const purchasePrice = Number(product.purchase_price);

    if (currentStock < quantity) throw new Error("Not enough stock");

    // Deduct stock
    await client.query("UPDATE products SET stock=stock-$1 WHERE id=$2", [quantity, productId]);

    // Calculate total price and profit
    const totalPrice = sellingPrice * quantity;
    const profit = (sellingPrice - purchasePrice) * quantity;

    // Insert sale
    const saleResult = await client.query(
      `INSERT INTO sales (product_id, quantity, total_price, customer_id)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [productId, quantity, totalPrice, customerId ?? null]
    );

    await client.query("COMMIT");

    return {
      ...saleResult.rows[0],
      selling_price: sellingPrice,
      purchase_price: purchasePrice,
      profit,
    };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

// Get all sales
export const getSales = async () => {
  const result = await pool.query(`
    SELECT s.*, p.name AS product_name, c.name AS customer_name
    FROM sales s
    LEFT JOIN products p ON s.product_id=p.id
    LEFT JOIN customers c ON s.customer_id=c.id
    ORDER BY s.id DESC
  `);
  return result.rows;
};

