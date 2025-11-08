'use client';

import { useMemo, useState } from 'react';

// Import table components dùng chung (shadcn)
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/Input';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  ChevronDown,
  ChevronUp,
  Edit,
  Lock,
  Unlock,
  Trash2,
  Plus,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/Label';
import { useToast } from '@/hooks/use-toast';
import { adminOperation } from '@/lib/BE-library/main';
import { PatientResponse, UpdatePatientPayload } from '@/lib/BE-library/interfaces';
import { useEffect } from 'react';

// -------------------------------------------------------
//  DỮ LIỆU DEMO MÔ PHỎNG DATABASE
// -------------------------------------------------------

type BaseUser = {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  status: 'Active' | 'Locked';
  createdAt: string;
};

type AdminUser = BaseUser & { role: 'admin' };

type DoctorUser = BaseUser & {
  role: 'doctor';
  specialization: string;
  experienceYears: number;
  qualification: string;
  departmentName: string;
};

type PatientUser = BaseUser & {
  role: 'patient';
  insuranceNumber: string;
  emergencyContact: string;
  medicalHistory: string;
};

type Role = 'admin' | 'doctor' | 'patient';

type RoleMap = {
  admin: AdminUser[];
  doctor: DoctorUser[];
  patient: PatientUser[];
};

const MOCK_DATA: RoleMap = {
  admin: [
    {
      id: 1,
      fullName: 'Super Admin',
      email: 'super@hospital.vn',
      phone: '0909123456',
      role: 'admin',
      status: 'Active',
      createdAt: '2024-01-01',
    },
  ],
  doctor: [
    {
      id: 10,
      fullName: 'BS. Nguyễn Văn A',
      email: 'doctorA@hospital.vn',
      phone: '0900888999',
      role: 'doctor',
      status: 'Active',
      createdAt: '2024-02-01',
      specialization: 'Tim mạch',
      experienceYears: 5,
      qualification: 'Bác sĩ CK1',
      departmentName: 'Khoa Tim Mạch',
    },
  ],
  patient: [
    {
      id: 100,
      fullName: 'Trần Thị B',
      email: 'patient@hospital.vn',
      phone: '0933222111',
      role: 'patient',
      status: 'Active',
      createdAt: '2024-03-01',
      insuranceNumber: 'BHXH-123456',
      emergencyContact: 'Nguyễn Văn C - 0988123123',
      medicalHistory: 'Huyết áp cao',
    },
  ],
};

// -------------------------------------------------------
//  COMPONENT BẢNG QUẢN LÝ
// -------------------------------------------------------

