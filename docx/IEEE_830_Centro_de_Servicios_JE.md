# Especificación de Requisitos de Software (SRS - IEEE 830)
**Proyecto:** Sistema de Información Centro de Servicios J&E  
**Entidad Formativa:** SENA — Tecnología en Análisis y Desarrollo de Software (ADSO)  
**Ficha:** 3386122  
**Revisión Actual:** 1.4 (Sincronizada con el código fuente e integración Supabase PostgreSQL)  
**Fecha de última actualización:** 23 de Noviembre de 2026  

---

## Ficha del Documento e Historial de Revisiones

| Fecha | Revisión | Autor | Descripción / Verificación de Calidad |
| :--- | :--- | :--- | :--- |
| 01/07/2026 | 1.0 | **Equipo de Desarrollo ADSO - Ficha 3386122**<br>- Camilo Espinosa<br>- Yarlei Stiven Posada<br>- Daniel Salazar<br>- Álvaro Ríos<br>- Juan Fernando Castañeda | Versión inicial del SRS conforme al estándar IEEE 830. Pendiente de validación. |
| 23/11/2026 | 1.1 | **Equipo de Desarrollo ADSO - Ficha 3386122** | Alineación integral del Frontend React + Vite + Tailwind CSS con los requisitos RF-001 a RF-010, RNF-001 a RNF-007, interfaz SaaS Premium (Outfit / Plus Jakarta Sans / JetBrains Mono), inicio en limpio sin datos de muestra, calculadora de mezcla 2T y factura electrónica DIAN imprimible con descarga XML UBL 2.1. |
| 23/11/2026 | 1.2 | **Equipo de Desarrollo ADSO - Ficha 3386122** | Integración de capa Backend-as-a-Service (BaaS) y Base de Datos Relacional PostgreSQL en **Supabase** (`supabase/schema.sql`, `src/lib/supabaseClient.js`, sincronización en `src/context/AppDataContext.jsx`) y configuración de despliegue continuo en **Vercel** (`vercel.json`). |
| 23/11/2026 | 1.3 | **Equipo de Desarrollo ADSO - Ficha 3386122** | Nuevo requisito **RF-011 Notificación por WhatsApp** (método gratuito `wa.me`) en el módulo de Taller, con botón "Avisar por WhatsApp" para órdenes listas para entrega. |
| 23/11/2026 | 1.4 | **Equipo de Desarrollo ADSO - Ficha 3386122** | Rediseño visual profesional: paleta verde bosque profundo + acento naranja industrial (`forge`), barra lateral oscura, estados `hover` interactivos, bordes de formularios marcados, pantalla de ingreso con fotografía real de taller Husqvarna (`public/images/taller-husqvarna.jpg`) y limpieza de textos técnicos/académicos en la interfaz de usuario. |

### Firmas de Validación
- **Por el cliente (Centro de Servicios J&E):** Fdo. D./Dña: ___________________________
- **Por la empresa suministradora (Equipo ADSO 3386122):** Fdo. D./Dña: ___________________________

---

## Contenido
1. **INTRODUCCIÓN**
   - 1.1 Propósito
   - 1.2 Alcance
   - 1.3 Personal involucrado
   - 1.4 Definiciones, acrónimos y abreviaturas
   - 1.5 Referencias
   - 1.6 Resumen
2. **DESCRIPCIÓN GENERAL**
   - 2.1 Perspectiva del producto
   - 2.2 Funcionalidad del producto
   - 2.3 Características de los usuarios
   - 2.4 Restricciones
   - 2.5 Suposiciones y dependencias
   - 2.6 Evolución previsible del sistema
   - 2.7 Requisitos específicos
   - 2.8 Diagrama de contexto
3. **REQUISITOS ESPECÍFICOS**
   - 3.1 Requisitos funcionales (RF-001 a RF-010)
   - 3.2 Requisitos no funcionales (RNF-001 a RNF-007)
   - 3.3 Restricciones (R-001 a R-003)
   - 3.4 Requisitos comunes de las interfaces (3.1.1 a 3.1.4)
4. **APÉNDICES, ESQUEMA DE BASE DE DATOS Y TRAZABILIDAD**
   - 4.1 Esquema Relacional PostgreSQL en Supabase (9 tablas operativas)
   - 4.2 Arquitectura de Componentes del Proyecto Actual

