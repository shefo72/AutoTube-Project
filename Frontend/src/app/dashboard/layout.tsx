import { Sidebar } from "@/components/layout/DashboardSidebar";
import { Header } from "@/components/layout/DashboardHeader";
import { UserGuard } from "@/components/features/Auth/guards/UserGuard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserGuard>
      <div className="bg-background flex h-screen w-full overflow-hidden">
        <Sidebar />

        <div
          className="flex flex-1 transform-gpu flex-col overflow-hidden"
          style={{ willChange: "width" }}
        >
          <Header />

          <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
            {children}
          </main>
        </div>
      </div>
    </UserGuard>
  );
}
