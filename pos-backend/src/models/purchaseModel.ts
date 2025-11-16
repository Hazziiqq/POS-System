import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from "typeorm";
import { Product } from "./productModel";

@Entity("purchases")
export class Purchase {
  @PrimaryGeneratedColumn()
  id: number = 0;

  @ManyToOne(() => Product)
  @JoinColumn({ name: "product_id" })
  product!: Product;

  @Column({ type: "integer" })
  quantity: number = 0;

  @Column({ type: "numeric", precision: 10, scale: 2 })
  cost_price: number = 0;

  @Column({ type: "numeric", precision: 12, scale: 2 })
  total_cost: number = 0;

  @CreateDateColumn({ type: "timestamp", name: "purchase_date" })
  purchase_date: Date = new Date();
}
