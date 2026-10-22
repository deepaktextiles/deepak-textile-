"use client";

import React, { useState, useEffect, Suspense } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAdmin } from "../../lib/context/AdminContext";
import { AdminSidebar } from "../../components/admin/AdminSidebar";
import { AdminHeader } from "../../components/admin/AdminHeader";
import { AdminTabProvider } from "../../lib/context/AdminTabContext";
import { RefreshCw, ShieldAlert, Lock } from "lucide-react";

function AdminAuthGuard({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, loading } = useAdmin();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isLoginPage = pathname === "/admin/login";

  // Redirect handling
  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated && !isLoginPage) {
        // Not authenticated, attempting to view protected admin route -> redirect to login
        router.replace("/admin/login");
      } else if (isAuthenticated && isLoginPage) {
        // Already authenticated, attempting to view login page -> redirect to dashboard
        router.replace("/admin");
      }
    }
  }, [isAuthenticated, loading, isLoginPage, router]);

  // If on login page, render clean login card without sidebar or topbar
  if (isLoginPage) {
    return <>{children}</>;
  }

  // If authentication state is still checking, show executive loading screen
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B1528] flex flex-col items-center justify-center p-6 text-white select-none">
        <div className="text-center space-y-4 max-w-sm">
          <div className="relative mx-auto w-16 h-16">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-navy-950 font-black text-2xl flex items-center justify-center shadow-xl shadow-amber-500/30">
              DT
            </div>
            <div className="absolute -inset-1 rounded-2xl border-2 border-amber-400/40 animate-ping" />
          </div>
          <div>
            <h2 className="text-xl font-heading font-extrabold text-white">
              Deepak Textiles Control Center
            </h2>
            <p className="text-xs text-amber-400/90 font-semibold tracking-wider uppercase mt-1">
              Verifying Administrator Credentials...
            </p>
          </div>
          <div className="pt-2 flex justify-center">
            <RefreshCw className="w-6 h-6 text-amber-400 animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  // If not authenticated, hold rendering while redirect takes place
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-white select-none">
        <div className="text-center space-y-3 max-w-sm">
          <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mx-auto border border-red-500/40">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold">Access Restricted</h2>
          <p className="text-xs text-slate-400">
            Redirecting to Admin Sign In portal...
          </p>
        </div>
      </div>
    );
  }

  // Authenticated: Render full protected Admin Layout with Sidebar
  return (
    <div className="min-h-screen bg-[#f8fafc] text-txt-primary flex flex-col lg:flex-row">
      <AdminSidebar mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader onOpenMobile={() => setMobileOpen(true)} />
        <main className="flex-1 p-3 sm:p-5 lg:p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0B1528] flex items-center justify-center">
          <RefreshCw className="w-8 h-8 text-amber-400 animate-spin" />
        </div>
      }
    >
      <AdminTabProvider>
        <AdminAuthGuard>{children}</AdminAuthGuard>
      </AdminTabProvider>
    </Suspense>
  );
}
