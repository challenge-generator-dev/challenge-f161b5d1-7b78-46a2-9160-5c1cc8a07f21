# Prompt para Mejorar el Codigo Base

Copia y pega el contenido del bloque de abajo en un asistente de IA (Claude, ChatGPT)
para obtener el proyecto completo y arrancable. Guarda los archivos que te devuelva en la
carpeta del repo, respetando exactamente las rutas.

Si preferis trabajar en tu editor con un agente local (Claude Code, Cursor, Copilot), usa `AGENTS.md` en vez de este archivo: dice lo mismo pero para que escriba los archivos en disco.

## Las dos reglas que no se negocian

1. **Completa el boilerplate.** Todo lo que el proyecto necesita para compilar y arrancar: manifiesto de dependencias, punto de entrada, configuracion, capa de interfaz, y las capas del patron arquitectonico declarado. Eso es andamiaje y es tu trabajo.
2. **NO resuelvas el reto.** Los entregables de las fases son el trabajo de la persona. El hueco pedagogico se deja como esta: el proyecto arranca, pero lo que el reto pide implementar NO esta implementado.

Dicho de otra forma: si algo impide compilar, arreglalo. Si algo es logica de negocio incompleta, validaciones ausentes, un secreto hardcodeado o un patron mejorable, dejalo exactamente como esta — es lo que la persona tiene que encontrar.

## Mapa de componentes

El repo tiene una carpeta por componente. Cada uno se instala y verifica dentro de la suya.

| Componente | Carpeta | Rol | Capa | Track | Tecnologias |
|---|---|---|---|---|---|
| `api` | `api/` | practice | server | Node | Apache Kafka |
| `client` | `client/` | chapter, support | client | Angular | Angular |
| `infra-local` | (raiz) | support | infra | Compose local | Apache Kafka |

## Orden de arranque

1. `docker compose up -d` (en la raiz) — levanta la infraestructura local.
2. `cd api && npm install && npm run build` — componente `api` (practice).
3. `cd client && npm install && npm run build` — componente `client` (chapter, support).

### Contratos entre componentes

