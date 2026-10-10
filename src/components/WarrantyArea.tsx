import React from 'react';

export const WarrantyArea: React.FC = () => {
  return (
    <section className="w-full py-16 lg:py-24 bg-white" id="garantia-zona">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: Pillars and Cities */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#15803d] mb-2 block bg-[#ecfdf5] px-3 py-1 rounded-full w-max border border-emerald-200/50">
                Garantía y Cercanía Local
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0e4f3a] tracking-tight">
                Técnicos de confianza, en la puerta de tu casa en Castellón
              </h2>
              <p className="text-base text-[#475569] mt-3 leading-relaxed">
                Sin intermediarios ni empresas impersonales. ArreglaoHome está formado por técnicos residentes en la provincia, dados de alta y con seguro de responsabilidad civil para tu máxima tranquilidad.
              </p>
            </div>

            {/* 4 Pillar Points */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[#f4f7f5]/70 border border-[#eaf2ed] p-4 sm:p-5 rounded-xl flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-[#ecfdf5] text-[#0e4f3a] flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-[22px]">cleaning_services</span>
                </div>
                <div>
                  <span className="font-bold text-sm text-[#0e4f3a] block mb-0.5">
                    Trabajo limpio y pulcro
                  </span>
                  <span className="text-xs sm:text-sm text-[#475569]">
                    Protección de suelos y recogida exhaustiva al finalizar.
                  </span>
                </div>
              </div>

              <div className="bg-[#f4f7f5]/70 border border-[#eaf2ed] p-4 sm:p-5 rounded-xl flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-[#ecfdf5] text-[#0e4f3a] flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-[22px]">receipt_long</span>
                </div>
                <div>
                  <span className="font-bold text-sm text-[#0e4f3a] block mb-0.5">
                    Presupuesto previo claro
                  </span>
                  <span className="text-xs sm:text-sm text-[#475569]">
                    Sin sorpresas ni cargos inesperados tras la reparación.
                  </span>
                </div>
              </div>

              <div className="bg-[#f4f7f5]/70 border border-[#eaf2ed] p-4 sm:p-5 rounded-xl flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-[#ecfdf5] text-[#0e4f3a] flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-[22px]">security</span>
                </div>
                <div>
                  <span className="font-bold text-sm text-[#0e4f3a] block mb-0.5">
                    Técnicos con Seguro RC
                  </span>
                  <span className="text-xs sm:text-sm text-[#475569]">
                    Cobertura profesional completa y garantía por escrito.
                  </span>
                </div>
              </div>

              <div className="bg-[#f4f7f5]/70 border border-[#eaf2ed] p-4 sm:p-5 rounded-xl flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-[#ecfdf5] text-[#0e4f3a] flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-[22px]">near_me</span>
                </div>
                <div>
                  <span className="font-bold text-sm text-[#0e4f3a] block mb-0.5">
                    Desplazamiento ágil
                  </span>
                  <span className="text-xs sm:text-sm text-[#475569]">
                    Llegada rápida en Castellón, Vila-real y Benicàssim.
                  </span>
                </div>
              </div>
            </div>

            {/* Municipalities Chips */}
            <div className="pt-2">
              <span className="text-xs font-bold text-[#0e4f3a] uppercase tracking-wider block mb-2">
                Municipios con cobertura directa prioritaria:
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  'Castellón de la Plana',
                  'Vila-real',
                  'Benicàssim',
                  'Almassora',
                  'Burriana',
                  'Grau de Castelló',
                  'Oropesa del Mar',
                  'Betxí',
                ].map((city) => (
                  <span
                    key={city}
                    className="px-3 py-1 bg-[#f4f7f5] border border-[#eaf2ed] text-[#0f172a] text-xs font-semibold rounded-full"
                  >
                    {city}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Visual Map & Operational Base Card */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-lg border border-[#eaf2ed]">
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#15803d]">pin_drop</span>
                  <span className="font-bold text-sm text-[#0e4f3a]">
                    Zona de operaciones central
                  </span>
                </div>
                <span className="text-xs font-bold text-[#15803d] bg-[#ecfdf5] px-2.5 py-0.5 rounded-full border border-emerald-200/50">
                  100% Cobertura
                </span>
              </div>

              {/* Map Image Container */}
              <div
                className="w-full h-64 bg-cover bg-center rounded-xl overflow-hidden relative shadow-inner border border-[#eaf2ed]"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDzC-6-yMD_tGOYZRxzuh5icpvsD_Xk5S3vid7xlAGDFeiLIlX7SpSI7WmYbhJ-t_XmTquplnfeXc_xpU5u6l2e63JmysqFcMYZKwuB69Vh47XZix4UJQT3R8M_nOxRL-kGivAWy68ADd2Sc2vbEpmXpezmahTaL4Kz_AKCfhHA81EOdWAOIKYrbVeV52KMDDhX2axW06OIN4iFK6yKqFjNFciw1cx6WuLg0wWxJobdqfBLHqkVNieR')",
                }}
              >
                <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-lg shadow-xs border border-emerald-100">
                  <p className="text-xs font-bold text-[#0e4f3a]">Base operativa Castellón</p>
                  <p className="text-[11px] text-[#475569] leading-none mt-0.5">
                    Tiempo medio de llegada: 30-45 min
                  </p>
                </div>
              </div>

              {/* Team Snippet Card */}
              <div className="mt-4 p-3.5 bg-[#f4f7f5] rounded-xl flex items-center justify-between gap-3 border border-[#eaf2ed]">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-11 h-11 rounded-full bg-[#0e4f3a] text-white flex items-center justify-center font-bold text-sm">
                      AH
                    </div>
                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white"></span>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-sm text-[#0e4f3a]">
                        Equipo Técnico Castellón
                      </span>
                      <span className="material-symbols-outlined text-[#15803d] text-[16px]">
                        verified
                      </span>
                    </div>
                    <span className="text-xs text-[#475569]">
                      Avisos urgentes atendidos en el día
                    </span>
                  </div>
                </div>
                <a
                  className="w-10 h-10 rounded-lg bg-white border border-[#eaf2ed] hover:bg-[#0e4f3a] hover:text-white text-[#0e4f3a] flex items-center justify-center transition-colors shadow-xs"
                  href="tel:+34964000000"
                  title="Llamar"
                >
                  <span className="material-symbols-outlined text-[19px]">call</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
