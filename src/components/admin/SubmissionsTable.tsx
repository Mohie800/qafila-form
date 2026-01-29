"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Eye, Trash2, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Submission } from "@/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Card } from "@/components/ui/Card";

interface SubmissionsTableProps {
  submissions: Submission[];
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onSearch: (search: string) => void;
  onCategoryFilter: (category: string) => void;
  onDelete: (id: string) => void;
}

export function SubmissionsTable({
  submissions,
  totalPages,
  currentPage,
  onPageChange,
  onSearch,
  onCategoryFilter,
  onDelete,
}: SubmissionsTableProps) {
  const t = useTranslations("admin.submissions");
  const tCategories = useTranslations("categories");
  const locale = useLocale();
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const categoryOptions = [
    { value: "", label: t("allCategories") },
    { value: "fashion", label: tCategories("fashion") },
    { value: "jewelry", label: tCategories("jewelry") },
    { value: "home-decor", label: tCategories("home-decor") },
    { value: "art", label: tCategories("art") },
    { value: "crafts", label: tCategories("crafts") },
    { value: "food", label: tCategories("food") },
    { value: "beauty", label: tCategories("beauty") },
    { value: "other", label: tCategories("other") },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchValue);
  };

  const handleDelete = async (id: string) => {
    if (deleteId === id) {
      await onDelete(id);
      setDeleteId(null);
    } else {
      setDeleteId(id);
      setTimeout(() => setDeleteId(null), 3000);
    }
  };

  const getCategoryLabel = (category: string) => {
    try {
      return tCategories(category as any);
    } catch {
      return category;
    }
  };

  // if (submissions.length === 0) {
  //   return (
  //     <Card className="p-12 text-center">
  //       <p className="text-text-gray">{t("noSubmissions")}</p>
  //     </Card>
  //   );
  // }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <div className="flex-1">
            <Input
              placeholder={t("searchPlaceholder")}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>
          <Button type="submit" variant="secondary">
            <Search className="w-5 h-5" />
          </Button>
        </form>
        <div className="w-full sm:w-48">
          <Select
            options={categoryOptions}
            onChange={(e) => onCategoryFilter(e.target.value)}
            placeholder={t("filterByCategory")}
          />
        </div>
      </div>

      {submissions.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-text-gray">{t("noSubmissions")}</p>
        </Card>
      ) : (
        <>
          {/* Table */}
          <Card className="overflow-hidden" padding="none">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-background-secondary">
                  <tr>
                    <th className="text-left px-4 py-3 text-sm font-medium text-text-gray">
                      {t("columns.designer")}
                    </th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-text-gray">
                      {t("columns.brand")}
                    </th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-text-gray">
                      {t("columns.category")}
                    </th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-text-gray">
                      {t("columns.city")}
                    </th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-text-gray">
                      {t("columns.date")}
                    </th>
                    <th className="text-right px-4 py-3 text-sm font-medium text-text-gray">
                      {t("columns.actions")}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {submissions.map((submission) => (
                    <tr
                      key={submission.id}
                      className="hover:bg-background-secondary/50"
                    >
                      <td className="px-4 py-4">
                        <div>
                          <p className="font-medium text-foreground">
                            {submission.designerName}
                          </p>
                          <p className="text-sm text-text-gray">
                            {submission.email}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-foreground">
                        {submission.brandName}
                      </td>
                      <td className="px-4 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent/10 text-accent">
                          {getCategoryLabel(submission.category)}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-text-gray">
                        {submission.city}
                      </td>
                      <td className="px-4 py-4 text-text-gray">
                        {formatDate(submission.createdAt, locale)}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() =>
                              router.push(
                                `/${locale}/admin/submissions/${submission.id}`,
                              )
                            }
                            className="p-2 rounded-lg hover:bg-background-secondary transition-colors"
                            title="View"
                          >
                            <Eye className="w-5 h-5 text-text-gray hover:text-foreground" />
                          </button>
                          <button
                            onClick={() => handleDelete(submission.id)}
                            className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            title={
                              deleteId === submission.id
                                ? "Click again to confirm"
                                : "Delete"
                            }
                          >
                            <Trash2
                              className={`w-5 h-5 ${
                                deleteId === submission.id
                                  ? "text-red-500"
                                  : "text-text-gray hover:text-red-500"
                              }`}
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm text-text-gray">
                {currentPage} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
