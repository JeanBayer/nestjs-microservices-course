import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PRODUCT_SERVICE } from 'src/config/services';

@Controller('products')
export class ProductsController {
  constructor(
    @Inject(PRODUCT_SERVICE) private readonly productsClient: ClientProxy,
  ) {}

  @Get()
  getAllProducts() {
    return this.productsClient.send({ cmd: 'find_all_products' }, {});
  }
}
