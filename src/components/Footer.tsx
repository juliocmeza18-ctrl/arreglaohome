import React from 'react';

interface FooterProps {
  onSelectCategory: (categoryId: string) => void;
  onOpenAnnualPlan: () => void;
  onOpenLeadInfo: () => void;
  onOpenAuth: () => void;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onOpenAnnualPlan,
  onOpenLeadInfo,
  onOpenAuth,
  onOpenAdmin,
}) => {
  return (
    <footer className="w-full bg-white text-[#0f172a] border-t border-[#eaf2ed]" id="contacto-footer">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-14 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand Info */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#0e4f3a] text-white flex items-center justify-center shadow-xs">
                <span className="material-symbols-outlined text-[20px]">home_repair_service</span>
              </div>
              <span className="font-bold text-xl text-[#0e4f3a] tracking-tight">ArreglaoHome</span>
            </div>
            <p className="text-sm text-[#475569] leading-relaxed">
              Plataforma de reparaciones del hogar en Castellón de la Plana y provincia. Elige entre contratación puntual sin cuotas o el Plan Anual ArreglaoHome con coberturas y descuentos.
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#15803d]"></span>
              <span className="text-xs text-[#0e4f3a] font-bold uppercase tracking-wider">
                Técnicos Certificados con Seguro RC
              </span>
            </div>
          </div>

          {/* Categorías / Oficios */}
          <div>
            <p className="font-bold text-base text-[#0e4f3a] mb-4">Oficios Disponibles</p>
            <ul className="flex flex-col gap-2.5 text-sm text-[#475569]">
              <li>
                <button
                  onClick={() => onSelectCategory('persianas')}
                  className="hover:text-[#0e4f3a] transition-colors text-left cursor-pointer"
                >
                  Persianista (Cintas y mecanismos)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('electricidad')}
                  className="hover:text-[#0e4f3a] transition-colors text-left cursor-pointer"
                >
                  Electricista (Enchufes y ventiladores)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('fontaneria')}
                  className="hover:text-[#0e4f3a] transition-colors text-left cursor-pointer"
                >
                  Fontanero (Grifos y cisternas)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('muebles')}
                  className="hover:text-[#0e4f3a] transition-colors text-left cursor-pointer"
                >
                  Montaje de muebles y estanterías
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('bricolaje')}
                  className="hover:text-[#0e4f3a] transition-colors text-left cursor-pointer"
                >
                  Manitas del hogar y taladro limpio
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('otros')}
                  className="hover:text-[#0e4f3a] transition-colors text-left cursor-pointer"
                >
                  Otros trabajos y presupuestos a medida
                </button>
              </li>
            </ul>
          </div>

          {/* Modalidades de Contratación */}
          <div>
            <p className="font-bold text-base text-[#0e4f3a] mb-4">Modalidades de Contratación</p>
            <ul className="flex flex-col gap-2.5 text-sm text-[#475569]">
              <li>
                <a className="hover:text-[#0e4f3a] transition-colors" href="#reparaciones-individuales">
                  <strong>1. Reparación puntual:</strong> Paga solo por el trabajo
                </a>
              </li>
              <li>
                <button
                  onClick={onOpenAnnualPlan}
                  className="hover:text-[#0e4f3a] transition-colors text-left cursor-pointer"
                >
                  <strong>2. Plan Anual ArreglaoHome:</strong> Pago mensual o anual
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenLeadInfo}
                  className="hover:text-[#0e4f3a] transition-colors text-left cursor-pointer flex items-center gap-1.5 text-[#15803d] font-semibold"
                >
                  <span className="material-symbols-outlined text-[16px]">mark_email_read</span>
                  <span>Recibir información y ofertas (no afiliados)</span>
                </button>
              </li>
              <li>
                <a className="hover:text-[#0e4f3a] transition-colors" href="#como-funciona">
                  Cómo funciona el servicio
                </a>
              </li>
              <li>
                <a className="hover:text-[#0e4f3a] transition-colors" href="#garantia-zona">
                  Garantía y Zonas de Castellón
                </a>
              </li>
              <li className="pt-2 border-t border-[#e2ece6] flex flex-col gap-2">
                <button
                  onClick={onOpenAuth}
                  className="hover:text-[#0e4f3a] transition-colors text-left cursor-pointer flex items-center gap-1.5 font-semibold text-[#0f172a]"
                >
                  <span className="material-symbols-outlined text-[17px] text-[#15803d]">account_circle</span>
                  <span>Área de usuario</span>
                </button>
                {onOpenAdmin && (
                  <button
                    onClick={onOpenAdmin}
                    className="hover:text-[#0e4f3a] transition-colors text-left cursor-pointer flex items-center gap-1.5 font-medium text-[#475569] hover:text-[#0f172a]"
                  >
                    <span className="material-symbols-outlined text-[17px] text-amber-600">admin_panel_settings</span>
                    <span>Administración</span>
                  </button>
                )}
              </li>
            </ul>
          </div>

          {/* Contact & Area */}
          <div>
            <p className="font-bold text-base text-[#0e4f3a] mb-4">Contacto y Zona</p>
            <p className="text-xs font-bold text-[#15803d] uppercase tracking-wider mb-1">
              Cobertura en Castellón:
            </p>
            <p className="text-sm text-[#475569] mb-4">
              Castellón de la Plana, Vila-real, Benicàssim, Almassora, Burriana y Grau.
            </p>
            <div className="flex flex-col gap-2 text-sm text-[#475569]">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#0e4f3a]">Teléfono:</span>
                <a className="hover:text-[#0e4f3a] transition-colors" href="tel:+34964000000">
                  +34 964 00 00 00
                </a>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#0e4f3a]">WhatsApp:</span>
                <a
                  className="hover:text-[#0e4f3a] transition-colors"
                  href="https://wa.me/34964000000"
                  target="_blank"
                  rel="noreferrer"
                >
                  +34 964 00 00 00
                </a>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#0e4f3a]">Email:</span>
                <a
                  className="hover:text-[#0e4f3a] transition-colors"
                  href="mailto:hola@arreglaohome.es"
                >
                  hola@arreglaohome.es
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-[#eaf2ed] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#475569] text-center sm:text-left">
          <p>
            © 2025 ArreglaoHome. Todos los derechos reservados. Reparaciones rápidas y Plan Anual de mantenimiento del hogar en Castellón.
          </p>
          <div className="flex items-center gap-4">
            <p className="font-medium text-[#0e4f3a]">
              Castellón de la Plana y provincia
            </p>
            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="text-slate-400 hover:text-[#0e4f3a] font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                title="Acceso restringido para administradores"
              >
                <span className="material-symbols-outlined text-[14px]">lock</span>
                <span>Administración</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
