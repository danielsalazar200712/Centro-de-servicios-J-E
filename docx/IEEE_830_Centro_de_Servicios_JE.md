# Especificación de Requisitos de Software (SRS - IEEE 830)
**Proyecto:** Sistema de Información Centro de Servicios J&E  
**Entidad Formativa:** SENA — Tecnología en Análisis y Desarrollo de Software (ADSO)  
**Ficha:** 3386122  
**Revisión Actual:** 1.1 (Sincronizada con el código fuente del proyecto)  
**Fecha de última actualización:** Noviembre 2026  

---

## Ficha del Documento e Historial de Revisiones

| Fecha | Revisión | Autor | Descripción / Verificación de Calidad |
| :--- | :--- | :--- | :--- |
| 01/07/2026 | 1.0 | **Equipo de Desarrollo ADSO - Ficha 3386122**<br>- Camilo Espinosa<br>- Yarlei Stiven Posada<br>- Daniel Salazar<br>- Álvaro Ríos<br>- Juan Fernando Castañeda | Versión inicial del SRS conforme al estándar IEEE 830. Pendiente de validación. |
| 23/11/2026 | 1.1 | **Equipo de Desarrollo ADSO - Ficha 3386122** | Alineación integral del Frontend React + Vite + Tailwind CSS con los requisitos RF-001 a RF-010, RNF-001 a RNF-007, interfaz SaaS Premium (Outfit / Plus Jakarta Sans / JetBrains Mono), inicio en limpio sin datos de muestra, calculadora de mezcla 2T y factura electrónica DIAN imprimible con descarga XML UBL 2.1. |

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
   - 3.5 Detalle operativo de requisitos funcionales (3.2.1 a 3.2.10)
   - 3.6 Detalle de atributos de calidad y seguridad (3.3.1 a 3.3.7)
   - 3.7 Otros requisitos (Legales, organizacionales, culturales y de usabilidad)
4. **APÉNDICES Y TRAZABILIDAD CON EL CÓDIGO FUENTE**
   - 4.1 Diagramas complementarios (Arquitectura, Casos de uso, Clases, Secuencia, Flujo)
   - 4.2 Prototipos de interfaz y Matriz de Trazabilidad de Módulos Implementados

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

El SRS sirve como:
- **Contrato técnico** entre los stakeholders y el equipo de desarrollo.
- **Guía de trazabilidad**, permitiendo vincular cada requisito con su origen, módulo de código, validación y pruebas correspondientes.
- **Referencia normativa y metodológica**, alineada con el estándar **IEEE 830** y con la normativa de la **DIAN** sobre facturación electrónica.
- **Herramienta de calidad**, que reduce riesgos de ambigüedad, reprocesos y errores durante el ciclo de vida del software.

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

El sistema **no incluirá** funcionalidades relacionadas con la gestión de nómina, recursos humanos o administración de personal, ya que estas se encuentran fuera del alcance del proyecto. Tampoco contempla módulos de contabilidad avanzada ni integración con sistemas externos distintos a la DIAN en esta primera versión.

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
- **SRS / ERS:** Especificación de Requisitos de Software (*Software Requirements Specification*).
- **IEEE 830:** Estándar utilizado como referencia para la elaboración de especificaciones de requisitos de software.
- **Kardex:** Registro estructurado y cronológico de todas las entradas, salidas, ajustes y devoluciones de inventario.
- **Stock:** Cantidad disponible de productos, repuestos o materiales almacenados dentro del inventario.
- **Dashboard:** Panel de control que presenta información relevante mediante indicadores y estadísticas para facilitar la toma de decisiones.
- **Frontend:** Capa del sistema con la que interactúa el usuario, desarrollada en React 18 + Vite + Tailwind CSS.
- **Backend:** Capa del sistema responsable de la lógica de negocio, procesamiento de datos y comunicación con la base de datos y API DIAN.

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

### 1.6 Resumen
El documento se organiza en cuatro secciones principales siguiendo el estándar IEEE 830: Introducción, Descripción General, Requisitos Específicos y Apéndices con trazabilidad directa al código fuente del proyecto.

---

## 2. Descripción General

### 2.1 Perspectiva del producto
El sistema de información para el **Centro de Servicios J&E** es un producto web independiente, desarrollado para optimizar la gestión de los procesos administrativos y operativos del taller especializado en maquinaria agroforestal (**STIHL, Husqvarna, Royal Cóndor, Honda**). Cuenta con cumplimiento normativo para facturación electrónica de la DIAN y una arquitectura preparada para conectarse mediante API REST a una base de datos relacional.

