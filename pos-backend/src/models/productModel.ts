import pool from "../config/db";

// Initialize Products table
export const initProductTable = async () => {
  // Base table creation
  const createQuery = `
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      price NUMERIC(10, 2) NOT NULL,
      stock INTEGER DEFAULT 0,
      category VARCHAR(50),
      created_at TIMESTAMP DEFAULT NOW()
    );
  `;
  await pool.query(createQuery);

  // Add purchase_price column if missing
  const alterPurchasePrice = `
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name='products' AND column_name='purchase_price'
      ) THEN
        ALTER TABLE products ADD COLUMN purchase_price NUMERIC(10,2) DEFAULT 0;
      END IF;
    END
    $$;
  `;
  await pool.query(alterPurchasePrice);

  // Add selling_price column if missing
  const alterSellingPrice = `
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name='products' AND column_name='selling_price'
      ) THEN
        ALTER TABLE products ADD COLUMN selling_price NUMERIC(10,2) DEFAULT 0;
      END IF;
    END
    $$;
  `;
  await pool.query(alterSellingPrice);

  console.log("Products table ready");
};

// Add new product
export const addProduct = async (
  name: string,
  price: number,
  purchasePrice: number,
  sellingPrice: number,
  stock: number,
  category: string
) => {
  const query = `
    INSERT INTO products (name, price, purchase_price, selling_price, stock, category)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
  `;
  const result = await pool.query(query, [name, price, purchasePrice, sellingPrice, stock, category]);
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
  purchasePrice: number,
  sellingPrice: number,
  stock: number,
  category: string
) => {
  const query = `
    UPDATE products 
    SET name=$1, price=$2, purchase_price=$3, selling_price=$4, stock=$5, category=$6
    WHERE id=$7
    RETURNING *;
  `;
  const result = await pool.query(query, [name, price, purchasePrice, sellingPrice, stock, category, id]);
  return result.rows[0];
};

// Delete product
export const deleteProduct = async (id: number) => {
  const query = `DELETE FROM products WHERE id = $1 RETURNING *;`;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};
