import { Routes } from '@angular/router';
import { OrdersComponent } from './features/orders/orders.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'orders',
    pathMatch: 'full'
  },
  {
    path: 'orders',
    component: OrdersComponent,
    title: 'Órdenes en Tiempo Real'
  },
  {
    path: '**',
    redirectTo: 'orders'
  }
];