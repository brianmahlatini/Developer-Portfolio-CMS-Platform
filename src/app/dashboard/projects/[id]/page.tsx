import { notFound } from "next/navigation";
import ProjectEditor from "@/components/ProjectEditor";
import { prisma } from "@/lib/db";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await prisma.project.findUnique({ where: { id } });

  if (!project) {
    notFound();
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Edit Project</p>
        <h1 className="text-2xl font-semibold">Update case study</h1>
      </div>
      <ProjectEditor
        initial={{
          id: project.id,
          title: project.title,
          slug: project.slug,
          summary: project.summary,
          content: project.content,
          status: project.status,
          repoUrl: project.repoUrl,
          liveUrl: project.liveUrl,
          tags: project.tags,
        }}
      />
    </div>
  );
}
