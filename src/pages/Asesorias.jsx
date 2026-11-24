import React, { useState } from 'react';
import {
  BookOpenCheck,
  Flame,
  CheckCircle2,
  MessageSquarePlus,
  Wrench,
  Clock
} from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import Badge from '../components/common/Badge';

export default function Asesorias() {
  const {
    asesorias,
    consultasAsesoria,
    addConsultaAsesoria
  } = useAppData();

  const [fuelUnit, setFuelUnit] = useState('litros');
  const [fuelAmount, setFuelAmount] = useState(5);
  const [mixRatio, setMixRatio] = useState('1:50');

  const initialEmptyConsulta = {
    cliente: '',
    equipo: '',
    consulta: '',
    respuestaTecnica: '',
    atendidoPor: 'Juan Fernando Posada Ramírez'
  };

  const [consultaForm, setConsultaForm] = useState(initialEmptyConsulta);

  const litersEquivalent = fuelUnit === 'galones' ? Number(fuelAmount) * 3.78541 : Number(fuelAmount);
  const mlPerLiter = mixRatio === '1:50' ? 20 : 25;
  const requiredOilMl = Math.round(litersEquivalent * mlPerLiter);
  const requiredOilOz = (requiredOilMl / 29.5735).toFixed(1);

  const handleCreateConsulta = (e) => {
    e.preventDefault();
    if (!consultaForm.consulta.trim()) return;
    addConsultaAsesoria(consultaForm);
    setConsultaForm(initialEmptyConsulta);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-display font-bold text-surface-dark tracking-tight flex items-center gap-2">
            <BookOpenCheck className="w-5 h-5 text-agri" />
            <span>Módulo de Asesorías Técnicas y Mantenimiento</span>
          </h1>
          <p className="text-xs text-surface-muted mt-0.5">
            Calculadora de mezcla 2T, guías de mantenimiento preventivo y registro de asesorías al cliente
          </p>
        </div>
      </div>

      {/* Calculadora de Mezcla 2T */}
      <div className="bg-white rounded-2xl border border-emerald-400/60 shadow-premium overflow-hidden">
        <div className="px-6 py-4 bg-agri text-white flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-300" />
            <h2 className="text-xs sm:text-sm font-display font-bold">
              Calculadora de Mezcla de Combustible 2 Tiempos (Gasolina + Aceite 2T)
            </h2>
          </div>
          <span className="text-[11px] font-mono bg-white/15 px-2.5 py-0.5 rounded-lg">
            STIHL / Husqvarna
          </span>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">Unidad de Gasolina</label>
              <select
                value={fuelUnit}
                onChange={(e) => setFuelUnit(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-surface-border rounded-xl font-medium"
              >
                <option value="litros">Litros (L)</option>
                <option value="galones">Galones (3.785 L)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Cantidad ({fuelUnit === 'litros' ? 'Litros' : 'Galones'})
              </label>
              <input
                type="number"
                min="0.5"
                step="0.5"
                value={fuelAmount}
                onChange={(e) => setFuelAmount(Math.max(0.5, parseFloat(e.target.value) || 1))}
                className="w-full px-3.5 py-2.5 bg-white border border-surface-border rounded-xl font-mono font-bold text-sm"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">Proporción Aceite 2T</label>
              <select
                value={mixRatio}
                onChange={(e) => setMixRatio(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-surface-border rounded-xl font-medium"
              >
                <option value="1:50">1:50 (Sintético - 20 ml/L)</option>
                <option value="1:40">1:40 (Estándar - 25 ml/L)</option>
              </select>
            </div>
          </div>

          <div className="lg:col-span-5 bg-agri-soft border border-emerald-200 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-agri block">
                Medida Exacta de Aceite 2T:
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-mono font-extrabold text-agri">
                  {requiredOilMl} ml
                </span>
                <span className="text-xs font-mono font-semibold text-slate-600">
                  ({requiredOilOz} oz)
                </span>
              </div>
              <p className="text-[11px] text-emerald-900 mt-1">
                Para <strong>{fuelAmount} {fuelUnit}</strong> ({litersEquivalent.toFixed(1)} L) de gasolina corriente.
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-agri text-white flex items-center justify-center font-mono font-bold text-xs shadow-sm">
              {mixRatio}
            </div>
          </div>
        </div>
      </div>

      {/* Guías Técnicas de Referencia */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {asesorias.map((guide) => (
          <div
            key={guide.id}
            className="bg-white rounded-2xl border border-surface-border shadow-premium p-5 flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-agri bg-agri-soft px-2.5 py-0.5 rounded-md border border-emerald-200">
                    {guide.categoria}
                  </span>
                  <h3 className="text-sm font-display font-bold text-slate-900 mt-2">
                    {guide.titulo}
                  </h3>
                </div>
                <span className="font-mono text-[11px] text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{guide.tiempoLectura}</span>
                </span>
              </div>

              <p className="text-xs text-surface-muted leading-relaxed">
                {guide.resumen}
              </p>

              <ul className="space-y-2 pt-1">
                {guide.recomendaciones.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
                    <span className="leading-snug">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1 font-medium">
                <Wrench className="w-3.5 h-3.5 text-agri" />
                <span>Frecuencia: <strong>{guide.frecuenciaMantenimiento}</strong></span>
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Registro e Historial de Asesorías */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-emerald-400/60 shadow-premium space-y-4">
          <div>
            <h3 className="text-base font-display font-bold text-slate-900 flex items-center gap-2">
              <MessageSquarePlus className="w-4 h-4 text-agri" />
              <span>Registrar asesoría al cliente</span>
            </h3>
            <p className="text-xs text-surface-muted mt-0.5">
              Guarda recomendaciones técnicas personalizadas sobre uso y cuidado de maquinaria.
            </p>
          </div>

          <form onSubmit={handleCreateConsulta} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">Nombre del cliente *</label>
              <input
                type="text"
                required
                value={consultaForm.cliente}
                onChange={(e) => setConsultaForm({ ...consultaForm, cliente: e.target.value })}
                placeholder="Ej: Finca La Esperanza o Pedro Gómez"
                className="w-full px-3.5 py-2.5 bg-white border border-surface-border rounded-xl"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">Equipo o maquinaria *</label>
              <input
                type="text"
                required
                value={consultaForm.equipo}
                onChange={(e) => setConsultaForm({ ...consultaForm, equipo: e.target.value })}
                placeholder="Ej: Guadañadora STIHL FS 250"
                className="w-full px-3.5 py-2.5 bg-white border border-surface-border rounded-xl"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">Consulta o síntoma reportado *</label>
              <textarea
                rows={2}
                required
                value={consultaForm.consulta}
                onChange={(e) => setConsultaForm({ ...consultaForm, consulta: e.target.value })}
                placeholder="Escribe la duda o consulta del cliente..."
                className="w-full px-3.5 py-2.5 bg-white border border-surface-border rounded-xl"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">Recomendación técnica entregada *</label>
              <textarea
                rows={2}
                required
                value={consultaForm.respuestaTecnica}
                onChange={(e) => setConsultaForm({ ...consultaForm, respuestaTecnica: e.target.value })}
                placeholder="Escribe la recomendación preventiva..."
                className="w-full px-3.5 py-2.5 bg-white border border-surface-border rounded-xl"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-agri hover:bg-agri-hover text-white font-bold rounded-xl shadow-sm transition-all cursor-pointer"
            >
              Guardar asesoría
            </button>
          </form>
        </div>

        <div className="lg:col-span-7 bg-white rounded-2xl border border-surface-border shadow-premium overflow-hidden">
          <div className="p-5 border-b border-surface-border flex items-center justify-between">
            <h3 className="text-sm font-display font-bold text-slate-900">
              Historial de Asesorías Registradas ({consultasAsesoria.length})
            </h3>
            <Badge status="Activo">En Línea</Badge>
          </div>

          {consultasAsesoria.length === 0 ? (
            <div className="p-10 text-center text-xs text-surface-muted">
              Aún no se han registrado asesorías personalizadas. Usa el formulario lateral para guardar la primera.
            </div>
          ) : (
            <div className="divide-y divide-surface-border">
              {consultasAsesoria.map((item) => (
                <div key={item.id} className="p-4 space-y-2 hover:bg-slate-50/70">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-agri text-xs">{item.id}</span>
                      <span className="font-bold text-xs text-slate-900">{item.cliente}</span>
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold text-[11px]">
                        {item.equipo}
                      </span>
                    </div>
                    <span className="font-mono text-[11px] text-slate-400">{item.fecha}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-surface-bg border border-surface-border text-xs text-slate-700">
                    <strong>Consulta:</strong> {item.consulta}
                  </div>

                  <div className="p-3 rounded-xl bg-agri-soft border border-emerald-200 text-xs text-emerald-950">
                    <strong>Recomendación:</strong> {item.respuestaTecnica}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
