import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { OrderDto, OrderStatus } from '../../models/order.model';

@Component({
  selector: 'app-order-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
    DatePipe,
    CurrencyPipe
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-card class="order-card" role="article" aria-labelledby="order-title">
      <mat-card-header>
        <mat-card-title id="order-title">Orden #{{ order()?.id }}</mat-card-title>
        <mat-card-subtitle>{{ order()?.createdAt | date:'medium' }}</mat-card-subtitle>
      </mat-card-header>
      
      <mat-card-content>
        <div class="order-status">
          <mat-chip-set aria-label="Estado de la orden">
            <mat-chip [class]="'status-' + order()?.status">
              <mat-icon>{{ getStatusIcon(order()?.status) }}</mat-icon>
              {{ getStatusLabel(order()?.status) }}
            </mat-chip>
          </mat-chip-set>
        </div>

        <div class="order-items" role="list" aria-label="Items de la orden">
          <h4>Productos</h4>
          @for (item of order()?.items; track item.productId) {
            <div class="order-item" role="listitem">
              <span class="item-name">{{ item.productName }}</span>
              <span class="item-quantity">x{{ item.quantity }}</span>
              <span class="item-price">{{ item.unitPrice | currency }}</span>
            </div>
          }
        </div>

        <div class="order-total">
          <strong>Total:</strong>
          <span class="total-amount">{{ order()?.totalAmount | currency }}</span>
        </div>
      </mat-card-content>

      <mat-card-actions align="end">
        <button mat-button color="primary" (click)="onViewDetails()" aria-label="Ver detalles de la orden">
          <mat-icon>visibility</mat-icon>
          Ver Detalles
        </button>
        <button mat-button color="accent" (click)="onOrderAction()" aria-label="Acción adicional">
          <mat-icon>more_horiz</mat-icon>
          Acciones
        </button>
      </mat-card-actions>
    </mat-card>
  `,
  styles: [`
    .order-card {
      margin: 16px 0;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .order-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.16);
    }

    .order-status {
      margin: 16px 0;
    }

    .status-PENDING { background-color: #fff3e0; color: #e65100; }
    .status-PROCESSING { background-color: #e3f2fd; color: #1565c0; }
    .status-SHIPPED { background-color: #f3e5f5; color: #7b1fa2; }
    .status-DELIVERED { background-color: #e8f5e9; color: #2e7d32; }
    .status-CANCELLED { background-color: #ffebee; color: #c62828; }

    .order-items {
      margin: 16px 0;
      padding: 12px;
      background-color: #fafafa;
      border-radius: 4px;
    }

    .order-items h4 {
      margin: 0 0 12px 0;
      font-size: 14px;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .order-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
      border-bottom: 1px solid #eee;
    }

    .order-item:last-child {
      border-bottom: none;
    }

    .item-name {
      flex: 1;
      font-weight: 500;
    }

    .item-quantity {
      width: 60px;
      text-align: center;
      color: #666;
    }

    .item-price {
      width: 80px;
      text-align: right;
      font-weight: 500;
    }

    .order-total {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 16px;
      padding-top: 16px;
      border-top: 2px solid #333;
    }

    .total-amount {
      font-size: 20px;
      font-weight: 700;
      color: #1976d2;
    }

    mat-chip mat-icon {
      font-size: 18px;
      height: 18px;
      width: 18px;
      margin-right: 4px;
    }
  `]
})
export class OrderCardComponent {
  order = input.required<OrderDto | null>();
  viewDetails = output<string>();
  orderAction = output<string>();

  getStatusIcon(status: OrderStatus | undefined): string {
    const icons: Record<OrderStatus, string> = {
      'PENDING': 'schedule',
      'PROCESSING': 'autorenew',
      'SHIPPED': 'local_shipping',
      'DELIVERED': 'check_circle',
      'CANCELLED': 'cancel'
    };
    return icons[status || 'PENDING'];
  }

  getStatusLabel(status: OrderStatus | undefined): string {
    const labels: Record<OrderStatus, string> = {
      'PENDING': 'Pendiente',
      'PROCESSING': 'Procesando',
      'SHIPPED': 'Enviado',
      'DELIVERED': 'Entregado',
      'CANCELLED': 'Cancelado'
    };
    return labels[status || 'PENDING'];
  }

  onViewDetails(): void {
    const orderId = this.order()?.id;
    if (orderId) {
      this.viewDetails.emit(orderId);
    }
  }

  onOrderAction(): void {
    const orderId = this.order()?.id;
    if (orderId) {
      this.orderAction.emit(orderId);
    }
  }
}