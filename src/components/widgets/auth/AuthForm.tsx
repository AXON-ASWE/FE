'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FormMessageAlert } from '../../ui/FormMessageAlert';
import { CustomButton } from '../../ui/CustomButton';
import { TextField } from '../../blocks/TextField';
import { MailIcon, LockIcon } from '../../icons';
import { authOperation } from '@/lib/BE-library/main';
import { LoginPayload } from '@/lib/BE-library/interfaces';
import { setTokenCookie, getRedirectPath } from '@/lib/auth-utils';

export const AuthForm = () => {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    setIsDisabled(true);
    setLoading(true);

    if (!email.includes('@')) {
      setError('Vui lòng nhập địa chỉ email hợp lệ.');
      setLoading(false);
      setIsDisabled(false);
      return;
    }

    if (password.length < 8) {
      setError('Mật khẩu phải có ít nhất 8 ký tự.');
      setLoading(false);
      setIsDisabled(false);
      return;
    }

    try {
      const loginPayload: LoginPayload = { email, password };
      const result = await authOperation.adminLogin(loginPayload);

      if (result.success && result.data) {
        setTokenCookie(result.data.accessToken, result.data.expiration);

        const userRole = result.data.role;
        setSuccess(
          `Đăng nhập thành công với vai trò ${userRole}! Đang chuyển hướng đến trang chủ...`
        );

        setTimeout(() => {
          const redirectPath = getRedirectPath(userRole);
          router.push(redirectPath);
        }, 1500);
      } else {
        setError(
          result.message ||
            'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin đăng nhập.'
        );
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(
        err.message ||
          'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin đăng nhập.'
      );
    }

    setLoading(false);
    setIsDisabled(false);
  };

  return (
    <div>
      <div className="w-full max-w-md bg-white border shadow-sm rounded-lg">
        {/* Header */}
        <div className="text-center px-8 pt-8 space-y-1">
          <h3 className="text-xl font-semibold">Đăng nhập</h3>
          <p className="text-sm text-gray-500">
            Nhập thông tin bên dưới để truy cập tài khoản
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
            id="email"
            type="email"
            icon={<MailIcon />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            label="Mật khẩu"
            id="password"
            type="password"
            icon={<LockIcon />}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></TextField>

          {success && <FormMessageAlert success message={success} />}
          {error && <FormMessageAlert message={error} />}

          <CustomButton
            type="submit"
            className="w-full text-white"
            style={{ backgroundColor: '#007BFF' }}
            spinnerIcon={loading}
            disabled={loading || isDisabled}
          >
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </CustomButton>
        </form>

        {/* SIGN UP */}
        <div className="px-8 pb-6 text-center text-sm text-gray-600">
          Chưa có tài khoản?{' '}
          <a
            href="/auth/signup"
            className="text-blue-600 font-medium hover:underline"
          >
            Đăng ký ngay
          </a>
        </div>
      </div>
    </div>
  );
};
