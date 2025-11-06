'use client';

import Link from 'next/link';
import {
  Home,
  User,
  Calendar,
  LogOut,
  Users,
  Stethoscope,
  Building,
  AlertCircle,
  ClipboardList,
  IdCard,
} from 'lucide-react';
import { useSession } from '@/context/Sessioncontext';

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className = '' }: SidebarProps) {
  const { session } = useSession();
  const role = session?.role;

  // ✅ Menu cho Doctor
  const doctorMenu = [
    { href: '/doctor/dashboard', icon: <Home />, label: 'Bảng điều khiển' },
    { href: '/doctor/patients', icon: <Users />, label: 'Bệnh nhân của tôi' },
    { href: '/doctor/today', icon: <Calendar />, label: 'Cuộc hẹn hôm nay' },
    { href: '/doctor/profile', icon: <IdCard />, label: 'Hồ sơ' },
  ];

  // ✅ Menu cho Admin
  const adminMenu = [
    { href: '/admin/dashboard', icon: <Home />, label: 'Bảng điều khiển' },
    { href: '/admin/users', icon: <Users />, label: 'Người dùng' },
    { href: '/admin/doctors', icon: <Stethoscope />, label: 'Bác sĩ' },
    { href: '/admin/departments', icon: <Building />, label: 'Khoa' },
    { href: '/admin/symptoms', icon: <AlertCircle />, label: 'Triệu chứng' },
    { href: '/admin/appointments', icon: <ClipboardList />, label: 'Lịch hẹn' },
    { href: '/admin/profile', icon: <IdCard />, label: 'Hồ sơ' },
  ];

  const menuItems = role === 'admin' ? adminMenu : doctorMenu;

  return (
    <aside className={`bg-white border-r min-h-screen p-4 ${className}`}>
      <h2 className="text-lg font-bold mb-4 text-blue-600">
        {role === 'admin' ? 'Quản trị' : 'Bác sĩ'}
      </h2>

      <nav className="space-y-2">
        {menuItems.map((item) => (
          <SideItem
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={item.label}
          />
        ))}

        <hr className="my-3" />

        <SideItem href="/logout" icon={<LogOut />} label="Đăng xuất" danger />
      </nav>
    </aside>
  );
}

function SideItem({
  href,
  icon,
  label,
  danger,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  danger?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2 rounded-md
      ${danger ? 'text-red-600' : 'text-gray-700'}
      hover:bg-gray-100 transition`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}
