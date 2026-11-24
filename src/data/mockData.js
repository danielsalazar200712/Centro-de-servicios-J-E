// Configuración Base para el Centro de Servicios J&E (SENA - Ficha 3386122 ADSO)
// Sistema inicializado en limpio (Sin productos, ventas ni órdenes de muestra)

export const MACHINERY_IMAGES = {
  motosierra: 'https://images.unsplash.com/photo-1590725140246-20acceedc19a?auto=format&fit=crop&w=600&q=80',
  guadanadora: 'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&w=600&q=80',
  sopladora: 'https://images.unsplash.com/photo-1622383563227-04401ab4e5ea?auto=format&fit=crop&w=600&q=80',
  fumigadora: 'https://images.unsplash.com/photo-1592417817098-8f3d69106a5b?auto=format&fit=crop&w=600&q=80',
  motoazada: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=600&q=80',
  podadora: 'https://images.unsplash.com/photo-1598880940371-c756e015fea1?auto=format&fit=crop&w=600&q=80',
  cuatrimoto: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=600&q=80',
  tallerLogin: '/images/taller-husqvarna.jpg'
};

// Catálogos y registros operativos inicializados en limpio (0 registros de muestra)
export const INITIAL_INVENTORY = [];
export const INITIAL_KARDEX_MOVEMENTS = [];
export const INITIAL_ORDERS_TALLER = [];
export const INITIAL_COTIZACIONES = [];
export const INITIAL_VENTAS = [];
export const INITIAL_PEDIDOS = [];
export const INITIAL_DEVOLUCIONES = [];
export const INITIAL_CONSULTAS_ASESORIA = [];
export const INITIAL_AUDIT_LOGS = [];
export const SERVICE_PACKAGES = [];

// Guías técnicas base del manual operativo (RF-010)
export const INITIAL_ASESORIAS = [
  {
    id: 'MAN-01',
    titulo: 'Proporción de Mezcla 2T (Gasolina + Aceite)',
    categoria: 'Motores 2 Tiempos',
    marca: 'STIHL / Husqvarna',
    tiempoLectura: 'Guía Técnica',
    resumen: 'Parámetros estándar de lubricación para motores de 2 tiempos refrigerados por aire.',
    recomendaciones: [
      'Aceite sintético 2T (Relación 1:50): 20 ml de aceite por cada 1 Litro de gasolina (76 ml por Galón).',
      'Aceite mineral estándar 2T (Relación 1:40): 25 ml de aceite por cada 1 Litro de gasolina (95 ml por Galón).',
      'Utilizar gasolina fresca y agitar el recipiente antes de abastecer el tanque.'
    ],
    frecuenciaMantenimiento: 'En cada abastecimiento'
  },
  {
    id: 'MAN-02',
    titulo: 'Mantenimiento Preventivo del Sistema de Corte y Transmisión',
    categoria: 'Guadañadoras & Motosierras',
    marca: 'Multimarca',
    tiempoLectura: 'Guía Técnica',
    resumen: 'Puntos de inspección periódica para prolongar la vida útil de los componentes mecánicos.',
    recomendaciones: [
      'Verificar lubricación de caja reductora o cadena antes de iniciar operación.',
      'Limpiar filtro de aire y aletas de refrigeración del cilindro al finalizar la jornada.',
      'Drenar el combustible del carburador cuando el equipo vaya a permanecer almacenado.'
    ],
    frecuenciaMantenimiento: 'Cada 25 horas de uso'
  }
];

// Roles del sistema según Especificación IEEE 830 (Sección 1.3 y 2.3)
export const MOCK_USERS = [
  {
    id: 'USR-01',
    nombre: 'Juan Fernando Posada Ramírez',
    rol: 'Administrador',
    cargo: 'Administrador Principal • Gestión General',
    telefono: '313 642 2685',
    email: 'admin@centroserviciosje.com',
    avatar: 'JF',
    sede: 'Sede Principal J&E',
    badgeColor: 'bg-emerald-900 text-emerald-100',
    permisos: ['dashboard', 'inventario', 'cotizaciones', 'ventas', 'taller', 'asesorias', 'reportes']
  },
  {
    id: 'USR-02',
    nombre: 'Eliecer Quintero Zuluaga',
    rol: 'Administrador',
    cargo: 'Administrador • Facturación & Pagos',
    telefono: '312 346 0991',
    email: 'facturacion@centroserviciosje.com',
    avatar: 'EQ',
    sede: 'Facturación Electrónica DIAN',
    badgeColor: 'bg-emerald-800 text-emerald-100',
    permisos: ['dashboard', 'inventario', 'cotizaciones', 'ventas', 'taller', 'asesorias', 'reportes']
  },
  {
    id: 'USR-03',
    nombre: 'Yarlei Stiven Posada Muñoz',
    rol: 'Técnico',
    cargo: 'Técnico en Maquinaria Agrícola',
    telefono: '301 260 4170',
    email: 'taller@centroserviciosje.com',
    avatar: 'YP',
    sede: 'Área de Servicio Técnico',
    badgeColor: 'bg-amber-900 text-amber-100',
    permisos: ['dashboard', 'inventario', 'taller', 'cotizaciones', 'asesorias']
  },
  {
    id: 'USR-04',
    nombre: 'Portal Cliente',
    rol: 'Cliente',
    cargo: 'Consulta de Pedidos, Facturas y Asesorías',
    telefono: '',
    email: 'cliente@centroserviciosje.com',
    avatar: 'CL',
    sede: 'Atención al Cliente',
    badgeColor: 'bg-sky-900 text-sky-100',
    permisos: ['dashboard', 'ventas', 'taller', 'cotizaciones', 'asesorias']
  },
  {
    id: 'USR-05',
    nombre: 'Portal Proveedor',
    rol: 'Proveedor',
    cargo: 'Abastecimiento y Consulta de Stock',
    telefono: '',
    email: 'proveedor@centroserviciosje.com',
    avatar: 'PR',
    sede: 'Canal de Proveedores',
    badgeColor: 'bg-slate-800 text-slate-100',
    permisos: ['dashboard', 'inventario']
  }
];

export const DIAN_STATUS_INFO = {
  servidor: 'Conectado - WS-DIAN UBL v2.1',
  resolucion: '18764000012891 de 2026/01/15',
  rangoAutorizado: 'FE-001001 hasta FE-005000',
  vigencia: '18 Meses (Hasta 2027-07-15)',
  ambiente: 'Producción Habilitada',
  firmaDigital: 'SHA-256 Certicámara S.A. Vigente',
  nitEmisor: '901.482.391-4',
  ciiu: '4530 / 3312'
};
