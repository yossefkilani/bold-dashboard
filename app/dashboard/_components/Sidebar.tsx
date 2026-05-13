"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const NAV = [
  { href: "/dashboard", label: "Home", icon: "⊞" },
  { href: "/dashboard/submissions", label: "Submissions", icon: "📥" },
  { href: "/dashboard/projects", label: "Projects", icon: "📁" },
  { href: "/dashboard/quotation", label: "Quotations", icon: "📄" },
  { href: "/dashboard/notifications", label: "Notifications", icon: "🔔" },
  { href: "/dashboard/clients", label: "Clients", icon: "👤" },
  { href: "/dashboard/site-editor", label: "Site Editor", icon: "✏️" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/login", { method: "DELETE" });
    router.push("/login");
  }

  return (
    <aside className="w-56 min-h-screen bg-white border-r flex flex-col">
      <div className="px-6 py-5 border-b">
        <span className="font-bold text-lg tracking-tight">Bold</span>
      </div>

      <nav className="flex-1 py-4 px-3 space-y-1">
        {NAV.map((item) => {
          const active =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition
                ${active ? "bg-black text-white" : "text-gray-600 hover:bg-gray-100"}`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t">
        <button
          onClick={handleLogout}
          className="w-full text-sm text-gray-500 hover:text-black py-2 rounded-lg hover:bg-gray-100 transition"
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}
