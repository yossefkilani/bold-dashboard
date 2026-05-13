"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Notification = {
  id: number;
  type: string;
  message: string;
  project_id: number | null;
  is_read: number;
  created_at: string;
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/notifications")
      .then((r) => r.json())
      .then((d) => setNotifications(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false));
  }, []);

  async function open(n: Notification) {
    setNotifications((prev) =>
      prev.map((x) => (x.id === n.id ? { ...x, is_read: 1 } : x))
    );
    await fetch(`/api/notifications/${n.id}`, { method: "PATCH" }).catch(() => {});
    if (n.project_id) router.push(`/dashboard/projects/${n.project_id}`);
  }

  async function deleteOne(id: number, e: React.MouseEvent) {
    e.stopPropagation();
    await fetch(`/api/notifications/${id}`, { method: "DELETE" });
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Notifications</h1>

      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : notifications.length === 0 ? (
        <p className="text-gray-400">No notifications</p>
      ) : (
        <div className="bg-white rounded-xl shadow-sm divide-y">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => open(n)}
              className={`flex items-start justify-between px-5 py-4 cursor-pointer hover:bg-gray-50 transition
                ${n.is_read ? "opacity-60" : "font-medium"}`}
            >
              <div>
                <p className="text-sm">{n.message}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(n.created_at).toLocaleString()}
                </p>
                {n.project_id && (
                  <p className="text-xs text-blue-500 mt-0.5">→ View project</p>
                )}
              </div>
              <button
                onClick={(e) => deleteOne(n.id, e)}
                className="text-gray-300 hover:text-red-500 ml-4 text-lg leading-none"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
