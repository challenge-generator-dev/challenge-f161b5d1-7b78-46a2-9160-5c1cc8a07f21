import { Module, Global } from '@nestjs/common';
import { KafkaConfigService } from './kafka.config';
import { KafkaConsumerService } from './kafka.consumer';

@Global()
@Module({
  providers: [KafkaConfigService, KafkaConsumerService],
  exports: [KafkaConfigService, KafkaConsumerService],
})
export class KafkaModule {}