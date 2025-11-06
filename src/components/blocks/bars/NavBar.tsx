'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Menu,
  X,
  ChevronDown,
  LogOut,
  User,
  Settings,
  Heart,
  Home,
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Cookies from 'js-cookie';
import { useSession } from '@/context/Sessioncontext';
import React from 'react';

type Role = 'patient' | 'doctor' | 'admin';

interface MenuItem {
  title: string;
  href: string;
  icon: React.ReactNode;
}

const menusByRole: Record<Role, MenuItem[]> = {
  patient: [
    {
      title: 'Trang chủ',
      href: '/',
      icon: <Home className="h-4 w-4" />,
    },
    {
      title: 'Lịch hẹn của tôi',
      href: '/appointments',
      icon: <Calendar className="h-4 w-4" />,
    },
  ],
  doctor: [],
  admin: [],
};

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const { session, setSession } = useSession();

  const role = (session?.role as Role) ?? 'patient';
  const menuItems = menusByRole[role] ?? [];

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (pathname.startsWith('/auth')) return null;

  const handleLogout = () => {
    Cookies.remove('access_token', { path: '/' });
    Cookies.remove('refresh_token', { path: '/' });
    Cookies.remove('role', { path: '/' });

    setSession(null);
    router.push('/auth/login');
  };

  const isLoggedIn = Boolean(session);
  const userName = session?.name || 'Người dùng';

  return (
    <nav className="sticky top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-gray-100 dark:border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-semibold text-gray-900">
              HealthCare+
            </span>
          </Link>

          {/* DESKTOP MENU – chỉ hiển thị khi là bệnh nhân */}
          {role === 'patient' && (
            <div className="hidden lg:flex items-center gap-8">
              {menuItems.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className="flex items-center gap-2 text-blue-600 font-medium"
                >
                  <span className="text-blue-600">{item.icon}</span>
                  {item.title}
                </Link>
              ))}
            </div>
          )}

          {/* RIGHT SIDE (User / Auth Buttons) */}
          <div className="hidden lg:flex items-center gap-3">
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="text-gray-700 dark:text-slate-300 hover:text-gray-900 dark:hover:text-slate-100 hover:bg-gray-50 dark:hover:bg-slate-700 flex items-center gap-2"
                  >
                    <User size={16} />
                    <span>{userName}</span>
                    <ChevronDown size={14} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        Tài khoản của tôi
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {session?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => router.push('/profile')}
                    className="cursor-pointer"
                  >
                    <User className="mr-2" size={16} />
                    Thông tin cá nhân
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => router.push('/profile/change_password')}
                    className="cursor-pointer"
                  >
                    <Settings className="mr-2" size={16} />
                    Đổi mật khẩu
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400"
                  >
                    <LogOut className="mr-2" size={16} />
                    Đăng xuất
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="ghost">Đăng nhập</Button>
                </Link>
                <Link href="/auth/signup">
                  <Button className="bg-gray-900 text-white">Đăng ký</Button>
                </Link>
              </>
            )}
          </div>

          {/* MOBILE MENU TOGGLE */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-slate-700"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-gray-700 dark:text-slate-300" />
            ) : (
              <Menu className="h-6 w-6 text-gray-700 dark:text-slate-300" />
            )}
          </button>
        </div>

        {/* MOBILE DROPDOWN MENU */}
        {mobileMenuOpen && role === 'patient' && (
          <div className="lg:hidden py-4 border-t border-gray-200 dark:border-slate-700 animate-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-md"
                >
                  <span>{item.icon}</span> {item.title}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
