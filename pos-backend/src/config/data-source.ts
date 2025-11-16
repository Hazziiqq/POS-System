import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { Product } from "../models/productModel";
import { Customer } from "../models/customerModel";
import { Sale } from "../models/salesModel";
import { Purchase } from "../models/purchaseModel";
import { Settings } from "../models/settingsModel";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [Product, Customer, Sale, Purchase, Settings],
  synchronize: true,    
  logging: false,
  migrations: [],
  subscribers: [],
});

AppDataSource.initialize()
  .then(() => console.log("TypeORM Data Source initialized"))
  .catch((err) => console.error("Error initializing TypeORM Data Source:", err));

