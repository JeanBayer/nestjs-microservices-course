/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { plainToInstance } from 'class-transformer';
import { PrismaClient } from 'generated/prisma';
import { firstValueFrom } from 'rxjs';
import { OrderPaginationDto } from 'src/common/dto/order-pagination.dto';
import { PRODUCT_SERVICE } from 'src/config/services';
import { ChangeOrderStatusDto } from './dto/change-order-status.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { ProductDto, ProductItemDto } from './dto/product.dto';

@Injectable()
export class OrdersService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(OrdersService.name);
  constructor(
    @Inject(PRODUCT_SERVICE) private readonly productsClient: ClientProxy,
  ) {
    super();
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Prisma Client connected');
  }

  async create(createOrderDto: CreateOrderDto) {
    const createOrder = plainToInstance(CreateOrderDto, createOrderDto);
    const productIds = createOrder.items.map((el) => el.productId);
    const productItems: ProductItemDto[] = await firstValueFrom(
      this.productsClient.send({ cmd: 'validate_products' }, productIds),
    );

    const products = plainToInstance(ProductDto, {
      items: productItems,
    });

    createOrder.updatePriceItem(products);
    const totalAmount = createOrder.getTotalAmount();
    const totalItems = createOrder.getTotalQuantity();

    const items = createOrder.items.map((item) => ({
      price: item.price,
      productId: item.productId,
      quantity: item.quantity,
    }));

    const order = await this.order.create({
      data: {
        totalAmount,
        totalItems,
        orderItem: {
          createMany: {
            data: items,
          },
        },
      },
      include: {
        orderItem: {
          select: {
            price: true,
            quantity: true,
            productId: true,
          },
        },
      },
    });

    return {
      ...order,
      orderItem: order?.orderItem?.map((item) => {
        return {
          ...item,
          name: products.getProductById(item?.productId)?.name || '',
        };
      }),
    };
  }

  async findAll(orderPagination: OrderPaginationDto) {
    const { limit, page, status } = orderPagination;
    const totalPages = await this.order.count({
      where: {
        status,
      },
    });

    const orders = await this.order.findMany({
      where: {
        status,
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: orders,
      meta: {
        total: totalPages,
        page,
        lastPage: Math.ceil(totalPages / limit),
      },
    };
  }

  async findOne(id: string) {
    const order = await this.order.findUnique({
      where: { id },
    });

    if (!order) {
      this.logger.error(`Order with id ${id} not found`);
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `Order with id ${id} not found`,
      });
    }

    this.logger.log(`Order with id ${id} found successfully`);
    return order;
  }

  async changeOrderStatus(changeOrderStatus: ChangeOrderStatusDto) {
    const { id, status } = changeOrderStatus;

    const order = await this.findOne(id);

    if (order.status === status) {
      return order;
    }

    return this.order.update({
      where: { id },
      data: { status },
    });
  }
}
