import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Receipt,
  Eye,
  Printer,
  Copy,
  Check,
  Search,
  Plus,
  Trash2,
  ShieldCheck,
  CheckCircle2,
  PackageCheck,
  ShoppingBag,
  RotateCcw,
  FileCode,
  Download,
  ArrowLeft,
  Clock,
  PackagePlus
} from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import { useAuth } from '../context/AuthContext';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';

export default function VentasPedidos() {
  const navigate = useNavigate();
  const {
    ventas,
    inventory,
    pedidos,
    devoluciones,
    tallerOrders,
    addVenta,
    addPedido,
    updatePedidoStatus,
    addDevolucion,
    formatCurrency,
    numberToWordsCOP,
    dianInfo,
    showToast
  } = useAppData();
  const { currentUser } = useAuth();

  const [activeTab, setActiveTab] = useState('registro');
  const [search, setSearch] = useState('');
  const [selectedDianFilter, setSelectedDianFilter] = useState('Todos');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [copiedCufe, setCopiedCufe] = useState(false);

  // Formulario limpio para Registro de Venta (Sin datos de muestra pre-llenados)
  const initialHeader = {
    fecha: new Date().toISOString().split('T')[0],
    cliente: '',
    documentoCliente: '',
    telefonoCliente: '',
    direccionCliente: '',
    emailCliente: '',
    vendedor: currentUser?.nombre || 'Juan Fernando Posada Ramírez',
    metodoPago: 'Efectivo'
  };

  const [saleHeader, setSaleHeader] = useState(initialHeader);
  const [saleItems, setSaleItems] = useState([]);
  const [partToAddId, setPartToAddId] = useState('');

  // Modal Historial de Pedido (RF-005)
  const [selectedPedidoHistory, setSelectedPedidoHistory] = useState(null);
  const [isNewPedidoOpen, setIsNewPedidoOpen] = useState(false);
  const [newPedidoForm, setNewPedidoForm] = useState({
    cliente: '',
    documento: '',
    telefono: '',
    direccionEntrega: '',
    repuestoId: '',
    descripcionLibre: '',
    valorUnitarioLibre: '',
    cantidad: 1,
    nota: ''
  });

  // Formulario limpio de Devolución (RF-009)
  const [devForm, setDevForm] = useState({
    facturaOrigen: '',
    cliente: '',
    repuestoId: '',
    codigoManual: '',
    descripcionManual: '',
    valorUnitario: '',
    cantidad: 1,
    tipoAccion: 'Reingreso a Inventario',
    motivo: ''
  });

  const saleSubtotal = saleItems.reduce(
    (acc, it) => acc + (Number(it.cantidad) || 0) * (Number(it.valorUnitario) || 0),
    0
  );
  const saleIva = Math.round(saleSubtotal * 0.19);
  const saleTotal = saleSubtotal + saleIva;
  const totalStockAvailable = inventory.reduce((acc, item) => acc + item.stock, 0);
  const nextInvoiceCode = `FE-${String(1001 + ventas.length).padStart(6, '0')}`;

  // Añadir producto del catálogo a la venta
  const handleAddProductToSale = () => {
    const targetId = partToAddId || inventory[0]?.id;
    const part = inventory.find((p) => p.id === targetId);
    if (!part) {
      showToast('Selecciona un producto', 'Elige un producto del catálogo o añade una línea manual.', 'info');
      return;
    }

    if (part.stock <= 0) {
      showToast('Sin existencias', `El producto ${part.codigo} tiene 0 unidades disponibles en bodega.`, 'warning');
      return;
    }

    const existing = saleItems.find((i) => i.repuestoId === part.id);
    if (existing) {
      if (existing.cantidad + 1 > part.stock) {
        showToast('Límite de stock', `Solo hay ${part.stock} unidades disponibles de ${part.codigo}.`, 'warning');
        return;
      }
      setSaleItems(
        saleItems.map((i) =>
          i.repuestoId === part.id ? { ...i, cantidad: i.cantidad + 1 } : i
        )
      );
    } else {
      setSaleItems([
        ...saleItems,
        {
          id: Date.now(),
          repuestoId: part.id,
          codigo: part.codigo,
          descripcion: part.descripcion,
          unidad: part.unidad || 'Unidad',
          cantidad: 1,
          valorUnitario: part.precioUnitario
        }
      ]);
    }
  };

  // Añadir concepto o ítem libre directamente en la tabla
  const handleAddCustomLine = () => {
    setSaleItems([
      ...saleItems,
      {
        id: Date.now(),
        repuestoId: '',
        codigo: `ITEM-0${saleItems.length + 1}`,
        descripcion: '',
        unidad: 'Unidad',
        cantidad: 1,
        valorUnitario: ''
      }
    ]);
  };

  const handleUpdateSaleItem = (itemId, field, value) => {
    setSaleItems(
      saleItems.map((row) => {
        if (row.id !== itemId) return row;

        if (field === 'cantidad') {
          const qty = Math.max(1, Number(value) || 1);
          if (row.repuestoId) {
            const part = inventory.find((p) => p.id === row.repuestoId);
            if (part && qty > part.stock) {
              showToast('Stock insuficiente', `Disponible en bodega de ${part.codigo}: ${part.stock} unidades.`, 'warning');
              return row;
            }
          }
          return { ...row, cantidad: qty };
        }

        return { ...row, [field]: value };
      })
    );
  };

  const handleRemoveSaleItem = (itemId) => {
    setSaleItems(saleItems.filter((i) => i.id !== itemId));
  };

  const handleEmitSaleAndInvoice = (openPrintable = false) => {
    if (!saleHeader.cliente.trim()) {
      showToast('Datos incompletos', 'Por favor ingresa el nombre o razón social del cliente.', 'warning');
      return;
    }

    if (saleItems.length === 0) {
      showToast('Sin productos', 'Agrega al menos un producto o servicio a la venta.', 'warning');
      return;
    }

    const normalizedItems = saleItems.map((it, idx) => ({
      ...it,
      codigo: it.codigo || `ITEM-0${idx + 1}`,
      descripcion: it.descripcion || 'Producto / Servicio',
      cantidad: Number(it.cantidad) || 1,
      valorUnitario: Number(it.valorUnitario) || 0
    }));

    const createdSale = addVenta({
      fecha: saleHeader.fecha,
      cliente: saleHeader.cliente,
      documentoCliente: saleHeader.documentoCliente,
      telefonoCliente: saleHeader.telefonoCliente,
      direccionCliente: saleHeader.direccionCliente,
      emailCliente: saleHeader.emailCliente,
      vendedor: saleHeader.vendedor,
      metodoPago: saleHeader.metodoPago,
      itemsCount: normalizedItems.reduce((acc, i) => acc + i.cantidad, 0),
      subtotal: saleSubtotal,
      iva: saleIva,
      total: saleTotal,
      estadoPedido: 'Entregado',
      itemsDetalle: normalizedItems
    });

    setSaleHeader(initialHeader);
    setSaleItems([]);

    if (openPrintable && createdSale) {
      setSelectedInvoice(createdSale);
    } else {
      setActiveTab('facturas');
    }
  };

  const handleResetSaleForm = () => {
    setSaleHeader(initialHeader);
    setSaleItems([]);
    showToast('Formulario limpio', 'Todos los campos fueron restablecidos.', 'info');
  };

  const handleDownloadXML = (invoice) => {
    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<AttachedDocument xmlns="urn:oasis:names:specification:ubl:schema:xsd:AttachedDocument-2">
  <UBLVersionID>UBL 2.1</UBLVersionID>
  <CustomizationID>Documentos adjuntos</CustomizationID>
  <ProfileID>DIAN 2.1: Factura Electrónica de Venta</ProfileID>
  <ID>${invoice.numeroFactura}</ID>
  <UUID schemeName="CUFE-SHA384">${invoice.cufe}</UUID>
  <IssueDate>${invoice.fecha.split(' ')[0]}</IssueDate>
  <DocumentType>FacturaElectronicaDeVenta</DocumentType>
  <SenderParty>
    <PartyTaxScheme>
      <RegistrationName>CENTRO DE SERVICIOS J&amp;E S.A.S.</RegistrationName>
      <CompanyID schemeName="31">${dianInfo.nitEmisor}</CompanyID>
    </PartyTaxScheme>
  </SenderParty>
  <ReceiverParty>
    <PartyTaxScheme>
      <RegistrationName>${invoice.cliente}</RegistrationName>
      <CompanyID>${invoice.documentoCliente || '900000000'}</CompanyID>
    </PartyTaxScheme>
  </ReceiverParty>
  <LegalMonetaryTotal>
    <LineExtensionAmount currencyID="COP">${invoice.subtotal}.00</LineExtensionAmount>
    <TaxExclusiveAmount currencyID="COP">${invoice.subtotal}.00</TaxExclusiveAmount>
    <TaxInclusiveAmount currencyID="COP">${invoice.total}.00</TaxInclusiveAmount>
    <PayableAmount currencyID="COP">${invoice.total}.00</PayableAmount>
  </LegalMonetaryTotal>
</AttachedDocument>`;

    const blob = new Blob([xmlContent], { type: 'application/xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DIAN_${invoice.numeroFactura}_AttachedDocument.xml`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('XML UBL 2.1 Descargado', `Contenedor electrónico ${invoice.numeroFactura}.xml generado.`);
  };

  const handleCopyCufe = (cufe) => {
    navigator.clipboard?.writeText(cufe);
    setCopiedCufe(true);
    showToast('CUFE Copiado', 'Código Único de Facturación Electrónica copiado.');
    setTimeout(() => setCopiedCufe(false), 2000);
  };

  const handleCreatePedido = (e) => {
    e.preventDefault();
    const part = inventory.find((p) => p.id === newPedidoForm.repuestoId);
    const unitPrice = part ? part.precioUnitario : Number(newPedidoForm.valorUnitarioLibre) || 0;
    const subtotal = unitPrice * (Number(newPedidoForm.cantidad) || 1);
    const total = Math.round(subtotal * 1.19);

    addPedido({
      cliente: newPedidoForm.cliente,
      documento: newPedidoForm.documento,
      telefono: newPedidoForm.telefono,
      direccionEntrega: newPedidoForm.direccionEntrega || 'Mostrador Principal',
      responsable: currentUser?.nombre || 'Administrador',
      estado: 'Pendiente',
      nota: newPedidoForm.nota || 'Pedido registrado',
      total,
      items: [
        {
          repuestoId: part?.id || '',
          codigo: part?.codigo || 'PED-ITEM',
          descripcion: part?.descripcion || newPedidoForm.descripcionLibre || 'Producto solicitado',
          cantidad: Number(newPedidoForm.cantidad) || 1,
          precioUnitario: unitPrice
        }
      ]
    });
    setNewPedidoForm({
      cliente: '',
      documento: '',
      telefono: '',
      direccionEntrega: '',
      repuestoId: '',
      descripcionLibre: '',
      valorUnitarioLibre: '',
      cantidad: 1,
      nota: ''
    });
    setIsNewPedidoOpen(false);
  };

  const handleCreateDevolucion = (e) => {
    e.preventDefault();
    addDevolucion({
      ...devForm,
      usuarioResponsable: `${currentUser?.nombre || 'Administrador'} (${currentUser?.rol || 'Admin'})`
    });
    setDevForm({
      facturaOrigen: '',
      cliente: '',
      repuestoId: '',
      codigoManual: '',
      descripcionManual: '',
      valorUnitario: '',
      cantidad: 1,
      tipoAccion: 'Reingreso a Inventario',
      motivo: ''
    });
  };

  const filteredVentas = ventas.filter((v) => {
    const term = search.toLowerCase();
    const matchesSearch =
      v.numeroFactura.toLowerCase().includes(term) ||
      v.cliente.toLowerCase().includes(term) ||
      v.cufe.toLowerCase().includes(term);

    const matchesDian =
      selectedDianFilter === 'Todos' || v.estadoDian === selectedDianFilter;

    return matchesSearch && matchesDian;
  });

  // Vista de Factura Electrónica Imprimible A4
  if (selectedInvoice) {
    return (
      <div className="space-y-5">
        <section className="no-print bg-white p-4 rounded-2xl border border-surface-border shadow-premium flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSelectedInvoice(null)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver a Ventas</span>
            </button>
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>Validada por la DIAN • {selectedInvoice.fecha}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => handleDownloadXML(selectedInvoice)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-surface-border bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-all cursor-pointer"
            >
              <FileCode className="w-4 h-4 text-agri" />
              <span>Descargar XML DIAN</span>
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-surface-border bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-all cursor-pointer"
            >
              <Download className="w-4 h-4 text-agri" />
              <span>PDF Reglamentario</span>
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-agri hover:bg-agri-hover text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir Factura</span>
            </button>
          </div>
        </section>

        <article
          id="printable-fiscal-invoice"
          className="w-full max-w-4xl mx-auto bg-white text-slate-900 p-6 sm:p-10 rounded-2xl border border-surface-border shadow-premium-lg"
        >
          <div className="mb-6 p-2.5 rounded-xl bg-slate-100 border border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-slate-700">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-agri" />
              <span className="font-bold text-agri">DOCUMENTO FISCAL ELECTRÓNICO</span>
              <span>•</span>
              <span>Ambiente Producción DIAN</span>
            </div>
            <div className="flex items-center gap-2">
              <span>Transmisión Digital ID: <strong>TX-{selectedInvoice.id}</strong></span>
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-600" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pb-6 border-b border-surface-border">
            <div className="md:col-span-7 space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-agri text-white flex items-center justify-center font-display font-extrabold text-lg shadow-inner">
                  J&E
                </div>
                <div>
                  <h2 className="text-base font-display font-extrabold text-agri tracking-tight">
                    CENTRO DE SERVICIOS J&E S.A.S.
                  </h2>
                  <p className="text-xs text-slate-600 font-medium">
                    Repuestos & Taller Especializado STIHL • Husqvarna • Royal Cóndor
                  </p>
                </div>
              </div>
              <div className="space-y-1 pt-2 text-xs text-slate-600">
                <p><strong className="text-slate-900">NIT:</strong> {dianInfo.nitEmisor} | Régimen Común / Responsable de IVA</p>
                <p><strong className="text-slate-900">Dirección:</strong> Sede Principal Centro de Servicios J&E</p>
                <p><strong className="text-slate-900">Contacto:</strong> 313 642 2685 • 312 346 0991 | facturacion@centroserviciosje.com</p>
                <p><strong className="text-slate-900">Actividad Económica CIIU:</strong> 4530 & 3312</p>
              </div>
            </div>

            <div className="md:col-span-5 flex flex-col justify-between bg-surface-bg p-4 rounded-xl border border-surface-border">
              <div className="text-right">
                <p className="text-[11px] uppercase tracking-wider text-amber-800 font-bold">
                  Factura Electrónica de Venta
                </p>
                <p className="text-2xl font-mono font-extrabold text-agri tracking-tight mt-0.5">
                  No. {selectedInvoice.numeroFactura}
                </p>
              </div>
              <div className="mt-3 font-mono text-[11px] text-slate-600 space-y-0.5 bg-white p-2.5 rounded-lg border border-slate-200">
                <p className="font-bold text-agri">Resolución DIAN No. {dianInfo.resolucion}</p>
                <p>Rango Autorizado: {dianInfo.rangoAutorizado}</p>
                <p>Vigencia: {dianInfo.vigencia}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-surface-bg p-4 rounded-xl border border-surface-border flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold text-agri uppercase tracking-wide pb-2 border-b border-slate-200 mb-2">
                  DATOS DEL ADQUIRENTE / CLIENTE
                </h3>
                <div className="text-xs space-y-1 text-slate-600">
                  <p><strong className="text-slate-900">Razón Social / Cliente:</strong> {selectedInvoice.cliente}</p>
                  <p><strong className="text-slate-900">NIT / Identificación:</strong> {selectedInvoice.documentoCliente || 'Registrado'}</p>
                  <p><strong className="text-slate-900">Dirección:</strong> {selectedInvoice.direccionCliente || 'Mostrador Principal'}</p>
                  <p><strong className="text-slate-900">Teléfono:</strong> {selectedInvoice.telefonoCliente || 'N/A'}</p>
                </div>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
                <span>Responsable: <strong>{selectedInvoice.vendedor}</strong></span>
                <span className="font-mono">POS #01</span>
              </div>
            </div>

            <div className="bg-surface-bg p-4 rounded-xl border border-surface-border flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold text-agri uppercase tracking-wide pb-2 border-b border-slate-200 mb-2">
                  CONDICIONES DE LA OPERACIÓN
                </h3>
                <div className="text-xs space-y-1 text-slate-600">
                  <p><strong className="text-slate-900">Fecha y Hora de Emisión:</strong> {selectedInvoice.fecha}</p>
                  <p><strong className="text-slate-900">Forma y Medio de Pago:</strong> {selectedInvoice.metodoPago}</p>
                  <p><strong className="text-slate-900">Estado de Entrega:</strong> {selectedInvoice.estadoPedido || 'Entregado'}</p>
                  <p><strong className="text-slate-900">Moneda:</strong> COP - Peso Colombiano</p>
                </div>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-200 text-[11px] text-emerald-800 flex items-center gap-1.5 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Operación verificada y validada</span>
              </div>
            </div>
          </div>

          <div className="mt-6 overflow-x-auto rounded-xl border border-surface-border">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-agri text-white uppercase text-[11px]">
                  <th className="py-2.5 px-3 font-semibold text-center w-12">ÍTEM</th>
                  <th className="py-2.5 px-3 font-semibold w-28">CÓDIGO</th>
                  <th className="py-2.5 px-3 font-semibold">DESCRIPCIÓN DEL BIEN O SERVICIO</th>
                  <th className="py-2.5 px-3 font-semibold text-center w-16">CANT</th>
                  <th className="py-2.5 px-3 font-semibold text-center w-20">UNIDAD</th>
                  <th className="py-2.5 px-3 font-semibold text-right w-28">VALOR UNIT.</th>
                  <th className="py-2.5 px-3 font-semibold text-center w-16">IVA</th>
                  <th className="py-2.5 px-3 font-semibold text-right w-32">SUBTOTAL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border bg-white">
                {selectedInvoice.itemsDetalle?.map((it, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="py-3 px-3 text-center font-mono text-slate-500">
                      {String(idx + 1).padStart(2, '0')}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-agri">
                      {it.codigo || `ITEM-0${idx + 1}`}
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-900">
                      {it.descripcion}
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-bold">
                      {it.cantidad}
                    </td>
                    <td className="py-3 px-3 text-center text-slate-500">
                      {it.unidad || 'Unidad'}
                    </td>
                    <td className="py-3 px-3 text-right font-mono">
                      {formatCurrency(it.valorUnitario)}
                    </td>
                    <td className="py-3 px-3 text-center font-mono text-slate-500">
                      19%
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                      {formatCurrency(it.cantidad * it.valorUnitario)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            <div className="md:col-span-7 space-y-3">
              <div className="bg-surface-bg p-3.5 rounded-xl border border-surface-border">
                <p className="text-[11px] text-slate-500 uppercase font-bold">Valor en Letras:</p>
                <p className="text-xs font-bold text-slate-900 tracking-tight mt-0.5">
                  SON: {numberToWordsCOP(selectedInvoice.total)}
                </p>
              </div>
              <div className="bg-surface-bg p-3.5 rounded-xl border border-surface-border space-y-1 text-xs text-slate-600">
                <p className="font-bold text-agri">Constancia de Aceptación Legal (Resolución 000042 DIAN):</p>
                <p className="text-[11px] leading-relaxed">
                  Esta factura electrónica de venta se asimila en todos sus efectos a una letra de cambio según el Art. 774 del Código de Comercio Colombiano.
                </p>
              </div>
            </div>

            <div className="md:col-span-5 bg-surface-bg p-4 rounded-xl border border-surface-border space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal Bruto:</span>
                <span className="font-mono font-semibold text-slate-900">{formatCurrency(selectedInvoice.subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Impuesto IVA (19%):</span>
                <span className="font-mono font-bold text-slate-900">{formatCurrency(selectedInvoice.iva)}</span>
              </div>
              <div className="pt-3 mt-2 bg-agri text-white p-3.5 rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-emerald-200 font-bold">TOTAL A PAGAR</p>
                  <p className="font-mono text-[10px] opacity-80">COP</p>
                </div>
                <p className="text-lg font-mono font-extrabold">{formatCurrency(selectedInvoice.total)}</p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-surface-border grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            <div className="md:col-span-3 flex flex-col items-center justify-center p-3 bg-surface-bg rounded-xl border border-surface-border">
              <svg className="w-24 h-24 text-slate-900" fill="currentColor" viewBox="0 0 100 100">
                <path d="M0,0 h30 v30 h-30 z M5,5 v20 h20 v-20 z M10,10 h10 v10 h-10 z" />
                <path d="M70,0 h30 v30 h-30 z M75,5 v20 h20 v-20 z M80,10 h10 v10 h-10 z" />
                <path d="M0,70 h30 v30 h-30 z M5,75 v20 h20 v-20 z M10,80 h10 v10 h-10 z" />
                <rect height="16" width="16" x="42" y="36" />
                <rect height="12" width="12" x="52" y="60" />
              </svg>
              <span className="font-mono text-[10px] text-slate-500 mt-1">Verificación QR DIAN</span>
            </div>

            <div className="md:col-span-9 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-agri uppercase">
                  CUFE (Código Único de Facturación Electrónica):
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyCufe(selectedInvoice.cufe)}
                  className="no-print text-agri hover:underline text-xs font-semibold inline-flex items-center gap-1 cursor-pointer"
                >
                  {copiedCufe ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCufe ? 'Copiado' : 'Copiar CUFE'}</span>
                </button>
              </div>
              <div className="p-2.5 bg-slate-100 rounded-lg border border-slate-200 font-mono text-xs text-slate-800 break-all select-all">
                {selectedInvoice.cufe}
              </div>
            </div>
          </div>
        </article>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Encabezado y Pestañas */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-display font-bold text-surface-dark tracking-tight flex items-center gap-2">
            <Receipt className="w-5 h-5 text-agri" />
            <span>Ventas, Pedidos, Devoluciones y Facturación DIAN</span>
          </h1>
          <p className="text-xs text-surface-muted mt-0.5">
            Registra transacciones comerciales, actualiza el inventario automáticamente y emite facturas electrónicas
          </p>
        </div>

        <div className="flex flex-wrap items-center bg-white border border-surface-border rounded-xl p-1 text-xs font-semibold shadow-2xs gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('registro')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'registro' ? 'bg-agri text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Registrar Venta</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('facturas')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'facturas' ? 'bg-agri text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>Facturas DIAN ({ventas.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('pedidos')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'pedidos' ? 'bg-agri text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Pedidos ({pedidos.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('devoluciones')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'devoluciones' ? 'bg-agri text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Devoluciones ({devoluciones.length})</span>
          </button>
        </div>
      </div>

      {/* TAB 1: REGISTRO DE VENTA E INVENTARIO */}
      {activeTab === 'registro' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          <div className="lg:col-span-8 bg-white rounded-2xl border border-emerald-400/60 shadow-premium overflow-hidden">
            <div className="px-6 py-4 border-b border-surface-border flex items-center justify-between bg-white">
              <div>
                <h2 className="text-base font-display font-bold text-surface-dark">
                  Registrar nueva venta y factura electrónica
                </h2>
                <p className="text-xs text-surface-muted mt-0.5">
                  Completa los datos del adquirente y agrega los productos del catálogo o servicios a facturar.
                </p>
              </div>
              <span className="font-mono text-xs font-bold bg-agri-soft text-agri border border-emerald-200 px-3 py-1 rounded-lg">
                Próxima: {nextInvoiceCode}
              </span>
            </div>

            <div className="p-6 space-y-6">
              {/* Bloque 1: Datos del Cliente y Venta */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-agri border-b border-surface-border pb-2 mb-3.5">
                  1. Datos del Cliente y Operación
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1.5">
                      Fecha de emisión *
                    </label>
                    <input
                      type="date"
                      value={saleHeader.fecha}
                      onChange={(e) => setSaleHeader({ ...saleHeader, fecha: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-surface-border rounded-xl font-mono text-xs"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-slate-700 mb-1.5">
                      Nombre del cliente o razón social *
                    </label>
                    <input
                      type="text"
                      required
                      value={saleHeader.cliente}
                      onChange={(e) => setSaleHeader({ ...saleHeader, cliente: e.target.value })}
                      placeholder="Ej: Juan Pérez o Agropecuaria El Roble"
                      className="w-full px-3.5 py-2.5 bg-white border border-surface-border rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1.5">
                      NIT o Cédula
                    </label>
                    <input
                      type="text"
                      value={saleHeader.documentoCliente}
                      onChange={(e) => setSaleHeader({ ...saleHeader, documentoCliente: e.target.value })}
                      placeholder="Ej: 901.000.000-1"
                      className="w-full px-3.5 py-2.5 bg-white border border-surface-border rounded-xl font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1.5">
                      Teléfono de contacto
                    </label>
                    <input
                      type="text"
                      value={saleHeader.telefonoCliente}
                      onChange={(e) => setSaleHeader({ ...saleHeader, telefonoCliente: e.target.value })}
                      placeholder="Ej: 310 000 0000"
                      className="w-full px-3.5 py-2.5 bg-white border border-surface-border rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1.5">
                      Responsable de la venta
                    </label>
                    <select
                      value={saleHeader.vendedor}
                      onChange={(e) => setSaleHeader({ ...saleHeader, vendedor: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-surface-border rounded-xl text-xs font-medium"
                    >
                      <option value="Juan Fernando Posada Ramírez">Juan Fernando Posada</option>
                      <option value="Eliecer Quintero Zuluaga">Eliecer Quintero</option>
                      <option value="Yarlei Stiven Posada Muñoz">Yarlei Stiven Posada</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Bloque 2: Productos / Servicios */}
              <div className="space-y-3.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-surface-border pb-2.5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-agri">
                    2. Productos y Servicios a Facturar
                  </h3>

                  <div className="flex flex-wrap items-center gap-2">
                    {inventory.length > 0 ? (
                      <>
                        <select
                          value={partToAddId}
                          onChange={(e) => setPartToAddId(e.target.value)}
                          className="px-3 py-2 bg-white border border-surface-border rounded-xl text-xs max-w-[240px]"
                        >
                          <option value="">Seleccionar del catálogo...</option>
                          {inventory.map((part) => (
                            <option key={part.id} value={part.id} disabled={part.stock <= 0}>
                              {part.codigo} - {part.descripcion} ({formatCurrency(part.precioUnitario)}) [Stock: {part.stock}]
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={handleAddProductToSale}
                          className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-agri hover:bg-agri-hover text-white font-semibold text-xs cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Del Catálogo</span>
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => navigate('/inventario')}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-agri-soft text-agri border border-emerald-200 font-semibold text-xs cursor-pointer"
                      >
                        <PackagePlus className="w-3.5 h-3.5" />
                        <span>Crear producto en Inventario</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={handleAddCustomLine}
                      className="inline-flex items-center gap-1 px-3 py-2 rounded-xl border border-surface-border bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 text-agri" />
                      <span>Añadir Concepto Libre</span>
                    </button>
                  </div>
                </div>

                {saleItems.length === 0 ? (
                  <div className="p-8 rounded-2xl bg-surface-bg/70 border border-dashed border-surface-border text-center space-y-2.5">
                    <p className="text-xs font-bold text-slate-700">
                      Aún no has agregado productos a esta venta
                    </p>
                    <p className="text-xs text-surface-muted max-w-md mx-auto">
                      Selecciona un producto de tu catálogo de inventario o haz clic en <strong>+ Añadir Concepto Libre</strong> para escribir un ítem o servicio directamente.
                    </p>
                    <div className="pt-1 flex justify-center gap-2">
                      {inventory.length > 0 && (
                        <button
                          type="button"
                          onClick={handleAddProductToSale}
                          className="px-3.5 py-2 rounded-xl bg-agri text-white font-bold text-xs cursor-pointer"
                        >
                          + Cargar del catálogo
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={handleAddCustomLine}
                        className="px-3.5 py-2 rounded-xl border border-surface-border bg-white text-slate-700 font-semibold text-xs hover:bg-slate-50 cursor-pointer"
                      >
                        + Añadir línea manual
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="border border-surface-border rounded-xl overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-600 uppercase text-[11px] font-bold">
                        <tr>
                          <th className="px-3 py-2.5 w-28">Código</th>
                          <th className="px-3 py-2.5">Descripción</th>
                          <th className="px-3 py-2.5 text-center w-24">Cant.</th>
                          <th className="px-3 py-2.5 text-right w-32">Precio Unit.</th>
                          <th className="px-3 py-2.5 text-right w-28">Subtotal</th>
                          <th className="px-3 py-2.5 text-center w-12"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-surface-border">
                        {saleItems.map((item) => (
                          <tr key={item.id} className="hover:bg-slate-50/80">
                            <td className="px-3 py-2">
                              <input
                                type="text"
                                value={item.codigo}
                                onChange={(e) => handleUpdateSaleItem(item.id, 'codigo', e.target.value.toUpperCase())}
                                placeholder="SKU"
                                className="w-full px-2 py-1.5 bg-white border border-surface-border rounded-lg font-mono text-xs font-bold text-agri"
                              />
                            </td>
                            <td className="px-3 py-2">
                              <input
                                type="text"
                                value={item.descripcion}
                                onChange={(e) => handleUpdateSaleItem(item.id, 'descripcion', e.target.value)}
                                placeholder="Nombre del repuesto o servicio..."
                                className="w-full px-2.5 py-1.5 bg-white border border-surface-border rounded-lg text-xs"
                              />
                            </td>
                            <td className="px-3 py-2 text-center">
                              <input
                                type="number"
                                min="1"
                                value={item.cantidad}
                                onChange={(e) => handleUpdateSaleItem(item.id, 'cantidad', e.target.value)}
                                className="w-16 px-2 py-1.5 text-center font-mono font-bold bg-white border border-surface-border rounded-lg"
                              />
                            </td>
                            <td className="px-3 py-2 text-right">
                              <input
                                type="number"
                                min="0"
                                value={item.valorUnitario}
                                onChange={(e) => handleUpdateSaleItem(item.id, 'valorUnitario', e.target.value)}
                                placeholder="0"
                                className="w-28 px-2.5 py-1.5 text-right font-mono font-semibold bg-white border border-surface-border rounded-lg"
                              />
                            </td>
                            <td className="px-3 py-2 text-right font-mono font-bold text-slate-900">
                              {formatCurrency((Number(item.cantidad) || 0) * (Number(item.valorUnitario) || 0))}
                            </td>
                            <td className="px-3 py-2 text-center">
                              <button
                                type="button"
                                onClick={() => handleRemoveSaleItem(item.id)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                                title="Quitar fila"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Forma de Pago y Totales */}
                <div className="p-4 bg-surface-bg rounded-xl border border-surface-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <span className="block text-xs font-bold text-slate-700">Forma de Pago:</span>
                    <div className="flex flex-wrap items-center gap-4 text-xs">
                      {['Efectivo', 'Tarjeta', 'Transferencia'].map((metodo) => (
                        <label key={metodo} className="inline-flex items-center gap-2 cursor-pointer font-semibold text-slate-700">
                          <input
                            type="radio"
                            name="forma_pago"
                            checked={saleHeader.metodoPago === metodo}
                            onChange={() => setSaleHeader({ ...saleHeader, metodoPago: metodo })}
                            className="w-4 h-4 text-agri focus:ring-agri"
                          />
                          <span>{metodo}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="w-full sm:w-56 space-y-1 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Subtotal:</span>
                      <strong className="font-mono">{formatCurrency(saleSubtotal)}</strong>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>IVA (19%):</span>
                      <strong className="font-mono">{formatCurrency(saleIva)}</strong>
                    </div>
                    <div className="flex justify-between text-sm font-display font-extrabold text-agri pt-1.5 border-t border-slate-200">
                      <span>Total a Pagar:</span>
                      <strong className="font-mono">{formatCurrency(saleTotal)}</strong>
                    </div>
                  </div>
                </div>

                {/* Botones de Acción */}
                <div className="flex flex-wrap items-center justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={handleResetSaleForm}
                    className="px-4 py-2.5 rounded-xl border border-surface-border bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs cursor-pointer"
                  >
                    Limpiar formulario
                  </button>
                  <button
                    type="button"
                    onClick={() => handleEmitSaleAndInvoice(false)}
                    className="px-4 py-2.5 rounded-xl bg-agri hover:bg-agri-hover text-white font-bold text-xs shadow-sm cursor-pointer"
                  >
                    Registrar Venta
                  </button>
                  <button
                    type="button"
                    onClick={() => handleEmitSaleAndInvoice(true)}
                    className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Generar e Imprimir Factura DIAN</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Estado Actual en Tiempo Real */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-2xl border border-surface-border shadow-premium overflow-hidden">
              <div className="px-5 py-3.5 bg-agri text-white flex items-center justify-between">
                <span className="text-xs font-display font-bold uppercase tracking-wider">Estado Actual del Sistema</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>

              <div className="p-5 space-y-3 text-xs">
                <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Consecutivo DIAN:</span>
                  <span className="font-mono font-bold text-agri text-sm">{nextInvoiceCode}</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Stock en Bodega:</span>
                  <span className="font-mono font-bold text-slate-900">{totalStockAvailable} unidades</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Estado WebService DIAN:</span>
                  <Badge status="Aprobada">En Línea</Badge>
                </div>

                <div className="pt-2 space-y-2">
                  <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-agri-soft border border-emerald-200 text-agri font-semibold">
                    <PackageCheck className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                    <span>Descuento automático de inventario</span>
                  </div>
                  <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-agri-soft border border-emerald-200 text-agri font-semibold">
                    <ShoppingBag className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                    <span>Generación automática de pedido</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-surface-border shadow-premium p-5 space-y-2">
              <h4 className="text-xs font-display font-bold text-slate-900">Actividad Registrada Hoy</h4>
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="p-3 rounded-xl bg-surface-bg border border-surface-border">
                  <span className="text-[11px] text-surface-muted block">Ventas Emitidas</span>
                  <strong className="text-lg font-mono font-bold text-agri">{ventas.length}</strong>
                </div>
                <div className="p-3 rounded-xl bg-surface-bg border border-surface-border">
                  <span className="text-[11px] text-surface-muted block">Órdenes Taller</span>
                  <strong className="text-lg font-mono font-bold text-slate-900">{tallerOrders.length}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: FACTURAS ELECTRÓNICAS DIAN */}
      {activeTab === 'facturas' && (
        <div className="space-y-4">
          {ventas.length === 0 ? (
            <div className="bg-white rounded-2xl border border-surface-border shadow-premium p-12 text-center space-y-3">
              <Receipt className="w-8 h-8 text-slate-400 mx-auto" />
              <h3 className="text-sm font-display font-bold text-slate-800">No hay facturas emitidas todavía</h3>
              <p className="text-xs text-surface-muted max-w-sm mx-auto">
                Registra tu primera venta en la pestaña <strong>Registrar Venta</strong> para generar el comprobante electrónico DIAN.
              </p>
              <button
                onClick={() => setActiveTab('registro')}
                className="px-4 py-2 rounded-xl bg-agri text-white font-bold text-xs cursor-pointer"
              >
                Ir a Registrar Venta
              </button>
            </div>
          ) : (
            <>
              <div className="bg-white p-3.5 rounded-2xl border border-surface-border shadow-premium flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-slate-400 absolute inset-y-0 left-3.5 my-auto pointer-events-none" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar por factura FE-, cliente o CUFE..."
                    className="w-full pl-9 pr-3 py-2 text-xs bg-surface-bg border border-surface-border rounded-xl"
                  />
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-surface-border shadow-premium overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-surface-border">
                      <tr>
                        <th className="px-4 py-3.5">Comprobante</th>
                        <th className="px-4 py-3.5">Cliente</th>
                        <th className="px-4 py-3.5">Vendedor</th>
                        <th className="px-4 py-3.5">Fecha</th>
                        <th className="px-4 py-3.5">Pago</th>
                        <th className="px-4 py-3.5 text-right">Subtotal</th>
                        <th className="px-4 py-3.5 text-right">Total</th>
                        <th className="px-4 py-3.5 text-center">DIAN</th>
                        <th className="px-4 py-3.5 text-center">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-border text-slate-700">
                      {filteredVentas.map((venta) => (
                        <tr key={venta.id} className="hover:bg-slate-50/70">
                          <td className="px-4 py-3.5 font-mono font-bold text-agri">{venta.numeroFactura}</td>
                          <td className="px-4 py-3.5 font-semibold text-slate-900">{venta.cliente}</td>
                          <td className="px-4 py-3.5 text-slate-600">{venta.vendedor}</td>
                          <td className="px-4 py-3.5 font-mono text-slate-500">{venta.fecha}</td>
                          <td className="px-4 py-3.5">{venta.metodoPago}</td>
                          <td className="px-4 py-3.5 text-right font-mono">{formatCurrency(venta.subtotal)}</td>
                          <td className="px-4 py-3.5 text-right font-mono font-bold text-slate-900">{formatCurrency(venta.total)}</td>
                          <td className="px-4 py-3.5 text-center"><Badge status={venta.estadoDian}>{venta.estadoDian}</Badge></td>
                          <td className="px-4 py-3.5 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => setSelectedInvoice(venta)}
                                className="px-3 py-1.5 rounded-lg bg-agri text-white hover:bg-agri-hover font-semibold text-xs cursor-pointer inline-flex items-center gap-1"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>Ver / Imprimir</span>
                              </button>
                              <button
                                onClick={() => handleDownloadXML(venta)}
                                className="px-2.5 py-1.5 rounded-lg border border-surface-border hover:bg-slate-100 text-slate-700 font-mono text-[11px] cursor-pointer"
                              >
                                XML
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* TAB 3: GESTIÓN DE PEDIDOS (RF-005) */}
      {activeTab === 'pedidos' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-surface-border shadow-premium flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-display font-bold text-slate-900">
                Seguimiento de Pedidos de Clientes
              </h3>
              <p className="text-xs text-surface-muted">
                Control de estados: <strong>Pendiente</strong>, <strong>En proceso</strong> y <strong>Entregado</strong>
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsNewPedidoOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-agri hover:bg-agri-hover text-white font-bold text-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Registrar Pedido</span>
            </button>
          </div>

          {pedidos.length === 0 ? (
            <div className="bg-white rounded-2xl border border-surface-border shadow-premium p-12 text-center space-y-3">
              <ShoppingBag className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-sm font-display font-bold text-slate-800">No hay pedidos registrados</p>
              <p className="text-xs text-surface-muted max-w-sm mx-auto">
                Los pedidos se crean automáticamente al registrar una venta o puedes crearlos manualmente con el botón superior.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-surface-border shadow-premium overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-surface-border">
                    <tr>
                      <th className="px-4 py-3.5">ID Pedido</th>
                      <th className="px-4 py-3.5">Cliente</th>
                      <th className="px-4 py-3.5">Entrega</th>
                      <th className="px-4 py-3.5">Factura</th>
                      <th className="px-4 py-3.5 text-right">Total</th>
                      <th className="px-4 py-3.5 text-center">Estado</th>
                      <th className="px-4 py-3.5 text-center">Seguimiento</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-border text-slate-700">
                    {pedidos.map((ped) => (
                      <tr key={ped.id} className="hover:bg-slate-50/70">
                        <td className="px-4 py-3.5 font-mono font-bold text-agri">{ped.id}</td>
                        <td className="px-4 py-3.5 font-semibold text-slate-900">{ped.cliente}</td>
                        <td className="px-4 py-3.5 text-slate-600">{ped.direccionEntrega}</td>
                        <td className="px-4 py-3.5 font-mono">{ped.facturaAsociada}</td>
                        <td className="px-4 py-3.5 text-right font-mono font-bold">{formatCurrency(ped.total)}</td>
                        <td className="px-4 py-3.5 text-center"><Badge status={ped.estado}>{ped.estado}</Badge></td>
                        <td className="px-4 py-3.5 text-center">
                          <div className="inline-flex items-center gap-1.5">
                            <select
                              value={ped.estado}
                              onChange={(e) => updatePedidoStatus(ped.id, e.target.value)}
                              className="px-2.5 py-1 bg-white border border-surface-border rounded-lg text-xs font-semibold"
                            >
                              <option value="Pendiente">Pendiente</option>
                              <option value="En proceso">En proceso</option>
                              <option value="Entregado">Entregado</option>
                            </select>
                            <button
                              type="button"
                              onClick={() => setSelectedPedidoHistory(ped)}
                              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-agri text-slate-700 font-semibold text-xs cursor-pointer inline-flex items-center gap-1"
                            >
                              <Clock className="w-3.5 h-3.5" />
                              <span>Historial</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: DEVOLUCIONES (RF-009) */}
      {activeTab === 'devoluciones' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-emerald-400/60 shadow-premium space-y-4">
            <div>
              <h3 className="text-base font-display font-bold text-slate-900">
                Registrar devolución de producto
              </h3>
              <p className="text-xs text-surface-muted mt-0.5">
                Actualiza el inventario automáticamente y deja constancia del motivo y responsable.
              </p>
            </div>

            <form onSubmit={handleCreateDevolucion} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">No. Factura Origen *</label>
                  <input
                    type="text"
                    required
                    value={devForm.facturaOrigen}
                    onChange={(e) => setDevForm({ ...devForm, facturaOrigen: e.target.value.toUpperCase() })}
                    placeholder="Ej: FE-001001"
                    className="w-full px-3.5 py-2.5 bg-white border border-surface-border rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">Cantidad *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={devForm.cantidad}
                    onChange={(e) => setDevForm({ ...devForm, cantidad: parseInt(e.target.value) || 1 })}
                    className="w-full px-3.5 py-2.5 bg-white border border-surface-border rounded-xl font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">Cliente *</label>
                <input
                  type="text"
                  required
                  value={devForm.cliente}
                  onChange={(e) => setDevForm({ ...devForm, cliente: e.target.value })}
                  placeholder="Nombre del cliente que realiza la devolución"
                  className="w-full px-3.5 py-2.5 bg-white border border-surface-border rounded-xl"
                />
              </div>

              {inventory.length > 0 ? (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">Producto del catálogo *</label>
                  <select
                    required
                    value={devForm.repuestoId}
                    onChange={(e) => setDevForm({ ...devForm, repuestoId: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-surface-border rounded-xl"
                  >
                    <option value="">Seleccionar producto...</option>
                    {inventory.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.codigo} - {p.descripcion} (Stock actual: {p.stock})
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1.5">Producto devuelto *</label>
                    <input
                      type="text"
                      required
                      value={devForm.descripcionManual}
                      onChange={(e) => setDevForm({ ...devForm, descripcionManual: e.target.value })}
                      placeholder="Nombre del producto"
                      className="w-full px-3.5 py-2.5 bg-white border border-surface-border rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1.5">Valor Unit. (COP)</label>
                    <input
                      type="number"
                      min="0"
                      value={devForm.valorUnitario}
                      onChange={(e) => setDevForm({ ...devForm, valorUnitario: e.target.value })}
                      placeholder="0"
                      className="w-full px-3.5 py-2.5 bg-white border border-surface-border rounded-xl font-mono"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">Acción en inventario *</label>
                <select
                  value={devForm.tipoAccion}
                  onChange={(e) => setDevForm({ ...devForm, tipoAccion: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-surface-border rounded-xl font-medium"
                >
                  <option value="Reingreso a Inventario">Reingreso a Inventario (+ Suma al stock)</option>
                  <option value="Garantía / Defectuoso">Garantía por Defecto (No suma a stock vendible)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">Motivo de la devolución *</label>
                <textarea
                  rows={2}
                  required
                  value={devForm.motivo}
                  onChange={(e) => setDevForm({ ...devForm, motivo: e.target.value })}
                  placeholder="Describe la razón de la devolución o garantía..."
                  className="w-full px-3.5 py-2.5 bg-white border border-surface-border rounded-xl"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-agri hover:bg-agri-hover text-white font-bold rounded-xl shadow-sm transition-all cursor-pointer"
              >
                Registrar devolución
              </button>
            </form>
          </div>

          <div className="lg:col-span-7 bg-white rounded-2xl border border-surface-border shadow-premium overflow-hidden">
            <div className="p-5 border-b border-surface-border">
              <h3 className="text-sm font-display font-bold text-slate-900">
                Historial de Devoluciones ({devoluciones.length})
              </h3>
            </div>

            {devoluciones.length === 0 ? (
              <div className="p-10 text-center text-xs text-surface-muted">
                No se han registrado devoluciones todavía.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase text-[11px] font-semibold border-b border-surface-border">
                    <tr>
                      <th className="px-4 py-3">ID / Fecha</th>
                      <th className="px-4 py-3">Producto & Factura</th>
                      <th className="px-4 py-3">Motivo y Responsable</th>
                      <th className="px-4 py-3 text-center">Cant.</th>
                      <th className="px-4 py-3 text-right">Valor</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-border text-slate-700">
                    {devoluciones.map((dev) => (
                      <tr key={dev.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3">
                          <span className="font-mono font-bold text-agri block">{dev.id}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{dev.fecha}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-semibold text-slate-900 block">
                            {dev.codigo} - {dev.descripcion}
                          </span>
                          <span className="text-[11px] text-slate-500">
                            Factura: <strong className="font-mono">{dev.facturaOrigen}</strong>
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-slate-700">{dev.motivo}</p>
                          <span className="text-[10px] text-slate-400 block">Resp: {dev.usuarioResponsable}</span>
                        </td>
                        <td className="px-4 py-3 text-center font-mono font-bold text-emerald-800">
                          +{dev.cantidad}
                        </td>
                        <td className="px-4 py-3 text-right font-mono font-bold text-slate-900">
                          {formatCurrency(dev.valorReintegrado)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal Historial de Pedido */}
      <Modal
        isOpen={!!selectedPedidoHistory}
        onClose={() => setSelectedPedidoHistory(null)}
        title={`Historial del Pedido ${selectedPedidoHistory?.id}`}
        size="md"
      >
        {selectedPedidoHistory && (
          <div className="space-y-4 text-xs text-slate-700">
            <div className="p-3.5 bg-surface-bg rounded-xl border border-surface-border flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900">{selectedPedidoHistory.cliente}</p>
                <p className="text-[11px] text-slate-500">Entrega: {selectedPedidoHistory.direccionEntrega}</p>
              </div>
              <Badge status={selectedPedidoHistory.estado}>{selectedPedidoHistory.estado}</Badge>
            </div>

            <div className="space-y-2.5 pl-3 border-l-2 border-agri">
              {selectedPedidoHistory.historial?.map((h, i) => (
                <div key={i} className="p-3 bg-surface-bg rounded-xl border border-surface-border">
                  <div className="flex items-center justify-between">
                    <Badge status={h.estado}>{h.estado}</Badge>
                    <span className="font-mono text-[11px] text-slate-400">{h.fecha}</span>
                  </div>
                  <p className="mt-1.5 text-slate-700 font-medium">{h.nota}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>

      {/* Modal Nuevo Pedido Limpio */}
      <Modal
        isOpen={isNewPedidoOpen}
        onClose={() => setIsNewPedidoOpen(false)}
        title="Registrar nuevo pedido de cliente"
        subtitle="Ingresa los datos del cliente y el producto solicitado para iniciar su seguimiento."
        size="md"
      >
        <form onSubmit={handleCreatePedido} className="space-y-3.5 text-xs text-slate-700">
          <div>
            <label className="block font-semibold mb-1.5">Nombre del cliente *</label>
            <input
              type="text"
              required
              value={newPedidoForm.cliente}
              onChange={(e) => setNewPedidoForm({ ...newPedidoForm, cliente: e.target.value })}
              placeholder="Ej: Cooperativa Cafetera o Juan Pérez"
              className="w-full px-3.5 py-2.5 bg-white border border-surface-border rounded-xl"
            />
          </div>
          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className="block font-semibold mb-1.5">NIT / Cédula</label>
              <input
                type="text"
                value={newPedidoForm.documento}
                onChange={(e) => setNewPedidoForm({ ...newPedidoForm, documento: e.target.value })}
                placeholder="Ej: 901.000.000-1"
                className="w-full px-3.5 py-2.5 bg-white border border-surface-border rounded-xl font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1.5">Teléfono</label>
              <input
                type="text"
                value={newPedidoForm.telefono}
                onChange={(e) => setNewPedidoForm({ ...newPedidoForm, telefono: e.target.value })}
                placeholder="Ej: 310 000 0000"
                className="w-full px-3.5 py-2.5 bg-white border border-surface-border rounded-xl"
              />
            </div>
          </div>
          <div>
            <label className="block font-semibold mb-1.5">Dirección o modalidad de entrega *</label>
            <input
              type="text"
              required
              value={newPedidoForm.direccionEntrega}
              onChange={(e) => setNewPedidoForm({ ...newPedidoForm, direccionEntrega: e.target.value })}
              placeholder="Ej: Recoge en mostrador o Envío a finca"
              className="w-full px-3.5 py-2.5 bg-white border border-surface-border rounded-xl"
            />
          </div>

          {inventory.length > 0 ? (
            <div className="grid grid-cols-3 gap-3.5">
              <div className="col-span-2">
                <label className="block font-semibold mb-1.5">Producto del catálogo *</label>
                <select
                  required
                  value={newPedidoForm.repuestoId}
                  onChange={(e) => setNewPedidoForm({ ...newPedidoForm, repuestoId: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-surface-border rounded-xl"
                >
                  <option value="">Seleccionar...</option>
                  {inventory.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.codigo} - {p.descripcion} ({formatCurrency(p.precioUnitario)})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-semibold mb-1.5">Cantidad *</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={newPedidoForm.cantidad}
                  onChange={(e) => setNewPedidoForm({ ...newPedidoForm, cantidad: parseInt(e.target.value) || 1 })}
                  className="w-full px-3.5 py-2.5 bg-white border border-surface-border rounded-xl font-mono font-bold"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3.5">
              <div>
                <label className="block font-semibold mb-1.5">Producto solicitado *</label>
                <input
                  type="text"
                  required
                  value={newPedidoForm.descripcionLibre}
                  onChange={(e) => setNewPedidoForm({ ...newPedidoForm, descripcionLibre: e.target.value })}
                  placeholder="Descripción del repuesto"
                  className="w-full px-3.5 py-2.5 bg-white border border-surface-border rounded-xl"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1.5">Precio Unitario (COP) *</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={newPedidoForm.valorUnitarioLibre}
                  onChange={(e) => setNewPedidoForm({ ...newPedidoForm, valorUnitarioLibre: e.target.value })}
                  placeholder="0"
                  className="w-full px-3.5 py-2.5 bg-white border border-surface-border rounded-xl font-mono"
                />
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2.5 pt-3 border-t border-surface-border">
            <button
              type="button"
              onClick={() => setIsNewPedidoOpen(false)}
              className="px-4 py-2 font-semibold text-slate-600 border border-surface-border rounded-xl cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 font-bold text-white bg-agri hover:bg-agri-hover rounded-xl cursor-pointer"
            >
              Guardar pedido
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
