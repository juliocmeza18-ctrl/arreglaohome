import React from 'react';

export const FinalCta: React.FC<{ onStartRequest: () => void }> = ({ onStartRequest }) => {
  return (
    <section className="w-full py-16 bg-[#f4f7f5]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-[#0e4f3a] text-white p-8 sm:p-12 lg:p-14 shadow-2xl">
          {/* Decorative Glows */}
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-[#10b981]/15 blur-3xl pointer-events-none"></div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 flex flex-col gap-3">
              <span className="inline-flex items-center gap-2 text-xs font-bold text-emerald-300 uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Presupuesto previo sin compromiso
              </span>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
                ¿Tienes una avería o pequeña mejora pendiente en tu hogar?
              </h3>
              <p className="text-sm sm:text-base text-emerald-100/90 max-w-2xl leading-relaxed">
                Solicita tu valoración en 2 minutos con nuestro asistente guiado. Indícanos el problema y nosotros nos encargamos del resto con técnicos propios y certificados.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col justify-start lg:justify-end items-stretch sm:items-center lg:items-end gap-3.5">
              <button
                onClick={onStartRequest}
                className="inline-flex items-center justify-center gap-2 h-14 px-8 rounded-xl bg-white hover:bg-emerald-50 text-[#0e4f3a] font-bold text-base shadow-lg transition-all transform active:scale-95 text-center cursor-pointer"
              >
                <span>Comenzar solicitud ahora</span>
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </button>
              <span className="text-xs text-emerald-200/80 text-center lg:text-right font-medium">
                Atención rápida en Castellón de la Plana y provincia
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
