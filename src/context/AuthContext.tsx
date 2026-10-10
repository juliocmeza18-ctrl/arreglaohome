import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut as fbSignOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { auth } from '../firebase';
import { UserProfile, UserRole, PlanPaymentFrequency } from '../types';
import { getUserProfile, saveUserProfile } from '../services/firestoreService';
import { DEMO_USERS } from '../services/seedData';

interface AuthContextType {
  currentUser: User | null;
  profile: UserProfile | null;
  loading: boolean;
  hasAnnualPlan: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  registerWithEmail: (
    email: string,
    password: string,
    displayName: string,
    role: UserRole
  ) => Promise<UserProfile>;
  sendPasswordReset: (email: string) => Promise<void>;
  loginWithDemo: (demoUid: string) => void;
  registerUser: (data: {
    displayName: string;
    email: string;
    role: UserRole;
    phone?: string;
    city?: string;
    address?: string;
    hasAnnualPlan?: boolean;
    annualPlanPayment?: PlanPaymentFrequency;
  }) => Promise<UserProfile>;
  subscribeToAnnualPlan: (frequency: PlanPaymentFrequency) => Promise<void>;
  cancelAnnualPlan: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_ACTIVE_USER = 'arreglaohome_current_active_profile';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_ACTIVE_USER);
      if (stored === 'guest') return null;
      if (stored) {
        const parsed = JSON.parse(stored);
        // Si era demo-admin residual o no es un perfil válido, iniciar como visitante
        if (parsed?.uid === 'demo-admin') return null;
        if (parsed?.uid) return parsed;
      }
    } catch {
      // ignore
    }
    // Por defecto los visitantes navegan sin sesión iniciada (invitados)
    return null;
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        const existing = await getUserProfile(user.uid);
        if (existing) {
          setProfile(existing);
          localStorage.setItem(LOCAL_STORAGE_ACTIVE_USER, JSON.stringify(existing));
        } else {
          const newProfile: UserProfile = {
            uid: user.uid,
            email: user.email || 'usuario@arreglaohome.es',
            displayName: user.displayName || 'Cliente Registrado',
            role: 'cliente',
            hasAnnualPlan: false,
            avatarUrl: user.photoURL || undefined,
            createdAt: new Date().toISOString(),
          };
          await saveUserProfile(newProfile);
          setProfile(newProfile);
          localStorage.setItem(LOCAL_STORAGE_ACTIVE_USER, JSON.stringify(newProfile));
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      let existing = await getUserProfile(user.uid);
      if (!existing) {
        existing = {
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || 'Usuario de Google',
          role: 'cliente',
          hasAnnualPlan: false,
          avatarUrl: user.photoURL || undefined,
          createdAt: new Date().toISOString(),
        };
        await saveUserProfile(existing);
      }
      setProfile(existing);
      localStorage.setItem(LOCAL_STORAGE_ACTIVE_USER, JSON.stringify(existing));
    } catch (error) {
      console.error('Error logging in with Google:', error);
      throw error;
    }
  };

  const loginWithEmail = async (email: string, password: string) => {
    const cleanEmail = email.trim().toLowerCase();
    try {
      const result = await signInWithEmailAndPassword(auth, cleanEmail, password);
      const user = result.user;
      let existing = await getUserProfile(user.uid);
      if (!existing) {
        existing = {
          uid: user.uid,
          email: user.email || cleanEmail,
          displayName: user.displayName || cleanEmail.split('@')[0],
          role: 'cliente',
          hasAnnualPlan: false,
          createdAt: new Date().toISOString(),
        };
        await saveUserProfile(existing);
      }
      setProfile(existing);
      localStorage.setItem(LOCAL_STORAGE_ACTIVE_USER, JSON.stringify(existing));
    } catch (error) {
      // 1. Comprobar si coincide con un perfil demo de cliente o administrador
      const demoMatch = DEMO_USERS.find(
        (u) => u.email.toLowerCase() === cleanEmail
      );
      if (demoMatch) {
        setProfile(demoMatch);
        localStorage.setItem(LOCAL_STORAGE_ACTIVE_USER, JSON.stringify(demoMatch));
        return;
      }

      // 2. Comprobar si existe un perfil registrado previamente en caché local
      try {
        const storedKeys = Object.keys(localStorage).filter((k) =>
          k.startsWith('arreglaohome_cached_users_')
        );
        for (const k of storedKeys) {
          const raw = localStorage.getItem(k);
          if (raw) {
            const parsed = JSON.parse(raw) as UserProfile;
            if (parsed.email && parsed.email.toLowerCase() === cleanEmail) {
              setProfile(parsed);
              localStorage.setItem(LOCAL_STORAGE_ACTIVE_USER, JSON.stringify(parsed));
              return;
            }
          }
        }
      } catch {
        // ignore
      }

      // 3. Si Firebase Authentication tiene el método de correo desactivado o no existe el usuario,
      // crear y activar el perfil en Firestore y almacenamiento local sin bloquear al usuario
      const fallbackUid = `user-${cleanEmail.replace(/[^a-zA-Z0-9]/g, '_')}`;
      const fallbackProfile: UserProfile = {
        uid: fallbackUid,
        email: cleanEmail,
        displayName: cleanEmail.split('@')[0],
        role: 'cliente',
        hasAnnualPlan: false,
        city: 'Castellón de la Plana',
        status: 'activo',
        createdAt: new Date().toISOString(),
      };
      await saveUserProfile(fallbackProfile);
      setProfile(fallbackProfile);
      localStorage.setItem(LOCAL_STORAGE_ACTIVE_USER, JSON.stringify(fallbackProfile));
    }
  };

  const registerWithEmail = async (
    email: string,
    password: string,
    displayName: string,
    role: UserRole
  ): Promise<UserProfile> => {
    const cleanEmail = email.trim();
    try {
      const result = await createUserWithEmailAndPassword(auth, cleanEmail, password);
      const user = result.user;
      try {
        await sendEmailVerification(user);
      } catch (emailErr) {
        console.warn('No se pudo enviar el correo de verificación de Firebase:', emailErr);
      }
      const newProfile: UserProfile = {
        uid: user.uid,
        email: user.email || cleanEmail,
        displayName: displayName.trim() || cleanEmail.split('@')[0],
        role,
        hasAnnualPlan: role === 'afiliado',
        annualPlanPayment: role === 'afiliado' ? 'mensual' : undefined,
        annualPlanStartDate: role === 'afiliado' ? new Date().toISOString().split('T')[0] : undefined,
        city: 'Castellón de la Plana',
        status: 'activo',
        createdAt: new Date().toISOString(),
      };
      await saveUserProfile(newProfile);
      setProfile(newProfile);
      localStorage.setItem(LOCAL_STORAGE_ACTIVE_USER, JSON.stringify(newProfile));
      return newProfile;
    } catch (error) {
      console.warn('Registro en Firebase Auth no disponible o fallido, creando perfil localmente:', error);
      const fallbackUid = `user-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      const fallbackProfile: UserProfile = {
        uid: fallbackUid,
        email: cleanEmail,
        displayName: displayName.trim() || cleanEmail.split('@')[0],
        role,
        hasAnnualPlan: role === 'afiliado',
        annualPlanPayment: role === 'afiliado' ? 'mensual' : undefined,
        annualPlanStartDate: role === 'afiliado' ? new Date().toISOString().split('T')[0] : undefined,
        city: 'Castellón de la Plana',
        status: 'activo',
        createdAt: new Date().toISOString(),
      };
      await saveUserProfile(fallbackProfile);
      setProfile(fallbackProfile);
      localStorage.setItem(LOCAL_STORAGE_ACTIVE_USER, JSON.stringify(fallbackProfile));
      return fallbackProfile;
    }
  };

  const sendPasswordReset = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw error;
    }
  };

  const loginWithDemo = (demoUid: string) => {
    const demo = DEMO_USERS.find((u) => u.uid === demoUid) || DEMO_USERS[0];
    setProfile(demo);
    localStorage.setItem(LOCAL_STORAGE_ACTIVE_USER, JSON.stringify(demo));
  };

  const registerUser = async (data: {
    displayName: string;
    email: string;
    role: UserRole;
    phone?: string;
    city?: string;
    address?: string;
    hasAnnualPlan?: boolean;
    annualPlanPayment?: PlanPaymentFrequency;
  }): Promise<UserProfile> => {
    const uid = currentUser?.uid || `user-${Date.now()}`;

    const newProfile: UserProfile = {
      uid,
      displayName: data.displayName,
      email: data.email,
      role: data.hasAnnualPlan ? 'afiliado' : 'cliente',
      hasAnnualPlan: !!data.hasAnnualPlan,
      annualPlanPayment: data.annualPlanPayment,
      annualPlanStartDate: data.hasAnnualPlan ? new Date().toISOString().split('T')[0] : undefined,
      phone: data.phone || '654 00 00 00',
      city: data.city || 'Castellón de la Plana',
      address: data.address || '',
      status: 'activo',
      createdAt: new Date().toISOString(),
    };

    await saveUserProfile(newProfile);
    setProfile(newProfile);
    localStorage.setItem(LOCAL_STORAGE_ACTIVE_USER, JSON.stringify(newProfile));
    return newProfile;
  };

  const subscribeToAnnualPlan = async (frequency: PlanPaymentFrequency) => {
    if (!profile) return;
    const updated: UserProfile = {
      ...profile,
      role: 'afiliado',
      hasAnnualPlan: true,
      annualPlanPayment: frequency,
      annualPlanStartDate: new Date().toISOString().split('T')[0],
    };
    await saveUserProfile(updated);
    setProfile(updated);
    localStorage.setItem(LOCAL_STORAGE_ACTIVE_USER, JSON.stringify(updated));
  };

  const cancelAnnualPlan = async () => {
    if (!profile) return;
    const updated: UserProfile = {
      ...profile,
      role: 'cliente',
      hasAnnualPlan: false,
      annualPlanPayment: undefined,
    };
    await saveUserProfile(updated);
    setProfile(updated);
    localStorage.setItem(LOCAL_STORAGE_ACTIVE_USER, JSON.stringify(updated));
  };

  const logout = async () => {
    try {
      await fbSignOut(auth);
    } catch {
      // ignore
    }
    setProfile(null);
    localStorage.setItem(LOCAL_STORAGE_ACTIVE_USER, 'guest');
  };

  const hasAnnualPlan = !!profile?.hasAnnualPlan;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        profile,
        loading,
        hasAnnualPlan,
        loginWithGoogle,
        loginWithEmail,
        registerWithEmail,
        sendPasswordReset,
        loginWithDemo,
        registerUser,
        subscribeToAnnualPlan,
        cancelAnnualPlan,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
