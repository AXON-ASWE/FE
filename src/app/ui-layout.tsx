'use client';

import { useSession } from '@/context/Sessioncontext';
import { Navbar } from '@/components/blocks/bars/NavBar';
import { Sidebar } from '@/components/blocks/bars/SideBar';
import { Toaster } from '@/components/ui/toaster';

export default function UILayout({ children }: { children: React.ReactNode }) {
  const { session, status } = useSession();

  if (status === 'loading') return <div>Loading...</div>;

  const role = session?.role ?? 'patient';

  if (role === 'patient') {
    return (
      <>
        <Navbar />
        <main>{children}</main>
        <Toaster />
      </>
    );
  }

  // ✅ Role doctor/admin → Navbar + Sidebar
  return (
    <>
      <Navbar />

      <div className="flex min-h-screen">
        <Sidebar className="w-64" />

        <main className="flex-1 p-4">{children}</main>
      </div>

      <Toaster />
    </>
  );
}
