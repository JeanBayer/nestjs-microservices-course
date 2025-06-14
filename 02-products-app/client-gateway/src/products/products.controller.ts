import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseArrayPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PRODUCT_SERVICE } from 'src/config/services';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(
    @Inject(PRODUCT_SERVICE) private readonly productsClient: ClientProxy,
  ) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsClient.send(
      { cmd: 'create_product' },
      createProductDto,
    );
  }

  @Get()
  findAll(@Query() pagination: PaginationDto) {
    return this.productsClient.send({ cmd: 'find_all_products' }, pagination);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsClient.send({ cmd: 'find_one_product' }, { id }).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsClient
      .send({ cmd: 'update_product' }, { id: +id, ...updateProductDto })
      .pipe(
        catchError((error) => {
          throw new RpcException(error);
        }),
      );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsClient.send({ cmd: 'remove_product' }, { id }).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );
  }

  @Get('/validate/ids')
  validate(@Query('ids', ParseArrayPipe) ids: string[]) {
    console.log(ids);
    return this.productsClient
      .send(
        { cmd: 'validate_products' },
        ids.map((el) => +el),
      )
      .pipe(
        catchError((error) => {
          throw new RpcException(error);
        }),
      );
  }
}
