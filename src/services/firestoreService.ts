import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from '../firebase';
import {
  ServiceCategory,
  ServiceItem,
  AnnualPlanDetails,
  ServiceRequest,
  UserProfile,
  InterestedLead,
} from '../types';
import {
  SEED_CATEGORIES,
  SEED_SERVICES,
  SINGLE_ANNUAL_PLAN,
  SEED_REQUESTS,
} from './seedData';

const STORAGE_KEY_REQUESTS = 'arreglaohome_cached_requests';
const STORAGE_KEY_USERS = 'arreglaohome_cached_users';
const STORAGE_KEY_SERVICES = 'arreglaohome_cached_services';
const STORAGE_KEY_PLAN = 'arreglaohome_cached_plan';

function getLocalServices(): ServiceItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SERVICES);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Local storage services error', e);
  }
  return SEED_SERVICES;
}

function saveLocalServices(services: ServiceItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY_SERVICES, JSON.stringify(services));
  } catch (e) {
    console.error('Local storage save services error', e);
  }
}

function getLocalPlan(): AnnualPlanDetails {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PLAN);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Local storage plan error', e);
  }
  return SINGLE_ANNUAL_PLAN;
}

function saveLocalPlan(plan: AnnualPlanDetails) {
  try {
    localStorage.setItem(STORAGE_KEY_PLAN, JSON.stringify(plan));
  } catch (e) {
    console.error('Local storage save plan error', e);
  }
}

function getLocalRequests(): ServiceRequest[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_REQUESTS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Local storage read error', e);
  }
  return SEED_REQUESTS;
}

function saveLocalRequests(reqs: ServiceRequest[]) {
  try {
    localStorage.setItem(STORAGE_KEY_REQUESTS, JSON.stringify(reqs));
  } catch (e) {
    console.error('Local storage save error', e);
  }
}

/**
 * Seed initial services, annual plan, and requests
 */
export async function seedInitialDataIfNeeded(): Promise<boolean> {
  try {
    const servicesSnap = await getDocs(collection(db, 'services'));
    if (servicesSnap.empty) {
      console.log('Sembrando servicios en Firestore...');
      for (const s of SEED_SERVICES) {
        await setDoc(doc(db, 'services', s.id), s);
      }
    }

    const planSnap = await getDoc(doc(db, 'plans', SINGLE_ANNUAL_PLAN.id));
    if (!planSnap.exists()) {
      console.log('Sembrando Plan Anual ArreglaoHome en Firestore...');
      await setDoc(doc(db, 'plans', SINGLE_ANNUAL_PLAN.id), SINGLE_ANNUAL_PLAN);
    }

    const reqsSnap = await getDocs(collection(db, 'requests'));
    if (reqsSnap.empty) {
      console.log('Sembrando solicitudes iniciales en Firestore...');
      for (const r of SEED_REQUESTS) {
        await setDoc(doc(db, 'requests', r.id), r);
      }
    }

    return true;
  } catch (error) {
    console.warn('Continuando con datos locales sincronizados...', error);
    return false;
  }
}

export async function resetAndSeedAll(): Promise<void> {
  try {
    for (const s of SEED_SERVICES) {
      await setDoc(doc(db, 'services', s.id), s);
    }
    await setDoc(doc(db, 'plans', SINGLE_ANNUAL_PLAN.id), SINGLE_ANNUAL_PLAN);
    for (const r of SEED_REQUESTS) {
      await setDoc(doc(db, 'requests', r.id), r);
    }
    saveLocalRequests(SEED_REQUESTS);
  } catch (error) {
    console.error('Error re-seeding:', error);
    saveLocalRequests(SEED_REQUESTS);
  }
}

export function getCategories(): ServiceCategory[] {
  return SEED_CATEGORIES;
}

export function getSingleAnnualPlan(): AnnualPlanDetails {
  return SINGLE_ANNUAL_PLAN;
}

export function subscribeServices(
  onData: (services: ServiceItem[]) => void,
  onError?: (err: unknown) => void
): () => void {
  const path = 'services';
  try {
    const unsub = onSnapshot(
      collection(db, path),
      (snap) => {
        if (!snap.empty) {
          const list: ServiceItem[] = [];
          snap.forEach((d) => list.push(d.data() as ServiceItem));
          saveLocalServices(list);
          onData(list);
        } else {
          onData(getLocalServices());
        }
      },
      (error) => {
        onData(getLocalServices());
        if (onError) onError(error);
      }
    );
    return unsub;
  } catch (error) {
    onData(getLocalServices());
    return () => {};
  }
}

