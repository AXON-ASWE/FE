'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Pencil, Save, X } from 'lucide-react';

type DoctorProfileDTO = {
  fullName: string;
  email: string;
  phone: string;
  image: string;

  specialty: string;
  experience: string;
  degree: string;

  description: string;
};

export default function DoctorProfilePage() {
  const [data, setData] = useState<DoctorProfileDTO | null>(null);

  // lưu field đang chỉnh sửa
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState<string>('');

  useEffect(() => {
    const res: DoctorProfileDTO = {
      fullName: 'Bác sĩ Trần Thị Bích',
      email: 'doctor@example.com',
      phone: '0902345678',
      image:
        'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',

      specialty: 'Tim mạch can thiệp',
      experience: '15 năm',
      degree: 'Tiến sĩ, Đại học Y Hà Nội',
      description:
        'Chuyên gia hàng đầu về tim mạch can thiệp với hơn 15 năm kinh nghiệm',
    };

    setData(res);
  }, []);

  if (!data) return <div>Đang tải...</div>;

  const startEdit = (field: keyof DoctorProfileDTO) => {
    setEditingField(field);
    setTempValue(data[field]);
  };

  const saveEdit = () => {
    if (!editingField || !data) return;

    setData({
      ...data,
      [editingField]: tempValue,
    });

    setEditingField(null);

    //nối API PUT update doctor profile
  };

  const cancelEdit = () => {
    setEditingField(null);
  };

  const InfoRow = ({
    label,
    field,
  }: {
    label: string;
    field: keyof DoctorProfileDTO;
  }) => {
    const isEditing = editingField === field;

    return (
      <div className="relative group">
        <p className="text-gray-500">{label}</p>

        {isEditing ? (
          <div className="flex items-center gap-2 mt-1">
            <input
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              className="border px-2 py-1 rounded w-72"
            />
            <button onClick={saveEdit} className="text-green-600">
              <Save size={18} />
            </button>
            <button onClick={cancelEdit} className="text-red-500">
              <X size={18} />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <p className="font-medium">{data[field]}</p>

            <button
              onClick={() => startEdit(field)}
              className="opacity-0 group-hover:opacity-100 transition text-gray-400 hover:text-blue-600"
            >
              <Pencil size={16} />
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full space-y-6">
      {/* Thông tin cá nhân */}
      <Card className="shadow-sm border border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg">Thông tin cá nhân</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="flex gap-6 items-start">
            <Image
              src={data.image}
              width={160}
              height={160}
              alt="Doctor"
              className="rounded-xl object-cover"
            />

            <div className="space-y-5">
              <InfoRow label="Họ và tên" field="fullName" />
              <InfoRow label="Email" field="email" />
              <InfoRow label="Số điện thoại" field="phone" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Thông tin chuyên môn */}
      <Card className="shadow-sm border border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg">Thông tin chuyên môn</CardTitle>
        </CardHeader>

        <CardContent className="space-y-5">
          <InfoRow label="Chuyên khoa" field="specialty" />
          <InfoRow label="Số năm kinh nghiệm" field="experience" />
          <InfoRow label="Trình độ" field="degree" />
          <InfoRow label="Giới thiệu" field="description" />
        </CardContent>
      </Card>
    </div>
  );
}
