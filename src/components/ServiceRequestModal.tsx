import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  ServiceCategory,
  ServiceItem,
  AnnualPlanDetails,
  ServiceRequest,
} from '../types';
import {
  getDiagnosticQuestionsForCategory,
  generateAIDiagnostic,
} from '../services/geminiService';
import { createServiceRequest } from '../services/firestoreService';

interface ServiceRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: ServiceCategory[];
  services: ServiceItem[];
  annualPlan: AnnualPlanDetails;
  initialCategoryId?: string;
  initialServiceId?: string;
  onRequestCreated: (newRequest: ServiceRequest) => void;
}

export const ServiceRequestModal: React.FC<ServiceRequestModalProps> = ({
  isOpen,
  onClose,
  categories,
  services,
  annualPlan,
  initialCategoryId,
  initialServiceId,
  onRequestCreated,
}) => {
  const { profile, hasAnnualPlan } = useAuth();

  // Wizard Steps: 1: Trabajo y Precio, 2: Preguntas IA, 3: Fotos, 4: Coordinación de Visita
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form states
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(
    initialCategoryId || 'persianas'
  );
  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    initialServiceId || ''
  );

  // Step 2: AI Questions & Notes
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [additionalNotes, setAdditionalNotes] = useState<string>('');
  const [isGeneratingAI, setIsGeneratingAI] = useState<boolean>(false);
  const [aiDiagnosticResult, setAiDiagnosticResult] = useState<{
    summary: string;
    estimatedMinutes: number;
    urgencyLevel: 'baja' | 'moderada' | 'alta';
    suggestedTools: string[];
    recommendation: string;
  } | null>(null);

  // Step 3: Photo
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [photoPreview, setPhotoPreview] = useState<string>('');

  // Step 4: Booking & Coordination
  const [urgency, setUrgency] = useState<'normal' | 'urgente'>('normal');
  const [address, setAddress] = useState<string>(profile?.address || '');
  const [city, setCity] = useState<string>(profile?.city || 'Castellón de la Plana');
  const [preferredDate, setPreferredDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [preferredTimeSlot, setPreferredTimeSlot] = useState<string>('09:00 - 13:00 (Mañana)');
  const [clientName, setClientName] = useState<string>(profile?.displayName || 'Cliente Castellón');
  const [clientEmail, setClientEmail] = useState<string>(profile?.email || 'cliente@ejemplo.com');
  const [clientPhone, setClientPhone] = useState<string>(profile?.phone || '654 00 00 00');
  const [acceptedPriceOrQuote, setAcceptedPriceOrQuote] = useState<boolean>(true);

  const [saving, setSaving] = useState<boolean>(false);
  const [successRequest, setSuccessRequest] = useState<ServiceRequest | null>(null);

  useEffect(() => {
    if (initialCategoryId) setSelectedCategoryId(initialCategoryId);
    if (initialServiceId) setSelectedServiceId(initialServiceId);
  }, [initialCategoryId, initialServiceId]);

  useEffect(() => {
    if (profile) {
      setClientName(profile.displayName);
      setClientEmail(profile.email);
      if (profile.phone) setClientPhone(profile.phone);
      if (profile.address) setAddress(profile.address);
      if (profile.city) setCity(profile.city);
    }
  }, [profile]);

  if (!isOpen) return null;

  const currentCategory =
    categories.find((c) => c.id === selectedCategoryId) || categories[0];
  const categoryServices = services.filter(
    (s) => s.categoryId === selectedCategoryId && s.active !== false
  );
  const selectedService =
    services.find((s) => s.id === selectedServiceId) || categoryServices[0];

  const diagnosticQuestions = getDiagnosticQuestionsForCategory(selectedCategoryId);

  // Price determination:
  // If user has Annual Plan and service is covered: 0 € (covered by annual plan intervention).
  // Else if user has Annual Plan and service has planDiscountPrice: planDiscountPrice.
  // Else if service has fixed price: basePrice.
  // Else: null ('pendiente_presupuesto').
  const isCoveredByPlan = hasAnnualPlan && !!selectedService?.planCovered;
  const isTarifaFija = selectedService?.pricingType === 'tarifa_fija';

  let calculatedPrice: number | null = null;
  if (isCoveredByPlan) {
    calculatedPrice = 0;
  } else if (hasAnnualPlan && selectedService?.planPriceWithDiscount) {
    calculatedPrice = selectedService.planPriceWithDiscount;
  } else if (isTarifaFija && selectedService?.basePrice !== null) {
    calculatedPrice = selectedService.basePrice;
  }

  const handleProceedToPhoto = async () => {
    setIsGeneratingAI(true);
    const answersList = diagnosticQuestions.map((q) => ({
      question: q.question,
      answer: answers[q.id] || q.options[0],
    }));

    const result = await generateAIDiagnostic(
      currentCategory.name,
      selectedService?.name || currentCategory.name,
      answersList,
      additionalNotes,
      !!photoPreview
    );

    setAiDiagnosticResult(result);
    setIsGeneratingAI(false);
    setStep(3);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPhotoPreview(result);
        setPhotoUrl(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const SAMPLE_PHOTOS = [
    {
      label: 'Cinta rota persiana',
      url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80',
    },
    {
      label: 'Goteo en cisterna',
      url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80',
    },
    {
      label: 'Enchufe quemado',
      url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80',
    },
    {
      label: 'Mueble desmontado',
      url: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=600&q=80',
    },
  ];

  const handleConfirmBooking = async () => {
    try {
      setSaving(true);
      const answersList = diagnosticQuestions.map((q) => ({
        question: q.question,
        answer: answers[q.id] || q.options[0],
      }));

      const newReq = await createServiceRequest({
        userId: profile?.uid || `guest-${Date.now()}`,
        userName: clientName,
        userEmail: clientEmail,
        userPhone: clientPhone,
        userRole: hasAnnualPlan ? 'afiliado' : 'cliente',
        modality: hasAnnualPlan ? 'plan_anual' : 'reparacion_puntual',
        categoryId: selectedCategoryId,
        categoryName: currentCategory.name,
        serviceId: selectedService?.id || 'trabajo-individual',
        serviceName: selectedService?.name || `Reparación puntual en ${currentCategory.name}`,
        description:
          additionalNotes ||
          `Solicitud de reparación puntual: ${selectedService?.name || currentCategory.name}`,
        pricingType: selectedService?.pricingType || 'tarifa_fija',
        estimatedPrice: calculatedPrice,
        isCoveredByAnnualPlan: isCoveredByPlan,
        aiDiagnosticSummary:
          aiDiagnosticResult?.summary ||
          `Evaluación técnica para ${selectedService?.name}.`,
        aiQuestionsAnswers: answersList,
        photoUrl: photoPreview || photoUrl,
        address: address || 'Castellón de la Plana',
        city,
        urgency,
        preferredDate,
        preferredTimeSlot,
        status: 'pendiente',
      });

      setSuccessRequest(newReq);
      onRequestCreated(newReq);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div
        className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-[#eaf2ed] max-h-[92vh] flex flex-col"
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
                build
              </span>
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">
                {hasAnnualPlan ? 'Aviso Plan Anual' : 'Contratación de Reparación Puntual'}
              </h2>
              <p className="text-xs text-emerald-100/80">
                {hasAnnualPlan
                  ? 'Gestiona una intervención acogida a tu Plan Anual ArreglaoHome'
                  : 'Sin suscripción ni cuotas · Paga exclusivamente por el trabajo solicitado'}
              </p>
            </div>
          </div>

          {/* Stepper */}
          {!successRequest && (
            <div className="mt-5 grid grid-cols-4 gap-2 text-center text-[11px] font-bold">
              {[
                { s: 1, label: '1. Trabajo' },
                { s: 2, label: '2. Preguntas IA' },
                { s: 3, label: '3. Foto' },
                { s: 4, label: '4. Cita y Precio' },
              ].map((item) => (
                <div key={item.s} className="flex flex-col items-center gap-1">
                  <div
                    className={`h-1.5 w-full rounded-full transition-all ${
                      step >= item.s ? 'bg-emerald-400' : 'bg-white/20'
                    }`}
                  ></div>
                  <span
                    className={
                      step === item.s ? 'text-white' : 'text-emerald-200/60'
                    }
                  >
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1">
          {successRequest ? (
            /* Confirmation screen */
            <div className="text-center py-6 space-y-5 animate-in zoom-in-95">
              <div className="w-20 h-20 rounded-full bg-[#ecfdf5] border-2 border-emerald-300 text-[#0e4f3a] flex items-center justify-center mx-auto shadow-md">
                <span className="material-symbols-outlined text-[42px] text-[#15803d]">
                  task_alt
                </span>
              </div>
              <div>
                <span className="text-xs font-bold px-3 py-1 bg-[#ecfdf5] text-[#15803d] rounded-full border border-emerald-300 uppercase tracking-wider">
                  Contratación Confirmada
                </span>
                <h3 className="text-2xl font-extrabold text-[#0e4f3a] mt-2">
                  ¡Visita coordinada con éxito!
                </h3>
                <p className="text-sm text-[#475569] max-w-md mx-auto mt-1">
                  Hemos registrado tu solicitud y el técnico de Castellón ha recibido los detalles y el diagnóstico de la avería.
                </p>
              </div>

              {/* Summary Card */}
              <div className="bg-[#f4f7f5] rounded-2xl p-4 text-left border border-[#eaf2ed] max-w-md mx-auto space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#64748b]">Nº de Referencia:</span>
                  <span className="font-bold text-[#0f172a]">{successRequest.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748b]">Trabajo a realizar:</span>
                  <span className="font-bold text-[#0e4f3a]">
                    {successRequest.serviceName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748b]">Modalidad:</span>
                  <span className="font-semibold text-[#0f172a]">
                    {successRequest.modality === 'plan_anual'
                      ? 'Plan Anual ArreglaoHome'
                      : 'Reparación puntual sin suscripción'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#64748b]">Coordinación de visita:</span>
                  <span className="font-semibold text-[#0e4f3a] text-right">
                    Contacto previo para coordinar
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-[#cbd5e1] text-sm">
                  <span className="font-bold text-[#0f172a]">Importe del servicio:</span>
                  <span className="font-extrabold text-[#0e4f3a]">
                    {successRequest.isCoveredByAnnualPlan
                      ? '0,00 € (Incluido en Plan Anual)'
                      : successRequest.estimatedPrice !== null
                      ? `${successRequest.estimatedPrice} €`
                      : 'Pendiente de presupuesto'}
                  </span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#0e4f3a] text-white font-bold hover:bg-[#0a3829] shadow-md transition-all cursor-pointer"
                >
                  Ver en Mis Solicitudes
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* STEP 1: Seleccionar Categoría y Trabajo Concreto */}
              {step === 1 && (
                <div className="space-y-6">
                  {/* Category Pills */}
                  <div>
                    <label className="block text-xs font-bold text-[#475569] uppercase tracking-wider mb-2">
                      1. Selecciona la categoría de reparación:
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {categories.map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => {
                            setSelectedCategoryId(c.id);
                            const first = services.find((s) => s.categoryId === c.id);
                            if (first) setSelectedServiceId(first.id);
                          }}
                          className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                            selectedCategoryId === c.id
                              ? 'border-[#0e4f3a] bg-[#ecfdf5] shadow-xs ring-2 ring-[#0e4f3a]/20'
                              : 'border-[#eaf2ed] bg-white hover:bg-[#f4f7f5]'
                          }`}
                        >
                          <span
                            className={`material-symbols-outlined text-[24px] ${
                              selectedCategoryId === c.id
                                ? 'text-[#0e4f3a]'
                                : 'text-[#64748b]'
                            }`}
                          >
                            {c.icon}
                          </span>
                          <span
                            className={`text-xs font-bold leading-tight ${
                              selectedCategoryId === c.id
                                ? 'text-[#0e4f3a]'
                                : 'text-[#0f172a]'
                            }`}
                          >
                            {c.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Specific Work Selection */}
                  <div>
                    <label className="block text-xs font-bold text-[#475569] uppercase tracking-wider mb-2">
                      2. Selecciona el trabajo concreto que necesitas realizar:
                    </label>

                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                      {categoryServices.map((svc) => {
                        const isSelected = selectedServiceId === svc.id;
                        return (
                          <button
                            key={svc.id}
                            type="button"
                            onClick={() => setSelectedServiceId(svc.id)}
                            className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                              isSelected
                                ? 'border-[#0e4f3a] bg-[#ecfdf5] shadow-xs ring-2 ring-[#0e4f3a]/20'
                                : 'border-[#eaf2ed] bg-white hover:bg-[#f4f7f5]'
                            }`}
                          >
                            <div className="flex-1 pr-3">
                              <p className="font-bold text-sm text-[#0f172a]">{svc.name}</p>
                              <p className="text-xs text-[#64748b] line-clamp-1">
                                {svc.description}
                              </p>
                              <span className="text-[10px] text-[#475569] font-medium mt-0.5 block">
                                ⏱ {svc.estimatedDuration} · {svc.unit}
                              </span>
                            </div>

                            <div className="text-right flex-shrink-0">
                              {svc.pricingType === 'tarifa_fija' ? (
                                <div>
                                  <span className="text-base font-extrabold text-[#0e4f3a]">
                                    {svc.basePrice} €
                                  </span>
                                  <span className="text-[10px] text-[#64748b] block font-medium">
                                    Tarifa cerrada
                                  </span>
                                </div>
                              ) : (
                                <div>
                                  <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 block">
                                    A presupuesto
                                  </span>
                                  <span className="text-[10px] text-[#64748b] block mt-0.5">
                                    Valoración técnica
                                  </span>
                                </div>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Plan Anual Status Information Banner */}
                  {hasAnnualPlan ? (
                    <div className="p-4 bg-[#ecfdf5] rounded-2xl border border-emerald-300 flex items-start gap-3">
                      <span className="material-symbols-outlined text-[24px] text-[#15803d]">
                        verified
                      </span>
                      <div className="text-xs text-[#0e4f3a]">
                        <p className="font-bold">
                          Tienes el Plan Anual ArreglaoHome activo
                        </p>
                        <p className="text-[#334155] mt-0.5">
                          {isCoveredByPlan
                            ? 'Este trabajo está cubierto por tus 2 intervenciones de mano de obra anuales incluidas (0 €).'
                            : 'Este trabajo disfruta del 20% de descuento directo como miembro del plan anual.'}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3.5 bg-[#f8faf9] rounded-2xl border border-[#cbd5e1] flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-[#0f172a] block">
                          Modalidad puntual sin suscripción
                        </span>
                        <span className="text-[#64748b]">
                          Solo pagarás por este trabajo una vez coordinado.
                        </span>
                      </div>
                      <span className="text-[11px] font-bold text-[#15803d] bg-white px-2.5 py-1 rounded-lg border border-emerald-200">
                        Sin cuotas
                      </span>
                    </div>
                  )}

                  {/* Navigation */}
                  <div className="flex justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="inline-flex items-center gap-2 h-12 px-6 rounded-xl bg-[#0e4f3a] hover:bg-[#0a3829] text-white font-bold text-sm shadow-md transition-all cursor-pointer"
                    >
                      <span>Describir Avería (IA)</span>
                      <span className="material-symbols-outlined text-[18px]">
                        arrow_forward
                      </span>
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: Describir avería con Asistente IA */}
              {step === 2 && (
                <div className="space-y-6">
                  <div className="bg-[#ecfdf5] p-4 rounded-2xl border border-emerald-200 flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#0e4f3a] text-white flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-[20px]">smart_toy</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#0e4f3a]">
                        Evaluación técnica para: {selectedService?.name}
                      </h4>
                      <p className="text-xs text-[#475569] mt-0.5">
                        Responde a estas preguntas para que el profesional llegue con las piezas idóneas y conozca la causa de la incidencia.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {diagnosticQuestions.map((q, idx) => (
                      <div
                        key={q.id}
                        className="p-4 rounded-2xl bg-[#f4f7f5]/80 border border-[#eaf2ed]"
                      >
                        <p className="text-xs sm:text-sm font-bold text-[#0f172a] mb-2.5">
                          {idx + 1}. {q.question}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {q.options.map((opt) => {
                            const isSelected = answers[q.id] === opt;
                            return (
                              <button
                                key={opt}
                                type="button"
                                onClick={() =>
                                  setAnswers((prev) => ({ ...prev, [q.id]: opt }))
                                }
                                className={`p-2.5 rounded-xl text-left text-xs transition-all border cursor-pointer ${
                                  isSelected
                                    ? 'bg-[#0e4f3a] text-white font-bold border-[#0e4f3a] shadow-xs'
                                    : 'bg-white hover:bg-slate-50 text-[#334155] border-[#cbd5e1]'
                                }`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}

                    <div>
                      <label className="block text-xs font-bold text-[#475569] uppercase mb-1">
                        Describe la avería o instalación con tus palabras:
                      </label>
                      <textarea
                        rows={2}
                        value={additionalNotes}
                        onChange={(e) => setAdditionalNotes(e.target.value)}
                        placeholder="Ej. La persiana se quedó atascada a mitad, o el grifo pierde agua por la base del monomando..."
                        className="w-full p-3 text-xs sm:text-sm rounded-xl border border-[#cbd5e1] focus:ring-2 focus:ring-[#0e4f3a] outline-none"
                      ></textarea>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-4 py-2.5 rounded-xl border border-[#cbd5e1] text-[#475569] font-bold text-xs hover:bg-[#f4f7f5] cursor-pointer"
                    >
                      ← Volver
                    </button>
                    <button
                      type="button"
                      disabled={isGeneratingAI}
                      onClick={handleProceedToPhoto}
                      className="inline-flex items-center gap-2 h-12 px-6 rounded-xl bg-[#0e4f3a] hover:bg-[#0a3829] text-white font-bold text-sm shadow-md transition-all cursor-pointer"
                    >
                      {isGeneratingAI ? (
                        <span>Evaluando avería...</span>
                      ) : (
                        <>
                          <span>Continuar a Fotografía</span>
                          <span className="material-symbols-outlined text-[18px]">
                            arrow_forward
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Adjuntar fotografías */}
              {step === 3 && (
                <div className="space-y-6">
                  {aiDiagnosticResult && (
                    <div className="p-4 bg-[#ecfdf5] rounded-2xl border border-emerald-200">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="material-symbols-outlined text-[#15803d] text-[20px]">
                          auto_awesome
                        </span>
                        <span className="text-xs font-bold text-[#0e4f3a] uppercase tracking-wider">
                          Diagnóstico Técnico Preliminar
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-[#0f172a] leading-relaxed">
                        {aiDiagnosticResult.summary}
                      </p>
                      <div className="mt-2.5 pt-2 border-t border-emerald-200/60 flex flex-wrap gap-2 text-[11px] text-[#15803d] font-semibold">
                        <span>⏱ Duración estimada: ~{aiDiagnosticResult.estimatedMinutes} min</span>
                        <span>·</span>
                        <span>Herramientas: {aiDiagnosticResult.suggestedTools.join(', ')}</span>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-[#475569] uppercase tracking-wider mb-2">
                      Adjunta fotografías de la avería (opcional pero recomendado):
                    </label>
                    <p className="text-xs text-[#64748b] mb-3">
                      Permite comprobar el modelo exacto, tipo de mecanismo y recambios necesarios antes del desplazamiento.
                    </p>

                    {photoPreview ? (
                      <div className="relative rounded-2xl overflow-hidden border-2 border-[#0e4f3a] aspect-video max-h-56 w-full bg-slate-100 flex items-center justify-center">
                        <img
                          src={photoPreview}
                          alt="Foto avería"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setPhotoPreview('');
                            setPhotoUrl('');
                          }}
                          className="absolute top-3 right-3 bg-red-600 hover:bg-red-700 text-white p-2 rounded-xl shadow-md cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    ) : (
                      <label className="border-2 border-dashed border-[#cbd5e1] hover:border-[#0e4f3a] rounded-2xl p-6 flex flex-col items-center justify-center gap-2 bg-[#f8faf9] cursor-pointer transition-colors text-center">
                        <div className="w-12 h-12 rounded-xl bg-white shadow-xs flex items-center justify-center text-[#15803d]">
                          <span className="material-symbols-outlined text-[28px]">
                            add_a_photo
                          </span>
                        </div>
                        <span className="text-sm font-bold text-[#0e4f3a]">
                          Subir fotografía de la avería
                        </span>
                        <span className="text-xs text-[#64748b]">
                          Cámara del móvil o archivo PNG/JPG
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                    )}

                    <div className="mt-3">
                      <span className="text-[11px] font-bold text-[#64748b] block mb-1">
                        O prueba con una foto de ejemplo:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {SAMPLE_PHOTOS.map((sp) => (
                          <button
                            key={sp.label}
                            type="button"
                            onClick={() => {
                              setPhotoPreview(sp.url);
                              setPhotoUrl(sp.url);
                            }}
                            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-[#f4f7f5] hover:bg-[#eaf2ed] border border-[#eaf2ed] text-[#0f172a] cursor-pointer"
                          >
                            + {sp.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="px-4 py-2.5 rounded-xl border border-[#cbd5e1] text-[#475569] font-bold text-xs hover:bg-[#f4f7f5] cursor-pointer"
                    >
                      ← Volver
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(4)}
                      className="inline-flex items-center gap-2 h-12 px-6 rounded-xl bg-[#0e4f3a] hover:bg-[#0a3829] text-white font-bold text-sm shadow-md transition-all cursor-pointer"
                    >
                      <span>Revisar Precio y Cita</span>
                      <span className="material-symbols-outlined text-[18px]">
                        arrow_forward
                      </span>
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: Tarifa/Presupuesto, Aceptación y Coordinación de Visita */}
              {step === 4 && (
                <div className="space-y-6">
                  {/* PRECIO / PRESUPUESTO CLARO */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-[#f4f7f5] border-2 border-[#0e4f3a] space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#15803d] bg-white px-2 py-0.5 rounded-full border border-emerald-200">
                          {isCoveredByPlan
                            ? 'Cubierto por tu Plan Anual'
                            : isTarifaFija
                            ? 'Tarifa Previamente Definida'
                            : 'Pendiente de Valoración Previa'}
                        </span>
                        <h4 className="font-extrabold text-base text-[#0f172a] mt-1">
                          {selectedService?.name}
                        </h4>
                        <p className="text-xs text-[#64748b]">
                          {selectedService?.description}
                        </p>
                      </div>

                      <div className="text-right">
                        {isCoveredByPlan ? (
                          <div>
                            <span className="text-2xl font-extrabold text-[#15803d]">
                              0,00 €
                            </span>
                            <span className="text-[10px] text-[#15803d] font-bold block">
                              Mano de obra incluida
                            </span>
                          </div>
                        ) : isTarifaFija ? (
                          <div>
                            <span className="text-2xl font-extrabold text-[#0e4f3a]">
                              {calculatedPrice} €
                            </span>
                            <span className="text-[10px] text-[#64748b] block">
                              Precio cerrado
                            </span>
                          </div>
                        ) : (
                          <div>
                            <span className="text-sm font-extrabold text-amber-800 bg-amber-100 px-3 py-1 rounded-xl border border-amber-300 block">
                              Pendiente de Presupuesto
                            </span>
                            <span className="text-[10px] text-[#64748b] block mt-0.5">
                              Valoración sin coste
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Aceptación de condiciones del precio o presupuesto */}
                    <div className="pt-2 border-t border-[#cbd5e1] flex items-start gap-2.5">
                      <input
                        type="checkbox"
                        id="acceptPrice"
                        checked={acceptedPriceOrQuote}
                        onChange={(e) => setAcceptedPriceOrQuote(e.target.checked)}
                        className="mt-1 w-4 h-4 rounded text-[#0e4f3a] focus:ring-[#0e4f3a]"
                      />
                      <label htmlFor="acceptPrice" className="text-xs text-[#334155] cursor-pointer">
                        {isTarifaFija
                          ? `Acepto la tarifa fijada de ${calculatedPrice} € para este trabajo según las condiciones establecidas.`
                          : 'Acepto solicitar la visita del profesional para valoración y confirmación del presupuesto previo.'}
                      </label>
                    </div>
                  </div>

                  {/* Urgency */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setUrgency('normal')}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        urgency === 'normal'
                          ? 'border-[#0e4f3a] bg-[#ecfdf5] ring-2 ring-[#0e4f3a]/20'
                          : 'border-[#eaf2ed] bg-white hover:bg-[#f4f7f5]'
                      }`}
                    >
                      <p className="font-bold text-xs text-[#0e4f3a]">Visita Estándar</p>
                      <p className="text-[11px] text-[#64748b]">Coordinación habitual.</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setUrgency('urgente')}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        urgency === 'urgente'
                          ? 'border-emerald-600 bg-emerald-50 ring-2 ring-emerald-500/20'
                          : 'border-[#eaf2ed] bg-white hover:bg-[#f4f7f5]'
                      }`}
                    >
                      <div className="flex items-center gap-1 font-bold text-xs text-emerald-800">
                        <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping"></span>
                        <span>Asistencia para Hoy</span>
                      </div>
                      <p className="text-[11px] text-[#64748b]">Atención rápida en Castellón.</p>
                    </button>
                  </div>

                  {/* Dirección y Municipio */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#475569] mb-1">
                        Municipio (Castellón) *
                      </label>
                      <select
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full p-2.5 text-sm rounded-xl border border-[#cbd5e1] focus:ring-2 focus:ring-[#0e4f3a] bg-white font-medium"
                      >
                        <option value="Castellón de la Plana">Castellón de la Plana</option>
                        <option value="Vila-real">Vila-real</option>
                        <option value="Benicàssim">Benicàssim</option>
                        <option value="Almassora">Almassora</option>
                        <option value="Burriana">Burriana</option>
                        <option value="Grau de Castelló">Grau de Castelló</option>
                        <option value="Oropesa del Mar">Oropesa del Mar</option>
                        <option value="Betxí">Betxí</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#475569] mb-1">
                        Dirección (Calle, nº, piso) *
                      </label>
                      <input
                        type="text"
                        required
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Carrer Enmig, 12, 3º A"
                        className="w-full p-2.5 text-sm rounded-xl border border-[#cbd5e1] focus:ring-2 focus:ring-[#0e4f3a] outline-none"
                      />
                    </div>
                  </div>

                  {/* Apartado informativo de coordinación del servicio */}
                  <div className="p-4 rounded-2xl bg-[#ecfdf5] border border-emerald-200 flex items-start gap-3.5 shadow-2xs">
                    <div className="w-10 h-10 rounded-xl bg-[#0e4f3a] text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                      <span className="material-symbols-outlined text-[22px]">support_agent</span>
                    </div>
                    <div className="flex-1">
                      <h5 className="font-bold text-xs uppercase tracking-wider text-[#0e4f3a] mb-1">
                        Coordinación del servicio
                      </h5>
                      <p className="text-xs sm:text-sm text-[#1e293b] leading-relaxed">
                        Revisaremos tu solicitud lo antes posible y nos pondremos en contacto contigo para informarte sobre los siguientes pasos y coordinar el servicio.
                      </p>
                    </div>
                  </div>

                  {/* Contacto */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#475569] mb-1">
                        Tu nombre *
                      </label>
                      <input
                        type="text"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        className="w-full p-2 text-sm rounded-xl border border-[#cbd5e1] focus:ring-2 focus:ring-[#0e4f3a]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#475569] mb-1">
                        Teléfono de contacto *
                      </label>
                      <input
                        type="tel"
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        className="w-full p-2 text-sm rounded-xl border border-[#cbd5e1] focus:ring-2 focus:ring-[#0e4f3a]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#475569] mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={clientEmail}
                        onChange={(e) => setClientEmail(e.target.value)}
                        className="w-full p-2 text-sm rounded-xl border border-[#cbd5e1] focus:ring-2 focus:ring-[#0e4f3a]"
                      />
                    </div>
                  </div>

                  {/* Navigation Actions */}
                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="px-4 py-2.5 rounded-xl border border-[#cbd5e1] text-[#475569] font-bold text-xs hover:bg-[#f4f7f5] cursor-pointer"
                    >
                      ← Volver
                    </button>
                    <button
                      type="button"
                      disabled={saving || !address.trim() || !acceptedPriceOrQuote}
                      onClick={handleConfirmBooking}
                      className="inline-flex items-center gap-2 h-14 px-8 rounded-xl bg-[#0e4f3a] hover:bg-[#0a3829] text-white font-bold text-base shadow-lg shadow-[#0e4f3a]/30 transition-all cursor-pointer"
                    >
                      {saving ? (
                        <span>Registrando solicitud...</span>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-[20px]">
                            check_circle
                          </span>
                          <span>Confirmar Contratación</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
