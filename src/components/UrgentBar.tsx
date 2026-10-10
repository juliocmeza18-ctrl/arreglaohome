import React, { useState } from 'react';

export const UrgentBar: React.FC<{ onOpenUrgentBooking: () => void }> = ({
  onOpenUrgentBooking,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyPhone = () => {
    navigator.clipboard?.writeText('+34964000000');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="w-full bg-[#0e4f3a] text-white py-4 shadow-inner">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-center md:text-left">
          <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-emerald-300 flex-shrink-0">
            <span className="material-symbols-outlined text-[22px]">bolt</span>
          </div>
          <div>
            <span className="font-bold text-sm sm:text-base block">
              ¿Avería urgente o asistencia para hoy?
            </span>
            <span className="text-xs sm:text-sm text-emerald-100/80">
              Atendemos avisos y presupuestos en el mismo día en Castellón, Vila-real y Benicàssim.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            onClick={onOpenUrgentBooking}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold bg-white/10 hover:bg-white/20 text-white px-3.5 py-2 rounded-lg transition-colors border border-white/15"
          >
            <span className="material-symbols-outlined text-[18px] text-emerald-300">chat</span>
            <span>Aviso Urgente Hoy</span>
          </button>

          <a
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold bg-white text-[#0e4f3a] hover:bg-emerald-50 px-4 py-2 rounded-lg shadow-xs transition-colors"
            href="tel:+34964000000"
            onClick={(e) => {
              // Also allow copying if on desktop without tel protocol
              handleCopyPhone();
            }}
          >
            <span className="material-symbols-outlined text-[18px] text-[#15803d]">call</span>
            <span>{copied ? '¡Copiado!' : '+34 964 00 00 00'}</span>
          </a>
        </div>
      </div>
    </section>
  );
};
