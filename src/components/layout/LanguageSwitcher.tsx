"use client";

import { usePathname, useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import Image from "next/image";
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

  // Show the flag of the language we're switching TO
  const flagSrc =
    locale === "en"
      ? "/Flag_of_Saudi_Arabia.svg"
      : "/Flag_of_the_United_Kingdom.svg";
  const flagAlt = locale === "en" ? "Arabic" : "English";

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
      <span className="text-sm font-medium">
        {locale === "en" ? "العربية" : "EN"}
      </span>
      <Image
        src={flagSrc}
        alt={flagAlt}
        width={24}
        height={16}
        className="rounded-sm object-cover"
      />
    </button>
  );
}
