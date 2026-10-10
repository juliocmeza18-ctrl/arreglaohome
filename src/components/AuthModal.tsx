import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { DEMO_USERS } from '../services/seedData';
import { UserRole } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAnnualPlan: () => void;
  onOpenRequests?: () => void;
  onOpenPunctualRequest?: () => void;
  initialMode?: 'login' | 'register' | 'profile';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onOpenAnnualPlan,
  onOpenRequests,
  onOpenPunctualRequest,
  initialMode = 'login',
}) => {
  const {
    profile,
    hasAnnualPlan,
    loginWithGoogle,
    loginWithEmail,
    registerWithEmail,
    sendPasswordReset,
    loginWithDemo,
    logout,
  } = useAuth();

  // Mode: 'login' | 'register' | 'reset-password'
  const [viewMode, setViewMode] = useState<'login' | 'register' | 'reset-password'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [accountType, setAccountType] = useState<UserRole>('afiliado');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      setErrorMsg('');
      setInfoMsg('');
      if (initialMode === 'register') {
        setViewMode('register');
      } else {
        setViewMode('login');
      }
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  // 1. Iniciar sesión con email y contraseña
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setErrorMsg('Por favor introduce tu correo electrónico y contraseña.');
      return;
    }
    try {
      setSubmitting(true);
      setErrorMsg('');
      await loginWithEmail(email.trim(), password);
      onClose();
    } catch (err: unknown) {
      const errString = String(err);
      if (errString.includes('user-not-found') || errString.includes('wrong-password') || errString.includes('invalid-credential')) {
        setErrorMsg('Correo o contraseña incorrectos. Si no tienes cuenta, puedes crear una en la pestaña «Crear una cuenta».');
      } else {
        setErrorMsg('Error al iniciar sesión. Comprueba tus datos o accede con Google o un perfil demo.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  // 2. Crear una nueva cuenta (Afiliado o Usuario)
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim() || !email.trim() || !password) {
      setErrorMsg('Por favor completa todos los campos.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    try {
      setSubmitting(true);
      setErrorMsg('');
      await registerWithEmail(email.trim(), password, displayName.trim(), accountType);
      onClose();
    } catch (err: unknown) {
      const errString = String(err);
      if (errString.includes('email-already-in-use')) {
        setErrorMsg('Este correo ya está registrado. Por favor inicia sesión.');
      } else {
        setErrorMsg('No se pudo crear la cuenta. Comprueba los datos introducidos.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  // 3. Recuperar contraseña
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMsg('Introduce el correo electrónico para recuperar tu contraseña.');
      return;
    }
    try {
      setSubmitting(true);
      setErrorMsg('');
      await sendPasswordReset(email.trim());
      setInfoMsg(`Te hemos enviado un correo a ${email.trim()} con el enlace para restablecer tu contraseña.`);
    } catch (err: unknown) {
      const errString = String(err);
      if (errString.includes('user-not-found')) {
        setErrorMsg('No existe ninguna cuenta registrada con este correo.');
      } else {
        setErrorMsg('No se pudo enviar el correo de recuperación. Revisa la dirección.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  // 4. Iniciar sesión con Google
  const handleGoogleLogin = async () => {
    try {
      setSubmitting(true);
      setErrorMsg('');
      await loginWithGoogle();
      onClose();
    } catch (err) {
      console.error(err);
      setErrorMsg('No se pudo iniciar sesión con Google.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div
        className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-[#eaf2ed] max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#0e4f3a] text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Cerrar"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center">
              <span className="material-symbols-outlined text-[26px] text-emerald-300">
                {profile ? 'manage_accounts' : 'account_circle'}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-bold">
                {profile ? 'Área de Usuario · Mi cuenta' : 'Área de Usuario · Iniciar sesión'}
              </h2>
              <p className="text-xs text-emerald-100/90 mt-0.5">
                {profile
                  ? `Bienvenido/a, ${profile.displayName}`
                  : 'Acceso para afiliados de ArreglaoHome y clientes registrados'}
              </p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {profile ? (
            /* =========================================================================
               VISTA DEL ÁREA DE USUARIO (Cliente o Afiliado)
               ========================================================================= */
            <div className="space-y-5">
              {/* Tarjeta de perfil y estado */}
              <div className="bg-[#f8faf9] p-5 rounded-2xl border border-[#eaf2ed] space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    <div className="w-13 h-13 rounded-2xl bg-[#0e4f3a] text-white font-extrabold flex items-center justify-center text-lg shadow-sm">
                      {profile.displayName.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-base text-[#0f172a]">
                        {profile.displayName}
                      </h3>
                      <p className="text-xs text-[#475569]">{profile.email}</p>
                      <p className="text-xs text-[#15803d] font-semibold mt-0.5">
                        {profile.city || 'Castellón de la Plana'}
                        {profile.phone ? ` · ${profile.phone}` : ''}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap ${
                      profile.role === 'admin'
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : hasAnnualPlan
                        ? 'bg-emerald-100 text-[#0e4f3a] border border-emerald-300'
                        : 'bg-slate-200 text-slate-800'
                    }`}
                  >
                    {profile.role === 'admin'
                      ? 'Administrador'
                      : hasAnnualPlan
                      ? 'Afiliado Plan Anual'
                      : 'Cliente Registrado'}
                  </span>
                </div>

                {/* Si es cliente o afiliado, mostrar información del plan y cobertura */}
                {profile.role !== 'admin' && (
                  hasAnnualPlan ? (
                    <div className="p-4 bg-white rounded-xl border border-emerald-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#0e4f3a] uppercase tracking-wider">
                          Tu Plan Anual Activo:
                        </span>
                        <span className="text-xs font-extrabold text-[#15803d]">
                          {profile.annualPlanPayment === 'anual' ? '199 €/año' : '19,90 €/mes'}
                        </span>
                      </div>
                      <ul className="text-xs text-[#475569] space-y-1 pt-1">
                        <li className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[16px] text-emerald-600">
                            check_circle
                          </span>
                          <span>2 intervenciones de mano de obra al año incluidas</span>
                        </li>
                        <li className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[16px] text-emerald-600">
                            check_circle
                          </span>
                          <span>20% de descuento en mano de obra adicional</span>
                        </li>
                        <li className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[16px] text-emerald-600">
                            check_circle
                          </span>
                          <span>Atención prioritaria para afiliados en Castellón</span>
                        </li>
                      </ul>
                      <div className="pt-2 border-t border-slate-100 flex justify-end">
                        <button
                          onClick={() => {
                            onClose();
                            onOpenAnnualPlan();
                          }}
                          className="text-xs text-[#0e4f3a] font-bold hover:underline cursor-pointer flex items-center gap-1"
                        >
                          <span>Ver todas las coberturas del plan</span>
                          <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-white rounded-xl border border-slate-200 flex items-center justify-between gap-3 text-xs">
                      <div>
                        <p className="font-bold text-[#0f172a]">¿Quieres hacerte afiliado?</p>
                        <p className="text-[#64748b]">
                          Disfruta de 2 visitas de mano de obra al año y 20% de descuento.
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          onClose();
                          onOpenAnnualPlan();
                        }}
                        className="px-3.5 py-2 bg-[#ecfdf5] hover:bg-emerald-100 text-[#0e4f3a] border border-emerald-300 font-bold rounded-xl transition-colors cursor-pointer whitespace-nowrap"
                      >
                        Ver Plan Anual
                      </button>
                    </div>
                  )
                )}

                {profile.role === 'admin' && (
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900">
                    <p className="font-bold flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-amber-600">shield_person</span>
                      <span>Cuenta de Administrador</span>
                    </p>
                    <p className="text-[11px] text-amber-800 mt-1">
                      Para gestionar solicitudes y modificar precios de la web, accede desde el enlace «Administración» en el pie de página.
                    </p>
                  </div>
                )}
              </div>

              {/* Botones de acción del cliente */}
              <div className="flex flex-col gap-2">
                {onOpenRequests && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenRequests();
                    }}
                    className="w-full p-3.5 rounded-xl border border-[#cbd5e1] hover:border-[#0e4f3a] hover:bg-[#ecfdf5]/40 flex items-center justify-between transition-all cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[#0e4f3a] text-white flex items-center justify-center">
                        <span className="material-symbols-outlined text-[20px]">assignment</span>
                      </div>
                      <div>
                        <p className="font-bold text-sm text-[#0f172a]">Mis Solicitudes</p>
                        <p className="text-xs text-[#64748b]">
                          Consulta el estado de tus avisos y reparaciones
                        </p>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-[20px] text-[#0e4f3a]">
                      chevron_right
                    </span>
                  </button>
                )}

                {onOpenPunctualRequest && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenPunctualRequest();
                    }}
                    className="w-full p-3.5 rounded-xl border border-[#cbd5e1] hover:border-[#0e4f3a] hover:bg-[#ecfdf5]/40 flex items-center justify-between transition-all cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[#15803d] text-white flex items-center justify-center">
                        <span className="material-symbols-outlined text-[20px]">build</span>
                      </div>
                      <div>
                        <p className="font-bold text-sm text-[#0f172a]">Solicitar un servicio</p>
                        <p className="text-xs text-[#64748b]">
                          Puntual o incluido en tu Plan Anual
                        </p>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-[20px] text-[#15803d]">
                      chevron_right
                    </span>
                  </button>
                )}
              </div>

              {/* Selector rápido para probar perfiles de cliente (Afiliado vs Cliente) */}
              <div>
                <span className="text-xs font-bold text-[#475569] uppercase tracking-wider block mb-2">
                  Probar con perfiles de cliente (Demostración):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {DEMO_USERS.filter((u) => u.role !== 'admin').map((demo) => {
                    const isSelected = profile.uid === demo.uid;
                    return (
                      <button
                        key={demo.uid}
                        onClick={() => loginWithDemo(demo.uid)}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[#0e4f3a] bg-[#ecfdf5] ring-2 ring-[#0e4f3a]/20'
                            : 'border-[#eaf2ed] bg-white hover:bg-[#f4f7f5]'
                        }`}
                      >
                        <p className="font-bold text-xs text-[#0f172a]">{demo.displayName}</p>
                        <p className="text-[11px] text-[#15803d] font-semibold">
                          {demo.hasAnnualPlan
                            ? 'Afiliado Plan Anual'
                            : 'Cliente puntual registrado'}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Acciones de pie de modal */}
              <div className="pt-2 border-t border-[#eaf2ed] flex items-center justify-between">
                <button
                  onClick={() => logout()}
                  className="px-4 py-2 rounded-xl text-red-600 hover:bg-red-50 text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">logout</span>
                  Cerrar sesión
                </button>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-[#0e4f3a] hover:bg-[#0a3829] text-white text-xs sm:text-sm font-bold shadow-xs cursor-pointer transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          ) : viewMode === 'reset-password' ? (
            /* =========================================================================
               VISTA: RECUPERAR CONTRASEÑA
               ========================================================================= */
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <h3 className="font-bold text-base text-[#0f172a]">Recuperar contraseña</h3>
                <p className="text-xs text-[#64748b] mt-0.5">
                  Introduce el correo electrónico asociado a tu cuenta de ArreglaoHome y te enviaremos las instrucciones.
                </p>
              </div>

              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">error</span>
                  <span>{errorMsg}</span>
                </div>
              )}

              {infoMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">check_circle</span>
                  <span>{infoMsg}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[#475569] mb-1">
                  Correo electrónico *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ejemplo@correo.com"
                  className="w-full p-2.5 text-sm rounded-xl border border-[#cbd5e1] focus:ring-2 focus:ring-[#0e4f3a] outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full h-11 bg-[#0e4f3a] hover:bg-[#0a3829] text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-sm"
              >
                {submitting ? 'Enviando enlace...' : 'Enviar enlace de recuperación'}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setViewMode('login');
                    setErrorMsg('');
                    setInfoMsg('');
                  }}
                  className="text-xs text-[#0e4f3a] font-bold hover:underline cursor-pointer"
                >
                  Volver a iniciar sesión
                </button>
              </div>
            </form>
          ) : viewMode === 'register' ? (
            /* =========================================================================
               VISTA: CREAR UNA CUENTA (Afiliado o Usuario)
               ========================================================================= */
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <h3 className="font-bold text-base text-[#0f172a]">Crear una cuenta</h3>
                <p className="text-xs text-[#64748b] mt-0.5">
                  Regístrate como afiliado o cliente para gestionar tus servicios en ArreglaoHome.
                </p>
              </div>

              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">error</span>
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Tipo de cuenta */}
              <div>
                <label className="block text-xs font-bold text-[#475569] uppercase mb-1.5">
                  Tipo de perfil:
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setAccountType('afiliado')}
                    className={`p-2.5 rounded-xl border text-left font-bold transition-all cursor-pointer ${
                      accountType === 'afiliado'
                        ? 'border-[#0e4f3a] bg-[#ecfdf5] text-[#0e4f3a]'
                        : 'border-[#cbd5e1] text-[#475569]'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="material-symbols-outlined text-[16px]">verified</span>
                      <span>Afiliado</span>
                    </div>
                    <span className="text-[10px] font-normal block text-[#64748b]">
                      Con cobertura de Plan Anual
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAccountType('cliente')}
                    className={`p-2.5 rounded-xl border text-left font-bold transition-all cursor-pointer ${
                      accountType === 'cliente'
                        ? 'border-[#0e4f3a] bg-[#ecfdf5] text-[#0e4f3a]'
                        : 'border-[#cbd5e1] text-[#475569]'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="material-symbols-outlined text-[16px]">person</span>
                      <span>Usuario puntual</span>
                    </div>
                    <span className="text-[10px] font-normal block text-[#64748b]">
                      Sin cuotas ni suscripción
                    </span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#475569] mb-1">
                  Nombre completo *
                </label>
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Ej. Manuel Albiol"
                  className="w-full p-2.5 text-sm rounded-xl border border-[#cbd5e1] focus:ring-2 focus:ring-[#0e4f3a] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#475569] mb-1">
                  Correo electrónico *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="manuel@ejemplo.com"
                  className="w-full p-2.5 text-sm rounded-xl border border-[#cbd5e1] focus:ring-2 focus:ring-[#0e4f3a] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#475569] mb-1">
                  Contraseña (mínimo 6 caracteres) *
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-2.5 text-sm rounded-xl border border-[#cbd5e1] focus:ring-2 focus:ring-[#0e4f3a] outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full h-11 bg-[#0e4f3a] hover:bg-[#0a3829] text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-sm"
              >
                {submitting ? 'Creando cuenta...' : 'Crear cuenta y acceder'}
              </button>

              <div className="text-center pt-2">
                <span className="text-xs text-[#64748b]">¿Ya tienes una cuenta? </span>
                <button
                  type="button"
                  onClick={() => {
                    setViewMode('login');
                    setErrorMsg('');
                  }}
                  className="text-xs text-[#0e4f3a] font-bold hover:underline cursor-pointer"
                >
                  Iniciar sesión
                </button>
              </div>
            </form>
          ) : (
            /* =========================================================================
               VISTA: INICIAR SESIÓN (Email, Contraseña, Enlace recuperar, Opción Crear cuenta)
               ========================================================================= */
            <div className="space-y-4">
              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">error</span>
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-[#475569] mb-1">
                    Correo electrónico *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="usuario@ejemplo.com"
                    className="w-full p-2.5 text-sm rounded-xl border border-[#cbd5e1] focus:ring-2 focus:ring-[#0e4f3a] outline-none"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-[#475569]">Contraseña *</label>
                    <button
                      type="button"
                      onClick={() => {
                        setViewMode('reset-password');
                        setErrorMsg('');
                      }}
                      className="text-[11px] text-[#0e4f3a] hover:underline font-semibold cursor-pointer"
                    >
                      ¿Olvidaste tu contraseña?
                    </button>
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full p-2.5 text-sm rounded-xl border border-[#cbd5e1] focus:ring-2 focus:ring-[#0e4f3a] outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full h-11 bg-[#0e4f3a] hover:bg-[#0a3829] text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-sm mt-1"
                >
                  {submitting ? 'Iniciando sesión...' : 'Iniciar sesión'}
                </button>
              </form>

              {/* Botón de Google */}
              <div className="relative flex items-center justify-center my-3">
                <div className="border-t border-[#eaf2ed] w-full"></div>
                <span className="bg-white px-2.5 text-[11px] text-[#64748b] font-medium absolute">
                  o accede con
                </span>
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2.5 h-10 px-4 rounded-xl border border-[#cbd5e1] hover:bg-slate-50 transition-colors font-bold text-xs text-[#0f172a] shadow-2xs cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Acceder con Google</span>
              </button>

              {/* Enlace para crear una cuenta */}
              <div className="p-3 bg-[#f8faf9] rounded-xl border border-[#eaf2ed] text-center text-xs">
                <span className="text-[#64748b]">¿No tienes cuenta todavía? </span>
                <button
                  type="button"
                  onClick={() => {
                    setViewMode('register');
                    setErrorMsg('');
                  }}
                  className="text-[#0e4f3a] font-bold hover:underline cursor-pointer ml-1"
                >
                  Crear una cuenta
                </button>
              </div>

              {/* Perfiles de prueba rápidos para testeo de afiliados y clientes */}
              <div className="pt-1">
                <span className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider block mb-1.5">
                  Probar con perfiles demo de clientes:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {DEMO_USERS.filter((u) => u.role !== 'admin').slice(0, 2).map((demo) => (
                    <button
                      key={demo.uid}
                      type="button"
                      onClick={() => {
                        loginWithDemo(demo.uid);
                        onClose();
                      }}
                      className="p-2.5 rounded-xl border border-[#eaf2ed] hover:border-emerald-300 hover:bg-[#ecfdf5]/40 text-left transition-all cursor-pointer"
                    >
                      <p className="font-bold text-xs text-[#0f172a] truncate">
                        {demo.displayName}
                      </p>
                      <p className="text-[10px] text-[#15803d] font-semibold">
                        {demo.hasAnnualPlan ? 'Afiliado Plan Anual' : 'Cliente puntual'}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
