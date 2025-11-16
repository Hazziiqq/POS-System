import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("settings")
export class Settings {
  @PrimaryGeneratedColumn()
  id: number = 0;

  @Column({ length: 100, default: "My Store" })
  store_name: string = ' ';

  @Column({ length: 10, default: "PKR" })
  currency_code: string = '';

  @Column({ length: 10, default: "₨" })
  currency_symbol: string = '';

  @Column({ type: "numeric", precision: 5, scale: 2, default: 10 })
  tax_rate: number = 0;

  @Column({ type: "text", default: "Thank you for your purchase!" })
  footer_message: string = ' ';
}
