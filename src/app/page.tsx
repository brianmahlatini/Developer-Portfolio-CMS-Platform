import Link from "next/link";
import Container from "@/components/Container";
import Card from "@/components/Card";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/format";

export const revalidate = 60;

export default async function HomePage() {
  const [posts, projects] = await Promise.all([
    prisma.post.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
      take: 3,
    }),
    prisma.project.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
      take: 3,
    }),
  ]);

  return (
    <Container>
      <section className="pt-16">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
              Developer Portfolio CMS Platform
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
              A content-driven portfolio with a production-grade CMS workflow.
            </h1>
            <p className="text-lg text-slate-600">
              Manage blog posts, project case studies, SEO metadata, and analytics
              from one place. Built with Next.js, Prisma, PostgreSQL, and MDX.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/dashboard"
                className="rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white"
              >
                Launch Dashboard
              </Link>
              <Link
                href="/projects"
                className="rounded-full border border-slate-900 px-6 py-3 text-sm font-semibold text-slate-900"
              >
                Explore Projects
              </Link>
            </div>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
            <h2 className="text-lg font-semibold">What this proves</h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              <li>End-to-end CMS architecture with role-based access.</li>
              <li>Static site generation plus dynamic authoring.</li>
              <li>Built-in analytics for content performance.</li>
              <li>MDX-powered writing workflow.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mt-16">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Latest Posts</h2>
          <Link href="/blog" className="text-sm font-medium text-slate-600">
            View all
          </Link>
        </div>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
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

      <section className="mt-16">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Featured Projects</h2>
          <Link href="/projects" className="text-sm font-medium text-slate-600">
            View all
          </Link>
        </div>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {projects.map((project) => (
            <Card
              key={project.id}
              title={project.title}
              href={`/projects/${project.slug}`}
              meta={project.publishedAt ? formatDate(project.publishedAt) : "Draft"}
            >
              {project.summary}
            </Card>
          ))}
        </div>
      </section>
    </Container>
  );
}
