'use client';

import { useState, useMemo } from 'react';
import { Plus, Edit, XCircle, ChevronUp, ChevronDown } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/Label';
import { useToast } from '@/hooks/use-toast';

export type Appointment = {
  id: number;
  doctorName: string;
  department: string;
  patientName: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  notes?: string;
  status: 'Sắp tới' | 'Hoàn thành' | 'Hủy';
};

export default function AppointmentsPage() {
  const { toast } = useToast();
  const departments = [
    {
      name: 'Tim mạch',
      doctors: ['BS. Trần Thị Bích', 'BS. Lê Hữu Toàn'],
    },
    {
      name: 'Tiêu hóa',
      doctors: ['BS. Phạm Văn Cường', 'BS. Nguyễn Thị Trang'],
    },
    {
      name: 'Da liễu',
      doctors: ['BS. Hoàng Minh Tuấn', 'BS. Lý Thị Mai'],
    },
  ];
  const timeSlots = [
    '08:00',
    '08:30',
    '09:00',
    '09:30',
    '10:00',
    '10:30',
    '11:00',
    '11:30',
    '14:00',
    '14:30',
    '15:00',
    '15:30',
    '16:00',
    '16:30',
    '17:00',
    '17:30',
  ];

  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: 1,
      doctorName: 'BS. Trần Thị Bích',
      department: 'Tim mạch',
      patientName: 'Nguyễn Văn An',
      appointmentDate: '2025-11-10',
      startTime: '08:00',
      endTime: '08:30',
      notes: 'Tái khám tim mạch',
      status: 'Sắp tới',
    },
    {
      id: 2,
      doctorName: 'BS. Phạm Văn Cường',
      department: 'Tiêu hóa',
      patientName: 'Lê Thị Hoa',
      appointmentDate: '2025-11-02',
      startTime: '10:00',
      endTime: '10:45',
      notes: 'Khám dạ dày',
      status: 'Hoàn thành',
    },
  ]);

  // ======== Search / Filter / Sort ========
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortField, setSortField] = useState<string>('appointmentDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const filteredData = useMemo(() => {
    let data = [...appointments];

    if (search) {
      const s = search.toLowerCase();
      data = data.filter(
        (a) =>
          a.doctorName.toLowerCase().includes(s) ||
          a.patientName.toLowerCase().includes(s) ||
          a.department.toLowerCase().includes(s) ||
          a.notes?.toLowerCase().includes(s)
      );
    }

    if (statusFilter) {
      data = data.filter((a) => a.status === statusFilter);
    }

    if (sortField) {
      data.sort((a: any, b: any) => {
        const valA = a[sortField]?.toString() ?? '';
        const valB = b[sortField]?.toString() ?? '';
        return sortOrder === 'asc'
          ? valA.localeCompare(valB, 'vi')
          : valB.localeCompare(valA, 'vi');
      });
    }

    return data;
  }, [appointments, search, statusFilter, sortField, sortOrder]);

  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder((p) => (p === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // ======== CRUD ========
  const [openEdit, setOpenEdit] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState<Appointment | null>(null);

  const [editing, setEditing] = useState<Appointment | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const err: Record<string, string> = {};
    if (!editing?.department) err.department = 'Khoa không được trống';
    if (!editing?.doctorName) err.doctorName = 'Bác sĩ không được trống';
    if (!editing?.patientName) err.patientName = 'Bệnh nhân không được trống';
    if (!editing?.appointmentDate) err.appointmentDate = 'Chọn ngày hẹn';
    if (!editing?.startTime) err.startTime = 'Chọn giờ bắt đầu';
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSave = () => {
    if (!validate() || !editing) return;
    if (editing.id === 0) {
      setAppointments((p) => [...p, { ...editing, id: Date.now() }]);
      toast({ title: 'Thành công', description: 'Thêm lịch hẹn mới' });
    } else {
      setAppointments((p) => p.map((a) => (a.id === editing.id ? editing : a)));
      toast({ title: 'Cập nhật thành công' });
    }
    setOpenEdit(false);
  };

  const handleCancel = (id: number) => {
    setAppointments((p) =>
      p.map((a) => (a.id === id ? { ...a, status: 'Hủy' as const } : a))
    );
    toast({ title: 'Đã hủy lịch hẹn' });
  };

  return (
    <>
      <Card className="shadow-sm border border-gray-200">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-xl font-semibold">
            Quản lý lịch hẹn
          </CardTitle>

          <Button
            size="sm"
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => {
              setEditing({
                id: 0,
                doctorName: '',
                department: '',
                patientName: '',
                appointmentDate: '',
                startTime: '',
                endTime: '',
                notes: '',
                status: 'Sắp tới',
              });
              setErrors({});
              setOpenEdit(true);
            }}
          >
            <Plus className="h-4 w-4 mr-1" /> Thêm mới
          </Button>
        </CardHeader>

        {/* SEARCH + FILTER */}
        <div className="flex flex-col sm:flex-row gap-3 px-4 pb-4">
          <Input
            placeholder="Tìm theo bác sĩ / bệnh nhân / khoa..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="border rounded-md p-2"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">-- Tất cả trạng thái --</option>
            <option value="Sắp tới">Sắp tới</option>
            <option value="Hoàn thành">Hoàn thành</option>
            <option value="Hủy">Hủy</option>
          </select>
        </div>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                {[
                  { label: 'Ngày hẹn', field: 'appointmentDate' },
                  { label: 'Giờ', field: 'startTime' },
                  { label: 'Khoa', field: 'department' },
                  { label: 'Bác sĩ', field: 'doctorName' },
                  { label: 'Bệnh nhân', field: 'patientName' },
                  { label: 'Trạng thái', field: 'status' },
                ].map((col) => (
                  <TableHead
                    key={col.field}
                    className="cursor-pointer select-none"
                    onClick={() => toggleSort(col.field)}
                  >
                    <div className="flex items-center gap-1">
                      {col.label}
                      {sortField === col.field &&
                        (sortOrder === 'asc' ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        ))}
                    </div>
                  </TableHead>
                ))}
                <TableHead>Ghi chú</TableHead>
                <TableHead className="w-24 text-center">Hành động</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredData.map((a) => (
                <TableRow key={a.id} className="hover:bg-gray-50">
                  <TableCell>{a.appointmentDate}</TableCell>
                  <TableCell>
                    {a.startTime} - {a.endTime}
                  </TableCell>
                  <TableCell>{a.department}</TableCell>
                  <TableCell>{a.doctorName}</TableCell>
                  <TableCell>{a.patientName}</TableCell>
                  <TableCell>
                    <span
                      className={
                        a.status === 'Sắp tới'
                          ? 'text-blue-600 font-medium'
                          : a.status === 'Hoàn thành'
                            ? 'text-green-600 font-medium'
                            : 'text-red-600 font-medium'
                      }
                    >
                      {a.status}
                    </span>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {a.notes}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditing(a);
                          setOpenEdit(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      {a.status !== 'Hủy' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => setConfirmCancel(a)} // mở popup xác nhận
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}

              {filteredData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-6">
                    Không có dữ liệu
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* ADD / EDIT */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {editing?.id ? 'Cập nhật lịch hẹn' : 'Thêm lịch hẹn mới'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <Label>Khoa</Label>
                <select
                  className={`border rounded-md p-2 w-full ${errors.department ? 'border-red-500' : ''}`}
                  value={editing?.department ?? ''}
                  onChange={(e) => {
                    const dep = e.target.value;
                    setEditing(
                      (p) =>
                        p && {
                          ...p,
                          department: dep,
                          doctorName: '', // reset bác sĩ khi đổi khoa
                        }
                    );
                  }}
                >
                  <option value="">-- Chọn khoa --</option>
                  {departments.map((d) => (
                    <option key={d.name} value={d.name}>
                      {d.name}
                    </option>
                  ))}
                </select>
                {errors.department && (
                  <p className="text-red-500 text-sm">{errors.department}</p>
                )}
              </div>
              <div>
                <Label>Bác sĩ</Label>
                <select
                  className={`border rounded-md p-2 w-full ${errors.doctorName ? 'border-red-500' : ''}`}
                  value={editing?.doctorName ?? ''}
                  onChange={(e) =>
                    setEditing((p) => p && { ...p, doctorName: e.target.value })
                  }
                  disabled={!editing?.department}
                >
                  <option value="">-- Chọn bác sĩ --</option>
                  {departments
                    .find((d) => d.name === editing?.department)
                    ?.doctors.map((doc) => (
                      <option key={doc} value={doc}>
                        {doc}
                      </option>
                    ))}
                </select>
                {errors.doctorName && (
                  <p className="text-red-500 text-sm">{errors.doctorName}</p>
                )}
              </div>

              <div>
                <Label>Bệnh nhân</Label>
                <Input
                  value={editing?.patientName ?? ''}
                  onChange={(e) =>
                    setEditing(
                      (p) => p && { ...p, patientName: e.target.value }
                    )
                  }
                  className={errors.patientName ? 'border-red-500' : ''}
                />
                {errors.patientName && (
                  <p className="text-red-500 text-sm">{errors.patientName}</p>
                )}
              </div>

              <div>
                <Label>Ngày hẹn</Label>
                <Input
                  type="date"
                  value={editing?.appointmentDate ?? ''}
                  onChange={(e) =>
                    setEditing(
                      (p) => p && { ...p, appointmentDate: e.target.value }
                    )
                  }
                  className={errors.appointmentDate ? 'border-red-500' : ''}
                />
                {errors.appointmentDate && (
                  <p className="text-red-500 text-sm">
                    {errors.appointmentDate}
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <div className="flex-1">
                  <Label>Bắt đầu</Label>
                  <select
                    className={`w-full border rounded-md p-2 ${errors.startTime ? 'border-red-500' : ''}`}
                    value={editing?.startTime ?? ''}
                    onChange={(e) => {
                      const start = e.target.value;
                      const [h, m] = start.split(':').map(Number);
                      const end = new Date(0, 0, 0, h, m + 30);
                      const endTime = end.toTimeString().slice(0, 5);
                      setEditing(
                        (p) => p && { ...p, startTime: start, endTime }
                      );
                    }}
                  >
                    <option value="">-- Chọn giờ --</option>
                    {timeSlots.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                  {errors.startTime && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.startTime}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex-1">
                <Label>Kết thúc</Label>
                <Input type="time" value={editing?.endTime ?? ''} readOnly />
              </div>
            </div>

            <div>
              <Label>Ghi chú</Label>
              <Textarea
                rows={2}
                value={editing?.notes ?? ''}
                onChange={(e) =>
                  setEditing((p) => p && { ...p, notes: e.target.value })
                }
              />
            </div>
          </div>

          <DialogFooter className="mt-3">
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700"
              onClick={handleSave}
            >
              Lưu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Cancel Confirm Dialog */}
      <Dialog
        open={!!confirmCancel}
        onOpenChange={() => setConfirmCancel(null)}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Xác nhận huỷ lịch</DialogTitle>
          </DialogHeader>
          <p className="text-gray-700 text-sm mb-4">
            Bạn có chắc chắn muốn huỷ lịch hẹn với{' '}
            <strong>{confirmCancel?.doctorName}</strong> không?
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmCancel(null)}>
              Không
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={() => {
                if (confirmCancel) {
                  handleCancel(confirmCancel.id);
                  setConfirmCancel(null);
                }
              }}
            >
              Huỷ lịch
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
