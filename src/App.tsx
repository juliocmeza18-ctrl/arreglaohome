import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { UrgentBar } from './components/UrgentBar';
import { ServicesGrid } from './components/ServicesGrid';
import { HowItWorks } from './components/HowItWorks';
import { WarrantyArea } from './components/WarrantyArea';
import { FinalCta } from './components/FinalCta';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { ServiceRequestModal } from './components/ServiceRequestModal';
import { AnnualPlanModal } from './components/AnnualPlanModal';
import { MyRequestsModal } from './components/MyRequestsModal';
import { LeadInfoModal } from './components/LeadInfoModal';
import { AdminPanelModal } from './components/AdminPanelModal';
import {
  getCategories,
  getSingleAnnualPlan,
  subscribeServices,
  subscribeAnnualPlan,
  subscribeRequests,
  seedInitialDataIfNeeded,
  resetAndSeedAll,
} from './services/firestoreService';
import { testConnection } from './firebase';
import { ServiceCategory, ServiceItem, AnnualPlanDetails, ServiceRequest } from './types';
import { SEED_SERVICES, SINGLE_ANNUAL_PLAN, SEED_REQUESTS } from './services/seedData';

function MainApp() {
  const { profile } = useAuth();

  // State
  const [categories] = useState<ServiceCategory[]>(getCategories());
  const [services, setServices] = useState<ServiceItem[]>(SEED_SERVICES);
  const [annualPlan, setAnnualPlan] = useState<AnnualPlanDetails>(SINGLE_ANNUAL_PLAN);
  const [requests, setRequests] = useState<ServiceRequest[]>(SEED_REQUESTS);

  // Modals state
  const [isRequestModalOpen, setIsRequestModalOpen] = useState<boolean>(false);
  const [isAnnualPlanModalOpen, setIsAnnualPlanModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [isMyRequestsModalOpen, setIsMyRequestsModalOpen] = useState<boolean>(false);
  const [isLeadInfoModalOpen, setIsLeadInfoModalOpen] = useState<boolean>(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState<boolean>(false);

  // Selected service/category for request
  const [modalCategoryId, setModalCategoryId] = useState<string>('persianas');
  const [modalServiceId, setModalServiceId] = useState<string>('');

  const handleOpenAccount = () => {
    setAuthModalMode('login');
    setIsAuthModalOpen(true);
  };

  const handleOpenRegister = () => {
    setIsLeadInfoModalOpen(true);
  };

  const handleOpenAdmin = () => {
    setIsAdminPanelOpen(true);
  };

  // Initial seeding and Firestore subscription
  useEffect(() => {
    testConnection().then((ok) => {
      if (ok) console.log('Firestore conectado correctamente.');
    });

    seedInitialDataIfNeeded();

    const unsubServices = subscribeServices((list) => {
      if (list && list.length > 0) setServices(list);
    });

    const unsubPlan = subscribeAnnualPlan((plan) => {
      if (plan) setAnnualPlan(plan);
    });

    // Si es admin, recibe todas las solicitudes de todos los clientes en tiempo real
    const targetUserId = profile?.role === 'admin' ? undefined : profile?.uid;
    const unsubRequests = subscribeRequests((list) => {
      if (list && list.length > 0) setRequests(list);
    }, targetUserId);

    return () => {
      unsubServices();
      unsubPlan();
      unsubRequests();
    };
  }, [profile?.uid, profile?.role]);

  const handleOpenPunctualRequest = (categoryId?: string, serviceId?: string) => {
    if (categoryId) setModalCategoryId(categoryId);
    if (serviceId) setModalServiceId(serviceId);
    setIsRequestModalOpen(true);
  };

  const handleSelectServiceFromPlanModal = (categoryId: string, serviceId: string) => {
    setModalCategoryId(categoryId);
    setModalServiceId(serviceId);
    setIsAnnualPlanModalOpen(false);
    setIsRequestModalOpen(true);
  };

  const handleRequestCreated = (newReq: ServiceRequest) => {
    setRequests((prev) => [newReq, ...prev]);
  };

  return (
    <div className="min-h-screen bg-[#f8faf9] text-[#0f172a] font-sans antialiased flex flex-col selection:bg-[#10b981] selection:text-white">
      {/* HEADER */}
      <Header
        onOpenPunctualRequest={() => handleOpenPunctualRequest()}
        onOpenAnnualPlan={() => setIsAnnualPlanModalOpen(true)}
        onOpenLeadInfo={() => setIsLeadInfoModalOpen(true)}
        onOpenLogin={handleOpenAccount}
        onOpenRegister={handleOpenRegister}
        onOpenRequests={() => setIsMyRequestsModalOpen(true)}
        requestCount={requests.filter((r) => r.status !== 'cancelada').length}
      />

      {/* MAIN CONTENT */}
      <main className="w-full pt-20 flex-1">
        {/* HERO SECTION WITH "SOLUCIONES RÁPIDAS PARA EL HOGAR" & PROFESSIONAL TECHNICIAN PHOTO */}
        <Hero
          onOpenPunctualRequest={() => handleOpenPunctualRequest()}
          onOpenAnnualPlan={() => setIsAnnualPlanModalOpen(true)}
          onOpenLeadInfo={() => setIsLeadInfoModalOpen(true)}
          onOpenHowItWorks={() => {
            document.getElementById('como-funciona')?.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* QUICK EMERGENCY / NOTICE BAR */}
        <UrgentBar onOpenUrgentBooking={() => handleOpenPunctualRequest('fontaneria')} />

        {/* REPARACIONES PUNTUALES (6 CATEGORIES AND SERVICES WITHOUT SUBSCRIPTION) */}
        <ServicesGrid
          categories={categories}
          services={services}
          onSelectCategory={(catId) => handleOpenPunctualRequest(catId)}
          onOpenAnnualPlan={() => setIsAnnualPlanModalOpen(true)}
        />

        {/* HOW IT WORKS */}
        <HowItWorks />

        {/* WARRANTY & OPERATIONAL AREA */}
        <WarrantyArea />

        {/* FINAL CALL TO ACTION */}
        <FinalCta onStartRequest={() => handleOpenPunctualRequest()} />
      </main>

      {/* FOOTER */}
      <Footer
        onSelectCategory={(catId) => handleOpenPunctualRequest(catId)}
        onOpenAnnualPlan={() => setIsAnnualPlanModalOpen(true)}
        onOpenLeadInfo={() => setIsLeadInfoModalOpen(true)}
        onOpenAuth={handleOpenAccount}
        onOpenAdmin={handleOpenAdmin}
      />

      {/* MODALS */}
      {/* 1. Modal Reparación Puntual / Servicio Individual */}
      <ServiceRequestModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        categories={categories}
        services={services}
        annualPlan={annualPlan}
        initialCategoryId={modalCategoryId}
        initialServiceId={modalServiceId}
        onRequestCreated={handleRequestCreated}
      />

      {/* 2. Modal Plan Anual ArreglaoHome (Único plan con pago mensual o anual) */}
      <AnnualPlanModal
        isOpen={isAnnualPlanModalOpen}
        onClose={() => setIsAnnualPlanModalOpen(false)}
        annualPlan={annualPlan}
        categories={categories}
        services={services}
        onSelectServiceForRequest={handleSelectServiceFromPlanModal}
      />

      {/* 3. Mis Solicitudes (Historial y Cancelaciones en Firestore) */}
      <MyRequestsModal
        isOpen={isMyRequestsModalOpen}
        onClose={() => setIsMyRequestsModalOpen(false)}
        requests={requests}
        onOpenNewRequest={() => handleOpenPunctualRequest()}
      />

      {/* 4. Portal de Usuario / Mi cuenta (Afiliados y Usuarios) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onOpenAnnualPlan={() => setIsAnnualPlanModalOpen(true)}
        onOpenRequests={() => setIsMyRequestsModalOpen(true)}
        onOpenPunctualRequest={() => handleOpenPunctualRequest()}
        initialMode={authModalMode}
      />

      {/* 5. Registro para personas interesadas en recibir información (sin afiliación obligatoria) */}
      <LeadInfoModal
        isOpen={isLeadInfoModalOpen}
        onClose={() => setIsLeadInfoModalOpen(false)}
      />

      {/* 6. Panel de Administración (Gestión Privada de Solicitudes y Precios) */}
      <AdminPanelModal
        isOpen={isAdminPanelOpen}
        onClose={() => setIsAdminPanelOpen(false)}
        categories={categories}
        services={services}
        annualPlan={annualPlan}
        requests={requests}
      />

      {/* Floating Demo Reset */}
      <div className="fixed bottom-4 left-4 z-30">
        <button
          onClick={async () => {
            await resetAndSeedAll();
            alert('Datos del Plan Anual y servicios individuales reiniciados con éxito.');
          }}
          className="bg-white/90 hover:bg-white text-[#0e4f3a] text-[11px] font-bold px-3 py-1.5 rounded-full border border-[#cbd5e1] shadow-md flex items-center gap-1.5 backdrop-blur-xs transition-all hover:scale-105 cursor-pointer"
          title="Reiniciar datos iniciales"
        >
          <span className="material-symbols-outlined text-[15px] text-[#15803d]">sync</span>
          <span>Reiniciar datos demo</span>
        </button>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
