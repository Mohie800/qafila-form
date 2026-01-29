import { getTranslations } from "next-intl/server";
import prisma from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";
import { StatsCards } from "@/components/admin/StatsCards";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export default async function AdminDashboardPage() {
  const t = await getTranslations("admin.dashboard");
  const admin = await getCurrentAdmin();

  // Get stats
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [totalSubmissions, thisWeek, thisMonth, recentSubmissions] =
    await Promise.all([
      prisma.submission.count(),
      prisma.submission.count({
        where: { createdAt: { gte: startOfWeek } },
      }),
      prisma.submission.count({
        where: { createdAt: { gte: startOfMonth } },
      }),
      prisma.submission.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          designerName: true,
          brandName: true,
          category: true,
          createdAt: true,
        },
      }),
    ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t("title")}</h1>
        <p className="text-text-gray mt-1">
          {t("welcome")}, {admin?.username}
        </p>
      </div>

      <StatsCards
        totalSubmissions={totalSubmissions}
        thisWeek={thisWeek}
        thisMonth={thisMonth}
      />

      <Card>
        <CardHeader>
          <CardTitle>{t("recentSubmissions")}</CardTitle>
        </CardHeader>
        <CardContent>
          {recentSubmissions.length === 0 ? (
            <p className="text-text-gray text-center py-8">
              No submissions yet
            </p>
          ) : (
            <div className="divide-y divide-border">
              {recentSubmissions.map(
                (submission: {
                  id: string;
                  designerName: string;
                  brandName: string;
                  category: string;
                  createdAt: Date;
                }) => (
                  <div
                    key={submission.id}
                    className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-foreground truncate">
                        {submission.brandName}
                      </p>
                      <p className="text-sm text-text-gray truncate">
                        {submission.designerName}
                      </p>
                    </div>
                    <div className="shrink-0">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent/10 text-accent">
                        {submission.category}
                      </span>
                    </div>
                  </div>
                ),
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