- `api` expone http (api: http://localhost:3000):
  - `GET /orders`
  - `GET /orders/:id`
  - `GET /orders/stream`
- `client` expone http (api: http://localhost:3000):
  - `GET /orders`
  - `GET /orders/stream`

## Lo que le falta a este proyecto

Esto NO lo tenes que adivinar: salio de comparar el proyecto contra la arquitectura declarada del reto y de un analisis estatico del codigo. Completalo TODO.

### Referencias colgando en el codigo que si esta

Cada una rompe la compilacion:

- `api/src/domain/order.entity.ts` — `OrderItem.push`: Se invoca `push` sobre `OrderItem`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- `api/src/domain/order.entity.ts` — `OrderItem.reduce`: Se invoca `reduce` sobre `OrderItem`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- `client/src/app/shared/models/order.model.ts` — `OrderItemModel.map`: Se invoca `map` sobre `OrderItemModel`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.

## Como saber que terminaste

```bash
(cd api && npm install && npm run build) && (cd client && npm install && npm run build) && docker compose config -q
```

Ese comando corriendo sin errores es la definicion de "listo".

---

```
## Briefing del reto (autoridad)
Este bloque manda sobre los archivos adjuntos. El stack y el rol salen de AQUÍ, no de un topic genérico ni de markdown placeholder.

### Perfil
Chapter Frontend, Especialidad Desarrollador, Tecnología Angular, Advanced L2

### Brecha de conocimiento
Publicar y consumir eventos en un topic Kafka y mostrarlos en tiempo real (corrida e2e 20261110115758191), Publica y consume eventos de un topic Kafka y refleja los mensajes en la interfaz

### Misión / candidato
Mostrar en vivo el estado de las ordenes

### Reto
- Tema: Consumo de eventos en tiempo real con Kafka
- Seniority: advanced-l2
- Tipo: practical
- Título: Implementación de visualización de órdenes en tiempo real con Kafka
- Tiempo estimado: 8 horas

### Fases (trabajo del HUMANO — PROHIBIDO completarlas)
No implementes estos entregables. Dejalos como hueco pedagógico. El asistente solo materializa el proyecto arrancable para que el participante pueda trabajar.
- Fase 1: Configuración inicial del consumidor Kafka — objetivo: Configurar y probar un consumidor Kafka que se conecte al topic de órdenes. — entregable (NO resolver): Consumidor Kafka configurado y conectado al topic de órdenes, capaz de recibir y procesar eventos.
- Fase 2: Integración del consumidor con la interfaz de usuario — objetivo: Integrar el consumidor Kafka con la interfaz de usuario para mostrar el estado de las órdenes en tiempo real. — entregable (NO resolver): Interfaz de usuario integrada con el consumidor Kafka, mostrando el estado de las órdenes en tiempo real.
- Fase 3: Optimización y manejo de errores — objetivo: Optimizar el rendimiento del consumidor Kafka y manejar posibles errores en la integración con la interfaz de usuario. — entregable (NO resolver): Consumidor Kafka optimizado y errores manejados en la integración con la interfaz de usuario.

Eres un asistente experto en análisis, corrección y generación de archivos de cualquier tipo:
código fuente, documentación, hojas de cálculo, documentos Word, configuraciones, entre otros.
Voy a enviarte una cadena de texto que contiene uno o más archivos. Cada archivo está delimitado por un marcador con el siguiente formato:
// === ARCHIVO: ruta/del/archivo.extension ===
o también puede aparecer como:
## === ARCHIVO: ruta/del/archivo.extension ===
Lo que sigue al marcador puede ser:

El contenido real del archivo (código, texto, YAML, etc.)
Una descripción en lenguaje natural de lo que debe contener el archivo


TU TAREA
PASO 0 — ¿Esto es un proyecto o una carcasa?
Antes de extraer archivos, leé el Briefing (si está) y diagnosticá el adjunto.

Es CARCASA si ocurre CUALQUIERA de estas:
- No hay manifiesto de dependencias del stack del briefing (manifest.json de VTEX IO / package.json / pom.xml / build.gradle / requirements.txt / go.mod / *.tf / *.csproj, según corresponda)
- Hay un "binario" que en realidad es un comentario ("no puede ser mostrado como texto plano", placeholder .fig/.docx vacío)
- Los markdowns ya completan entregables de fases posteriores ("se implementó fade-in", lista de áreas ya resuelta)

Si es CARCASA:
- MATERIALIZÁ un proyecto que arranca en el stack del briefing (VTEX IO Store Framework, Angular, Terraform, pytest, Nest, etc.). Incluí manifiesto, punto de entrada y capa de interfaz reales.
- NO copies los markdowns de "solución" como si fueran el producto. Son ruido de generación.
- NO resuelvas las fases del briefing (están marcadas PROHIBIDO). Dejá el hueco pedagógico: el flujo existe, las microinteracciones/calidad/infra que el reto pide NO están hechas.
- Después seguí al PASO 5 (entrega de archivos).

Si es un proyecto REAL (manifiesto + código que compila o arranca):
- Seguí PASO 1 en adelante. 🔴 compilación sí. 🟡 pedagógico no.

PASO 1 — Detección y extracción
Identifica todos los archivos presentes en la cadena. Para cada archivo extrae:

Su ruta completa (ej: src/main/java/com/pragma/Service.java)
Su contenido o descripción

PASO 2 — Clasificación por tipo
Clasifica cada archivo en una de estas categorías:
A) Código fuente (Java, Python, TypeScript, JavaScript, Kotlin, etc.)
B) Configuración / documentación (YAML, properties, Markdown, JSON, txt, etc.)
C) Excel (.xlsx, .xls, .csv)
D) Word (.docx, .doc)
E) Otro tipo de archivo binario o especial
PASO 3 — Clasificación de errores en código fuente

Objetivo prioritario: que el proyecto compile. No corrijas flujo de negocio ni lógica funcional.

Antes de modificar cualquier archivo de código fuente, clasifica cada problema encontrado en una de estas dos categorías:
🔴 ERROR DE COMPILACIÓN — corregir siempre
Son errores que impiden que el proyecto arranque, sin valor pedagógico:

Import faltante o incorrecto
Clase, método o variable referenciada que no existe en ningún archivo del proyecto
Error de sintaxis
Anotación con atributos inválidos
Dependencia ausente en pom.xml, package.json, etc.
Archivo referenciado que no existe y debe ser creado con implementación mínima

→ CORREGIR estos errores.
🟡 PROBLEMA FUNCIONAL O DE CALIDAD — preservar siempre
Son problemas que no impiden compilar. Pueden ser intencionales para el aprendizaje:

Clave secreta hardcodeada ("secret", "password123")
API deprecada que funciona pero tiene reemplazo moderno
Lógica de negocio incorrecta o incompleta
Código redundante o de baja legibilidad
Falta de validaciones en flujo de negocio
Patrones de diseño incorrectos pero funcionales
Concurrencia no segura
Configuración funcional pero no óptima

→ PRESERVAR tal cual. No corregir, no mejorar, no comentar.
PASO 4 — Procesamiento según tipo de archivo
Tipo A — Código fuente
Aplica únicamente las correcciones clasificadas como 🔴 ERROR DE COMPILACIÓN.
No alteres ningún elemento clasificado como 🟡 PROBLEMA FUNCIONAL O DE CALIDAD.
Si falta un archivo referenciado, créalo con la implementación mínima necesaria para compilar.
Tipo B — Configuración / documentación
Extrae el contenido tal cual, sin modificaciones salvo errores evidentes de sintaxis
(ej: YAML mal indentado).
Tipo C — Excel (.xlsx)
Si viene con contenido real, genera el archivo respetando ese contenido.
Si viene con descripción en lenguaje natural, genera un archivo Excel funcional con:

Fila de encabezados en negrita con color de fondo distintivo
Columnas con ancho ajustado al contenido
Tipos de dato correctos por columna
Validaciones si la descripción lo indica
Hojas nombradas descriptivamente si hay más de una
Filas de ejemplo si no hay datos reales

Tipo D — Word (.docx)
Si viene con contenido real, genera el archivo respetando ese contenido.
Si viene con descripción en lenguaje natural, genera un documento Word funcional con:

Estilos de título (Título 1, Título 2) para jerarquía de secciones
Fuente legible (Calibri o equivalente), tamaño 11-12pt para cuerpo
Márgenes estándar
Tabla de contenido si tiene múltiples secciones
Tablas con encabezados en negrita si aplica

Tipo E — Otro
Genera el archivo con el contenido o estructura más apropiada según la descripción.
PASO 5 — Entrega de archivos
Entregá cada archivo con su ruta completa, respetando exactamente la estructura de rutas
indicada por los marcadores: un bloque por archivo, precedido por su ruta. No generes ZIPs
ni archivos adjuntos.
La entrega debe incluir:

Archivos de código con únicamente los errores de compilación corregidos
Archivos de configuración y documentación sin cambios
Archivos nuevos creados para resolver dependencias de compilación faltantes
Archivos Excel y Word generados desde descripción

IMPORTANTE: Entregá los archivos completos al finalizar. No preguntes si el usuario
quiere recibirlos. Simplemente entregalos; No debes desplegar en el chat el resumen de lo que arreglaste, solo entregá los archivos.

REGLAS IMPORTANTES

No omitas ningún archivo aunque no tenga errores ni modificaciones
Respeta los nombres y rutas exactas indicadas por los marcadores
Si un archivo no tiene marcador claro, infiere el nombre desde su contenido
Si la cadena contiene solo documentación, placeholders o binarios fake, NO la reproduzcas:
aplicá PASO 0 (materializar el proyecto del briefing). Reproducir la carcasa es un fallo.
No agregues texto después del último archivo entregado
No preguntes si el usuario quiere los archivos: simplemente entregalos siempre
Si detectas que falta un archivo de configuración necesario para compilar
(pom.xml, package.json, requirements.txt, build.gradle, etc.), créalo e inclúyelo
inferiendo su contenido desde los imports y frameworks detectados en el código
Nunca corrijas problemas 🟡 aunque parezcan obvios o fáciles de mejorar.
El participante que recibirá este proyecto los debe encontrar y resolver él mismo.


INPUT
Aquí está la cadena con los archivos:

// === ARCHIVO: api/package.json ===
{
  "name": "order-streaming-api",
  "version": "1.0.0",
  "description": "API para visualización de órdenes en tiempo real con Kafka",
  "main": "dist/main.js",
  "scripts": {
    "build": "rimraf dist && tsc",
    "format": "prettier --write \"src/**/*.ts\" \"test/**/*.ts\"",
    "start": "ts-node src/main.ts",
    "start:dev": "nest start --watch",
    "start:prod": "node dist/main",
    "lint": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "test:debug": "node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand"
  },
  "keywords": [],
  "author": "Pragma",
  "license": "MIT",
  "dependencies": {
    "@nestjs/common": "^11.0.0",
    "@nestjs/core": "^11.0.0",
    "@nestjs/platform-express": "^11.0.0",
    "@nestjs/swagger": "^11.4.8",
    "class-transformer": "^0.5.1",
    "class-validator": "^0.14.0",
    "kafkajs": "^2.2.4",
    "rxjs": "^7.8.1"
  },
  "devDependencies": {
    "@nestjs/testing": "^11.0.0",
    "@types/express": "^5.0.0",
    "@types/jest": "^29.5.12",
    "@types/node": "^20.11.19",
    "@types/supertest": "^2.0.16",
    "@typescript-eslint/eslint-plugin": "^6.21.0",
    "@typescript-eslint/parser": "^6.21.0",
    "eslint": "^8.56.0",
    "eslint-config-prettier": "^9.1.0",
    "eslint-plugin-prettier": "^5.1.3",
    "jest": "^29.7.0",
    "prettier": "^3.2.5",
    "rimraf": "^5.0.5",
    "supertest": "^6.3.3",
    "ts-jest": "^29.1.2",
    "ts-node": "^10.9.2",
    "tsconfig-paths": "^4.2.0",
    "typescript": "^5.3.3"
  },
  "jest": {
    "moduleFileExtensions": [
      "js",
      "json",
      "ts"
    ],
    "rootDir": "src",
    "testRegex": ".spec.ts$",
    "transform": {
      "^.+\\.(t|j)s$": "ts-jest"
    },
    "collectCoverageFrom": [
      "**/*.(t|j)s"
    ],
    "coverageDirectory": "../coverage",
    "testEnvironment": "node"
  }
}

// === ARCHIVO: api/tsconfig.json ===
{
  "compilerOptions": {
    "module": "commonjs",
    "declaration": true,
    "removeComments": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "allowSyntheticDefaultImports": true,
    "target": "es2017",
    "sourceMap": true,
    "outDir": "./dist",
    "baseUrl": "./",
    "incremental": true,
    "skipLibCheck": true,
    "strictNullChecks": true,
    "noImplicitAny": true,
    "strictBindCallApply": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "esModuleInterop": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true
  },
  "exclude": [
    "node_modules",
    "dist",
    "test",
    "**/*.spec.ts"
  ]
}

// === ARCHIVO: api/src/domain/order.entity.ts ===
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

// === ARCHIVO: api/src/domain/order.events.ts ===
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

// === ARCHIVO: api/src/shared/dto/order.dto.ts ===
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

// === ARCHIVO: api/src/application/order.service.ts ===
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Order, OrderItem, OrderStatus } from '../domain/order.entity';
import { OrderDto, OrderItemDto } from '../shared/dto/order.dto';
import { OrderEvent, OrderEventType } from '../domain/order.events';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class OrderService {
    private readonly logger = new Logger(OrderService.name);
    private readonly orders: Map<string, Order> = new Map();
    private readonly orderEventsSubject = new Subject<OrderEvent>();

    constructor() {
        this.initializeSampleOrders();
    }

    private initializeSampleOrders(): void {
        const sampleOrders = [
            this.createOrder('ORD-001', 'cust-001', 1500.00, [
                { productId: 'prod-001', name: 'Laptop Pro', quantity: 1, price: 1200.00 },
                { productId: 'prod-002', name: 'Mouse Inalámbrico', quantity: 2, price: 150.00 },
            ]),
            this.createOrder('ORD-002', 'cust-002', 450.50, [
                { productId: 'prod-003', name: 'Teclado Mecánico', quantity: 1, price: 350.50 },
                { productId: 'prod-004', name: 'Alfombrilla XL', quantity: 1, price: 100.00 },
            ]),
            this.createOrder('ORD-003', 'cust-003', 2999.00, [
                { productId: 'prod-005', name: 'Monitor 4K', quantity: 2, price: 1499.50 },
            ]),
        ];

        sampleOrders.forEach(order => {
            this.orders.set(order.id, order);
        });

        this.logger.log(`Inicializadas ${sampleOrders.length} órdenes de ejemplo`);
    }

    private createOrder(
        id: string,
        customerId: string,
        totalAmount: number,
        itemsData: Array<{ productId: string; name: string; quantity: number; price: number }>
    ): Order {
        const items = itemsData.map(
            item => new OrderItem(
                item.productId,
                item.name,
                item.quantity,
                item.price
            )
        );

        const order = new Order(
            id,
            OrderStatus.PENDING,
            totalAmount,
            items,
            customerId
        );

        return order;
    }

    async getOrders(): Promise<OrderDto[]> {
        this.logger.log('Obteniendo todas las órdenes');
        const orders = Array.from(this.orders.values());
        return orders.map(order => this.mapOrderToDto(order));
    }

    async getOrderById(id: string): Promise<OrderDto> {
        this.logger.log(`Obteniendo orden por ID: ${id}`);
        const order = this.orders.get(id);

        if (!order) {
            this.logger.warn(`Orden no encontrada: ${id}`);
            throw new NotFoundException(`Orden con ID ${id} no encontrada`);
        }

        return this.mapOrderToDto(order);
    }

    streamOrders(): Observable<OrderEvent> {
        this.logger.log('Iniciando stream de órdenes');
        return this.orderEventsSubject.asObservable();
    }

    processOrderEvent(event: OrderEvent): void {
        this.logger.log(`Procesando evento: ${event.eventType} para orden ${event.orderId}`);

        switch (event.eventType) {
            case OrderEventType.ORDER_CREATED:
                this.handleOrderCreated(event);
                break;
            case OrderEventType.ORDER_UPDATED:
                this.handleOrderUpdated(event);
                break;
            case OrderEventType.ORDER_CANCELLED:
                this.handleOrderCancelled(event);
                break;
            default:
                this.logger.warn(`Tipo de evento desconocido: ${event.eventType}`);
        }

        this.orderEventsSubject.next(event);
    }

    private handleOrderCreated(event: OrderEvent): void {
        const payload = event.payload as { customerId: string; totalAmount: number; items: any[] };
        const order = this.createOrder(
            event.orderId,
            payload.customerId,
            payload.totalAmount,
            payload.items
        );
        this.orders.set(order.id, order);
        this.logger.log(`Orden creada: ${order.id}`);
    }

    private handleOrderUpdated(event: OrderEvent): void {
        const order = this.orders.get(event.orderId);
        if (order) {
            const payload = event.payload as { newStatus: OrderStatus };
            const newStatus = payload.newStatus;
            order.updateStatus(newStatus);
            this.orders.set(order.id, order);
            this.logger.log(`Orden actualizada: ${order.id} - Estado: ${newStatus}`);
        }
    }

    private handleOrderCancelled(event: OrderEvent): void {
        const order = this.orders.get(event.orderId);
        if (order) {
            order.updateStatus(OrderStatus.CANCELLED);
            this.orders.set(order.id, order);
            this.logger.log(`Orden cancelada: ${order.id}`);
        }
    }

    private mapOrderToDto(order: Order): OrderDto {
        const orderDto = new OrderDto();
        orderDto.id = order.id;
        orderDto.status = order.status;
        orderDto.totalAmount = order.totalAmount;
        orderDto.customerId = order.customerId;
        orderDto.createdAt = order.createdAt.toISOString();
        orderDto.updatedAt = order.updatedAt.toISOString();
        orderDto.items = order.items.map(item => this.mapItemToDto(item));
        return orderDto;
    }

    private mapItemToDto(item: OrderItem): OrderItemDto {
        const itemDto = new OrderItemDto();
        itemDto.productId = item.productId;
        itemDto.name = item.name;
        itemDto.quantity = item.quantity;
        itemDto.price = item.price;
        itemDto.sku = item.sku;
        return itemDto;
    }

    getOrderCount(): number {
        return this.orders.size;
    }

    clearOrders(): void {
        this.orders.clear();
        this.logger.log('Todas las órdenes han sido eliminadas');
    }
}

// === ARCHIVO: api/src/infrastructure/kafka/kafka.module.ts ===
import { Module, Global } from '@nestjs/common';
import { KafkaConfigService } from './kafka.config';
import { KafkaConsumerService } from './kafka.consumer';

@Global()
@Module({
  providers: [KafkaConfigService, KafkaConsumerService],
  exports: [KafkaConfigService, KafkaConsumerService],
})
export class KafkaModule {}

// === ARCHIVO: api/src/infrastructure/kafka/kafka.consumer.ts ===
import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { Kafka, Consumer, EachMessagePayload } from 'kafkajs';
import { OrderEventType, OrderEvent } from '../../domain/order.events';
import { OrderService } from '../../application/order.service';

@Injectable()
export class KafkaConsumerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(KafkaConsumerService.name);
  private kafka: Kafka;
  private consumer: Consumer;
  private readonly subscribedEvents = new Set<string>();
  private messageHandlers: Array<(event: OrderEvent) => void> = [];
  private connected = false;

  constructor(private readonly orderService: OrderService) {
    this.kafka = new Kafka({
      clientId: 'order-streaming-api',
      brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
      retry: {
        initialRetryTime: 100,
        retries: 8,
      },
    });

    this.consumer = this.kafka.consumer({
      groupId: 'order-consumer-group',
      sessionTimeout: 30000,
      heartbeatInterval: 3000,
    });
  }

  async onModuleInit() {
    await this.connect();
    await this.subscribeToTopics();
    await this.startConsuming();
  }

  async onModuleDestroy() {
    await this.disconnect();
  }

  private async connect() {
    try {
      await this.consumer.connect();
      this.connected = true;
      this.logger.log('Kafka consumer connected successfully');
    } catch (error) {
      this.logger.error('Failed to connect Kafka consumer', error);
      throw error;
    }
  }

  private async subscribeToTopics() {
    const topics = [
      process.env.KAFKA_ORDER_TOPIC || 'orders-topic',
    ];

    for (const topic of topics) {
      await this.consumer.subscribe({ topic, fromBeginning: false });
      this.logger.log(`Subscribed to topic: ${topic}`);
    }
  }

  private async startConsuming() {
    await this.consumer.run({
      eachMessage: async (payload: EachMessagePayload) => {
        await this.handleMessage(payload);
      },
    });

    this.logger.log('Kafka consumer started processing messages');
  }

  private async handleMessage(payload: EachMessagePayload) {
    const { topic, partition, message } = payload;
    const messageValue = message.value?.toString();

    if (!messageValue) {
      this.logger.warn('Received empty message');
      return;
    }

    try {
      const event: OrderEvent = JSON.parse(messageValue);
      this.logger.debug(`Received event: ${event.eventType} for order ${event.orderId}`);

      await this.processEvent(event);
      this.notifyHandlers(event);
    } catch (error) {
      this.logger.error(`Error processing message from ${topic}[${partition}]`, error);
    }
  }

  private async processEvent(event: OrderEvent) {
    switch (event.eventType) {
      case OrderEventType.ORDER_CREATED:
        await this.handleOrderCreated(event);
        break;
      case OrderEventType.ORDER_UPDATED:
        await this.handleOrderUpdated(event);
        break;
      case OrderEventType.ORDER_CANCELLED:
        await this.handleOrderCancelled(event);
        break;
      default:
        this.logger.warn(`Unknown event type: ${event.eventType}`);
    }
  }

  private async handleOrderCreated(event: OrderEvent) {
    this.logger.log(`Processing ORDER_CREATED for order ${event.orderId}`);
    await this.orderService.processOrderEvent(event);
  }

  private async handleOrderUpdated(event: OrderEvent) {
    this.logger.log(`Processing ORDER_UPDATED for order ${event.orderId}`);
    await this.orderService.processOrderEvent(event);
  }

  private async handleOrderCancelled(event: OrderEvent) {
    this.logger.log(`Processing ORDER_CANCELLED for order ${event.orderId}`);
    await this.orderService.processOrderEvent(event);
  }

  private notifyHandlers(event: OrderEvent) {
    for (const handler of this.messageHandlers) {
      try {
        handler(event);
      } catch (error) {
        this.logger.error('Error in message handler', error);
      }
    }
  }

  onMessage(handler: (event: OrderEvent) => void) {
    this.messageHandlers.push(handler);
    this.logger.debug(`Registered new message handler. Total handlers: ${this.messageHandlers.length}`);
  }

  removeHandler(handler: (event: OrderEvent) => void) {
    const index = this.messageHandlers.indexOf(handler);
    if (index > -1) {
      this.messageHandlers.splice(index, 1);
      this.logger.debug(`Removed message handler. Total handlers: ${this.messageHandlers.length}`);
    }
  }

  getSubscribedEvents(): string[] {
    return Array.from(this.subscribedEvents);
  }

  isConnected(): boolean {
    return this.connected;
  }

  private async disconnect() {
    try {
      await this.consumer.disconnect();
      this.connected = false;
      this.logger.log('Kafka consumer disconnected');
    } catch (error) {
      this.logger.error('Error disconnecting Kafka consumer', error);
    }
  }
}

// === ARCHIVO: api/src/infrastructure/controllers/order.controller.ts ===
import { Controller, Get, Param, Res, HttpStatus, HttpCode, Logger, NotFoundException } from '@nestjs/common';
import { Response } from 'express';
import { OrderService } from '../../application/order.service';
import { OrderDto } from '../../shared/dto/order.dto';
import { KafkaConsumerService } from '../kafka/kafka.consumer';
import { OrderEvent } from '../../domain/order.events';

@Controller('orders')
export class OrderController {
  private readonly logger = new Logger(OrderController.name);

  constructor(
    private readonly orderService: OrderService,
    private readonly kafkaConsumer: KafkaConsumerService,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getOrders(): Promise<OrderDto[]> {
    this.logger.debug('GET /orders - Fetching all orders');
    const orders = await this.orderService.getOrders();
    return orders;
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getOrderById(@Param('id') id: string): Promise<OrderDto> {
    this.logger.debug(`GET /orders/${id} - Fetching order by ID`);
    const order = await this.orderService.getOrderById(id);
    
    if (!order) {
      this.logger.warn(`Order not found: ${id}`);
      throw new NotFoundException(`Order with id ${id} not found`);
    }
    
    return order;
  }

  @Get('stream')
  async streamOrders(@Res() res: Response): Promise<void> {
    this.logger.debug('GET /orders/stream - Starting SSE stream');
    
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    res.flushHeaders();

    const clientId = Date.now().toString();
    this.logger.log(`SSE client connected: ${clientId}`);

    const handleEvent = (event: OrderEvent) => {
      const data = this.formatSseEvent(event);
      res.write(`data: ${JSON.stringify(data)}\n\n`);
      this.logger.debug(`Sent SSE event: ${event.eventType} for order ${event.orderId}`);
    };

    this.kafkaConsumer.onMessage(handleEvent);

    res.on('close', () => {
      this.kafkaConsumer.removeHandler(handleEvent);
      this.logger.log(`SSE client disconnected: ${clientId}`);
    });

    const initialOrders = await this.orderService.getOrders();
    res.write(`data: ${JSON.stringify({ type: 'initial', orders: initialOrders })}\n\n`);
  }

  private formatSseEvent(event: OrderEvent): object {
    return {
      type: 'event',
      eventType: event.eventType,
      eventId: event.eventId,
      orderId: event.orderId,
      timestamp: event.timestamp instanceof Date ? event.timestamp.toISOString() : event.timestamp,
      payload: event.payload,
    };
  }
}

// === ARCHIVO: api/src/infrastructure/kafka/kafka.config.ts ===
import { Injectable } from '@nestjs/common';
import { Kafka, KafkaConfig, ConsumerConfig, SASLMechanism } from 'kafkajs';

const getEnv = (key: string, defaultValue?: string): string => {
    const value = process.env[key];
    if (!value && !defaultValue) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
    return value || defaultValue!;
};

export interface KafkaConsumerProperties {
    client: {
        clientId: string;
        brokers: string[];
        ssl?: boolean;
        sasl?: {
            mechanism: 'plain' | 'scram-sha-256' | 'scram-sha-512';
            username: string;
            password: string;
        };
        retry?: {
            initialRetryTime: number;
            retries: number;
        };
    };
    consumer: {
        groupId: string;
        sessionTimeout?: number;
        heartbeatInterval?: number;
        rebalanceTimeout?: number;
        maxWaitTimeInMs?: number;
        maxBytes?: number;
        maxBytesPerPartition?: number;
        minBytes?: number;
        maxWaitTime?: number;
        maxRetry?: number;
    };
    topics: {
        orders: string;
        ordersDlq: string;
    };
    run: {
        autoCommit: boolean;
        autoCommitIntervalMs?: number;
        autoOffsetReset: 'earliest' | 'latest';
        partitionAssigners?: any[];
        sessionTimeout?: number;
        heartbeatInterval?: number;
    };
}

export const kafkaConfig: KafkaConsumerProperties = {
    client: {
        clientId: getEnv('KAFKA_CLIENT_ID', 'order-streaming-api'),
        brokers: getEnv('KAFKA_BROKERS', 'localhost:9092').split(',').map(b => b.trim()),
        ssl: getEnv('KAFKA_SSL', 'false').toLowerCase() === 'true',
        sasl: getEnv('KAFKA_SASL_ENABLED', 'false').toLowerCase() === 'true' ? {
            mechanism: getEnv('KAFKA_SASL_MECHANISM', 'plain') as 'plain' | 'scram-sha-256' | 'scram-sha-512',
            username: getEnv('KAFKA_SASL_USERNAME'),
            password: getEnv('KAFKA_SASL_PASSWORD'),
        } : undefined,
        retry: {
            initialRetryTime: 3000,
            retries: 8,
        },
    },
    consumer: {
        groupId: getEnv('KAFKA_CONSUMER_GROUP_ID', 'order-streaming-api-group'),
        sessionTimeout: parseInt(getEnv('KAFKA_SESSION_TIMEOUT', '30000'), 10),
        heartbeatInterval: parseInt(getEnv('KAFKA_HEARTBEAT_INTERVAL', '3000'), 10),
        rebalanceTimeout: parseInt(getEnv('KAFKA_REBALANCE_TIMEOUT', '60000'), 10),
        maxWaitTimeInMs: parseInt(getEnv('KAFKA_MAX_WAIT_TIME', '5000'), 10),
        maxBytes: parseInt(getEnv('KAFKA_MAX_BYTES', '1048576'), 10),
        maxBytesPerPartition: parseInt(getEnv('KAFKA_MAX_BYTES_PER_PARTITION', '1048576'), 10),
        minBytes: parseInt(getEnv('KAFKA_MIN_BYTES', '1'), 10),
    },
    topics: {
        orders: getEnv('KAFKA_TOPIC_ORDERS', 'orders'),
        ordersDlq: getEnv('KAFKA_TOPIC_ORDERS_DLQ', 'orders.dlq'),
    },
    run: {
        autoCommit: getEnv('KAFKA_AUTO_COMMIT', 'false').toLowerCase() === 'true',
        autoCommitIntervalMs: parseInt(getEnv('KAFKA_AUTO_COMMIT_INTERVAL', '5000'), 10),
        autoOffsetReset: getEnv('KAFKA_AUTO_OFFSET_RESET', 'earliest') as 'earliest' | 'latest',
    },
};

export const createKafkaConfig = (): KafkaConfig => {
    const config: KafkaConfig = {
        clientId: kafkaConfig.client.clientId,
        brokers: kafkaConfig.client.brokers,
        ssl: kafkaConfig.client.ssl,
        retry: kafkaConfig.client.retry,
    };

    if (kafkaConfig.client.sasl) {
        const mechanism: SASLMechanism = kafkaConfig.client.sasl.mechanism as SASLMechanism;
        config.sasl = {
            mechanism,
            username: kafkaConfig.client.sasl.username,
            password: kafkaConfig.client.sasl.password,
        };
    }

    return config;
};

export const createConsumerConfig = (): ConsumerConfig => {
    return {
        groupId: kafkaConfig.consumer.groupId,
        sessionTimeout: kafkaConfig.consumer.sessionTimeout,
        heartbeatInterval: kafkaConfig.consumer.heartbeatInterval,
        rebalanceTimeout: kafkaConfig.consumer.rebalanceTimeout,
        maxWaitTimeInMs: kafkaConfig.consumer.maxWaitTimeInMs,
        maxBytes: kafkaConfig.consumer.maxBytes,
        maxBytesPerPartition: kafkaConfig.consumer.maxBytesPerPartition,
        minBytes: kafkaConfig.consumer.minBytes,
    };
};

export const getTopics = (): string[] => {
    return [kafkaConfig.topics.orders, kafkaConfig.topics.ordersDlq];
};

export const getOrderTopic = (): string => {
    return kafkaConfig.topics.orders;
};

export const getDlqTopic = (): string => {
    return kafkaConfig.topics.ordersDlq;
};

@Injectable()
export class KafkaConfigService {
    getClientConfig(): KafkaConfig {
        return createKafkaConfig();
    }

    getConsumerConfig(): ConsumerConfig {
        return createConsumerConfig();
    }

    getTopicsList(): string[] {
        return getTopics();
    }

    getOrderTopicName(): string {
        return getOrderTopic();
    }

    getDlqTopicName(): string {
        return getDlqTopic();
    }

    getFullConfig(): KafkaConsumerProperties {
        return kafkaConfig;
    }
}

// === ARCHIVO: api/src/main.ts ===
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  logger.log(`Aplicación iniciada en http://localhost:${port}`);
  logger.log(`Endpoints disponibles:`);
  logger.log(`  GET /orders - Listar todas las órdenes`);
  logger.log(`  GET /orders/:id - Obtener orden por ID`);
  logger.log(`  GET /orders/stream - Streaming de eventos de órdenes`);
}

bootstrap();

// === ARCHIVO: api/src/app.module.ts ===
import { Module, Logger } from '@nestjs/common';
import { OrderController } from './infrastructure/controllers/order.controller';
import { OrderService } from './application/order.service';
import { KafkaConsumerService } from './infrastructure/kafka/kafka.consumer';
import { KafkaModule } from './infrastructure/kafka/kafka.module';

@Module({
  imports: [KafkaModule],
  controllers: [OrderController],
  providers: [
    OrderService,
    KafkaConsumerService,
    {
      provide: 'LOGGER',
      useValue: new Logger('AppModule'),
    },
  ],
})
export class AppModule {
  constructor() {
    const logger = new Logger('AppModule');
    logger.log('Módulo de aplicación inicializado');
    logger.log('Componentes registrados: OrderController, OrderService, KafkaConsumerService');
  }
}

// === ARCHIVO: api/test/order.controller.spec.ts ===
import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from '../src/infrastructure/controllers/order.controller';
import { OrderService } from '../src/application/order.service';
import { KafkaConsumerService } from '../src/infrastructure/kafka/kafka.consumer';
import { OrderDto } from '../src/shared/dto/order.dto';
import { OrderStatus } from '../src/shared/enums/order-status.enum';
import { OrderEventType, OrderEvent } from '../src/domain/order.events';
import { Observable } from 'rxjs';

describe('OrderController', () => {
  let controller: OrderController;
  let orderService: jest.Mocked<OrderService>;
  let kafkaConsumer: jest.Mocked<KafkaConsumerService>;

  const mockOrderDto: OrderDto = {
    id: 'order-123',
    status: OrderStatus.PENDING,
    totalAmount: 150.00,
    items: [
      {
        productId: 'prod-001',
        name: 'Producto de prueba',
        quantity: 2,
        price: 75.00,
        sku: 'SKU-001',
      },
    ],
    createdAt: '2024-01-15T10:00:00.000Z',
    updatedAt: '2024-01-15T10:00:00.000Z',
    customerId: 'customer-456',
  };

  beforeEach(async () => {
    const mockOrderService = {
      getOrders: jest.fn(),
      getOrderById: jest.fn(),
      streamOrders: jest.fn(),
      getOrderCount: jest.fn(),
      clearOrders: jest.fn(),
    };

    const mockKafkaConsumer = {
      onMessage: jest.fn(),
      removeHandler: jest.fn(),
      getSubscribedEvents: jest.fn().mockReturnValue(['order.created', 'order.updated', 'order.cancelled']),
      isConnected: jest.fn().mockReturnValue(true),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        { provide: OrderService, useValue: mockOrderService },
        { provide: KafkaConsumerService, useValue: mockKafkaConsumer },
      ],
    }).compile();

    controller = module.get<OrderController>(OrderController);
    orderService = module.get(OrderService);
    kafkaConsumer = module.get(KafkaConsumerService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getOrders', () => {
    it('debe retornar un array de OrderDto cuando hay órdenes existentes', async () => {
      const mockOrders: OrderDto[] = [mockOrderDto];
      orderService.getOrders.mockResolvedValue(mockOrders);

      const result = await controller.getOrders();

      expect(orderService.getOrders).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockOrders);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('order-123');
    });

    it('debe retornar array vacío cuando no hay órdenes', async () => {
      orderService.getOrders.mockResolvedValue([]);

      const result = await controller.getOrders();

      expect(orderService.getOrders).toHaveBeenCalledTimes(1);
      expect(result).toEqual([]);
      expect(Array.isArray(result)).toBe(true);
    });

    it('debe manejar errores del servicio y propagarlos', async () => {
      const error = new Error('Error al obtener órdenes');
      orderService.getOrders.mockRejectedValue(error);

      await expect(controller.getOrders()).rejects.toThrow('Error al obtener órdenes');
    });
  });

  describe('getOrderById', () => {
    it('debe retornar OrderDto cuando la orden existe', async () => {
      orderService.getOrderById.mockResolvedValue(mockOrderDto);

      const result = await controller.getOrderById('order-123');

      expect(orderService.getOrderById).toHaveBeenCalledTimes(1);
      expect(orderService.getOrderById).toHaveBeenCalledWith('order-123');
      expect(result).toEqual(mockOrderDto);
      expect(result.id).toBe('order-123');
    });

    it('debe retornar null cuando la orden no existe', async () => {
      orderService.getOrderById.mockResolvedValue(null);

      const result = await controller.getOrderById('non-existent-id');

      expect(orderService.getOrderById).toHaveBeenCalledWith('non-existent-id');
      expect(result).toBeNull();
    });

    it('debe manejar errores de validación del ID', async () => {
      orderService.getOrderById.mockRejectedValue(new Error('ID inválido'));

      await expect(controller.getOrderById('')).rejects.toThrow();
    });
  });

  describe('streamOrders', () => {
    it('debe configurar headers correctos para SSE', async () => {
      const mockResponse = {
        setHeader: jest.fn(),
        write: jest.fn(),
        end: jest.fn(),
        statusCode: 200,
      } as unknown as import('express').Response;

      orderService.streamOrders.mockReturnValue(new Observable((subscriber) => {
        subscriber.next({
          eventId: 'event-1',
          eventType: OrderEventType.ORDER_CREATED,
          orderId: 'order-123',
          timestamp: new Date(),
          payload: { customerId: 'customer-456', totalAmount: 150 },
        });
      }));

      await controller.streamOrders(mockResponse);

      expect(mockResponse.setHeader).toHaveBeenCalledWith('Content-Type', 'text/event-stream');
      expect(mockResponse.setHeader).toHaveBeenCalledWith('Cache-Control', 'no-cache');
      expect(mockResponse.setHeader).toHaveBeenCalledWith('Connection', 'keep-alive');
      expect(mockResponse.setHeader).toHaveBeenCalledWith('X-Accel-Buffering', 'no');
    });

    it('debe enviar eventos en formato SSE válido', async () => {
      const mockResponse = {
        setHeader: jest.fn(),
        write: jest.fn(),
        end: jest.fn(),
        statusCode: 200,
      } as unknown as import('express').Response;

      const testEvent: OrderEvent = {
        eventId: 'event-test-001',
        eventType: OrderEventType.ORDER_UPDATED,
        orderId: 'order-456',
        timestamp: new Date('2024-01-15T12:00:00Z'),
        payload: {
          previousStatus: OrderStatus.PENDING,
          newStatus: OrderStatus.CONFIRMED,
          updatedAt: new Date(),
        },
      };

      orderService.streamOrders.mockReturnValue(new Observable((subscriber) => {
        subscriber.next(testEvent);
        subscriber.complete();
      }));

      await controller.streamOrders(mockResponse);

      expect(mockResponse.write).toHaveBeenCalled();
      const sseData = (mockResponse.write as jest.Mock).mock.calls[0][0];
      expect(sseData).toContain('event:');
      expect(sseData).toContain('data:');
    });

    it('debe manejar desconexión del cliente correctamente', async () => {
      const mockResponse = {
        setHeader: jest.fn(),
        write: jest.fn(),
        end: jest.fn(),
        statusCode: 200,
        on: jest.fn(),
      } as unknown as import('express').Response;

      orderService.streamOrders.mockReturnValue(new Observable(() => {}));

      await controller.streamOrders(mockResponse);

      expect(mockResponse.on).toHaveBeenCalledWith('close', expect.any(Function));
    });

    it('debe manejar errores en el stream y cerrar conexión', async () => {
      const mockResponse = {
        setHeader: jest.fn(),
        write: jest.fn(),
        end: jest.fn(),
        statusCode: 200,
      } as unknown as import('express').Response;

      orderService.streamOrders.mockReturnValue(new Observable((subscriber) => {
        subscriber.error(new Error('Error en stream'));
      }));

      await controller.streamOrders(mockResponse);

      expect(mockResponse.end).toHaveBeenCalled();
    });
  });

  describe('manejo de dependencias', () => {
    it('debe inyectar OrderService correctamente', () => {
      expect(orderService).toBeDefined();
      expect(typeof orderService.getOrders).toBe('function');
      expect(typeof orderService.getOrderById).toBe('function');
      expect(typeof orderService.streamOrders).toBe('function');
    });

    it('debe inyectar KafkaConsumerService correctamente', () => {
      expect(kafkaConsumer).toBeDefined();
      expect(typeof kafkaConsumer.onMessage).toBe('function');
      expect(typeof kafkaConsumer.removeHandler).toBe('function');
      expect(kafkaConsumer.isConnected()).toBe(true);
    });
  });

  describe('integración con Kafka', () => {
    it('debe verificar conexión con Kafka antes de procesar', () => {
      const isConnected = kafkaConsumer.isConnected();
      expect(isConnected).toBe(true);
      expect(kafkaConsumer.getSubscribedEvents()).toContain('order.created');
      expect(kafkaConsumer.getSubscribedEvents()).toContain('order.updated');
      expect(kafkaConsumer.getSubscribedEvents()).toContain('order.cancelled');
    });

    it('debe registrar handler de mensajes de Kafka', () => {
      const handler = jest.fn();
      kafkaConsumer.onMessage(handler);
      expect(kafkaConsumer.onMessage).toHaveBeenCalledWith(handler);
    });
  });
});

