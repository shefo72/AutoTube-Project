import { GuestGuard } from "@/components/features/Auth/guards/GuestGuard";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GuestGuard>
      <div>{children}</div>
    </GuestGuard>
  );
}
