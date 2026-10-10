import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { DEMO_USERS } from '../services/seedData';

interface HeaderProps {
  onOpenPunctualRequest: (categoryId?: string, serviceId?: string) => void;
  onOpenAnnualPlan: () => void;
  onOpenLeadInfo: () => void;
  onOpenLogin: () => void;
  onOpenRegister: () => void;
  onOpenRequests?: () => void;
  requestCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenPunctualRequest,
  onOpenAnnualPlan,
  onOpenLogin,
  onOpenRegister,
}) => {
  const { profile } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#eaf2ed] shadow-xs transition-all duration-300">
      <div className="w-full max-w-[1440px] mx-auto px-2.5 sm:px-4 lg:px-6 h-16 sm:h-20 flex items-center justify-between gap-1.5 sm:gap-3">
        {/* 1. Logotipo y nombre ArreglaoHome */}
        <a
          href="#"
          className="flex items-center gap-2 sm:gap-2.5 flex-shrink min-w-0 group focus:outline-none"
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#0e4f3a] text-white flex items-center justify-center shadow-md shadow-[#0e4f3a]/20 group-hover:scale-105 transition-transform flex-shrink-0">
            <span className="material-symbols-outlined text-[20px] sm:text-[24px]">home_repair_service</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-base sm:text-lg lg:text-xl text-[#0e4f3a] tracking-tight leading-tight group-hover:text-[#15803d] transition-colors whitespace-nowrap">
              ArreglaoHome
            </span>
            <span className="text-[9px] sm:text-[11px] font-bold text-[#15803d] tracking-wider uppercase mt-0.5 whitespace-nowrap">
              Castellón y alrededores
            </span>
          </div>
        </a>

        {/* 2. Menú de navegación en escritorio (md+) */}
        <nav className="hidden md:flex items-center gap-4 lg:gap-6 xl:gap-7 text-[13px] lg:text-[14px] font-semibold text-[#475569] flex-shrink-0">
          <a className="text-[#0e4f3a] font-bold transition-colors hover:text-[#15803d]" href="#">
            Inicio
          </a>
          <a className="hover:text-[#0e4f3a] transition-colors whitespace-nowrap" href="#reparaciones-individuales">
            Reparaciones Puntuales
          </a>
          <button
            onClick={onOpenAnnualPlan}
            className="hover:text-[#0e4f3a] transition-colors font-semibold cursor-pointer whitespace-nowrap"
          >
            Plan Anual
          </button>
          <a className="hover:text-[#0e4f3a] transition-colors whitespace-nowrap" href="#como-funciona">
            Cómo funciona
          </a>
        </nav>

        {/* 3. Botones de acción y menú móvil */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
          {/* Botón: REGISTRARSE (Visible tanto en móvil como en escritorio con su texto completo) */}
          <button
            onClick={onOpenRegister}
            className="inline-flex items-center justify-center gap-1 sm:gap-1.5 h-9 sm:h-10 px-2.5 sm:px-4 rounded-xl bg-[#0e4f3a] hover:bg-[#0a3829] text-white text-xs sm:text-sm font-semibold shadow-sm hover:shadow-md transition-all active:scale-95 cursor-pointer whitespace-nowrap flex-shrink-0"
            title="Registrarse para recibir información y novedades"
          >
            <span className="material-symbols-outlined text-[16px] sm:text-[18px] text-white flex-shrink-0">
              person_add
            </span>
            <span className="whitespace-nowrap">Registrarse</span>
          </button>

          {/* Botón: MI CUENTA (Visible en escritorio; en móvil accesible desde el menú hamburguesa ☰) */}
          <button
            onClick={onOpenLogin}
            className="hidden md:inline-flex items-center justify-center gap-1.5 h-10 px-3.5 sm:px-4 rounded-xl bg-[#0e4f3a] hover:bg-[#0a3829] text-white text-xs sm:text-sm font-semibold shadow-sm hover:shadow-md transition-all active:scale-95 cursor-pointer whitespace-nowrap flex-shrink-0"
            title="Acceso al área de usuario"
          >
            {profile ? (
              <div className="w-5 h-5 rounded-full bg-white/20 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 border border-white/40">
                {profile.displayName.substring(0, 1).toUpperCase()}
              </div>
            ) : (
              <span className="material-symbols-outlined text-[18px] text-white flex-shrink-0">
                account_circle
              </span>
            )}
            <span>Mi cuenta</span>
          </button>

          {/* Botón: SOLICITAR SERVICIO (Visible en escritorio; en móvil accesible desde el menú hamburguesa ☰) */}
          <button
            onClick={() => onOpenPunctualRequest()}
            className="hidden md:inline-flex items-center justify-center gap-1.5 h-10 px-3.5 sm:px-4 rounded-xl bg-[#0e4f3a] hover:bg-[#0a3829] text-white text-xs sm:text-sm font-semibold shadow-sm hover:shadow-md transition-all active:scale-95 cursor-pointer whitespace-nowrap flex-shrink-0"
            title="Solicitar servicio de reparación puntual o Plan Anual"
          >
            <span className="material-symbols-outlined text-[18px] text-white flex-shrink-0">build</span>
            <span>Solicitar servicio</span>
          </button>

          {/* Icono de menú hamburguesa (3 rayas) - SOLO EN MÓVIL (md:hidden) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 text-[#0e4f3a] bg-[#f8fafc] hover:bg-[#e2e8f0] active:bg-[#cbd5e1] rounded-xl border border-[#cbd5e1] cursor-pointer transition-colors flex-shrink-0 shadow-2xs"
            aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú de navegación'}
            title={mobileMenuOpen ? 'Cerrar menú' : 'Menú de opciones y navegación'}
          >
            {mobileMenuOpen ? (
              <svg className="w-5 h-5 text-[#0e4f3a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              /* Las 3 rayas clásicas de desplazamiento de menú */
              <svg className="w-5 h-5 text-[#0e4f3a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="18" x2="20" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Menú desplegable en móvil (mostrado u ocultado con el icono de 3 rayas ☰) */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#eaf2ed] px-4 py-4 flex flex-col gap-3 shadow-xl max-h-[calc(100vh-4rem)] overflow-y-auto">
          {/* Botones de acción principales en el menú móvil */}
          <div className="flex flex-col gap-2 pb-3 border-b border-[#eaf2ed]">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenPunctualRequest();
              }}
              className="w-full inline-flex items-center justify-center gap-2 h-10 px-4 rounded-xl bg-[#0e4f3a] hover:bg-[#0a3829] text-white text-sm font-semibold shadow-sm transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px] text-white flex-shrink-0">
                build
              </span>
              <span>Solicitar servicio</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenLogin();
              }}
              className="w-full inline-flex items-center justify-center gap-2 h-10 px-4 rounded-xl bg-[#0e4f3a] hover:bg-[#0a3829] text-white text-sm font-semibold shadow-sm transition-all cursor-pointer"
            >
              {profile ? (
                <div className="w-5 h-5 rounded-full bg-white/20 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 border border-white/40">
                  {profile.displayName.substring(0, 1).toUpperCase()}
                </div>
              ) : (
                <span className="material-symbols-outlined text-[18px] text-white flex-shrink-0">
                  account_circle
                </span>
              )}
              <span>Mi cuenta</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenRegister();
              }}
              className="w-full inline-flex items-center justify-center gap-2 h-10 px-4 rounded-xl bg-[#0e4f3a] hover:bg-[#0a3829] text-white text-sm font-semibold shadow-sm transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px] text-white flex-shrink-0">
                person_add
              </span>
              <span>Registrarse</span>
            </button>
          </div>

          {/* Opciones de navegación móvil */}
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-bold tracking-wider uppercase text-[#15803d] px-1 py-1">
              Navegación
            </span>
            <a
              href="#"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-2 text-[#0e4f3a] font-bold rounded-lg hover:bg-[#f1f5f9] transition-colors"
            >
              Inicio
            </a>
            <a
              href="#reparaciones-individuales"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-2 text-[#475569] hover:text-[#0e4f3a] font-semibold rounded-lg hover:bg-[#f1f5f9] transition-colors"
            >
              Reparaciones Puntuales
            </a>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAnnualPlan();
              }}
              className="px-2 py-2 text-left text-[#475569] hover:text-[#0e4f3a] font-semibold rounded-lg hover:bg-[#f1f5f9] transition-colors cursor-pointer"
            >
              Plan Anual
            </button>
            <a
              href="#como-funciona"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-2 text-[#475569] hover:text-[#0e4f3a] font-semibold rounded-lg hover:bg-[#f1f5f9] transition-colors"
            >
              Cómo funciona
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
