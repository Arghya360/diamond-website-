'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { auth, db } from './client';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import type { AdminUser } from '../../types/admin';

interface AuthContextType {
  user: User | null;
  adminProfile: AdminUser | null;
  isAdmin: boolean;
  loading: boolean;
  error: string | null;
  login: (email: string, pass: string) => Promise<boolean>;
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
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser && currentUser.email) {
        try {
          const email = currentUser.email.toLowerCase();
          // Check admin doc
          const emailDoc = await getDoc(doc(db, 'admins', email));
          const isSuperOwner = email === 'arghyabiswas0792@gmail.com';

          if (emailDoc.exists() || isSuperOwner) {
            setIsAdmin(true);
            const data = emailDoc.data();
            setAdminProfile({
              uid: currentUser.uid,
              email: currentUser.email,
              displayName: currentUser.displayName || email.split('@')[0],
              role: (data?.role as any) || (isSuperOwner ? 'super_admin' : 'admin'),
            });

            // Ensure super_admin record exists
            if (isSuperOwner && !emailDoc.exists()) {
              await setDoc(doc(db, 'admins', email), {
                email,
                role: 'super_admin',
                displayName: 'Master Administrator',
                createdAt: serverTimestamp(),
              });
            }
          } else {
            setIsAdmin(false);
            setAdminProfile(null);
          }
        } catch (err: any) {
          console.error('Error verifying admin authorization:', err);
          // If Firestore is still provisioning or restricted, super owner is still recognized
          if (currentUser.email.toLowerCase() === 'arghyabiswas0792@gmail.com') {
            setIsAdmin(true);
            setAdminProfile({
              uid: currentUser.uid,
              email: currentUser.email,
              displayName: 'Master Administrator',
              role: 'super_admin',
            });
          }
        }
      } else {
        setIsAdmin(false);
        setAdminProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string): Promise<boolean> => {
    setError(null);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, pass);
      return !!cred.user;
    } catch (err: any) {
      console.error('Admin login error:', err);
      let msg = 'Failed to sign in. Please verify your credentials.';
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        msg = 'Invalid email or password.';
      } else if (err.code === 'auth/too-many-requests') {
        msg = 'Too many attempts. Please try again later.';
      }
      setError(msg);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await fbSignOut(auth);
      setUser(null);
      setAdminProfile(null);
      setIsAdmin(false);
    } catch (err: any) {
      console.error('Logout error:', err);
    }
  };

  const resetPassword = async (email: string): Promise<void> => {
    await sendPasswordResetEmail(auth, email);
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
