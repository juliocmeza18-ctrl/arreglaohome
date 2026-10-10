import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  AnnualPlanDetails,
  ServiceCategory,
  ServiceItem,
  PlanPaymentFrequency,
} from '../types';

interface AnnualPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  annualPlan: AnnualPlanDetails;
  categories: ServiceCategory[];
  services: ServiceItem[];
  onSelectServiceForRequest: (categoryId: string, serviceId: string) => void;
}

export const AnnualPlanModal: React.FC<AnnualPlanModalProps> = ({
  isOpen,
  onClose,
  annualPlan,
  categories,
  services,
  onSelectServiceForRequest,
}) => {
  const { profile, hasAnnualPlan, subscribeToAnnualPlan, cancelAnnualPlan } = useAuth();

  const [paymentFrequency, setPaymentFrequency] = useState<PlanPaymentFrequency>(
    profile?.annualPlanPayment || 'mensual'
  );
  const [updating, setUpdating] = useState<boolean>(false);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [feedbackMsg, setFeedbackMsg] = useState<string>('');

  if (!isOpen) return null;

  const handleSubscribe = async () => {
    try {
      setUpdating(true);
      await subscribeToAnnualPlan(paymentFrequency);
      setFeedbackMsg(
        `¡Plan Anual ArreglaoHome activado con éxito (${
          paymentFrequency === 'anual' ? 'Pago Anual Único: 199€' : 'Pago Mensual: 19,90€/mes'
        })!`
      );
      setTimeout(() => setFeedbackMsg(''), 4000);
    } catch (e) {
      console.error(e);
    } finally {
      setUpdating(false);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm('¿Seguro que deseas dar de baja el Plan Anual ArreglaoHome?')) return;
    try {
      setUpdating(true);
      await cancelAnnualPlan();
      setFeedbackMsg('Has vuelto a la modalidad de cliente puntual sin suscripción.');
      setTimeout(() => setFeedbackMsg(''), 4000);
    } catch (e) {
      console.error(e);
    } finally {
      setUpdating(false);
    }
  };

  const filteredServices = services.filter((svc) => {
    if (svc.active === false) return false;
    if (activeCategoryFilter === 'all') return true;
    return svc.categoryId === activeCategoryFilter;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div
        className="bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl border border-[#eaf2ed] max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#0e4f3a] text-white p-5 sm:p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center">
              <span className="material-symbols-outlined text-[26px] text-emerald-300">
                verified_user
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold">Plan Anual ArreglaoHome</h2>
                <span className="text-[11px] font-extrabold bg-emerald-400 text-[#002115] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Única suscripción oficial
                </span>
              </div>
              <p className="text-xs text-emerald-100/80 mt-0.5">
                Mantenimiento y reparaciones de confianza en Castellón con 2 opciones de pago: mensual o anual.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-7 flex-1">
          {/* User Status Banner */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#f4f7f5] border border-[#eaf2ed]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#ecfdf5] border border-emerald-300 flex items-center justify-center text-[#0e4f3a] flex-shrink-0">
                  <span className="material-symbols-outlined text-[26px]">
                    {hasAnnualPlan ? 'task_alt' : 'person'}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-base text-[#0f172a]">
                      {profile?.displayName || 'Usuario'}
                    </span>
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                        hasAnnualPlan
                          ? 'bg-emerald-100 text-[#0e4f3a] border border-emerald-300'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {hasAnnualPlan
                        ? `Suscripción Activa (${
                            profile?.annualPlanPayment === 'anual' ? 'Pago Anual' : 'Pago Mensual'
                          })`
                        : 'Sin suscripción · Cliente puntual'}
                    </span>
                  </div>
                  <p className="text-xs text-[#475569] mt-0.5">
                    {hasAnnualPlan
                      ? `Tienes cubiertas 2 intervenciones anuales gratuitas y 20% de descuento en mano de obra adicional.`
                      : 'Actualmente solicitas reparaciones de forma individual sin cuota.'}
                  </p>
                </div>
              </div>

              {hasAnnualPlan && (
                <button
                  onClick={handleCancel}
                  disabled={updating}
                  className="px-3.5 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl border border-red-200 transition-colors cursor-pointer"
                >
                  Dar de baja suscripción
                </button>
              )}
            </div>

            {feedbackMsg && (
              <div className="mt-3 p-3 bg-emerald-100 border border-emerald-300 text-[#0e4f3a] rounded-xl text-xs font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                <span>{feedbackMsg}</span>
              </div>
            )}
          </div>

          {/* MAIN SUBSCRIPTION CARD: SINGLE ANNUAL PLAN WITH PAYMENT TOGGLE */}
          <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#ecfdf5] via-white to-[#f4f7f5] border-2 border-[#0e4f3a] shadow-lg">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#cbd5e1]/60">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#15803d] bg-white px-3 py-1 rounded-full border border-emerald-300 shadow-2xs">
                  Mantenimiento Integral del Hogar
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0e4f3a] mt-2">
                  {annualPlan.name}
                </h3>
                <p className="text-xs sm:text-sm text-[#475569] max-w-lg mt-1 leading-relaxed">
                  {annualPlan.description}
                </p>
              </div>

              {/* PAYMENT FREQUENCY TOGGLE (MENSUAL VS ANUAL) */}
              <div className="bg-white p-2 rounded-2xl border-2 border-emerald-200 shadow-xs flex flex-col items-center flex-shrink-0">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#64748b] mb-1.5">
                  Elige tu forma de pago:
                </span>
                <div className="flex bg-[#f4f7f5] p-1 rounded-xl w-full">
                  <button
                    type="button"
                    onClick={() => setPaymentFrequency('mensual')}
                    className={`flex-1 px-4 py-2 text-xs font-extrabold rounded-lg transition-all cursor-pointer ${
                      paymentFrequency === 'mensual'
                        ? 'bg-[#0e4f3a] text-white shadow-xs'
                        : 'text-[#475569] hover:text-[#0e4f3a]'
                    }`}
                  >
                    Pago mensual
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentFrequency('anual')}
                    className={`flex-1 px-4 py-2 text-xs font-extrabold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1 ${
                      paymentFrequency === 'anual'
                        ? 'bg-[#0e4f3a] text-white shadow-xs'
                        : 'text-[#475569] hover:text-[#0e4f3a]'
                    }`}
                  >
                    <span>Pago anual</span>
                    <span className="text-[9px] bg-emerald-400 text-[#002115] px-1.5 py-0.2 rounded-full font-extrabold">
                      -40€
                    </span>
                  </button>
                </div>

                <div className="text-center mt-3">
                  {paymentFrequency === 'mensual' ? (
                    <div>
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-3xl font-extrabold text-[#0e4f3a]">
                          {annualPlan.monthlyPrice.toFixed(2)} €
                        </span>
                        <span className="text-xs text-[#64748b] font-medium">/ mes</span>
                      </div>
                      <span className="text-[11px] text-[#64748b] block mt-0.5">
                        Cuota mensual vinculada al plan anual
                      </span>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-3xl font-extrabold text-[#0e4f3a]">
                          {annualPlan.annualOneTimePrice.toFixed(2)} €
                        </span>
                        <span className="text-xs text-[#64748b] font-medium">/ año</span>
                      </div>
                      <span className="text-[11px] text-[#15803d] font-bold block mt-0.5">
                        Pago único anual · Ahorras 39,80 € al año
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* COVERAGES LIST & EXCLUSIONS */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-6">
              {/* Coberturas (8 cols) */}
              <div className="md:col-span-7 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#0e4f3a] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px] text-[#15803d]">
                    task_alt
                  </span>
                  <span>Servicios y Coberturas Incluidas en el Plan Anual:</span>
                </h4>
                <ul className="space-y-2 text-xs text-[#1e293b]">
                  {annualPlan.coverages.map((cov, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-[16px] text-[#15803d] flex-shrink-0 mt-0.5">
                        check_circle
                      </span>
                      <span>{cov}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Límites y exclusiones claras (5 cols) */}
              <div className="md:col-span-5 bg-white/90 p-4 rounded-2xl border border-[#cbd5e1] space-y-2.5 text-xs">
                <h4 className="font-bold text-[#64748b] uppercase text-[11px] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-amber-600">
                    info
                  </span>
                  <span>Condiciones y Límites Transparentes:</span>
                </h4>
                <ul className="space-y-1.5 text-[11px] text-[#475569]">
                  {annualPlan.exclusions.map((exc, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>{exc}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-2 border-t border-[#e2e8f0]">
                  <p className="text-[10px] text-[#64748b] leading-tight">
                    * Ambas formas de pago (mensual o anual) corresponden al mismo Plan Anual ArreglaoHome con idénticas coberturas.
                  </p>
                </div>
              </div>
            </div>

            {/* Action CTA Button */}
            <div className="mt-6 pt-5 border-t border-[#cbd5e1]/60 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-[#475569] text-center sm:text-left">
                Garantía oficial y técnicos propios residentes en Castellón.
              </span>

              <button
                type="button"
                onClick={handleSubscribe}
                disabled={updating}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#0e4f3a] hover:bg-[#0a3829] text-white font-bold text-sm shadow-md shadow-[#0e4f3a]/25 transition-all transform active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[20px]">verified</span>
                <span>
                  {hasAnnualPlan
                    ? `Mantener Plan (${paymentFrequency === 'anual' ? 'Pago Anual' : 'Pago Mensual'})`
                    : `Contratar Plan Anual ArreglaoHome (${
                        paymentFrequency === 'anual' ? '199€ en 1 pago' : '19,90€/mes'
                      })`}
                </span>
              </button>
            </div>
          </div>

          {/* TABLE OF SERVICES: HOW EACH WORK IS TREATED UNDER THE PLAN VS INDIVIDUAL */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div>
                <h3 className="text-base font-extrabold text-[#0e4f3a]">
                  Comparativa: Precio Puntual vs Cobertura Plan Anual
                </h3>
                <p className="text-xs text-[#475569]">
                  Consulta cómo se factura cada trabajo si lo contratas de forma individual o dispones del Plan Anual.
                </p>
              </div>

              {/* Category filter pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                <button
                  onClick={() => setActiveCategoryFilter('all')}
                  className={`px-3 py-1 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                    activeCategoryFilter === 'all'
                      ? 'bg-[#0e4f3a] text-white'
                      : 'bg-[#f4f7f5] text-[#475569]'
                  }`}
                >
                  Todos ({services.length})
                </button>
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setActiveCategoryFilter(c.id)}
                    className={`px-2.5 py-1 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                      activeCategoryFilter === c.id
                        ? 'bg-[#0e4f3a] text-white'
                        : 'bg-[#f4f7f5] text-[#475569]'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto border border-[#eaf2ed] rounded-2xl bg-white">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#f4f7f5] text-[#475569] uppercase font-bold text-[10px] tracking-wider border-b border-[#eaf2ed]">
                  <tr>
                    <th className="py-3 px-4">Trabajo</th>
                    <th className="py-3 px-3">Oficio</th>
                    <th className="py-3 px-3">Tarifa Puntual (Sin Suscripción)</th>
                    <th className="py-3 px-3 text-[#15803d]">Con Plan Anual ArreglaoHome</th>
                    <th className="py-3 px-4 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#eaf2ed]">
                  {filteredServices.map((svc) => (
                    <tr key={svc.id} className="hover:bg-[#f8faf9] transition-colors">
                      <td className="py-3 px-4">
                        <p className="font-bold text-[#0f172a] text-xs">{svc.name}</p>
                        <p className="text-[11px] text-[#64748b] line-clamp-1">
                          {svc.description}
                        </p>
                      </td>
                      <td className="py-3 px-3 text-[#475569] font-medium whitespace-nowrap">
                        {svc.categoryName}
                      </td>
                      <td className="py-3 px-3 font-semibold text-[#0f172a] whitespace-nowrap">
                        {svc.pricingType === 'tarifa_fija' ? (
                          <span>{svc.basePrice} €</span>
                        ) : (
                          <span className="text-[#64748b] italic">Pendiente de presupuesto</span>
                        )}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        {svc.planCovered ? (
                          <span className="inline-flex items-center gap-1 font-extrabold text-[#15803d] bg-[#ecfdf5] px-2 py-0.5 rounded-full border border-emerald-200">
                            <span className="material-symbols-outlined text-[14px]">check</span>
                            Incluido en las 2 intervenciones anuales
                          </span>
                        ) : svc.planPriceWithDiscount ? (
                          <span className="font-bold text-[#0e4f3a]">
                            {svc.planPriceWithDiscount} € (20% dto.)
                          </span>
                        ) : (
                          <span className="text-[#64748b]">20% dto. en presupuesto</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => {
                            onClose();
                            onSelectServiceForRequest(svc.categoryId, svc.id);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-[#f4f7f5] hover:bg-[#0e4f3a] text-[#0e4f3a] hover:text-white border border-[#cbd5e1] hover:border-[#0e4f3a] font-bold text-xs transition-colors cursor-pointer"
                        >
                          Solicitar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
