"use client";

import { useTranslations, useLocale } from "next-intl";
import { ArrowLeft, Download, ExternalLink } from "lucide-react";
import Link from "next/link";
import { formatDateTime } from "@/lib/utils";
import { Submission } from "@/types";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

interface SubmissionDetailProps {
  submission: Submission;
}

export function SubmissionDetail({ submission }: SubmissionDetailProps) {
  const t = useTranslations("admin.submissions.detail");
  const tForm = useTranslations("form");
  const tCategories = useTranslations("categories");
  const tFulfillment = useTranslations("fulfillment");
  const tPolicies = useTranslations("policies");
  const tCommon = useTranslations("common");
  const locale = useLocale();

  const getCategoryLabel = (category: string) => {
    try {
      return tCategories(category as any);
    } catch {
      return category;
    }
  };

  const getFulfillmentLabel = (method: string) => {
    try {
      return tFulfillment(method as any);
    } catch {
      return method;
    }
  };

  const InfoRow = ({
    label,
    value,
  }: {
    label: string;
    value: string | number | null;
  }) => (
    <div className="py-3 border-b border-border last:border-0">
      <p className="text-sm text-text-gray mb-1">{label}</p>
      <p className="text-foreground">{value || "-"}</p>
    </div>
  );

  const FileRow = ({ label, path }: { label: string; path: string | null }) => {
    if (!path) return null;

    return (
      <div className="py-3 border-b border-border last:border-0">
        <p className="text-sm text-text-gray mb-2">{label}</p>
        <a
          href={`/api/files${path}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-background-secondary rounded-lg hover:bg-border transition-colors text-sm font-medium text-foreground"
        >
          <Download className="w-4 h-4" />
          {t("downloadFile")}
        </a>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href={`/${locale}/admin/submissions`}
          className="flex items-center gap-2 text-text-gray hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-5 h-5 rtl:rotate-180" />
          <span>{tCommon("back")}</span>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">
            {t("title")}
          </h1>
          <p className="text-text-gray text-sm sm:text-base mt-1">
            {formatDateTime(submission.createdAt, locale)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>{t("contactInfo")}</CardTitle>
          </CardHeader>
          <CardContent>
            <InfoRow
              label={tForm("designerName")}
              value={submission.designerName}
            />
            <InfoRow label={tForm("email")} value={submission.email} />
            <InfoRow
              label={tForm("phoneNumber")}
              value={submission.phoneNumber}
            />
            <InfoRow label={tForm("city")} value={submission.city} />
          </CardContent>
        </Card>

        {/* Brand Information */}
        <Card>
          <CardHeader>
            <CardTitle>{t("brandInfo")}</CardTitle>
          </CardHeader>
          <CardContent>
            <InfoRow label={tForm("brandName")} value={submission.brandName} />
            <InfoRow
              label={tForm("category")}
              value={getCategoryLabel(submission.category)}
            />
            <div className="py-3 border-b border-border">
              <p className="text-sm text-text-gray mb-1">
                {tForm("storeLink")}
              </p>
              {submission.storeLink ? (
                <a
                  href={submission.storeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-accent hover:underline"
                >
                  {submission.storeLink}
                  <ExternalLink className="w-4 h-4" />
                </a>
              ) : (
                <p className="text-foreground">-</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Brand Story */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{tForm("brandStory")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground whitespace-pre-wrap">
              {submission.brandStory}
            </p>
          </CardContent>
        </Card>

        {/* Additional Information */}
        <Card>
          <CardHeader>
            <CardTitle>{t("additionalInfo")}</CardTitle>
          </CardHeader>
          <CardContent>
            <InfoRow
              label={tForm("fulfillmentMethod")}
              value={getFulfillmentLabel(submission.fulfillmentMethod)}
            />
          </CardContent>
        </Card>

        {/* Policy Agreements */}
        <Card>
          <CardHeader>
            <CardTitle>{tForm("policyAgreements")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2">
              <span
                className={
                  submission.productImagePolicy
                    ? "text-green-600"
                    : "text-red-600"
                }
              >
                {submission.productImagePolicy ? "✓" : "✗"}
              </span>
              <span className="text-foreground text-sm">
                {tPolicies("productImagePolicy")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={
                  submission.returnRefundPolicy
                    ? "text-green-600"
                    : "text-red-600"
                }
              >
                {submission.returnRefundPolicy ? "✓" : "✗"}
              </span>
              <span className="text-foreground text-sm">
                {tPolicies("returnRefundPolicy")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={
                  submission.privacyPolicy ? "text-green-600" : "text-red-600"
                }
              >
                {submission.privacyPolicy ? "✓" : "✗"}
              </span>
              <span className="text-foreground text-sm">
                {tPolicies("privacyPolicy")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={
                  submission.termsOfUse ? "text-green-600" : "text-red-600"
                }
              >
                {submission.termsOfUse ? "✓" : "✗"}
              </span>
              <span className="text-foreground text-sm">
                {tPolicies("termsOfUse")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={
                  submission.commissionShippingPolicy
                    ? "text-green-600"
                    : "text-red-600"
                }
              >
                {submission.commissionShippingPolicy ? "✓" : "✗"}
              </span>
              <span className="text-foreground text-sm">
                {tPolicies("commissionShippingPolicy")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={
                  submission.whistleblowingPolicy
                    ? "text-green-600"
                    : "text-red-600"
                }
              >
                {submission.whistleblowingPolicy ? "✓" : "✗"}
              </span>
              <span className="text-foreground text-sm">
                {tPolicies("whistleblowingPolicy")}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Documents */}
        <Card>
          <CardHeader>
            <CardTitle>{t("documents")}</CardTitle>
          </CardHeader>
          <CardContent>
            <FileRow label={tForm("logo")} path={submission.logoPath} />
            <FileRow
              label={tForm("bankDetails")}
              path={submission.bankDetailsPdf}
            />
            <FileRow
              label={tForm("commercialRegister")}
              path={submission.commercialRegPdf}
            />
            <FileRow
              label={tForm("taxCertificate")}
              path={submission.taxCertificatePdf}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
