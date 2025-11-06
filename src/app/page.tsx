'use client';

import { Search, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { useState } from 'react';
import { useSession } from '@/context/Sessioncontext'; // 👈 thêm dòng này

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

const doctors = [
  {
    id: 1,
    name: 'BS. Sarah Johnson',
    specialty: 'Thần kinh',
    rating: 4.8,
    experience: '12 năm kinh nghiệm',
    price: 150,
    image:
      'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
  },
  {
    id: 2,
    name: 'BS. Michael Chen',
    specialty: 'Tiêu hoá',
    rating: 4.9,
    experience: '15 năm kinh nghiệm',
    price: 175,
    image:
      'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
  },
  {
    id: 3,
    name: 'BS. Emily Williams',
    specialty: 'Tim mạch',
    rating: 4.7,
    experience: '18 năm kinh nghiệm',
    price: 200,
    image:
      'https://images.pexels.com/photos/5214959/pexels-photo-5214959.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
  },
  {
    id: 4,
    name: 'BS. David Lee',
    specialty: 'Thần kinh',
    rating: 4.6,
    experience: '10 năm kinh nghiệm',
    price: 180,
    image:
      'https://images.pexels.com/photos/8460157/pexels-photo-8460157.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
  },
  {
    id: 5,
    name: 'BS. Olivia Brown',
    specialty: 'Tim mạch',
    rating: 4.9,
    experience: '20 năm kinh nghiệm',
    price: 220,
    image:
      'https://images.pexels.com/photos/8460158/pexels-photo-8460158.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
  },
  {
    id: 6,
    name: 'BS. Tom Nguyen',
    specialty: 'Tiêu hoá',
    rating: 4.8,
    experience: '9 năm kinh nghiệm',
    price: 160,
    image:
      'https://images.pexels.com/photos/8460159/pexels-photo-8460159.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
  },
  {
    id: 7,
    name: 'BS. David Lee',
    specialty: 'Thần kinh',
    rating: 4.6,
    experience: '10 năm kinh nghiệm',
    price: 180,
    image:
      'https://images.pexels.com/photos/8460157/pexels-photo-8460157.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
  },
  {
    id: 8,
    name: 'BS. Olivia Brown',
    specialty: 'Tim mạch',
    rating: 4.9,
    experience: '20 năm kinh nghiệm',
    price: 220,
    image:
      'https://images.pexels.com/photos/8460158/pexels-photo-8460158.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
  },
  {
    id: 9,
    name: 'BS. Tom Nguyen',
    specialty: 'Tiêu hoá',
    rating: 4.8,
    experience: '9 năm kinh nghiệm',
    price: 160,
    image:
      'https://images.pexels.com/photos/8460159/pexels-photo-8460159.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
  },
  {
    id: 10,
    name: 'BS. David Lee',
    specialty: 'Thần kinh',
    rating: 4.6,
    experience: '10 năm kinh nghiệm',
    price: 180,
    image:
      'https://images.pexels.com/photos/8460157/pexels-photo-8460157.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
  },
  {
    id: 11,
    name: 'BS. Olivia Brown',
    specialty: 'Tim mạch',
    rating: 4.9,
    experience: '20 năm kinh nghiệm',
    price: 220,
    image:
      'https://images.pexels.com/photos/8460158/pexels-photo-8460158.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
  },
  {
    id: 12,
    name: 'BS. Tom Nguyen',
    specialty: 'Tiêu hoá',
    rating: 4.8,
    experience: '9 năm kinh nghiệm',
    price: 160,
    image:
      'https://images.pexels.com/photos/8460159/pexels-photo-8460159.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
  },
];

export default function Home() {
  const router = useRouter();
  const { session } = useSession(); // 👈 kiểm tra login
  const isLoggedIn = !!session;

  const [symptomInput, setSymptomInput] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [department, setDepartment] = useState('Tất cả');
  const [page, setPage] = useState(1);
  const perPage = 9;

  // Gợi ý triệu chứng tiếng Việt
  const suggestions = [
    'Đau đầu',
    'Sốt',
    'Đau bụng',
    'Đau ngực',
    'Mệt mỏi',
    'Buồn nôn',
    'Đau lưng',
  ];

  const filteredSuggestions = suggestions.filter(
    (s) =>
      s.toLowerCase().includes(symptomInput.toLowerCase()) &&
      !selectedSymptoms.includes(s)
  );

  const handleSelectSuggestion = (label: string) => {
    if (!selectedSymptoms.includes(label)) {
      setSelectedSymptoms([...selectedSymptoms, label]);
    }
    setSymptomInput('');
    setShowDropdown(false);
  };

  const removeSymptom = (symptom: string) => {
    setSelectedSymptoms(selectedSymptoms.filter((s) => s !== symptom));
  };

  const handleSearch = () => {
    if (selectedSymptoms.length === 0) return;
    const query = selectedSymptoms.join(',');
    router.push(`/find?q=${encodeURIComponent(query)}`);
  };

  // Lọc theo chuyên khoa
  const filteredDoctors =
    department === 'Tất cả'
      ? doctors
      : doctors.filter((doc) => doc.specialty === department);

  // Phân trang
  const totalPages = Math.ceil(filteredDoctors.length / perPage);
  const startIndex = (page - 1) * perPage;
  const paginatedDoctors = filteredDoctors.slice(
    startIndex,
    startIndex + perPage
  );

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

          {/* Ô tìm kiếm có chọn nhiều triệu chứng */}
          <div className="max-w-2xl mx-auto relative text-left">
            <div className="flex gap-2 bg-white rounded-lg p-2 shadow-lg relative">
              <div className="flex items-center flex-1 px-3 relative">
                <Search className="h-5 w-5 text-gray-400 mr-2" />
                <Input
                  type="text"
                  placeholder="Nhập triệu chứng (ví dụ: đau đầu, sốt...)"
                  value={symptomInput}
                  onChange={(e) => {
                    setSymptomInput(e.target.value);
                    setShowDropdown(true);
                  }}
                  onFocus={() => setShowDropdown(true)}
                  className="border-0 focus-visible:ring-0 text-gray-900 placeholder:text-gray-500"
                />
              </div>
              <Button
                onClick={handleSearch}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8"
              >
                Tìm kiếm
              </Button>
            </div>

            {/* Dropdown gợi ý */}
            {showDropdown && filteredSuggestions.length > 0 && (
              <ul className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-56 overflow-y-auto">
                {filteredSuggestions.map((item) => (
                  <li
                    key={item}
                    onClick={() => handleSelectSuggestion(item)}
                    className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-gray-700"
                  >
                    {item}
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
            onValueChange={(value) => setDepartment(value)}
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
            </SelectContent>
          </Select>
        </div>

        {/* Danh sách bác sĩ */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedDoctors.map((doctor) => (
            <Card
              key={doctor.id}
              className="border border-gray-200 hover:shadow-xl transition-shadow"
            >
              <CardContent className="p-6">
                {/* info bác sĩ */}
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {doctor.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {doctor.specialty}
                    </p>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="flex items-center text-gray-500">
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
                </div>

                {/* 👇 logic khi ấn nút */}
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => {
                    if (!isLoggedIn) {
                      router.push('/auth/login'); // nếu chưa login → login
                    } else {
                      router.push(`/book/${doctor.id}`); // đã login → book
                    }
                  }}
                >
                  Đặt lịch khám
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

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
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white px-8"
              onClick={() => router.push('/find')}
            >
              Tìm bác sĩ
            </Button>

            {/* chỉ hiện khi đã đăng nhập */}
            {isLoggedIn && (
              <Button
                variant="outline"
                className="border-gray-300 bg-white hover:bg-gray-50"
                onClick={() => router.push('/appointments')}
              >
                Xem lịch hẹn của tôi
              </Button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
