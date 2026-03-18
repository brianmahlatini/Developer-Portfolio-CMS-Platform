import Container from "@/components/Container";
import Card from "@/components/Card";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/format";

export const revalidate = 60;

export default async function BlogPage() {
  const posts = await prisma.post.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <Container>
      <section className="pt-16">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Blog</p>
          <h1 className="text-3xl font-semibold">Writing and insights</h1>
          <p className="text-slate-600">
            Long-form posts on product, engineering, and content strategy.
          </p>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {posts.map((post) => (
            <Card
              key={post.id}
              title={post.title}
              href={`/blog/${post.slug}`}
              meta={post.publishedAt ? formatDate(post.publishedAt) : "Draft"}
            >
              {post.summary}
            </Card>
          ))}
        </div>
      </section>
    </Container>
  );
}
