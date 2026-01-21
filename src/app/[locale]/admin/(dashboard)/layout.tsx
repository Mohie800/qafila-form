import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";
import { Sidebar } from "@/components/admin/Sidebar";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { getCurrentAdmin, isAdminSetupRequired } from "@/lib/auth";

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

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b border-border bg-card px-6 flex items-center justify-end gap-3">
          <LanguageSwitcher />
          <ThemeToggle />
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