// === ARCHIVO: api/src/shared/enums/order-status.enum.ts ===
export enum OrderStatus {
    PENDING = 'PENDING',
    CONFIRMED = 'CONFIRMED',
    PROCESSING = 'PROCESSING',
    SHIPPED = 'SHIPPED',
    DELIVERED = 'DELIVERED',
    CANCELLED = 'CANCELLED'
}

// === ARCHIVO: client/package.json ===
{
  "name": "client",
  "version": "0.0.1",
  "scripts": {
    "ng": "ng",
    "start": "ng serve",
    "build": "ng build",
    "watch": "ng build --watch --configuration development",
    "test": "jest",
    "lint": "ng lint"
  },
  "private": true,
  "dependencies": {
    "@angular/animations": "~20.0.0",
    "@angular/cdk": "~20.0.0",
    "@angular/common": "~20.0.0",
    "@angular/compiler": "~20.0.0",
    "@angular/core": "~20.0.0",
    "@angular/forms": "~20.0.0",
    "@angular/material": "~20.0.0",
    "@angular/platform-browser": "~20.0.0",
    "@angular/platform-browser-dynamic": "~20.0.0",
    "@angular/router": "~20.0.0",
    "rxjs": "~7.8.1",
    "event-source-polyfill": "^1.0.31",
    "tslib": "^2.6.2",
    "zone.js": "~0.15.1"
  },
  "devDependencies": {
    "@angular-devkit/build-angular": "~20.0.0",
    "@angular/cli": "~20.0.0",
    "@angular/compiler-cli": "~20.0.0",
    "@angular-eslint/eslint-plugin": "~18.0.0",
    "@types/jest": "^29.5.12",
    "jest": "^29.7.0",
    "jest-preset-angular": "^14.0.3",
    "typescript": "~5.8.3"
  },
  "jest": {
    "preset": "jest-preset-angular",
    "setupFilesAfterEnv": ["<rootDir>/setup-jest.ts"],
    "globalSetup": "jest-preset-angular/global-setup"
  }
}

