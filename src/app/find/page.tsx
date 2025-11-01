'use client';

import { useState, useEffect } from 'react';
import { Search, Info, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useSearchParams, useRouter } from 'next/navigation';

const departmentsMap: Record<string, string[]> = {
  headache: ['Neurology'],
  fever: ['General Medicine'],
  stomach: ['Gastroenterology'],
  chest: ['Cardiology'],
};

const doctors = [
  {
    id: 1,
    name: 'Dr. Sarah Johnson',
    specialty: 'Neurology',
    rating: 4.8,
    experience: '12 years exp',
    price: 150,
    image:
      'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
  },
  {
    id: 2,
    name: 'Dr. James Anderson',
    specialty: 'General Medicine',
    rating: 4.6,
    experience: '10 years exp',
    price: 100,
    image:
      'https://images.pexels.com/photos/8460151/pexels-photo-8460151.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
  },
  {
    id: 3,
    name: 'Dr. Michael Chen',
    specialty: 'Gastroenterology',
    rating: 4.9,
    experience: '15 years exp',
    price: 175,
    image:
      'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
  },
];

export default function FindPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  const [symptoms, setSymptoms] = useState(query);
  const [departments, setDepartments] = useState<string[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<typeof doctors>([]);

  useEffect(() => {
    if (query) handleSearch();
  }, []);

  const handleSearch = () => {
    const input = symptoms.toLowerCase().split(/[, ]+/);
    const matchedDepartments = new Set<string>();

    input.forEach((word) => {
      const found = departmentsMap[word];
      if (found) found.forEach((d) => matchedDepartments.add(d));
    });

    setDepartments(Array.from(matchedDepartments));

    const matchedDoctors = doctors.filter((doc) =>
      Array.from(matchedDepartments).includes(doc.specialty)
    );

    setFilteredDoctors(matchedDoctors);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
        {/* Search Section */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Find Doctor by Symptoms
          </h2>
          <p className="text-gray-600 mb-4">
            Enter your symptoms and we'll recommend the right specialists for
            you
          </p>

          <div className="flex gap-2">
            <div className="flex items-center flex-1 bg-gray-50 rounded-md px-3 border">
              <Search className="h-5 w-5 text-gray-400 mr-2" />
              <Input
                type="text"
                placeholder="e.g., headache, fever"
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
            <Button
              onClick={handleSearch}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Search
            </Button>
          </div>
        </Card>

        {/* Recommended Departments */}
        {departments.length > 0 && (
          <Card className="p-6 bg-blue-50 border border-blue-200">
            <div className="flex items-start gap-3">
              <Info className="h-6 w-6 text-blue-600 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Recommended Departments
                </h3>
                <p className="text-gray-600 mb-3">
                  Based on your symptoms, we recommend consulting with:
                </p>
                <div className="flex gap-2 flex-wrap">
                  {departments.map((dept) => (
                    <span
                      key={dept}
                      className="bg-blue-600 text-white text-sm px-3 py-1 rounded-full"
                    >
                      {dept}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Available Doctors */}
        {filteredDoctors.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Available Doctors</h3>
            <p className="text-gray-500 mb-6">
              {filteredDoctors.length} doctors available
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDoctors.map((doctor) => (
                <Card
                  key={doctor.id}
                  className="border border-gray-200 hover:shadow-lg"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <img
                        src={doctor.image}
                        alt={doctor.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">
                          {doctor.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {doctor.specialty}
                        </p>
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                          <span>⭐ {doctor.rating}</span>
                          <span className="flex items-center">
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
          </div>
        )}
      </div>
    </div>
  );
}
