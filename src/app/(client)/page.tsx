'use client';

import { Clock, Calendar, Search, Plus, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { useState, useEffect } from 'react';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import SymptomAutocomplete from '@/components/widgets/SymptomAutocomplete';
import { SymptomResponse, DoctorResponse } from '@/lib/BE-library/interfaces';
import { doctorOperation } from '@/lib/BE-library/main';
import { saveAppointmentData, AppointmentData } from '@/lib/appointment-storage';

// Department mapping để map với departmentId từ API
const departmentMap: { [key: string]: number } = {
  'Tất cả': 0, // 0 để lấy tất cả
  'Thần kinh': 1,
  'Tiêu hoá': 2,
  'Tim mạch': 3,
  'Nội khoa': 4,
  'Ngoại khoa': 5,
  'Da liễu': 6,
  'Tai mũi họng': 7,
  'Mắt': 8,
};

export default function Home() {
  const router = useRouter();
  const [selectedSymptoms, setSelectedSymptoms] = useState<SymptomResponse[]>([]);
  const [department, setDepartment] = useState('Tất cả');
  const [page, setPage] = useState(1);
  const [doctors, setDoctors] = useState<DoctorResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const perPage = 9;

  // Lấy danh sách bác sĩ từ API
  const fetchDoctors = async (selectedDepartment: string = 'Tất cả') => {
    setLoading(true);
    setError(null);
    
    try {
      // Nếu chọn "Tất cả", lấy tất cả bác sĩ bằng cách gọi API cho từng department
      if (selectedDepartment === 'Tất cả') {
        const allDoctors: DoctorResponse[] = [];
        
        // Lấy bác sĩ từ tất cả các chuyên khoa
        for (let departmentId = 1; departmentId <= 8; departmentId++) {
          const response = await doctorOperation.getDoctorsByDepartment(departmentId);
          if (response.success && response.data) {
            allDoctors.push(...response.data);
          }
        }
        
        setDoctors(allDoctors);
      } else {
        // Lấy bác sĩ theo chuyên khoa cụ thể
        const departmentId = departmentMap[selectedDepartment];
        if (departmentId) {
          const response = await doctorOperation.getDoctorsByDepartment(departmentId);
          if (response.success && response.data) {
            setDoctors(response.data);
          } else {
            setError(response.message || 'Không thể tải danh sách bác sĩ');
            setDoctors([]);
          }
        }
      }
    } catch (err) {
      setError('Có lỗi xảy ra khi tải danh sách bác sĩ');
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  // Lấy danh sách bác sĩ khi component mount và khi department thay đổi
  useEffect(() => {
    fetchDoctors(department);
  }, [department]);

  const handleSearch = () => {
    if (selectedSymptoms.length === 0) return;
    const symptomIds = selectedSymptoms.map(s => s.id).join(',');
    router.push(`/find?q=${encodeURIComponent(symptomIds)}`);
  };

  const handleSymptomSelection = (symptoms: SymptomResponse[]) => {
    setSelectedSymptoms(symptoms);
  };

  const handleDepartmentChange = (value: string) => {
    setDepartment(value);
    setPage(1); // Reset về trang đầu khi thay đổi department
  };

  // Phân trang
  const totalPages = Math.ceil(doctors.length / perPage);
  const startIndex = (page - 1) * perPage;
  const paginatedDoctors = doctors.slice(startIndex, startIndex + perPage);

  // Hàm tạo URL ảnh mặc định cho bác sĩ
  const getDefaultDoctorImage = (doctorId: number) => {
    const images = [
      'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
      'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
      'https://images.pexels.com/photos/5214959/pexels-photo-5214959.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
      'https://images.pexels.com/photos/8460157/pexels-photo-8460157.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
      'https://images.pexels.com/photos/8460158/pexels-photo-8460158.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
    ];
    return images[doctorId % images.length];
  };

  // Hàm xử lý đặt lịch khám
  const handleBookAppointment = (doctor: DoctorResponse) => {
    // Lưu thông tin đã chọn vào localStorage
    const appointmentData: AppointmentData = {
      selectedSymptoms: selectedSymptoms, // Từ tìm kiếm triệu chứng
      selectedDepartments: [], // Trang này không có selected departments
      selectedDoctor: doctor,
      timestamp: new Date().toISOString(),
    };

    const success = saveAppointmentData(appointmentData);
    
    if (success) {
      // Chuyển hướng đến trang đặt lịch
      router.push(`/book/${doctor.id}`);
    } else {
      // Hiển thị thông báo lỗi hoặc xử lý lỗi
      console.error('Failed to save appointment data');
      // Vẫn chuyển hướng nhưng không có dữ liệu được lưu
      router.push(`/book/${doctor.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HERO SECTION */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Sức khỏe của bạn – Ưu tiên hàng đầu của chúng tôi
          </h1>
          <p className="text-lg md:text-xl mb-8 text-blue-100">
            Đặt lịch với bác sĩ hàng đầu dựa trên triệu chứng của bạn. Chăm sóc
            sức khỏe chất lượng ngay trong tầm tay.
          </p>

          <div className="max-w-2xl mx-auto">
            <div className="flex gap-3">
              <div className="bg-white rounded-lg p-3 shadow-lg flex-1">
                <div className="flex items-start px-2">
                  <SymptomAutocomplete
                    onSelectionChange={handleSymptomSelection}
                    placeholder="Nhập triệu chứng của bạn (ví dụ: đau đầu, sốt...)"
                  />
                </div>
              </div>
              <Button
                onClick={handleSearch}
                disabled={selectedSymptoms.length === 0}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 h-fit min-h-[56px] self-start disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                Tìm kiếm
              </Button>
            </div>
            {selectedSymptoms.length > 0 && (
              <div className="mt-3 text-center">
                <p className="text-sm text-blue-100">
                  Đã chọn {selectedSymptoms.length} triệu chứng: {selectedSymptoms.map(s => s.name).join(', ')}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* QUICK ACTIONS SECTION */}
      <section className="max-w-7xl mx-auto px-4 py-8 -mt-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow cursor-pointer" onClick={() => router.push('/appointments')}>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Lịch hẹn của tôi</h3>
              <p className="text-sm text-gray-600">Xem và quản lý các cuộc hẹn đã đặt</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow cursor-pointer" onClick={() => router.push('/find')}>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Tìm bác sĩ</h3>
              <p className="text-sm text-gray-600">Tìm kiếm bác sĩ phù hợp với triệu chứng</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow cursor-pointer" onClick={() => router.push('/find')}>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Đặt lịch nhanh</h3>
              <p className="text-sm text-gray-600">Đặt lịch khám bệnh nhanh chóng</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* DOCTOR SECTION */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Danh sách bác sĩ
            </h2>
            <p className="text-gray-600">
              Gặp gỡ đội ngũ bác sĩ hàng đầu, giàu kinh nghiệm
            </p>
          </div>

          {/* Dropdown chọn chuyên khoa */}
          <Select
            onValueChange={handleDepartmentChange}
            defaultValue="Tất cả"
          >
            <SelectTrigger className="w-48 bg-white text-gray-800">
              <SelectValue placeholder="Chọn chuyên khoa" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Tất cả">Tất cả</SelectItem>
              <SelectItem value="Thần kinh">Thần kinh</SelectItem>
              <SelectItem value="Tiêu hoá">Tiêu hoá</SelectItem>
              <SelectItem value="Tim mạch">Tim mạch</SelectItem>
              <SelectItem value="Nội khoa">Nội khoa</SelectItem>
              <SelectItem value="Ngoại khoa">Ngoại khoa</SelectItem>
              <SelectItem value="Da liễu">Da liễu</SelectItem>
              <SelectItem value="Tai mũi họng">Tai mũi họng</SelectItem>
              <SelectItem value="Mắt">Mắt</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Danh sách bác sĩ */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="border border-gray-200">
                <CardContent className="p-6">
                  <div className="animate-pulse">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-300 rounded mb-2"></div>
                        <div className="h-3 bg-gray-300 rounded mb-2 w-2/3"></div>
                        <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                      </div>
                    </div>
                    <div className="h-10 bg-gray-300 rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">{error}</p>
            <Button 
              onClick={() => fetchDoctors(department)}
              variant="outline"
            >
              Thử lại
            </Button>
          </div>
        ) : paginatedDoctors.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">Không tìm thấy bác sĩ nào trong chuyên khoa này.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedDoctors.map((doctor) => (
              <Card
                key={doctor.id}
                className="border border-gray-200 hover:shadow-xl transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <img
                      src={getDefaultDoctorImage(doctor.id)}
                      alt={doctor.doctorName}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        BS. {doctor.doctorName}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {doctor.departmentName}
                      </p>
                      <div className="flex items-center gap-3 text-sm">
                        <span className="flex items-center text-gray-500">
                          <Clock className="h-3 w-3 mr-1" />
                          {doctor.experience > 0 ? `${doctor.experience} năm kinh nghiệm` : 'Bác sĩ trẻ'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        <span className="text-xs text-gray-600">
                          {(4.5 + Math.random() * 0.4).toFixed(1)} ({Math.floor(Math.random() * 50) + 20} đánh giá)
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs text-gray-600 mb-4 border-t pt-4">
                    <div className="flex justify-between">
                      <span>Email:</span>
                      <span className="text-gray-800">{doctor.doctorEmail}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Điện thoại:</span>
                      <span className="text-gray-800">{doctor.doctorPhone}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span className="text-sm text-green-600 font-medium">
                        Có sẵn
                      </span>
                    </div>
                  </div>

                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => handleBookAppointment(doctor)}
                  >
                    Đặt lịch khám
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Phân trang */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-8">
            <Button
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Trước
            </Button>
            <span className="text-gray-700">
              Trang {page} / {totalPages}
            </span>
            <Button
              variant="outline"
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              Sau
            </Button>
          </div>
        )}
      </section>

      {/* CTA SECTION */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Sẵn sàng bắt đầu chưa?
          </h2>
          <p className="text-gray-600 mb-8">
            Tìm bác sĩ phù hợp với triệu chứng của bạn và đặt lịch ngay hôm nay.
            Dịch vụ y tế chất lượng chỉ cách bạn một cú nhấp chuột.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white px-8"
              onClick={() => router.push('/find')}
            >
              Tìm bác sĩ
            </Button>

            <Button
              variant="outline"
              className="border-gray-300 bg-white hover:bg-gray-50"
              onClick={() => router.push('/appointments')}
            >
              Xem lịch hẹn của tôi
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
