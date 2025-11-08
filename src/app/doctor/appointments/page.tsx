'use client';

import { useEffect, useState } from 'react';
import { useSession } from '@/context/Sessioncontext';
import { useRouter } from 'next/navigation';
import { Phone, UserCircle, Calendar } from 'lucide-react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';
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

export default function DoctorAppointments() {
  const { session } = useSession();
  const router = useRouter();
  const [appointments, setAppointments] = useState<DoctorAppointmentDTO[]>([]);
  const [loading, setLoading] = useState(true);
  
  
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [showAll, setShowAll] = useState<boolean>(false);
  
  
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setStartDate(today);
    setEndDate(today);
  }, []);

  
  useEffect(() => {
    if (!session?.id) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        
        const apiResult = await appointmentOperation.getDoctorAppointments();
        
        if (apiResult.success && apiResult.data) {
          console.log('API result:', apiResult);
          
          const filteredAppointments: DoctorAppointmentDTO[] = apiResult.data
            .filter(apt => {
              
              if (showAll) return true;
              
              
              if (!startDate || !endDate) return true;
              
              console.log('Checking appointment date:', apt.appointmentDate);
              console.log('Start Date:', startDate, 'End Date:', endDate);
              const aptDate = apt.appointmentDate;
              return aptDate >= startDate && aptDate <= endDate;
            })
            .map(apt => {
              console.log('Processing appointment:', apt);
              
              const timeRange = appointmentOperation.getTimeSlotDisplay(apt.timeSlot);
              const [startTime, endTime] = timeRange.split('-');
              
              let statusText = 'Không xác định';
              switch (apt.status) {
                case 'SCHEDULED':
                  statusText = 'Sắp tới';
                  break;
                case 'COMPLETED':
                  statusText = 'Hoàn thành';
                  break;
                case 'CANCELLED':
                  statusText = 'Đã hủy';
                  break;
              }
              
              return {
                appointmentId: apt.appointmentId,
                startTime: startTime,
                endTime: endTime,
                status: statusText,
                notes: 'Thông tin chi tiết có trong hệ thống quản lý', 
                patient: {
                  id: apt.appointmentId, 
                  name: `Bệnh nhân #${apt.appointmentId}`, 
                  phone: '--- --- ---', 
                  gender: 'Không xác định', 
                },
              };
            });
          console.log('Filtered Appointments:', filteredAppointments);
          setAppointments(filteredAppointments);
        } else {
          
          setAppointments([]);
        }
      } catch (error) {
        console.error('Error fetching today appointments:', error);
        setAppointments([]); 
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session?.id, startDate, endDate, showAll]);

  
  const setToday = () => {
    const today = new Date().toISOString().split('T')[0];
    setStartDate(today);
    setEndDate(today);
    setShowAll(false);
  };

  
  const showAllAppointments = () => {
    setShowAll(true);
    
    setStartDate('');
    setEndDate('');
  };

  if (loading) return <div>Đang tải dữ liệu...</div>;

  return (
    <>
      {/* Date Range Picker */}
      <Card className="shadow-sm border border-gray-200 mb-6">
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Chọn khoảng thời gian
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Từ ngày:</label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setShowAll(false);
                }}
                className="w-auto"
                disabled={showAll}
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Đến ngày:</label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setShowAll(false);
                }}
                className="w-auto"
                disabled={showAll}
              />
            </div>
            <Button 
              onClick={setToday}
              variant={showAll ? "outline" : "default"}
              className="flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              Hôm nay
            </Button>
            <Button 
              onClick={showAllAppointments}
              variant={showAll ? "default" : "outline"}
              className="flex items-center gap-2"
            >
              Tất cả
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Danh sách lịch hẹn */}
      <Card className="shadow-sm border border-gray-200">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Lịch hẹn ({appointments.length})
            {showAll ? (
              <span className="text-sm font-normal text-gray-500 ml-2">
                - Tất cả
              </span>
            ) : startDate === endDate ? (
              <span className="text-sm font-normal text-gray-500 ml-2">
                - {new Date(startDate).toLocaleDateString('vi-VN')}
              </span>
            ) : (
              <span className="text-sm font-normal text-gray-500 ml-2">
                - {new Date(startDate).toLocaleDateString('vi-VN')} đến {new Date(endDate).toLocaleDateString('vi-VN')}
              </span>
            )}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {appointments.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              {showAll ? 'Không có lịch hẹn nào' : 'Không có lịch hẹn nào trong khoảng thời gian này'}
            </div>
          ) : (
            appointments.map((apm) => (
              <AppointmentItem
                key={apm.appointmentId}
                patient={apm.patient}
                time={`${apm.startTime} - ${apm.endTime}`}
                notes={apm.notes}
                status={apm.status}
              />
            ))
          )}
        </CardContent>
      </Card>
    </>
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
  
  const shouldShowPhone = patient.phone && patient.phone !== '--- --- ---';
  
  
  const getBadgeColor = (status: string) => {
    switch (status) {
      case 'Sắp tới':
        return 'bg-green-100 text-green-700 border border-green-300';
      case 'Hoàn thành':
        return 'bg-blue-100 text-blue-700 border border-blue-300';
      case 'Đã hủy':
        return 'bg-red-100 text-red-700 border border-red-300';
      default:
        return 'bg-gray-100 text-gray-700 border border-gray-300';
    }
  };
  
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

      <Badge className={getBadgeColor(status)}>
        {status}
      </Badge>
    </div>
  );
}