// === ARCHIVO: client/angular.json ===
{
  "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
  "version": 1,
  "newProjectRoot": "projects",
  "projects": {
    "client": {
      "projectType": "application",
      "schematics": {
        "@schematics/angular:component": {
          "standalone": true,
          "style": "scss"
        },
        "@schematics/angular:application": {
          "strict": true
        }
      },
      "root": "",
      "sourceRoot": "src",
      "prefix": "app",
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:application",
          "options": {
            "outputPath": "dist/client",
            "index": "src/index.html",
            "browser": "src/main.ts",
            "polyfills": [
              "zone.js"
            ],
            "tsConfig": "tsconfig.app.json",
            "assets": [
              "src/favicon.ico",
              "src/assets"
            ],
            "styles": [
              "node_modules/@angular/material/prebuilt-themes/indigo-pink.css"
            ],
            "scripts": []
          },
          "configurations": {
            "development": {
              "optimization": false,
              "outputHashing": "all",
              "sourceMap": true,
              "namedChunks": true,
              "extractLicenses": false,
              "vendorChunk": true,
              "buildOptimizer": false
            },
            "production": {
              "optimization": true,
              "outputHashing": "all",
              "sourceMap": false,
              "namedChunks": false,
              "extractLicenses": true,
              "vendorChunk": false,
              "buildOptimizer": true,
              "fileReplacements": [
                {
                  "replace": "src/environments/environment.ts",
                  "with": "src/environments/environment.prod.ts"
                }
              ]
            }
          },
          "defaultConfiguration": "production"
        },
        "serve": {
          "builder": "@angular-devkit/build-angular:dev-server",
          "options": {
            "buildTarget": "client:build"
          },
          "configurations": {
            "development": {
              "buildTarget": "client:build:development"
            },
            "production": {
              "buildTarget": "client:build:production"
            }
          }
        },
        "extract-i18n": {
          "builder": "@angular-devkit/build-angular:extract-i18n",
          "options": {
            "buildTarget": "client:build"
          }
        },
        "lint": {
          "builder": "@angular-devkit/build-angular:tslint",
          "options": {
            "tsConfig": [
              "tsconfig.app.json",
              "tsconfig.spec.json",
              "e2e/tsconfig.json"
            ],
            "exclude": [
              "**/node_modules/**"
            ]
          }
        }
      }
    }
  },
  "cli": {
    "analytics": false
  }
}

