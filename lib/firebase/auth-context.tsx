'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { auth, db, isFirebaseConfigured } from './client';
import { doc, getDoc, serverTimestamp } from 'firebase/firestore';
import { COLLECTIONS } from './admin-service';
import type { AdminUser } from '../../types/admin';

interface AuthContextType {
  user: User | null;
  adminProfile: AdminUser | null;
  isAdmin: boolean;
  loading: boolean;
  error: string | null;
  login: (identifier: string, pass: string) => Promise<boolean>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  adminProfile: null,
  isAdmin: false,
  loading: true,
  error: null,
  login: async () => false,
  logout: async () => {},
  resetPassword: async () => {},
});

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [adminProfile, setAdminProfile] = useState<AdminUser | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check local session storage for active admin
    if (typeof window !== 'undefined') {
      const stored =
        sessionStorage.getItem('caritas_admin_session') ||
        localStorage.getItem('caritas_admin_session');
      if (stored === 'active') {
        setIsAdmin(true);
        setAdminProfile({
          uid: 'caritas360-owner',
          email: 'Caritas360',
          displayName: 'Caritas360 (Super Admin)',
          role: 'super_admin',
        });
      }
    }

    if (!isFirebaseConfigured || !auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser && currentUser.email) {
        try {
          const email = currentUser.email.toLowerCase();
          const isSuperOwner =
            email === 'caritas360@caritasluxury.com' ||
            email === 'arghyabiswas0792@gmail.com';

          if (db) {
            const userDoc = await getDoc(doc(db, COLLECTIONS.adminUsers, currentUser.uid));
            const emailDoc = await getDoc(doc(db, COLLECTIONS.adminUsers, email));

            if (userDoc.exists() || emailDoc.exists() || isSuperOwner) {
              setIsAdmin(true);
              const data = userDoc.exists()
                ? userDoc.data()
                : emailDoc.exists()
                ? emailDoc.data()
                : null;
              setAdminProfile({
                uid: currentUser.uid,
                email: currentUser.email,
                displayName:
                  data?.name ||
                  data?.displayName ||
                  (isSuperOwner ? 'Caritas360 (Super Admin)' : email.split('@')[0]),
                role: (data?.role as any) || (isSuperOwner ? 'super_admin' : 'admin'),
              });
              if (typeof window !== 'undefined') {
                sessionStorage.setItem('caritas_admin_session', 'active');
                localStorage.setItem('caritas_admin_session', 'active');
              }
            } else {
              setIsAdmin(false);
              setAdminProfile(null);
            }
          } else if (isSuperOwner) {
            setIsAdmin(true);
            setAdminProfile({
              uid: currentUser.uid,
              email: currentUser.email,
              displayName: 'Caritas360 (Super Admin)',
              role: 'super_admin',
            });
          }
        } catch (err: any) {
          console.warn('Admin check error:', err);
        }
      } else {
        if (typeof window !== 'undefined' && sessionStorage.getItem('caritas_admin_session') !== 'active') {
          setIsAdmin(false);
          setAdminProfile(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (identifier: string, pass: string): Promise<boolean> => {
    setError(null);
    const trimmedId = identifier.trim();

    // 1. Direct credentials verification for Caritas360
    if (
      (trimmedId.toLowerCase() === 'caritas360' ||
        trimmedId.toLowerCase() === 'caritas360@caritasluxury.com') &&
      pass === 'Caritas1234!@#'
    ) {
      setIsAdmin(true);
      setAdminProfile({
        uid: 'caritas360-owner',
        email: 'Caritas360',
        displayName: 'Caritas360 (Super Admin)',
        role: 'super_admin',
      });
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('caritas_admin_session', 'active');
        localStorage.setItem('caritas_admin_session', 'active');
      }
      return true;
    }

    // 2. Firebase Auth verification if configured
    if (isFirebaseConfigured && auth) {
      let resolvedEmail = trimmedId;
      if (!resolvedEmail.includes('@')) {
        resolvedEmail = `${resolvedEmail.toLowerCase()}@caritasluxury.com`;
      }

      try {
        const cred = await signInWithEmailAndPassword(auth, resolvedEmail, pass);
        if (cred.user) {
          setIsAdmin(true);
          setAdminProfile({
            uid: cred.user.uid,
            email: cred.user.email || resolvedEmail,
            displayName: cred.user.displayName || 'Admin',
            role: 'super_admin',
          });
          if (typeof window !== 'undefined') {
            sessionStorage.setItem('caritas_admin_session', 'active');
            localStorage.setItem('caritas_admin_session', 'active');
          }
          return true;
        }
      } catch (err: any) {
        console.error('Firebase Auth error:', err);
        let msg = 'Invalid username or password.';
        if (err.code === 'auth/too-many-requests') {
          msg = 'Too many attempts. Please try again later.';
        }
        setError(msg);
        return false;
      }
    }

    setError('Invalid username or password.');
    return false;
  };

  const logout = async (): Promise<void> => {
    if (auth) {
      try {
        await fbSignOut(auth);
      } catch (err: any) {
        console.error('Logout error:', err);
      }
    }
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('caritas_admin_session');
      localStorage.removeItem('caritas_admin_session');
    }
    setUser(null);
    setAdminProfile(null);
    setIsAdmin(false);
  };

  const resetPassword = async (email: string): Promise<void> => {
    if (auth) {
      let target = email.trim();
      if (!target.includes('@')) {
        target = `${target.toLowerCase()}@caritasluxury.com`;
      }
      await sendPasswordResetEmail(auth, target);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        adminProfile,
        isAdmin,
        loading,
        error,
        login,
        logout,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAdminAuth() {
  return useContext(AuthContext);
}
