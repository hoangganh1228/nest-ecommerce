import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  @Length(0, 100)
  name: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNumber()
  @IsOptional()
  offerPrice: number;

  @IsNotEmpty()
  @IsString()
  shortDescription: string;

  @IsNotEmpty()
  @IsString()
  longDescription: string;

  @IsInt()
  quantity: number;

  // @IsString()
  // @IsInt()
  // slug: string;

  @IsInt()
  categoryId: number;
}