// === ARCHIVO: client/tsconfig.json ===
{
  "compileOnSave": false,
  "compilerOptions": {
    "baseUrl": "./",
    "outDir": "./dist/out-tsc",
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "sourceMap": true,
    "declaration": false,
    "downlevelIteration": true,
    "experimentalDecorators": false,
    "moduleResolution": "node",
    "importHelpers": true,
    "target": "ES2022",
    "module": "ES2022",
    "useDefineForClassFields": false,
    "lib": [
      "ES2022",
      "dom",
      "dom.iterable"
    ],
    "paths": {
      "@app/*": ["src/app/*"]
    }
  },
  "angularCompilerOptions": {
    "enableI18nLegacyMessageIdFormat": false,
    "strictInjectionParameters": true,
    "strictInputAccessModifiers": true,
    "strictTemplates": true,
    "strictPropertyInitialization": true
  },
  "exclude": [
    "node_modules",
    "**/*.spec.ts"
  ]
}

// === ARCHIVO: client/src/app/shared/models/order.model.ts ===
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

// === ARCHIVO: client/src/app/core/services/order.service.ts ===
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

// === ARCHIVO: client/src/app/core/interceptors/error.interceptor.ts ===
import { Injectable, inject } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Ocurrió un error desconocido';

        if (error.error instanceof ErrorEvent) {
          // Error del lado del cliente
          errorMessage = `Error: ${error.error.message}`;
        } else {
          // Error del lado del servidor
          switch (error.status) {
            case 0:
              errorMessage = 'No se pudo conectar con el servidor';
              break;
            case 401:
              errorMessage = 'No autorizado. Por favor inicie sesión';
              this.router.navigate(['/login']);
              break;
            case 403:
              errorMessage = 'Acceso denegado';
              this.router.navigate(['/unauthorized']);
              break;
            case 404:
              errorMessage = 'Recurso no encontrado';
              break;
            case 500:
              errorMessage = 'Error interno del servidor';
              break;
            case 503:
              errorMessage = 'Servicio no disponible';
              break;
            default:
              errorMessage = `Error ${error.status}: ${error.message}`;
          }
        }

        // Mostrar notificación al usuario
        this.snackBar.open(errorMessage, 'Cerrar', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });

        return throwError(() => new Error(errorMessage));
      })
    );
  }
}

