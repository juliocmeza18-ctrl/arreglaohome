import React, { useState } from 'react';
import { ServiceRequest } from '../types';
import { cancelServiceRequest } from '../services/firestoreService';

interface MyRequestsModalProps {
  isOpen: boolean;
  onClose: () => void;
  requests: ServiceRequest[];
  onOpenNewRequest: () => void;
}

export const MyRequestsModal: React.FC<MyRequestsModalProps> = ({
  isOpen,
  onClose,
  requests,
  onOpenNewRequest,
}) => {
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState<string>('Ya no necesito el servicio');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [filter, setFilter] = useState<'all' | 'activas' | 'canceladas'>('all');

  if (!isOpen) return null;

  const handleConfirmCancel = async () => {
    if (!cancellingId) return;
    try {
      setIsProcessing(true);
      await cancelServiceRequest(cancellingId, cancelReason);
      setCancellingId(null);
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredRequests = requests.filter((r) => {
    if (filter === 'activas') return r.status !== 'cancelada' && r.status !== 'completada';
    if (filter === 'canceladas') return r.status === 'cancelada';
    return true;
  });

  const getStatusBadge = (status: ServiceRequest['status']) => {
    switch (status) {
      case 'pendiente':
        return (
          <span className="bg-amber-100 text-amber-800 border border-amber-300 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            Pendiente de Asignación
          </span>
        );
      case 'confirmada':
        return (
          <span className="bg-blue-100 text-blue-800 border border-blue-300 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
            Confirmada con Técnico
          </span>
        );
      case 'en_curso':
        return (
          <span className="bg-emerald-100 text-[#0e4f3a] border border-emerald-300 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
            Técnico en Camino / En Curso
          </span>
        );
      case 'completada':
        return (
          <span className="bg-slate-100 text-slate-700 border border-slate-300 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">done_all</span>
            Completada con Éxito
          </span>
        );
      case 'cancelada':
        return (
          <span className="bg-red-100 text-red-700 border border-red-300 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">cancel</span>
            Cancelada
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div
        className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-[#eaf2ed] max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#0e4f3a] text-white p-5 sm:p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center">
              <span className="material-symbols-outlined text-[26px] text-emerald-300">
                assignment
              </span>
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">Mis Solicitudes y Averías</h2>
              <p className="text-xs text-emerald-100/80">
                Historial en tiempo real sincronizado con Firestore
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* Controls: Filter and New Request button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-1 bg-[#f4f7f5] p-1 rounded-xl text-xs font-bold">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  filter === 'all' ? 'bg-white shadow-xs text-[#0e4f3a]' : 'text-[#64748b]'
                }`}
              >
                Todas ({requests.length})
              </button>
              <button
                onClick={() => setFilter('activas')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  filter === 'activas' ? 'bg-white shadow-xs text-[#0e4f3a]' : 'text-[#64748b]'
                }`}
              >
                Activas
              </button>
              <button
                onClick={() => setFilter('canceladas')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  filter === 'canceladas' ? 'bg-white shadow-xs text-red-600' : 'text-[#64748b]'
                }`}
              >
                Canceladas
              </button>
            </div>

            <button
              onClick={() => {
                onClose();
                onOpenNewRequest();
              }}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#0e4f3a] text-white text-xs font-bold hover:bg-[#0a3829] shadow-xs"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              <span>Nueva Solicitud</span>
            </button>
          </div>

          {/* Cancellation Confirmation Dialog */}
          {cancellingId && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl space-y-3 animate-in fade-in">
              <div className="flex items-center gap-2 text-red-700 font-bold text-sm">
                <span className="material-symbols-outlined text-[20px]">warning</span>
                <span>¿Estás seguro/a de que deseas cancelar esta solicitud?</span>
              </div>
              <p className="text-xs text-red-600">
                Se liberará la cita del técnico asignado en Castellón y se actualizará en base de datos.
              </p>
              <div>
                <label className="block text-[11px] font-bold text-red-800 uppercase mb-1">
                  Motivo de la cancelación:
                </label>
                <select
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-red-300 bg-white"
                >
                  <option value="Ya no necesito el servicio">Ya no necesito el servicio</option>
                  <option value="He solucionado la avería yo mismo/a">
                    He solucionado la avería yo mismo/a
                  </option>
                  <option value="Cambio de fecha o indisponibilidad">
                    Cambio de fecha o indisponibilidad
                  </option>
                  <option value="He encontrado otra alternativa">
                    He encontrado otra alternativa
                  </option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setCancellingId(null)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold text-[#475569] bg-white hover:bg-slate-50"
                >
                  Volver
                </button>
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleConfirmCancel}
                  className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  {isProcessing ? 'Cancelando...' : 'Confirmar Cancelación'}
                </button>
              </div>
            </div>
          )}

          {/* List of requests */}
          {filteredRequests.length === 0 ? (
            <div className="text-center py-12 bg-[#f8faf9] rounded-2xl border border-dashed border-[#cbd5e1] space-y-3">
              <span className="material-symbols-outlined text-[48px] text-[#94a3b8]">
                inbox
              </span>
              <p className="text-sm font-bold text-[#0f172a]">No hay solicitudes en esta vista</p>
              <p className="text-xs text-[#64748b]">
                Puedes solicitar una reparación rápida con nuestro asistente inteligente en 2 minutos.
              </p>
              <button
                onClick={() => {
                  onClose();
                  onOpenNewRequest();
                }}
                className="mt-2 px-5 py-2.5 rounded-xl bg-[#0e4f3a] text-white text-xs font-bold"
              >
                Solicitar ahora
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRequests.map((req) => (
                <div
                  key={req.id}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                    req.status === 'cancelada'
                      ? 'bg-slate-50/70 border-slate-200 opacity-80'
                      : 'bg-white border-[#eaf2ed] shadow-xs hover:shadow-md'
                  }`}
                >
                  {/* Top Bar: Service & Status */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#eaf2ed]">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#15803d] uppercase tracking-wider">
                          {req.categoryName}
                        </span>
                        <span className="text-[10px] text-[#94a3b8]">Ref: {req.id}</span>
                      </div>
                      <h3 className="font-extrabold text-base text-[#0f172a] mt-0.5">
                        {req.serviceName}
                      </h3>
                    </div>
                    <div>{getStatusBadge(req.status)}</div>
                  </div>

                  {/* Body Info */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 py-3.5">
                    {/* Left: Details */}
                    <div className="md:col-span-8 space-y-2.5 text-xs text-[#475569]">
                      <div className="flex items-start gap-2">
                        <span className="material-symbols-outlined text-[17px] text-[#15803d] flex-shrink-0 mt-0.5">
                          location_on
                        </span>
                        <span>
                          <strong className="text-[#0f172a]">Dirección:</strong> {req.address},{' '}
                          {req.city}
                        </span>
                      </div>

                      <div className="flex items-start gap-2">
                        <span className="material-symbols-outlined text-[17px] text-[#15803d] flex-shrink-0 mt-0.5">
                          event
                        </span>
                        <span>
                          <strong className="text-[#0f172a]">Fecha:</strong> {req.preferredDate} ({req.preferredTimeSlot})
                        </span>
                      </div>

                      {/* AI Diagnostic Summary */}
                      {req.aiDiagnosticSummary && (
                        <div className="p-3 bg-[#ecfdf5] rounded-xl border border-emerald-200 text-[#0f172a] mt-1">
                          <div className="flex items-center gap-1.5 font-bold text-[#0e4f3a] mb-1">
                            <span className="material-symbols-outlined text-[16px]">
                              smart_toy
                            </span>
                            <span>Diagnóstico IA Registrado:</span>
                          </div>
                          <p className="text-[11px] leading-relaxed">
                            {req.aiDiagnosticSummary}
                          </p>
                        </div>
                      )}

                      {/* User Notes */}
                      {req.description && (
                        <p className="text-[11px] text-[#64748b]">
                          <strong className="text-[#334155]">Observaciones:</strong> {req.description}
                        </p>
                      )}

                      {/* If cancelled, show reason */}
                      {req.cancellationReason && (
                        <div className="p-2.5 bg-red-50 rounded-lg text-red-700 text-[11px] border border-red-200">
                          <strong>Motivo de cancelación:</strong> {req.cancellationReason}
                        </div>
                      )}
                    </div>

                    {/* Right: Photo + Price */}
                    <div className="md:col-span-4 flex flex-col justify-between items-end gap-3">
                      {req.photoUrl ? (
                        <div className="w-full h-24 rounded-xl overflow-hidden border border-[#cbd5e1] bg-slate-100">
                          <img
                            src={req.photoUrl}
                            alt="Foto de la avería"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-full h-16 rounded-xl border border-dashed border-[#cbd5e1] flex items-center justify-center text-[10px] text-[#94a3b8]">
                          Sin foto adjunta
                        </div>
                      )}

                      <div className="text-right w-full">
                        <span className="text-[10px] text-[#64748b] block">
                          {req.modality === 'plan_anual' ? 'Modalidad:' : 'Tarifa / Presupuesto:'}
                        </span>
                        <span className="text-xl font-extrabold text-[#0e4f3a]">
                          {req.isCoveredByAnnualPlan
                            ? '0,00 €'
                            : req.estimatedPrice !== null
                            ? `${req.estimatedPrice} €`
                            : 'Pendiente de presupuesto'}
                        </span>
                        {req.isCoveredByAnnualPlan && (
                          <span className="text-[10px] text-[#15803d] font-bold block">
                            (Incluido en Plan Anual)
                          </span>
                        )}
                        {!req.isCoveredByAnnualPlan && req.estimatedPrice === null && (
                          <span className="text-[10px] text-amber-700 font-bold block">
                            Valoración técnica previa
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  {req.status !== 'cancelada' && req.status !== 'completada' && (
                    <div className="pt-3 border-t border-[#eaf2ed] flex items-center justify-between">
                      <span className="text-[11px] text-[#15803d] font-semibold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">shield</span>
                        Garantía oficial y seguro RC incluido
                      </span>

                      <button
                        type="button"
                        onClick={() => setCancellingId(req.id)}
                        className="px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[16px]">close</span>
                        <span>Cancelar Solicitud</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