### 2.2 Funcionalidad del producto
- Registro y gestión de ventas y pedidos de clientes.
- Actualización automática del inventario de repuestos y materiales.
- Generación de cotizaciones para servicios de reparación.
- Emisión de facturación electrónica conforme a la normativa de la DIAN.
- Generación y exportación de reportes administrativos en formato PDF y Excel.
- Gestión del historial de reparaciones realizadas a cada cliente.
- Registro de devoluciones con reingreso automático a stock o trazabilidad por garantía.
- Módulo de asesorías técnicas con calculadora de mezcla 2T y recomendaciones para los clientes.
- Panel de control (Dashboard) con indicadores reales y asistente de inicio rápido.

### 2.3 Características de los usuarios

| Tipo de Usuario | Formación | Habilidades | Actividades en el Sistema |
| :--- | :--- | :--- | :--- |
| **Administrador** | Técnico en Maquinaria Agrícola o áreas afines. | Manejo de procesos administrativos, cotizaciones, atención al cliente y herramientas informáticas. | Gestionar cotizaciones, registrar ventas y pedidos, supervisar inventario, emitir facturas DIAN, registrar devoluciones, consultar reportes y auditar el sistema. |
| **Técnico** | Técnico en mantenimiento o reparación de maquinaria agrícola. | Conocimiento en reparación y diagnóstico de maquinaria 2T/4T, registro de datos. | Registrar reparaciones, actualizar órdenes de trabajo, marcar checklist mecánico, consultar inventario, asignar repuestos a órdenes y brindar asesorías. |
| **Cliente** | No requiere formación específica. | Conocimientos básicos para consultar información mediante una interfaz intuitiva. | Consultar el estado de sus pedidos, visualizar facturas electrónicas, acceder al historial de reparaciones y consultar el módulo de asesorías técnicas. |
| **Proveedor** | Personal administrativo o comercial del proveedor. | Gestión de pedidos, suministro de repuestos y herramientas digitales. | Atender órdenes de abastecimiento, suministrar repuestos y consultar niveles de stock en catálogo. |

### 2.4 Restricciones
- El sistema opera íntegramente en **idioma español**.
- No incluye módulos de nómina, recursos humanos o administración de personal.
- Cumple con los campos obligatorios de la normativa vigente de la DIAN para facturación electrónica.
- La validación en producción de la facturación electrónica depende de la disponibilidad de los servicios web de la DIAN y conexión a Internet.

### 2.5 Suposiciones y dependencias
- Disponibilidad de conexión a Internet y navegadores modernos en computadores de escritorio, portátiles o dispositivos móviles.
- Registro oportuno y veraz de la información por parte de los usuarios operativos del taller.

### 2.6 Evolución previsible del sistema
- Integración con pasarelas de pago electrónicas (PSE / Nequi / Botón Bancolombia).
- Notificaciones automáticas vía WhatsApp o correo electrónico sobre el cambio de estado de pedidos y reparaciones.
- Conexión del Frontend con API REST Backend y base de datos SQL persistente en la nube.

---

## 3. Requisitos Específicos

### 3.1 Requisitos Funcionales (RF)

