'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const doctor = {
  id: 1,
  name: 'Dr. Sarah Johnson',
  specialty: 'Neurologist',
  rating: 4.8,
  experience: '12 years experience',
  price: 150,
  department: 'Neurology',
  image:
    'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
};

export default function BookAppointmentPage() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<string | null>('2025-11-01');
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const timeSlots = [
    '09:00 AM',
    '09:30 AM',
    '10:00 AM',
    '10:30 AM',
    '11:00 AM',
    '11:30 AM',
    '02:00 PM',
    '02:30 PM',
    '03:00 PM',
    '03:30 PM',
    '04:00 PM',
    '04:30 PM',
    '05:00 PM',
    '05:30 PM',
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main content */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Doctor Info */}
        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <img
                src={doctor.image}
                alt={doctor.name}
                className="w-24 h-24 rounded-full object-cover"
              />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">
              {doctor.name}
            </h2>
            <p className="text-gray-600">{doctor.specialty}</p>

            <div className="mt-3">
              <span className="inline-block bg-green-100 text-green-700 text-sm px-3 py-1 rounded-full">
                {doctor.experience}
              </span>
            </div>

            <div className="mt-6 border-t pt-4 space-y-2 text-left">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Department</span>
                <span className="font-medium text-gray-900">
                  {doctor.department}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Date & Time */}
        <Card className="border border-gray-200 shadow-sm md:col-span-2">
          <CardContent className="p-6">
            <Button
              variant="ghost"
              className="mb-4 text-gray-600 flex items-center gap-2"
              onClick={() => router.back()}
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </Button>

            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Select Date & Time
            </h3>

            <div className="space-y-6">
              {/* Choose Date */}
              <div>
                <h4 className="flex items-center gap-2 text-gray-700 font-medium mb-3">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  Choose Date
                </h4>

                <input
                  type="date"
                  value={selectedDate ?? ''}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Choose Time Slot */}
              <div>
                <h4 className="flex items-center gap-2 text-gray-700 font-medium mb-3">
                  <Clock className="w-4 h-4 text-blue-600" />
                  Choose Time Slot
                </h4>

                <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setSelectedTime(slot)}
                      className={cn(
                        'px-4 py-2 border rounded-lg text-sm font-medium transition',
                        selectedTime === slot
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50'
                      )}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-6">
                <Button
                  disabled={!selectedDate || !selectedTime}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Confirm Appointment
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
