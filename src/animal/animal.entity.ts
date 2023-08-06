import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { User } from '../user/user.entity';

@Entity()
export class Animal {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'varchar', nullable: false })
  class: string;

  @Column({ type: 'boolean', default: true })
  type: boolean;

  @Column({ type: 'int', nullable: true })
  age: number;

  @ManyToOne(() => User, (entity) => entity.animals)
  user: User;
}
