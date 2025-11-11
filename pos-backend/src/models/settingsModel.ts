import pool from "../config/db";


export const initSettingsTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS settings (
      id SERIAL PRIMARY KEY,
      store_name VARCHAR(100) DEFAULT 'My Store',
      currency_code VARCHAR(10) DEFAULT 'PKR',
      currency_symbol VARCHAR(10) DEFAULT '₨',
      tax_rate NUMERIC(5, 2) DEFAULT 10,
      footer_message TEXT DEFAULT 'Thank you for your purchase!'
    );
  `;
  await pool.query(query);

  // Insert default settings only if table is empty
  const result = await pool.query("SELECT COUNT(*) FROM settings");
  if (parseInt(result.rows[0].count) === 0) {
    await pool.query(`
      INSERT INTO settings (store_name, currency_code, currency_symbol, tax_rate, footer_message)
      VALUES ('My Store', 'PKR', '₨', 10, 'Thank you for your purchase!');
    `);
    console.log("Default settings inserted");
  }

  console.log("Settings table ready");
};

//  Get settings (only one row)
export const getSettings = async () => {
  const result = await pool.query("SELECT * FROM settings LIMIT 1");
  return result.rows[0];
};

// Update settings
export const updateSettings = async (
  store_name: string,
  currency_code: string,
  currency_symbol: string,
  tax_rate: number,
  footer_message: string
) => {
  const query = `
    UPDATE settings
    SET store_name = $1, currency_code = $2, currency_symbol = $3, tax_rate = $4, footer_message = $5
    WHERE id = 1
    RETURNING *;
  `;
  const values = [store_name, currency_code, currency_symbol, tax_rate, footer_message];
  const result = await pool.query(query, values);
  return result.rows[0];
};
