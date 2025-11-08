'use client';

import { useEffect, useState } from 'react';
import { useSession } from '@/context/Sessioncontext';
import { useRouter } from 'next/navigation';
import { Phone, UserCircle } from 'lucide-react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { appointmentOperation, AxonHealthcareUtils } from '@/lib/BE-library/main';
import { DoctorAppointmentResponse } from '@/lib/BE-library/interfaces';

type DoctorAppointmentDTO = {
  appointmentId: number;
  startTime: string;
  endTime: string;
  status: string;
  notes?: string;
  patient: {
    id: number;
    name: string;
    phone?: string;
    gender?: string;
  };
};

export default function DoctorDashboard() {
  const { session } = useSession();
  const router = useRouter();
  const [appointments, setAppointments] = useState<DoctorAppointmentDTO[]>([]);
  const [loading, setLoading] = useState(true);

  // Kiểm tra session.role => logic này đã có trong DoctorLayout, không cần ở đây nữa
  useEffect(() => {
    if (!session?.id) return;

    const fetchData = async () => {
      try {
        // Gọi API lấy appointments của doctor
        const apiResult = await appointmentOperation.getDoctorAppointments();
        
        if (apiResult.success && apiResult.data) {
          // Chuyển đổi API data sang format UI hiện tại
          const transformedAppointments: DoctorAppointmentDTO[] = apiResult.data
            .filter(apt => apt.status === 'SCHEDULED') // Chỉ lấy appointments sắp tới
            .slice(0, 3) // Chỉ hiển thị 3 appointments đầu tiên cho dashboard
            .map(apt => {
              // Chuyển đổi timeSlot thành startTime và endTime
              const timeRange = appointmentOperation.getTimeSlotDisplay(apt.timeSlot);
              const [startTime, endTime] = timeRange.split('-');
              
              return {
                appointmentId: apt.appointmentId,
                startTime: startTime,
                endTime: endTime,
                status: 'Sắp tới', // Tất cả đều là SCHEDULED nên hiển thị "Sắp tới"
                notes: 'Xem chi tiết trong hệ thống', // Placeholder vì API không có notes
                patient: {
                  id: apt.appointmentId, // Dùng appointmentId làm patient ID tạm
                  name: `Bệnh nhân #${apt.appointmentId}`, // Placeholder name
                  phone: '--- --- ---', // Placeholder phone
                  gender: 'Không xác định', // Placeholder gender
                },
              };
            });

          setAppointments(transformedAppointments);
        } else {
          // Nếu API lỗi, dùng empty array
          setAppointments([]);
        }
      } catch (error) {
        console.error('Error fetching doctor appointments:', error);
        setAppointments([]); // Fallback to empty array
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session?.id]);

  if (loading) return <div>Đang tải dữ liệu...</div>;

  return (
    <>
      {/* ✅ Thống kê nhanh */}
      <DashboardStats loading={loading} />

      {/* ✅ Lịch hẹn hôm nay */}
      <Card className="shadow-sm border border-gray-200">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Lịch hẹn hôm nay ({appointments.length})
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {appointments.map((apm) => (
            <AppointmentItem
              key={apm.appointmentId}
              patient={apm.patient}
              time={`${apm.startTime} - ${apm.endTime}`}
              notes={apm.notes}
              status={apm.status}
            />
          ))}
        </CardContent>
      </Card>
    </>
  );
}

// Component thống kê dashboard sử dụng API
function DashboardStats({ loading }: { loading: boolean }) {
  const [stats, setStats] = useState({
    totalAppointments: 0,
    scheduled: 0,
    completed: 0,
    patients: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const apiResult = await appointmentOperation.getDoctorAppointments();
        
        if (apiResult.success && apiResult.data) {
          const allAppointments = apiResult.data;
          const today = AxonHealthcareUtils.formatDateForAPI(new Date());
          
          // Tính toán thống kê từ API data
          const calculatedStats = {
            totalAppointments: allAppointments.length,
            scheduled: allAppointments.filter(apt => apt.status === 'SCHEDULED').length,
            completed: allAppointments.filter(apt => apt.status === 'COMPLETED').length,
            patients: new Set(allAppointments.map(apt => apt.appointmentId)).size, // Unique patients (dùng appointmentId tạm)
          };
          
          setStats(calculatedStats);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading || statsLoading) {
    return (
      <div className="grid grid-cols-4 gap-4">
        {[...Array(4)].map((_, index) => (
          <Card key={index} className="shadow-sm border border-gray-200">
            <CardContent className="py-5 flex flex-col gap-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-4">
      <StatCard title="Tổng lịch hẹn" value={stats.totalAppointments.toString()} />
      <StatCard title="Sắp tới" value={stats.scheduled.toString()} />
      <StatCard title="Hoàn thành" value={stats.completed.toString()} />
      <StatCard title="Bệnh nhân" value={stats.patients.toString()} />
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <Card className="shadow-sm border border-gray-200">
      <CardContent className="py-5 flex flex-col gap-2">
        <p className="text-gray-500">{title}</p>
        <h3 className="text-3xl font-bold text-blue-600">{value}</h3>
      </CardContent>
    </Card>
  );
}

function AppointmentItem({
  patient,
  time,
  notes,
  status,
}: {
  patient: { name: string; phone?: string; gender?: string };
  time: string;
  notes?: string;
  status: string;
}) {
  // Xử lý hiển thị phone chỉ khi không phải placeholder
  const shouldShowPhone = patient.phone && patient.phone !== '--- --- ---';
  
  return (
    <div className="flex justify-between items-center p-4 rounded-lg border bg-white shadow-sm">
      <div className="flex items-center gap-3">
        <UserCircle className="w-10 h-10 text-gray-400" />
        <div className="space-y-1">
          <p className="font-medium">{patient.name}</p>
          <p className="text-sm text-gray-500">{time}</p>

          {shouldShowPhone && (
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <Phone size={14} /> {patient.phone}
            </p>
          )}

          {notes && <p className="text-sm text-gray-500">Ghi chú: {notes}</p>}
        </div>
      </div>

      <Badge className="bg-green-100 text-green-700 border border-green-300">
        {status}
      </Badge>
    </div>
  );
}
