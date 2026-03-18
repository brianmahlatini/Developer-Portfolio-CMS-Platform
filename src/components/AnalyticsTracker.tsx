"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const url = pathname + (searchParams?.toString() ? `?${searchParams}` : "");
    fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ path: url, referrer: document.referrer || undefined }),
    }).catch(() => {
      // Silently fail if analytics tracking fails
    });
  }, [pathname, searchParams]);

  return null;
}
