import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  BaseEntity,
} from "typeorm";
import { Product } from "./productModel";
import { Customer } from "./customerModel";

@Entity("sales")
export class Sale extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number = 0;

  @ManyToOne(() => Product)
  @JoinColumn({ name: "product_id" })
  product!: Product;

  @Column()
  product_id: number  = 0;

  @Column({ type: "int", default: 1 })
  quantity: number  = 0;

  @Column({ type: "numeric", precision: 10, scale: 2 })
  total_price: number  = 0 ;

  @ManyToOne(() => Customer, { nullable: true })
  @JoinColumn({ name: "customer_id" })
  customer?: Customer;

  @Column({ nullable: true })
  customer_id?: number;

  @CreateDateColumn()
  sale_date: Date = new Date() ;
}
