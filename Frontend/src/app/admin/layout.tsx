import { AdminGuard } from "@/components/features/Auth/guards/AdminGuard";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <div className="bg-background flex h-screen w-full overflow-hidden">
        <div className="flex flex-1 flex-col overflow-hidden">
          <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
            {children}
          </main>
        </div>
      </div>
    </AdminGuard>
  );
}
