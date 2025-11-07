'use client';

import { useState, useEffect } from 'react';
import { Info, Clock, AlertTriangle, Stethoscope } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useSearchParams, useRouter } from 'next/navigation';
import SymptomAutocomplete from '@/components/widgets/SymptomAutocomplete';
import { 
  symptomDepartmentOperation, 
  doctorOperation 
} from '@/lib/BE-library/main';
import { 
  SymptomResponse, 
  DepartmentSuggestionResponse, 
  DoctorResponse 
} from '@/lib/BE-library/interfaces';
import { saveAppointmentData, AppointmentData } from '@/lib/appointment-storage';

export default function FindPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedSymptoms, setSelectedSymptoms] = useState<SymptomResponse[]>([]);
  const [departments, setDepartments] = useState<DepartmentSuggestionResponse[]>([]);
  const [doctors, setDoctors] = useState<DoctorResponse[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [allSymptoms, setAllSymptoms] = useState<SymptomResponse[]>([]);
  const [selectedDepartments, setSelectedDepartments] = useState<DepartmentSuggestionResponse[]>([]);

  useEffect(() => {
    const loadSymptomsFromURL = async () => {
      const query = searchParams.get('q');
      if (!query) return;

      try {
        const result = await symptomDepartmentOperation.getAllSymptoms();
        console.log('All symptoms loaded for URL parsing:', result);
        if (result.success && result.data) {
          setAllSymptoms(result.data);

          const queryIds = query
            .split(',')
            .map((id) => parseInt(id.trim(), 10))
            .filter((id) => !isNaN(id));

          const matchedSymptoms = result.data.filter((symptom) =>
            queryIds.includes(symptom.id)
          );
          console.log('Matched symptoms from URL IDs:', matchedSymptoms);
          if (matchedSymptoms.length > 0) {
            setSelectedSymptoms(matchedSymptoms);
            await performSearch(matchedSymptoms);
          }
        }
      } catch (error) {
        console.error('Error loading symptoms from URL:', error);
      }
    };

    loadSymptomsFromURL();
  }, [searchParams]);

  const performSearch = async (symptoms: SymptomResponse[]) => {
    if (symptoms.length === 0) return;

    setLoading(true);
    setSearched(true);

    try {
      const symptomIds = symptoms.map((symptom) => symptom.id);
      const departmentResult =
        await symptomDepartmentOperation.suggestDepartmentBySymptoms({
          symptomIds,
        });
      
      if (departmentResult.success && departmentResult.data) {
        setDepartments(departmentResult.data);
        setDoctors([]);
        setSelectedDepartments([]);
      } else {
        setDepartments([]);
        setDoctors([]);
        setSelectedDepartments([]);
      }
    } catch (error) {
      console.error('Error searching:', error);
      setDepartments([]);
      setDoctors([]);
      setSelectedDepartments([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleDepartmentSelection = async (
    department: DepartmentSuggestionResponse
  ) => {
    const isSelected = selectedDepartments.some(
      (d) => d.departmentId === department.departmentId
    );

    let newSelectedDepartments: DepartmentSuggestionResponse[];
    if (isSelected) {
      newSelectedDepartments = selectedDepartments.filter(
        (d) => d.departmentId !== department.departmentId
      );
    } else {
      newSelectedDepartments = [...selectedDepartments, department];
    }

    setSelectedDepartments(newSelectedDepartments);

    if (newSelectedDepartments.length > 0) {
      setLoadingDoctors(true);
      try {
        const allDoctors: DoctorResponse[] = [];
        for (const dept of newSelectedDepartments) {
          const doctorResult = await doctorOperation.getDoctorsByDepartment(
            dept.departmentId
          );
          if (doctorResult.success && doctorResult.data) {
            allDoctors.push(...doctorResult.data);
          }
        }
        setDoctors(allDoctors);
      } catch (error) {
        console.error('Error loading doctors:', error);
        setDoctors([]);
      } finally {
        setLoadingDoctors(false);
      }
    } else {
      setDoctors([]);
    }
  };

  const handleSearch = async () => {
    await performSearch(selectedSymptoms);

    if (selectedSymptoms.length > 0) {
      const symptomIds = selectedSymptoms.map((s) => s.id).join(',');
      const params = new URLSearchParams();
      params.set('q', symptomIds);
      router.replace(`/find?${params.toString()}`, { scroll: false });
    }
  };

  const handleSymptomChange = (symptoms: SymptomResponse[]) => {
    setSelectedSymptoms(symptoms);

    if (symptoms.length === 0) {
      setSearched(false);
      setDepartments([]);
      setDoctors([]);
      setSelectedDepartments([]);
      router.replace('/find', { scroll: false });
    }
  };

  const handleBookAppointment = (doctor: DoctorResponse) => {
    // Lưu thông tin đã chọn vào localStorage
    const appointmentData: AppointmentData = {
      selectedSymptoms: selectedSymptoms,
      selectedDepartments: selectedDepartments,
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
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
        {/* Khu vực tìm kiếm */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Tìm bác sĩ theo triệu chứng
          </h2>
          <p className="text-gray-600 mb-4">
            Chọn các triệu chứng của bạn và chúng tôi sẽ gợi ý chuyên khoa phù hợp.
          </p>

          <div className="flex gap-2">
            <div className="flex items-center flex-1 bg-gray-50 rounded-md px-3 border">
              <SymptomAutocomplete
                value={selectedSymptoms}
                onSelectionChange={handleSymptomChange}
                placeholder="Chọn triệu chứng của bạn..."
              />
            </div>
            <Button
              onClick={handleSearch}
              disabled={selectedSymptoms.length === 0 || loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? 'Đang tìm...' : 'Tìm kiếm'}
            </Button>
          </div>
        </Card>

        {/* Khi chưa tìm kiếm */}
        {!searched && !loading && (
          <Card className="p-10 bg-white border border-gray-200 text-center">
            <div className="flex flex-col items-center space-y-3">
              <Stethoscope className="h-10 w-10 text-blue-500" />
              <h3 className="text-lg font-semibold text-gray-900">
                Bắt đầu tìm kiếm
              </h3>
              <p className="text-gray-600 max-w-md">
                Chọn triệu chứng của bạn phía trên để tìm bác sĩ phù hợp.
              </p>
            </div>
          </Card>
        )}

        {/* Loading state */}
        {loading && (
          <Card className="p-10 bg-white border border-gray-200 text-center">
            <div className="flex flex-col items-center space-y-3">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
              <h3 className="text-lg font-semibold text-gray-900">
                Đang tìm kiếm...
              </h3>
              <p className="text-gray-600 max-w-md">
                Chúng tôi đang phân tích triệu chứng và tìm bác sĩ phù hợp cho bạn.
              </p>
            </div>
          </Card>
        )}

        {/* Không tìm thấy kết quả */}
        {searched &&
          departments.length === 0 &&
          doctors.length === 0 &&
          !loading && (
            <Card className="p-6 bg-yellow-50 border border-yellow-200 flex items-start gap-3">
              <AlertTriangle className="h-6 w-6 text-yellow-600 mt-1" />
              <div>
                <h3 className="font-semibold text-yellow-800 mb-1">
                  Không tìm thấy chuyên khoa cụ thể
                </h3>
                <p className="text-yellow-700">
                  Chúng tôi khuyến nghị bạn nên gặp <b>bác sĩ đa khoa</b> để được
                  thăm khám ban đầu và tư vấn chuyên khoa phù hợp nếu cần.
                </p>
              </div>
            </Card>
          )}

        {/* Chuyên khoa gợi ý */}
        {departments.length > 0 && (
          <Card className="p-6 bg-blue-50 border border-blue-200">
            <div className="flex items-start gap-3">
              <Info className="h-6 w-6 text-blue-600 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Chuyên khoa được gợi ý
                </h3>
                <p className="text-gray-600 mb-3">
                  Dựa trên triệu chứng của bạn, chúng tôi khuyến nghị bạn nên khám tại.
                  Hãy chọn một hoặc nhiều chuyên khoa để xem danh sách bác sĩ:
                </p>
                <div className="flex gap-2 flex-wrap items-center">
                  {departments.map((dept) => {
                    const isSelected = selectedDepartments.some(
                      (d) => d.departmentId === dept.departmentId
                    );
                    return (
                      <button
                        key={dept.departmentId}
                        onClick={() => toggleDepartmentSelection(dept)}
                        className={`text-sm px-3 py-1 rounded-full border transition-colors ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white text-blue-600 border-blue-600 hover:bg-blue-50'
                        }`}
                      >
                        {dept.departmentName}
                      </button>
                    );
                  })}
                  {selectedDepartments.length > 0 && (
                    <button
                      onClick={() => {
                        setSelectedDepartments([]);
                        setDoctors([]);
                      }}
                      className="text-sm px-3 py-1 rounded-full border border-gray-300 bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors ml-2"
                    >
                      Bỏ chọn tất cả
                    </button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Loading doctors */}
        {loadingDoctors && selectedDepartments.length > 0 && (
          <Card className="p-10 bg-white border border-gray-200 text-center">
            <div className="flex flex-col items-center space-y-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <h3 className="text-lg font-semibold text-gray-900">
                Đang tải bác sĩ...
              </h3>
              <p className="text-gray-600 max-w-md">
                Đang tìm bác sĩ trong{' '}
                {selectedDepartments.length > 1 ? 'các khoa' : 'khoa'}:{' '}
                {selectedDepartments.map((d) => d.departmentName).join(', ')}
              </p>
            </div>
          </Card>
        )}

        {/* Danh sách bác sĩ phù hợp */}
        {doctors.length > 0 &&
          selectedDepartments.length > 0 &&
          !loadingDoctors && (
            <div>
              <h3 className="text-lg font-semibold mb-2">
                {selectedDepartments.length > 1
                  ? `Bác sĩ từ ${selectedDepartments.length} chuyên khoa`
                  : `Bác sĩ khoa ${selectedDepartments[0].departmentName}`}
              </h3>
              <p className="text-gray-500 mb-2">
                Có {doctors.length} bác sĩ phù hợp từ{' '}
                {selectedDepartments.length > 1 ? 'các khoa' : 'khoa'}:{' '}
              </p>
              <p className="text-gray-500 mb-6">
                {selectedDepartments.map((d) => d.departmentName).join(', ')}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {doctors.map((doctor) => (
                  <Card
                    key={doctor.id}
                    className="border border-gray-200 hover:shadow-lg"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                          {doctor.doctorName.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">
                            {doctor.doctorName}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">
                            {doctor.departmentName}
                          </p>
                          <div className="flex items-center gap-3 text-sm text-gray-500">
                            <span className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {doctor.experience} năm kinh nghiệm
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-4 pt-4 border-t">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          <span className="text-sm text-green-600 font-medium">
                            Có sẵn
                          </span>
                        </div>
                        <div className="text-sm text-gray-500">
                          {doctor.doctorPhone}
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
            </div>
          )}

        {/* Không có bác sĩ */}
        {selectedDepartments.length > 0 &&
          doctors.length === 0 &&
          !loadingDoctors && (
            <Card className="p-6 bg-yellow-50 border border-yellow-200 flex items-start gap-3">
              <AlertTriangle className="h-6 w-6 text-yellow-600 mt-1" />
              <div>
                <h3 className="font-semibold text-yellow-800 mb-1">
                  Không có bác sĩ khả dụng
                </h3>
                <p className="text-yellow-700">
                  Hiện tại không có bác sĩ nào trong{' '}
                  {selectedDepartments.length > 1 ? 'các khoa' : 'khoa'}:{' '}
                  <b>
                    {selectedDepartments
                      .map((d) => d.departmentName)
                      .join(', ')}
                  </b>
                  . Vui lòng thử chọn chuyên khoa khác hoặc liên hệ để được hỗ
                  trợ.
                </p>
              </div>
            </Card>
          )}
      </div>
    </div>
  );
}
