import { ProtectedRoute } from "@/components/guards/RouteGuard";

export const metadata = {
  title: 'Cài đặt | AXON Healthcare',
  description: 'Trang cài đặt hệ thống AXON Healthcare',
};

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <div>
        <h1 className="text-2xl font-bold">Cài đặt hệ thống</h1>
        <p className="mt-4 text-gray-600">Trang cài đặt và cấu hình hệ thống.</p>
      </div>
    </ProtectedRoute>
  );
}
