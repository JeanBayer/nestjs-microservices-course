import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ORDER_SERVICE } from 'src/config/services';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(
    @Inject(ORDER_SERVICE) private readonly ordersClient: ClientProxy,
  ) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersClient.send('createOrder', createOrderDto);
  }

  @Get()
  findAll() {
    return this.ordersClient.send('findAllOrders', {});
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersClient.send('findOneOrder', { id: +id });
  }

  @Post(':id')
  changeOrderStatus() {
    return this.ordersClient.send('changeOrderStatus', {});
  }
}
