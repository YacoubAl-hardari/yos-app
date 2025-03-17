"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "@/components/theme-provider"
import { useLanguage } from "@/lib/language-context"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import type { Project } from "@/lib/types"

interface ProjectBannerProps {
  project: Project
}

export function ProjectBanner({ project }: ProjectBannerProps) {
  const { language } = useLanguage()
  const { theme } = useTheme()
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const isDark = theme === "dark"

    // Clear previous elements
    container.innerHTML = ""

    // Create animated elements
    const createAnimatedElement = (
      type: "line" | "circle",
      x: number,
      y: number,
      size: number,
      rotation = 0,
      delay = 0,
    ) => {
      const element = document.createElement("div")

      if (type === "line") {
        element.className = "animated-line"
        element.style.width = `${size}px`
        element.style.height = "1px"
        element.style.transform = `rotate(${rotation}deg)`
      } else {
        element.className = "animated-circle"
        element.style.width = `${size}px`
        element.style.height = `${size}px`
      }

      element.style.left = `${x}px`
      element.style.top = `${y}px`
      element.style.opacity = "0"
      element.style.animation = `fadeIn 1s ease-out ${delay}s forwards, float ${Math.random() * 3 + 3}s ease-in-out infinite`

      container.appendChild(element)

      // Add moving dot for lines
      if (type === "line") {
        const dot = document.createElement("div")
        dot.className = "moving-dot"
        dot.style.animation = `moveAlongLine ${Math.random() * 5 + 8}s linear infinite`
        dot.style.animationDelay = `${Math.random() * 3}s`
        element.appendChild(dot)
      }
    }

    // Get container dimensions
    const width = container.offsetWidth
    const height = container.offsetHeight

    // Create random elements
    for (let i = 0; i < 10; i++) {
      const x = Math.random() * width
      const y = Math.random() * height
      const size = Math.random() * 100 + 50
      const rotation = Math.random() * 360
      const delay = Math.random() * 1.5

      createAnimatedElement("line", x, y, size, rotation, delay)
    }

    for (let i = 0; i < 15; i++) {
      const x = Math.random() * width
      const y = Math.random() * height
      const size = Math.random() * 6 + 2
      const delay = Math.random() * 2

      createAnimatedElement("circle", x, y, size, 0, delay)
    }

    // Cleanup function
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = ""
      }
    }
  }, [theme])

  return (
    <div className="relative bg-gradient-to-b from-yemen-red/10 via-background to-background dark:from-yemen-red/20 dark:via-background/90 dark:to-background py-16 md:py-24 overflow-hidden">
      {/* Animated Background */}
      <div ref={containerRef} className="project-banner-bg absolute inset-0 z-0" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h1 className={cn("text-4xl md:text-5xl lg:text-6xl font-bold mb-4", language === "ar" && "font-arabic")}>
            {language === "ar" ? project.titleAr : project.titleEn}
          </h1>

          <p className={cn("text-xl text-muted-foreground mb-8 max-w-3xl mx-auto", language === "ar" && "font-arabic")}>
            {language === "ar" ? project.descriptionAr : project.descriptionEn}
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            {project.tags.map((tag, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.1 * idx }}
              >
                <span
                  className={cn(
                    "inline-block px-3 py-1 rounded-full text-sm bg-yemen-red/10 text-yemen-red",
                    language === "ar" && "font-arabic",
                  )}
                >
                  {tag}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

