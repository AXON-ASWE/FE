'use client';

import { Search, Heart, Calendar, Clock, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { useState } from 'react';

const doctors = [
  {
    id: 1,
    name: 'Dr. Sarah Johnson',
    specialty: 'Neurologist',
    rating: 4.8,
    experience: '12 years exp',
    price: 150,
    image:
      'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
  },
  {
    id: 2,
    name: 'Dr. Michael Chen',
    specialty: 'Gastroenterologist',
    rating: 4.9,
    experience: '15 years exp',
    price: 175,
    image:
      'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
  },
  {
    id: 3,
    name: 'Dr. Emily Williams',
    specialty: 'Cardiologist',
    rating: 4.7,
    experience: '18 years exp',
    price: 200,
    image:
      'https://images.pexels.com/photos/5214959/pexels-photo-5214959.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
  },
];

export default function Home() {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');
  const handleSearch = () => {
    if (!searchText.trim()) return;
    router.push(`/find?q=${encodeURIComponent(searchText)}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Your Health, Our Priority
          </h1>
          <p className="text-lg md:text-xl mb-8 text-blue-100">
            Book appointments with top doctors based on your symptoms. Quality
            healthcare at your fingertips.
          </p>

          <div className="max-w-2xl mx-auto">
            <div className="flex gap-2 bg-white rounded-lg p-2 shadow-lg">
              <div className="flex items-center flex-1 px-3">
                <Search className="h-5 w-5 text-gray-400 mr-2" />
                <Input
                  type="text"
                  placeholder="Enter your symptoms (e.g., headache, fever)"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)} // ✅ cập nhật input
                  className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-gray-900 placeholder:text-gray-500"
                />
              </div>
              <Button
                onClick={handleSearch}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8"
              >
                Search
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border border-gray-200 hover:shadow-lg transition-shadow">
            <CardContent className="pt-8 pb-6 text-center">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Expert Doctors
              </h3>
              <p className="text-sm text-gray-600">
                Certified and experienced healthcare professionals
              </p>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 hover:shadow-lg transition-shadow">
            <CardContent className="pt-8 pb-6 text-center">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Easy Booking</h3>
              <p className="text-sm text-gray-600">
                Schedule appointments in just a few clicks
              </p>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 hover:shadow-lg transition-shadow">
            <CardContent className="pt-8 pb-6 text-center">
              <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Flexible Timings
              </h3>
              <p className="text-sm text-gray-600">
                Morning and evening slots available
              </p>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 hover:shadow-lg transition-shadow">
            <CardContent className="pt-8 pb-6 text-center">
              <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Safe & Secure
              </h3>
              <p className="text-sm text-gray-600">
                Your health data is protected and private
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Top Rated Doctors
            </h2>
            <p className="text-gray-600">
              Meet our most experienced healthcare professionals
            </p>
          </div>
          <Button
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            View All
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doctor) => (
            <Card
              key={doctor.id}
              className="border border-gray-200 hover:shadow-xl transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {doctor.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {doctor.specialty}
                    </p>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="flex items-center text-yellow-500">
                        ⭐ {doctor.rating}
                      </span>
                      <span className="flex items-center text-gray-500">
                        <Clock className="h-3 w-3 mr-1" />
                        {doctor.experience}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4 pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span className="text-sm text-green-600 font-medium">
                      Available
                    </span>
                  </div>
                  <span className="text-lg font-semibold text-gray-900">
                    ${doctor.price}
                  </span>
                </div>

                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => router.push(`/book/${doctor.id}`)}
                >
                  Book Appointment
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-gray-100 py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-gray-600 mb-8">
            Find the right doctor for your symptoms and book an appointment
            today. Quality healthcare is just a click away.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8">
              Find a Doctor
            </Button>
            <Button
              variant="outline"
              className="border-gray-300 bg-white hover:bg-gray-50"
            >
              View My Appointments
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
