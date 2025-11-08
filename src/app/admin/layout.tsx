'use client';
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <div className="flex min-h-screen ">
      <main className="flex-1 bg-gray-50 min-h-screen p-6">
        <h1 className="text-3xl font-bold mb-6">Bảng điều khiển quản trị</h1>

        <div className="space-y-6">{children}</div>
      </main>
    </div>
  );
}
