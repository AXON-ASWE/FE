'use client';

import { useSession } from '@/context/Sessioncontext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { adminOperation } from '@/lib/BE-library/main';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Users, Stethoscope, ClipboardList, Building2 } from 'lucide-react';

export default function AdminDashboard() {
  const { session } = useSession();
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  // Real stats from API
  const [stats, setStats] = useState({
    doctors: 0,
    patients: 0,
    appointments: 0,
    departments: 0,
  });

  useEffect(() => {
    if (!session) return;

    if (session.role !== 'ADMIN') {
      router.push('/');
      return;
    }

    // Fetch dashboard statistics
    const fetchStats = async () => {
      try {
        const [doctorsResponse, patientsResponse, departmentsResponse] = await Promise.all([
          adminOperation.getAllDoctorsAdmin(),
          adminOperation.getAllPatients(),
          adminOperation.getAllDepartments(),
        ]);

        setStats({
          doctors: doctorsResponse.success ? doctorsResponse.data?.length || 0 : 0,
          patients: patientsResponse.success ? patientsResponse.data?.length || 0 : 0,
          appointments: 0, // TODO: Cần API để lấy tổng số appointments
          departments: departmentsResponse.success ? departmentsResponse.data?.length || 0 : 0,
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        // Giữ nguyên giá trị 0 nếu có lỗi
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [session, router]);

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
