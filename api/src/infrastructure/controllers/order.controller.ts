import { Controller, Get, Param, Res, HttpStatus, HttpCode, Logger, NotFoundException } from '@nestjs/common';
import { Response } from 'express';
import { OrderService } from '../../application/order.service';
import { OrderDto } from '../../shared/dto/order.dto';
import { KafkaConsumerService } from '../kafka/kafka.consumer';
import { OrderEvent } from '../../domain/order.events';

@Controller('orders')
export class OrderController {
  private readonly logger = new Logger(OrderController.name);

  constructor(
    private readonly orderService: OrderService,
    private readonly kafkaConsumer: KafkaConsumerService,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getOrders(): Promise<OrderDto[]> {
    this.logger.debug('GET /orders - Fetching all orders');
    const orders = await this.orderService.getOrders();
    return orders;
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getOrderById(@Param('id') id: string): Promise<OrderDto> {
    this.logger.debug(`GET /orders/${id} - Fetching order by ID`);
    const order = await this.orderService.getOrderById(id);
    
    if (!order) {
      this.logger.warn(`Order not found: ${id}`);
      throw new NotFoundException(`Order with id ${id} not found`);
    }
    
    return order;
  }

  @Get('stream')
  async streamOrders(@Res() res: Response): Promise<void> {
    this.logger.debug('GET /orders/stream - Starting SSE stream');
    
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    res.flushHeaders();

    const clientId = Date.now().toString();
    this.logger.log(`SSE client connected: ${clientId}`);

    const handleEvent = (event: OrderEvent) => {
      const data = this.formatSseEvent(event);
      res.write(`data: ${JSON.stringify(data)}\n\n`);
      this.logger.debug(`Sent SSE event: ${event.eventType} for order ${event.orderId}`);
    };

    this.kafkaConsumer.onMessage(handleEvent);

    res.on('close', () => {
      this.kafkaConsumer.removeHandler(handleEvent);
      this.logger.log(`SSE client disconnected: ${clientId}`);
    });

    const initialOrders = await this.orderService.getOrders();
    res.write(`data: ${JSON.stringify({ type: 'initial', orders: initialOrders })}\n\n`);
  }

  private formatSseEvent(event: OrderEvent): object {
    return {
      type: 'event',
      eventType: event.eventType,
      eventId: event.eventId,
      orderId: event.orderId,
      timestamp: event.timestamp instanceof Date ? event.timestamp.toISOString() : event.timestamp,
      payload: event.payload,
    };
  }
}