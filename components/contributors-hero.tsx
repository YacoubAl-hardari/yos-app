"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "@/components/theme-provider"
import { useLanguage } from "@/lib/language-context"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import type { Project } from "@/lib/types"

interface ContributorsHeroProps {
  project: Project
  contributorsCount: number
}

export function ContributorsHero({ project, contributorsCount }: ContributorsHeroProps) {
  const { language } = useLanguage()
  const { theme } = useTheme()
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const isDark = theme === "dark"

    // Clear previous elements
    container.innerHTML = ""

    // Create animated lines
    const createLine = (startX: number, startY: number, length: number, angle: number, delay: number) => {
      const line = document.createElement("div")
      line.className = "contributors-line"
      line.style.left = `${startX}px`
      line.style.top = `${startY}px`
      line.style.width = `${length}px`
      line.style.transform = `rotate(${angle}deg)`
      line.style.transformOrigin = "left center"
      line.style.opacity = "0"
      line.style.animation = `contributorsLineIn 0.6s ease-out ${delay}s forwards`

      // Add moving dot
      const dot = document.createElement("div")
      dot.className = "contributors-dot"
      dot.style.animation = `contributorsDotMove ${Math.random() * 3 + 2}s linear infinite`
      line.appendChild(dot)

      container.appendChild(line)
    }

    // Get container dimensions
    const width = container.offsetWidth
    const height = container.offsetHeight

    // Create a network of lines
    for (let i = 0; i < 15; i++) {
      const startX = Math.random() * width
      const startY = Math.random() * height
      const length = Math.random() * 150 + 50
      const angle = Math.random() * 360
      const delay = Math.random() * 1.5

      createLine(startX, startY, length, angle, delay)
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
      <div ref={containerRef} className="contributors-hero-bg absolute inset-0 z-0" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h1 className={cn("text-4xl md:text-5xl lg:text-6xl font-bold mb-4", language === "ar" && "font-arabic")}>
            {language === "ar" ? "المساهمون" : "Contributors"}
          </h1>

          <p className={cn("text-xl text-muted-foreground mb-8", language === "ar" && "font-arabic")}>
            {language === "ar"
              ? `${contributorsCount} مساهم في ${project.titleAr}`
              : `${contributorsCount} contributors to ${project.titleEn}`}
          </p>

          <div className="flex justify-center gap-3">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <span className="inline-block px-4 py-2 rounded-full text-sm bg-yemen-red/10 text-yemen-red">
                {project.programmingLanguage}
              </span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <span className="inline-block px-4 py-2 rounded-full text-sm bg-yemen-green/10 text-yemen-green">
                {project.license}
              </span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

