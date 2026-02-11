"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  const linkClass = (href: string) =>
    `px-3 py-2 rounded transition ${
      pathname === href
        ? "bg-black text-white"
        : "hover:bg-gray-100"
    }`;

  return (
    <>
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-white z-50
          transform transition-transform duration-300 ease-in-out
          shadow-xl
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* HEADER */}
        <div className="h-14 flex items-center px-5 border-b font-semibold">
          Bold Dashboard
        </div>

        {/* NAV */}
        <nav className="p-4 flex flex-col gap-2 text-sm">

          <Link
            href="/dashboard"
            onClick={onClose}
            className={linkClass("/dashboard")}
          >
            Dashboard
          </Link>

          <Link
            href="/dashboard/projects"
            onClick={onClose}
            className={linkClass("/dashboard/projects")}
          >
            Projects
          </Link>

          <Link
            href="/dashboard/submissions"
            onClick={onClose}
            className={linkClass("/dashboard/submissions")}
          >
            Submissions
          </Link>

          <Link
            href="/dashboard/quotation"
            onClick={onClose}
            className={linkClass("/dashboard/quotation")}
          >
            Quotations
          </Link>

          <Link
            href="/dashboard/site-editor"
            onClick={onClose}
            className={linkClass("/dashboard/site-editor")}
          >
            Site Editor
          </Link>

          <div className="border-t my-3"></div>

          <a href="#" className="px-3 py-2 rounded hover:bg-gray-100 transition">
            Files
          </a>

          <a href="#" className="px-3 py-2 rounded hover:bg-gray-100 transition">
            Activity
          </a>

          <a href="#" className="px-3 py-2 rounded hover:bg-gray-100 transition">
            Settings
          </a>

          <div className="mt-auto pt-6 border-t">
            <a
              href="#"
              className="px-3 py-2 rounded text-red-500 hover:bg-red-50 transition block"
            >
              Logout
            </a>
          </div>

        </nav>
      </aside>
    </>
  );
}