export function subscribeAnnualPlan(
  onData: (plan: AnnualPlanDetails) => void
): () => void {
  try {
    const unsub = onSnapshot(
      doc(db, 'plans', SINGLE_ANNUAL_PLAN.id),
      (snap) => {
        if (snap.exists()) {
          const data = snap.data() as AnnualPlanDetails;
          saveLocalPlan(data);
          onData(data);
        } else {
          onData(getLocalPlan());
        }
      },
      () => {
        onData(getLocalPlan());
      }
    );
    return unsub;
  } catch {
    onData(getLocalPlan());
    return () => {};
  }
}

export function subscribeRequests(
  onData: (requests: ServiceRequest[]) => void,
  userId?: string
): () => void {
  const path = 'requests';
  try {
    const q = query(collection(db, path), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(
      q,
      (snap) => {
        if (!snap.empty) {
          let list: ServiceRequest[] = [];
          snap.forEach((d) => list.push(d.data() as ServiceRequest));
          if (userId) {
            list = list.filter((r) => r.userId === userId || r.userId.startsWith('demo-'));
          }
          saveLocalRequests(list);
          onData(list);
        } else {
          const local = getLocalRequests();
          onData(local);
        }
      },
      () => {
        const local = getLocalRequests();
        onData(local);
      }
    );
    return unsub;
  } catch {
    const local = getLocalRequests();
    onData(local);
    return () => {};
  }
}

export async function createServiceRequest(
  request: Omit<ServiceRequest, 'id' | 'createdAt' | 'updatedAt'>
): Promise<ServiceRequest> {
  const id = `req-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();
  const fullRequest: ServiceRequest = {
    ...request,
    id,
    createdAt: now,
    updatedAt: now,
  };

  try {
    await setDoc(doc(db, 'requests', id), fullRequest);
  } catch (error) {
    console.warn('Guardado en cache local:', error);
  }

  const local = getLocalRequests();
  const updated = [fullRequest, ...local];
  saveLocalRequests(updated);

  return fullRequest;
}

export async function cancelServiceRequest(
  requestId: string,
  reason: string = 'Cancelado por el usuario'
): Promise<boolean> {
  const now = new Date().toISOString();
  try {
    await updateDoc(doc(db, 'requests', requestId), {
      status: 'cancelada',
      cancellationReason: reason,
      updatedAt: now,
    });
  } catch (error) {
    console.warn('Actualización local:', error);
  }

  const local = getLocalRequests();
  const updated = local.map((r) =>
    r.id === requestId
      ? { ...r, status: 'cancelada' as const, cancellationReason: reason, updatedAt: now }
      : r
  );
  saveLocalRequests(updated);

  return true;
}

export async function saveUserProfile(profile: UserProfile): Promise<void> {
  try {
    await setDoc(doc(db, 'users', profile.uid), profile, { merge: true });
  } catch (error) {
    console.warn('Guardando perfil localmente:', error);
  }
  try {
    localStorage.setItem(`${STORAGE_KEY_USERS}_${profile.uid}`, JSON.stringify(profile));
  } catch {
    // ignore
  }
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    if (snap.exists()) {
      return snap.data() as UserProfile;
    }
  } catch {
    // ignore
  }
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY_USERS}_${uid}`);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return null;
}

