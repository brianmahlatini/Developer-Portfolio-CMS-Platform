import Link from "next/link";
import { ReactNode } from "react";

export default function Card({
  title,
  href,
  meta,
  children,
}: {
  title: string;
  href?: string;
  meta?: string;
  children: ReactNode;
}) {
  const inner = (
    <div className="flex h-full flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-amber-300 hover:shadow-lg">
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        {meta ? <p className="text-xs uppercase tracking-widest text-slate-500">{meta}</p> : null}
      </div>
      <div className="text-sm text-slate-600">{children}</div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {inner}
      </Link>
    );
  }

  return inner;
}
