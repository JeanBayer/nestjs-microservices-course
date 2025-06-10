/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  private products: Product[] = [];

  create(createProductDto: CreateProductDto) {
    const { name, price, description } = createProductDto;
    const id = uuidv4();
    const product = new Product(id, name, price, description);

    this.products.push(product);
    return product;
  }

  findAll() {
    return this.products;
  }

  findOne(id: string) {
    const product = this.products.find((product) => product.id === id);
    if (!product)
      throw new NotFoundException(`Product with id ${id} not found`);

    return product;
  }

  update(id: string, updateProductDto: UpdateProductDto) {
    const { id: _, ...updateData } = updateProductDto;
    const product = this.findOne(id);
    product.productWith(updateData);
    return product;
  }

  remove(id: string) {
    const newProducts = this.products.filter((product) => product.id !== id);
    if (newProducts.length === this.products.length)
      throw new NotFoundException(`Product with id ${id} not found`);
    this.products = newProducts;
    return `This action removes a #${id} product`;
  }
}
