import { notFound } from "next/navigation";
import Container from "@/components/Container";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/format";
import { renderMdx } from "@/lib/mdx";

export const revalidate = 60;

export async function generateStaticParams() {
  const posts = await prisma.post.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true },
  });
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({
    where: { slug },
  });

  if (!post) return {};

  return {
    title: post.title,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      type: "article",
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({
    where: { slug, status: "PUBLISHED" },
  });

  if (!post) {
    notFound();
  }

  return (
    <Container>
      <article className="prose mx-auto max-w-3xl pt-16">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
          {post.publishedAt ? formatDate(post.publishedAt) : "Draft"}
        </p>
        <h1 className="mt-3 text-4xl font-semibold text-slate-950">
          {post.title}
        </h1>
        <p className="text-lg text-slate-600">{post.summary}</p>
        <div className="mt-10 space-y-6">{renderMdx(post.content)}</div>
      </article>
    </Container>
  );
}
