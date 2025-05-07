import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { CategoryService } from 'src/category/category.service';
import {
  FilterOperator,
  FilterSuffix,
  Paginate,
  PaginateQuery,
  paginate,
  Paginated,
} from 'nestjs-paginate';
@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private readonly categoryService: CategoryService,
  ) {}
  async create(createProductDto: CreateProductDto) {
    const category = await this.categoryService.findOne(
      createProductDto.categoryId,
    );
    const product = new Product();
    product.category = category;
    Object.assign(product, createProductDto);

    return this.productRepository.save(product);
  }

  // async findAll() {
  //   const products = await this.productRepository.find({
  //     relations: {
  //       category: true,
  //     },
  //   });

  //   return products;
  // }

  public findAll(query: PaginateQuery): Promise<Paginated<Product>> {
    return paginate(query, this.productRepository, {
      sortableColumns: ['id', 'name', 'price'],
      nullSort: 'last',
      defaultSortBy: [['price', 'DESC']],
      searchableColumns: ['name', 'shortDescription', 'longDescription'],    // (fuzzy search), kiểu như LIKE '%abc%'.
      // select: ['id', 'name', 'color', 'age', 'lastVetVisit'],
      filterableColumns: {
        name: [FilterOperator.EQ, FilterSuffix.NOT],
        shortDescription: [FilterOperator.EQ, FilterSuffix.NOT],
        longDescription: [FilterOperator.EQ, FilterSuffix.NOT],
      },
    });
  }

  async findOne(id: number) {
    const product = await this.productRepository.findOne({
      where: {
        id: id,
      },
      relations: {
        category: true,
      },
    });

    if (!product) {
      throw new NotFoundException(`Product ${id} not found`);
    }

    return product;
  }

  async findOneBySlug(slug: string) {
    const product = await this.productRepository.findOne({
      where: {
        slug: slug,
      },
      relations: {
        category: true,
      },
    });

    if (!product) {
      throw new NotFoundException(`Product ${slug} not found`);
    }

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.findOne(id);
    let category = product.category;

    if (updateProductDto.categoryId) {
      category = await this.categoryService.findOne(
        updateProductDto.categoryId,
      );
    }

    product.category = category;

    Object.assign(product, updateProductDto);
    return this.productRepository.save(product);
  }

  async remove(id: number) {
    const product = await this.productRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!product) throw new NotFoundException(`Product ${id} not found`);

    return await this.productRepository.softRemove(product);
  }
}
