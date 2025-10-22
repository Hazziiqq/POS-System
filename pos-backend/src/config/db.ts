import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,       // admin
  host: process.env.DB_HOST,       // localhost
  database: process.env.DB_NAME,   // posdb
  password: process.env.DB_PASSWORD, // admin123
  port: Number(process.env.DB_PORT), // 5432
});

pool.connect()
  .then(() => console.log("✅ Connected to PostgreSQL"))
  .catch((err) => console.error("❌ Database connection error:", err));

export default pool;
