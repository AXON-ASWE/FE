'use client';

import { useEffect, useState } from 'react';
import { useSession } from '@/context/Sessioncontext';
import { useRouter } from 'next/navigation';
import { Phone, UserCircle } from 'lucide-react';

// ✅ DTO chuẩn cho Doctor Dashboard
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

  // ✅ Chặn role khác vào page doctor
  useEffect(() => {
    if (!session) return;
    if (session.role !== 'doctor') {
      router.push('/');
    }
  }, [session]);

  // ✅ Mock
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

  if (!session) return <div>Đang kiểm tra phiên...</div>;
  if (loading) return <div>Đang tải...</div>;

  return (
    <div className="space-y-6 p-6 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold">Chào mừng, Bác sĩ {session.name}</h1>

      {/* ✅ KHUNG TRẮNG LIST HẸN */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-xl font-semibold mb-4">
          Lịch hẹn hôm nay ({appointments.length})
        </h2>

        <div className="space-y-4">
          {appointments.map((apm) => (
            <AppointmentItem
              key={apm.appointmentId}
              patient={apm.patient}
              time={`${apm.startTime} - ${apm.endTime}`}
              notes={apm.notes}
              status={apm.status}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ✅ item theo UI đẹp + icon
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
    <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
      <div className="flex items-center gap-3">
        {/* Avatar icon */}
        <UserCircle className="w-8 h-8 text-gray-400" />

        <div>
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

      {/* Status pill */}
      <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm">
        {status}
      </span>
    </div>
  );
}
