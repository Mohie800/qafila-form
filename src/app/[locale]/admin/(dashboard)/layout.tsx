import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { getCurrentAdmin, isAdminSetupRequired } from "@/lib/auth";
import { AdminLayoutClient } from "./AdminLayoutClient";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const setupRequired = await isAdminSetupRequired();

  // If no admin exists, redirect to setup
  if (setupRequired) {
    redirect(`/${locale}/admin/setup`);
  }

  const admin = await getCurrentAdmin();

  // If not logged in, redirect to login
  if (!admin) {
    redirect(`/${locale}/admin/login`);
  }

  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
