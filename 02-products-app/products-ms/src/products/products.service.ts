import {
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PrismaClient } from '../../generated/prisma';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(ProductsService.name);
  async onModuleInit() {
    await this.$connect();
    this.logger.log('Prisma Client connected');
  }
  create(createProductDto: CreateProductDto) {
    return this.product.create({
      data: createProductDto,
    });
  }

  async findAll(pagination: PaginationDto) {
    const { page, limit } = pagination;
    const total = await this.product.count();
    const lastPage = Math.ceil(total / limit);

    const products = await this.product.findMany({
      take: limit,
      skip: (page - 1) * limit,
    });

    return {
      data: products,
      meta: {
        total,
        page,
        limit,
        lastPage,
      },
    };
  }

  async findOne(id: number) {
    const product = await this.product.findUnique({
      where: { id },
    });

    if (!product) {
      this.logger.error(`Product with id ${id} not found`);
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    this.logger.log(`Product with id ${id} found successfully`);
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    await this.findOne(id);
    return this.product.update({
      where: { id },
      data: updateProductDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.product.delete({
      where: { id },
    });
  }
}