---

## 1. Introducción

La presente Especificación de Requisitos de Software (SRS) tiene como objetivo proporcionar una visión completa y verificable del sistema de información que se desarrolla para el **Centro de Servicios J&E**. Este documento define los requisitos funcionales, no funcionales y las restricciones que guían el diseño, desarrollo, implementación y mantenimiento del software.

El sistema surge como respuesta a las dificultades operativas de la empresa, que incluían el manejo manual de inventarios, la falta de control en cotizaciones y pedidos, la ausencia de trazabilidad en reparaciones y la necesidad de cumplir con la normativa de facturación electrónica de la **DIAN**. La digitalización de estos procesos permite mejorar la eficiencia, garantizar la confiabilidad de la información y proyectar una imagen más formal y competitiva de la organización.

Este documento está dirigido a:
- **Administradores del taller**, responsables de la gestión de ventas, inventario, cotizaciones y facturación.
- **Técnicos**, encargados de registrar reparaciones y actualizar órdenes de trabajo.
- **Clientes y proveedores**, que interactúan con el sistema mediante facturas, pedidos y asesorías.
- **Equipo de desarrollo ADSO (Ficha 3386122)**, que utiliza este documento como contrato técnico para implementar y evolucionar el sistema.
- **Instructores y área académica del SENA**, que supervisan la coherencia metodológica y técnica del proyecto formativo.

### 1.1 Propósito
El propósito de este documento es establecer de manera formal, precisa y verificable los requisitos del **Sistema de Información del Centro de Servicios J&E**, garantizando que todas las partes involucradas compartan una comprensión común del alcance, funcionalidades y restricciones del proyecto.

### 1.2 Alcance
El sistema de información del **Centro de Servicios J&E** permite gestionar de manera digital y centralizada los procesos administrativos y operativos del taller, incluyendo:
- Registro y control de ventas y pedidos de clientes.
- Actualización automática del inventario de repuestos y materiales (con bitácora Kardex y prevención de duplicados).
- Generación, consulta, modificación e impresión de cotizaciones para servicios de reparación.
- Emisión de facturación electrónica conforme a la normativa de la **DIAN** (incluyendo cálculo de IVA 19%, valor en letras en COP, código QR, CUFE y exportación XML UBL 2.1).
- Generación y exportación de reportes administrativos en formatos **PDF** y **Excel (`.csv`)**.
- Gestión del historial de reparaciones por cliente y tablero Kanban de órdenes de trabajo.
- Registro de devoluciones de productos o repuestos con actualización automática del inventario.
- Módulo de asesorías técnicas para clientes sobre el uso, mezcla de combustible 2T y mantenimiento preventivo de equipos.
- Panel de control (**Dashboard**) con asistente de inicio rápido e indicadores en tiempo real.
- Persistencia híbrida sincronizada con **PostgreSQL en Supabase** y respaldo instantáneo local.

### 1.3 Personal involucrado (Stakeholders)

| Nombre | Rol | Categoría Profesional | Responsabilidades | Contacto | Estado |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Juan Fernando Posada Ramírez** | Administrador 1 | Técnico en Maquinaria Agrícola | Cotizaciones de reparación de maquinaria, pedidos de clientes, informar al cliente sobre revisiones. | 3136422685 | Pendiente de validación |
| **Eliecer Quintero Zuluaga** | Administrador 2 | Mecánico Industrial | Facturación electrónica DIAN, pagos, domicilios. | 3123460991 | Pendiente de validación |
| **Yarlei Stiven Posada Muñoz** | Técnico | Técnico en Proceso | Reparación y diagnóstico de maquinaria agrícola. | 3012604170 | Pendiente de validación |

