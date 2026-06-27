"use client";

import { usePathname } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // If on admin home page, don't show sidebar
  if (pathname === "/admin") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <AdminSidebar />
      {/* Desktop: margin-left for sidebar, Mobile: margin-top for navbar */}
      <main className="lg:ml-64 pt-16 lg:pt-0 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
