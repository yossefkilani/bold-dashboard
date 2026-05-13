"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function TopBar() {
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    fetch("/api/notifications")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setUnread(data.filter((n: any) => !n.is_read).length);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <header className="h-14 bg-white border-b flex items-center justify-end px-6 gap-4">
      <Link href="/dashboard/notifications" className="relative text-gray-500 hover:text-black">
        🔔
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </Link>
    </header>
  );
}
