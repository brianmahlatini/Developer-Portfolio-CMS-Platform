export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-10 text-sm text-slate-600 md:flex-row md:items-center md:justify-between">
        <p>&copy; {new Date().getFullYear()} Developer Portfolio CMS Platform.</p>
        <p>Built with Next.js, Prisma, PostgreSQL, and MDX.</p>
      </div>
    </footer>
  );
}
