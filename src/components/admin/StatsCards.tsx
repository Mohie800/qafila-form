import { useTranslations } from "next-intl";
import { FileText, TrendingUp, Calendar, BarChart3 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";

interface StatsCardsProps {
  totalSubmissions: number;
  thisWeek: number;
  thisMonth: number;
}

export function StatsCards({
  totalSubmissions,
  thisWeek,
  thisMonth,
}: StatsCardsProps) {
  const t = useTranslations("admin.dashboard");

  const stats = [
    {
      label: t("totalSubmissions"),
      value: totalSubmissions,
      icon: FileText,
      color: "text-brand-secondary-2",
      bgColor: "bg-brand-secondary-2/10",
    },
    {
      label: t("thisWeek"),
      value: thisWeek,
      icon: TrendingUp,
      color: "text-brand-secondary",
      bgColor: "bg-brand-secondary/10",
    },
    {
      label: t("thisMonth"),
      value: thisMonth,
      icon: Calendar,
      color: "text-brand-secondary-3",
      bgColor: "bg-brand-secondary-3/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-gray">{stat.label}</p>
                <p className="text-3xl font-bold text-foreground mt-1">
                  {stat.value}
                </p>
              </div>
              <div
                className={`w-12 h-12 rounded-full ${stat.bgColor} flex items-center justify-center`}
              >
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
