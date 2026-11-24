import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  User,
  Lock,
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
  HardHat,
  CheckCircle2,
  Truck,
  Users,
  KeyRound,
  Mail,
  Wrench
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAppData } from '../context/AppDataContext';
import { MACHINERY_IMAGES } from '../data/mockData';

export default function Login() {
  const navigate = useNavigate();
  const { login, availableUsers } = useAuth();
  const { showToast, logAudit } = useAppData();

  const [viewMode, setViewMode] = useState('login');
  const [selectedUserId, setSelectedUserId] = useState('USR-01');
  const [selectedRole, setSelectedRole] = useState('Administrador');
  const [email, setEmail] = useState('admin@centroserviciosje.com');
  const [password, setPassword] = useState('••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [recoveryEmail, setRecoveryEmail] = useState('admin@centroserviciosje.com');

  const rolesConfig = [
    { role: 'Administrador', userId: 'USR-01', label: 'Administrador', sub: 'Juan F. Posada', icon: ShieldCheck },
    { role: 'Técnico', userId: 'USR-03', label: 'Técnico', sub: 'Yarlei S. Posada', icon: HardHat },
    { role: 'Cliente', userId: 'USR-04', label: 'Cliente', sub: 'Portal Cliente', icon: Users },
    { role: 'Proveedor', userId: 'USR-05', label: 'Proveedor', sub: 'STIHL / Husqvarna', icon: Truck }
  ];

  const handleSelectRole = (item) => {
    setSelectedRole(item.role);
    setSelectedUserId(item.userId);
    const user =
      availableUsers.find((u) => u.id === item.userId) ||
      availableUsers.find((u) => u.rol === item.role);
    if (user) {
      setEmail(user.email);
      setRecoveryEmail(user.email);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      const logged = login(selectedRole, email, '', selectedUserId);
      logAudit('Seguridad', `Inicio de sesión exitoso: ${logged.nombre} (${logged.rol})`, logged.nombre, logged.rol);
      showToast('Bienvenido a Centro de Servicios J&E', `Sesión iniciada como ${logged.nombre}`);
      navigate('/dashboard');
    }, 350);
  };

  const handleRecoverySubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setViewMode('recover_sent');
      logAudit('Seguridad', `Solicitud de restablecimiento de contraseña para ${recoveryEmail}`);
      showToast('Enlace Enviado', `Instrucciones enviadas a ${recoveryEmail}`, 'info');
    }, 450);
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-agri-deep">
      {/* Lado Izquierdo: Fotografía real del taller Husqvarna / STIHL sin textos invasivos */}
      <div className="relative lg:w-7/12 min-h-[300px] lg:min-h-screen flex flex-col justify-between p-8 lg:p-12 text-white overflow-hidden">
        <img
          src={MACHINERY_IMAGES.tallerLogin}
          alt="Taller de maquinaria agrícola y forestal Husqvarna"
          className="absolute inset-0 w-full h-full object-cover object-center scale-[1.01]"
        />
        {/* Degradado sutil solo en bordes superior e inferior para dejar brillar la foto */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/55" />

        {/* Marca Superior Limpia */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3.5 bg-black/45 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/15 shadow-lg">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-forge to-amber-600 flex items-center justify-center text-white font-display font-extrabold text-sm shadow-md">
              J&E
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-display font-bold tracking-tight text-white leading-tight">
                Centro de Servicios J&E
              </h1>
              <p className="text-[11px] text-orange-200/90 font-medium">
                Taller Autorizado • Repuestos y Servicio Técnico
              </p>
            </div>
          </div>
        </div>

        {/* Pie de Foto Minimalista */}
        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forge/90 text-white text-[11px] font-bold uppercase tracking-wider mb-3 shadow-md">
            <Wrench className="w-3.5 h-3.5" />
            <span>Husqvarna • STIHL • Royal Cóndor</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-white leading-snug drop-shadow-md">
            Control integral de taller, repuestos y facturación en un solo lugar.
          </h2>
        </div>
      </div>

      {/* Lado Derecho: Panel Oscuro Esmeralda + Tarjeta de Acceso con Contrastes Marcados */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 bg-gradient-to-br from-agri-deep via-[#0A261B] to-[#0E3124]">
        <div className="w-full max-w-md bg-[#F7FAF8] p-7 sm:p-8 rounded-2xl border-2 border-emerald-200/40 shadow-2xl space-y-6">
          {viewMode === 'login' && (
            <>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-agri-soft border border-emerald-300 text-agri text-[11px] font-bold mb-2.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-forge" />
                  <span>Acceso al Taller</span>
                </div>
                <h2 className="text-2xl font-display font-bold text-surface-dark tracking-tight">
                  Iniciar Sesión
                </h2>
                <p className="text-xs text-surface-muted mt-1">
                  Elige tu perfil de trabajo e ingresa tus credenciales
                </p>
              </div>

              {/* Selector de Perfil */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">
                  Perfil de Acceso
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {rolesConfig.map((item) => {
                    const Icon = item.icon;
                    const isSelected = selectedRole === item.role;
                    return (
                      <button
                        key={item.role}
                        type="button"
                        onClick={() => handleSelectRole(item)}
                        className={`group py-2.5 px-2 rounded-xl border-2 text-center transition-all duration-150 flex flex-col items-center justify-center gap-1 cursor-pointer ${
                          isSelected
                            ? 'border-agri bg-emerald-50 text-agri font-bold shadow-sm -translate-y-0.5'
                            : 'border-slate-300 bg-white text-slate-600 hover:border-forge hover:bg-orange-50/40 hover:text-slate-900 hover:-translate-y-0.5'
                        }`}
                      >
                        <Icon
                          className={`w-4 h-4 transition-colors ${
                            isSelected ? 'text-forge' : 'text-slate-400 group-hover:text-forge'
                          }`}
                        />
                        <span className="text-xs leading-tight">{item.label}</span>
                        <span className="text-[10px] text-slate-500 font-normal truncate max-w-full">
                          {item.sub}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selector rápido de Administrador */}
              {selectedRole === 'Administrador' && (
                <div className="p-2.5 rounded-xl bg-slate-200/60 border border-slate-300 flex items-center justify-between gap-2 text-xs">
                  <span className="text-[11px] font-bold text-slate-700">Administrador:</span>
                  <div className="flex gap-1.5">
                    {availableUsers
                      .filter((u) => u.rol === 'Administrador')
                      .map((adminUser) => (
                        <button
                          key={adminUser.id}
                          type="button"
                          onClick={() => {
                            setSelectedUserId(adminUser.id);
                            setEmail(adminUser.email);
                          }}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-all ${
                            selectedUserId === adminUser.id
                              ? 'bg-agri text-white shadow-sm'
                              : 'bg-white border border-slate-300 text-slate-700 hover:border-agri hover:text-agri'
                          }`}
                        >
                          {adminUser.nombre.split(' ')[0]} {adminUser.nombre.split(' ')[1]}
                        </button>
                      ))}
                  </div>
                </div>
              )}

              {/* Formulario con Bordes Marcados */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Correo Electrónico *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-white border-2 border-slate-300 rounded-xl text-xs font-medium text-surface-dark hover:border-slate-400 focus:outline-none focus:border-agri focus:ring-4 focus:ring-emerald-500/15 transition-all"
                      placeholder="usuario@centroserviciosje.com"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      Contraseña *
                    </label>
                    <button
                      type="button"
                      onClick={() => setViewMode('recover')}
                      className="text-[11px] font-bold text-forge hover:text-forge-hover hover:underline cursor-pointer"
                    >
                      ¿Olvidó su contraseña?
                    </button>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-9 pr-10 py-2.5 bg-white border-2 border-slate-300 rounded-xl text-xs font-medium text-surface-dark hover:border-slate-400 focus:outline-none focus:border-agri focus:ring-4 focus:ring-emerald-500/15 transition-all"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-agri cursor-pointer transition-colors"
                      aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="group w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-white font-bold text-xs bg-gradient-to-r from-agri to-agri-hover hover:from-forge hover:to-amber-600 active:scale-[0.99] transition-all duration-200 cursor-pointer shadow-md hover:shadow-lg disabled:opacity-70"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Entrar al Sistema</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            </>
          )}

          {viewMode === 'recover' && (
            <div className="space-y-5">
              <div>
                <button
                  type="button"
                  onClick={() => setViewMode('login')}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-agri mb-3 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Volver al inicio de sesión</span>
                </button>
                <div className="w-10 h-10 rounded-xl bg-agri-soft border border-emerald-300 text-agri flex items-center justify-center mb-3">
                  <KeyRound className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-display font-bold text-surface-dark tracking-tight">
                  Recuperar Contraseña
                </h2>
                <p className="text-xs text-surface-muted mt-1 leading-relaxed">
                  Ingresa tu correo registrado en <strong>Centro de Servicios J&E</strong> para enviarte las instrucciones.
                </p>
              </div>

              <form onSubmit={handleRecoverySubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Correo Electrónico *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      required
                      value={recoveryEmail}
                      onChange={(e) => setRecoveryEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-white border-2 border-slate-300 rounded-xl text-xs font-medium text-surface-dark hover:border-slate-400 focus:outline-none focus:border-agri focus:ring-4 focus:ring-emerald-500/15"
                      placeholder="correo@centroserviciosje.com"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2 pt-1">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 px-4 rounded-xl text-white font-bold text-xs bg-agri hover:bg-agri-hover transition-all cursor-pointer shadow-sm"
                  >
                    {isLoading ? 'Enviando...' : 'Enviar Instrucciones'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('login')}
                    className="w-full py-2 px-4 rounded-xl text-slate-700 font-semibold text-xs bg-slate-200/80 hover:bg-slate-300 transition-all cursor-pointer"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          )}

          {viewMode === 'recover_sent' && (
            <div className="space-y-4 text-center py-2">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-display font-bold text-slate-900">
                  ¡Solicitud Enviada!
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Revisa el correo <strong className="text-slate-900">{recoveryEmail}</strong> para restablecer tu acceso.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-white border border-slate-300 text-[11px] text-slate-600 text-left">
                Si necesitas ayuda inmediata, comunícate con <strong>Juan Fernando Posada (313 642 2685)</strong>.
              </div>
              <button
                type="button"
                onClick={() => setViewMode('login')}
                className="w-full py-2.5 px-4 rounded-xl text-white font-bold text-xs bg-agri hover:bg-agri-hover transition-all cursor-pointer"
              >
                Regresar al Login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