| Código | Nombre del Requisito | Fuente | Prioridad | Descripción y Criterio de Aceptación | Módulo en Código |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **RF-001** | **Registro de ventas** | Administrador / Vendedor | Alta (Esencial) | El sistema deberá permitir registrar las ventas almacenando cliente, documento, productos/servicios vendidos, cantidades, fecha, vendedor responsable, forma de pago y valor total con IVA (19%). Permite seleccionar del catálogo o añadir conceptos libres. | `src/pages/VentasPedidos.jsx` |
| **RF-002** | **Actualización automática del inventario** | Administrador | Alta (Esencial) | El sistema deberá actualizar automáticamente el inventario cada vez que se registre una venta, un consumo en taller, una devolución o el ingreso de bodega de proveedores, reflejando el stock en tiempo real, evitando duplicados y registrando cada movimiento en el Kardex. | `src/pages/Inventario.jsx`<br>`src/context/AppDataContext.jsx` |
| **RF-003** | **Dashboard administrativo** | Administrador | Media (Deseado) | El sistema deberá disponer de un panel de control que presente indicadores reales sobre ventas facturadas, catálogo e inventario, pedidos/cotizaciones y órdenes de taller, incluyendo una guía interactiva de inicio rápido cuando el sistema está limpio. | `src/pages/Dashboard.jsx` |
| **RF-004** | **Generación de cotizaciones** | Administrador | Alta (Esencial) | El sistema deberá permitir elaborar, consultar, modificar, aprobar, imprimir y convertir en factura DIAN las cotizaciones de reparación, desglosando repuestos, mano de obra e IVA (19%). | `src/pages/Cotizaciones.jsx` |
| **RF-005** | **Gestión de pedidos** | Cliente / Administrador | Alta (Esencial) | El sistema deberá permitir registrar, consultar y realizar el seguimiento de los pedidos efectuados por los clientes, indicando su estado (**Pendiente**, **En proceso** o **Entregado**) y conservando la línea de tiempo del historial de cada pedido. | `src/pages/VentasPedidos.jsx` (Pestaña Pedidos) |
| **RF-006** | **Facturación electrónica** | Administrador / DIAN | Alta (Esencial) | El sistema deberá generar facturas electrónicas conforme a la normativa DIAN, incluyendo numeración autorizada, CUFE, QR de verificación, valor total en letras en Pesos Colombianos, impresión limpia en formato A4 y descarga de contenedor XML UBL 2.1. | `src/pages/VentasPedidos.jsx` (Vista Factura A4) |
| **RF-007** | **Historial de reparaciones** | Técnico | Media (Deseado) | El sistema deberá almacenar y consultar el historial de reparaciones realizadas a cada cliente, incluyendo fecha del servicio, equipo, serie, diagnóstico, checklist mecánico, actividades efectuadas, repuestos utilizados y observaciones del técnico. | `src/pages/TallerReparaciones.jsx` |
| **RF-008** | **Generación de reportes** | Administrador | Media (Deseado) | El sistema deberá generar reportes administrativos sobre ventas, inventario, pedidos, reparaciones, devoluciones y bitácora de auditoría, permitiendo su visualización en pantalla y su exportación en formatos **PDF** y **Excel (`.csv`)**. | `src/pages/Reportes.jsx` |
| **RF-009** | **Registro de devoluciones** | Administrador | Media (Deseado) | El sistema deberá permitir registrar las devoluciones de productos o repuestos asociadas a una factura, actualizando automáticamente el inventario y dejando evidencia del motivo, fecha y usuario responsable. | `src/pages/VentasPedidos.jsx` (Pestaña Devoluciones) |
| **RF-010** | **Módulo de asesorías** | Cliente | Baja (Opcional) | El sistema deberá ofrecer un módulo de asesorías donde se consulten recomendaciones de mantenimiento preventivo, calculadora interactiva de mezcla 2T (1:50 y 1:40 en litros/galones) y registro de consultas técnicas personalizadas. | `src/pages/Asesorias.jsx` |

---

### 3.2 Requisitos No Funcionales (RNF)

| Código | Nombre del Requisito | Fuente | Prioridad | Especificación Técnica |
| :--- | :--- | :--- | :--- | :--- |
| **RNF-001** | **Rendimiento del sistema** | Administrador | Alta (Esencial) | Tiempos de respuesta inmediatos en consultas, cálculos de facturación, buscador global (`Ctrl + K`) y filtrado de tablas, manteniendo estabilidad hasta 10.000 registros. |
| **RNF-002** | **Seguridad de la información** | Administrador | Alta (Esencial) | Autenticación mediante usuario y contraseña (`Login.jsx`), recuperación de contraseña, control de acceso basado en roles (`Administrador`, `Técnico`, `Cliente`, `Proveedor`) que filtra los módulos visibles en `Sidebar.jsx` y registro automático de actividades en bitácora de auditoría (`auditLogs`). |
| **RNF-003** | **Fiabilidad del sistema** | Administrador | Media (Deseado) | Persistencia segura de datos, validación de stock para impedir saldos negativos, validación de unicidad al crear productos en el catálogo y opción controlada de reinicio en limpio. |
| **RNF-004** | **Disponibilidad del sistema** | Administrador | Alta (Esencial) | Disponibilidad continua (99%) durante la jornada laboral del Centro de Servicios J&E. |
| **RNF-005** | **Mantenibilidad** | Equipo de desarrollo | Media (Deseado) | Arquitectura modular en React basada en Contextos (`AuthContext`, `AppDataContext`), componentes reutilizables (`Modal`, `StatCard`, `Badge`, `GlobalSearchModal`) y páginas desacopladas. |
| **RNF-006** | **Portabilidad** | Administrador | Media (Deseado) | Compatible con los principales navegadores web modernos (Chrome, Edge, Firefox, Safari) en sistemas Windows, macOS, Linux, Android e iOS. |
| **RNF-007** | **Compatibilidad y Diseño Adaptable** | Administrador | Media (Deseado) | Interfaz *Responsive Design* adaptable a resoluciones móviles, tablets de taller y monitores de escritorio, con estilos dedicados `@media print` para impresión fiscal A4. |

---

### 3.3 Restricciones del Sistema (R)