### 1.4 Definiciones, acrónimos y abreviaturas
- **RF (Requisito Funcional):** Especificación que describe una funcionalidad que el sistema debe ejecutar, como registrar ventas, generar facturas o actualizar el inventario.
- **RNF (Requisito No Funcional):** Requisitos que establecen atributos de calidad del sistema, tales como rendimiento, seguridad, disponibilidad, usabilidad y confiabilidad.
- **R (Restricción):** Condición o limitación que debe cumplir el sistema, ya sea de carácter técnico, legal, normativo o de alcance.
- **DIAN (Dirección de Impuestos y Aduanas Nacionales):** Entidad colombiana encargada de regular y supervisar los procesos tributarios y de validar la facturación electrónica.
- **CUFE (Código Único de Facturación Electrónica):** Identificador criptográfico alfanumérico que respalda inequívocamente cada factura electrónica ante la DIAN.
- **Supabase (PostgreSQL BaaS):** Plataforma de base de datos relacional PostgreSQL en la nube con API REST automática (PostgREST) y políticas de seguridad por filas (RLS).
- **Kardex:** Registro estructurado y cronológico de todas las entradas, salidas, ajustes y devoluciones de inventario.

### 1.5 Referencias

| Referencia | Título | Ruta | Fecha | Autor |
| :--- | :--- | :--- | :--- | :--- |
| **REF-001** | IEEE Std 830-1998 - Recommended Practice for Software Requirements Specifications | https://standards.ieee.org | 1998 | IEEE |
| **REF-002** | ISO/IEC/IEEE 29148:2018 - Systems and Software Engineering - Requirements Engineering | https://www.iso.org | 2018 | ISO / IEC / IEEE |
| **REF-003** | Resolución 000042 de 2020 - Facturación Electrónica | https://www.dian.gov.co | 2020 | DIAN |
| **REF-004** | Leyes colombianas sobre comercio electrónico y conservación de documentos digitales | https://www.funcionpublica.gov.co | Vigente | Gobierno de Colombia |
| **REF-005** | NIST SP 800-63 - Digital Identity Guidelines | https://csrc.nist.gov | 2023 | NIST |
| **REF-006** | Protocolo HTTPS/TLS | https://www.rfc-editor.org | Vigente | IETF |
| **REF-007** | ISO/IEC 25010:2011 - Systems and Software Quality Models | https://www.iso.org | 2011 | ISO / IEC |
| **REF-008** | ISO/IEC 12207 - Software Life Cycle Processes | https://www.iso.org | 2017 | ISO / IEC |

---

## 2. Descripción General

### 2.1 Perspectiva del producto
El sistema de información para el **Centro de Servicios J&E** es una aplicación web moderna (SPA en React 18 + Vite + Tailwind CSS) conectada mediante API REST (`src/lib/supabaseClient.js`) a una base de datos relacional **PostgreSQL en Supabase** (`supabase/schema.sql`), cumpliendo la arquitectura de 4 capas definida en el Apéndice 4.1 del documento IEEE 830 (Frontend, Backend/API REST, Servicio de Facturación DIAN y Base de Datos SQL).

### 2.2 Características de los usuarios

| Tipo de Usuario | Formación | Habilidades | Actividades en el Sistema |
| :--- | :--- | :--- | :--- |
| **Administrador** | Técnico en Maquinaria Agrícola o áreas afines. | Manejo de procesos administrativos, cotizaciones, atención al cliente y herramientas informáticas. | Gestionar cotizaciones, registrar ventas y pedidos, supervisar inventario, emitir facturas DIAN, registrar devoluciones, consultar reportes y auditar el sistema. |
| **Técnico** | Técnico en mantenimiento o reparación de maquinaria agrícola. | Conocimiento en reparación y diagnóstico de maquinaria 2T/4T, registro de datos. | Registrar reparaciones, actualizar órdenes de trabajo, marcar checklist mecánico, consultar inventario, asignar repuestos a órdenes y brindar asesorías. |
| **Cliente** | No requiere formación específica. | Conocimientos básicos para consultar información mediante una interfaz intuitiva. | Consultar el estado de sus pedidos, visualizar facturas electrónicas, acceder al historial de reparaciones y consultar el módulo de asesorías técnicas. |
| **Proveedor** | Personal administrativo o comercial del proveedor. | Gestión de pedidos, suministro de repuestos y herramientas digitales. | Atender órdenes de abastecimiento, suministrar repuestos y consultar niveles de stock en catálogo. |

---

## 3. Requisitos Específicos

### 3.1 Requisitos Funcionales (RF)