// === ARCHIVO: client/src/index.html ===
<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>Client - Órdenes en Tiempo Real</title>
  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="Plataforma de comercio electrónico - Visualización de órdenes en tiempo real">
  <meta name="theme-color" content="#1976d2">
  <link rel="icon" type="image/x-icon" href="favicon.ico">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
</head>
<body class="mat-typography">
  <app-root></app-root>
  <noscript>
    <div style="padding: 40px; text-align: center; font-family: sans-serif;">
      <h1>JavaScript Requerido</h1>
      <p>Esta aplicación requiere JavaScript para funcionar. Por favor, habilite JavaScript en su navegador.</p>
    </div>
  </noscript>
</body>
</html>

// === ARCHIVO: client/src/app/features/orders/orders.component.ts ===
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

// === ARCHIVO: client/src/app/features/orders/orders.component.html ===
<section 
  class="orders-container" 
  aria-labelledby="orders-title"
  role="region"
  aria-label="Panel de visualización de órdenes"
>
  <header class="orders-header">
    <div class="orders-header__content">
      <h1 id="orders-title" class="orders-header__title">
        <mat-icon class="orders-header__icon" aria-hidden="true">shopping_cart</mat-icon>
        Órdenes en Tiempo Real
      </h1>
      <p class="orders-header__subtitle">
        Visualiza y gestiona las órdenes de tu plataforma de comercio electrónico
      </p>
    </div>
    <div class="orders-header__actions">
      <button 
        mat-raised-button 
        color="primary"
        (click)="refreshOrders()"
        class="orders-header__refresh"
        aria-label="Actualizar lista de órdenes"
      >
        <mat-icon aria-hidden="true">refresh</mat-icon>
        Actualizar
      </button>
    </div>
  </header>

  <div 
    *ngIf="error() as errorMessage" 
    class="orders-error"
    role="alert"
    aria-live="assertive"
  >
    <mat-icon aria-hidden="true">error_outline</mat-icon>
    <span class="orders-error__message">{{ errorMessage }}</span>
    <button 
      mat-button 
      color="warn"
      (click)="clearError()"
      class="orders-error__dismiss"
      aria-label="Descartar error"
    >
      Descartar
    </button>
  </div>

  <div 
    *ngIf="loading()" 
    class="orders-loading"
    role="status"
    aria-live="polite"
    aria-label="Cargando órdenes"
  >
    <mat-spinner diameter="48" aria-hidden="true"></mat-spinner>
    <span class="orders-loading__text">Cargando órdenes...</span>
  </div>

  <main 
    *ngIf="!loading()" 
    class="orders-content"
    aria-label="Lista de órdenes"
  >
    <div 
      *ngIf="orders().length === 0" 
      class="orders-empty"
      role="status"
      aria-live="polite"
    >
      <mat-icon class="orders-empty__icon" aria-hidden="true">inbox</mat-icon>
      <p class="orders-empty__text">No hay órdenes disponibles</p>
      <p class="orders-empty__hint">Las órdenes aparecerán aquí cuando se creen</p>
    </div>

    <ul 
      *ngIf="orders().length > 0" 
      class="orders-list"
      role="list"
      aria-label="Listado de órdenes"
    >
      <li 
        *ngFor="let order of orders(); trackBy: trackByOrderId" 
        class="orders-list__item"
        [attr.id]="'order-' + order.id"
      >
        <app-order-card 
          [order]="order"
          class="orders-list__card"
        ></app-order-card>
      </li>
    </ul>
  </main>

  <footer class="orders-footer">
    <div class="orders-footer__stats" aria-label="Estadísticas de órdenes">
      <span class="orders-footer__count">
        <strong>{{ orders().length }}</strong> órdenes
      </span>
      <span class="orders-footer__divider" aria-hidden="true">|</span>
      <span class="orders-footer__status">
        <span 
          class="orders-footer__indicator orders-footer__indicator--active" 
          aria-hidden="true"
        ></span>
        Conexión activa
      </span>
    </div>
  </footer>
