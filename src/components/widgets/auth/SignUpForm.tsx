'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FormMessageAlert } from '../../ui/FormMessageAlert';
import { CustomButton } from '../../ui/CustomButton';
import { TextField } from '../../blocks/TextField';
import { MailIcon, LockIcon } from '../../icons';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '../../ui/card';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select';

export const SignUpForm = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    gender: '',
    dateOfBirth: '',
    password: '',
  });

  const [formError, setFormError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName) newErrors.fullName = 'Họ tên không được để trống';
    if (!formData.email) newErrors.email = 'Email không được để trống';
    else if (!formData.email.includes('@'))
      newErrors.email = 'Email không hợp lệ';

    if (!formData.phone) newErrors.phone = 'Số điện thoại không được để trống';
    if (!formData.gender) newErrors.gender = 'Vui lòng chọn giới tính';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Chọn ngày sinh';

    if (!formData.password) newErrors.password = 'Mật khẩu không được để trống';
    else if (formData.password.length < 8)
      newErrors.password = 'Mật khẩu phải ít nhất 8 ký tự';

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setSuccess('');

    if (!validate()) return;

    setLoading(true);

    // ✅ Fake success
    setTimeout(() => {
      setSuccess('Tạo tài khoản thành công! Đang chuyển hướng...');
      setLoading(false);

      // ✅ Fake redirect
      setTimeout(() => router.push('/dashboard/home'), 1200);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <Card className="w-full max-w-md border shadow-sm">
        {/* HEADER */}
        <CardHeader className="text-center space-y-1 pt-8">
          <CardTitle className="text-lg font-semibold">
            Đăng ký tài khoản
          </CardTitle>
          <CardDescription className="text-sm text-gray-500">
            Tạo tài khoản mới để sử dụng dịch vụ
          </CardDescription>
        </CardHeader>

        <CardContent className="px-8 pb-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Họ tên */}
            <TextField
              label="Họ và tên"
              id="fullName"
              placeholder="Nguyễn Văn A"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              error={errors.fullName}
            />

            {/* Email */}
            <TextField
              label="Email"
              type="email"
              id="email"
              icon={<MailIcon />}
              placeholder="example@mail.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              error={errors.email}
            />

            {/* Số điện thoại */}
            <TextField
              label="Số điện thoại"
              type="tel"
              id="phone"
              placeholder="090xxxxxxx"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              error={errors.phone}
            />

            {/* Giới tính */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Giới tính</label>
              <Select
                value={formData.gender}
                onValueChange={(value) =>
                  setFormData({ ...formData, gender: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn giới tính" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Nam</SelectItem>
                  <SelectItem value="female">Nữ</SelectItem>
                  <SelectItem value="other">Khác</SelectItem>
                </SelectContent>
              </Select>
              {errors.gender && (
                <p className="text-sm text-red-500">{errors.gender}</p>
              )}
            </div>

            {/* Ngày sinh */}
            <TextField
              label="Ngày sinh"
              type="date"
              id="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={(e) =>
                setFormData({ ...formData, dateOfBirth: e.target.value })
              }
              error={errors.dateOfBirth}
            />

            {/* Mật khẩu */}
            <TextField
              label="Mật khẩu"
              type="password"
              id="password"
              icon={<LockIcon />}
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              error={errors.password}
            />

            {formError && <FormMessageAlert message={formError} />}
            {success && <FormMessageAlert message={success} success />}

            <CustomButton
              type="submit"
              className="w-full text-white"
              style={{ backgroundColor: '#007BFF' }}
              spinnerIcon={loading}
              disabled={loading}
            >
              {loading ? 'Đang tạo tài khoản...' : 'Đăng ký'}
            </CustomButton>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            Đã có tài khoản?{' '}
            <a
              href="/auth/login"
              className="text-blue-600 font-medium hover:underline"
            >
              Đăng nhập ngay
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
