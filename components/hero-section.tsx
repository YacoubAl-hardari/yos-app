"use client"

import type React from "react"

import { useState } from "react"
import { Search } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useLanguage } from "@/lib/language-context"
import { cn } from "@/lib/utils"
import { HeroBackground } from "@/components/hero-background"

export function HeroSection() {
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter()
  const { language } = useLanguage()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      router.push(`/?search=${encodeURIComponent(searchTerm.trim())}`)
    }
  }

  return (
    <div className="relative bg-gradient-to-b from-yemen-red/5 via-background to-background dark:from-yemen-red/10 dark:via-background/80 dark:to-background py-20 md:py-32 overflow-hidden">
      {/* Animated Background */}
      <HeroBackground />

      <div className="container px-4 mx-auto text-center relative z-10">
        <div className="max-w-3xl mx-auto">
          <h1
            className={cn(
              "text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl mb-6 animate-float",
              language === "ar" && "font-arabic",
            )}
          >
            {language === "ar" ? "دليل مشاريع اليمن مفتوحة المصدر" : "Yemeni Open Source Projects Directory"}
          </h1>
          <p className={cn("text-lg text-muted-foreground mb-8 max-w-2xl mx-auto", language === "ar" && "font-arabic")}>
            {language === "ar"
              ? "استكشف وساهم في مشاريع البرمجيات مفتوحة المصدر من المطورين اليمنيين"
              : "Discover and contribute to open source software projects from Yemeni developers"}
          </p>
          <form onSubmit={handleSearch} className="relative max-w-xl mx-auto mb-8">
            <div className="flex">
              <Input
                type="text"
                placeholder={language === "ar" ? "ابحث عن مشاريع..." : "Search projects..."}
                className={cn("w-full h-12  rounded-lg shadow-lg ", language === "ar" && "text-right font-arabic pr-[6.3rem]")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button
                type="submit"
                className="absolute right-0 top-0 h-12 rounded-l-none bg-yemen-red hover:bg-yemen-red/90"
                dir={language === "ar" ? "rtl" : "ltr"}
              >
                <Search className="mr-2 h-4 w-4" />
                {language === "ar" ? "بحث" : "Search"}
              </Button>
            </div>
          </form>
          <div className="flex flex-wrap justify-center gap-2 mt-8">
            {["php", "react", "laravel", "python", "filament", "typescript"].map((tag) => (
              <Button
                key={tag}
                variant="outline"
                size="sm"
                className={cn(
                  "rounded-full border-yemen-red/20 hover:bg-yemen-red/5 hover:text-yemen-red transition-all",
                  language === "ar" && "font-arabic",
                )}
                onClick={() => router.push(`/?search=${tag}`)}
              >
                #{tag}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

