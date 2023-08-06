import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany, JoinColumn, JoinTable
} from "typeorm";
import { User } from '../user/user.entity';
import { CarClassEnum } from './enum/car-class.enum';

@Entity()
export class Car {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  brand: string;

  @Column({ type: 'varchar', nullable: false })
  model: string;

  @Column({ type: 'integer', nullable: true })
  age: number;

  @Column({ enum: CarClassEnum })
  class: CarClassEnum;

  @ManyToMany(() => User, (entity) => entity.cars)
  @JoinTable()
  users: User[];
}
