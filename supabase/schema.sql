-- =============================================================================
-- ESQUEMA DE BASE DE DATOS POSTGRESQL (SUPABASE)
-- Proyecto: Sistema de Información Centro de Servicios J&E (SENA ADSO 3386122)
-- Estándar: IEEE 830 (RF-001 a RF-010 y RNF-001 a RNF-007)
-- Instrucciones: Copia todo este contenido, pégalo en el "SQL Editor" de tu
-- proyecto en Supabase y haz clic en "Run".
-- =============================================================================

-- 1. Tabla de Catálogo e Inventario (RF-002)
CREATE TABLE IF NOT EXISTS public.inventario (
  id TEXT PRIMARY KEY,
  codigo TEXT NOT NULL UNIQUE,
  descripcion TEXT NOT NULL,
  categoria TEXT NOT NULL DEFAULT 'Motosierras',
  marca TEXT NOT NULL DEFAULT 'STIHL',
  unidad TEXT NOT NULL DEFAULT 'Unidad',
  maquinaria TEXT DEFAULT '',
  stock INTEGER NOT NULL DEFAULT 0,
  stock_minimo INTEGER NOT NULL DEFAULT 0,
  precio_costo NUMERIC(14,2) NOT NULL DEFAULT 0,
  precio_unitario NUMERIC(14,2) NOT NULL DEFAULT 0,
  ubicacion TEXT DEFAULT 'Bodega',
  proveedor TEXT DEFAULT 'Proveedor Directo',
  estado TEXT NOT NULL DEFAULT 'En stock',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Tabla de Movimientos Kardex (RF-002 / RF-009)
CREATE TABLE IF NOT EXISTS public.kardex_movimientos (
  id TEXT PRIMARY KEY,
  fecha TEXT NOT NULL,
  tipo TEXT NOT NULL,
  repuesto_id TEXT,
  codigo TEXT NOT NULL,
  descripcion TEXT NOT NULL,
  cantidad INTEGER NOT NULL DEFAULT 1,
  motivo TEXT DEFAULT '',
  usuario TEXT DEFAULT 'Administrador',
  stock_anterior INTEGER NOT NULL DEFAULT 0,
  stock_nuevo INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Tabla de Órdenes de Taller e Historial de Reparaciones (RF-007)
CREATE TABLE IF NOT EXISTS public.ordenes_taller (
  id TEXT PRIMARY KEY,
  tipo_equipo TEXT NOT NULL,
  marca TEXT DEFAULT 'STIHL',
  modelo TEXT NOT NULL,
  serie TEXT DEFAULT 'S/N',
  propietario TEXT NOT NULL,
  documento_cliente TEXT DEFAULT '',
  telefono TEXT DEFAULT '',
  tecnico_asignado TEXT NOT NULL,
  fecha_ingreso TEXT NOT NULL,
  fecha_estimada TEXT,
  diagnostico TEXT NOT NULL,
  actividades_efectuadas TEXT DEFAULT '',
  observaciones_tecnico TEXT DEFAULT '',
  estado TEXT NOT NULL DEFAULT 'Ingresado',
  prioridad TEXT DEFAULT 'Media',
  mano_obra NUMERIC(14,2) NOT NULL DEFAULT 0,
  presupuesto_estimado NUMERIC(14,2) NOT NULL DEFAULT 0,
  progreso INTEGER NOT NULL DEFAULT 15,
  repuestos_asignados JSONB NOT NULL DEFAULT '[]'::jsonb,
  checklist JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Tabla de Cotizaciones (RF-004)
CREATE TABLE IF NOT EXISTS public.cotizaciones (
  id TEXT PRIMARY KEY,
  fecha TEXT NOT NULL,
  validez_dias INTEGER NOT NULL DEFAULT 15,
  cliente JSONB NOT NULL DEFAULT '{}'::jsonb,
  maquinaria JSONB NOT NULL DEFAULT '{}'::jsonb,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  estado TEXT NOT NULL DEFAULT 'Pendiente',
  subtotal NUMERIC(14,2) NOT NULL DEFAULT 0,
  iva NUMERIC(14,2) NOT NULL DEFAULT 0,
  total NUMERIC(14,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Tabla de Ventas y Facturación Electrónica DIAN (RF-001 / RF-006)
CREATE TABLE IF NOT EXISTS public.ventas_facturas (
  id TEXT PRIMARY KEY,
  numero_factura TEXT NOT NULL UNIQUE,
  cufe TEXT NOT NULL,
  fecha TEXT NOT NULL,
  cliente TEXT NOT NULL,
  documento_cliente TEXT DEFAULT '',
  direccion_cliente TEXT DEFAULT '',
  telefono_cliente TEXT DEFAULT '',
  email_cliente TEXT DEFAULT '',
  vendedor TEXT NOT NULL,
  metodo_pago TEXT NOT NULL DEFAULT 'Efectivo',
  estado_dian TEXT NOT NULL DEFAULT 'Aprobada',
  items_count INTEGER NOT NULL DEFAULT 1,
  subtotal NUMERIC(14,2) NOT NULL DEFAULT 0,
  iva NUMERIC(14,2) NOT NULL DEFAULT 0,
  total NUMERIC(14,2) NOT NULL DEFAULT 0,
  estado_pedido TEXT NOT NULL DEFAULT 'Entregado',
  items_detalle JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Tabla de Gestión de Pedidos de Clientes (RF-005)
CREATE TABLE IF NOT EXISTS public.pedidos (
  id TEXT PRIMARY KEY,
  fecha TEXT NOT NULL,
  cliente TEXT NOT NULL,
  documento TEXT DEFAULT '',
  telefono TEXT DEFAULT '',
  direccion_entrega TEXT DEFAULT '',
  responsable TEXT DEFAULT 'Administrador',
  estado TEXT NOT NULL DEFAULT 'Pendiente',
  factura_asociada TEXT DEFAULT 'Por facturar',
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  total NUMERIC(14,2) NOT NULL DEFAULT 0,
  historial JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Tabla de Registro de Devoluciones (RF-009)
CREATE TABLE IF NOT EXISTS public.devoluciones (
  id TEXT PRIMARY KEY,
  fecha TEXT NOT NULL,
  factura_origen TEXT NOT NULL,
  cliente TEXT NOT NULL,
  repuesto_id TEXT DEFAULT '',
  codigo TEXT NOT NULL,
  descripcion TEXT NOT NULL,
  cantidad INTEGER NOT NULL DEFAULT 1,
  tipo_accion TEXT NOT NULL DEFAULT 'Reingreso a Inventario',
  motivo TEXT NOT NULL,
  usuario_responsable TEXT NOT NULL,
  valor_reintegrado NUMERIC(14,2) NOT NULL DEFAULT 0,
  estado TEXT NOT NULL DEFAULT 'Procesada',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Tabla de Consultas y Asesorías Técnicas (RF-010)
CREATE TABLE IF NOT EXISTS public.consultas_asesoria (
  id TEXT PRIMARY KEY,
  fecha TEXT NOT NULL,
  cliente TEXT NOT NULL,
  equipo TEXT NOT NULL,
  consulta TEXT NOT NULL,
  respuesta_tecnica TEXT NOT NULL,
  atendido_por TEXT NOT NULL,
  estado TEXT NOT NULL DEFAULT 'Respondida',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. Tabla de Bitácora de Auditoría y Seguridad (RNF-002 / 3.3.2)
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id TEXT PRIMARY KEY,
  fecha TEXT NOT NULL,
  usuario TEXT NOT NULL,
  rol TEXT NOT NULL,
  modulo TEXT NOT NULL,
  accion TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- POLÍTICAS DE ACCESO (ROW LEVEL SECURITY - RLS) PARA EL EQUIPO ADSO
-- =============================================================================
ALTER TABLE public.inventario ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kardex_movimientos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ordenes_taller ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cotizaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ventas_facturas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pedidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.devoluciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultas_asesoria ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Acceso completo inventario J&E" ON public.inventario;
CREATE POLICY "Acceso completo inventario J&E" ON public.inventario FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Acceso completo kardex J&E" ON public.kardex_movimientos;
CREATE POLICY "Acceso completo kardex J&E" ON public.kardex_movimientos FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Acceso completo taller J&E" ON public.ordenes_taller;
CREATE POLICY "Acceso completo taller J&E" ON public.ordenes_taller FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Acceso completo cotizaciones J&E" ON public.cotizaciones;
CREATE POLICY "Acceso completo cotizaciones J&E" ON public.cotizaciones FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Acceso completo ventas J&E" ON public.ventas_facturas;
CREATE POLICY "Acceso completo ventas J&E" ON public.ventas_facturas FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Acceso completo pedidos J&E" ON public.pedidos;
CREATE POLICY "Acceso completo pedidos J&E" ON public.pedidos FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Acceso completo devoluciones J&E" ON public.devoluciones;
CREATE POLICY "Acceso completo devoluciones J&E" ON public.devoluciones FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Acceso completo asesorias J&E" ON public.consultas_asesoria;
CREATE POLICY "Acceso completo asesorias J&E" ON public.consultas_asesoria FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Acceso completo logs J&E" ON public.audit_logs;
CREATE POLICY "Acceso completo logs J&E" ON public.audit_logs FOR ALL USING (true) WITH CHECK (true);