- **R-001 Cumplimiento de la normativa DIAN (Alta - Esencial):** Generación, validación y gestión de facturación electrónica con resolución, CUFE, QR y desglose de IVA (19%).
- **R-002 Alcance del sistema (Alta - Esencial):** Exclusión de módulos de nómina, recursos humanos o administración de personal.
- **R-003 Idioma del sistema (Alta - Esencial):** Operación 100% en idioma español en todas las interfaces, notificaciones, facturas y reportes exportados.

---

### 3.4 Requisitos Comunes de las Interfaces

#### 3.1.1 Interfaces de usuario (Estética SaaS Premium)
- **Sistema Tipográfico:**
  - Encabezados y títulos ejecutivos: **`Outfit`** (`font-display`).
  - Cuerpo de interfaz, formularios y tablas: **`Plus Jakarta Sans`** (`font-sans`).
  - Códigos SKU, números de serie, CUFE y cifras monetarias: **`JetBrains Mono`** (`font-mono` con `tabular-nums`).
- **Paleta Cromática "Imperial Forest & Warm Alabaster":**
  - Lienzo base cálido: `#F5F7F5` (`surface.bg`).
  - Superficie de tarjetas y modales: `#FFFFFF` con sombras suaves (`shadow-premium`) y bordes esmeralda sutiles (`border-emerald-400/60`).
  - Verde Bosque Imperial primario: `#0E3525` (`agri.DEFAULT`) y `#0B2B1E` (`agri.dark`).
- **Control de Vistas por Rol:** Cada usuario visualiza en el menú lateral únicamente los módulos autorizados para su rol (*Administrador*, *Técnico*, *Cliente* o *Proveedor*).
- **Operación en Limpio e Intuitiva:** El sistema inicia sin artículos ni registros ficticios pre-cargados, presentando estados vacíos guiados y formularios limpios con textos de ayuda (`placeholders`).

#### 3.1.2 Interfaces de hardware
- Computadores de escritorio, portátiles o dispositivos móviles con procesador de doble núcleo o superior, 4 GB de RAM mínimo, navegador web actualizado e impresora opcional para facturas, cotizaciones y reportes.

#### 3.1.3 Interfaces de software
- Integración con formato estándar XML UBL 2.1 del Servicio de Facturación Electrónica de la DIAN y exportación CSV/UTF-8 compatible nativamente con Microsoft Excel.

#### 3.1.4 Interfaces de comunicación
- Transmisión segura bajo protocolo HTTPS/TLS.

---

## 4. Apéndices y Matriz de Trazabilidad del Proyecto

### 4.1 Arquitectura de Componentes del Proyecto Actual

```
Centro de servicios_J & E/
├── docx/
│   ├── IEEE_830_Centro_de_Servicios_JE.md     # Documento Maestro IEEE 830 (Editable)
│   ├── IEEE_830_Centro_de_Servicios_JE.docx   # Documento Microsoft Word generado automáticamente
│   └── generar_docx.mjs                       # Script generador del archivo .docx
├── src/
│   ├── components/
│   │   ├── common/                            # Modal, StatCard, Badge, ToastContainer, GlobalSearchModal
│   │   └── inventario/                        # SparePartModal (Creación/edición en catálogo)
│   ├── context/
│   │   ├── AuthContext.jsx                    # Autenticación y permisos por rol (RNF-002 / 3.1.1)
│   │   └── AppDataContext.jsx                 # Lógica de negocio, Kardex, DIAN y Auditoría
│   ├── data/
│   │   └── mockData.js                        # Configuración base limpia, roles IEEE 830 y parámetros DIAN
│   ├── layout/
│   │   ├── MainLayout.jsx                     # Estructura principal con buscador Ctrl+K
│   │   ├── Sidebar.jsx                        # Menú lateral filtrado por rol y estado DIAN
│   │   └── Header.jsx                         # Barra superior, alertas de stock, selector de rol y reinicio en limpio
│   └── pages/
│       ├── Login.jsx                          # Ingreso por rol y recuperación de contraseña
│       ├── Dashboard.jsx                      # RF-003: Panel de control y guía de inicio rápido en 3 pasos
│       ├── Inventario.jsx                     # RF-002: Catálogo de productos, entrada de bodega y Kardex
│       ├── Cotizaciones.jsx                   # RF-004: Cotizador de repuestos y mano de obra
│       ├── VentasPedidos.jsx                  # RF-001, RF-005, RF-006, RF-009: Ventas, Factura DIAN A4, Pedidos y Devoluciones
│       ├── TallerReparaciones.jsx             # RF-007: Tablero Kanban, checklist mecánico e Historial por Cliente
│       ├── Asesorias.jsx                      # RF-010: Calculadora mezcla 2T, guías y consultorio técnico
│       └── Reportes.jsx                       # RF-008 y 3.3.2: Reportes PDF/Excel y Bitácora de Auditoría
```
