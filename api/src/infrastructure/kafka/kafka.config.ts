import { Injectable } from '@nestjs/common';
import { Kafka, KafkaConfig, ConsumerConfig, SASLMechanism } from 'kafkajs';

const getEnv = (key: string, defaultValue?: string): string => {
    const value = process.env[key];
    if (!value && !defaultValue) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
    return value || defaultValue!;
};

export interface KafkaConsumerProperties {
    client: {
        clientId: string;
        brokers: string[];
        ssl?: boolean;
        sasl?: {
            mechanism: 'plain' | 'scram-sha-256' | 'scram-sha-512';
            username: string;
            password: string;
        };
        retry?: {
            initialRetryTime: number;
            retries: number;
        };
    };
    consumer: {
        groupId: string;
        sessionTimeout?: number;
        heartbeatInterval?: number;
        rebalanceTimeout?: number;
        maxWaitTimeInMs?: number;
        maxBytes?: number;
        maxBytesPerPartition?: number;
        minBytes?: number;
        maxWaitTime?: number;
        maxRetry?: number;
    };
    topics: {
        orders: string;
        ordersDlq: string;
    };
    run: {
        autoCommit: boolean;
        autoCommitIntervalMs?: number;
        autoOffsetReset: 'earliest' | 'latest';
        partitionAssigners?: any[];
        sessionTimeout?: number;
        heartbeatInterval?: number;
    };
}

export const kafkaConfig: KafkaConsumerProperties = {
    client: {
        clientId: getEnv('KAFKA_CLIENT_ID', 'order-streaming-api'),
        brokers: getEnv('KAFKA_BROKERS', 'localhost:9092').split(',').map(b => b.trim()),
        ssl: getEnv('KAFKA_SSL', 'false').toLowerCase() === 'true',
        sasl: getEnv('KAFKA_SASL_ENABLED', 'false').toLowerCase() === 'true' ? {
            mechanism: getEnv('KAFKA_SASL_MECHANISM', 'plain') as 'plain' | 'scram-sha-256' | 'scram-sha-512',
            username: getEnv('KAFKA_SASL_USERNAME'),
            password: getEnv('KAFKA_SASL_PASSWORD'),
        } : undefined,
        retry: {
            initialRetryTime: 3000,
            retries: 8,
        },
    },
    consumer: {
        groupId: getEnv('KAFKA_CONSUMER_GROUP_ID', 'order-streaming-api-group'),
        sessionTimeout: parseInt(getEnv('KAFKA_SESSION_TIMEOUT', '30000'), 10),
        heartbeatInterval: parseInt(getEnv('KAFKA_HEARTBEAT_INTERVAL', '3000'), 10),
        rebalanceTimeout: parseInt(getEnv('KAFKA_REBALANCE_TIMEOUT', '60000'), 10),
        maxWaitTimeInMs: parseInt(getEnv('KAFKA_MAX_WAIT_TIME', '5000'), 10),
        maxBytes: parseInt(getEnv('KAFKA_MAX_BYTES', '1048576'), 10),
        maxBytesPerPartition: parseInt(getEnv('KAFKA_MAX_BYTES_PER_PARTITION', '1048576'), 10),
        minBytes: parseInt(getEnv('KAFKA_MIN_BYTES', '1'), 10),
    },
    topics: {
        orders: getEnv('KAFKA_TOPIC_ORDERS', 'orders'),
        ordersDlq: getEnv('KAFKA_TOPIC_ORDERS_DLQ', 'orders.dlq'),
    },
    run: {
        autoCommit: getEnv('KAFKA_AUTO_COMMIT', 'false').toLowerCase() === 'true',
        autoCommitIntervalMs: parseInt(getEnv('KAFKA_AUTO_COMMIT_INTERVAL', '5000'), 10),
        autoOffsetReset: getEnv('KAFKA_AUTO_OFFSET_RESET', 'earliest') as 'earliest' | 'latest',
    },
};

export const createKafkaConfig = (): KafkaConfig => {
    const config: KafkaConfig = {
        clientId: kafkaConfig.client.clientId,
        brokers: kafkaConfig.client.brokers,
        ssl: kafkaConfig.client.ssl,
        retry: kafkaConfig.client.retry,
    };

    if (kafkaConfig.client.sasl) {
        const mechanism: SASLMechanism = kafkaConfig.client.sasl.mechanism as SASLMechanism;
        config.sasl = {
            mechanism,
            username: kafkaConfig.client.sasl.username,
            password: kafkaConfig.client.sasl.password,
        };
    }

    return config;
};

export const createConsumerConfig = (): ConsumerConfig => {
    return {
        groupId: kafkaConfig.consumer.groupId,
        sessionTimeout: kafkaConfig.consumer.sessionTimeout,
        heartbeatInterval: kafkaConfig.consumer.heartbeatInterval,
        rebalanceTimeout: kafkaConfig.consumer.rebalanceTimeout,
        maxWaitTimeInMs: kafkaConfig.consumer.maxWaitTimeInMs,
        maxBytes: kafkaConfig.consumer.maxBytes,
        maxBytesPerPartition: kafkaConfig.consumer.maxBytesPerPartition,
        minBytes: kafkaConfig.consumer.minBytes,
    };
};

export const getTopics = (): string[] => {
    return [kafkaConfig.topics.orders, kafkaConfig.topics.ordersDlq];
};

export const getOrderTopic = (): string => {
    return kafkaConfig.topics.orders;
};

export const getDlqTopic = (): string => {
    return kafkaConfig.topics.ordersDlq;
};

@Injectable()
export class KafkaConfigService {
    getClientConfig(): KafkaConfig {
        return createKafkaConfig();
    }

    getConsumerConfig(): ConsumerConfig {
        return createConsumerConfig();
    }

    getTopicsList(): string[] {
        return getTopics();
    }

    getOrderTopicName(): string {
        return getOrderTopic();
    }

    getDlqTopicName(): string {
        return getDlqTopic();
    }

    getFullConfig(): KafkaConsumerProperties {
        return kafkaConfig;
    }
}