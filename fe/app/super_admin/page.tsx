'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SuperAdminPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const stored = localStorage.getItem('user');
    if (!token || !stored) {
      router.push('/auth');
      return;
    }
    const u = JSON.parse(stored);
    if (u.role !== 'ADMIN' && u.role !== 'SUPER_ADMIN') {
      router.push('/');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Super Admin</h1>
        <p className="text-sm text-neutral-500 mt-2">Super admin panel</p>
      </div>
    </div>
  );
}
