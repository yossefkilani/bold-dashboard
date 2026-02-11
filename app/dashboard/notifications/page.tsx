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
  const [busyId, setBusyId] = useState<number | null>(null);
  const router = useRouter();

  /* ======================
     LOAD
  ====================== */
  useEffect(() => {
    fetch("/api/notifications")
      .then((res) => res.json())
      .then((data) => setNotifications(data))
      .finally(() => setLoading(false));
  }, []);

  /* ======================
     OPEN
  ====================== */
  async function openNotification(n: Notification) {
    if (busyId === n.id) return;
    setBusyId(n.id);

    // تحديث واجهة فوري
    setNotifications((prev) =>
      prev.map((x) =>
        x.id === n.id ? { ...x, is_read: 1 } : x
      )
    );

    try {
      await fetch(`/api/notifications/${n.id}`, {
        method: "PATCH"
      });
    } catch (err) {
      console.warn("Failed to mark as read", err);
    }

    // افتح المشروع فقط لو مرتبط
    if (n.project_id) {
      router.push(`/dashboard/projects/${n.project_id}`);
    }

    setBusyId(null);
  }

  /* ======================
     UI
  ====================== */
  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-6">
        Notifications
      </h1>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : notifications.length === 0 ? (
        <p className="text-gray-500">No notifications</p>
      ) : (
        <div className="bg-white rounded-xl shadow-sm divide-y">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => openNotification(n)}
              className={`
                block px-5 py-4 cursor-pointer transition
                hover:bg-gray-50
                ${n.is_read ? "opacity-60" : "font-medium"}
                ${busyId === n.id ? "pointer-events-none opacity-40" : ""}
              `}
            >
              <div className="text-sm">
                {n.message}
              </div>

              <div className="text-xs text-gray-400 mt-1">
                {new Date(n.created_at).toLocaleString()}
              </div>

              {!n.project_id && (
                <div className="text-xs text-amber-500 mt-1">
                  This notification is not linked to a project
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}