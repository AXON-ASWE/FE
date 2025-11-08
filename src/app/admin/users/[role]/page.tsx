'use client';

import { useMemo, useState } from 'react';


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
import { 
  PatientResponse, 
  UpdatePatientPayload,
  DetailedDoctorResponse,
  UpdateDoctorPayload,
  CreateDoctorPayload,
  DepartmentResponse
} from '@/lib/BE-library/interfaces';
import { useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';





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
  departmentId: number;
  doctorId?: number;
  userId?: number;
};

type PatientUser = BaseUser & {
  role: 'patient';
  insuranceNumber: string;
  emergencyContact: string;
  medicalHistory: string;
};

type Role = 'ADMIN' | 'DOCTOR' | 'PATIENT';

type RoleMap = {
  ADMIN: AdminUser[];
  DOCTOR: DoctorUser[];
  PATIENT: PatientUser[];
};

const MOCK_DATA: RoleMap = {
  ADMIN: [
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
  DOCTOR: [
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
      departmentId: 1,
      doctorId: 10,
      userId: 10,
    },
  ],
  PATIENT: [
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





function UserTable({ role }: { role: Role }) {
  const { toast } = useToast();

  const [data, setData] = useState<RoleMap[Role]>([]);
  const [loading, setLoading] = useState(true);
  const [departments, setDepartments] = useState<DepartmentResponse[]>([]);

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch departments for doctors
        if (role === 'DOCTOR') {
          const deptResponse = await adminOperation.getAllDepartments();
          if (deptResponse.success && deptResponse.data) {
            setDepartments(deptResponse.data);
          }
        }

        if (role === 'PATIENT') {
          const response = await adminOperation.getAllPatients();
          if (response.success && response.data) {
            
            const transformedPatients: PatientUser[] = response.data.map(patient => ({
              id: patient.patientId,
              fullName: patient.fullName,
              email: patient.email,
              phone: patient.phone || '',
              role: 'patient',
              status: patient.status === 'ACTIVE' ? 'Active' : 'Locked',
              createdAt: patient.createdAt.split('T')[0], 
              insuranceNumber: patient.insuranceNumber || '',
              emergencyContact: patient.emergencyContact || '',
              medicalHistory: patient.address || 'Chưa có thông tin', 
            }));
            setData(transformedPatients as RoleMap[Role]);
          } else {
            throw new Error(response.message || 'Không thể tải danh sách bệnh nhân');
          }
        } else if (role === 'DOCTOR') {
          const response = await adminOperation.getAllDoctorsAdmin();
          if (response.success && response.data) {
            
            const transformedDoctors: DoctorUser[] = response.data.map(doctor => ({
              id: doctor.userId,
              fullName: doctor.doctorName,
              email: doctor.doctorEmail,
              phone: doctor.doctorPhone,
              role: 'doctor',
              status: 'Active', 
              createdAt: new Date().toISOString().split('T')[0], 
              specialization: 'Chưa có thông tin', 
              experienceYears: doctor.experience,
              qualification: 'Chưa có thông tin', 
              departmentName: doctor.departmentName,
              departmentId: doctor.departmentId,
              doctorId: doctor.doctorId,
            }));
            setData(transformedDoctors as RoleMap[Role]);
          } else {
            throw new Error(response.message || 'Không thể tải danh sách bác sĩ');
          }
        } else {
          
          setData(MOCK_DATA[role] as RoleMap[Role]);
        }
      } catch (error: any) {
        console.error('Error fetching data:', error);
        toast({
          title: 'Lỗi',
          description: error.message || `Có lỗi xảy ra khi tải danh sách ${role === 'PATIENT' ? 'bệnh nhân' : role === 'DOCTOR' ? 'bác sĩ' : 'quản trị viên'}`,
          variant: 'destructive'
        });
        
        setData(MOCK_DATA[role] as RoleMap[Role]);
      } finally {
        setLoading(false);
      }
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

  
  const generateEmptyUser = (): RoleMap[Role][number] => {
    if (role === 'ADMIN') {
      return {
        fullName: '',
        email: '',
        phone: '',
        role: 'admin',
        status: 'Active',
        createdAt: '',
      } as AdminUser;
    }

    if (role === 'DOCTOR') {
      return {
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
        departmentId: 0,
        doctorId: 0,
        userId: 0,
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

  
  const handleSave = async () => {
    if (!editing) return;

    try {
      if (role === 'PATIENT' && editing.role === 'patient') {
        const patientEditing = editing as PatientUser;
        
        if (patientEditing.id === 0) {
          
          toast({
            title: 'Thông báo',
            description: 'Chức năng tạo bệnh nhân mới đang được phát triển',
          });
          return;
        } else {
          
          const updatePayload: UpdatePatientPayload = {
            email: patientEditing.email,
            fullName: patientEditing.fullName,
            phone: patientEditing.phone,
            emergencyContact: patientEditing.emergencyContact,
            insuranceNumber: patientEditing.insuranceNumber,
            address: patientEditing.medicalHistory, 
            status: patientEditing.status === 'Active' ? 'ACTIVE' : 'INACTIVE',
          };

          const response = await adminOperation.updatePatient(patientEditing.id, updatePayload);
          if (response.success && response.data) {
            
            setData(
              (prev) =>
                prev.map((u) => (u.id === editing.id ? editing : u)) as RoleMap[Role]
            );
            toast({ title: 'Đã cập nhật bệnh nhân' });
          } else {
            throw new Error(response.message || 'Không thể cập nhật bệnh nhân');
          }
        }
      } else if (role === 'DOCTOR' && editing.role === 'doctor') {
        const doctorEditing = editing as DoctorUser;
        
        if (doctorEditing.id === 0) {
          
          if (!doctorEditing.departmentId || doctorEditing.departmentId === 0) {
            toast({
              title: 'Lỗi',
              description: 'Vui lòng chọn khoa cho bác sĩ',
              variant: 'destructive'
            });
            return;
          }

          const createPayload: UpdateDoctorPayload = {
            fullName: doctorEditing.fullName,
            phone: doctorEditing.phone,
            specialization: doctorEditing.specialization,
            experienceYears: doctorEditing.experienceYears,
            qualifications: doctorEditing.qualification,
            departmentId: doctorEditing.departmentId,
          };

          const response = await adminOperation.updateDoctorAdmin(doctorEditing.id, createPayload);
          if (response.success) {
            
            const updatedResponse = await adminOperation.getAllDoctorsAdmin();
            if (updatedResponse.success && updatedResponse.data) {
              const transformedDoctors: DoctorUser[] = updatedResponse.data.map(doctor => ({
                id: doctor.userId,
                fullName: doctor.doctorName,
                email: doctor.doctorEmail,
                phone: doctor.doctorPhone,
                role: 'doctor',
                status: 'Active',
                createdAt: new Date().toISOString().split('T')[0],
                specialization: doctorEditing.specialization || 'Chưa có thông tin',
                experienceYears: doctor.experience,
                qualification: doctorEditing.qualification || 'Chưa có thông tin',
                departmentName: doctor.departmentName,
                departmentId: doctor.departmentId,
                doctorId: doctor.doctorId,
              }));
              setData(transformedDoctors as RoleMap[Role]);
            }
            toast({ title: 'Đã tạo bác sĩ mới' });
          } else {
            throw new Error(response.message || 'Không thể tạo bác sĩ mới');
          }
        } else {
          
          const updatePayload: UpdateDoctorPayload = {
            fullName: doctorEditing.fullName,
            phone: doctorEditing.phone,
            specialization: doctorEditing.specialization,
            experienceYears: doctorEditing.experienceYears,
            qualifications: doctorEditing.qualification,
            departmentId: doctorEditing.departmentId,
          };

          const response = await adminOperation.updateDoctorAdmin(doctorEditing.doctorId || doctorEditing.id, updatePayload);
          if (response.success && response.data) {
            
            setData(
              (prev) =>
                prev.map((u) => (u.id === editing.id ? editing : u)) as RoleMap[Role]
            );
            toast({ title: 'Đã cập nhật bác sĩ' });
          } else {
            throw new Error(response.message || 'Không thể cập nhật bác sĩ');
          }
        }
      } else {
        
        if (editing.id === 0) {
          setData(
            (prev) =>
              [
                ...prev,
                {
                  ...editing,
                  id: Date.now(),
                  createdAt: new Date().toISOString().split('T')[0],
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

  const toggleStatus = async (id: number) => {
    try {
      const user = data.find(u => u.id === id);
      if (!user) return;

      const newStatus = user.status === 'Active' ? 'Locked' : 'Active';

      if (role === 'PATIENT') {
        const patientUser = user as PatientUser;
        const updatePayload: UpdatePatientPayload = {
          email: patientUser.email,
          fullName: patientUser.fullName,
          phone: patientUser.phone,
          emergencyContact: patientUser.emergencyContact,
          insuranceNumber: patientUser.insuranceNumber,
          address: patientUser.medicalHistory,
          status: newStatus === 'Active' ? 'ACTIVE' : 'INACTIVE',
        };

        const response = await adminOperation.updatePatient(id, updatePayload);
        if (response.success) {
          setData(
            (p) =>
              p.map((u) =>
                u.id === id ? { ...u, status: newStatus } : u
              ) as RoleMap[Role]
          );
          toast({ title: `Đã ${newStatus === 'Active' ? 'kích hoạt' : 'khóa'} bệnh nhân` });
        } else {
          throw new Error(response.message || 'Không thể cập nhật trạng thái');
        }
      } else {
        
        setData(
          (p) =>
            p.map((u) =>
              u.id === id ? { ...u, status: newStatus } : u
            ) as RoleMap[Role]
        );
        toast({ title: `Đã ${newStatus === 'Active' ? 'kích hoạt' : 'khóa'} người dùng` });
      }
    } catch (error: any) {
      console.error('Error toggling status:', error);
      toast({
        title: 'Lỗi',
        description: error.message || 'Có lỗi xảy ra khi cập nhật trạng thái',
        variant: 'destructive'
      });
    }
  };

  const deleteUser = async (id: number) => {
    try {
      if (role === 'PATIENT') {
        const response = await adminOperation.deletePatient(id);
        if (response.success) {
          setData((p) => p.filter((u) => u.id !== id) as RoleMap[Role]);
          toast({ title: 'Đã xóa bệnh nhân' });
        } else {
          throw new Error(response.message || 'Không thể xóa bệnh nhân');
        }
      } else if (role === 'DOCTOR') {
        const user = data.find(u => u.id === id) as DoctorUser;
        const doctorId = user?.doctorId || id;
        
        const response = await adminOperation.deleteDoctorAdmin(doctorId);
        if (response.success) {
          setData((p) => p.filter((u) => u.id !== id) as RoleMap[Role]);
          toast({ title: 'Đã xóa bác sĩ' });
        } else {
          throw new Error(response.message || 'Không thể xóa bác sĩ');
        }
      } else {
        
        setData((p) => p.filter((u) => u.id !== id) as RoleMap[Role]);
        toast({ title: 'Đã xóa quản trị viên' });
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

  
  const columns = {
    ADMIN: ['fullName', 'email', 'phone', 'status', 'createdAt'],
    DOCTOR: [
      'fullName',
      'email',
      'phone',
      'specialization',
      'departmentName',
      'experienceYears',
      'qualification',
      'status',
    ],
    PATIENT: [
      'fullName',
      'email',
      'phone',
      'insuranceNumber',
      'emergencyContact',
      'medicalHistory',
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
            {role === 'ADMIN' && 'Quản trị viên'}
            {role === 'DOCTOR' && 'Quản lý bác sĩ'}
            {role === 'PATIENT' && 'Quản lý bệnh nhân'}
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
                    <Select
                      value={editing.departmentId?.toString() || ''}
                      onValueChange={(value) => {
                        const selectedDept = departments.find(d => d.departmentId.toString() === value);
                        setEditing({
                          ...editing,
                          departmentId: parseInt(value),
                          departmentName: selectedDept?.departmentName || '',
                        });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn khoa" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept.departmentId} value={dept.departmentId.toString()}>
                            {dept.departmentName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Kinh nghiệm (năm)</Label>
                    <Input
                      type="number"
                      value={editing.experienceYears}
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          experienceYears: +e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <Label>Trình độ chuyên môn</Label>
                    <Input
                      value={editing.qualification}
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          qualification: e.target.value,
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

                  <div>
                    <Label>Tiền sử bệnh / Ghi chú</Label>
                    <Input
                      value={editing.medicalHistory}
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          medicalHistory: e.target.value,
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





export default function Page({ params }: { params: { role: string } }) {
  const role = params.role.toUpperCase();
  console.log('Role param:', role);
  if (!['ADMIN', 'DOCTOR', 'PATIENT'].includes(role)) {
    return (
      <div className="p-10 text-center">
        <h1 className="text-xl font-semibold">Role không hợp lệ</h1>
      </div>
    );
  }

  return <UserTable role={role as Role} />;
}
