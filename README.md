# Implementación de visualización de órdenes en tiempo real con Kafka

En el contexto de una plataforma de comercio electrónico, debes implementar un sistema que publique y consuma eventos de un topic Kafka para mostrar el estado de las órdenes en tiempo real en la interfaz de usuario. Los eventos incluyen la creación, actualización y cancelación de órdenes. El sistema debe manejar volúmenes de eventos altos y garantizar la visualización actualizada de las órdenes en la interfaz.

## Informacion General

| Campo | Valor |
|-------|-------|
| **Tema** | Consumo de eventos en tiempo real con Kafka |
| **Nivel** | advanced-l2 |
| **Tipo** | practical |
| **Tiempo estimado** | 8 horas |

## Fases del Reto

### Fase 0: Configuración del Proyecto

**Objetivo:** Obtener el proyecto base funcional enviando el Código Base a un asistente de IA, que lo analizará, corregirá errores y entregará cada archivo con su ruta.

**Tiempo estimado:** 15-30 minutos

**Instrucciones:**

- Asegúrate de tener instalado para ejecutar el proyecto: Node.js 18+, npm, VS Code o similar.
- Copia todo el contenido del campo **Código Base** de este reto — incluyendo el texto de instrucciones que aparece al inicio.
- Abre un asistente de IA (Claude en claude.ai, ChatGPT o Gemini — se recomienda Claude), pega el contenido copiado en el chat y envíalo.
- El asistente analizará los archivos, corregirá errores y entregará cada archivo con su ruta. Guárdalos en la carpeta donde quieras trabajar, respetando las rutas.
- Ejecuta `npm install && npm run build` (o `npm start`). Si no hay errores, estás listo.

**Entregable:** El proyecto compila/arranca sin errores.

<details>
<summary>Pistas de conocimiento</summary>

- Copia el Código Base completo incluyendo el texto de instrucciones al inicio — esas instrucciones le indican al asistente exactamente qué hacer con los archivos.
- Si el asistente no entrega todos los archivos al terminar el análisis, escríbele: "entrégame todos los archivos con su ruta".
- Si el proyecto tiene errores al arrancar, comparte el mensaje de error con el mismo asistente para que lo corrija.

</details>

### Fase 1: Configuración inicial del consumidor Kafka

**Objetivo:** Configurar y probar un consumidor Kafka que se conecte al topic de órdenes.

**Tiempo estimado:** 2 horas

**Instrucciones:**

- Configura el consumidor Kafka para que se conecte al topic de órdenes.
- Verifica que el consumidor pueda recibir y procesar eventos del topic.

**Entregable:** Consumidor Kafka configurado y conectado al topic de órdenes, capaz de recibir y procesar eventos.

<details>
<summary>Pistas de conocimiento</summary>

- Configuración de propiedades del consumidor Kafka.
- Manejo de eventos en tiempo real.

</details>

### Fase 2: Integración del consumidor con la interfaz de usuario

**Objetivo:** Integrar el consumidor Kafka con la interfaz de usuario para mostrar el estado de las órdenes en tiempo real.

**Tiempo estimado:** 3 horas

**Instrucciones:**

- Integra el consumidor Kafka con la interfaz de usuario.
- Muestra el estado de las órdenes en la interfaz en tiempo real.

**Entregable:** Interfaz de usuario integrada con el consumidor Kafka, mostrando el estado de las órdenes en tiempo real.

<details>
<summary>Pistas de conocimiento</summary>

- Actualización de la interfaz de usuario en tiempo real.
- Manejo de eventos en la interfaz de usuario.

</details>

### Fase 3: Optimización y manejo de errores

**Objetivo:** Optimizar el rendimiento del consumidor Kafka y manejar posibles errores en la integración con la interfaz de usuario.

**Tiempo estimado:** 3 horas

**Instrucciones:**

- Optimiza el rendimiento del consumidor Kafka.
- Maneja posibles errores en la integración con la interfaz de usuario.

**Entregable:** Consumidor Kafka optimizado y errores manejados en la integración con la interfaz de usuario.

<details>
<summary>Pistas de conocimiento</summary>

- Técnicas de optimización de rendimiento.
- Manejo de errores en la integración de sistemas.

</details>

## Dimensiones Evaluadas

- **queEs**: ¿Qué es un consumidor Kafka y cómo se integra con una interfaz de usuario?
- **paraQueSirve**: ¿Para qué sirve consumir eventos de Kafka en una aplicación de comercio electrónico?
- **comoSeUsa**: ¿Cómo se usa un consumidor Kafka para mostrar el estado de las órdenes en tiempo real?
- **erroresComunes**: ¿Cuáles son los errores comunes al integrar un consumidor Kafka con una interfaz de usuario y cómo se manejan?
- **queDecisionesImplica**: ¿Qué decisiones implica la optimización del rendimiento del consumidor Kafka y el manejo de errores en la integración?

## Criterios de Evaluacion

- Configuración correcta del consumidor Kafka.
- Integración exitosa del consumidor Kafka con la interfaz de usuario.
- Visualización en tiempo real del estado de las órdenes en la interfaz.
- Optimización del rendimiento del consumidor Kafka.
- Manejo adecuado de errores en la integración con la interfaz de usuario.

## Como trabajar con un asistente de IA

Hay dos caminos, elegi uno:

- **AGENTS.md** (recomendado) — instrucciones nativas del repo. Abri esta carpeta con tu agente local (Claude Code, Cursor, Codex, Copilot, Gemini) y las carga solo. Sabe que archivos faltan y con que comando se verifica, y completa el scaffold escribiendo en disco.
- **PROMPT_MEJORA.md** — para copiar y pegar en un chat (claude.ai, ChatGPT) si no tenes un agente en el IDE. Declara lo mismo que AGENTS.md; los archivos que te devuelva el chat los guardas en esta carpeta respetando las rutas.

Ninguno de los dos resuelve las fases del reto: eso es tu trabajo.

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

## Verificacion

El proyecto esta listo para trabajar cuando este comando corre sin errores:

```bash
(cd api && npm install && npm run build) && (cd client && npm install && npm run build) && docker compose config -q
```

---

*Reto generado automaticamente por Challenge Generator - Pragma*