function UserTable({ role }: { role: Role }) {
  const { toast } = useToast();

  const [data, setData] = useState<RoleMap[Role]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch data based on role
  useEffect(() => {
    const fetchData = async () => {
      if (role === 'patient') {
        try {
          const response = await adminOperation.getAllPatients();
          if (response.success && response.data) {
            // Transform API data to component format
            const transformedPatients: PatientUser[] = response.data.map(patient => ({
              id: patient.patientId,
              fullName: patient.fullName,
              email: patient.email,
              phone: patient.phone || '',
              role: 'patient',
              status: patient.status === 'ACTIVE' ? 'Active' : 'Locked',
              createdAt: patient.createdAt.split('T')[0], // Format date
              insuranceNumber: patient.insuranceNumber || '',
              emergencyContact: patient.emergencyContact || '',
              medicalHistory: 'Chưa có thông tin', // API không có field này
            }));
            setData(transformedPatients as RoleMap[Role]);
          } else {
            console.error('Failed to fetch patients:', response.message);
            toast({
              title: 'Lỗi',
              description: response.message || 'Không thể tải danh sách bệnh nhân',
              variant: 'destructive'
            });
          }
        } catch (error) {
          console.error('Error fetching patients:', error);
          toast({
            title: 'Lỗi',
            description: 'Có lỗi xảy ra khi tải danh sách bệnh nhân',
            variant: 'destructive'
          });
        }
      } else {
        // For admin and doctor roles, use mock data (no API available)
        setData(MOCK_DATA[role] as RoleMap[Role]);
      }
      setLoading(false);
    };

    fetchData();
  }, [role, toast]);

  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState('fullName');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const [editing, setEditing] = useState<RoleMap[Role][number] | null>(null);

  const filtered = useMemo(() => {
    let arr = [...data];

    if (search) {
      const s = search.toLowerCase();
      arr = arr.filter(
        (e) =>
          e.fullName.toLowerCase().includes(s) ||
          e.email.toLowerCase().includes(s) ||
          e.phone.toLowerCase().includes(s)
      );
    }

    arr.sort((a: any, b: any) => {
      const A = a[sortField]?.toString() ?? '';
      const B = b[sortField]?.toString() ?? '';
      return sortOrder === 'asc'
        ? A.localeCompare(B, 'vi')
        : B.localeCompare(A, 'vi');
    });

    return arr;
  }, [data, search, sortField, sortOrder]);

  // =================== PAGINATION =====================
  const [page, setPage] = useState(1);
  const [pageSize] = useState(5);
  const totalPages = Math.ceil(filtered.length / pageSize);
  const pageData = filtered.slice((page - 1) * pageSize, page * pageSize);

  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder((p) => (p === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // =================== GENERATE EMPTY USER =====================
  const generateEmptyUser = (): RoleMap[Role][number] => {
    if (role === 'admin') {
      return {
        id: 0,
        fullName: '',
        email: '',
        phone: '',
        role: 'admin',
        status: 'Active',
        createdAt: '',
      } as AdminUser;
    }

    if (role === 'doctor') {
      return {
        id: 0,
        fullName: '',
        email: '',
        phone: '',
        role: 'doctor',
        status: 'Active',
        createdAt: '',
        specialization: '',
        experienceYears: 0,
        qualification: '',
        departmentName: '',
      } as DoctorUser;
    }

    return {
      id: 0,
      fullName: '',
      email: '',
      phone: '',
      role: 'patient',
      status: 'Active',
      createdAt: '',
      insuranceNumber: '',
      emergencyContact: '',
      medicalHistory: '',
    } as PatientUser;
  };

  // =================== HANDLE SAVE =====================
  const handleSave = async () => {
    if (!editing) return;

    try {
      if (role === 'patient' && editing.role === 'patient') {
        const patientEditing = editing as PatientUser;
        
        if (patientEditing.id === 0) {
          // Create new patient - API không hỗ trợ admin tạo patient
          toast({
            title: 'Thông báo',
            description: 'Chức năng tạo bệnh nhân mới đang được phát triển',
          });
        } else {
          // Update existing patient
          const updatePayload: UpdatePatientPayload = {
            email: patientEditing.email,
            fullName: patientEditing.fullName,
            phone: patientEditing.phone,
            // gender: patientEditing.gender, // Không có field này trong PatientUser type
            emergencyContact: patientEditing.emergencyContact,
            insuranceNumber: patientEditing.insuranceNumber,
            status: patientEditing.status === 'Active' ? 'ACTIVE' : 'INACTIVE',
          };

          const response = await adminOperation.updatePatient(patientEditing.id, updatePayload);
          if (response.success && response.data) {
            // Update local state
            setData(
              (prev) =>
                prev.map((u) => (u.id === editing.id ? editing : u)) as RoleMap[Role]
            );
            toast({ title: 'Đã cập nhật bệnh nhân' });
          } else {
            throw new Error(response.message || 'Không thể cập nhật bệnh nhân');
          }
        }
      } else {
        // For admin and doctor roles, use local state (no API)
        if (editing.id === 0) {
          setData(
            (prev) =>
              [
                ...prev,
                {
                  ...editing,
                  id: Date.now(),
                  createdAt: new Date().toISOString(),
                },
              ] as RoleMap[Role]
          );
          toast({ title: 'Đã tạo mới' });
        } else {
          setData(
            (prev) =>
              prev.map((u) => (u.id === editing.id ? editing : u)) as RoleMap[Role]
          );
          toast({ title: 'Đã cập nhật' });
        }
      }

      setEditing(null);
    } catch (error: any) {
      console.error('Error saving user:', error);
      toast({
        title: 'Lỗi',
        description: error.message || 'Có lỗi xảy ra khi lưu thông tin',
        variant: 'destructive'
      });
    }
  };

  const toggleStatus = (id: number) => {
    setData(
      (p) =>
        p.map((u) =>
          u.id === id
            ? { ...u, status: u.status === 'Active' ? 'Locked' : 'Active' }
            : u
        ) as RoleMap[Role]
    );
  };

  const deleteUser = async (id: number) => {
    try {
      if (role === 'patient') {
        const response = await adminOperation.deletePatient(id);
        if (response.success) {
          setData((p) => p.filter((u) => u.id !== id) as RoleMap[Role]);
          toast({ title: 'Đã xóa bệnh nhân' });
        } else {
          throw new Error(response.message || 'Không thể xóa bệnh nhân');
        }
      } else {
        // For admin and doctor, use local state
        setData((p) => p.filter((u) => u.id !== id) as RoleMap[Role]);
        toast({ title: 'Đã xóa người dùng' });
      }
    } catch (error: any) {
      console.error('Error deleting user:', error);
      toast({
        title: 'Lỗi',
        description: error.message || 'Có lỗi xảy ra khi xóa người dùng',
        variant: 'destructive'
      });
    }
  };

  // ================= COLUMN DEFINITIONS =====================
  const columns = {
    admin: ['fullName', 'email', 'phone', 'status', 'createdAt'],
    doctor: [
      'fullName',
      'email',
      'phone',
      'specialization',
      'departmentName',
      'experienceYears',
      'status',
    ],
    patient: [
      'fullName',
      'email',
      'phone',
      'insuranceNumber',
      'emergencyContact',
      'status',
    ],
  }[role];

  const columnLabels: Record<string, string> = {
    fullName: 'Họ tên',
    email: 'Email',
    phone: 'SĐT',
    status: 'Trạng thái',
    createdAt: 'Ngày tạo',
    specialization: 'Chuyên khoa',
    experienceYears: 'KN',
    qualification: 'Trình độ',
    departmentName: 'Khoa',
    insuranceNumber: 'Số BHYT',
    emergencyContact: 'Người thân LH',
    medicalHistory: 'Tiền sử bệnh',
  };

  // =================== UI =====================

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-xl font-semibold">
            {role === 'admin' && 'Quản trị viên'}
            {role === 'doctor' && 'Quản lý bác sĩ'}
            {role === 'patient' && 'Quản lý bệnh nhân'}
          </CardTitle>

          <Button
            size="sm"
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => {
              setEditing(generateEmptyUser());
            }}
          >
            <Plus className="w-4 h-4 mr-1" /> Thêm mới
          </Button>
        </CardHeader>

        <div className="px-4 pb-3">
          <Input
            placeholder="Tìm kiếm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((c) => (
                  <TableHead
                    key={c}
                    className="cursor-pointer"
                    onClick={() => toggleSort(c)}
                  >
                    <div className="flex items-center gap-1">
                      {columnLabels[c]}
                      {sortField === c &&
                        (sortOrder === 'asc' ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        ))}
                    </div>
                  </TableHead>
                ))}
                <TableHead className="text-center">Hành động</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {pageData.map((u) => (
                <TableRow key={u.id}>
                  {columns.map((c) => (
                    <TableCell key={c}>{(u as any)[c] ?? '-'}</TableCell>
                  ))}

                  <TableCell className="text-center">
                    <div className="flex gap-2 justify-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditing(u);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleStatus(u.id)}
                      >
                        {u.status === 'Active' ? (
                          <Lock className="w-4 h-4 text-red-600" />
                        ) : (
                          <Unlock className="w-4 h-4 text-green-600" />
                        )}
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteUser(u.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}

              {pageData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-6">
                    Không có dữ liệu
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>

        {/* Pagination */}
        <div className="flex items-center justify-between p-4">
          <span>
            Trang {page} / {totalPages || 1}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Prev
            </Button>
            <Button
              variant="outline"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </Card>

      {/* POPUP EDIT */}
      <Dialog open={!!editing} onOpenChange={() => setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing?.id ? 'Chỉnh sửa' : 'Tạo mới'}</DialogTitle>
          </DialogHeader>

          {editing && (
            <div className="space-y-3">
              <div>
                <Label>Họ tên</Label>
                <Input
                  value={editing.fullName}
                  onChange={(e) =>
                    setEditing({ ...editing, fullName: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>Email</Label>
                <Input
                  value={editing.email}
                  onChange={(e) =>
                    setEditing({ ...editing, email: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>SĐT</Label>
                <Input
                  value={editing.phone}
                  onChange={(e) =>
                    setEditing({ ...editing, phone: e.target.value })
                  }
                />
              </div>

              {editing.role === 'doctor' && (
                <>
                  <div>
                    <Label>Chuyên khoa</Label>
                    <Input
                      value={editing.specialization}
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          specialization: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <Label>Khoa</Label>
                    <Input
                      value={editing.departmentName}
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          departmentName: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <Label>Kinh nghiệm (năm)</Label>
                    <Input
                      value={editing.experienceYears}
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          experienceYears: +e.target.value,
                        })
                      }
                    />
                  </div>
                </>
              )}

              {editing.role === 'patient' && (
                <>
                  <div>
                    <Label>Số BHYT</Label>
                    <Input
                      value={editing.insuranceNumber}
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          insuranceNumber: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <Label>Người thân liên hệ</Label>
                    <Input
                      value={editing.emergencyContact}
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          emergencyContact: e.target.value,
                        })
                      }
                    />
                  </div>
                </>
              )}
            </div>
          )}

          <DialogFooter className="mt-3">
            <Button onClick={handleSave} className="w-full">
              Lưu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

// -------------------------------------------------------
//  PAGE CHÍNH
// -------------------------------------------------------

export default function Page({ params }: { params: { role: string } }) {
  const { role } = params;

  if (!['admin', 'doctor', 'patient'].includes(role)) {
    return (
      <div className="p-10 text-center">
        <h1 className="text-xl font-semibold">Role không hợp lệ</h1>
      </div>
    );
  }

  return <UserTable role={role as Role} />;
}
