import "reflect-metadata";
import express from "express";
import cors from "cors";

import productRoute from "./routes/productRoute";
import salesRoute from "./routes/salesRoute";
import reportRoute from "./routes/reportRoute";
import customerRoute from "./routes/customerRoute";
import purchaseRoute from "./routes/purchaseRoute";
import settingsRoute from "./routes/settingsRoute";

import { AppDataSource } from "./config/data-source";

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized.");

    const app = express();

    app.use(
      cors({
        origin: "http://localhost:1212",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type"],
      })
    );

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Routes
    app.use("/api/products", productRoute);
    app.use("/api/sales", salesRoute);
    app.use("/api/reports", reportRoute);
    app.use("/api/customers", customerRoute);
    app.use("/api/purchases", purchaseRoute);
    app.use("/api/settings", settingsRoute);

    // Test
    app.get("/", (_req, res) => {
      res.send("Server is running with TypeORM");
    });

    const PORT = 5000;
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  });
