'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FormMessageAlert } from '../../ui/FormMessageAlert';
import { CustomButton } from '../../ui/CustomButton';
import { TextField } from '../../blocks/TextField';
import { MailIcon, LockIcon } from '../../icons';
import { signin } from '@/app/api/auth';
import { useToast } from '@/hooks/use-toast';
import Cookies from 'js-cookie'; // ✅ Thêm dòng này
import { useSession } from '@/context/Sessioncontext'; // nếu cần

export const AuthForm = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );

  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setSession } = useSession();

  const validate = () => {
    const newErrors: any = {};

    if (!email) newErrors.email = 'Email không được để trống';
    else if (!email.includes('@')) newErrors.email = 'Email không hợp lệ';

    if (!password) newErrors.password = 'Mật khẩu không được để trống';
    else if (password.length < 8)
      newErrors.password = 'Mật khẩu phải có ít nhất 8 ký tự';

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!validate()) return;

    setLoading(true);

    try {
      const response = await signin({ email, password });

      // Lưu token
      Cookies.set('access_token', response.access_token);
      Cookies.set('refresh_token', response.refresh_token);

      // Lưu session
      setSession({
        id: response.user.id,
        email: response.user.email,
        name: response.user.name,
        role: response.user.role,
      });

      toast({
        title: 'Đăng nhập thành công',
        description: 'Đang chuyển hướng...',
      });

      setTimeout(() => {
        if (response.user.role === 'doctor') router.push('/doctor/dashboard');
        else if (response.user.role === 'admin')
          router.push('/admin/dashboard');
        else router.push('/');
      }, 500);
    } catch (err: any) {
      setFormError(err.message || 'Đăng nhập thất bại');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md bg-white shadow-sm rounded-lg border">
        {/* HEADER */}
        <div className="space-y-1 text-center px-8 pt-8">
          <h3 className="text-xl font-semibold">Đăng nhập</h3>
          <p className="text-sm text-gray-500">
            Đăng nhập để đặt lịch khám bệnh
          </p>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          noValidate
          className="p-8 flex flex-col gap-4"
        >
          <TextField
            label="Email"
            type="email"
            id="email"
            placeholder="example@mail.com"
            icon={<MailIcon />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
          />

          <TextField
            label="Mật khẩu"
            type="password"
            id="password"
            placeholder="••••••••"
            icon={<LockIcon />}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
          >
            <a
              href="/auth/forgot-password"
              className="text-sm text-blue-600 hover:underline"
            >
              Quên mật khẩu?
            </a>
          </TextField>

          {formError && <FormMessageAlert message={formError} />}

          <CustomButton
            type="submit"
            className="w-full text-white"
            style={{ backgroundColor: '#007BFF' }}
            spinnerIcon={loading}
            disabled={loading}
          >
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </CustomButton>
        </form>

        {/* SIGNUP LINK */}
        <div className="px-8 pb-4 text-center text-sm text-gray-600">
          Chưa có tài khoản?{' '}
          <a
            href="/auth/signup"
            className="text-blue-600 font-medium hover:underline"
          >
            Đăng ký ngay
          </a>
        </div>

        {/* DEMO ACCOUNTS */}
        <div className="mx-8 mb-8 p-4 rounded-lg bg-blue-50 text-xs text-gray-700">
          <p className="mb-2">Tài khoản demo:</p>
          <p>
            <strong>Bệnh nhân:</strong> patient@example.com / 12345678
          </p>
          <p>
            <strong>Bác sĩ:</strong> doctor@example.com / 12345678
          </p>
          <p>
            <strong>Quản trị:</strong> admin@example.com / 12345678
          </p>
        </div>
      </div>
    </div>
  );
};
