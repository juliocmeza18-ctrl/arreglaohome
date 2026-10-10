import React from 'react';
import { ServiceCategory, ServiceItem } from '../types';

interface ServicesGridProps {
  categories: ServiceCategory[];
  services: ServiceItem[];
  onSelectCategory: (categoryId: string) => void;
  onOpenAnnualPlan: () => void;
}

export const ServicesGrid: React.FC<ServicesGridProps> = ({
  categories,
  services,
  onSelectCategory,
  onOpenAnnualPlan,
}) => {
  return (
    <section className="w-full py-16 lg:py-24 bg-white" id="reparaciones-individuales">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Title */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-[#15803d] mb-2 bg-[#ecfdf5] px-3.5 py-1 rounded-full border border-emerald-200/50">
            Contratación Sin Suscripción
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0e4f3a] tracking-tight">
            Reparaciones puntuales para tu hogar
          </h2>
          <p className="text-base text-[#475569] mt-3 leading-relaxed">
            Paga únicamente por el trabajo que necesitas. Sin cuotas mensuales ni obligaciones de permanencia. Conoce el precio cerrado antes de contratar o solicita valoración previa sin compromiso.
          </p>

          <div className="mt-4 flex items-center gap-2">
            <button
              onClick={onOpenAnnualPlan}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0e4f3a] hover:text-[#15803d] bg-[#f4f7f5] hover:bg-[#eaf2ed] px-3.5 py-1.5 rounded-lg border border-[#cbd5e1] transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px] text-[#15803d]">
                info
              </span>
              <span>¿Prefieres mantenimiento todo el año? Conoce el Plan Anual ArreglaoHome →</span>
            </button>
          </div>
        </div>

        {/* 6 Category Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {categories.map((cat) => {
            const catServices = services.filter(
              (s) => s.categoryId === cat.id && s.active !== false
            );
            return (
              <div
                key={cat.id}
                className="group relative flex flex-col justify-between bg-[#f4f7f5]/60 hover:bg-white border border-[#eaf2ed] hover:border-emerald-300 rounded-2xl p-6 sm:p-7 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                onClick={() => onSelectCategory(cat.id)}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-14 h-14 rounded-xl bg-[#ecfdf5] text-[#0e4f3a] group-hover:bg-[#0e4f3a] group-hover:text-white flex items-center justify-center transition-colors shadow-xs">
                      <span className="material-symbols-outlined text-[32px]">{cat.icon}</span>
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-white text-[#15803d] border border-[#eaf2ed]">
                      {cat.code}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-[#0f172a] group-hover:text-[#0e4f3a] transition-colors mb-2">
                    {cat.name}
                  </h3>
                  <p className="text-sm text-[#475569] leading-relaxed mb-4">{cat.description}</p>

                  {/* Sample services list with actual defined prices */}
                  <div className="space-y-1.5 border-t border-[#eaf2ed] pt-3 mb-5">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#64748b] block mb-1">
                      Trabajos frecuentes y tarifas:
                    </span>
                    {catServices.slice(0, 3).map((svc) => (
                      <div
                        key={svc.id}
                        className="flex items-center justify-between text-xs text-[#334155]"
                      >
                        <span className="truncate pr-2">• {svc.name}</span>
                        <span className="font-bold text-[#0e4f3a] whitespace-nowrap">
                          {svc.pricingType === 'tarifa_fija'
                            ? `${svc.basePrice} €`
                            : 'A presupuesto'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#eaf2ed]">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectCategory(cat.id);
                    }}
                    className="w-full inline-flex items-center justify-between px-4 py-3 rounded-xl bg-white group-hover:bg-[#0e4f3a] text-[#0e4f3a] group-hover:text-white border border-emerald-200 group-hover:border-[#0e4f3a] font-bold text-sm shadow-xs transition-all cursor-pointer"
                  >
                    <span>Solicitar reparación puntual</span>
                    <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                      arrow_forward
                    </span>
                  </button>
                  <span className="block text-center text-[11px] text-[#475569]/80 mt-2 font-medium">
                    Sin suscripción obligatoria · Precio cerrado o presupuesto previo
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
