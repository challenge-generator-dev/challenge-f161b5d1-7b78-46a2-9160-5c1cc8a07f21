import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from '../src/infrastructure/controllers/order.controller';
import { OrderService } from '../src/application/order.service';
import { KafkaConsumerService } from '../src/infrastructure/kafka/kafka.consumer';
import { OrderDto } from '../src/shared/dto/order.dto';
import { OrderStatus } from '../src/shared/enums/order-status.enum';
import { OrderEventType, OrderEvent } from '../src/domain/order.events';
import { Observable } from 'rxjs';

describe('OrderController', () => {
  let controller: OrderController;
  let orderService: jest.Mocked<OrderService>;
  let kafkaConsumer: jest.Mocked<KafkaConsumerService>;

  const mockOrderDto: OrderDto = {
    id: 'order-123',
    status: OrderStatus.PENDING,
    totalAmount: 150.00,
    items: [
      {
        productId: 'prod-001',
        name: 'Producto de prueba',
        quantity: 2,
        price: 75.00,
        sku: 'SKU-001',
      },
    ],
    createdAt: '2024-01-15T10:00:00.000Z',
    updatedAt: '2024-01-15T10:00:00.000Z',
    customerId: 'customer-456',
  };

  beforeEach(async () => {
    const mockOrderService = {
      getOrders: jest.fn(),
      getOrderById: jest.fn(),
      streamOrders: jest.fn(),
      getOrderCount: jest.fn(),
      clearOrders: jest.fn(),
    };

    const mockKafkaConsumer = {
      onMessage: jest.fn(),
      removeHandler: jest.fn(),
      getSubscribedEvents: jest.fn().mockReturnValue(['order.created', 'order.updated', 'order.cancelled']),
      isConnected: jest.fn().mockReturnValue(true),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        { provide: OrderService, useValue: mockOrderService },
        { provide: KafkaConsumerService, useValue: mockKafkaConsumer },
      ],
    }).compile();

    controller = module.get<OrderController>(OrderController);
    orderService = module.get(OrderService);
    kafkaConsumer = module.get(KafkaConsumerService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getOrders', () => {
    it('debe retornar un array de OrderDto cuando hay órdenes existentes', async () => {
      const mockOrders: OrderDto[] = [mockOrderDto];
      orderService.getOrders.mockResolvedValue(mockOrders);

      const result = await controller.getOrders();

      expect(orderService.getOrders).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockOrders);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('order-123');
    });

    it('debe retornar array vacío cuando no hay órdenes', async () => {
      orderService.getOrders.mockResolvedValue([]);

      const result = await controller.getOrders();

      expect(orderService.getOrders).toHaveBeenCalledTimes(1);
      expect(result).toEqual([]);
      expect(Array.isArray(result)).toBe(true);
    });

    it('debe manejar errores del servicio y propagarlos', async () => {
      const error = new Error('Error al obtener órdenes');
      orderService.getOrders.mockRejectedValue(error);

      await expect(controller.getOrders()).rejects.toThrow('Error al obtener órdenes');
    });
  });

  describe('getOrderById', () => {
    it('debe retornar OrderDto cuando la orden existe', async () => {
      orderService.getOrderById.mockResolvedValue(mockOrderDto);

      const result = await controller.getOrderById('order-123');

      expect(orderService.getOrderById).toHaveBeenCalledTimes(1);
      expect(orderService.getOrderById).toHaveBeenCalledWith('order-123');
      expect(result).toEqual(mockOrderDto);
      expect(result.id).toBe('order-123');
    });

    it('debe retornar null cuando la orden no existe', async () => {
      orderService.getOrderById.mockResolvedValue(null);

      const result = await controller.getOrderById('non-existent-id');

      expect(orderService.getOrderById).toHaveBeenCalledWith('non-existent-id');
      expect(result).toBeNull();
    });

    it('debe manejar errores de validación del ID', async () => {
      orderService.getOrderById.mockRejectedValue(new Error('ID inválido'));

      await expect(controller.getOrderById('')).rejects.toThrow();
    });
  });

  describe('streamOrders', () => {
    it('debe configurar headers correctos para SSE', async () => {
      const mockResponse = {
        setHeader: jest.fn(),
        write: jest.fn(),
        end: jest.fn(),
        statusCode: 200,
      } as unknown as import('express').Response;

      orderService.streamOrders.mockReturnValue(new Observable((subscriber) => {
        subscriber.next({
          eventId: 'event-1',
          eventType: OrderEventType.ORDER_CREATED,
          orderId: 'order-123',
          timestamp: new Date(),
          payload: { customerId: 'customer-456', totalAmount: 150 },
        });
      }));

      await controller.streamOrders(mockResponse);

      expect(mockResponse.setHeader).toHaveBeenCalledWith('Content-Type', 'text/event-stream');
      expect(mockResponse.setHeader).toHaveBeenCalledWith('Cache-Control', 'no-cache');
      expect(mockResponse.setHeader).toHaveBeenCalledWith('Connection', 'keep-alive');
      expect(mockResponse.setHeader).toHaveBeenCalledWith('X-Accel-Buffering', 'no');
    });

    it('debe enviar eventos en formato SSE válido', async () => {
      const mockResponse = {
        setHeader: jest.fn(),
        write: jest.fn(),
        end: jest.fn(),
        statusCode: 200,
      } as unknown as import('express').Response;

      const testEvent: OrderEvent = {
        eventId: 'event-test-001',
        eventType: OrderEventType.ORDER_UPDATED,
        orderId: 'order-456',
        timestamp: new Date('2024-01-15T12:00:00Z'),
        payload: {
          previousStatus: OrderStatus.PENDING,
          newStatus: OrderStatus.CONFIRMED,
          updatedAt: new Date(),
        },
      };

      orderService.streamOrders.mockReturnValue(new Observable((subscriber) => {
        subscriber.next(testEvent);
        subscriber.complete();
      }));

      await controller.streamOrders(mockResponse);

      expect(mockResponse.write).toHaveBeenCalled();
      const sseData = (mockResponse.write as jest.Mock).mock.calls[0][0];
      expect(sseData).toContain('event:');
      expect(sseData).toContain('data:');
    });

    it('debe manejar desconexión del cliente correctamente', async () => {
      const mockResponse = {
        setHeader: jest.fn(),
        write: jest.fn(),
        end: jest.fn(),
        statusCode: 200,
        on: jest.fn(),
      } as unknown as import('express').Response;

      orderService.streamOrders.mockReturnValue(new Observable(() => {}));

      await controller.streamOrders(mockResponse);

      expect(mockResponse.on).toHaveBeenCalledWith('close', expect.any(Function));
    });

    it('debe manejar errores en el stream y cerrar conexión', async () => {
      const mockResponse = {
        setHeader: jest.fn(),
        write: jest.fn(),
        end: jest.fn(),
        statusCode: 200,
      } as unknown as import('express').Response;

      orderService.streamOrders.mockReturnValue(new Observable((subscriber) => {
        subscriber.error(new Error('Error en stream'));
      }));

      await controller.streamOrders(mockResponse);

      expect(mockResponse.end).toHaveBeenCalled();
    });
  });

  describe('manejo de dependencias', () => {
    it('debe inyectar OrderService correctamente', () => {
      expect(orderService).toBeDefined();
      expect(typeof orderService.getOrders).toBe('function');
      expect(typeof orderService.getOrderById).toBe('function');
      expect(typeof orderService.streamOrders).toBe('function');
    });

    it('debe inyectar KafkaConsumerService correctamente', () => {
      expect(kafkaConsumer).toBeDefined();
      expect(typeof kafkaConsumer.onMessage).toBe('function');
      expect(typeof kafkaConsumer.removeHandler).toBe('function');
      expect(kafkaConsumer.isConnected()).toBe(true);
    });
  });

  describe('integración con Kafka', () => {
    it('debe verificar conexión con Kafka antes de procesar', () => {
      const isConnected = kafkaConsumer.isConnected();
      expect(isConnected).toBe(true);
      expect(kafkaConsumer.getSubscribedEvents()).toContain('order.created');
      expect(kafkaConsumer.getSubscribedEvents()).toContain('order.updated');
      expect(kafkaConsumer.getSubscribedEvents()).toContain('order.cancelled');
    });

    it('debe registrar handler de mensajes de Kafka', () => {
      const handler = jest.fn();
      kafkaConsumer.onMessage(handler);
      expect(kafkaConsumer.onMessage).toHaveBeenCalledWith(handler);
    });
  });
});