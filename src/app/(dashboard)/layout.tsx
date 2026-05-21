"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-[#08090e]">
      {/* Background ambient glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-1/4 left-1/4 h-[600px] w-[600px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(97,114,243,0.05)_0%,transparent_70%)]" />
        <div className="absolute top-1/2 right-0 h-[400px] w-[400px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.04)_0%,transparent_70%)]" />
      </div>

      {/* Sidebar */}
      <Sidebar collapsed={collapsed} onCollapse={setCollapsed} />

      {/* Main area */}
      <div className="relative flex flex-1 flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-5 md:p-6">
          <div className="animate-fade-up">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
