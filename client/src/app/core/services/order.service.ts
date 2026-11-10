import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { OrderDto, OrderModel } from '../../shared/models/order.model';
import { catchError, Observable, throwError } from 'rxjs';
import { EventSourcePolyfill } from 'event-source-polyfill';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  // Signals para manejo reactivo del estado
  private ordersSignal = signal<OrderModel[]>([]);
  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);

  // Métodos de acceso a los signals
  get orders() {
    return this.ordersSignal.asReadonly();
  }

  get loading() {
    return this.loadingSignal.asReadonly();
  }

  get error() {
    return this.errorSignal.asReadonly();
  }

  // Obtener todas las órdenes
  getOrders(): Observable<OrderDto[]> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    return this.http.get<OrderDto[]>(`${this.apiUrl}/orders`).pipe(
      catchError((error: HttpErrorResponse) => {
        this.errorSignal.set(this.handleError(error));
        return throwError(() => error);
      })
    );
  }

  // Obtener una orden por ID
  getOrderById(id: string): Observable<OrderDto> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    return this.http.get<OrderDto>(`${this.apiUrl}/orders/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        this.errorSignal.set(this.handleError(error));
        return throwError(() => error);
      })
    );
  }

  // Stream de órdenes en tiempo real usando Server-Sent Events
  streamOrders(): Observable<OrderDto> {
    return new Observable<OrderDto>(observer => {
      const eventSource = new EventSourcePolyfill(`${this.apiUrl}/orders/stream`, {
        withCredentials: true,
        heartbeatTimeout: 30000,
        connectionTimeout: 5000
      });

      eventSource.onmessage = (event) => {
        try {
          const orderDto: OrderDto = JSON.parse(event.data);
          observer.next(orderDto);
          // Actualizar el signal con la nueva orden
          this.updateOrdersSignal(orderDto);
        } catch (error) {
          observer.error('Error parsing SSE data');
        }
      };

      eventSource.onerror = (error) => {
        observer.error(error);
        eventSource.close();
      };

      return () => {
        eventSource.close();
      };
    }).pipe(
      catchError((error: unknown) => {
        this.errorSignal.set(this.handleError(error));
        return throwError(() => error);
      })
    );
  }

  // Actualizar el signal cuando llega una nueva orden
  private updateOrdersSignal(newOrder: OrderDto): void {
    const currentOrders = this.ordersSignal();
    const existingOrderIndex = currentOrders.findIndex(order => order.id === newOrder.id);

    if (existingOrderIndex >= 0) {
      // Actualizar orden existente
      const updatedOrders = [...currentOrders];
      updatedOrders[existingOrderIndex] = OrderModel.fromDto(newOrder);
      this.ordersSignal.set(updatedOrders);
    } else {
      // Añadir nueva orden
      this.ordersSignal.set([...currentOrders, OrderModel.fromDto(newOrder)]);
    }
  }

  // Manejo de errores
  private handleError(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      if (error.error instanceof ErrorEvent) {
        return `Error: ${error.error.message}`;
      } else {
        return `Error ${error.status}: ${error.message}`;
      }
    } else if (error instanceof Error) {
      return error.message;
    } else {
      return 'Error desconocido';
    }
  }

  // Limpiar errores
  clearError(): void {
    this.errorSignal.set(null);
  }
}