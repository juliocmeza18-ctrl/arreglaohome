import React, { useState } from 'react';
import { createInterestedLead } from '../services/firestoreService';

interface LeadInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LeadInfoModal: React.FC<LeadInfoModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [commercialConsent, setCommercialConsent] = useState(false);
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim()) {
      setErrorMsg('Por favor completa tu nombre, correo electrónico y teléfono móvil.');
      return;
    }

    if (!privacyConsent) {
      setErrorMsg('Debes aceptar la política de privacidad para registrar tus datos.');
      return;
    }

    try {
      setSubmitting(true);
      setErrorMsg('');
      await createInterestedLead({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        commercialConsent,
        privacyConsent,
      });
      setSubmitted(true);
    } catch (err) {
      console.error('Error al registrar persona interesada:', err);
      setErrorMsg('No se pudo completar el registro. Inténtalo de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    setName('');
    setEmail('');
    setPhone('');
    setCommercialConsent(false);
    setPrivacyConsent(false);
    setErrorMsg('');
    setShowPrivacyPolicy(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div
        className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-[#eaf2ed] max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#0e4f3a] text-white p-6 relative">
          <button
            onClick={handleResetAndClose}
            className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Cerrar"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center">
              <span className="material-symbols-outlined text-[26px] text-emerald-300">
                person_add
              </span>
            </div>
            <div>
              <h2 className="text-xl font-bold">Registro de Personas Interesadas</h2>
              <p className="text-xs text-emerald-100/90 mt-0.5">
                Recibe información sobre servicios, novedades y promociones en tu hogar
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {submitted ? (
            /* Mensaje de confirmación tras el registro */
            <div className="text-center py-6 space-y-4 animate-in zoom-in-95">
              <div className="w-16 h-16 rounded-full bg-[#ecfdf5] border-2 border-emerald-300 text-[#0e4f3a] flex items-center justify-center mx-auto shadow-md">
                <span className="material-symbols-outlined text-[36px] text-[#15803d]">
                  check
                </span>
              </div>
              <h3 className="text-2xl font-extrabold text-[#0e4f3a]">
                ¡Registro completado con éxito!
              </h3>
              <p className="text-xs sm:text-sm text-[#475569] max-w-md mx-auto leading-relaxed">
                Gracias, <strong className="text-[#0f172a]">{name}</strong>. Hemos registrado tus datos de contacto para remitirte información sobre nuestros servicios, novedades del hogar y promociones en Castellón.
              </p>

              <div className="p-3.5 bg-[#f4f7f5] rounded-xl border border-[#eaf2ed] text-xs text-[#15803d] font-semibold max-w-sm mx-auto">
                <span className="material-symbols-outlined text-[16px] inline-block align-middle mr-1">
                  verified
                </span>
                Este registro es 100% gratuito. No has contratado ningún servicio ni suscrito ningún plan.
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="px-6 py-2.5 rounded-xl bg-[#0e4f3a] text-white font-bold text-xs hover:bg-[#0a3829] shadow-xs transition-colors cursor-pointer"
                >
                  Cerrar
                </button>
              </div>
            </div>
          ) : (
            /* Formulario de registro */
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nota explicativa de registro gratuito sin compromiso */}
              <div className="p-3.5 bg-[#ecfdf5] rounded-2xl border border-emerald-200 text-xs text-[#0e4f3a] leading-relaxed flex items-start gap-2.5">
                <span className="material-symbols-outlined text-[20px] text-[#15803d] flex-shrink-0 mt-0.5">
                  info
                </span>
                <div>
                  <strong className="block font-bold mb-0.5">
                    Registro informativo gratuito y sin compromiso
                  </strong>
                  Déjanos tus datos si deseas estar al día de los servicios de ArreglaoHome, recibir consejos de mantenimiento para tu vivienda y enterarte de futuras promociones en Castellón.
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">error</span>
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* 1. Nombre */}
              <div>
                <label className="block text-xs font-bold text-[#475569] mb-1">
                  Nombre y apellidos *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej. Carmen Ortiz"
                  className="w-full p-2.5 text-sm rounded-xl border border-[#cbd5e1] focus:ring-2 focus:ring-[#0e4f3a] outline-none"
                />
              </div>

              {/* 2. Correo electrónico */}
              <div>
                <label className="block text-xs font-bold text-[#475569] mb-1">
                  Correo electrónico *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="carmen@ejemplo.com"
                  className="w-full p-2.5 text-sm rounded-xl border border-[#cbd5e1] focus:ring-2 focus:ring-[#0e4f3a] outline-none"
                />
              </div>

              {/* 3. Teléfono móvil */}
              <div>
                <label className="block text-xs font-bold text-[#475569] mb-1">
                  Teléfono móvil *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="654 00 00 00"
                  className="w-full p-2.5 text-sm rounded-xl border border-[#cbd5e1] focus:ring-2 focus:ring-[#0e4f3a] outline-none"
                />
              </div>

              {/* 4. Casilla independiente y opcional para comunicaciones comerciales */}
              <div className="pt-1">
                <label className="flex items-start gap-2.5 cursor-pointer text-xs text-[#334155] leading-relaxed p-2.5 rounded-xl hover:bg-[#f8faf9] border border-transparent hover:border-[#eaf2ed] transition-colors">
                  <input
                    type="checkbox"
                    checked={commercialConsent}
                    onChange={(e) => setCommercialConsent(e.target.checked)}
                    className="mt-0.5 rounded text-[#0e4f3a] focus:ring-[#0e4f3a] w-4 h-4 cursor-pointer"
                  />
                  <span>
                    <strong>(Opcional)</strong> Deseo recibir comunicaciones comerciales, novedades, ofertas y promociones de ArreglaoHome por correo electrónico o WhatsApp.
                  </span>
                </label>
              </div>

              {/* 5. Casilla obligatoria con enlace a Política de Privacidad */}
              <div>
                <label className="flex items-start gap-2.5 cursor-pointer text-xs text-[#334155] leading-relaxed p-2.5 rounded-xl bg-[#f8faf9] border border-[#eaf2ed]">
                  <input
                    type="checkbox"
                    required
                    checked={privacyConsent}
                    onChange={(e) => setPrivacyConsent(e.target.checked)}
                    className="mt-0.5 rounded text-[#0e4f3a] focus:ring-[#0e4f3a] w-4 h-4 cursor-pointer"
                  />
                  <span>
                    He leído y acepto la{' '}
                    <button
                      type="button"
                      onClick={() => setShowPrivacyPolicy(!showPrivacyPolicy)}
                      className="text-[#0e4f3a] font-bold underline hover:text-[#15803d] cursor-pointer"
                    >
                      política de privacidad
                    </button>{' '}
                    y las condiciones de tratamiento de mis datos personales para gestionar mi contacto. *
                  </span>
                </label>
              </div>

              {/* Desplegable informativo de la política de privacidad */}
              {showPrivacyPolicy && (
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-[#475569] space-y-2 animate-in fade-in">
                  <div className="flex items-center justify-between font-bold text-[#0e4f3a]">
                    <span>Información básica de protección de datos:</span>
                    <button
                      type="button"
                      onClick={() => setShowPrivacyPolicy(false)}
                      className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      Ocultar
                    </button>
                  </div>
                  <p>
                    <strong>Responsable:</strong> ArreglaoHome (Castellón de la Plana).
                  </p>
                  <p>
                    <strong>Finalidad:</strong> Gestionar el contacto y remitirle la información solicitada sobre servicios del hogar, avisos técnicos y, en su caso, comunicaciones comerciales si las ha consentido.
                  </p>
                  <p>
                    <strong>Legitimación:</strong> Consentimiento del interesado.
                  </p>
                  <p>
                    <strong>Destinatarios:</strong> No se ceden datos a terceros salvo obligación legal.
                  </p>
                  <p>
                    <strong>Derechos:</strong> Acceso, rectificación, supresión y demás derechos RGPD escribiendo a hola@arreglaohome.es.
                  </p>
                </div>
              )}

              {/* Botón de envío */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full h-12 bg-[#0e4f3a] hover:bg-[#0a3829] text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {submitting ? (
                    <span>Guardando registro...</span>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[19px]">how_to_reg</span>
                      <span>Completar registro</span>
                    </>
                  )}
                </button>
                <p className="text-[10px] text-center text-[#64748b] mt-2">
                  Registro gratuito. No requiere contratar reparaciones ni cuotas.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
