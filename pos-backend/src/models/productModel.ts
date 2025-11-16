import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity("products") // keep table name same
export class Product {
  @PrimaryGeneratedColumn()
  id: number = 0;

  @Column({ type: "varchar", length: 100 })
  name: string = '';

  @Column({ type: "numeric", precision: 10, scale: 2 })
  price: number = 0;

  @Column({ type: "numeric", precision: 10, scale: 2, default: 0 })
  purchase_price: number = 0;

  @Column({ type: "numeric", precision: 10, scale: 2, default: 0 })
  selling_price: number = 0;

  @Column({ type: "int", default: 0 })
  stock: number = 0;

  @Column({ type: "numeric", precision: 10, scale: 2, default: 0 })
  cost_price: number = 0;

  @Column({ type: "varchar", length: 50, nullable: true })
  category: string = ' ';

  @CreateDateColumn({ type: "timestamp", name: "created_at" })
  created_at: Date = new Date();;

  @UpdateDateColumn({ type: "timestamp", name: "updated_at" })
  updated_at: Date = new Date();;
}

// helper functions

import { AppDataSource } from "../config/data-source";
export const productRepository = AppDataSource.getRepository(Product);
