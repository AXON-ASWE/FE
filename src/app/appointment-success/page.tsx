'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, Calendar, Clock, FileText, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function AppointmentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const doctor = searchParams.get('doctor');
  const department = searchParams.get('department');
  const specialty = searchParams.get('specialty');
  const date = searchParams.get('date');
  const time = searchParams.get('time');

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center p-6">
      <Card className="max-w-2xl w-full shadow-md border">
        <CardContent className="p-10">
          {/* Icon */}
          <div className="flex justify-center text-green-600 mb-4">
            <CheckCircle size={64} />
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-center mb-2">
            Đặt lịch thành công!
          </h2>
          <p className="text-center text-gray-600 mb-8">
            Lịch hẹn của bạn đã được ghi nhận. Vui lòng đến sớm 15 phút.
          </p>

          {/* Detail box */}
          <div className="border rounded-lg p-6 space-y-4 bg-white mb-6">
            <h3 className="font-semibold text-gray-800 text-lg mb-4">
              Thông tin lịch hẹn
            </h3>

            <div className="flex items-start gap-3">
              <User size={18} className="text-gray-600" />
              <div>
                <p className="text-gray-600 text-sm">Bác sĩ</p>
                <p className="font-medium text-gray-900">{doctor}</p>
                <p className="text-gray-600 text-sm">
                  {department} - {specialty}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar size={18} className="text-gray-600" />
              <p className="font-medium text-gray-900">{date}</p>
            </div>

            <div className="flex items-center gap-3">
              <Clock size={18} className="text-gray-600" />
              <p className="font-medium text-gray-900">{time}</p>
            </div>
          </div>

          <div className="border border-yellow-300 bg-yellow-50 rounded-md p-4 text-sm text-gray-700 mb-8">
            <strong>Lưu ý quan trọng:</strong> Vui lòng nhịn ăn 8 tiếng trước
            khi kiểm tra.
          </div>

          <div className="flex gap-4">
            <Button
              className="w-full bg-gray-200 text-gray-800 hover:bg-gray-300"
              onClick={() => router.push('/appointments')}
            >
              Xem lịch hẹn của tôi
            </Button>

            <Button
              className="w-full bg-blue-600 text-white hover:bg-blue-700"
              onClick={() => router.push('/')}
            >
              Về trang chủ
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
