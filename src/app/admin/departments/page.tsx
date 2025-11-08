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
import { DepartmentResponse, CreateDepartmentPayload, UpdateDepartmentPayload } from '@/lib/BE-library/interfaces';

export type Department = {
  id: number;
  name: string;
  description: string;
  location: string;
  doctorCount?: number;
  symptomCount?: number;
  symptoms?: string[];
};

export default function DepartmentsPage() {
  const { toast } = useToast();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch departments data on mount
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await adminOperation.getAllDepartments();
        if (response.success && response.data) {
          // Transform API data to component format
          const transformedDepartments: Department[] = response.data.map(dept => ({
            id: dept.departmentId,
            name: dept.departmentName,
            description: dept.departmentDescription || 'Chưa có mô tả',
            location: dept.departmentLocation || 'Chưa xác định vị trí',
            doctorCount: 0, // TODO: Cần API để đếm doctors theo department
            symptomCount: 0, // TODO: Cần API để đếm symptoms theo department
            symptoms: [], // TODO: Cần API để lấy symptoms theo department
          }));
          setDepartments(transformedDepartments);
        } else {
          console.error('Failed to fetch departments:', response.message);
          toast({
            title: 'Lỗi',
            description: response.message || 'Không thể tải danh sách khoa',
            variant: 'destructive'
          });
        }
      } catch (error) {
        console.error('Error fetching departments:', error);
        toast({
          title: 'Lỗi',
          description: 'Có lỗi xảy ra khi tải danh sách khoa',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, [toast]);

  const availableSymptoms = [
    'Ho',
    'Sốt',
    'Đau ngực',
    'Khó thở',
    'Buồn nôn',
    'Đau bụng',
    'Huyết áp cao',
    'Mệt mỏi',
    'Đầy bụng',
    'Sổ mũi',
  ];

  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(5);

  const filteredData = useMemo(() => {
    let data = [...departments];

    if (search) {
      const s = search.toLowerCase();
      data = data.filter(
        (d) =>
          d.name.toLowerCase().includes(s) ||
          d.description.toLowerCase().includes(s) ||
          d.location.toLowerCase().includes(s)
      );
    }

    if (sortField) {
      data.sort((a: any, b: any) => {
        const valA = a[sortField];
        const valB = b[sortField];

        if (typeof valA === 'number' && typeof valB === 'number') {
          return sortOrder === 'asc' ? valA - valB : valB - valA;
        }

        const strA = valA?.toString() ?? '';
        const strB = valB?.toString() ?? '';
        return sortOrder === 'asc'
          ? strA.localeCompare(strB, 'vi')
          : strB.localeCompare(strA, 'vi');
      });
    }

    return data;
  }, [departments, search, sortField, sortOrder]);

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

  const [openEdit, setOpenEdit] = useState(false);
  const [editing, setEditing] = useState<Department | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirmDelete, setConfirmDelete] = useState<Department | null>(null);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!editing?.name) newErrors.name = 'Tên khoa không được để trống';
    if (!editing?.description) newErrors.description = 'Mô tả không được trống';
    if (!editing?.location) newErrors.location = 'Vị trí không được trống';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDelete = () => {
    if (!confirmDelete) return;
    
    // Note: API không có DELETE department endpoint
    // Tạm thời sử dụng local state
    setDepartments((prev) => prev.filter((d) => d.id !== confirmDelete.id));
    toast({ 
      title: 'Thông báo', 
      description: 'Xóa khoa thành công (chức năng đang phát triển)' 
    });
    setConfirmDelete(null);
  };

  const handleEdit = (dept: Department) => {
    setEditing(dept);
    setErrors({});
    setOpenEdit(true);
  };

  const handleSave = async () => {
    if (!validate() || !editing) return;

    try {
      setLoading(true);

      if (editing.id === 0) {
        // Create new department
        const createPayload: CreateDepartmentPayload = {
          departmentName: editing.name,
          departmentDescription: editing.description,
          departmentLocation: editing.location,
        };

        const response = await adminOperation.createDepartment(createPayload);
        if (response.success && response.data) {
          const newDept: Department = {
            id: response.data.departmentId,
            name: response.data.departmentName,
            description: response.data.departmentDescription || 'Chưa có mô tả',
            location: response.data.departmentLocation || 'Chưa xác định vị trí',
            doctorCount: 0,
            symptomCount: editing.symptoms?.length ?? 0,
            symptoms: editing.symptoms,
          };
          setDepartments((prev) => [...prev, newDept]);
          toast({ title: 'Thành công', description: 'Thêm khoa thành công!' });
        } else {
          throw new Error(response.message || 'Không thể tạo khoa');
        }
      } else {
        // Update existing department
        const updatePayload: UpdateDepartmentPayload = {
          departmentName: editing.name,
          departmentDescription: editing.description,
          departmentLocation: editing.location,
        };

        const response = await adminOperation.updateDepartment(editing.id, updatePayload);
        if (response.success && response.data) {
          const updated: Department = {
            ...editing,
            symptomCount: editing.symptoms?.length ?? 0,
          };
          setDepartments((prev) =>
            prev.map((d) => (d.id === editing.id ? updated : d))
          );
          toast({ title: 'Thành công', description: 'Cập nhật khoa thành công!' });
        } else {
          throw new Error(response.message || 'Không thể cập nhật khoa');
        }
      }

      setOpenEdit(false);
    } catch (error: any) {
      console.error('Error saving department:', error);
      toast({
        title: 'Lỗi',
        description: error.message || 'Có lỗi xảy ra khi lưu thông tin khoa',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Đang tải danh sách khoa...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Card className="shadow-sm border border-gray-200">
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-xl font-semibold">Quản lý khoa</CardTitle>

          <Button
            size="sm"
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => {
              setEditing({
                id: 0,
                name: '',
                description: '',
                location: '',
                symptoms: [],
              });
              setErrors({});
              setOpenEdit(true);
            }}
          >
            <Plus className="h-4 w-4 mr-1" /> Thêm mới
          </Button>
        </CardHeader>

        <div className="px-4 pb-4">
          <Input
            placeholder="Tìm theo tên / mô tả / vị trí..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                {[
                  { label: 'Tên khoa', field: 'name' },
                  { label: 'Mô tả', field: 'description' },
                  { label: 'Vị trí', field: 'location' },
                  { label: 'Bác sĩ', field: 'doctorCount' },
                  { label: 'Triệu chứng', field: 'symptomCount' },
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

                <TableHead className="w-28 text-center">Hành động</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {pageData.map((d) => (
                <TableRow key={d.id} className="hover:bg-gray-50">
                  <TableCell>{d.name}</TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {d.description}
                  </TableCell>
                  <TableCell>{d.location}</TableCell>
                  <TableCell>{d.doctorCount ?? 0}</TableCell>
                  <TableCell>{d.symptomCount ?? 0}</TableCell>

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
                  <TableCell colSpan={7} className="text-center py-6">
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

      {/* Form thêm/sửa */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent className="max-h-[85vh] flex flex-col sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {editing?.id ? 'Cập nhật khoa' : 'Thêm khoa mới'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 overflow-y-auto pr-1">
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <Label>Tên khoa</Label>
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
                <Label>Vị trí</Label>
                <Input
                  value={editing?.location ?? ''}
                  onChange={(e) =>
                    setEditing(
                      (prev) => prev && { ...prev, location: e.target.value }
                    )
                  }
                />
                {errors.location && (
                  <p className="text-red-500 text-sm">{errors.location}</p>
                )}
              </div>
            </div>

            <div>
              <Label>Mô tả</Label>
              <Textarea
                rows={3}
                value={editing?.description ?? ''}
                onChange={(e) =>
                  setEditing(
                    (prev) => prev && { ...prev, description: e.target.value }
                  )
                }
              />
              {errors.description && (
                <p className="text-red-500 text-sm">{errors.description}</p>
              )}
            </div>

            {/* Multi-select triệu chứng kiểu badge toggle */}
            <div>
              <Label>Triệu chứng liên quan</Label>

              <div className="flex flex-wrap gap-2 mt-2">
                {availableSymptoms.map((sym) => {
                  const active = editing?.symptoms?.includes(sym);

                  return (
                    <span
                      key={sym}
                      role="button"
                      tabIndex={0}
                      className={`px-3 py-1.5 text-sm rounded-full border cursor-pointer transition-colors ${
                        active
                          ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700'
                          : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                      }`}
                      onClick={() =>
                        setEditing(
                          (prev) =>
                            prev && {
                              ...prev,
                              symptoms: active
                                ? prev.symptoms?.filter((s) => s !== sym)
                                : [...(prev.symptoms ?? []), sym],
                            }
                        )
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setEditing(
                            (prev) =>
                              prev && {
                                ...prev,
                                symptoms: active
                                  ? prev.symptoms?.filter((s) => s !== sym)
                                  : [...(prev.symptoms ?? []), sym],
                              }
                          );
                        }
                      }}
                    >
                      {sym}
                    </span>
                  );
                })}
              </div>
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

      {/* Confirm delete */}
      <Dialog
        open={!!confirmDelete}
        onOpenChange={() => setConfirmDelete(null)}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Xác nhận xoá</DialogTitle>
          </DialogHeader>

          <p className="text-gray-700 text-sm mb-4">
            Bạn có chắc muốn xoá khoa <strong>{confirmDelete?.name}</strong>{' '}
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
              Xoá
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