</section>

// === ARCHIVO: client/src/app/features/orders/orders.component.scss ===
.orders-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f5f5f5;
  font-family: 'Roboto', sans-serif;
}

.orders-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 32px;
  background: linear-gradient(135deg, #3f51b5 0%, #303f9f 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

  &__content {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &__title {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 0;
    font-size: 28px;
    font-weight: 500;
    letter-spacing: 0.5px;
  }

  &__icon {
    font-size: 32px;
    width: 32px;
    height: 32px;
  }

  &__subtitle {
    margin: 0;
    font-size: 14px;
    opacity: 0.9;
    font-weight: 300;
  }

  &__actions {
    display: flex;
    gap: 12px;
  }

  &__refresh {
    display: flex;
    align-items: center;
    gap: 8px;
    transition: transform 0.2s ease, box-shadow 0.2s ease;

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
    }

    &:active {
      transform: translateY(0);
    }

    mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }
  }
}

.orders-error {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 24px;
  margin: 24px 32px;
  background-color: #ffebee;
  border-left: 4px solid #f44336;
  border-radius: 4px;
  color: #c62828;

  mat-icon {
    color: #f44336;
    font-size: 24px;
    width: 24px;
    height: 24px;
  }

  &__message {
    flex: 1;
    margin: 0;
    font-size: 14px;
    font-weight: 500;
  }

  &__dismiss {
    color: #c62828;
  }
}

.orders-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 64px;
  gap: 24px;

  &__text {
    font-size: 16px;
    color: #757575;
    font-weight: 400;
  }
}

