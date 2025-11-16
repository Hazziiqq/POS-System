import { AppDataSource } from "../config/data-source";
import { Sale } from "./salesModel";
import { Product } from "./productModel";

const saleRepo = AppDataSource.getRepository(Sale);
const productRepo = AppDataSource.getRepository(Product);

// Daily Sales Report
export const getDailyReport = async () => {
  return await saleRepo
    .createQueryBuilder("s")
    .select("DATE(s.sale_date)", "date")
    .addSelect("SUM(s.quantity)", "total_items_sold")
    .addSelect("SUM(s.total_price)", "total_revenue")
    .where("DATE(s.sale_date) = CURRENT_DATE")
    .groupBy("DATE(s.sale_date)")
    .getRawMany();
};

// Weekly Sales Report
export const getWeeklyReport = async () => {
  return await saleRepo
    .createQueryBuilder("s")
    .select("DATE_TRUNC('week', s.sale_date)", "week_start")
    .addSelect("SUM(s.quantity)", "total_items_sold")
    .addSelect("SUM(s.total_price)", "total_revenue")
    .where("s.sale_date >= NOW() - INTERVAL '7 days'")
    .groupBy("DATE_TRUNC('week', s.sale_date)")
    .orderBy("week_start", "DESC")
    .getRawMany();
};

// Monthly Sales Report
export const getMonthlyReport = async () => {
  return await saleRepo
    .createQueryBuilder("s")
    .select("DATE_TRUNC('month', s.sale_date)", "month")
    .addSelect("SUM(s.quantity)", "total_items_sold")
    .addSelect("SUM(s.total_price)", "total_revenue")
    .where("s.sale_date >= DATE_TRUNC('month', CURRENT_DATE)")
    .groupBy("DATE_TRUNC('month', s.sale_date)")
    .orderBy("month", "DESC")
    .getRawMany();
};

// Top Selling Products
export const getTopProducts = async () => {
  return await saleRepo
    .createQueryBuilder("s")
    .leftJoin(Product, "p", "s.product_id = p.id")
    .select("p.name", "product_name")
    .addSelect("SUM(s.quantity)", "total_sold")
    .addSelect("SUM(s.total_price)", "total_revenue")
    .groupBy("p.name")
    .orderBy("total_sold", "DESC")
    .limit(5)
    .getRawMany();
};

// Low Stock Products
export const getLowStockProducts = async () => {
  return await productRepo
    .createQueryBuilder("p")
    .select(["p.id", "p.name", "p.stock", "p.category"])
    .where("p.stock <= :limit", { limit: 5 })
    .orderBy("p.stock", "ASC")
    .getMany();
};

// Total Sales
export const getTotalSales = async () => {
  const result = await saleRepo
    .createQueryBuilder("s")
    .select("SUM(s.quantity)", "total_items_sold")
    .addSelect("SUM(s.total_price)", "total_revenue")
    .getRawOne();

  return {
    totalSales: Number(result.total_items_sold) || 0,
    totalRevenue: Number(result.total_revenue) || 0,
  };
};
