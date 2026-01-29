"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { LayoutDashboard, FileText, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const t = useTranslations("admin.sidebar");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push(`/${locale}/admin/login`);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const navItems = [
    {
      href: `/${locale}/admin`,
      icon: LayoutDashboard,
      label: t("dashboard"),
    },
    {
      href: `/${locale}/admin/submissions`,
      icon: FileText,
      label: t("submissions"),
    },
  ];

  // Determine logo based on theme
  const logoSrc =
    mounted && resolvedTheme === "dark"
      ? "/horizontal-dark-logo.svg"
      : "/horizontal-light-logo.svg";

  return (
    <aside className="w-64 bg-card border-r border-border min-h-screen flex flex-col">
      <div className="p-4 border-b border-border">
        <Link href={`/${locale}/admin`}>
          <img src={logoSrc} alt="Qafila" className="h-8 w-auto" />
        </Link>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                    isActive
                      ? "bg-accent text-white"
                      : "text-text-gray hover:bg-background-secondary hover:text-foreground",
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-border">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg w-full text-text-gray hover:bg-background-secondary hover:text-foreground transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">{t("logout")}</span>
        </button>
      </div>
    </aside>
  );
}