.orders-content {
  flex: 1;
  padding: 24px 32px;
}

.orders-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 32px;
  text-align: center;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);

  &__icon {
    font-size: 64px;
    width: 64px;
    height: 64px;
    color: #bdbdbd;
    margin-bottom: 16px;
  }

  &__text {
    margin: 0 0 8px;
    font-size: 18px;
    font-weight: 500;
    color: #424242;
  }

  &__hint {
    margin: 0;
    font-size: 14px;
    color: #757575;
  }
}

.orders-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 24px;
  list-style: none;
  margin: 0;
  padding: 0;

  &__item {
    transition: transform 0.2s ease;

    &:hover {
      transform: translateY(-2px);
    }
  }

  &__card {
    display: block;
    animation: fadeIn 0.3s ease-out;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

:host ::ng-deep .highlight {
  animation: highlight-pulse 2s ease-out;
}

@keyframes highlight-pulse {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(63, 81, 181, 0);
  }
  25%, 75% {
    box-shadow: 0 0 0 8px rgba(63, 81, 181, 0.3);
  }
}

.orders-footer {
  padding: 16px 32px;
  background-color: white;
  border-top: 1px solid #e0e0e0;
  box-shadow: 0 -1px 3px rgba(0, 0, 0, 0.08);

  &__stats {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 14px;
    color: #616161;
  }

  &__count {
    font-weight: 500;
    color: #424242;
  }

  &__divider {
    color: #e0e0e0;
  }

  &__status {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &__indicator {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: #bdbdbd;

    &--active {
      background-color: #4caf50;
      box-shadow: 0 0 4px rgba(76, 175, 80, 0.6);
      animation: pulse 2s infinite;
    }
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

@media (max-width: 768px) {
  .orders-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    padding: 16px;

    &__title {
      font-size: 22px;
    }

    &__actions {
      width: 100%;

      .orders-header__refresh {
        width: 100%;
        justify-content: center;
      }
    }
  }

  .orders-content {
    padding: 16px;
  }

  .orders-list {
    grid-template-columns: 1fr;
  }
}

// === ARCHIVO: client/src/app/shared/components/order-card/order-card.component.ts ===
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

// === ARCHIVO: client/src/environments/environment.ts ===
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000',
  wsEndpoint: 'ws://localhost:3000',
  sseEndpoint: 'http://localhost:3000/orders/stream',
  retryAttempts: 3,
  retryDelay: 1000,
  requestTimeout: 30000,
  cacheEnabled: true,
  cacheTTL: 300000,
  maxConcurrentRequests: 10,
  enableDebugMode: true,
  logLevel: 'debug' as const,
  enablePerformanceMonitoring: true,
  enableErrorTracking: true,
  featureFlags: {
    enableRealTimeUpdates: true,
    enableOrderNotifications: true,
    enableOrderAnalytics: false,
    enableDarkMode: false,
    enableExperimentalUI: false
  },
  pagination: {
    defaultPageSize: 20,
    pageSizeOptions: [10, 20, 50, 100]
  },
  ui: {
    animationsEnabled: true,
    skeletonLoadingEnabled: true,
    toastDuration: 4000,
    confirmDialogTimeout: 10000
  },
  security: {
    tokenRefreshInterval: 300000,
    sessionTimeout: 1800000,
    enableCSRFProtection: true
  },
  analytics: {
    trackingId: '',
    enabled: false
  }
};

// === ARCHIVO: client/src/main.ts ===
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));

// === ARCHIVO: client/src/app/app.config.ts ===
import { ApplicationConfig, provideZoneChangeDetection, isDevMode } from '@angular/core';
import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router';
import { provideHttpClient, withInterceptors, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { routes } from './app.routes';
import { ErrorInterceptor } from './core/interceptors/error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withViewTransitions()
    ),
    provideHttpClient(
      withInterceptorsFromDi(),
      withInterceptors([])
    ),
    provideAnimationsAsync(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    }
  ]
};

// === ARCHIVO: client/src/app/app.component.ts ===
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

// === ARCHIVO: client/src/app/features/orders/orders.component.spec.ts ===
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

// === ARCHIVO: client/setup-jest.ts ===
// Setup de tests generado automaticamente (referenciado por la config del runner).
import 'jest-preset-angular/setup-jest';


// === ARCHIVO: client/src/app/app.routes.ts ===
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

// === ARCHIVO: client/tsconfig.app.json ===
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "./out-tsc/app",
    "types": []
  },
  "files": [
    "src/main.ts"
  ],
  "include": [
    "src/**/*.d.ts",
    "src/**/*.ts",
    "src/**/*.tsx",
    "src/**/*.js",
    "src/**/*.jsx"
  ],
  "exclude": [
    "src/**/*.spec.ts",
    "src/**/*.test.ts"
  ]
}

// === ARCHIVO: client/src/test.ts ===
import 'zone.js';
import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

declare const require: {
  context(
    path: string,
    deep?: boolean,
    filter?: RegExp
  ): {
    <T>(id: string): T;
    keys(): string[];
  };
};

getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);

const context = require.context('../src/app', true, /\.spec\.ts$/);
context.keys().forEach((key) => {
  context(key);
});

// === ARCHIVO: client/tsconfig.spec.json ===
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "./out-tsc/spec",
    "types": [
      "jest"
    ],
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true
  },
  "include": [
    "src/**/*.spec.ts",
    "src/**/*.test.ts",
    "src/**/*.d.ts"
  ],
  "exclude": [
    "src/**/*.spec.ts",
    "node_modules"
  ]
}

// === ARCHIVO: docker-compose.yml ===
# Infraestructura local del reto. SOLO desarrollo: credenciales de ejemplo (local-dev-only), puertos en loopback.
# Levantar: docker compose up -d --wait
name: infra-local
services:
  kafka:
    image: "apache/kafka:3.8.0"
    ports:
      - "127.0.0.1:9092:9092"
    environment:
      KAFKA_NODE_ID: "1"
      KAFKA_PROCESS_ROLES: "broker,controller"
      KAFKA_LISTENERS: "PLAINTEXT://:9092,CONTROLLER://:9093"
      KAFKA_ADVERTISED_LISTENERS: "PLAINTEXT://localhost:9092"
      KAFKA_CONTROLLER_LISTENER_NAMES: "CONTROLLER"
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: "CONTROLLER:PLAINTEXT,PLAINTEXT:PLAINTEXT"
      KAFKA_CONTROLLER_QUORUM_VOTERS: "1@localhost:9093"
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: "1"
      KAFKA_TRANSACTION_STATE_LOG_REPLICATION_FACTOR: "1"
      KAFKA_TRANSACTION_STATE_LOG_MIN_ISR: "1"
      KAFKA_GROUP_INITIAL_REBALANCE_DELAY_MS: "0"
    healthcheck:
      test: ["CMD-SHELL","/opt/kafka/bin/kafka-broker-api-versions.sh --bootstrap-server localhost:9092 > /dev/null 2>&1"]
      interval: 15s
      timeout: 10s
      retries: 10
      start_period: 30s


// === ARCHIVO: infra-local/README.md ===
# Infraestructura local

Servicios de soporte para el reto, definidos en `docker-compose.yml` (raiz del repo).

```bash
docker compose up -d --wait
```

| Servicio | Imagen | Puertos (host) |
|---|---|---|
| Apache Kafka (KRaft, un nodo) | `apache/kafka:3.8.0` | 9092 |

Credenciales: solo de desarrollo local (`local-dev-only`, `local`). No son secretos ni deben reutilizarse.
Los scripts de `infra-local/` (tablas, topics) se ejecutan con el compose en estado healthy.


// === ARCHIVO: infra-local/kafka/create-topics.sh ===
#!/usr/bin/env bash
# Crea los topics en Kafka local (idempotente). Ejecutar con el compose levantado y healthy.
set -euo pipefail

docker compose exec -T kafka /opt/kafka/bin/kafka-topics.sh --bootstrap-server localhost:9092 --create --if-not-exists --topic app-events --partitions 1 --replication-factor 1

```
