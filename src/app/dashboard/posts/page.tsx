import Link from "next/link";
import PostActions from "@/components/PostActions";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/format";

export const revalidate = 30;

export default async function PostsDashboardPage() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
            Posts
          </p>
          <h1 className="text-2xl font-semibold">Manage posts</h1>
        </div>
        <Link
          href="/dashboard/posts/new"
          className="rounded-full bg-slate-950 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white"
        >
          New Post
        </Link>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="grid gap-3 text-sm">
          {posts.map((post) => (
            <div
              key={post.id}
              className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-3 last:border-b-0 last:pb-0"
            >
              <div>
                <p className="font-semibold text-slate-900">{post.title}</p>
                <p className="text-xs uppercase tracking-widest text-slate-500">
                  {post.status} · {formatDate(post.createdAt)}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-xs font-semibold uppercase tracking-widest text-slate-600"
                >
                  View
                </Link>
                <PostActions id={post.id} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

