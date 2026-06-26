"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check authentication (except on login page)
    if (pathname !== "/admin") {
      const isAuth = localStorage.getItem("adminAuth");
      if (!isAuth) {
        router.push("/admin");
      }
    }
  }, [pathname, router]);

  // If on login page, don't show sidebar
  if (pathname === "/admin") {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  );
}
