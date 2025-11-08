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
import { Badge } from '@/components/ui/badge';

import { useToast } from '@/hooks/use-toast';
import { adminOperation } from '@/lib/BE-library/main';
import { DetailedSymptomResponse, CreateSymptomPayload, UpdateSymptomPayload } from '@/lib/BE-library/interfaces';

export type Symptom = {
  id: number;
  name: string;
  description: string;
  departments: string[]; // multiple
};

export default function SymptomsPage() {
  const { toast } = useToast();

  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch symptoms data on mount
  useEffect(() => {
    const fetchSymptoms = async () => {
      try {
        const response = await adminOperation.getAllSymptomsAdmin();
        if (response.success && response.data) {
          // Transform API data to component format
          const transformedSymptoms: Symptom[] = response.data.map(symptom => ({
            id: symptom.id,
            name: symptom.name,
            description: 'Chưa có mô tả', // SymptomResponse không có description
            departments: [], // Cần API để lấy departments theo symptom
          }));
          setSymptoms(transformedSymptoms);
        } else {
          console.error('Failed to fetch symptoms:', response.message);
          toast({
            title: 'Lỗi',
            description: response.message || 'Không thể tải danh sách triệu chứng',
            variant: 'destructive'
          });
        }
      } catch (error) {
        console.error('Error fetching symptoms:', error);
        toast({
          title: 'Lỗi',
          description: 'Có lỗi xảy ra khi tải danh sách triệu chứng',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSymptoms();
  }, [toast]);

  const ALL_DEPARTMENTS = [
    'Nội tổng hợp',
    'Thần kinh',
    'Tiêu hóa',
    'Hô hấp',
    'Nhi khoa',
  ];

  // ======== Search / Sort / Pagination ========
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const [page, setPage] = useState(1);
  const [pageSize] = useState(5);

  const filteredData = useMemo(() => {
    let data = [...symptoms];

    if (search) {
      const s = search.toLowerCase();
      data = data.filter(
        (d) =>
          d.name.toLowerCase().includes(s) ||
          d.description.toLowerCase().includes(s)
      );
    }

    if (sortField) {
      data.sort((a: any, b: any) => {
        const aVal = a[sortField]?.toString() ?? '';
        const bVal = b[sortField]?.toString() ?? '';
        return sortOrder === 'asc'
          ? aVal.localeCompare(bVal, 'vi')
          : bVal.localeCompare(aVal, 'vi');
      });
    }

    return data;
  }, [symptoms, search, sortField, sortOrder]);

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
  const [editing, setEditing] = useState<Symptom | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Symptom | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};

    if (!editing?.name) e.name = 'Tên không được để trống';
    if (!editing?.description) e.description = 'Mô tả không được để trống';

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate() || !editing) return;

    try {
      setLoading(true);

      if (editing.id === 0) {
        // Create new symptom
        const createPayload: CreateSymptomPayload = {
          symptomName: editing.name,
          description: editing.description,
          tag: editing.departments.join(','), // Tạm thời lưu departments vào tag
        };

        const response = await adminOperation.createSymptomAdmin(createPayload);
        if (response.success && response.data) {
          const newSymptom: Symptom = {
            id: response.data.id,
            name: response.data.name,
            description: editing.description,
            departments: editing.departments,
          };
          setSymptoms((prev) => [...prev, newSymptom]);
          toast({
            title: 'Thành công',
            description: 'Thêm triệu chứng thành công!',
          });
        } else {
          throw new Error(response.message || 'Không thể tạo triệu chứng');
        }
      } else {
        // Update existing symptom
        const updatePayload: UpdateSymptomPayload = {
          symptomName: editing.name,
          description: editing.description,
          tag: editing.departments.join(','),
        };

        const response = await adminOperation.updateSymptomAdmin(editing.id, updatePayload);
        if (response.success && response.data) {
          setSymptoms((prev) =>
            prev.map((d) => (d.id === editing.id ? editing : d))
          );
          toast({ title: 'Thành công', description: 'Cập nhật thành công!' });
        } else {
          throw new Error(response.message || 'Không thể cập nhật triệu chứng');
        }
      }

      setOpenEdit(false);
    } catch (error: any) {
      console.error('Error saving symptom:', error);
      toast({
        title: 'Lỗi',
        description: error.message || 'Có lỗi xảy ra khi lưu triệu chứng',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;

    try {
      setLoading(true);
      const response = await adminOperation.deleteSymptomAdmin(confirmDelete.id);
      
      if (response.success) {
        setSymptoms((prev) => prev.filter((d) => d.id !== confirmDelete.id));
        toast({ title: 'Thành công', description: 'Xóa triệu chứng thành công!' });
      } else {
        throw new Error(response.message || 'Không thể xóa triệu chứng');
      }
    } catch (error: any) {
      console.error('Error deleting symptom:', error);
      toast({
        title: 'Lỗi',
        description: error.message || 'Có lỗi xảy ra khi xóa triệu chứng',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
      setConfirmDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Đang tải danh sách triệu chứng...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Card className="shadow-sm border border-gray-200">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-xl font-semibold">
            Quản lý triệu chứng
          </CardTitle>

          <Button
            size="sm"
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => {
              setEditing({
                id: 0,
                name: '',
                description: '',
                departments: [],
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
            placeholder="Tìm theo tên / mô tả..."
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
                  { label: 'Tên triệu chứng', field: 'name' },
                  { label: 'Mô tả', field: 'description' },
                ].map((c) => (
                  <TableHead
                    key={c.field}
                    className="cursor-pointer select-none"
                    onClick={() => toggleSort(c.field)}
                  >
                    <div className="flex items-center gap-1">
                      {c.label}
                      {sortField === c.field &&
                        (sortOrder === 'asc' ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        ))}
                    </div>
                  </TableHead>
                ))}

                <TableHead>Khoa liên quan</TableHead>
                <TableHead className="w-24 text-center">Hành động</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {pageData.map((s) => (
                <TableRow key={s.id} className="hover:bg-gray-50">
                  <TableCell>{s.name}</TableCell>
                  <TableCell className="max-w-[300px] truncate">
                    {s.description}
                  </TableCell>

                  <TableCell className="flex flex-wrap gap-1">
                    {s.departments.map((d) => (
                      <Badge key={d} variant="secondary">
                        {d}
                      </Badge>
                    ))}
                  </TableCell>

                  <TableCell>
                    <div className="flex gap-2 justify-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditing(s);
                          setErrors({});
                          setOpenEdit(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600"
                        onClick={() => setConfirmDelete(s)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}

              {pageData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6">
                    Không có dữ liệu
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>

        {/* PAGE */}
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
        <DialogContent className="max-h-[85vh] sm:max-w-xl flex flex-col">
          <DialogHeader>
            <DialogTitle>
              {editing?.id ? 'Cập nhật triệu chứng' : 'Thêm triệu chứng'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 overflow-y-auto pr-1">
            <div>
              <Label>Tên triệu chứng</Label>
              <Input
                value={editing?.name ?? ''}
                onChange={(e) =>
                  setEditing((p) => p && { ...p, name: e.target.value })
                }
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name}</p>
              )}
            </div>

            <div>
              <Label>Mô tả</Label>
              <Textarea
                rows={3}
                value={editing?.description ?? ''}
                onChange={(e) =>
                  setEditing((p) => p && { ...p, description: e.target.value })
                }
              />
              {errors.description && (
                <p className="text-red-500 text-sm">{errors.description}</p>
              )}
            </div>

            {/* Multi-select departments */}
            <div>
              <Label>Khoa liên quan</Label>

              <div className="flex flex-wrap gap-2 my-2">
                {ALL_DEPARTMENTS.map((dep) => {
                  const active = editing?.departments.includes(dep);
                  return (
                    <Badge
                      key={dep}
                      className={`cursor-pointer ${
                        active
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                      onClick={() =>
                        setEditing(
                          (p) =>
                            p && {
                              ...p,
                              departments: active
                                ? p.departments.filter((x) => x !== dep)
                                : [...p.departments, dep],
                            }
                        )
                      }
                    >
                      {dep}
                    </Badge>
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

      {/* DELETE */}
      <Dialog
        open={!!confirmDelete}
        onOpenChange={() => setConfirmDelete(null)}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Xác nhận xóa</DialogTitle>
          </DialogHeader>

          <p className="text-gray-700 text-sm mb-4">
            Bạn có chắc muốn xóa triệu chứng{' '}
            <strong>{confirmDelete?.name}</strong> không?
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
