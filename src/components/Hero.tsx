import React from 'react';

interface HeroProps {
  onOpenPunctualRequest: () => void;
  onOpenAnnualPlan: () => void;
  onOpenLeadInfo: () => void;
  onOpenHowItWorks: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onOpenPunctualRequest,
  onOpenAnnualPlan,
  onOpenLeadInfo,
  onOpenHowItWorks,
}) => {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-[#f2f7f4] via-[#f8faf9] to-white pt-8 sm:pt-12 pb-14 lg:pb-20 border-b border-[#eaf2ed]/60">
      {/* Subtle Decorative Background Elements */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#10b981]/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-20 left-10 w-80 h-80 bg-[#0e4f3a]/5 rounded-full blur-2xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column */}
          <div className="lg:col-span-7 flex flex-col items-start gap-5 text-left">
            {/* Official Trust Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ecfdf5] border border-emerald-200/70 shadow-xs">
              <span className="material-symbols-outlined text-[#15803d] text-[19px] font-bold">
                verified
              </span>
              <span className="text-xs sm:text-sm font-bold tracking-tight text-[#0e4f3a]">
                Servicio oficial en Castellón de la Plana y provincia
              </span>
            </div>

            {/* Main Headline: "Reparaciones rápidas y fáciles para el hogar" */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-extrabold text-[#0f172a] tracking-tight leading-[1.12]">
              Reparaciones rápidas y fáciles{' '}
              <span className="text-[#0e4f3a]">
                para el hogar.
              </span>
            </h1>

            {/* Subhead */}
            <p className="text-base sm:text-lg text-[#475569] max-w-xl leading-relaxed">
              Reparaciones limpias, fiables y garantizadas. Elige una <strong className="text-[#0f172a]">reparación puntual</strong> sin cuotas ni ataduras, o disfruta del <strong className="text-[#0e4f3a]">Plan Anual ArreglaoHome</strong> con intervenciones incluidas todo el año.
            </p>

            {/* TWO MAIN OPTIONS CARDS */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {/* Opción A: Reparación puntual sin suscripción */}
              <div
                onClick={onOpenPunctualRequest}
                className="group relative p-4 rounded-2xl bg-white border-2 border-[#eaf2ed] hover:border-[#0e4f3a] shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#15803d] bg-[#ecfdf5] px-2.5 py-0.5 rounded-full">
                      Opción A · Sin Cuotas
                    </span>
                    <span className="material-symbols-outlined text-[20px] text-[#0e4f3a]">
                      build
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-[#0f172a] group-hover:text-[#0e4f3a] transition-colors">
                    Reparación puntual
                  </h3>
                  <p className="text-xs text-[#64748b] mt-1 leading-relaxed">
                    Paga solo por el trabajo individual que necesitas hoy. Precio cerrado o presupuesto sin compromiso.
                  </p>
                </div>
                <div className="mt-3 pt-2.5 border-t border-[#f1f5f9] flex items-center justify-between text-xs font-bold text-[#0e4f3a]">
                  <span>Solicitar reparación puntual</span>
                  <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </div>
              </div>

              {/* Opción B: Plan Anual ArreglaoHome */}
              <div
                onClick={onOpenAnnualPlan}
                className="group relative p-4 rounded-2xl bg-gradient-to-br from-[#ecfdf5] to-white border-2 border-emerald-300 hover:border-[#0e4f3a] shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#0e4f3a] bg-emerald-200/70 px-2.5 py-0.5 rounded-full">
                      Opción B · Suscripción
                    </span>
                    <span className="material-symbols-outlined text-[20px] text-[#15803d]">
                      verified_user
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-[#0e4f3a]">
                    Plan Anual ArreglaoHome
                  </h3>
                  <p className="text-xs text-[#475569] mt-1 leading-relaxed">
                    2 intervenciones de mano de obra al año incluidas, revisión preventiva y 20% de descuento. Pago mensual o anual.
                  </p>
                </div>
                <div className="mt-3 pt-2.5 border-t border-emerald-200/50 flex items-center justify-between text-xs font-bold text-[#0e4f3a]">
                  <span>Ver coberturas y precios</span>
                  <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </div>
              </div>
            </div>

            {/* BUTTON FOR INTERESTED LEADS (NON-AFFILIATES RECEIVING INFO) */}
            <div className="w-full pt-1 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onOpenLeadInfo}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-[#ecfdf5] border border-emerald-300 text-[#0e4f3a] text-xs font-bold shadow-2xs hover:shadow-xs transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px] text-[#15803d]">
                  mark_email_read
                </span>
                <span>¿Interesado/a? Recibir información y consejos para tu hogar</span>
                <span className="text-[10px] bg-[#ecfdf5] text-[#15803d] px-1.5 py-0.5 rounded-md font-extrabold">
                  Sin afiliación
                </span>
              </button>

              <button
                type="button"
                onClick={onOpenHowItWorks}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#475569] hover:text-[#0e4f3a] transition-colors cursor-pointer"
              >
                <span>¿Cómo funciona el servicio?</span>
                <span className="material-symbols-outlined text-[16px]">expand_more</span>
              </button>
            </div>
          </div>

          {/* Right Column: Visual with Technician Image & Dynamic Social Proof */}
          <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-lg lg:max-w-none">
              {/* Subtle Green Backdrop Glow */}
              <div className="absolute -inset-3 bg-gradient-to-tr from-[#0e4f3a]/15 via-emerald-200/30 to-[#ecfdf5] rounded-3xl blur-xl -z-10"></div>

              {/* Main Real Technician Photo for Home Repairs */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100 aspect-[4/3] sm:aspect-[5/4] lg:aspect-[4/4.5] w-full">
                <img
                  alt="Técnico profesional de ArreglaoHome con polo de la empresa ajustando una persiana en una vivienda luminosa en Castellón"
                  className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
                  src="/src/assets/images/arreglaohome_tecnico_persiana_1791557657198.jpg"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e4f3a]/60 via-transparent to-transparent pointer-events-none"></div>

                {/* Live Availability Badge */}
                <div className="absolute top-4 right-4 flex items-center gap-2 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-lg border border-emerald-100">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100"></span>
                  <span className="text-xs font-bold text-[#0e4f3a] tracking-tight">
                    Técnico disponible en Castellón
                  </span>
                </div>

                {/* Bottom Image Tag */}
                <div className="absolute bottom-4 left-4 text-white text-xs font-medium bg-black/50 backdrop-blur-sm px-3 py-1 rounded-md flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[15px] text-emerald-300">
                    verified
                  </span>
                  <span>Persianas · Electricidad · Fontanería · Manitas</span>
                </div>
              </div>

              {/* Reputation & Social Proof Card */}
              <div className="relative -mt-10 sm:-mt-12 mx-3 sm:mx-6 bg-white/95 backdrop-blur-xl rounded-xl p-4 sm:p-5 shadow-xl border border-[#eaf2ed] transition-transform hover:-translate-y-1">
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-[#ecfdf5] border border-emerald-200/50 flex items-center justify-center flex-shrink-0 text-[#0e4f3a]">
                    <span
                      className="material-symbols-outlined text-[28px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      recommend
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-lg font-bold text-[#0e4f3a]">4.9 / 5</span>
                      <div className="flex text-amber-400">
                        <span
                          className="material-symbols-outlined text-[18px]"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          star
                        </span>
                        <span
                          className="material-symbols-outlined text-[18px]"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          star
                        </span>
                        <span
                          className="material-symbols-outlined text-[18px]"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          star
                        </span>
                        <span
                          className="material-symbols-outlined text-[18px]"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          star
                        </span>
                        <span
                          className="material-symbols-outlined text-[18px]"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          star
                        </span>
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm font-bold text-[#0f172a]">
                      4.9/5 estrellas · Más de 1.400 servicios en Castellón
                    </p>
                    <p className="text-[12px] text-[#475569] mt-0.5">
                      Familias en Castellón, Vila-real y Benicàssim confían en nuestro servicio limpio, rápido y puntual.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
