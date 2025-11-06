'use client';

import { useEffect, useState } from 'react';
import { useSession } from '@/context/Sessioncontext';
import { useRouter } from 'next/navigation';
import { Phone, UserCircle } from 'lucide-react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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
        const res: DoctorAppointmentDTO[] = [
          {
            appointmentId: 1,
            startTime: '09:30',
            endTime: '10:00',
            status: 'Sắp tới',
            notes: 'Ho kéo dài',
            patient: {
              id: 10,
              name: 'Nguyễn Văn An',
              phone: '0123456789',
              gender: 'Nam',
            },
          },
          {
            appointmentId: 2,
            startTime: '14:30',
            endTime: '15:10',
            status: 'Sắp tới',
            patient: {
              id: 11,
              name: 'Nguyễn Văn B',
              phone: '0987654321',
              gender: 'Nam',
            },
          },
          {
            appointmentId: 3,
            startTime: '11:00',
            endTime: '11:40',
            status: 'Sắp tới',
            notes: 'Tư vấn lần đầu',
            patient: {
              id: 12,
              name: 'Trần Thị Bình',
              phone: '0777888999',
              gender: 'Nữ',
            },
          },
        ];
        setAppointments(res);
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
      <div className="grid grid-cols-4 gap-4">
        <StatCard title="Tổng lịch hẹn" value="8" />
        <StatCard title="Sắp tới" value="4" />
        <StatCard title="Hoàn thành" value="3" />
        <StatCard title="Bệnh nhân" value="3" />
      </div>

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
  return (
    <div className="flex justify-between items-center p-4 rounded-lg border bg-white shadow-sm">
      <div className="flex items-center gap-3">
        <UserCircle className="w-10 h-10 text-gray-400" />
        <div className="space-y-1">
          <p className="font-medium">{patient.name}</p>
          <p className="text-sm text-gray-500">{time}</p>

          {patient.phone && (
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
