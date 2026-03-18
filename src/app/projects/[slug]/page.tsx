import { notFound } from "next/navigation";
import Container from "@/components/Container";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/format";
import { renderMdx } from "@/lib/mdx";

export const revalidate = 60;

export async function generateStaticParams() {
  const projects = await prisma.project.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true },
  });
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await prisma.project.findUnique({
    where: { slug },
  });

  if (!project) return {};

  return {
    title: project.title,
    description: project.summary,
    openGraph: {
      title: project.title,
      description: project.summary,
      type: "article",
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await prisma.project.findUnique({
    where: { slug, status: "PUBLISHED" },
  });

  if (!project) {
    notFound();
  }

  return (
    <Container>
      <article className="prose mx-auto max-w-3xl pt-16">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
          {project.publishedAt ? formatDate(project.publishedAt) : "Draft"}
        </p>
        <h1 className="mt-3 text-4xl font-semibold text-slate-950">
          {project.title}
        </h1>
        <p className="text-lg text-slate-600">{project.summary}</p>
        <div className="mt-6 flex flex-wrap gap-3 text-sm">
          {project.repoUrl ? (
            <a className="underline" href={project.repoUrl}>
              Repo
            </a>
          ) : null}
          {project.liveUrl ? (
            <a className="underline" href={project.liveUrl}>
              Live Site
            </a>
          ) : null}
        </div>
        <div className="mt-10 space-y-6">{renderMdx(project.content)}</div>
      </article>
    </Container>
  );
}
