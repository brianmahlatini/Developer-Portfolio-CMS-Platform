import Stat from "@/components/Stat";
import { prisma } from "@/lib/db";

export const revalidate = 30;

export default async function AnalyticsPage() {
  const [viewCount, uniquePaths, recentViews] = await Promise.all([
    prisma.pageView.count(),
    prisma.pageView.groupBy({
      by: ["path"],
      _count: { path: true },
      orderBy: { _count: { path: "desc" } },
      take: 5,
    }),
    prisma.pageView.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
          Analytics
        </p>
        <h1 className="text-2xl font-semibold">Audience insights</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Stat label="Total Page Views" value={`${viewCount}`} />
        <Stat label="Top Paths" value={`${uniquePaths.length}`} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold">Top content</h2>
          <div className="mt-4 space-y-3 text-sm">
            {uniquePaths.map((item) => (
              <div key={item.path} className="flex justify-between">
                <span className="text-slate-700">{item.path}</span>
                <span className="text-slate-500">{item._count.path}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold">Recent activity</h2>
          <div className="mt-4 space-y-3 text-sm">
            {recentViews.map((view) => (
              <div key={view.id} className="flex justify-between">
                <span className="text-slate-700">{view.path}</span>
                <span className="text-slate-500">
                  {view.createdAt.toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
