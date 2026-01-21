"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedLogo } from "./AnimatedLogo";
import { PatternBackground } from "./PatternBackground";
import { Button } from "@/components/ui/Button";
import { VendorForm } from "@/components/form/VendorForm";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { useTranslations, useLocale } from "next-intl";

export function BrandReveal() {
  const [showForm, setShowForm] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  const t = useTranslations("landing");
  const locale = useLocale();
  const fullText = t("subtitle");
  const isRTL = locale === "ar";

  useEffect(() => {
    if (showForm) return;

    const words = fullText.split(" ");
    let currentIndex = 0;

    const timer = setInterval(() => {
      if (currentIndex <= words.length) {
        setDisplayedText(words.slice(0, currentIndex).join(" "));
        currentIndex++;
      } else {
        clearInterval(timer);
      }
    }, 50);

    return () => clearInterval(timer);
  }, [fullText, showForm]);

  const handleStart = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(() => {
      setShowForm(true);
      setIsTransitioning(false);
    }, 400);
  }, []);

  const handleBack = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(() => {
      setShowForm(false);
      setIsTransitioning(false);
      setDisplayedText("");
    }, 400);
  }, []);

  return (
    <div className="min-h-screen bg-brand-primary relative overflow-hidden">
      <PatternBackground isExiting={isTransitioning && !showForm} />

      {/* Floating Language Switcher */}
      <div className="fixed bottom-4 left-4 z-50">
        <LanguageSwitcher className="shadow-lg" />
      </div>

      <AnimatePresence mode="wait">
        {!showForm ? (
          <motion.div
            key="landing"
            className="min-h-screen flex flex-col items-center justify-center relative z-10 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeIn" }}
            style={{ willChange: "transform, opacity" }}
          >
            <AnimatedLogo className="mb-8 w-24 h-24" />

            <motion.p
              className={`text-white/80 text-sm md:text-xl mb-8 max-w-4xl px-4 min-h-37.5 ${
                isRTL ? "text-right" : "text-left"
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              dir={isRTL ? "rtl" : "ltr"}
            >
              {displayedText}
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
                className={`inline-block w-1 h-5 bg-white/80 align-middle ${
                  isRTL ? "mr-1" : "ml-1"
                }`}
              />
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Button
                variant="secondary"
                size="lg"
                onClick={handleStart}
                disabled={isTransitioning}
              >
                {t("startButton")}
              </Button>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            className="min-h-screen relative z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{ willChange: "transform, opacity" }}
          >
            <VendorForm onBack={handleBack} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
