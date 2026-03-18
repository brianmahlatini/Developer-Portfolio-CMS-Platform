import { notFound } from "next/navigation";
import PostEditor from "@/components/PostEditor";
import { prisma } from "@/lib/db";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await prisma.post.findUnique({ where: { id } });

  if (!post) {
    notFound();
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Edit Post</p>
        <h1 className="text-2xl font-semibold">Update content</h1>
      </div>
      <PostEditor
        initial={{
          id: post.id,
          title: post.title,
          slug: post.slug,
          summary: post.summary,
          content: post.content,
          status: post.status,
        }}
      />
    </div>
  );
}
