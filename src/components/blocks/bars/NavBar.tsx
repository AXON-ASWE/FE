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
  Search,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/Sessioncontext';

const patientMenu = [
  {
    title: 'Trang chủ',
    href: '/',
    icon: <Home className="h-4 w-4" />,
  },
  {
    title: 'Tìm bác sĩ',
    href: '/find',
    icon: <Search className="h-4 w-4" />,
  },
  {
    title: 'Lịch hẹn của tôi',
    href: '/appointments',
    icon: <Calendar className="h-4 w-4" />,
  },
];

export function Navbar() {
  const router = useRouter();

  const {
    session,
    logout: handleAuthLogout,
    isAuthenticated,
    userName: authUserName,
    userEmail,
  } = useAuth();

  const role = session?.role; // ADMIN / DOCTOR / PATIENT
  const isPatient = role === 'PATIENT'; // ✅ chỉ patient mới có menuItems

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isLoggedIn = isAuthenticated;
  const displayName = authUserName || session?.name || 'Người dùng';

  const handleLogout = async () => {
    await handleAuthLogout();
    setMobileMenuOpen(false);
  };

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

          {/* DESKTOP MENU */}
          <div className="hidden lg:flex items-center gap-8">
            {isPatient &&
              patientMenu.map((item) => (
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

          {/* RIGHT SIDE */}
          <div className="hidden lg:flex items-center gap-3">
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="text-gray-700 hover:text-gray-900 hover:bg-gray-50 dark:text-slate-300 dark:hover:text-slate-100 dark:hover:bg-slate-700 flex items-center gap-2"
                  >
                    <User size={16} />
                    <span>{displayName}</span>
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
                        {userEmail || session?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push('/profile')} className="cursor-pointer">
                    <User className="mr-2" size={16} />
                    Thông tin cá nhân
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />

                  {/* LOGOUT */}
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
                  <Button className="bg-gray-900 text-white hover:bg-gray-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200">
                    Đăng ký
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* MOBILE TOGGLE */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-slate-700"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* MOBILE MENU */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200 dark:border-slate-700">
            <div className="flex flex-col space-y-1">
              {/* Only patient sees these */}
              {isPatient &&
                patientMenu.map((item) => (
                  <Link
                    key={item.title}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 rounded-md hover:bg-gray-50 dark:hover:bg-slate-700"
                  >
                    {item.icon} {item.title}
                  </Link>
                ))}

              {/* Account section */}
              <div className="flex flex-col gap-2 pt-4 px-4 border-t border-gray-200 dark:border-slate-700 mt-2">
                {isLoggedIn ? (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => router.push('/profile')}
                    >
                      <User size={16} /> Thông tin cá nhân
                    </Button>

                    <Button
                      variant="outline"
                      onClick={handleLogout}
                      className="text-red-600 dark:text-red-400 border-red-200 dark:border-red-900 hover:bg-red-50 dark:hover:bg-red-950"
                    >
                      <LogOut size={16} /> Đăng xuất
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/auth/login">
                      <Button variant="outline" className="w-full">
                        Đăng nhập
                      </Button>
                    </Link>
                    <Link href="/auth/signup">
                      <Button className="w-full bg-gray-900 text-white">
                        Đăng ký
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
