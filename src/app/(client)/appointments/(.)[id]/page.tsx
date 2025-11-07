'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Calendar, Clock, User, X, CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { appointmentOperation, doctorOperation } from '@/lib/BE-library/main';
import { PatientAppointmentResponse, RescheduleAppointmentPayload } from '@/lib/BE-library/interfaces';
import { AxonHealthcareUtils } from '@/lib/BE-library/main';

export default function RescheduleAppointmentModal() {
  console.log('🚀 INTERCEPT ROUTE ACTIVATED - Modal is being used!');
  const router = useRouter();
  const params = useParams();
  const appointmentId = parseInt(params.id as string);

  const [appointment, setAppointment] = useState<PatientAppointmentResponse | null>(null);
  const [availableSlots, setAvailableSlots] = useState<number[]>([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [rescheduleLoading, setRescheduleLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Smooth modal open effect
  useEffect(() => {
    setIsOpen(true);
  }, []);

  
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
        router.back();
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
      <Dialog 
        open={isOpen} 
        onOpenChange={() => {
          setIsOpen(false);
          setTimeout(() => router.back(), 150);
        }}
      >
        <DialogContent className="max-w-2xl w-full h-[700px] overflow-y-auto 
          data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:slide-in-from-bottom-4
          data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:slide-out-to-bottom-4
          duration-300 ease-out">
          <div className="flex items-center justify-center h-full">
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="ml-3 animate-in slide-in-from-right-2 duration-500 delay-100">Đang tải thông tin cuộc hẹn...</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!appointment) {
    return (
      <Dialog 
        open={isOpen} 
        onOpenChange={() => {
          setIsOpen(false);
          setTimeout(() => router.back(), 150);
        }}
      >
        <DialogContent className="max-w-2xl w-full h-[700px]
          data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:slide-in-from-bottom-4
          data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:slide-out-to-bottom-4
          duration-300 ease-out">
          <DialogHeader>
            <DialogTitle className="text-red-600 animate-in slide-in-from-top-2 duration-400">Không tìm thấy cuộc hẹn</DialogTitle>
          </DialogHeader>
          <div className="p-4 text-center">
            <p className="animate-in fade-in-0 duration-500 delay-100">Không thể tìm thấy thông tin cuộc hẹn. Vui lòng thử lại.</p>
            <Button 
              onClick={() => {
                setIsOpen(false);
                setTimeout(() => router.back(), 150);
              }} 
              className="mt-4 animate-in slide-in-from-bottom-2 duration-400 delay-200"
            >
              Quay lại
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={() => {
        setIsOpen(false);
        setTimeout(() => router.back(), 150);
      }}
    >
      <DialogContent className="max-w-2xl w-full h-[700px] flex flex-col
        data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-96 data-[state=open]:slide-in-from-bottom-4
        data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:slide-out-to-bottom-4
        duration-300 ease-out">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-blue-600 animate-in rotate-in-0 duration-500 delay-200" />
            <span>Dời lịch hẹn</span>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          <div className="space-y-6 p-6">
            {/* Current Appointment Info */}
            <Card>
            <CardHeader>
              <CardTitle className="text-lg">Thông tin cuộc hẹn hiện tại</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <User className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="font-medium text-gray-900">Bác sĩ</p>
                  <p className="text-gray-600">{appointment.doctorName}</p>
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
              </div>

              {/* Time Slot Selection */}
              {selectedDate && (
                <div className="duration-400">
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Chọn giờ hẹn mới
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {availableSlots.length > 0 ? (
                      availableSlots.map((timeSlot, index) => (
                        <Button
                          key={timeSlot}
                          variant={selectedTimeSlot === timeSlot ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedTimeSlot(timeSlot)}
                          className="text-sm hover:scale-105 transition-transform"
                        >
                          {appointmentOperation.getTimeSlotDisplay(timeSlot)}
                        </Button>
                      ))
                    ) : (
                      <div className="col-span-3 text-center py-4 text-gray-500">
                        Không có khung giờ trống cho ngày này
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          </div>
        </div>

        <div className="flex gap-3 justify-end p-6 pt-4 border-t border-gray-100 flex-shrink-0 bg-white">
          <Button
            variant="outline"
            onClick={() => {
              setIsOpen(false);
              setTimeout(() => router.back(), 150);
            }}
            disabled={rescheduleLoading}
          >
            Hủy
          </Button>
          <Button
            onClick={handleReschedule}
            disabled={!selectedDate || selectedTimeSlot === null || rescheduleLoading}
            className="bg-blue-600 hover:bg-blue-700"
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
      </DialogContent>
    </Dialog>
  );
}
