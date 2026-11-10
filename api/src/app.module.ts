import { Module, Logger } from '@nestjs/common';
import { OrderController } from './infrastructure/controllers/order.controller';
import { OrderService } from './application/order.service';
import { KafkaConsumerService } from './infrastructure/kafka/kafka.consumer';
import { KafkaModule } from './infrastructure/kafka/kafka.module';

@Module({
  imports: [KafkaModule],
  controllers: [OrderController],
  providers: [
    OrderService,
    KafkaConsumerService,
    {
      provide: 'LOGGER',
      useValue: new Logger('AppModule'),
    },
  ],
})
export class AppModule {
  constructor() {
    const logger = new Logger('AppModule');
    logger.log('Módulo de aplicación inicializado');
    logger.log('Componentes registrados: OrderController, OrderService, KafkaConsumerService');
  }
}