| Código | Nombre del Requisito | Fuente | Prioridad | Descripción y Criterio de Aceptación | Módulo en Código / Tabla SQL |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **RF-001** | **Registro de ventas** | Administrador / Vendedor | Alta (Esencial) | Permite registrar ventas almacenando cliente, documento, productos/servicios vendidos, cantidades, fecha, vendedor responsable, forma de pago y valor total con IVA (19%). | `src/pages/VentasPedidos.jsx`<br>Tabla: `public.ventas_facturas` |
| **RF-002** | **Actualización automática del inventario** | Administrador | Alta (Esencial) | Actualiza automáticamente el inventario ante cada venta, consumo en taller, devolución o entrada de bodega, reflejando el stock en tiempo real y registrando el movimiento en el Kardex. | `src/pages/Inventario.jsx`<br>Tablas: `public.inventario`, `public.kardex_movimientos` |
| **RF-003** | **Dashboard administrativo** | Administrador | Media (Deseado) | Panel de control con indicadores reales sobre ventas facturadas, catálogo e inventario, pedidos/cotizaciones y órdenes de taller, más asistente de inicio rápido. | `src/pages/Dashboard.jsx` |
| **RF-004** | **Generación de cotizaciones** | Administrador | Alta (Esencial) | Permite elaborar, consultar, modificar, aprobar, imprimir y convertir en factura DIAN las cotizaciones de reparación con repuestos, mano de obra e IVA (19%). | `src/pages/Cotizaciones.jsx`<br>Tabla: `public.cotizaciones` |
| **RF-005** | **Gestión de pedidos** | Cliente / Administrador | Alta (Esencial) | Permite registrar, consultar y realizar el seguimiento de pedidos indicando su estado (**Pendiente**, **En proceso** o **Entregado**) y conservando su historial. | `src/pages/VentasPedidos.jsx`<br>Tabla: `public.pedidos` |
| **RF-006** | **Facturación electrónica** | Administrador / DIAN | Alta (Esencial) | Genera facturas electrónicas conforme a la normativa DIAN, con numeración autorizada, CUFE, QR, valor en letras en COP, impresión A4 y descarga XML UBL 2.1. | `src/pages/VentasPedidos.jsx`<br>Tabla: `public.ventas_facturas` |
| **RF-007** | **Historial de reparaciones** | Técnico | Media (Deseado) | Almacena y consulta el historial de reparaciones por cliente, incluyendo fecha, equipo, serie, diagnóstico, checklist, actividades efectuadas, repuestos y observaciones. | `src/pages/TallerReparaciones.jsx`<br>Tabla: `public.ordenes_taller` |
| **RF-008** | **Generación de reportes** | Administrador | Media (Deseado) | Genera reportes sobre ventas, inventario, pedidos, reparaciones, devoluciones y auditoría, con vista en pantalla y exportación en **PDF** y **Excel (`.csv`)**. | `src/pages/Reportes.jsx` |
| **RF-009** | **Registro de devoluciones** | Administrador | Media (Deseado) | Registra devoluciones asociadas a una factura, actualizando automáticamente el inventario y dejando evidencia del motivo, fecha y usuario responsable. | `src/pages/VentasPedidos.jsx`<br>Tabla: `public.devoluciones` |
| **RF-010** | **Módulo de asesorías** | Cliente | Baja (Opcional) | Ofrece guías de mantenimiento preventivo, calculadora interactiva de mezcla 2T (1:50 y 1:40) y registro de consultas técnicas personalizadas. | `src/pages/Asesorias.jsx`<br>Tabla: `public.consultas_asesoria` |
| **RF-011** | **Notificación por WhatsApp** | Técnico / Administrador | Media (Deseado) | Cuando una orden de taller pasa a **Listo para Entrega**, el sistema muestra el botón **"Avisar por WhatsApp"**, que abre WhatsApp (enlace gratuito `wa.me`) con un mensaje prellenado para el cliente (nombre, equipo y número de orden). El número se normaliza al indicativo de Colombia (+57). Si la orden no tiene celular válido, se informa al usuario. | `src/lib/whatsapp.js`<br>`src/pages/TallerReparaciones.jsx`<br>Tabla: `public.ordenes_taller` (campo `telefono`) |

---

### 3.2 Requisitos No Funcionales (RNF)

