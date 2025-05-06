import { Expose, Type } from 'class-transformer';
import { Category } from '../entities/category.entity';

export class ResposeCategoryDto {
  @Expose()
  id: string;
  @Expose()
  name: string;
  @Expose()
  description: string;
  @Expose()
  slug: string;

  @Expose()
  @Type(() => ResposeCategoryDto)
  children: Category[];
}
