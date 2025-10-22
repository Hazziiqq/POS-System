import express from "express";
import pool from "./config/db"; 

const app = express();


app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.send(`Server is running. DB time: ${result.rows[0].now}`);
  } catch (err) {
    console.error("❌ Database query error:", err);
    res.status(500).send("Database error");
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
