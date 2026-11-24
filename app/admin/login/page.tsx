'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import AdminLoginForm from '../../../components/admin/AdminLoginForm';
import '../admin.css';

export default function AdminLoginPage() {
  const router = useRouter();

  return (
    <AdminLoginForm
      onSuccess={() => {
        router.push('/admin/');
      }}
    />
  );
}
