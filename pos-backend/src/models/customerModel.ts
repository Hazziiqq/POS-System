import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity("customers")
export class Customer {
  @PrimaryGeneratedColumn()
  id: number = 0;

  @Column({ type: "varchar", length: 100 })
  name: string = '';

  @Column({ type: "varchar", length: 100, nullable: true })
  email?: string;

  @Column({ type: "varchar", length: 20, nullable: true })
  phone?: string;

  @Column({ type: "text", nullable: true })
  address?: string;

  @CreateDateColumn()
  created_at: Date = new Date();
}