export async function createInterestedLead(
  lead: Omit<InterestedLead, 'id' | 'createdAt'>
): Promise<InterestedLead> {
  const id = `lead-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const fullLead: InterestedLead = {
    ...lead,
    id,
    createdAt: new Date().toISOString(),
  };
  try {
    await setDoc(doc(db, 'interested_leads', id), fullLead);
  } catch (e) {
    console.warn('Guardando lead localmente:', e);
  }
  try {
    const raw = localStorage.getItem('arreglaohome_cached_leads');
    const list = raw ? JSON.parse(raw) : [];
    localStorage.setItem('arreglaohome_cached_leads', JSON.stringify([fullLead, ...list]));
  } catch {
    // ignore
  }
  return fullLead;
}

/**
 * -------------------------------------------------------------
 * MÉTODOS DE ADMINISTRACIÓN (PANEL DE GESTIÓN ARREGLAOHOME)
 * -------------------------------------------------------------
 */

/**
 * Actualizar una solicitud desde el panel de administración
 * Permite avanzar el flujo: 'pendiente' | 'contactado' | 'aceptado' | 'en_curso' | 'completada' | 'cancelada'
 */
export async function updateRequestStatus(
  requestId: string,
  status: ServiceRequest['status'],
  adminNotes?: string
): Promise<boolean> {
  const now = new Date().toISOString();
  const updatePayload: Record<string, unknown> = {
    status,
    updatedAt: now,
  };
  if (adminNotes !== undefined) {
    updatePayload.adminNotes = adminNotes;
  }

  try {
    await updateDoc(doc(db, 'requests', requestId), updatePayload);
  } catch (error) {
    console.warn('Actualización local de solicitud:', error);
  }

  const local = getLocalRequests();
  const updated = local.map((r) =>
    r.id === requestId
      ? {
          ...r,
          status,
          ...(adminNotes !== undefined ? { adminNotes } : {}),
          updatedAt: now,
        }
      : r
  );
  saveLocalRequests(updated);
  return true;
}

/**
 * Modificar un servicio individual y sus tarifas en Firestore
 */
export async function updateService(service: ServiceItem): Promise<boolean> {
  try {
    await setDoc(doc(db, 'services', service.id), service, { merge: true });
  } catch (error) {
    console.warn('Actualización local de servicio:', error);
  }

  const local = getLocalServices();
  const exists = local.some((s) => s.id === service.id);
  const updated = exists
    ? local.map((s) => (s.id === service.id ? service : s))
    : [...local, service];
  saveLocalServices(updated);
  return true;
}

/**
 * Crear un nuevo servicio en el catálogo
 */
export async function createService(
  service: Omit<ServiceItem, 'id'> & { id?: string }
): Promise<ServiceItem> {
  const id = service.id || `srv-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const fullService: ServiceItem = {
    ...service,
    id,
    active: service.active ?? true,
  };

  try {
    await setDoc(doc(db, 'services', id), fullService);
  } catch (error) {
    console.warn('Creación local de servicio:', error);
  }

  const local = getLocalServices();
  saveLocalServices([fullService, ...local]);
  return fullService;
}

/**
 * Activar o desactivar un servicio sin eliminarlo
 */
export async function toggleServiceActive(serviceId: string, active: boolean): Promise<boolean> {
  try {
    await updateDoc(doc(db, 'services', serviceId), { active });
  } catch (error) {
    console.warn('Toggle local de servicio activo:', error);
  }

  const local = getLocalServices();
  const updated = local.map((s) => (s.id === serviceId ? { ...s, active } : s));
  saveLocalServices(updated);
  return true;
}

/**
 * Eliminar un servicio definitivamente
 */
export async function deleteService(serviceId: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, 'services', serviceId));
  } catch (error) {
    console.warn('Eliminación local de servicio:', error);
  }

  const local = getLocalServices();
  const updated = local.filter((s) => s.id !== serviceId);
  saveLocalServices(updated);
  return true;
}

/**
 * Actualizar los precios y coberturas del Plan Anual ArreglaoHome
 */
export async function updateAnnualPlan(plan: AnnualPlanDetails): Promise<boolean> {
  try {
    await setDoc(doc(db, 'plans', plan.id || SINGLE_ANNUAL_PLAN.id), plan, { merge: true });
  } catch (error) {
    console.warn('Actualización local de plan anual:', error);
  }

  saveLocalPlan(plan);
  return true;
}

/**
 * Obtener todos los leads registrados para información comercial
 */
export async function getInterestedLeads(): Promise<InterestedLead[]> {
  try {
    const snap = await getDocs(collection(db, 'interested_leads'));
    if (!snap.empty) {
      const list: InterestedLead[] = [];
      snap.forEach((d) => list.push(d.data() as InterestedLead));
      return list;
    }
  } catch (error) {
    console.warn('Lectura local de leads:', error);
  }

  try {
    const raw = localStorage.getItem('arreglaohome_cached_leads');
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return [];
}

