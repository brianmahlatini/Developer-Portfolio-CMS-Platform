import Container from "@/components/Container";
import Card from "@/components/Card";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/format";

export const revalidate = 60;

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <Container>
      <section className="pt-16">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
            Projects
          </p>
          <h1 className="text-3xl font-semibold">Case studies & builds</h1>
          <p className="text-slate-600">
            Deep dives into product strategy, architecture, and results.
          </p>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
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
