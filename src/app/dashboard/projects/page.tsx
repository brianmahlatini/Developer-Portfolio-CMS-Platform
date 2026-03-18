import Link from "next/link";
import ProjectActions from "@/components/ProjectActions";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/format";

export const revalidate = 30;

export default async function ProjectsDashboardPage() {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
            Projects
          </p>
          <h1 className="text-2xl font-semibold">Manage projects</h1>
        </div>
        <Link
          href="/dashboard/projects/new"
          className="rounded-full bg-slate-950 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white"
        >
          New Project
        </Link>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="grid gap-3 text-sm">
          {projects.map((project) => (
            <div
              key={project.id}
              className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-3 last:border-b-0 last:pb-0"
            >
              <div>
                <p className="font-semibold text-slate-900">{project.title}</p>
                <p className="text-xs uppercase tracking-widest text-slate-500">
                  {project.status} · {formatDate(project.createdAt)}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Link
                  href={`/projects/${project.slug}`}
                  className="text-xs font-semibold uppercase tracking-widest text-slate-600"
                >
                  View
                </Link>
                <ProjectActions id={project.id} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
