'use client';

import { useState, useMemo, useEffect } from 'react';
import { Plus, Edit, Trash2, ChevronUp, ChevronDown } from 'lucide-react';

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
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/Label';
import { useToast } from '@/hooks/use-toast';
import { adminOperation } from '@/lib/BE-library/main';
import { DoctorResponse, DetailedDoctorResponse, CreateDoctorPayload, UpdateDoctorPayload } from '@/lib/BE-library/interfaces';

export type Doctor = {
  id: number;
  name: string;
  specialization: string;
  experience: string;
  qualification: string;
  department: string;
  status: 'Hoạt động' | 'Không hoạt động';
  avatar?: string;
};

export default function DoctorsPage() {
  const { toast } = useToast();

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  // ======== Search / Filter / Sort / Pagination ========
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortField, setSortField] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const [page, setPage] = useState(1);
  const [pageSize] = useState(5);

  const filteredData = useMemo(() => {
    let data = [...doctors];

    // SEARCH
    if (search) {
      const s = search.toLowerCase();
      data = data.filter(
        (d) =>
          d.name.toLowerCase().includes(s) ||
          d.specialization.toLowerCase().includes(s) ||
          d.department.toLowerCase().includes(s)
      );
    }

    // FILTER
    if (statusFilter) {
      data = data.filter((d) => d.status === statusFilter);
    }

    // SORT
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
  }, [doctors, search, statusFilter, sortField, sortOrder]);

  const total = filteredData.length;
  const totalPages = Math.ceil(total / pageSize);
  const pageData = filteredData.slice((page - 1) * pageSize, page * pageSize);

  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // ======== CRUD ========
  const [openEdit, setOpenEdit] = useState(false);
  const [editing, setEditing] = useState<Doctor | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirmDelete, setConfirmDelete] = useState<Doctor | null>(null);

  const handleUpload = (file: File) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setEditing((prev) => prev && { ...prev, avatar: url });
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!editing?.name) newErrors.name = 'Tên không được để trống';
    if (!editing?.specialization)
      newErrors.specialization = 'Chuyên khoa không được trống';
    if (!editing?.experience)
      newErrors.experience = 'Số năm KN không được trống';
    if (!editing?.qualification)
      newErrors.qualification = 'Trình độ không được trống';
    if (!editing?.department) newErrors.department = 'Khoa không được trống';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDelete = () => {
    if (!confirmDelete) return;

    setDoctors((prev) => prev.filter((d) => d.id !== confirmDelete.id));
    setConfirmDelete(null);
    toast({ title: 'Thành công', description: 'Xóa bác sĩ thành công!' });
  };

  const handleEdit = (doctor: Doctor) => {
    setEditing(doctor);
    setErrors({});
    setOpenEdit(true);
  };

  const handleSave = () => {
    if (!validate() || !editing) return;

    if (editing.id === 0) {
      setDoctors((prev) => [...prev, { ...editing, id: Date.now() }]);
      toast({ title: 'Thành công', description: 'Thêm bác sĩ thành công!' });
    } else {
      setDoctors((prev) =>
        prev.map((d) => (d.id === editing.id ? editing : d))
      );
      toast({
        title: 'Thành công',
        description: 'Cập nhật bác sĩ thành công!',
      });
    }

    setOpenEdit(false);
  };

  return (
    <>
      <Card className="shadow-sm border border-gray-200">
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-xl font-semibold">
            Quản lý bác sĩ
          </CardTitle>

          <Button
            size="sm"
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => {
              setEditing({
                id: 0,
                name: '',
                specialization: '',
                experience: '',
                qualification: '',
                department: '',
                status: 'Hoạt động',
                avatar: '',
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
            placeholder="Tìm theo tên / chuyên khoa / khoa..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />

          <select
            className="border rounded-md p-2"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="">-- Tất cả trạng thái --</option>
            <option value="Hoạt động">Hoạt động</option>
            <option value="Không hoạt động">Không hoạt động</option>
          </select>
        </div>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Avatar</TableHead>

                {[
                  { label: 'Tên bác sĩ', field: 'name' },
                  { label: 'Chuyên khoa', field: 'specialization' },
                  { label: 'Số năm KN', field: 'experience' },
                  { label: 'Trình độ', field: 'qualification' },
                  { label: 'Khoa', field: 'department' },
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

                <TableHead>Trạng thái</TableHead>
                <TableHead className="w-28 text-center">Hành động</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {pageData.map((d) => (
                <TableRow key={d.id} className="hover:bg-gray-50">
                  <TableCell>
                    {d.avatar ? (
                      <img
                        src={d.avatar}
                        className="h-12 w-12 rounded-full object-cover ring-1 ring-gray-300"
                      />
                    ) : (
                      <div className="h-12 w-12 bg-gray-200 rounded-full" />
                    )}
                  </TableCell>

                  <TableCell>{d.name}</TableCell>
                  <TableCell>{d.specialization}</TableCell>
                  <TableCell>{d.experience}</TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {d.qualification}
                  </TableCell>
                  <TableCell>{d.department}</TableCell>
                  <TableCell>
                    <span
                      className={
                        d.status === 'Hoạt động'
                          ? 'text-green-600 font-medium'
                          : 'text-red-600 font-medium'
                      }
                    >
                      {d.status}
                    </span>
                  </TableCell>

                  <TableCell className="text-center">
                    <div className="flex justify-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(d)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => setConfirmDelete(d)}
                      >
                        <Trash2 className="h-4 w-4" />
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

      {/* ADD / EDIT */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent className="max-h-[85vh] flex flex-col sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {editing?.id ? 'Cập nhật bác sĩ' : 'Thêm bác sĩ mới'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 overflow-y-auto pr-1">
            {/* Avatar Upload */}
            <div>
              <Label>Ảnh đại diện</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files?.[0]) handleUpload(e.target.files[0]);
                }}
              />

              {editing?.avatar && (
                <img
                  src={editing.avatar}
                  className="h-20 w-20 rounded-full mt-3 object-cover border shadow"
                />
              )}
            </div>

            {/* Grid form */}
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <Label>Tên bác sĩ</Label>
                <Input
                  value={editing?.name ?? ''}
                  onChange={(e) =>
                    setEditing(
                      (prev) => prev && { ...prev, name: e.target.value }
                    )
                  }
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name}</p>
                )}
              </div>

              <div>
                <Label>Chuyên khoa</Label>
                <Input
                  value={editing?.specialization ?? ''}
                  onChange={(e) =>
                    setEditing(
                      (prev) =>
                        prev && { ...prev, specialization: e.target.value }
                    )
                  }
                />
              </div>

              <div>
                <Label>Số năm kinh nghiệm</Label>
                <Input
                  value={editing?.experience ?? ''}
                  onChange={(e) =>
                    setEditing(
                      (prev) => prev && { ...prev, experience: e.target.value }
                    )
                  }
                />
              </div>

              <div>
                <Label>Khoa</Label>
                <Input
                  value={editing?.department ?? ''}
                  onChange={(e) =>
                    setEditing(
                      (prev) => prev && { ...prev, department: e.target.value }
                    )
                  }
                />
              </div>
            </div>

            <div>
              <Label>Trình độ</Label>
              <Textarea
                rows={3}
                value={editing?.qualification ?? ''}
                onChange={(e) =>
                  setEditing(
                    (prev) => prev && { ...prev, qualification: e.target.value }
                  )
                }
              />
            </div>

            <div>
              <Label>Trạng thái</Label>
              <select
                className="border rounded-md p-2 w-full"
                value={editing?.status ?? 'Hoạt động'}
                onChange={(e) =>
                  setEditing(
                    (prev) =>
                      prev && {
                        ...prev,
                        status: e.target.value as Doctor['status'],
                      }
                  )
                }
              >
                <option value="Hoạt động">Hoạt động</option>
                <option value="Không hoạt động">Không hoạt động</option>
              </select>
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

      {/* CONFIRM DELETE */}
      <Dialog
        open={!!confirmDelete}
        onOpenChange={() => setConfirmDelete(null)}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Xác nhận xóa</DialogTitle>
          </DialogHeader>

          <p className="text-gray-700 text-sm mb-4">
            Bạn có chắc muốn xóa bác sĩ <strong>{confirmDelete?.name}</strong>{' '}
            không?
          </p>

          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDelete(null)}>
              Không
            </Button>

            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={handleDelete}
            >
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
