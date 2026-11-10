import { Component, OnInit, OnDestroy, inject, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { OrderService } from '../../core/services/order.service';
import { OrderModel } from '../../shared/models/order.model';
import { OrderCardComponent } from '../../shared/components/order-card/order-card.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatButtonModule,
    MatIconModule,
    OrderCardComponent
  ],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit, OnDestroy {
  private readonly orderService = inject(OrderService);
  private readonly snackBar = inject(MatSnackBar);
  private streamSubscription?: Subscription;

  readonly orders: Signal<OrderModel[]> = this.orderService.orders;
  readonly loading: Signal<boolean> = this.orderService.loading;
  readonly error: Signal<string | null> = this.orderService.error;

  ngOnInit(): void {
    this.loadOrders();
    this.startEventStream();
  }

  ngOnDestroy(): void {
    this.streamSubscription?.unsubscribe();
  }

  private loadOrders(): void {
    this.orderService.getOrders().subscribe({
      error: () => {
        this.snackBar.open('Error al cargar las órdenes', 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom'
        });
      }
    });
  }

  private startEventStream(): void {
    this.streamSubscription = this.orderService.streamOrders().subscribe({
      next: (order) => {
        this.snackBar.open(`Nueva orden recibida: ${order.id}`, 'Ver', {
          duration: 5000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom'
        }).onAction().subscribe(() => {
          this.scrollToOrder(order.id);
        });
      },
      error: (err) => {
        console.error('Error en el stream de eventos:', err);
        this.snackBar.open('Conexión de eventos perdida. Reconectando...', 'Cerrar', {
          duration: 3000
        });
        setTimeout(() => this.startEventStream(), 5000);
      }
    });
  }

  private scrollToOrder(orderId: string): void {
    const element = document.getElementById(`order-${orderId}`);
    element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    element?.classList.add('highlight');
    setTimeout(() => element?.classList.remove('highlight'), 2000);
  }

  refreshOrders(): void {
    this.loadOrders();
  }

  clearError(): void {
    this.orderService.clearError();
  }

  trackByOrderId(index: number, order: OrderModel): string {
    return order.id;
  }
}