"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import Image from "next/image";
import { adminSetupSchema, AdminSetupData } from "@/lib/validations";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent } from "@/components/ui/Card";

export default function AdminSetupPage() {
  const t = useTranslations("admin.setup");
  const locale = useLocale();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminSetupData>({
    resolver: zodResolver(adminSetupSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Check if admin already exists
  useEffect(() => {
    const checkSetupRequired = async () => {
      try {
        const response = await fetch("/api/auth/setup");
        const result = await response.json();

        if (result.success && !result.data.setupRequired) {
          // Admin already exists, redirect to login
          router.push(`/${locale}/admin/login`);
        }
      } catch (err) {
        console.error("Failed to check setup status:", err);
      } finally {
        setIsChecking(false);
      }
    };

    checkSetupRequired();
  }, [locale, router]);

  const onSubmit = async (data: AdminSetupData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Setup failed");
      }

      router.push(`/${locale}/admin`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Setup failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state while checking if setup is required
  if (isChecking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-text-gray">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Image
            src="/Qafila-01.svg"
            alt="Qafila"
            width={140}
            height={56}
            className="mx-auto mb-6 dark:invert"
          />
          <h1 className="text-2xl font-bold text-foreground">{t("title")}</h1>
          <p className="text-text-gray mt-2">{t("subtitle")}</p>
        </div>

        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <p className="text-sm text-text-gray mb-4">{t("description")}</p>

              <Input
                label={t("usernameLabel")}
                placeholder={t("usernamePlaceholder")}
                error={errors.username?.message}
                required
                {...register("username")}
              />

              <Input
                label={t("passwordLabel")}
                type="password"
                placeholder={t("passwordPlaceholder")}
                error={errors.password?.message}
                hint={t("passwordRequirements")}
                required
                {...register("password")}
              />

              <Input
                label={t("confirmPasswordLabel")}
                type="password"
                placeholder={t("confirmPasswordPlaceholder")}
                error={errors.confirmPassword?.message}
                required
                {...register("confirmPassword")}
              />

              {error && (
                <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                className="w-full"
                size="lg"
                isLoading={isSubmitting}
              >
                {isSubmitting ? t("creating") : t("createButton")}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
