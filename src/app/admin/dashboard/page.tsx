'use client';

import { useSession } from '@/context/Sessioncontext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Users, Stethoscope, ClipboardList, Building2 } from 'lucide-react';

export default function AdminDashboard() {
  const { session } = useSession();
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  // Fake stats
  const [stats, setStats] = useState({
    doctors: 25,
    patients: 132,
    appointments: 56,
    departments: 12,
  });

  useEffect(() => {
    if (!session) return;

    if (session.role !== 'admin') router.push('/');
    setLoading(false);
  }, [session]);

  if (!session) return <div>Đang kiểm tra phiên...</div>;
  if (loading) return <div>Đang tải dữ liệu...</div>;

  return (
    <div className="space-y-6">
      {/* ========== GRID STATS ========== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Tổng bác sĩ"
          value={stats.doctors}
          icon={<Stethoscope className="w-8 h-8 text-blue-600" />}
        />

        <StatCard
          title="Tổng bệnh nhân"
          value={stats.patients}
          icon={<Users className="w-8 h-8 text-green-600" />}
        />

        <StatCard
          title="Lịch hẹn"
          value={stats.appointments}
          icon={<ClipboardList className="w-8 h-8 text-orange-600" />}
        />

        <StatCard
          title="Khoa"
          value={stats.departments}
          icon={<Building2 className="w-8 h-8 text-purple-600" />}
        />
      </div>

      {/* ========== RECENT APPOINTMENTS ========== */}
      <Card className="shadow-sm border border-gray-200">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Hoạt động gần đây
          </CardTitle>
        </CardHeader>

        <CardContent className="text-gray-500">(Đang cập nhật…)</CardContent>
      </Card>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <Card className="shadow-sm border border-gray-200">
      <CardContent className="flex items-center gap-4 py-6">
        {icon}
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <h3 className="text-3xl font-bold">{value}</h3>
        </div>
      </CardContent>
    </Card>
  );
}
