"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale } from "next-intl";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { cn } from "@/lib/utils";

interface HeaderProps {
  className?: string;
  showLogo?: boolean;
}

export function Header({ className, showLogo = true }: HeaderProps) {
  const locale = useLocale();

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur",
        className,
      )}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {showLogo ? (
          <Link href={`/${locale}`} className="flex items-center">
            <Image
              src="/Qafila-01.svg"
              alt="Qafila"
              width={100}
              height={40}
              className="h-8 w-auto dark:invert"
            />
          </Link>
        ) : (
          <div />
        )}

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
