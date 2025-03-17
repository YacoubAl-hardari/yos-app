"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "@/components/theme-provider";
import { useLanguage } from "@/lib/language-context";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function AboutHero() {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    // Clear previous elements
    container.innerHTML = "";

    // Create animated elements
    const createAnimatedElement = (
      type: "line" | "circle" | "square",
      x: number,
      y: number,
      size: number,
      rotation = 0,
      delay = 0,
    ) => {
      const element = document.createElement("div");

      if (type === "line") {
        element.className = "animated-line";
        element.style.width = `${size}px`;
        element.style.height = "1px";
        element.style.transform = `rotate(${rotation}deg)`;
      } else if (type === "circle") {
        element.className = "animated-circle";
        element.style.width = `${size}px`;
        element.style.height = `${size}px`;
      } else {
        element.className = "animated-square";
        element.style.width = `${size}px`;
        element.style.height = `${size}px`;
        element.style.transform = `rotate(${rotation}deg)`;
      }

      element.style.left = `${x}px`;
      element.style.top = `${y}px`;
      element.style.opacity = "0";
      element.style.animation = `fadeIn 1s ease-out ${delay}s forwards, float ${Math.random() * 3 + 3}s ease-in-out infinite`;

      container.appendChild(element);

      // Add moving dot for lines
      if (type === "line") {
        const dot = document.createElement("div");
        dot.className = "moving-dot";
        dot.style.animation = `moveAlongLine ${Math.random() * 5 + 8}s linear infinite`;
        dot.style.animationDelay = `${Math.random() * 3}s`;
        element.appendChild(dot);
      }
    };

    // Get container dimensions
    const width = container.offsetWidth;
    const height = container.offsetHeight;

    // Create random elements
    for (let i = 0; i < 12; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const size = Math.random() * 100 + 50;
      const rotation = Math.random() * 360;
      const delay = Math.random() * 1.5;

      createAnimatedElement("line", x, y, size, rotation, delay);
    }

    for (let i = 0; i < 15; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const size = Math.random() * 6 + 2;
      const delay = Math.random() * 2;

      createAnimatedElement("circle", x, y, size, 0, delay);
    }

    // Add some squares for variety
    for (let i = 0; i < 8; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const size = Math.random() * 10 + 5;
      const rotation = Math.random() * 45;
      const delay = Math.random() * 2;

      createAnimatedElement("square", x, y, size, rotation, delay);
    }

    // Cleanup function
    return () => {
      container.innerHTML = ""; // Clean up the container when the component is unmounted
    };
  }, [theme]);

  return (
    <div className="relative bg-gradient-to-b from-yemen-red/10 via-background to-background dark:from-yemen-red/20 dark:via-background/90 dark:to-background py-20 md:py-32 overflow-hidden">
      {/* Animated Background */}
      <div ref={containerRef} className="about-hero-bg absolute inset-0 z-0" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h1 className={cn("text-4xl md:text-5xl lg:text-6xl font-bold mb-6", language === "ar" && "font-arabic")}>
            {language === "ar" ? "عن مصادر اليمن المفتوحة" : "About Yemen Open Source"}
          </h1>

          <p className={cn("text-xl text-muted-foreground mb-8 max-w-3xl mx-auto", language === "ar" && "font-arabic")}>
            {language === "ar"
              ? "مجتمع من المطورين اليمنيين المتحمسين الذين يعملون معًا لبناء مستقبل أفضل من خلال البرمجيات مفتوحة المصدر"
              : "A community of passionate Yemeni developers working together to build a better future through open source software"}
          </p>

          <div className="flex justify-center gap-3">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <span
                className={cn(
                  "inline-block px-4 py-2 rounded-full text-sm bg-yemen-red/10 text-yemen-red",
                  language === "ar" && "font-arabic",
                )}
              >
                {language === "ar" ? "مفتوح المصدر" : "Open Source"}
              </span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <span
                className={cn(
                  "inline-block px-4 py-2 rounded-full text-sm bg-yemen-green/10 text-yemen-green",
                  language === "ar" && "font-arabic",
                )}
              >
                {language === "ar" ? "مجتمع" : "Community"}
              </span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <span
                className={cn(
                  "inline-block px-4 py-2 rounded-full text-sm bg-yemen-black/10 text-foreground",
                  language === "ar" && "font-arabic",
                )}
              >
                {language === "ar" ? "ابتكار" : "Innovation"}
              </span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
