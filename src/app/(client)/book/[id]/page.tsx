'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { 
  appointmentOperation, 
  doctorOperation,
  AxonHealthcareUtils 
} from '@/lib/BE-library/main';
import { 
  DoctorResponse, 
  AvailableTimeSlotsResponse 
} from '@/lib/BE-library/interfaces';
import { getAppointmentData, clearAppointmentData, AppointmentData } from '@/lib/appointment-storage';

export default function BookAppointmentPage() {
  const router = useRouter();
  const params = useParams();
  const doctorId = parseInt(params.id as string);

  const [doctor, setDoctor] = useState<DoctorResponse | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<number | null>(null);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [creatingAppointment, setCreatingAppointment] = useState(false);
  const [storedAppointmentData, setStoredAppointmentData] = useState<AppointmentData | null>(null);

  
  useEffect(() => {
    const storedData = getAppointmentData();
    if (storedData) {
      setStoredAppointmentData(storedData);


      if (storedData.selectedDoctor.doctorId !== doctorId) {
        console.warn('Stored doctor ID does not match current page doctor ID');
      }
    }
  }, [doctorId]);

  
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const formattedDate = AxonHealthcareUtils.formatDateForAPI(tomorrow);
    setSelectedDate(formattedDate);
  }, []);

  
  useEffect(() => {
    const loadDoctor = async () => {
      try {
        setLoading(true);
        const storedData = getAppointmentData();
        if (storedData && storedData.selectedDoctor.doctorId === doctorId) {       
          setDoctor(storedData.selectedDoctor);
        } else {
          const mockDoctor: DoctorResponse = {
            userId: 1,
            doctorId: 1,
            doctorName: `Bác sĩ ${doctorId === 1 ? 'Sarah Johnson' : doctorId === 2 ? 'Michael Chen' : 'David Lee'}`,
            departmentId: doctorId <= 2 ? 1 : 2,
            departmentName: doctorId <= 2 ? 'Thần kinh' : 'Tim mạch',
            experience: 10 + (doctorId % 5),
            doctorEmail: `doctor${doctorId}@hospital.com`,
            doctorPhone: `0${900000000 + doctorId}`
          };
          
          setDoctor(mockDoctor);
        }
      } catch (error) {
        console.error('Error loading doctor:', error);
      } finally {
        setLoading(false);
      }
    };

    if (doctorId) {
      loadDoctor();
    }
  }, [doctorId]);

  
  useEffect(() => {
    const loadAvailableSlots = async () => {
      if (!selectedDate || !doctorId) return;

      setLoadingSlots(true);
      try {
        const result = await appointmentOperation.getAvailableTimeSlots(doctorId, selectedDate);
        if (result.success && result.data) {
          setAvailableTimeSlots(result.data.listOfAvailableTimeSlots);
        } else {
          setAvailableTimeSlots([]);
        }
      } catch (error) {
        console.error('Error loading time slots:', error);
        setAvailableTimeSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    };

    loadAvailableSlots();
  }, [selectedDate, doctorId]);

  
  const handleCreateAppointment = async () => {
    if (!selectedDate || !selectedTimeSlot || !doctorId) return;

    setCreatingAppointment(true);
    try {
      
      let appointmentNotes = 'Đặt lịch qua website';
      if (storedAppointmentData) {
        const symptoms = storedAppointmentData.selectedSymptoms.map(s => s.name).join(', ');
        const departments = storedAppointmentData.selectedDepartments.map(d => d.departmentName).join(', ');
        appointmentNotes = `Đặt lịch qua website
            Triệu chứng: ${symptoms}
            Chuyên khoa đã chọn: ${departments}
            Thời gian đặt lịch: ${new Date(storedAppointmentData.timestamp).toLocaleString('vi-VN')}`;
      }

      const result = await appointmentOperation.createAppointment({
        doctorId,
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        notes: appointmentNotes
      });

      if (result.success) {
        
        clearAppointmentData();
        alert('Đặt lịch thành công!');
        router.push('/'); 
      } else {
        alert(`Lỗi: ${result.message}`);
      }
    } catch (error) {
      console.error('Error creating appointment:', error);
      alert('Có lỗi xảy ra khi đặt lịch. Vui lòng thử lại.');
    } finally {
      setCreatingAppointment(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải thông tin bác sĩ...</p>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Không tìm thấy thông tin bác sĩ.</p>
          <Button onClick={() => router.back()} className="mt-4">
            Quay lại
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main content */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Doctor Info */}
        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-2xl">
                {doctor.doctorName.charAt(0)}
              </div>
            </div>
            <h2 className="text-lg font-semibold text-gray-900">
              {doctor.doctorName}
            </h2>
            <p className="text-gray-600">{doctor.departmentName}</p>

            <div className="mt-3">
              <span className="inline-block bg-green-100 text-green-700 text-sm px-3 py-1 rounded-full">
                {doctor.experience} năm kinh nghiệm
              </span>
            </div>

            <div className="mt-6 border-t pt-4 space-y-2 text-left">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Khoa</span>
                <span className="font-medium text-gray-900">
                  {doctor.departmentName}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Điện thoại</span>
                <span className="font-medium text-gray-900">
                  {doctor.doctorPhone}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Email</span>
                <span className="font-medium text-gray-900 text-xs">
                  {doctor.doctorEmail}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Date & Time */}
        <Card className="border border-gray-200 shadow-sm md:col-span-2">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="ghost"
                className="text-gray-600 flex items-center gap-2"
                onClick={() => router.back()}
              >
                <ArrowLeft className="w-4 h-4" /> Quay lại
              </Button>
              
              {!storedAppointmentData && (
                <div className="text-sm text-amber-600 bg-amber-50 px-3 py-1 rounded-lg">
                  ⚠️ Không có thông tin từ trang tìm kiếm
                </div>
              )}
            </div>


            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Select Date & Time
            </h3>

            <div className="space-y-6">
              {/* Choose Date */}
              <div>
                <h4 className="flex items-center gap-2 text-gray-700 font-medium mb-3">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  Choose Date
                </h4>

                <input
                  type="date"
                  value={selectedDate ?? ''}
                  min={AxonHealthcareUtils.formatDateForAPI(new Date())}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    setSelectedTimeSlot(null); 
                  }}
                  className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Choose Time Slot */}
              <div>
                <h4 className="flex items-center gap-2 text-gray-700 font-medium mb-3">
                  <Clock className="w-4 h-4 text-blue-600" />
                  Chọn giờ khám
                </h4>

                {loadingSlots ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Đang tải lịch trống...</p>
                  </div>
                ) : selectedDate ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {/* Hiển thị tất cả time slot từ 1-16 */}
                      {Array.from({ length: 16 }, (_, index) => index + 1).map((timeSlot) => {
                        const isAvailable = availableTimeSlots.includes(timeSlot);
                        const isSelected = selectedTimeSlot === timeSlot;
                        
                        return (
                          <button
                            key={timeSlot}
                            onClick={() => isAvailable ? setSelectedTimeSlot(timeSlot) : null}
                            disabled={!isAvailable}
                            className={cn(
                              'px-3 py-2 border rounded-lg text-sm font-medium transition relative',
                              isSelected && isAvailable
                                ? 'bg-blue-600 text-white border-blue-600'
                                : isAvailable
                                ? 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:border-blue-300'
                                : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-50'
                            )}
                          >
                            <div className="flex flex-col items-center">
                              <span className="text-xs">
                                {appointmentOperation.getTimeSlotDisplay(timeSlot)}
                              </span>
                              {/* {!isAvailable && (
                                <span className="text-xs mt-1 text-red-400 font-normal">
                                  Đã bận
                                </span>
                              )} */}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                    
                    {/* Thông tin về lịch */}
                    <div className="flex items-center justify-between text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-blue-600 rounded"></div>
                          <span>Đã chọn</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-white border border-gray-300 rounded"></div>
                          <span>Còn trống</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-gray-100 rounded"></div>
                          <span>Đã bận</span>
                        </div>
                      </div>
                      <span className="text-gray-500">
                        {availableTimeSlots.length}/16 khung giờ còn trống
                      </span>
                    </div>

                    {availableTimeSlots.length === 0 && (
                      <div className="text-center py-4 text-amber-600 bg-amber-50 rounded-lg">
                        <p className="font-medium">Không có lịch trống cho ngày này</p>
                        <p className="text-sm">Vui lòng chọn ngày khác</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>Vui lòng chọn ngày trước</p>
                  </div>
                )}
              </div>

              <div className="pt-6">
                <Button
                  onClick={handleCreateAppointment}
                  disabled={!selectedDate || !selectedTimeSlot || creatingAppointment}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
                >
                  {creatingAppointment ? 'Đang đặt lịch...' : 'Xác nhận đặt lịch'}
                </Button>
                
                {selectedDate && selectedTimeSlot && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Thông tin đặt lịch:</strong>
                    </p>
                    <p className="text-sm text-blue-700">
                      Ngày: {new Date(selectedDate).toLocaleDateString('vi-VN')}
                    </p>
                    <p className="text-sm text-blue-700">
                      Giờ: {appointmentOperation.getTimeSlotDisplay(selectedTimeSlot)}
                    </p>
                    <p className="text-sm text-blue-700">
                      Bác sĩ: {doctor.doctorName}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
