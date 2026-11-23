'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '../../../lib/firebase/auth-context';
import AdminLoginForm from '../../../components/admin/AdminLoginForm';
import '../admin.css';

export default function AdminLoginPage() {
  const router = useRouter();
  const { isAdmin } = useAdminAuth();

  useEffect(() => {
    if (isAdmin) {
      router.push('/admin/');
    }
  }, [isAdmin, router]);

  return <AdminLoginForm onSuccess={() => router.push('/admin/')} />;
}
