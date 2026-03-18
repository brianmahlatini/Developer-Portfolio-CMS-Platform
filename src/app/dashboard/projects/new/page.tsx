import ProjectForm from "@/components/ProjectForm";

export default function NewProjectPage() {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
          New Project
        </p>
        <h1 className="text-2xl font-semibold">Create a project case study</h1>
      </div>
      <ProjectForm />
    </div>
  );
}
