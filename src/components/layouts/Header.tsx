'use client';

import Link from 'next/link';
import { Heart, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function Header() {
  const router = useRouter();

  return (
    <header className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => router.push('/')}
          >
            <Heart className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-semibold text-gray-900">
              HealthCare+
            </span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-blue-600 font-medium">
              Home
            </Link>
            <Link
              href="/appointments"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <Calendar className="h-4 w-4" /> My Appointments
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              className="text-gray-700 hover:text-gray-900"
            >
              Find a Doctor
            </Button>
            <Button className="bg-black text-white hover:bg-gray-800">
              Book Now
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
