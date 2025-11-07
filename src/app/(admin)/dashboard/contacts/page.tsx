import { ProtectedRoute } from "@/components/guards/RouteGuard";

export const metadata = {
  title: 'Liên hệ | AXON Healthcare',
  description: 'Trang quản lý liên hệ AXON Healthcare',
};

export default function ContactsPage() {
  return (
    <ProtectedRoute>
      <div>
        <h1 className="text-2xl font-bold">Quản lý liên hệ</h1>
        <p className="mt-4 text-gray-600">Trang quản lý thông tin liên hệ của hệ thống.</p>
      </div>
    </ProtectedRoute>
  );
}
