"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { LayoutDashboard, FileText, LogOut, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

export function Sidebar({ isOpen = true, onToggle }: SidebarProps) {
  const t = useTranslations("admin.sidebar");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close sidebar when route changes on mobile
  useEffect(() => {
    if (onToggle && isOpen && window.innerWidth < 1024) {
      onToggle();
    }
  }, [pathname]);

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
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 start-0 z-50 w-64 bg-card border-e border-border min-h-screen flex flex-col transform transition-transform duration-300 ease-in-out",
          // On mobile: show/hide based on isOpen
          // On desktop (lg): always visible
          isOpen ? "translate-x-0" : "-translate-x-full rtl:translate-x-full",
          "lg:translate-x-0 lg:rtl:translate-x-0",
        )}
      >
        <div className="p-4 border-b border-border flex items-center justify-between">
          <Link href={`/${locale}/admin`}>
            <img src={logoSrc} alt="Qafila" className="h-8 w-auto" />
          </Link>
          {/* Close button for mobile */}
          <button
            onClick={onToggle}
            className="lg:hidden p-2 rounded-lg hover:bg-background-secondary transition-colors"
          >
            <X className="w-5 h-5 text-text-gray" />
          </button>
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
    </>
  );
}

// Mobile hamburger button component
export function SidebarToggle({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="lg:hidden p-2 rounded-lg hover:bg-background-secondary transition-colors"
    >
      <Menu className="w-6 h-6 text-foreground" />
    </button>
  );
}
