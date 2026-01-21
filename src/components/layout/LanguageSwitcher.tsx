"use client";

import { usePathname, useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { Languages } from "lucide-react";
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
  className?: string;
}

export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = () => {
    const newLocale = locale === "en" ? "ar" : "en";
    const pathWithoutLocale = pathname.replace(`/${locale}`, "");
    router.push(`/${newLocale}${pathWithoutLocale}`);
  };

  return (
    <button
      onClick={switchLocale}
      className={cn(
        "h-10 px-3 rounded-lg flex items-center gap-2 transition-colors",
        "bg-background-secondary hover:bg-border text-foreground",
        className,
      )}
      aria-label="Switch language"
    >
      <Languages className="w-5 h-5" />
      <span className="text-sm font-medium">
        {locale === "en" ? "العربية" : "EN"}
      </span>
    </button>
  );
}
