"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function PostActions({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    await fetch(`/api/posts/${id}`, { method: "DELETE" });
    setLoading(false);
    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-xs font-semibold uppercase tracking-widest text-red-600"
    >
      {loading ? "Deleting" : "Delete"}
    </button>
  );
}
