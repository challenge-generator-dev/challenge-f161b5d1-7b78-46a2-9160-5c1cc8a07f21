import { Signal } from '@angular/core';

export interface OrderDto {
  id: string;
  customerId: string;
  items: OrderItemDto[];
  status: OrderStatus;
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItemDto {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export type OrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export class OrderModel {
  constructor(
    public id: string,
    public customerId: string,
    public items: OrderItemModel[],
    public status: OrderStatus,
    public totalAmount: number,
    public createdAt: Date,
    public updatedAt: Date
  ) {}

  static fromDto(dto: OrderDto): OrderModel {
    return new OrderModel(
      dto.id,
      dto.customerId,
      dto.items.map(item => new OrderItemModel(
        item.productId,
        item.productName,
        item.quantity,
        item.unitPrice,
        item.totalPrice
      )),
      dto.status,
      dto.totalAmount,
      new Date(dto.createdAt),
      new Date(dto.updatedAt)
    );
  }
}

export class OrderItemModel {
  constructor(
    public productId: string,
    public productName: string,
    public quantity: number,
    public unitPrice: number,
    public totalPrice: number
  ) {}
}