import { DoctorRoute } from "@/components/guards/RouteGuard";
import { useAuth } from "@/context/Sessioncontext";

export const metadata = {
  title: 'Doctor Dashboard | AXON Healthcare',
  description: 'Trang làm việc dành cho Bác sĩ',
};

function DoctorDashboardContent() {
  const { session } = useAuth();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Bảng điều khiển Bác sĩ</h1>
        <p className="mt-2 text-gray-600">Chào mừng Bác sĩ {session?.name}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Today's Appointments */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Lịch hẹn hôm nay</h2>
          <p className="text-gray-600 mb-4">Xem lịch hẹn trong ngày</p>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
            Xem Lịch hẹn
          </button>
        </div>
        
        {/* Patient Records */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Hồ sơ Bệnh nhân</h2>
          <p className="text-gray-600 mb-4">Quản lý hồ sơ bệnh nhân</p>
          <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
            Xem Hồ sơ
          </button>
        </div>
        
        {/* Schedule Management */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Quản lý Lịch làm việc</h2>
          <p className="text-gray-600 mb-4">Cài đặt lịch làm việc của bạn</p>
          <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded">
            Quản lý Lịch
          </button>
        </div>
        
        {/* Medical Notes */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Ghi chú Y khoa</h2>
          <p className="text-gray-600 mb-4">Tạo và quản lý ghi chú y khoa</p>
          <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded">
            Ghi chú
          </button>
        </div>
        
        {/* Prescriptions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Đơn thuốc</h2>
          <p className="text-gray-600 mb-4">Kê và quản lý đơn thuốc</p>
          <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">
            Kê Đơn
          </button>
        </div>
        
        {/* Statistics */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Thống kê cá nhân</h2>
          <p className="text-gray-600 mb-4">Xem thống kê công việc</p>
          <button className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded">
            Thống kê
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DoctorPage() {
  return (
    <DoctorRoute>
      <DoctorDashboardContent />
    </DoctorRoute>
  );
}
