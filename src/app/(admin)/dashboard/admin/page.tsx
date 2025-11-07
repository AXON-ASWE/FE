import { AdminRoute } from "@/components/guards/RouteGuard";
import { useAuth } from "@/context/Sessioncontext";

export const metadata = {
  title: 'Admin Dashboard | AXON Healthcare',
  description: 'Trang quản trị hệ thống AXON Healthcare',
};

function AdminDashboardContent() {
  const { session } = useAuth();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-2 text-gray-600">Chào mừng {session?.name}, bạn đang truy cập với quyền Quản trị viên</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Doctor Management */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Quản lý Bác sĩ</h2>
          <p className="text-gray-600 mb-4">Thêm, sửa, xóa thông tin bác sĩ</p>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
            Quản lý Bác sĩ
          </button>
        </div>
        
        {/* Department Management */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Quản lý Khoa</h2>
          <p className="text-gray-600 mb-4">Quản lý các khoa trong bệnh viện</p>
          <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
            Quản lý Khoa
          </button>
        </div>
        
        {/* System Settings */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Cài đặt Hệ thống</h2>
          <p className="text-gray-600 mb-4">Cấu hình hệ thống và permissions</p>
          <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded">
            Cài đặt
          </button>
        </div>
        
        {/* Statistics */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Thống kê</h2>
          <p className="text-gray-600 mb-4">Xem báo cáo và thống kê hệ thống</p>
          <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded">
            Xem Thống kê
          </button>
        </div>
        
        {/* User Management */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Quản lý Người dùng</h2>
          <p className="text-gray-600 mb-4">Quản lý tài khoản người dùng</p>
          <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">
            Quản lý Users
          </button>
        </div>
        
        {/* Appointments Overview */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Tổng quan Lịch hẹn</h2>
          <p className="text-gray-600 mb-4">Xem tổng quan các cuộc hẹn</p>
          <button className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded">
            Xem Lịch hẹn
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <AdminRoute>
      <AdminDashboardContent />
    </AdminRoute>
  );
}
