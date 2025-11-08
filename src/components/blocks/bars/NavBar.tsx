'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Calendar, Menu, X, ChevronDown, LogOut, User, Settings, Heart, Home, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from '@/components/ui/navigation-menu';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { useAuth } from '@/context/Sessioncontext';

const menuItems = [
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
  const { session, status, logout: handleAuthLogout, isAuthenticated, userName: authUserName, userEmail } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedMobileItem, setExpandedMobileItem] = useState<string | null>(null);

  const handleLogout = async () => {
    await handleAuthLogout();
    setMobileMenuOpen(false);
  };

  const isLoggedIn = isAuthenticated;
  const displayName = authUserName || session?.name || 'Người dùng';

  return (
    <nav className="sticky top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-gray-100 dark:border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-semibold text-gray-900">HealthCare+</span>
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden lg:flex items-center gap-8">
            {menuItems.map((item) => (
              <Link key={item.title} href={item.href} className="flex items-center gap-2 text-blue-600 font-medium">
                <span className="text-blue-600">{item.icon}</span>
                {item.title}
              </Link>
            ))}
          </div>

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
                    <span>{displayName}</span>
                    <ChevronDown size={14} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">Tài khoản của tôi</p>
                      <p className="text-xs text-muted-foreground">{userEmail || session?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
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
                  <Button variant="ghost" className="text-gray-700 dark:text-slate-300 hover:text-gray-900 dark:hover:text-slate-100 hover:bg-gray-50 dark:hover:bg-slate-700">
                    Đăng nhập
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button className="bg-gray-900 hover:bg-gray-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 text-white">
                    Đăng ký
                  </Button>
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
        {mobileMenuOpen && (
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
              {/* Auth & Profile links for mobile */}
              <div className="flex flex-col gap-2 pt-4 px-4 border-t border-gray-200 dark:border-slate-700 mt-2">
                {isLoggedIn ? (
                  <>
                    <div className="mb-2 px-3 py-2 rounded-md bg-slate-800">
                      <div className="flex items-center gap-2">
                        <User size={16} className="text-muted-foreground" />
                        <span className="text-sm">Xin chào, {displayName}</span>
                      </div>
                    </div>
                    <Button variant="outline" onClick={() => { setMobileMenuOpen(false); router.push('/profile'); }}>
                      <User size={16} /> Thông tin cá nhân
                    </Button>
                    <Button variant="outline" onClick={() => { setMobileMenuOpen(false); router.push('/profile/change_password'); }}>
                      <Settings size={16} /> Đổi mật khẩu
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                      className="text-red-600 dark:text-red-400 border-red-200 dark:border-red-900 hover:bg-red-50 dark:hover:bg-red-950"
                    >
                      <LogOut size={16} /> Đăng xuất
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/auth/login">
                      <Button variant="outline" className="w-full">Đăng nhập</Button>
                    </Link>
                    <Link href="/auth/signup">
                      <Button className="w-full bg-gray-900 text-white dark:bg-slate-100 dark:text-slate-900">Đăng ký</Button>
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