| Código | Nombre del Requisito | Fuente | Prioridad | Especificación Técnica |
| :--- | :--- | :--- | :--- | :--- |
| **RNF-001** | **Rendimiento del sistema** | Administrador | Alta (Esencial) | Tiempos de respuesta inmediatos con caché optimista en cliente y sincronización asíncrona REST con PostgreSQL en Supabase. |
| **RNF-002** | **Seguridad de la información** | Administrador | Alta (Esencial) | Autenticación por usuario y contraseña, control de acceso basado en roles (`Administrador`, `Técnico`, `Cliente`, `Proveedor`), políticas RLS en Supabase y bitácora en `public.audit_logs`. |
| **RNF-003** | **Fiabilidad del sistema** | Administrador | Media (Deseado) | Persistencia dual (Supabase PostgreSQL + respaldo local), validación de stock y prevención de duplicados en catálogo. |
| **RNF-004** | **Disponibilidad del sistema** | Administrador | Alta (Esencial) | Disponibilidad continua (99.9%) respaldada por infraestructura cloud de Supabase y operación offline-first. |
| **RNF-005** | **Mantenibilidad** | Equipo de desarrollo | Media (Deseado) | Arquitectura modular en React (`AuthContext`, `AppDataContext`, `supabaseClient.js`) y documentación IEEE 830 auto-sincronizada en `docx/`. |
| **RNF-006** | **Portabilidad** | Administrador | Media (Deseado) | Compatible con Chrome, Edge, Firefox y Safari en escritorio y dispositivos móviles. |
| **RNF-007** | **Compatibilidad y Diseño Adaptable** | Administrador | Media (Deseado) | Diseño adaptable (*Responsive Design*) e impresión limpia `@media print` en formato A4. |

---

## 4. Apéndices, Esquema de Base de Datos y Trazabilidad

### 4.1 Esquema Relacional PostgreSQL en Supabase (`supabase/schema.sql`)

| Tabla SQL (`public.*`) | Clave Primaria | Propósito y Requisitos Asociados |
| :--- | :--- | :--- |
| `public.inventario` | `id` (`TEXT`) | Catálogo de repuestos e insumos con SKU único, stock, stock mínimo, precio y ubicación (**RF-002**). |
| `public.kardex_movimientos` | `id` (`TEXT`) | Trazabilidad cronológica de entradas, salidas, consumos en taller y devoluciones (**RF-002, RF-009**). |
| `public.ordenes_taller` | `id` (`TEXT`) | Órdenes de reparación, diagnóstico, actividades, checklist JSONB y repuestos consumidos (**RF-007**). |
| `public.cotizaciones` | `id` (`TEXT`) | Presupuestos de reparación con datos de cliente, maquinaria e ítems cotizados (**RF-004**). |
| `public.ventas_facturas` | `id` (`TEXT`) | Registro de ventas y comprobantes electrónicos DIAN con CUFE y detalle JSONB (**RF-001, RF-006**). |
| `public.pedidos` | `id` (`TEXT`) | Seguimiento de pedidos de clientes (`Pendiente`, `En proceso`, `Entregado`) e historial (**RF-005**). |
| `public.devoluciones` | `id` (`TEXT`) | Registro de devoluciones y garantías con motivo, responsable y valor reintegrado (**RF-009**). |
| `public.consultas_asesoria` | `id` (`TEXT`) | Historial de consultas técnicas y recomendaciones preventivas brindadas a clientes (**RF-010**). |
| `public.audit_logs` | `id` (`TEXT`) | Bitácora de seguridad y auditoría de acciones por usuario, rol y módulo (**RNF-002 / 3.3.2**). |

### 4.2 Arquitectura de Archivos del Proyecto

```
Centro de servicios_J & E/
├── .env.example                               # Plantilla de variables VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY
├── GEMINI.md                                  # Regla de sincronización automática del IEEE 830
├── docx/
│   ├── IEEE_830_Centro_de_Servicios_JE.md     # Documento Maestro IEEE 830 (Editable)
│   ├── IEEE_830_Centro_de_Servicios_JE.docx   # Documento Microsoft Word generado automáticamente
│   └── generar_docx.mjs                       # Generador OpenXML (.docx) sin dependencias externas
├── supabase/
│   └── schema.sql                             # Script SQL completo de las 9 tablas y políticas RLS para Supabase
└── src/
    ├── lib/
    │   └── supabaseClient.js                  # Cliente REST PostgREST v1 para conexión con Supabase
    ├── components/
    ├── context/
    ├── data/
    ├── layout/
    └── pages/
```
