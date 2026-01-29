"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Play,
  Download,
  FileText,
  ExternalLink,
} from "lucide-react";
import { vendorFormSchema, VendorFormData } from "@/lib/validations";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { FileUpload } from "@/components/ui/FileUpload";
import { Card, CardContent } from "@/components/ui/Card";

interface VendorFormProps {
  onBack?: () => void;
}

export function VendorForm({ onBack }: VendorFormProps) {
  const t = useTranslations("form");
  const tCategories = useTranslations("categories");
  const tFulfillment = useTranslations("fulfillment");
  const tPolicies = useTranslations("policies");
  const tCommon = useTranslations("common");

  const [videosWatched, setVideosWatched] = useState({
    video1: false,
    video2: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  // File states
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bankDetailsFile, setBankDetailsFile] = useState<File | null>(null);
  const [commercialRegFile, setCommercialRegFile] = useState<File | null>(null);
  const [taxCertificateFile, setTaxCertificateFile] = useState<File | null>(
    null,
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<VendorFormData>({
    resolver: zodResolver(vendorFormSchema),
    defaultValues: {
      designerName: "",
      email: "",
      city: "",
      category: "",
      brandName: "",
      phoneNumber: "",
      storeLink: "",
      brandStory: "",
      fulfillmentMethod: "",
      productImagePolicy: false,
      returnRefundPolicy: false,
      privacyPolicy: false,
      termsOfUse: false,
      commissionShippingPolicy: false,
      whistleblowingPolicy: false,
    },
  });

  const categoryOptions = [
    { value: "fashion", label: tCategories("fashion") },
    { value: "jewelry", label: tCategories("jewelry") },
    { value: "home-decor", label: tCategories("home-decor") },
    { value: "art", label: tCategories("art") },
    { value: "crafts", label: tCategories("crafts") },
    { value: "food", label: tCategories("food") },
    { value: "beauty", label: tCategories("beauty") },
    { value: "other", label: tCategories("other") },
  ];

  const fulfillmentOptions = [
    { value: "self", label: tFulfillment("self") },
    { value: "qafila", label: tFulfillment("qafila") },
    { value: "hybrid", label: tFulfillment("hybrid") },
  ];

  const onSubmit = async (data: VendorFormData) => {
    if (!logoFile || !bankDetailsFile || !commercialRegFile) {
      return;
    }

    // Check if all policy checkboxes are checked
    if (
      !data.productImagePolicy ||
      !data.returnRefundPolicy ||
      !data.privacyPolicy ||
      !data.termsOfUse ||
      !data.commissionShippingPolicy ||
      !data.whistleblowingPolicy
    ) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const formData = new FormData();

      // Add text fields
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, String(value));
      });

      // Add files
      formData.append("logo", logoFile);
      formData.append("bankDetails", bankDetailsFile);
      formData.append("commercialRegister", commercialRegFile);
      if (taxCertificateFile) {
        formData.append("taxCertificate", taxCertificateFile);
      }

      const response = await fetch("/api/submissions", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Submission failed");
      }

      setSubmitStatus("success");
    } catch (error) {
      console.error("Submission error:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitStatus === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center"
        >
          <Card className="p-8">
            <CardContent>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 mx-auto mb-6 flex items-center justify-center"
              >
                <Check className="w-10 h-10 text-green-600 dark:text-green-400" />
              </motion.div>
              <h2 className="text-2xl font-bold text-foreground mb-3">
                {t("successTitle")}
              </h2>
              <p className="text-text-gray">{t("successMessage")}</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-text-gray hover:text-foreground transition-colors mb-4"
            >
              <ArrowLeft className="w-5 h-5 rtl:rotate-180" />
              <span>{tCommon("back")}</span>
            </button>
          )}
          <h1 className="text-3xl font-bold text-foreground">{t("title")}</h1>
          <p className="text-text-gray mt-2">{t("subtitle")}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Video Introduction */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                {t("introVideos")}
              </h2>
              <p className="text-text-gray text-sm mb-6">
                {t("introVideosDescription")}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Video 1 */}
                <div className="flex flex-col items-center p-4 border border-border rounded-lg bg-background-secondary">
                  <h3 className="font-medium text-foreground mb-3">
                    {t("video1Title")}
                  </h3>
                  <div className="flex gap-3">
                    <a
                      href="/video1.mp4"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() =>
                        setVideosWatched((prev) => ({ ...prev, video1: true }))
                      }
                      className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      <Play className="w-4 h-4" />
                      <span>{tCommon("view")}</span>
                    </a>
                    <a
                      href="/video1.mp4"
                      download
                      className="flex items-center gap-2 px-4 py-2 border border-border text-foreground rounded-lg hover:bg-background-secondary transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>{tCommon("download")}</span>
                    </a>
                  </div>
                </div>
                {/* Video 2 */}
                <div className="flex flex-col items-center p-4 border border-border rounded-lg bg-background-secondary">
                  <h3 className="font-medium text-foreground mb-3">
                    {t("video2Title")}
                  </h3>
                  <div className="flex gap-3">
                    <a
                      href="/video2.mp4"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() =>
                        setVideosWatched((prev) => ({ ...prev, video2: true }))
                      }
                      className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      <Play className="w-4 h-4" />
                      <span>{tCommon("view")}</span>
                    </a>
                    <a
                      href="/video2.mp4"
                      download
                      className="flex items-center gap-2 px-4 py-2 border border-border text-foreground rounded-lg hover:bg-background-secondary transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>{tCommon("download")}</span>
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardContent className="space-y-5 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Input
                  label={t("designerName")}
                  placeholder={t("designerNamePlaceholder")}
                  error={errors.designerName?.message}
                  required
                  {...register("designerName")}
                />
                <Input
                  label={t("email")}
                  type="email"
                  placeholder={t("emailPlaceholder")}
                  error={errors.email?.message}
                  required
                  {...register("email")}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Input
                  label={t("phoneNumber")}
                  type="tel"
                  placeholder={t("phoneNumberPlaceholder")}
                  error={errors.phoneNumber?.message}
                  required
                  {...register("phoneNumber")}
                />
                <Input
                  label={t("city")}
                  placeholder={t("cityPlaceholder")}
                  error={errors.city?.message}
                  required
                  {...register("city")}
                />
              </div>
            </CardContent>
          </Card>

          {/* Brand Information */}
          <Card>
            <CardContent className="space-y-5 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Input
                  label={t("brandName")}
                  placeholder={t("brandNamePlaceholder")}
                  error={errors.brandName?.message}
                  required
                  {...register("brandName")}
                />
                <Select
                  label={t("category")}
                  placeholder={t("categoryPlaceholder")}
                  options={categoryOptions}
                  error={errors.category?.message}
                  required
                  {...register("category")}
                />
              </div>

              <Input
                label={t("storeLink")}
                type="url"
                placeholder={t("storeLinkPlaceholder")}
                error={errors.storeLink?.message}
                {...register("storeLink")}
              />

              <Textarea
                label={t("brandStory")}
                placeholder={t("brandStoryPlaceholder")}
                error={errors.brandStory?.message}
                required
                rows={5}
                {...register("brandStory")}
              />
            </CardContent>
          </Card>

          {/* Business Details */}
          <Card>
            <CardContent className="space-y-5 p-6">
              <Select
                label={t("fulfillmentMethod")}
                placeholder={t("fulfillmentMethodPlaceholder")}
                options={fulfillmentOptions}
                error={errors.fulfillmentMethod?.message}
                required
                {...register("fulfillmentMethod")}
              />
            </CardContent>
          </Card>

          {/* Documents */}
          <Card>
            <CardContent className="space-y-5 p-6">
              <FileUpload
                label={t("logo")}
                hint={t("logoDescription")}
                fileType="image"
                maxSize={10 * 1024 * 1024}
                required
                value={logoFile}
                onChange={setLogoFile}
                error={
                  !logoFile && isSubmitting ? "Logo is required" : undefined
                }
              />

              <FileUpload
                label={t("bankDetails")}
                hint={t("bankDetailsDescription")}
                fileType="pdf"
                maxSize={20 * 1024 * 1024}
                required
                value={bankDetailsFile}
                onChange={setBankDetailsFile}
                error={
                  !bankDetailsFile && isSubmitting
                    ? "Bank details document is required"
                    : undefined
                }
              />

              <FileUpload
                label={t("commercialRegister")}
                hint={t("commercialRegisterDescription")}
                fileType="pdf"
                maxSize={20 * 1024 * 1024}
                required
                value={commercialRegFile}
                onChange={setCommercialRegFile}
                error={
                  !commercialRegFile && isSubmitting
                    ? "Commercial register is required"
                    : undefined
                }
              />

              <FileUpload
                label={t("taxCertificate")}
                hint={t("taxCertificateDescription")}
                fileType="pdf"
                maxSize={20 * 1024 * 1024}
                value={taxCertificateFile}
                onChange={setTaxCertificateFile}
              />
            </CardContent>
          </Card>

          {/* Policy Agreements */}
          <Card>
            <CardContent className="space-y-5 p-6">
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-2">
                  {t("policyAgreements")}
                </h2>
                <p className="text-text-gray text-sm">
                  {t("policyAgreementsDescription")}
                </p>
              </div>

              <div className="space-y-3">
                {/* Product Image Policy */}
                <div className="flex items-start gap-3 p-4 border border-border rounded-lg bg-background hover:bg-background-secondary transition-colors">
                  <input
                    type="checkbox"
                    id="productImagePolicy"
                    className="mt-1 w-5 h-5 rounded border-border text-primary focus:ring-primary cursor-pointer"
                    {...register("productImagePolicy")}
                  />
                  <div className="flex-1">
                    <label
                      htmlFor="productImagePolicy"
                      className="text-foreground text-sm font-medium cursor-pointer block mb-2"
                    >
                      {tPolicies("productImagePolicy")}
                    </label>
                    <a
                      href="/سياسة صور المنتجات - Product Image Policy.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-primary hover:text-primary/80 text-sm transition-colors"
                    >
                      <FileText className="w-4 h-4" />
                      <span>{tPolicies("readPolicy")}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                {/* Return Refund Policy */}
                <div className="flex items-start gap-3 p-4 border border-border rounded-lg bg-background hover:bg-background-secondary transition-colors">
                  <input
                    type="checkbox"
                    id="returnRefundPolicy"
                    className="mt-1 w-5 h-5 rounded border-border text-primary focus:ring-primary cursor-pointer"
                    {...register("returnRefundPolicy")}
                  />
                  <div className="flex-1">
                    <label
                      htmlFor="returnRefundPolicy"
                      className="text-foreground text-sm font-medium cursor-pointer block mb-2"
                    >
                      {tPolicies("returnRefundPolicy")}
                    </label>
                    <a
                      href="/سياسة الاستبدال والاسترجاع والالغاء - Return, Refund and Cancellation Policy.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-primary hover:text-primary/80 text-sm transition-colors"
                    >
                      <FileText className="w-4 h-4" />
                      <span>{tPolicies("readPolicy")}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                {/* Privacy Policy */}
                <div className="flex items-start gap-3 p-4 border border-border rounded-lg bg-background hover:bg-background-secondary transition-colors">
                  <input
                    type="checkbox"
                    id="privacyPolicy"
                    className="mt-1 w-5 h-5 rounded border-border text-primary focus:ring-primary cursor-pointer"
                    {...register("privacyPolicy")}
                  />
                  <div className="flex-1">
                    <label
                      htmlFor="privacyPolicy"
                      className="text-foreground text-sm font-medium cursor-pointer block mb-2"
                    >
                      {tPolicies("privacyPolicy")}
                    </label>
                    <a
                      href="/سياسة الخصوصية وسرية المعلومات - Privacy Policy & Confidentiality of Information.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-primary hover:text-primary/80 text-sm transition-colors"
                    >
                      <FileText className="w-4 h-4" />
                      <span>{tPolicies("readPolicy")}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                {/* Terms of Use */}
                <div className="flex items-start gap-3 p-4 border border-border rounded-lg bg-background hover:bg-background-secondary transition-colors">
                  <input
                    type="checkbox"
                    id="termsOfUse"
                    className="mt-1 w-5 h-5 rounded border-border text-primary focus:ring-primary cursor-pointer"
                    {...register("termsOfUse")}
                  />
                  <div className="flex-1">
                    <label
                      htmlFor="termsOfUse"
                      className="text-foreground text-sm font-medium cursor-pointer block mb-2"
                    >
                      {tPolicies("termsOfUse")}
                    </label>
                    <a
                      href="/شروط الاستخدام - Term of Use.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-primary hover:text-primary/80 text-sm transition-colors"
                    >
                      <FileText className="w-4 h-4" />
                      <span>{tPolicies("readPolicy")}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                {/* Commission Shipping Policy */}
                <div className="flex items-start gap-3 p-4 border border-border rounded-lg bg-background hover:bg-background-secondary transition-colors">
                  <input
                    type="checkbox"
                    id="commissionShippingPolicy"
                    className="mt-1 w-5 h-5 rounded border-border text-primary focus:ring-primary cursor-pointer"
                    {...register("commissionShippingPolicy")}
                  />
                  <div className="flex-1">
                    <label
                      htmlFor="commissionShippingPolicy"
                      className="text-foreground text-sm font-medium cursor-pointer block mb-2"
                    >
                      {tPolicies("commissionShippingPolicy")}
                    </label>
                    <a
                      href="/سياسة العمولة والشحن (المنصة مقابل المورد) - Commission Matrix (Platform vs. Vendor Split).pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-primary hover:text-primary/80 text-sm transition-colors"
                    >
                      <FileText className="w-4 h-4" />
                      <span>{tPolicies("readPolicy")}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                {/* Whistleblowing Policy */}
                <div className="flex items-start gap-3 p-4 border border-border rounded-lg bg-background hover:bg-background-secondary transition-colors">
                  <input
                    type="checkbox"
                    id="whistleblowingPolicy"
                    className="mt-1 w-5 h-5 rounded border-border text-primary focus:ring-primary cursor-pointer"
                    {...register("whistleblowingPolicy")}
                  />
                  <div className="flex-1">
                    <label
                      htmlFor="whistleblowingPolicy"
                      className="text-foreground text-sm font-medium cursor-pointer block mb-2"
                    >
                      {tPolicies("whistleblowingPolicy")}
                    </label>
                    <a
                      href="/سياسة للإبلاغ عن المخالفات - Whistleblowing Policy.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-primary hover:text-primary/80 text-sm transition-colors"
                    >
                      <FileText className="w-4 h-4" />
                      <span>{tPolicies("readPolicy")}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Error Message */}
          <AnimatePresence>
            {submitStatus === "error" && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
              >
                <p className="text-red-600 dark:text-red-400 text-sm">
                  {t("errorMessage")}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              size="lg"
              isLoading={isSubmitting}
              disabled={isSubmitting}
            >
              {isSubmitting ? t("submitting") : t("submitButton")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
