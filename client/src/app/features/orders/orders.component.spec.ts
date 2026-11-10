import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { OrdersComponent } from './orders.component';
import { OrderService } from '../../core/services/order.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Signal } from '@angular/core';
import { of, throwError } from 'rxjs';
import { OrderModel } from '../../shared/models/order.model';
import { OrderStatus } from '../../shared/models/order.model';

describe('OrdersComponent', () => {
  let component: OrdersComponent;
  let fixture: ComponentFixture<OrdersComponent>;
  let orderServiceMock: Partial<OrderService>;
  let snackBarMock: any;

  const mockOrders: OrderModel[] = [
    new OrderModel(
      'order-1',
      'customer-1',
      [],
      'PENDING' as OrderStatus,
      150.00,
      new Date(),
      new Date()
    ),
    new OrderModel(
      'order-2',
      'customer-2',
      [],
      'PROCESSING' as OrderStatus,
      250.50,
      new Date(),
      new Date()
    )
  ];

  beforeEach(async () => {
    snackBarMock = {
      open: jasmine.createSpy('open')
    };

    orderServiceMock = {
      get orders(): Signal<OrderModel[]> {
        return (() => mockOrders) as any;
      },
      get loading(): Signal<boolean> {
        return (() => false) as any;
      },
      get error(): Signal<string | null> {
        return (() => null) as any;
      },
      getOrders: jasmine.createSpy('getOrders').and.returnValue(of(mockOrders)),
      getOrderById: jasmine.createSpy('getOrderById').and.returnValue(of(mockOrders[0])),
      streamOrders: jasmine.createSpy('streamOrders').and.returnValue(of(mockOrders[0])),
      clearError: jasmine.createSpy('clearError')
    };

    await TestBed.configureTestingModule({
      imports: [
        OrdersComponent,
        MatSnackBarModule
      ],
      providers: [
        { provide: OrderService, useValue: orderServiceMock },
        { provide: MatSnackBar, useValue: snackBarMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(OrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar las órdenes al inicializar', () => {
    component.ngOnInit();
    expect(orderServiceMock.getOrders).toHaveBeenCalled();
  });

  it('debería mostrar las órdenes en la vista', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const orderCards = compiled.querySelectorAll('.order-card');
    expect(orderCards.length).toBeGreaterThan(0);
  });

  it('debería mostrar indicador de carga cuando loading es true', fakeAsync(() => {
    (orderServiceMock as any).loading = (() => true) as Signal<boolean>;
    component.ngOnInit();
    tick();
    fixture.detectChanges();
    
    const loadingElement = fixture.nativeElement.querySelector('.loading-spinner');
    expect(loadingElement).toBeTruthy();
  }));

  it('debería mostrar mensaje de error cuando existe un error', () => {
    const errorMessage = 'Error al cargar las órdenes';
    (orderServiceMock as any).error = (() => errorMessage) as Signal<string | null>;
    fixture.detectChanges();
    
    const errorElement = fixture.nativeElement.querySelector('.error-message');
    expect(errorElement?.textContent).toContain(errorMessage);
  });

  it('debería limpiar el error al llamar clearError', () => {
    component.clearError();
    expect(orderServiceMock.clearError).toHaveBeenCalled();
  });

  it('debería actualizar la lista de órdenes cuando arrives un nuevo evento', () => {
    const newOrder = new OrderModel(
      'order-3',
      'customer-3',
      [],
      'SHIPPED' as OrderStatus,
      300.00,
      new Date(),
      new Date()
    );
    
    (orderServiceMock as any).orders = (() => [...mockOrders, newOrder]) as Signal<OrderModel[]>;
    fixture.detectChanges();
    
    const orderCards = fixture.nativeElement.querySelectorAll('.order-card');
    expect(orderCards.length).toBe(3);
  });

  it('debería usar trackByOrderId para оптимизация rendimiento', () => {
    const orderId = component.trackByOrderId(0, mockOrders[0]);
    expect(orderId).toBe('order-1');
  });

  it('debería limpiar la suscripción al destruir el componente', () => {
    const unsubscribeSpy = jasmine.createSpy('unsubscribe');
    component['streamSubscription'] = {
      unsubscribe: unsubscribeSpy
    } as any;
    
    component.ngOnDestroy();
    expect(unsubscribeSpy).toHaveBeenCalled();
  });

  it('debería mostrar estado vacío cuando no hay órdenes', () => {
    (orderServiceMock as any).orders = (() => []) as Signal<OrderModel[]>;
    fixture.detectChanges();
    
    const emptyMessage = fixture.nativeElement.querySelector('.empty-message');
    expect(emptyMessage).toBeTruthy();
  });

  it('debería llamar a loadOrders al hacer refresh', () => {
    spyOn(component, 'loadOrders');
    component.refreshOrders();
    expect(component.loadOrders).toHaveBeenCalled();
  });

  describe('Manejo de errores en streamOrders', () => {
    it('debería manejar error en la conexión de eventos', fakeAsync(() => {
      const errorStream = throwError(() => new Error('Error de conexión SSE'));
      (orderServiceMock as any).streamOrders = jasmine.createSpy('streamOrders').and.returnValue(errorStream);
      
      component.startEventStream();
      tick();
      
      expect(snackBarMock.open).toHaveBeenCalled();
    }));
  });
});