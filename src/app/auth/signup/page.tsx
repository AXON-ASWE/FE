import SignUpScreen from '@/screens/SignUpScreen';
import { PublicRoute } from '@/components/guards/RouteGuard';

export const metadata = {
  title: 'Đăng ký | AXON Healthcare',
  description: 'Trang đăng ký tài khoản bệnh nhân AXON Healthcare',
};

export default function SignUpPage() {
  return (
    <PublicRoute>
      <SignUpScreen />
    </PublicRoute>
  );
}
