'use client';

import { useState, useEffect } from 'react';
import { Search, Info, Clock, AlertTriangle, Stethoscope } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSession } from '@/context/Sessioncontext'; // 👈 thêm vào

const doctors = [
  {
    id: 1,
    name: 'BS. Sarah Johnson',
    specialty: 'Thần kinh',
    rating: 4.8,
    experience: '12 năm kinh nghiệm',
    price: 150000,
    image:
      'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
  },
  {
    id: 2,
    name: 'BS. James Anderson',
    specialty: 'Đa khoa',
    rating: 4.6,
    experience: '10 năm kinh nghiệm',
    price: 100000,
    image:
      'https://images.pexels.com/photos/8460151/pexels-photo-8460151.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
  },
  {
    id: 3,
    name: 'BS. Michael Chen',
    specialty: 'Tiêu hoá',
    rating: 4.9,
    experience: '15 năm kinh nghiệm',
    price: 175000,
    image:
      'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
  },
  {
    id: 4,
    name: 'BS. Emily Nguyen',
    specialty: 'Tim mạch',
    rating: 4.7,
    experience: '11 năm kinh nghiệm',
    price: 180000,
    image:
      'https://images.pexels.com/photos/5214959/pexels-photo-5214959.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
  },
];

export default function FindPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  const { session } = useSession(); // 👈 lấy thông tin session
  const isLoggedIn = !!session; // true nếu đã login

  const [symptoms, setSymptoms] = useState(query);
  const [departments, setDepartments] = useState<string[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<typeof doctors>([]);
  const [searched, setSearched] = useState(false);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const suggestions = [
    'Đau đầu',
    'Sốt',
    'Đau bụng',
    'Đau ngực',
    'Mệt mỏi',
    'Buồn nôn',
    'Đau lưng',
  ];

  const departmentsMap: Record<string, string[]> = {
    'Đau đầu': ['Thần kinh'],
    Sốt: ['Đa khoa'],
    'Đau bụng': ['Tiêu hoá'],
    'Đau ngực': ['Tim mạch'],
    'Mệt mỏi': ['Đa khoa'],
    'Buồn nôn': ['Tiêu hoá'],
    'Đau lưng': ['Cơ xương khớp'],
  };

  const filteredSuggestions = suggestions.filter((s) =>
    s.toLowerCase().includes(symptoms.toLowerCase())
  );

  const handleSelectSymptom = (label: string) => {
    if (!selectedSymptoms.includes(label)) {
      setSelectedSymptoms([...selectedSymptoms, label]);
    }
    setSymptoms('');
    setShowDropdown(false);
  };

  const removeSymptom = (label: string) => {
    setSelectedSymptoms(selectedSymptoms.filter((s) => s !== label));
  };

  useEffect(() => {
    if (query) {
      const querySymptoms = query
        .split(/[,]+/)
        .map((q) => q.trim())
        .filter((q) => q);

      const validMatches = querySymptoms.filter((q) =>
        suggestions.some((s) => s.toLowerCase() === q.toLowerCase())
      );

      if (validMatches.length > 0) {
        setSelectedSymptoms(validMatches);
        setSymptoms('');
        setSearched(false);
        setTimeout(() => handleSearch(validMatches), 0);
      } else {
        setSymptoms(query);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const handleSearch = (overrideSymptoms?: string[]) => {
    const usedSymptoms = overrideSymptoms || selectedSymptoms;
    const matchedDepartments = new Set<string>();

    usedSymptoms.forEach((label) => {
      const deps = departmentsMap[label];
      if (deps) deps.forEach((d) => matchedDepartments.add(d));
    });

    const matchedDeptsArray = Array.from(matchedDepartments);
    setDepartments(matchedDeptsArray);

    const matchedDoctors = doctors.filter((doc) =>
      matchedDeptsArray.includes(doc.specialty)
    );

    setFilteredDoctors(matchedDoctors);
    setSearched(true);
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
            Nhập các triệu chứng của bạn (bằng tiếng Việt) và chọn từ danh sách
            gợi ý.
          </p>

          <div className="relative">
            <div className="flex gap-2">
              <div className="flex items-center flex-1 bg-gray-50 rounded-md px-3 border relative">
                <Search className="h-5 w-5 text-gray-400 mr-2" />
                <Input
                  type="text"
                  placeholder="Ví dụ: đau đầu, sốt, đau bụng..."
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  onFocus={() => setShowDropdown(true)}
                  className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
              <Button
                onClick={() => handleSearch()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Tìm kiếm
              </Button>
            </div>

            {/* Dropdown gợi ý */}
            {showDropdown && filteredSuggestions.length > 0 && (
              <ul className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-56 overflow-y-auto">
                {filteredSuggestions.map((label) => (
                  <li
                    key={label}
                    onClick={() => handleSelectSymptom(label)}
                    className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-gray-700"
                  >
                    {label}
                  </li>
                ))}
              </ul>
            )}

            {/* Tag triệu chứng đã chọn */}
            {selectedSymptoms.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {selectedSymptoms.map((symptom) => (
                  <span
                    key={symptom}
                    className="bg-blue-600 text-white text-sm px-3 py-1 rounded-full flex items-center gap-2"
                  >
                    {symptom}
                    <button
                      onClick={() => removeSymptom(symptom)}
                      className="text-white hover:text-gray-200"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Khi chưa tìm kiếm */}
        {!searched && (
          <Card className="p-10 bg-white border text-center">
            <div className="flex flex-col items-center space-y-3">
              <Stethoscope className="h-10 w-10 text-blue-500" />
              <h3 className="text-lg font-semibold text-gray-900">
                Bắt đầu tìm kiếm
              </h3>
              <p className="text-gray-600 max-w-md">
                Nhập triệu chứng của bạn phía trên để tìm bác sĩ phù hợp.
              </p>
            </div>
          </Card>
        )}

        {/* Không tìm thấy kết quả */}
        {searched &&
          departments.length === 0 &&
          filteredDoctors.length === 0 && (
            <Card className="p-6 bg-yellow-50 border border-yellow-200 flex items-start gap-3">
              <AlertTriangle className="h-6 w-6 text-yellow-600 mt-1" />
              <div>
                <h3 className="font-semibold text-yellow-800 mb-1">
                  Không tìm thấy chuyên khoa cụ thể
                </h3>
                <p className="text-yellow-700">
                  Chúng tôi khuyến nghị bạn nên gặp <b>bác sĩ đa khoa</b> để
                  được thăm khám ban đầu.
                </p>
              </div>
            </Card>
          )}

        {/* Gợi ý chuyên khoa */}
        {departments.length > 0 && (
          <Card className="p-6 bg-blue-50 border border-blue-200">
            <div className="flex items-start gap-3">
              <Info className="h-6 w-6 text-blue-600 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Chuyên khoa được gợi ý
                </h3>
                <p className="text-gray-600 mb-3">
                  Dựa trên triệu chứng của bạn, chúng tôi khuyến nghị bạn nên
                  khám tại:
                </p>
                <div className="flex gap-2 flex-wrap">
                  {departments.map((dept) => (
                    <span
                      key={dept}
                      className="bg-blue-600 text-white text-sm px-3 py-1 rounded-full"
                    >
                      {dept}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Danh sách bác sĩ phù hợp */}
        {filteredDoctors.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Bác sĩ phù hợp</h3>
            <p className="text-gray-500 mb-6">
              Có {filteredDoctors.length} bác sĩ phù hợp với triệu chứng của bạn
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDoctors.map((doctor) => (
                <Card
                  key={doctor.id}
                  className="border border-gray-200 hover:shadow-lg"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <img
                        src={doctor.image}
                        alt={doctor.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">
                          {doctor.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {doctor.specialty}
                        </p>
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                          <span>⭐ {doctor.rating}</span>
                          <span className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {doctor.experience}
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
                      <span className="text-lg font-semibold text-gray-900">
                        {doctor.price.toLocaleString('vi-VN')}₫
                      </span>
                    </div>

                    {/* 👇 kiểm tra login */}
                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => {
                        if (!isLoggedIn) {
                          router.push('/auth/login');
                        } else {
                          router.push(`/book/${doctor.id}`);
                        }
                      }}
                    >
                      Đặt lịch khám
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
