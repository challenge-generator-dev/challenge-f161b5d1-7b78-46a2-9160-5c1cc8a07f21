import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Order, OrderItem, OrderStatus } from '../domain/order.entity';
import { OrderDto, OrderItemDto } from '../shared/dto/order.dto';
import { OrderEvent, OrderEventType } from '../domain/order.events';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class OrderService {
    private readonly logger = new Logger(OrderService.name);
    private readonly orders: Map<string, Order> = new Map();
    private readonly orderEventsSubject = new Subject<OrderEvent>();

    constructor() {
        this.initializeSampleOrders();
    }

    private initializeSampleOrders(): void {
        const sampleOrders = [
            this.createOrder('ORD-001', 'cust-001', 1500.00, [
                { productId: 'prod-001', name: 'Laptop Pro', quantity: 1, price: 1200.00 },
                { productId: 'prod-002', name: 'Mouse Inalámbrico', quantity: 2, price: 150.00 },
            ]),
            this.createOrder('ORD-002', 'cust-002', 450.50, [
                { productId: 'prod-003', name: 'Teclado Mecánico', quantity: 1, price: 350.50 },
                { productId: 'prod-004', name: 'Alfombrilla XL', quantity: 1, price: 100.00 },
            ]),
            this.createOrder('ORD-003', 'cust-003', 2999.00, [
                { productId: 'prod-005', name: 'Monitor 4K', quantity: 2, price: 1499.50 },
            ]),
        ];

        sampleOrders.forEach(order => {
            this.orders.set(order.id, order);
        });

        this.logger.log(`Inicializadas ${sampleOrders.length} órdenes de ejemplo`);
    }

    private createOrder(
        id: string,
        customerId: string,
        totalAmount: number,
        itemsData: Array<{ productId: string; name: string; quantity: number; price: number }>
    ): Order {
        const items = itemsData.map(
            item => new OrderItem(
                item.productId,
                item.name,
                item.quantity,
                item.price
            )
        );

        const order = new Order(
            id,
            OrderStatus.PENDING,
            totalAmount,
            items,
            customerId
        );

        return order;
    }

    async getOrders(): Promise<OrderDto[]> {
        this.logger.log('Obteniendo todas las órdenes');
        const orders = Array.from(this.orders.values());
        return orders.map(order => this.mapOrderToDto(order));
    }

    async getOrderById(id: string): Promise<OrderDto> {
        this.logger.log(`Obteniendo orden por ID: ${id}`);
        const order = this.orders.get(id);

        if (!order) {
            this.logger.warn(`Orden no encontrada: ${id}`);
            throw new NotFoundException(`Orden con ID ${id} no encontrada`);
        }

        return this.mapOrderToDto(order);
    }

    streamOrders(): Observable<OrderEvent> {
        this.logger.log('Iniciando stream de órdenes');
        return this.orderEventsSubject.asObservable();
    }

    processOrderEvent(event: OrderEvent): void {
        this.logger.log(`Procesando evento: ${event.eventType} para orden ${event.orderId}`);

        switch (event.eventType) {
            case OrderEventType.ORDER_CREATED:
                this.handleOrderCreated(event);
                break;
            case OrderEventType.ORDER_UPDATED:
                this.handleOrderUpdated(event);
                break;
            case OrderEventType.ORDER_CANCELLED:
                this.handleOrderCancelled(event);
                break;
            default:
                this.logger.warn(`Tipo de evento desconocido: ${event.eventType}`);
        }

        this.orderEventsSubject.next(event);
    }

    private handleOrderCreated(event: OrderEvent): void {
        const payload = event.payload as { customerId: string; totalAmount: number; items: any[] };
        const order = this.createOrder(
            event.orderId,
            payload.customerId,
            payload.totalAmount,
            payload.items
        );
        this.orders.set(order.id, order);
        this.logger.log(`Orden creada: ${order.id}`);
    }

    private handleOrderUpdated(event: OrderEvent): void {
        const order = this.orders.get(event.orderId);
        if (order) {
            const payload = event.payload as { newStatus: OrderStatus };
            const newStatus = payload.newStatus;
            order.updateStatus(newStatus);
            this.orders.set(order.id, order);
            this.logger.log(`Orden actualizada: ${order.id} - Estado: ${newStatus}`);
        }
    }

    private handleOrderCancelled(event: OrderEvent): void {
        const order = this.orders.get(event.orderId);
        if (order) {
            order.updateStatus(OrderStatus.CANCELLED);
            this.orders.set(order.id, order);
            this.logger.log(`Orden cancelada: ${order.id}`);
        }
    }

    private mapOrderToDto(order: Order): OrderDto {
        const orderDto = new OrderDto();
        orderDto.id = order.id;
        orderDto.status = order.status;
        orderDto.totalAmount = order.totalAmount;
        orderDto.customerId = order.customerId;
        orderDto.createdAt = order.createdAt.toISOString();
        orderDto.updatedAt = order.updatedAt.toISOString();
        orderDto.items = order.items.map(item => this.mapItemToDto(item));
        return orderDto;
    }

    private mapItemToDto(item: OrderItem): OrderItemDto {
        const itemDto = new OrderItemDto();
        itemDto.productId = item.productId;
        itemDto.name = item.name;
        itemDto.quantity = item.quantity;
        itemDto.price = item.price;
        itemDto.sku = item.sku;
        return itemDto;
    }

    getOrderCount(): number {
        return this.orders.size;
    }

    clearOrders(): void {
        this.orders.clear();
        this.logger.log('Todas las órdenes han sido eliminadas');
    }
}