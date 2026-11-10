import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { OrdersComponent } from './features/orders/orders.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    OrdersComponent,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule
  ],
  template: `
    <mat-toolbar color="primary" class="app-toolbar">
      <mat-icon>shopping_cart</mat-icon>
      <span class="app-title">Panel de Órdenes en Tiempo Real</span>
      <span class="toolbar-spacer"></span>
      <button mat-icon-button aria-label="Notificaciones">
        <mat-icon>notifications</mat-icon>
      </button>
      <button mat-icon-button aria-label="Configuración">
        <mat-icon>settings</mat-icon>
      </button>
    </mat-toolbar>
    
    <main class="app-content" role="main">
      <app-orders></app-orders>
    </main>
    
    <footer class="app-footer" role="contentinfo">
      <p>© 2024 Sistema de Gestión de Órdenes</p>
    </footer>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      font-family: 'Roboto', sans-serif;
    }
    
    .app-toolbar {
      position: sticky;
      top: 0;
      z-index: 1000;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    
    .app-title {
      margin-left: 12px;
      font-weight: 500;
      letter-spacing: 0.5px;
    }
    
    .toolbar-spacer {
      flex: 1 1 auto;
    }
    
    .app-content {
      flex: 1;
      padding: 24px;
      background-color: #f5f5f5;
    }
    
    .app-footer {
      padding: 16px;
      text-align: center;
      background-color: #fff;
      border-top: 1px solid #e0e0e0;
      color: #666;
      font-size: 14px;
    }
    
    @media (max-width: 600px) {
      .app-content {
        padding: 12px;
      }
      
      .app-title {
        font-size: 16px;
      }
    }
  `]
})
export class AppComponent {
  title = 'client';
}