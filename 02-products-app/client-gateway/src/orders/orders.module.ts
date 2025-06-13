import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { envs } from 'src/config/envs';
import { ORDER_SERVICE } from 'src/config/services';
import { OrdersController } from './orders.controller';

@Module({
  controllers: [OrdersController],
  providers: [],
  imports: [
    ClientsModule.register([
      {
        name: ORDER_SERVICE,
        transport: Transport.TCP,
        options: {
          host: envs.ORDERS_MS_HOST,
          port: envs.ORDERS_MS_PORT,
        },
      },
    ]),
  ],
})
export class OrdersModule {}
