'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { ToastAction } from '@/components/ui/toast';

type Appointment = {
  id: number;
  doctorName: string;
  doctorImage: string;
  specialization: string;
  department: string;
  date: string;
  time: string;
  status: 'upcoming' | 'completed' | 'cancelled';
};

const appointmentsData: Appointment[] = [
  {
    id: 1,
    doctorName: 'BS. Trần Minh Tuấn',
    doctorImage:
      'https://images.pexels.com/photos/8460151/pexels-photo-8460151.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
    specialization: 'Thần kinh',
    department: 'Khoa Thần kinh',
    date: 'Thứ Ba, 4 Tháng 11, 2025',
    time: '09:30',
    status: 'upcoming',
  },
  {
    id: 2,
    doctorName: 'BS. Nguyễn Lan Anh',
    doctorImage:
      'https://images.pexels.com/photos/8460151/pexels-photo-8460151.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
    specialization: 'Tim mạch',
    department: 'Khoa Tim mạch',
    date: 'Thứ Năm, 6 Tháng 11, 2025',
    time: '12:00',
    status: 'completed',
  },
  {
    id: 3,
    doctorName: 'BS. Phạm Hoàng Long',
    doctorImage:
      'https://images.pexels.com/photos/8460151/pexels-photo-8460151.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
    specialization: 'Nội tiết',
    department: 'Khoa Nội tiết',
    date: 'Thứ Sáu, 7 Tháng 11, 2025',
    time: '10:30',
    status: 'cancelled',
  },
];

const timeSlots = [
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
  '16:30',
  '17:00',
  '17:30',
];

export default function AppointmentsPage() {
  const [activeTab, setActiveTab] = useState<
    'upcoming' | 'completed' | 'cancelled'
  >('upcoming');
  const [appointments, setAppointments] = useState(appointmentsData);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [confirmCancel, setConfirmCancel] = useState<Appointment | null>(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const { toast } = useToast();
  const router = useRouter();

  const handleCancel = (a: Appointment) => {
    setConfirmCancel(a);
  };

  const confirmCancelAppointment = () => {
    if (!confirmCancel) return;
    setAppointments((prev) =>
      prev.map((x) =>
        x.id === confirmCancel.id ? { ...x, status: 'cancelled' } : x
      )
    );
    setConfirmCancel(null);

    toast({
      title: 'Đã huỷ lịch hẹn',
      description: 'Lịch hẹn của bạn đã được huỷ thành công.',
      duration: 2500,
    });
  };

  const handleReschedule = (a: Appointment) => {
    setSelectedAppointment(a);
  };

  const confirmReschedule = () => {
    if (!newDate || !newTime) {
      toast({
        title: 'Thiếu thông tin',
        description: 'Vui lòng chọn ngày và giờ mới.',
        variant: 'destructive',
      });
      return;
    }

    setAppointments((prev) =>
      prev.map((x) =>
        x.id === selectedAppointment?.id
          ? { ...x, date: newDate, time: newTime }
          : x
      )
    );
    setSelectedAppointment(null);
    setNewDate('');
    setNewTime('');

    toast({
      title: 'Đổi lịch thành công',
      description: 'Lịch hẹn của bạn đã được cập nhật.',
      duration: 2500,
    });
  };

  const filteredAppointments = appointments.filter(
    (a) => a.status === activeTab
  );

  const getStatusLabel = (status: Appointment['status']) => {
    switch (status) {
      case 'upcoming':
        return { text: 'Sắp tới', color: 'bg-blue-100 text-blue-700' };
      case 'completed':
        return { text: 'Hoàn thành', color: 'bg-green-100 text-green-700' };
      case 'cancelled':
        return { text: 'Đã huỷ', color: 'bg-red-100 text-red-700' };
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Lịch khám của tôi
            </h1>
            <p className="text-gray-600 text-sm">
              Quản lý và theo dõi tất cả lịch hẹn của bạn
            </p>
          </div>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => router.push('/find')}
          >
            Đặt lịch mới
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 mb-6">
          {[
            { key: 'upcoming', label: 'Sắp tới' },
            { key: 'completed', label: 'Hoàn thành' },
            { key: 'cancelled', label: 'Đã huỷ' },
          ].map((tab) => (
            <Button
              key={tab.key}
              variant={activeTab === tab.key ? 'default' : 'secondary'}
              onClick={() => setActiveTab(tab.key as any)}
              className={`rounded-full text-sm font-medium ${
                activeTab === tab.key
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tab.label} (
              {appointments.filter((a) => a.status === tab.key).length})
            </Button>
          ))}
        </div>

        {/* Appointment Cards */}
        {filteredAppointments.length === 0 ? (
          <Card className="p-8 text-center text-gray-500">
            Không có lịch hẹn nào trong mục này.
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredAppointments.map((a) => {
              const statusInfo = getStatusLabel(a.status);
              return (
                <Card key={a.id} className="border border-gray-200 shadow-sm">
                  <CardContent className="p-5 flex flex-col md:flex-row md:items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Image
                        src={a.doctorImage}
                        alt={a.doctorName}
                        width={64}
                        height={64}
                        className="rounded-full object-cover"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-lg font-semibold text-gray-800">
                            {a.doctorName}
                          </h2>
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}
                          >
                            {statusInfo.text}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {a.specialization} - {a.department}
                        </p>
                        <div className="mt-2 text-sm text-gray-700 space-y-1">
                          <p className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-500" />{' '}
                            {a.date}
                          </p>
                          <p className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-500" /> {a.time}
                          </p>
                        </div>
                      </div>
                    </div>

                    {a.status === 'upcoming' && (
                      <div className="flex space-x-2 mt-4 md:mt-0">
                        <Button
                          onClick={() => handleReschedule(a)}
                          variant="outline"
                          className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                        >
                          Đổi lịch
                        </Button>
                        <Button
                          onClick={() => handleCancel(a)}
                          variant="outline"
                          className="bg-red-100 text-red-700 hover:bg-red-200"
                        >
                          Huỷ lịch
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Reschedule Dialog */}
        <Dialog
          open={!!selectedAppointment}
          onOpenChange={() => setSelectedAppointment(null)}
        >
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Đổi lịch hẹn</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-gray-600 mb-2">
              Bác sĩ: <strong>{selectedAppointment?.doctorName}</strong>
            </p>

            <label className="block mb-3">
              <span className="text-sm text-gray-700">Chọn ngày mới</span>
              <input
                type="date"
                className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2 text-sm"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
              />
            </label>

            <label className="block mb-4">
              <span className="text-sm text-gray-700">Chọn giờ mới</span>
              <select
                className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2 text-sm"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
              >
                <option value="">-- Chọn giờ --</option>
                {timeSlots.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </label>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setSelectedAppointment(null)}
              >
                Huỷ
              </Button>
              <Button
                onClick={confirmReschedule}
                className="bg-blue-600 text-white"
              >
                Xác nhận
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Cancel Confirm Dialog */}
        <Dialog
          open={!!confirmCancel}
          onOpenChange={() => setConfirmCancel(null)}
        >
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Xác nhận huỷ lịch</DialogTitle>
            </DialogHeader>
            <p className="text-gray-700 text-sm mb-4">
              Bạn có chắc chắn muốn huỷ lịch hẹn với{' '}
              <strong>{confirmCancel?.doctorName}</strong> không?
            </p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setConfirmCancel(null)}>
                Không
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={confirmCancelAppointment}
              >
                Huỷ lịch
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
