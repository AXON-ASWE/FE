'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FormMessageAlert } from '../../ui/FormMessageAlert';
import { CustomButton } from '../../ui/CustomButton';
import { TextField } from '../../blocks/TextField';
import { MailIcon, LockIcon, GoogleIcon, MicrosoftIcon } from '../../icons';
import { authOperation } from '@/lib/BE-library/main';
import { PatientRegistrationPayload } from '@/lib/BE-library/interfaces';
import { setTokenCookie } from '@/lib/auth-utils';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '../../ui/card';

export const SignUpForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const router = useRouter();

  const passwordRules = [
    { rule: /[A-Z]/, message: 'Kết hợp chữ hoa và chữ thường' },
    { rule: /.{8,}/, message: 'Tối thiểu 8 ký tự' },
    { rule: /\d/, message: 'Chứa ít nhất 1 số' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsDisabled(true);
    setLoading(true);
    setError('');
    setSuccess('');

    if (!name.trim()) {
      setError('Họ tên là bắt buộc.');
      setLoading(false);
      setIsDisabled(false);
      return;
    }

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

    if (!/[A-Z]/.test(password)) {
      setError('Mật khẩu phải chứa ít nhất một chữ cái viết hoa.');
      setLoading(false);
      setIsDisabled(false);
      return;
    }

    if (!/\d/.test(password)) {
      setError('Mật khẩu phải chứa ít nhất một số.');
      setLoading(false);
      setIsDisabled(false);
      return;
    }

    try {
      const registrationPayload: PatientRegistrationPayload = {
        email,
        password,
        fullName: name,
      };

      const result = await authOperation.patientRegister(registrationPayload);

      if (result.success && result.data) {
        setTokenCookie(result.data.accessToken, result.data.expiration);

        setSuccess(
          `Đăng ký thành công với vai trò ${result.data.role}! Đang chuyển hướng đến trang chủ...`
        );

        setTimeout(() => {
          router.push('/dashboard/home');
        }, 1500);
      } else {
        setError(result.message || 'Đăng ký thất bại. Vui lòng thử lại.');
      }
    } catch (err: any) {
      setError(err.message || 'Đăng ký thất bại. Vui lòng thử lại.');
    }

    setLoading(false);
    setIsDisabled(false);
  };

  return (
    <div>
      <Card className="w-full max-w-md border shadow-sm">
        {/* HEADER */}
        <CardHeader className="px-8 pt-8 text-center space-y-1">
          <CardTitle className="text-lg font-semibold">Đăng ký</CardTitle>
          <CardDescription className="text-sm text-gray-500">
            Tạo tài khoản mới để sử dụng dịch vụ
          </CardDescription>

          <p className="text-xs text-gray-600 mt-2">
            Đã có tài khoản?{' '}
            <a href="/auth/login" className="text-blue-600 underline">
              Đăng nhập
            </a>
          </p>
        </CardHeader>

        {/* FORM */}
        <CardContent className="px-8 pb-8">
          <form
            onSubmit={handleSubmit}
            noValidate
            className="flex flex-col gap-4"
          >
            <TextField
              label="Họ tên"
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              validRules={[{ rule: /.+/, message: 'Họ tên là bắt buộc.' }]}
            />

            <TextField
              label="Email"
              type="email"
              id="email"
              icon={<MailIcon />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              validRules={[
                { rule: /.+/, message: 'Email là bắt buộc.' },
                {
                  rule: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Nhập địa chỉ email hợp lệ',
                },
              ]}
            />

            <TextField
              label="Mật khẩu"
              type="password"
              id="password"
              icon={<LockIcon />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              validRules={[
                { rule: /.+/, message: 'Mật khẩu là bắt buộc.' },
                { rule: /[A-Z]/, message: 'Mật khẩu không đáp ứng yêu cầu.' },
                { rule: /.{8,}/, message: 'Mật khẩu không đáp ứng yêu cầu.' },
                { rule: /\d/, message: 'Mật khẩu không đáp ứng yêu cầu.' },
              ]}
            />

            <ul className="text-sm space-y-1">
              {passwordRules.map((rule, index) => (
                <li
                  key={index}
                  className={
                    rule.rule.test(password)
                      ? 'text-green-500'
                      : 'text-gray-400'
                  }
                >
                  • {rule.message}
                </li>
              ))}
            </ul>

            {success && <FormMessageAlert message={success} success />}
            {error && <FormMessageAlert message={error} />}

            <CustomButton
              type="submit"
              className="w-full text-white"
              style={{ backgroundColor: '#007BFF' }}
              spinnerIcon={loading}
              disabled={loading || isDisabled}
            >
              {loading ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'}
            </CustomButton>
          </form>

          <p className="mt-6 text-xs text-gray-600 text-center">
            Bằng việc đăng ký, bạn đồng ý với{' '}
            <a href="#" className="font-medium underline text-blue-600">
              Điều khoản sử dụng
            </a>{' '}
            và{' '}
            <a href="#" className="font-medium underline text-blue-600">
              Chính sách bảo mật
            </a>{' '}
            của chúng tôi.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
