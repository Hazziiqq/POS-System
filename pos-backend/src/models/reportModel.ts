import pool from "../config/db";

// daily Sales Report
export const getDailyReport = async () => {
  const result = await pool.query(`
    SELECT 
      DATE(sale_date) AS date,
      SUM(quantity) AS total_items_sold,
      SUM(total_price) AS total_revenue
    FROM sales
    WHERE DATE(sale_date) = CURRENT_DATE
    GROUP BY DATE(sale_date);
  `);
  return result.rows;
};

// Weekly Sales Report
export const getWeeklyReport = async () => {
  const result = await pool.query(`
    SELECT 
      DATE_TRUNC('week', sale_date) AS week_start,
      SUM(quantity) AS total_items_sold,
      SUM(total_price) AS total_revenue
    FROM sales
    WHERE sale_date >= NOW() - INTERVAL '7 days'
    GROUP BY DATE_TRUNC('week', sale_date)
    ORDER BY week_start DESC;
  `);
  return result.rows;
};

// monthly Sales Report
export const getMonthlyReport = async () => {
  const result = await pool.query(`
    SELECT 
      DATE_TRUNC('month', sale_date) AS month,
      SUM(quantity) AS total_items_sold,
      SUM(total_price) AS total_revenue
    FROM sales
    WHERE sale_date >= DATE_TRUNC('month', CURRENT_DATE)
    GROUP BY DATE_TRUNC('month', sale_date)
    ORDER BY month DESC;
  `);
  return result.rows;
};

// top selling Products
export const getTopProducts = async () => {
  const result = await pool.query(`
    SELECT 
      p.name AS product_name,
      SUM(s.quantity) AS total_sold,
      SUM(s.total_price) AS total_revenue
    FROM sales s
    JOIN products p ON s.product_id = p.id
    GROUP BY p.name
    ORDER BY total_sold DESC
    LIMIT 5;
  `);
  return result.rows;
};

// Low Stock Products
export const getLowStockProducts = async () => {
  const result = await pool.query(`
    SELECT 
      id, name, stock, category
    FROM products
    WHERE stock <= 5
    ORDER BY stock ASC;
  `);
  return result.rows;
};
