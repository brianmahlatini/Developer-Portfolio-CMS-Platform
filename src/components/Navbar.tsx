import Link from "next/link";
import { getSession } from "@/lib/auth";

const navItems = [
  { href: "/blog", label: "Blog" },
  { href: "/projects", label: "Projects" },
  { href: "/dashboard", label: "Dashboard" },
];

export default async function Navbar() {
  const session = await getSession();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          Developer Portfolio CMS
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium text-slate-700">
          <Link href="/blog" className="hover:text-slate-950">
            Blog
          </Link>
          <Link href="/projects" className="hover:text-slate-950">
            Projects
          </Link>
          {session ? (
            <Link href="/dashboard" className="hover:text-slate-950">
              Dashboard
            </Link>
          ) : (
            <Link href="/login" className="hover:text-slate-950">
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
