import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { Kafka, Consumer, EachMessagePayload } from 'kafkajs';
import { OrderEventType, OrderEvent } from '../../domain/order.events';
import { OrderService } from '../../application/order.service';

@Injectable()
export class KafkaConsumerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(KafkaConsumerService.name);
  private kafka: Kafka;
  private consumer: Consumer;
  private readonly subscribedEvents = new Set<string>();
  private messageHandlers: Array<(event: OrderEvent) => void> = [];
  private connected = false;

  constructor(private readonly orderService: OrderService) {
    this.kafka = new Kafka({
      clientId: 'order-streaming-api',
      brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
      retry: {
        initialRetryTime: 100,
        retries: 8,
      },
    });

    this.consumer = this.kafka.consumer({
      groupId: 'order-consumer-group',
      sessionTimeout: 30000,
      heartbeatInterval: 3000,
    });
  }

  async onModuleInit() {
    await this.connect();
    await this.subscribeToTopics();
    await this.startConsuming();
  }

  async onModuleDestroy() {
    await this.disconnect();
  }

  private async connect() {
    try {
      await this.consumer.connect();
      this.connected = true;
      this.logger.log('Kafka consumer connected successfully');
    } catch (error) {
      this.logger.error('Failed to connect Kafka consumer', error);
      throw error;
    }
  }

  private async subscribeToTopics() {
    const topics = [
      process.env.KAFKA_ORDER_TOPIC || 'orders-topic',
    ];

    for (const topic of topics) {
      await this.consumer.subscribe({ topic, fromBeginning: false });
      this.logger.log(`Subscribed to topic: ${topic}`);
    }
  }

  private async startConsuming() {
    await this.consumer.run({
      eachMessage: async (payload: EachMessagePayload) => {
        await this.handleMessage(payload);
      },
    });

    this.logger.log('Kafka consumer started processing messages');
  }

  private async handleMessage(payload: EachMessagePayload) {
    const { topic, partition, message } = payload;
    const messageValue = message.value?.toString();

    if (!messageValue) {
      this.logger.warn('Received empty message');
      return;
    }

    try {
      const event: OrderEvent = JSON.parse(messageValue);
      this.logger.debug(`Received event: ${event.eventType} for order ${event.orderId}`);

      await this.processEvent(event);
      this.notifyHandlers(event);
    } catch (error) {
      this.logger.error(`Error processing message from ${topic}[${partition}]`, error);
    }
  }

  private async processEvent(event: OrderEvent) {
    switch (event.eventType) {
      case OrderEventType.ORDER_CREATED:
        await this.handleOrderCreated(event);
        break;
      case OrderEventType.ORDER_UPDATED:
        await this.handleOrderUpdated(event);
        break;
      case OrderEventType.ORDER_CANCELLED:
        await this.handleOrderCancelled(event);
        break;
      default:
        this.logger.warn(`Unknown event type: ${event.eventType}`);
    }
  }

  private async handleOrderCreated(event: OrderEvent) {
    this.logger.log(`Processing ORDER_CREATED for order ${event.orderId}`);
    await this.orderService.processOrderEvent(event);
  }

  private async handleOrderUpdated(event: OrderEvent) {
    this.logger.log(`Processing ORDER_UPDATED for order ${event.orderId}`);
    await this.orderService.processOrderEvent(event);
  }

  private async handleOrderCancelled(event: OrderEvent) {
    this.logger.log(`Processing ORDER_CANCELLED for order ${event.orderId}`);
    await this.orderService.processOrderEvent(event);
  }

  private notifyHandlers(event: OrderEvent) {
    for (const handler of this.messageHandlers) {
      try {
        handler(event);
      } catch (error) {
        this.logger.error('Error in message handler', error);
      }
    }
  }

  onMessage(handler: (event: OrderEvent) => void) {
    this.messageHandlers.push(handler);
    this.logger.debug(`Registered new message handler. Total handlers: ${this.messageHandlers.length}`);
  }

  removeHandler(handler: (event: OrderEvent) => void) {
    const index = this.messageHandlers.indexOf(handler);
    if (index > -1) {
      this.messageHandlers.splice(index, 1);
      this.logger.debug(`Removed message handler. Total handlers: ${this.messageHandlers.length}`);
    }
  }

  getSubscribedEvents(): string[] {
    return Array.from(this.subscribedEvents);
  }

  isConnected(): boolean {
    return this.connected;
  }

  private async disconnect() {
    try {
      await this.consumer.disconnect();
      this.connected = false;
      this.logger.log('Kafka consumer disconnected');
    } catch (error) {
      this.logger.error('Error disconnecting Kafka consumer', error);
    }
  }
}