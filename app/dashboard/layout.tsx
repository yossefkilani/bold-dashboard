"use client";

import { useState } from "react";
import Sidebar from "./_components/Sidebar";
import TopBar from "./_components/TopBar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Bar */}
      <TopBar onMenuClick={() => setSidebarOpen(true)} />

      <div className="flex">
        {/* Sidebar */}
        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Content */}
        <main className="flex-1 px-4 py-6">
          {/* 🔑 هذا هو اللي كان موجود وانحذف */}
          <div className="max-w-xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}