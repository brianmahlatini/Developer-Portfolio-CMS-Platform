import Link from "next/link";
import Stat from "@/components/Stat";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/format";

export const revalidate = 30;

export default async function DashboardPage() {
  const [postCount, projectCount, viewCount, latestPosts] = await Promise.all([
    prisma.post.count(),
    prisma.project.count(),
    prisma.pageView.count(),
    prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      take: 4,
    }),
  ]);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
            Overview
          </p>
          <h1 className="text-2xl font-semibold">Content at a glance</h1>
        </div>
        <div className="flex gap-3">
          <Link
            href="/dashboard/posts/new"
            className="rounded-full bg-slate-950 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white"
          >
            New Post
          </Link>
          <Link
            href="/dashboard/projects/new"
            className="rounded-full border border-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-slate-900"
          >
            New Project
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Stat label="Total Posts" value={`${postCount}`} />
        <Stat label="Total Projects" value={`${projectCount}`} />
        <Stat label="Page Views" value={`${viewCount}`} />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold">Recent Posts</h2>
        <div className="mt-4 space-y-3 text-sm text-slate-600">
          {latestPosts.map((post) => (
            <div key={post.id} className="flex items-center justify-between">
              <span>{post.title}</span>
              <span>{formatDate(post.createdAt)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
