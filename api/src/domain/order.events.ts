import { OrderStatus } from '../shared/enums/order-status.enum';

/**
 * Eventos de dominio relacionados con órdenes.
 * Estos eventos son emitidos cuando ocurren cambios significativos en el estado de una orden.
 */
export enum OrderEventType {
    ORDER_CREATED = 'order.created',
    ORDER_UPDATED = 'order.updated',
    ORDER_CANCELLED = 'order.cancelled'
}

export interface OrderEvent {
    eventId: string;
    eventType: OrderEventType;
    orderId: string;
    timestamp: Date;
    payload: unknown;
}

export interface OrderCreatedEventPayload {
    customerId: string;
    totalAmount: number;
    items: Array<{
        productId: string;
        name: string;
        quantity: number;
        price: number;
        sku?: string;
    }>;
    status: OrderStatus;
}

export interface OrderUpdatedEventPayload {
    previousStatus: OrderStatus;
    newStatus: OrderStatus;
    updatedAt: Date;
}

export interface OrderCancelledEventPayload {
    reason?: string;
    cancelledAt: Date;
}

/**
 * Factory para crear eventos de órdenes.
 */
export class OrderEventFactory {
    static createOrderCreatedEvent(
        orderId: string,
        customerId: string,
        totalAmount: number,
        items: Array<{
            productId: string;
            name: string;
            quantity: number;
            price: number;
            sku?: string;
        }>,
        status: OrderStatus
    ): OrderEvent {
        return {
            eventId: this.generateEventId(),
            eventType: OrderEventType.ORDER_CREATED,
            orderId,
            timestamp: new Date(),
            payload: {
                customerId,
                totalAmount,
                items,
                status
            } as OrderCreatedEventPayload
        };
    }

    static createOrderUpdatedEvent(
        orderId: string,
        previousStatus: OrderStatus,
        newStatus: OrderStatus
    ): OrderEvent {
        return {
            eventId: this.generateEventId(),
            eventType: OrderEventType.ORDER_UPDATED,
            orderId,
            timestamp: new Date(),
            payload: {
                previousStatus,
                newStatus,
                updatedAt: new Date()
            } as OrderUpdatedEventPayload
        };
    }

    static createOrderCancelledEvent(
        orderId: string,
        reason?: string
    ): OrderEvent {
        return {
            eventId: this.generateEventId(),
            eventType: OrderEventType.ORDER_CANCELLED,
            orderId,
            timestamp: new Date(),
            payload: {
                reason,
                cancelledAt: new Date()
            } as OrderCancelledEventPayload
        };
    }

    private static generateEventId(): string {
        return `evt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    }
}