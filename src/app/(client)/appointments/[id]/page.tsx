'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Calendar, Clock, User, ArrowLeft, CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { appointmentOperation, doctorOperation } from '@/lib/BE-library/main';
import { PatientAppointmentResponse, RescheduleAppointmentPayload } from '@/lib/BE-library/interfaces';

export default function RescheduleAppointmentPage() {
  const router = useRouter();
  const params = useParams();
  const appointmentId = parseInt(params.id as string);

  const [appointment, setAppointment] = useState<PatientAppointmentResponse | null>(null);
  const [availableSlots, setAvailableSlots] = useState<number[]>([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [rescheduleLoading, setRescheduleLoading] = useState(false);

  
  useEffect(() => {
    const loadAppointment = async () => {
      try {
        setLoading(true);
        const result = await appointmentOperation.getPatientAppointments();
        
        if (result.success && result.data) {
          const foundAppointment = result.data.find(apt => apt.appointmentId === appointmentId);
          if (foundAppointment) {
            setAppointment(foundAppointment);
            
            setSelectedDate(foundAppointment.appointmentDate);
          }
        }
      } catch (error) {
        console.error('Error loading appointment:', error);
      } finally {
        setLoading(false);
      }
    };

    if (appointmentId) {
      loadAppointment();
    }
  }, [appointmentId]);

  
  useEffect(() => {
    const loadAvailableSlots = async () => {
      if (!appointment || !selectedDate) return;

      try {
        const result = await appointmentOperation.getAvailableTimeSlots(
          appointment.doctorId,
          selectedDate
        );
        
        if (result.success && result.data) {
          setAvailableSlots(result.data.listOfAvailableTimeSlots);
        }
      } catch (error) {
        console.error('Error loading available slots:', error);
      }
    };

    loadAvailableSlots();
  }, [appointment, selectedDate]);

  const handleReschedule = async () => {
    if (!appointment || !selectedDate || selectedTimeSlot === null) {
      alert('Vui lòng chọn đầy đủ ngày và giờ hẹn mới.');
      return;
    }

    try {
      setRescheduleLoading(true);
      
      const reschedulePayload: RescheduleAppointmentPayload = {
        appointmentDate: selectedDate,
        timeSlot: selectedTimeSlot,
      };

      const result = await appointmentOperation.rescheduleAppointment(
        appointmentId,
        reschedulePayload
      );

      if (result.success) {
        alert('Dời lịch hẹn thành công!');
        router.push('/appointments');
      } else {
        alert(`Lỗi: ${result.message}`);
      }
    } catch (error) {
      console.error('Error rescheduling appointment:', error);
      alert('Có lỗi xảy ra khi dời lịch hẹn. Vui lòng thử lại.');
    } finally {
      setRescheduleLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30); 
    return maxDate.toISOString().split('T')[0];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải thông tin cuộc hẹn...</p>
        </div>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardHeader>
            <CardTitle className="text-red-600 text-center">Không tìm thấy cuộc hẹn</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-4">Không thể tìm thấy thông tin cuộc hẹn. Vui lòng thử lại.</p>
            <Button onClick={() => router.push('/appointments')}>
              Quay lại danh sách cuộc hẹn
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/appointments')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại
            </Button>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <CalendarDays className="w-8 h-8 text-blue-600" />
              Dời lịch hẹn jsjsj
            </h1>
          </div>
          <p className="text-gray-600">
            Chọn ngày và giờ mới cho cuộc hẹn của bạn
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Current Appointment Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Thông tin cuộc hẹn hiện tại</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <User className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="font-medium text-gray-900">Bác sĩ</p>
                  <p className="text-gray-600">{appointment.doctorName}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 text-sm">
                <div className="w-4 h-4 bg-blue-100 rounded text-xs flex items-center justify-center">
                  <span className="text-blue-600 font-medium">{appointment.departmentName.charAt(0)}</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Khoa</p>
                  <p className="text-gray-600">{appointment.departmentName}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="font-medium text-gray-900">Ngày hẹn</p>
                  <p className="text-gray-600">{formatDate(appointment.appointmentDate)}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 text-sm">
                <Clock className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="font-medium text-gray-900">Giờ hẹn</p>
                  <p className="text-gray-600">
                    {appointmentOperation.getTimeSlotDisplay(appointment.timeSlot)}
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <Badge className="bg-blue-100 text-blue-800">
                  Mã cuộc hẹn: #{appointment.appointmentId}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* New Appointment Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Chọn thời gian mới</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Date Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Chọn ngày mới
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    setSelectedTimeSlot(null); 
                  }}
                  min={getMinDate()}
                  max={getMaxDate()}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Có thể đặt lịch từ ngày mai đến 30 ngày tới
                </p>
              </div>

              {/* Time Slot Selection */}
              {selectedDate && (
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Chọn giờ hẹn mới
                  </label>
                  <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                    {availableSlots.length > 0 ? (
                      availableSlots.map((timeSlot) => (
                        <Button
                          key={timeSlot}
                          variant={selectedTimeSlot === timeSlot ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedTimeSlot(timeSlot)}
                          className="text-sm justify-start"
                        >
                          {appointmentOperation.getTimeSlotDisplay(timeSlot)}
                        </Button>
                      ))
                    ) : (
                      <div className="col-span-2 text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
                        <Clock className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                        <p>Không có khung giờ trống cho ngày này</p>
                        <p className="text-sm">Vui lòng chọn ngày khác</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => router.push('/appointments')}
                  disabled={rescheduleLoading}
                  className="flex-1"
                >
                  Hủy
                </Button>
                <Button
                  onClick={handleReschedule}
                  disabled={!selectedDate || selectedTimeSlot === null || rescheduleLoading}
                  className="bg-blue-600 hover:bg-blue-700 flex-1"
                >
                  {rescheduleLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Đang dời lịch...
                    </>
                  ) : (
                    'Xác nhận dời lịch'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
