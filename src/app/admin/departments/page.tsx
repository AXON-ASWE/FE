'use client';

import { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';

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
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export type Department = {
  id: number;
  name: string;
  description: string;
  location: string;
};

export default function DepartmentsPage() {
  const { toast } = useToast();

  const [departments, setDepartments] = useState<Department[]>([
    {
      id: 1,
      name: 'Khoa Tim mạch',
      description: 'Chuyên khoa điều trị các bệnh về tim mạch và huyết áp',
      location: 'Tầng 3, Toà nhà A',
    },
    {
      id: 2,
      name: 'Khoa Tiêu hóa',
      description: 'Chuyên khoa điều trị các bệnh về dạ dày, ruột, gan mật',
      location: 'Tầng 2, Toà nhà B',
    },
    {
      id: 3,
      name: 'Khoa Hô hấp',
      description: 'Chuyên khoa điều trị các bệnh về phổi và đường hô hấp',
      location: 'Tầng 4, Toà nhà A',
    },
    {
      id: 4,
      name: 'Khoa Nội tổng hợp',
      description: 'Khám và điều trị các bệnh nội khoa tổng quát',
      location: 'Tầng 1, Toà nhà B',
    },
    {
      id: 5,
      name: 'Khoa Thần kinh',
      description: 'Chuyên khoa điều trị các bệnh về thần kinh',
      location: 'Tầng 5, Toà nhà A',
    },
  ]);

  const [openEdit, setOpenEdit] = useState(false);
  const [editing, setEditing] = useState<Department | null>(null);
  const [errors, setErrors] = useState<{ [k: string]: string }>({});
  const [confirmDelete, setConfirmDelete] = useState<Department | null>(null);

  const validate = () => {
    const newErrors: { [k: string]: string } = {};

    if (!editing?.name) newErrors.name = 'Tên khoa không được để trống';
    if (!editing?.description)
      newErrors.description = 'Mô tả không được để trống';
    if (!editing?.location) newErrors.location = 'Vị trí không được để trống';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDelete = () => {
    if (!confirmDelete) return;

    setDepartments((prev) => prev.filter((d) => d.id !== confirmDelete.id));
    setConfirmDelete(null);

    toast({ title: 'Thành công', description: 'Xóa khoa thành công!' });
  };

  const handleEdit = (dept: Department) => {
    setEditing(dept);
    setErrors({});
    setOpenEdit(true);
  };

  const handleSave = () => {
    if (!validate()) return;
    if (!editing) return;

    if (editing.id === 0) {
      setDepartments((prev) => [...prev, { ...editing, id: Date.now() }]);
      toast({ title: 'Thành công', description: 'Thêm khoa mới thành công!' });
    } else {
      setDepartments((prev) =>
        prev.map((d) => (d.id === editing.id ? editing : d))
      );
      toast({ title: 'Thành công', description: 'Cập nhật khoa thành công!' });
    }
    setOpenEdit(false);
  };

  return (
    <>
      <Card className="shadow-sm border border-gray-200">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-semibold">Quản lý khoa</CardTitle>

          <Button
            size="sm"
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => {
              setEditing({ id: 0, name: '', description: '', location: '' });
              setErrors({});
              setOpenEdit(true);
            }}
          >
            <Plus className="h-4 w-4 mr-1" /> Thêm mới
          </Button>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-48">Tên khoa</TableHead>
                <TableHead>Mô tả</TableHead>
                <TableHead className="w-40">Vị trí</TableHead>
                <TableHead className="w-28 text-center">Hành động</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {departments.map((dept) => (
                <TableRow key={dept.id} className="hover:bg-gray-50">
                  <TableCell>{dept.name}</TableCell>
                  <TableCell>{dept.description}</TableCell>
                  <TableCell>{dept.location}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(dept)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => setConfirmDelete(dept)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent className="max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>
              {editing?.id ? 'Cập nhật khoa' : 'Thêm khoa mới'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 overflow-y-auto">
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
              <Label>Mô tả</Label>
              <Textarea
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

            <DialogFooter>
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={handleSave}
              >
                Lưu
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!confirmDelete}
        onOpenChange={() => setConfirmDelete(null)}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Xác nhận xóa</DialogTitle>
          </DialogHeader>

          <p className="text-gray-700 text-sm mb-4">
            Bạn có chắc muốn xóa khoa <strong>{confirmDelete?.name}</strong>{' '}
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
