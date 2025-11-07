import LoginScreen from '@/screens/LoginScreen';
import { PublicRoute } from '@/components/guards/RouteGuard';

export const metadata = {
  title: 'Đăng nhập | AXON Healthcare',
  description: 'Trang đăng nhập hệ thống quản lý bệnh viện AXON',
};

export default function LoginPage() {
  return (
    <PublicRoute>
      <LoginScreen />
    </PublicRoute>
  );
}
