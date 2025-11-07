import HomeScreen from "@/screens/HomeScreen";
import { ProtectedRoute } from "@/components/guards/RouteGuard";

export const metadata = {
  title: 'Trang chủ | AXON Healthcare',
  description: 'Trang chủ hệ thống quản lý bệnh viện AXON',
};

export default function HomePage() {
  return (
    <ProtectedRoute>
      <HomeScreen />
    </ProtectedRoute>
  );
}
