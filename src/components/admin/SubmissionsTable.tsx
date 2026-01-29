"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import {
  Eye,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  X,
} from "lucide-react";
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
  const tCommon = useTranslations("common");
  const tCategories = useTranslations("categories");
  const locale = useLocale();
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    submission: Submission | null;
  }>({
    open: false,
    submission: null,
  });
  const [isDeleting, setIsDeleting] = useState(false);

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

  const openDeleteModal = (submission: Submission) => {
    setDeleteModal({ open: true, submission });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ open: false, submission: null });
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.submission) return;
    setIsDeleting(true);
    try {
      await onDelete(deleteModal.submission.id);
      closeDeleteModal();
    } finally {
      setIsDeleting(false);
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
          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {submissions.map((submission) => (
              <Card key={submission.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">
                      {submission.designerName}
                    </p>
                    <p className="text-sm text-text-gray truncate">
                      {submission.email}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
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
                      onClick={() => openDeleteModal(submission)}
                      className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      title={tCommon("delete")}
                    >
                      <Trash2 className="w-5 h-5 text-text-gray hover:text-red-500" />
                    </button>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-text-gray text-xs">
                      {t("columns.brand")}
                    </p>
                    <p className="text-foreground truncate">
                      {submission.brandName}
                    </p>
                  </div>
                  <div>
                    <p className="text-text-gray text-xs">
                      {t("columns.category")}
                    </p>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-accent/10 text-accent">
                      {getCategoryLabel(submission.category)}
                    </span>
                  </div>
                  <div>
                    <p className="text-text-gray text-xs">
                      {t("columns.city")}
                    </p>
                    <p className="text-foreground">{submission.city}</p>
                  </div>
                  <div>
                    <p className="text-text-gray text-xs">
                      {t("columns.date")}
                    </p>
                    <p className="text-foreground">
                      {formatDate(submission.createdAt, locale)}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Desktop Table View */}
          <Card className="overflow-hidden hidden md:block" padding="none">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-background-secondary">
                  <tr>
                    <th className="text-start px-4 py-3 text-sm font-medium text-text-gray">
                      {t("columns.designer")}
                    </th>
                    <th className="text-start px-4 py-3 text-sm font-medium text-text-gray">
                      {t("columns.brand")}
                    </th>
                    <th className="text-start px-4 py-3 text-sm font-medium text-text-gray">
                      {t("columns.category")}
                    </th>
                    <th className="text-start px-4 py-3 text-sm font-medium text-text-gray">
                      {t("columns.city")}
                    </th>
                    <th className="text-start px-4 py-3 text-sm font-medium text-text-gray">
                      {t("columns.date")}
                    </th>
                    <th className="text-end px-4 py-3 text-sm font-medium text-text-gray">
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
                            onClick={() => openDeleteModal(submission)}
                            className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            title={tCommon("delete")}
                          >
                            <Trash2 className="w-5 h-5 text-text-gray hover:text-red-500" />
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

      {/* Delete Confirmation Modal */}
      {deleteModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeDeleteModal}
          />
          {/* Modal */}
          <div className="relative bg-background rounded-xl shadow-xl max-w-md w-full mx-4 p-6 animate-in fade-in zoom-in-95 duration-200">
            {/* Close button */}
            <button
              onClick={closeDeleteModal}
              className="absolute top-4 right-4 p-1 rounded-lg hover:bg-background-secondary transition-colors"
            >
              <X className="w-5 h-5 text-text-gray" />
            </button>

            {/* Icon */}
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
            </div>

            {/* Content */}
            <h3 className="text-lg font-semibold text-foreground text-center mb-2">
              {t("deleteModal.title")}
            </h3>
            <p className="text-text-gray text-center mb-2">
              {t("deleteModal.message")}
            </p>
            {deleteModal.submission && (
              <p className="text-foreground font-medium text-center mb-6">
                {deleteModal.submission.brandName} -{" "}
                {deleteModal.submission.designerName}
              </p>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={closeDeleteModal}
                disabled={isDeleting}
              >
                {tCommon("cancel")}
              </Button>
              <Button
                variant="primary"
                className="flex-1 !bg-red-500 hover:!bg-red-600"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? tCommon("loading") : tCommon("delete")}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
