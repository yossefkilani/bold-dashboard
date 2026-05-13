"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Notification = {
  id: number;
  message: string;
  is_read: number;
  created_at: string;
  project_id: number | null;
};

export default function DashboardHome() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    fetch("/api/notifications")
      .then((r) => r.json())
      .then((d) => setNotifications(Array.isArray(d) ? d.slice(0, 5) : []))
      .catch(() => {});
  }, []);

  const unread = notifications.filter((n) => !n.is_read).length;

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Recent Notifications</h2>
          {unread > 0 && (
            <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
              {unread} unread
            </span>
          )}
        </div>

        {notifications.length === 0 ? (
          <p className="text-sm text-gray-400">No notifications</p>
        ) : (
          <ul className="space-y-3">
            {notifications.map((n) => (
              <li
                key={n.id}
                className={`text-sm pb-3 border-b last:border-0 ${
                  !n.is_read ? "font-medium" : "text-gray-500"
                }`}
              >
                {n.message}
                <div className="text-xs text-gray-400 mt-0.5">
                  {new Date(n.created_at).toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        )}

        <Link
          href="/dashboard/notifications"
          className="block text-center text-sm text-gray-500 hover:text-black mt-4"
        >
          View all →
        </Link>
      </div>
    </div>
  );
}
