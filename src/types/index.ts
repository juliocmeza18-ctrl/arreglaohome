export type UserRole = 'cliente' | 'afiliado' | 'admin';

export type PlanPaymentFrequency = 'mensual' | 'anual';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  phone?: string;
  address?: string;
  city?: string;
  hasAnnualPlan?: boolean;
  annualPlanPayment?: PlanPaymentFrequency;
  annualPlanStartDate?: string;
  status?: 'activo' | 'inactivo';
  avatarUrl?: string;
  createdAt: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  icon: string;
  code: string;
  description: string;
  order: number;
}

export type ServicePricingType = 'tarifa_fija' | 'pendiente_presupuesto';

export interface ServiceItem {
  id: string;
  name: string;
  categoryId: string;
  categoryName: string;
  description: string;
  pricingType: ServicePricingType; // 'tarifa_fija' o 'pendiente_presupuesto'
  basePrice: number | null; // Precio individual puntual sin suscripción (€)
  planCovered: boolean; // ¿Está cubierto dentro de las 2 intervenciones anuales incluidas?
  planPriceWithDiscount: number | null; // Tarifa con 20% dto. para suscriptores si agotan visitas o trabajo mayor
  unit: string;
  estimatedDuration: string;
  popular?: boolean;
  active?: boolean; // Activar o desactivar servicio sin eliminarlo
  icon: string;
}

export interface AnnualPlanDetails {
  id: string;
  name: string;
  monthlyPrice: number; // 19.90 €/mes
  annualOneTimePrice: number; // 199.00 €/año en 1 pago
  annualSavings: number; // ~40 € ahorro respecto al pago mensual
  includedInterventions: number; // 2 intervenciones anuales de mano de obra
  interventionLimitHours: number; // Hasta 1h por intervención
  extraDiscountPercentage: number; // 20% en mano de obra adicional
  urgencyResponseHours: number; // Atención prioritaria en menos de 4h
  description: string;
  coverages: string[];
  exclusions: string[];
}

export interface AIDiagnosticQuestion {
  id: string;
  question: string;
  options: string[];
  placeholder?: string;
}

export interface InterestedLead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  city?: string;
  interests?: string[];
  commercialConsent: boolean; // Casilla opcional para comunicaciones comerciales
  privacyConsent: boolean; // Casilla obligatoria de política de privacidad
  createdAt: string;
}

export type ServiceRequestStatus =
  | 'pendiente'
  | 'contactado'
  | 'aceptado'
  | 'en_curso'
  | 'confirmada'
  | 'completada'
  | 'cancelada';

export interface ServiceRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  userRole: 'cliente' | 'afiliado';
  modality: 'reparacion_puntual' | 'plan_anual';
  categoryId: string;
  categoryName: string;
  serviceId: string;
  serviceName: string;
  description: string;
  pricingType: ServicePricingType;
  estimatedPrice: number | null; // null si es 'pendiente_presupuesto'
  isCoveredByAnnualPlan?: boolean;
  aiDiagnosticSummary: string;
  aiQuestionsAnswers: { question: string; answer: string }[];
  photoUrl?: string;
  address: string;
  city: string;
  urgency: 'normal' | 'urgente';
  preferredDate: string;
  preferredTimeSlot: string;
  status: ServiceRequestStatus;
  adminNotes?: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
}
