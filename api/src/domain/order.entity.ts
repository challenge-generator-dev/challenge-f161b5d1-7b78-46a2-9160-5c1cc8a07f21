export enum OrderStatus {
    PENDING = 'PENDING',
    PROCESSING = 'PROCESSING',
    SHIPPED = 'SHIPPED',
    DELIVERED = 'DELIVERED',
    CANCELLED = 'CANCELLED'
}

/**
 * Entidad de dominio que representa una orden en el sistema.
 * Encapsula la lógica de negocio relacionada con el ciclo de vida de una orden.
 */
export class Order {
    private readonly _id: string;
    private _status: OrderStatus;
    private _totalAmount: number;
    private _items: OrderItem[];
    private readonly _createdAt: Date;
    private _updatedAt: Date;
    private _customerId: string;

    constructor(
        id: string,
        status: OrderStatus,
        totalAmount: number,
        items: OrderItem[],
        customerId: string,
        createdAt?: Date,
        updatedAt?: Date
    ) {
        this._id = id;
        this._status = status;
        this._totalAmount = totalAmount;
        this._items = items;
        this._customerId = customerId;
        this._createdAt = createdAt || new Date();
        this._updatedAt = updatedAt || new Date();
        this.validate();
    }

    get id(): string {
        return this._id;
    }

    get status(): OrderStatus {
        return this._status;
    }

    get totalAmount(): number {
        return this._totalAmount;
    }

    get items(): OrderItem[] {
        return [...this._items];
    }

    get createdAt(): Date {
        return new Date(this._createdAt);
    }

    get updatedAt(): Date {
        return new Date(this._updatedAt);
    }

    get customerId(): string {
        return this._customerId;
    }

    updateStatus(newStatus: OrderStatus): void {
        const validTransitions: Record<OrderStatus, OrderStatus[]> = {
            [OrderStatus.PENDING]: [OrderStatus.PROCESSING, OrderStatus.CANCELLED],
            [OrderStatus.PROCESSING]: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],
            [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED],
            [OrderStatus.DELIVERED]: [],
            [OrderStatus.CANCELLED]: []
        };

        if (!validTransitions[this._status].includes(newStatus)) {
            throw new Error(`Transición inválida de estado: ${this._status} -> ${newStatus}`);
        }
        this._status = newStatus;
        this._updatedAt = new Date();
    }

    addItem(item: OrderItem): void {
        this._items.push(item);
        this._totalAmount = this._items.reduce((sum, i) => sum + i.price * i.quantity, 0);
        this._updatedAt = new Date();
    }

    private validate(): void {
        if (this._totalAmount <= 0) {
            throw new Error('El monto total de la orden debe ser positivo');
        }
        if (this._items.length === 0) {
            throw new Error('La orden debe tener al menos un item');
        }
        if (!this._customerId) {
            throw new Error('El ID del cliente es obligatorio');
        }
    }
}

export class OrderItem {
    constructor(
        public readonly productId: string,
        public readonly name: string,
        public readonly quantity: number,
        public readonly price: number,
        public readonly sku?: string
    ) {
        if (quantity <= 0) {
            throw new Error('La cantidad debe ser positiva');
        }
        if (price <= 0) {
            throw new Error('El precio debe ser positivo');
        }
    }
}