import { OrderStatus } from '../enums/order-status.enum';
import { IsEnum, IsNumber, IsString, IsUUID, ValidateNested, IsDateString, IsArray, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

/***
 * DTO para la transferencia de datos de órdenes entre capas.
 * Incluye validación de datos y transformación para serialización.
 */
export class OrderItemDto {
    @IsString()
    @IsUUID()
    productId: string;

    @IsString()
    name: string;

    @IsNumber()
    quantity: number;

    @IsNumber({ maxDecimalPlaces: 2 })
    price: number;

    @IsString()
    @IsOptional()
    sku?: string;
}

export class OrderDto {
    @IsString()
    @IsUUID()
    id: string;

    @IsEnum(OrderStatus)
    status: OrderStatus;

    @IsNumber({ maxDecimalPlaces: 2 })
    totalAmount: number;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OrderItemDto)
    items: OrderItemDto[];

    @IsDateString()
    createdAt: string;

    @IsDateString()
    updatedAt: string;

    @IsString()
    @IsUUID()
    customerId: string;
}

export class CreateOrderDto {
    @IsString()
    @IsUUID()
    customerId: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OrderItemDto)
    items: OrderItemDto[];
}

export class UpdateOrderStatusDto {
    @IsEnum(OrderStatus)
    status: OrderStatus;
}