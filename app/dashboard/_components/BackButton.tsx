"use client";

import { useRouter } from "next/navigation";

export default function BackButton({
  href = "/dashboard/projects",
  label = "Back",
}: {
  href?: string;
  label?: string;
}) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push(href)}
      className="
        inline-flex items-center
        text-sm font-medium
        text-gray-600
        hover:text-black
        mb-6
      "
    >
      ← {label}
    </button>
  );
}