"use client";

import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    fetch("/api/notifications")
      .then(async (res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        setNotifications(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        setNotifications([]);
      });
  }, []);

  return (
    <div>
      <h1 className="text-xl font-semibold mb-6">
        Dashboard
      </h1>

      <div className="bg-white rounded-xl shadow-sm p-4">
        <h2 className="font-semibold mb-3">
          Notifications
        </h2>

        {notifications.length === 0 ? (
          <p className="text-sm text-gray-500">
            No notifications
          </p>
        ) : (
          <ul className="space-y-2">
            {notifications.map((n: any) => (
              <li
                key={n.id}
                className="text-sm border-b pb-2"
              >
                {n.message}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}