import React from 'react';

export const HowItWorks: React.FC = () => {
  return (
    <section className="w-full py-16 lg:py-24 bg-[#f4f7f5]" id="como-funciona">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#15803d] mb-2 bg-white px-3 py-1 rounded-full border border-[#eaf2ed]">
            Proceso Transparente
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0e4f3a] tracking-tight">
            Cómo funciona ArreglaoHome
          </h2>
          <p className="text-base text-[#475569] mt-2 leading-relaxed">
            Sin formularios interminables ni llamadas en espera. 4 sencillos pasos para tener tu problema solucionado con tranquilidad.
          </p>
        </div>

        {/* 4 Step Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Step 1 */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-xs border border-[#eaf2ed] flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-center justify-between mb-5">
                <span className="w-12 h-12 rounded-xl bg-[#ecfdf5] text-[#0e4f3a] font-extrabold text-xl flex items-center justify-center border border-emerald-200">
                  1
                </span>
                <span className="material-symbols-outlined text-[#15803d] text-[24px]">
                  description
                </span>
              </div>
              <h3 className="text-lg font-bold text-[#0e4f3a] mb-2">Cuéntanos qué necesitas</h3>
              <p className="text-sm text-[#475569] leading-relaxed">
                Selecciona tu servicio y nuestro asistente inteligente te guiará con 2 o 3 preguntas clave para entender el problema.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#eaf2ed] flex items-center gap-1.5 text-xs text-[#15803d] font-semibold">
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              <span>1 minuto</span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-xs border border-[#eaf2ed] flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-center justify-between mb-5">
                <span className="w-12 h-12 rounded-xl bg-[#ecfdf5] text-[#0e4f3a] font-extrabold text-xl flex items-center justify-center border border-emerald-200">
                  2
                </span>
                <span className="material-symbols-outlined text-[#15803d] text-[24px]">
                  add_a_photo
                </span>
              </div>
              <h3 className="text-lg font-bold text-[#0e4f3a] mb-2">Añade fotografías</h3>
              <p className="text-sm text-[#475569] leading-relaxed">
                Una imagen o vídeo breve nos permite identificar el modelo exacto, preparar piezas de recambio y ajustar el tiempo.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#eaf2ed] flex items-center gap-1.5 text-xs text-[#15803d] font-semibold">
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              <span>Desde tu móvil</span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-xs border border-[#eaf2ed] flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-center justify-between mb-5">
                <span className="w-12 h-12 rounded-xl bg-[#ecfdf5] text-[#0e4f3a] font-extrabold text-xl flex items-center justify-center border border-emerald-200">
                  3
                </span>
                <span className="material-symbols-outlined text-[#15803d] text-[24px]">
                  rule
                </span>
              </div>
              <h3 className="text-lg font-bold text-[#0e4f3a] mb-2">Revisamos tu solicitud</h3>
              <p className="text-sm text-[#475569] leading-relaxed">
                Asignamos al especialista certificado de Castellón idóneo para el trabajo y calculamos una valoración transparente.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#eaf2ed] flex items-center gap-1.5 text-xs text-[#15803d] font-semibold">
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              <span>Técnico homologado</span>
            </div>
          </div>

          {/* Step 4 */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-xs border border-[#eaf2ed] flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-center justify-between mb-5">
                <span className="w-12 h-12 rounded-xl bg-[#ecfdf5] text-[#0e4f3a] font-extrabold text-xl flex items-center justify-center border border-emerald-200">
                  4
                </span>
                <span className="material-symbols-outlined text-[#15803d] text-[24px]">
                  task_alt
                </span>
              </div>
              <h3 className="text-lg font-bold text-[#0e4f3a] mb-2">Contactamos contigo</h3>
              <p className="text-sm text-[#475569] leading-relaxed">
                Te enviamos la confirmación con fecha u hora acordada y presupuesto cerrado sin sorpresas posteriores.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#eaf2ed] flex items-center gap-1.5 text-xs text-[#15803d] font-semibold">
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              <span>Garantía total</span>
            </div>
          </div>
        </div>

        {/* Phone Help Callout Box */}
        <div className="mt-12 bg-white rounded-2xl p-6 sm:p-8 border border-emerald-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#0e4f3a] text-white flex items-center justify-center flex-shrink-0 shadow-xs">
              <span className="material-symbols-outlined text-[26px]">support_agent</span>
            </div>
            <div>
              <span className="font-bold text-base sm:text-lg text-[#0e4f3a] block">
                ¿Prefieres que te asesoremos directamente por teléfono?
              </span>
              <span className="text-sm text-[#475569]">
                Atención telefónica local de lunes a domingo de 08:00 a 20:00 h.
              </span>
            </div>
          </div>
          <a
            className="inline-flex items-center gap-2 h-12 px-6 rounded-xl bg-[#ecfdf5] hover:bg-emerald-100 text-[#0e4f3a] border border-emerald-300 font-bold text-sm shadow-xs transition-colors flex-shrink-0"
            href="tel:+34964000000"
          >
            <span className="material-symbols-outlined text-[20px] text-[#15803d]">
              phone_in_talk
            </span>
            <span>Llamar al 964 00 00 00</span>
          </a>
        </div>
      </div>
    </section>
  );
};
