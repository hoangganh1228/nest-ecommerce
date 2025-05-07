import slugify from 'slugify';
import { Category } from 'src/category/entities/category.entity';
import { text } from 'stream/consumers';
import {
  AfterUpdate,
  BeforeInsert,
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'numeric', precision: 6, scale: 2 })
  price: number;

  @Column({ type: 'numeric', precision: 6, scale: 2, nullable: true })
  offerPrice: number;

  @Column({ type: 'varchar', length: 255 })
  shortDescription: string;

  @Column({ type: 'text', nullable: true })
  longDescription: string;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'text' })
  slug: string;

  @ManyToOne(() => Category, (category) => category.products)
  category: Category;

  @DeleteDateColumn()
  deletedDate: Date;

  @BeforeInsert()
  @AfterUpdate()
  generateSlug() {
    const date = new Date();

    this.slug = `${slugify(this.name)}-${date.getTime()}`;
  }
}
