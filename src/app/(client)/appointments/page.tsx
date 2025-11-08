'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Clock, User, Phone, Mail, AlertCircle, CheckCircle, XCircle, ChevronLeft, ChevronRight, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { appointmentOperation } from '@/lib/BE-library/main';
import { PatientAppointmentResponse } from '@/lib/BE-library/interfaces';

interface AppointmentCardProps {
  appointment: PatientAppointmentResponse;
  onCancel: (appointmentId: number) => void;
  isLoading: boolean;
}

const AppointmentCard = ({ appointment, onCancel, isLoading }: AppointmentCardProps) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SCHEDULED':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Đã đặt lịch</Badge>;
      case 'COMPLETED':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Hoàn thành</Badge>;
      case 'CANCELLED':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Đã hủy</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SCHEDULED':
        return <Clock className="w-4 h-4 text-blue-600" />;
      case 'COMPLETED':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'CANCELLED':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
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
  const canCancel = appointment.status === 'SCHEDULED' && new Date(appointment.appointmentDate) > new Date();

  return (
    <Card className="mb-4 hover:shadow-md transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            {getStatusIcon(appointment.status)}
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900">
                Cuộc hẹn với {appointment.doctorName}
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Khoa {appointment.departmentName}
              </p>
            </div>
          </div>
          {getStatusBadge(appointment.status)}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
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
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <User className="w-4 h-4 text-gray-500" />
              <div>
                <p className="font-medium text-gray-900">Mã cuộc hẹn</p>
                <p className="text-gray-600">#{appointment.appointmentId}</p>
              </div>
            </div>
            
            {canCancel && (
              <div className="pt-2 space-y-2">
                <Link href={`/appointments/${appointment.appointmentId}`} className="block">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-blue-600 border-blue-200 hover:bg-blue-50 hover:border-blue-300 w-full"
                    disabled={isLoading}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Dời lịch hẹn
                  </Button>
                </Link>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 w-full"
                      disabled={isLoading}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Hủy lịch hẹn
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Xác nhận hủy lịch hẹn</AlertDialogTitle>
                      <AlertDialogDescription>
                        Bạn có chắc chắn muốn hủy cuộc hẹn với {appointment.doctorName} 
                        vào ngày {formatDate(appointment.appointmentDate)} 
                        lúc {appointmentOperation.getTimeSlotDisplay(appointment.timeSlot)}?
                        
                        <br /><br />
                        <strong>Lưu ý:</strong> Hành động này không thể hoàn tác.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Giữ lại</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => onCancel(appointment.appointmentId)}
                        className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                      >
                        Xác nhận hủy
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function AppointmentHistoryPage() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<PatientAppointmentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<number | null>(null);
  const [filter, setFilter] = useState<'ALL' | 'SCHEDULED' | 'COMPLETED' | 'CANCELLED'>('ALL');
  
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2; 

  
  useEffect(() => {
    const loadAppointments = async () => {
      try {
        setLoading(true);
        const result = await appointmentOperation.getPatientAppointments();
        
        if (result.success && result.data) {
          
          const sortedAppointments = result.data.sort((a, b) => 
            new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime()
          );
          setAppointments(sortedAppointments);
        } else {
          console.error('Failed to load appointments:', result.message);
        }
      } catch (error) {
        console.error('Error loading appointments:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAppointments();
  }, []);

  
  const handleCancelAppointment = async (appointmentId: number) => {
    try {
      setCancellingId(appointmentId);
      const result = await appointmentOperation.cancelAppointment(appointmentId);
      
      if (result.success) {
        
        setAppointments(prevAppointments =>
          prevAppointments.map(appointment =>
            appointment.appointmentId === appointmentId
              ? { ...appointment, status: 'CANCELLED' as const }
              : appointment
          )
        );
        alert('Hủy lịch hẹn thành công!');
      } else {
        alert(`Lỗi: ${result.message}`);
      }
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      alert('Có lỗi xảy ra khi hủy lịch hẹn. Vui lòng thử lại.');
    } finally {
      setCancellingId(null);
    }
  };



  // Filter appointments
  const filteredAppointments = appointments.filter(appointment => {
    if (filter === 'ALL') return true;
    return appointment.status === filter;
  });

  
  const statusCounts = {
    ALL: appointments.length,
    SCHEDULED: appointments.filter(a => a.status === 'SCHEDULED').length,
    COMPLETED: appointments.filter(a => a.status === 'COMPLETED').length,
    CANCELLED: appointments.filter(a => a.status === 'CANCELLED').length,
  };

  
  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAppointments = filteredAppointments.slice(startIndex, endIndex);

  
  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải lịch sử cuộc hẹn...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Lịch sử cuộc hẹn</h1>
            <Button
              onClick={() => router.push('/')}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              Đặt lịch mới
            </Button>
          </div>
          
          <p className="text-gray-600">
            Quản lý và theo dõi tất cả các cuộc hẹn của bạn
          </p>
        </div>

        {/* Filter tabs */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            {[
              { key: 'ALL', label: 'Tất cả', count: statusCounts.ALL },
              { key: 'SCHEDULED', label: 'Đã đặt', count: statusCounts.SCHEDULED },
              { key: 'COMPLETED', label: 'Hoàn thành', count: statusCounts.COMPLETED },
              { key: 'CANCELLED', label: 'Đã hủy', count: statusCounts.CANCELLED },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key as any)}
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                  filter === tab.key
                    ? 'bg-white text-blue-700 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>

        {/* Appointments list */}
        {filteredAppointments.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {filter === 'ALL' 
                  ? 'Chưa có cuộc hẹn nào' 
                  : `Không có cuộc hẹn ${filter === 'SCHEDULED' ? 'đã đặt' : filter === 'COMPLETED' ? 'hoàn thành' : 'đã hủy'}`
                }
              </h3>
              <p className="text-gray-600 mb-6">
                {filter === 'ALL' 
                  ? 'Bạn chưa có cuộc hẹn nào. Hãy đặt lịch khám bệnh đầu tiên của bạn!'
                  : 'Thử chọn bộ lọc khác để xem các cuộc hẹn.'
                }
              </p>
              {filter === 'ALL' && (
                <Button onClick={() => router.push('/')}>
                  Đặt lịch khám ngay
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div>
            {currentAppointments.map((appointment) => (
              <AppointmentCard
                key={appointment.appointmentId}
                appointment={appointment}
                onCancel={handleCancelAppointment}
                isLoading={cancellingId === appointment.appointmentId}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {filteredAppointments.length > itemsPerPage && (
          <div className="mt-8">
            <div className="flex items-center justify-between">
              {/* Pagination info */}
              <div className="text-sm text-gray-700">
                Hiển thị {startIndex + 1}-{Math.min(endIndex, filteredAppointments.length)} của {filteredAppointments.length} cuộc hẹn
              </div>

              {/* Pagination controls */}
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Trước
                </Button>

                {/* Page numbers */}
                <div className="flex items-center space-x-1">
                  {Array.from({ length: totalPages }, (_, index) => {
                    const pageNumber = index + 1;
                    const isCurrentPage = pageNumber === currentPage;
                    
                    
                    const shouldShow = 
                      pageNumber === 1 ||
                      pageNumber === totalPages ||
                      (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1);

                    if (!shouldShow) {
                      
                      if (pageNumber === currentPage - 2 || pageNumber === currentPage + 2) {
                        return (
                          <span key={pageNumber} className="px-2 py-1 text-gray-500">
                            ...
                          </span>
                        );
                      }
                      return null;
                    }

                    return (
                      <Button
                        key={pageNumber}
                        variant={isCurrentPage ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(pageNumber)}
                        className={`min-w-[36px] ${
                          isCurrentPage 
                            ? "bg-blue-600 text-white hover:bg-blue-700" 
                            : "hover:bg-gray-50"
                        }`}
                      >
                        {pageNumber}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-2"
                >
                  Sau
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Summary */}
        {appointments.length > 0 && (
          <div className="mt-6 text-center text-sm text-gray-500">
            Tổng cộng {appointments.length} cuộc hẹn
            {filteredAppointments.length > itemsPerPage && (
              <span className="ml-2">• Trang {currentPage} của {totalPages}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
