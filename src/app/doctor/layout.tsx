'use client';

import { useSession } from '@/context/Sessioncontext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DoctorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session) return;
    if (session.role !== 'doctor') {
      router.push('/');
    }
  }, [session]);

  if (!session) return <div>Đang kiểm tra phiên...</div>;
  if (session.role !== 'doctor') return <div>Không có quyền truy cập</div>;

  return (
    <div className="flex min-h-screen">
      <main className="flex-1 bg-gray-50 min-h-screen p-6">
        <h1 className="text-3xl font-bold mb-6">
          Chào mừng, Bác sĩ {session.name}
        </h1>

        <div className="space-y-6">{children}</div>
      </main>
    </div>
  );
}
