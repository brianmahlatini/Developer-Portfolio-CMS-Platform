"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export type ProjectEditorInitial = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  repoUrl: string | null;
  liveUrl: string | null;
  tags: string[];
  status: "DRAFT" | "PUBLISHED";
};

function toSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function ProjectEditor({ initial }: { initial: ProjectEditorInitial }) {
  const router = useRouter();
  const [title, setTitle] = useState(initial.title);
  const [slug, setSlug] = useState(initial.slug);
  const [summary, setSummary] = useState(initial.summary);
  const [content, setContent] = useState(initial.content);
  const [repoUrl, setRepoUrl] = useState(initial.repoUrl ?? "");
  const [liveUrl, setLiveUrl] = useState(initial.liveUrl ?? "");
  const [tags, setTags] = useState(initial.tags.join(", "));
  const [status, setStatus] = useState(initial.status);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const response = await fetch(`/api/projects/${initial.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        slug,
        summary,
        content,
        repoUrl,
        liveUrl,
        tags: tags.split(",").map((tag) => tag.trim()).filter(Boolean),
        status,
      }),
    });

    setLoading(false);

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setError(data.error ?? "Failed to update project");
      return;
    }

    router.push("/dashboard/projects");
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="grid gap-4">
        <div>
          <label className="text-sm font-medium text-slate-700">Title</label>
          <input
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
              if (!slug) setSlug(toSlug(event.target.value));
            }}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Slug</label>
          <input
            value={slug}
            onChange={(event) => setSlug(event.target.value)}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Summary</label>
          <textarea
            value={summary}
            onChange={(event) => setSummary(event.target.value)}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            rows={3}
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Content (MDX)</label>
          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 font-mono text-sm"
            rows={12}
            required
          />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-slate-700">Repo URL</label>
            <input
              value={repoUrl}
              onChange={(event) => setRepoUrl(event.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Live URL</label>
            <input
              value={liveUrl}
              onChange={(event) => setLiveUrl(event.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Tags</label>
          <input
            value={tags}
            onChange={(event) => setTags(event.target.value)}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            placeholder="Next.js, Prisma"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Status</label>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value as ProjectEditorInitial["status"])}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          >
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
          </select>
        </div>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white"
        >
          {loading ? "Saving..." : "Update Project"}
        </button>
      </div>
    </form>
  );
}
