"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
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
  const tStock = useTranslations("stock");
  const tCommon = useTranslations("common");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  // File states
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bankDetailsFile, setBankDetailsFile] = useState<File | null>(null);
  const [commercialRegFile, setCommercialRegFile] = useState<File | null>(null);
  const [returnPolicyFile, setReturnPolicyFile] = useState<File | null>(null);

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
      stockAvailability: "",
      branchCount: 0,
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

  const stockOptions = [
    { value: "in-stock", label: tStock("in-stock") },
    { value: "made-to-order", label: tStock("made-to-order") },
    { value: "pre-order", label: tStock("pre-order") },
    { value: "limited", label: tStock("limited") },
  ];

  const onSubmit = async (data: VendorFormData) => {
    if (!logoFile || !bankDetailsFile || !commercialRegFile) {
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
      if (returnPolicyFile) {
        formData.append("returnPolicy", returnPolicyFile);
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Select
                  label={t("fulfillmentMethod")}
                  placeholder={t("fulfillmentMethodPlaceholder")}
                  options={fulfillmentOptions}
                  error={errors.fulfillmentMethod?.message}
                  required
                  {...register("fulfillmentMethod")}
                />
                <Select
                  label={t("stockAvailability")}
                  placeholder={t("stockAvailabilityPlaceholder")}
                  options={stockOptions}
                  error={errors.stockAvailability?.message}
                  required
                  {...register("stockAvailability")}
                />
              </div>

              <Input
                label={t("branchCount")}
                type="number"
                placeholder={t("branchCountPlaceholder")}
                error={errors.branchCount?.message}
                required
                min={0}
                {...register("branchCount", { valueAsNumber: true })}
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
                label={t("returnPolicy")}
                hint={t("returnPolicyDescription")}
                fileType="pdf"
                maxSize={20 * 1024 * 1024}
                value={returnPolicyFile}
                onChange={setReturnPolicyFile}
              />
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
