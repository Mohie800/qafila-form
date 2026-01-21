"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { SubmissionsTable } from "@/components/admin/SubmissionsTable";
import { Submission } from "@/types";

export default function SubmissionsPage() {
  const t = useTranslations("admin.submissions");
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchSubmissions = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        pageSize: "10",
      });
      if (search) params.set("search", search);
      if (category) params.set("category", category);

      const response = await fetch(`/api/submissions?${params}`);
      const data = await response.json();

      if (data.success) {
        setSubmissions(data.data);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.error("Failed to fetch submissions:", error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, search, category]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/submissions/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchSubmissions();
      }
    } catch (error) {
      console.error("Failed to delete submission:", error);
    }
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleCategoryFilter = (value: string) => {
    setCategory(value);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t("title")}</h1>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <SubmissionsTable
          submissions={submissions}
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onSearch={handleSearch}
          onCategoryFilter={handleCategoryFilter}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
