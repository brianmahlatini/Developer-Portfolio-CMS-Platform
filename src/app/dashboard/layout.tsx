import Link from "next/link";
import { redirect } from "next/navigation";
import Container from "@/components/Container";
import { getSession } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  return (
    <Container>
      <section className="pt-12">
        <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
          <aside className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 text-sm">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                CMS Dashboard
              </p>
              <p className="text-sm font-semibold">{session.name}</p>
            </div>
            <nav className="space-y-2 text-slate-600">
              <Link href="/dashboard" className="block hover:text-slate-950">
                Overview
              </Link>
              <Link href="/dashboard/posts" className="block hover:text-slate-950">
                Posts
              </Link>
              <Link
                href="/dashboard/projects"
                className="block hover:text-slate-950"
              >
                Projects
              </Link>
              <Link
                href="/dashboard/analytics"
                className="block hover:text-slate-950"
              >
                Analytics
              </Link>
              <form action="/api/auth/logout" method="post">
                <button
                  type="submit"
                  className="mt-4 w-full rounded-lg border border-slate-200 px-3 py-2 text-left text-xs font-semibold uppercase tracking-widest text-slate-700"
                >
                  Sign out
                </button>
              </form>
            </nav>
          </aside>
          <div>{children}</div>
        </div>
      </section>
    </Container>
  );
}
