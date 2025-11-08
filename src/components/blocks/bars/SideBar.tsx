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
  ChevronDown,
} from 'lucide-react';
import { useAuth, useSession } from '@/context/Sessioncontext';
import { useState } from 'react';
import React from 'react';

interface SidebarProps {
  className?: string;
}

/* --- types --- */
// link item
type MenuLink = {
  type: 'link';
  href: string;
  icon: React.ReactNode;
  label: string;
  danger?: boolean;
};

// dropdown item
type MenuDropdown = {
  type: 'dropdown';
  label: string;
  icon: React.ReactNode;
  open: boolean;
  toggle: () => void;
  children: { href: string; label: string; icon?: React.ReactNode }[];
};

type MenuItem = MenuLink | MenuDropdown;

export function Sidebar({ className = '' }: SidebarProps) {
  const { session, status, logout: handleAuthLogout, isAuthenticated, userName: authUserName, userEmail } = useAuth();
  
  const role = session?.role;
  const [openUserMenu, setOpenUserMenu] = useState(false);

  // doctor menu (all items explicit type:'link')
  const doctorMenu: MenuLink[] = [
    {
      type: 'link',
      href: '/doctor/dashboard',
      icon: <Home />,
      label: 'Bảng điều khiển',
    },
    {
      type: 'link',
      href: '/doctor/appointments',
      icon: <Calendar />,
      label: 'Lịch hẹn của tôi',
    },
    { type: 'link', href: '/doctor/profile', icon: <IdCard />, label: 'Hồ sơ' },
  ];

  // admin menu: include a dropdown item (type:'dropdown')
  const adminMenu: MenuItem[] = [
    {
      type: 'link',
      href: '/admin/dashboard',
      icon: <Home />,
      label: 'Bảng điều khiển',
    },

    {
      type: 'dropdown',
      label: 'Quản lý người dùng',
      icon: <Users />,
      open: openUserMenu,
      toggle: () => setOpenUserMenu((v) => !v),
      children: [
        {
          href: '/admin/users/doctor',
          label: 'Bác sĩ',
          icon: <Stethoscope />,
        },
        { href: '/admin/users/patient', label: 'Bệnh nhân', icon: <User /> },
      ],
    },

    {
      type: 'link',
      href: '/admin/departments',
      icon: <Building />,
      label: 'Khoa',
    },
    {
      type: 'link',
      href: '/admin/symptoms',
      icon: <AlertCircle />,
      label: 'Triệu chứng',
    },
    {
      type: 'link',
      href: '/admin/appointments',
      icon: <ClipboardList />,
      label: 'Lịch hẹn',
    },
    { type: 'link', href: '/admin/profile', icon: <IdCard />, label: 'Hồ sơ' },
  ];

  const menuItems: MenuItem[] = role === 'ADMIN' ? adminMenu : doctorMenu;

  return (
    <aside className={`bg-white border-r min-h-screen p-4 ${className}`}>
      <h2 className="text-lg font-bold mb-4 text-blue-600">
        {role === 'ADMIN' ? 'Quản trị' : 'Bác sĩ'}
      </h2>

      <nav className="space-y-2">
        {menuItems.map((item) => {
          if (item.type === 'dropdown') {
            // TS knows item is MenuDropdown here
            return (
              <div key={item.label}>
                <button
                  onClick={item.toggle}
                  className="flex items-center justify-between w-full px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition"
                >
                  <div className="flex items-center gap-2">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${item.open ? 'rotate-180' : ''}`}
                  />
                </button>

                {item.open && (
                  <div className="ml-6 mt-1 flex flex-col gap-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="flex items-center gap-2 px-3 py-1 text-sm text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md"
                      >
                        {child.icon}
                        <span>{child.label}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          // else it's MenuLink (TS narrows)
          return (
            <SideItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              danger={item.danger}
            />
          );
        })}

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
  const { session, status, logout: handleAuthLogout, isAuthenticated, userName: authUserName, userEmail } = useAuth();

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2 rounded-md
      ${danger ? 'text-red-600' : 'text-gray-700'}
      hover:bg-gray-100 transition`}
      onClick = {() => handleAuthLogout()}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}
