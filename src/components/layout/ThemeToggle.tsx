"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={cn(
          "w-10 h-10 rounded-lg bg-background-secondary animate-pulse",
          className,
        )}
      />
    );
  }

  const themes = [
    { value: "light", icon: Sun },
    { value: "dark", icon: Moon },
    { value: "system", icon: Monitor },
  ];

  const currentIndex = themes.findIndex((t) => t.value === theme);
  const nextTheme = themes[(currentIndex + 1) % themes.length];
  const CurrentIcon = themes[currentIndex]?.icon || Sun;

  return (
    <button
      onClick={() => setTheme(nextTheme.value)}
      className={cn(
        "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
        "bg-background-secondary hover:bg-border text-foreground",
        className,
      )}
      aria-label="Toggle theme"
    >
      <CurrentIcon className="w-5 h-5" />
    </button>
  );
}
