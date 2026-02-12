"use client";

import { useState, useRef, useEffect } from "react";
import { Bell } from "lucide-react";
import { useRouter } from "next/navigation";

type Props = {
  onMenuClick?: () => void;
};

type Notification = {
  id: number;
  message: string;
  type: string;
  project_id: number;
  is_read: number;
  created_at: string;
};

export default function TopBar({ onMenuClick }: Props) {
  const router = useRouter();

  const [plusOpen, setPlusOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const plusRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  /* =====================
     HELPERS
  ===================== */

  const unreadCount = notifications.filter(
    (n) => n.is_read === 0
  ).length;

  const loadNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      const data = await res.json();
      setNotifications(data);
    } catch {
      // silent fail
    }
  };

  const markAsRead = async (id: number) => {
    try {
      const res = await fetch(`/api/notifications/${id}`, {
        method: "PATCH",
      });

      if (!res.ok) return;

      // تحديث محلي فوري
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, is_read: 1 } : n
        )
      );
    } catch {}
  };

  /* =====================
     EFFECTS
  ===================== */

  // تحميل الإشعارات عند التشغيل
  useEffect(() => {
    loadNotifications();
  }, []);

  // إغلاق عند الضغط خارج
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        !plusRef.current?.contains(e.target as Node) &&
        !notifRef.current?.contains(e.target as Node)
      ) {
        setPlusOpen(false);
        setNotifOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () =>
      document.removeEventListener("mousedown", handler);
  }, []);

  /* =====================
     UI
  ===================== */

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b bg-white">
      {/* LEFT */}
      <div className="flex items-center gap-4">
        {onMenuClick && (
          <button onClick={onMenuClick} className="text-xl">
            ☰
          </button>
        )}
        <div className="font-semibold text-lg">
          Bold Dashboard
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4 relative">
        {/* OPEN SITE */}
        <button
          onClick={() => window.open("/bold-site/index.html", "_blank")}
          className="text-sm px-3 py-2 border rounded-md hover:bg-gray-100 transition"
        >
          Open Site
        </button>

        {/* PLUS */}
        <div ref={plusRef} className="relative">
          <button
            onClick={() => {
              setPlusOpen((p) => !p);
              setNotifOpen(false);
            }}
            className={`w-9 h-9 rounded-md text-xl transition
              ${plusOpen ? "bg-gray-200" : "hover:bg-gray-100"}
            `}
          >
            +
          </button>

          {plusOpen && (
            <div className="absolute right-0 top-11 w-44 bg-white rounded-md shadow-lg ring-1 ring-black/5 z-50">
              <button
                onClick={() => {
                  setPlusOpen(false);
                  router.push("/dashboard/quotation/new");
                }}
                className="w-full px-4 py-3 text-sm text-left hover:bg-gray-100"
              >
                Quotation
              </button>

              <div className="h-px bg-gray-200" />

              <button
                onClick={() => {
                  setPlusOpen(false);
                  router.push("/dashboard/projects/new");
                }}
                className="w-full px-4 py-3 text-sm text-left hover:bg-gray-100"
              >
                New Project
              </button>
            </div>
          )}
        </div>

        {/* NOTIFICATIONS */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => {
              setNotifOpen((p) => !p);
              setPlusOpen(false);
            }}
            className="relative text-gray-500 hover:text-black"
          >
            <Bell size={20} />

            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                {unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-11 w-80 bg-white rounded-xl shadow-lg ring-1 ring-black/5 z-50 overflow-hidden">
              <div className="px-4 py-3 font-semibold text-sm border-b">
                Notifications
              </div>

              {notifications.length === 0 ? (
                <div className="px-4 py-6 text-sm text-gray-500">
                  No notifications
                </div>
              ) : (
                notifications.slice(0, 6).map((n) => (
                  <button
                    key={n.id}
                    onClick={async () => {
                      if (n.is_read === 0) {
                        await markAsRead(n.id);
                      }

                      setNotifOpen(false);

                      if (n.type === "NEW_SUBMISSION") {
                        router.push("/dashboard/submissions");
                      } else {
                        router.push(`/dashboard/projects/${n.project_id}`);
                      }
                    }}
                    className={`w-full text-left px-4 py-3 border-b last:border-b-0 transition
                      ${
                        n.is_read
                          ? "bg-gray-50 text-gray-400"
                          : "hover:bg-gray-100"
                      }
                    `}
                  >
                    <div className="text-sm">
                      {n.message}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {new Date(
                        n.created_at
                      ).toLocaleString()}
                    </div>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}