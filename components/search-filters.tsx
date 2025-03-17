"use client"

import { useState, useEffect } from "react"
import { ChevronDown, Filter } from "lucide-react"
import { useSearchParams, useRouter } from "next/navigation"
import { useLanguage } from "@/lib/language-context"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { fetchRepositories } from "@/lib/github-service"

export default function SearchFilters() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { language } = useLanguage()

  // Initialize state from URL params
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedLanguage, setSelectedLanguage] = useState("all")
  const [selectedLicense, setSelectedLicense] = useState("all")

  // State for dynamic filter options
  const [categories, setCategories] = useState([
    { id: "all", labelEn: "All Categories", labelAr: "جميع الفئات" },
    { id: "library", labelEn: "Library", labelAr: "مكتبة" },
    { id: "application", labelEn: "Application", labelAr: "تطبيق" },
    { id: "tool", labelEn: "Tool", labelAr: "أداة" },
    { id: "framework", labelEn: "Framework", labelAr: "إطار عمل" },
  ])

  const [languages, setLanguages] = useState([{ id: "all", labelEn: "All Languages", labelAr: "جميع اللغات" }])

  const [licenses, setLicenses] = useState([{ id: "all", labelEn: "All Licenses", labelAr: "جميع التراخيص" }])

  // Fetch dynamic filter options from repositories
  useEffect(() => {
    async function fetchFilterOptions() {
      try {
        const repos = await fetchRepositories()

        // Extract unique programming languages
        const uniqueLanguages = new Set<string>()
        repos.forEach((repo) => {
          if (repo.programmingLanguage && repo.programmingLanguage !== "Unknown") {
            uniqueLanguages.add(repo.programmingLanguage)
          }
        })

        const languageOptions = [
          { id: "all", labelEn: "All Languages", labelAr: "جميع اللغات" },
          ...Array.from(uniqueLanguages)
            .sort()
            .map((lang) => ({
              id: lang.toLowerCase(),
              labelEn: lang,
              labelAr: getArabicLanguageName(lang),
            })),
        ]

        // Extract unique licenses
        const uniqueLicenses = new Set<string>()
        repos.forEach((repo) => {
          if (repo.license && repo.license !== "Unknown") {
            uniqueLicenses.add(repo.license)
          }
        })

        const licenseOptions = [
          { id: "all", labelEn: "All Licenses", labelAr: "جميع التراخيص" },
          ...Array.from(uniqueLicenses)
            .sort()
            .map((license) => ({
              id: license.toLowerCase(),
              labelEn: license,
              labelAr: license,
            })),
        ]

        setLanguages(languageOptions)
        setLicenses(licenseOptions)
      } catch (error) {
        console.error("Error fetching filter options:", error)
      }
    }

    fetchFilterOptions()
  }, [])

  // Sync state with URL params on mount and when searchParams changes
  useEffect(() => {
    setSelectedCategory(searchParams.get("category") || "all")
    setSelectedLanguage(searchParams.get("language") || "all")
    setSelectedLicense(searchParams.get("license") || "all")
  }, [searchParams])

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (value === "all") {
      params.delete(key)
    } else {
      params.set(key, value)
    }

    // Use replace instead of push to avoid adding to history stack
    router.replace(`/?${params.toString()}`, { scroll: false })
  }

  // Helper function to get Arabic language names
  function getArabicLanguageName(language: string): string {
    const arabicNames: Record<string, string> = {
      JavaScript: "جافاسكريبت",
      TypeScript: "تايبسكريبت",
      Python: "بايثون",
      Java: "جافا",
      PHP: "بي إتش بي",
      Go: "غو",
      Ruby: "روبي",
      "C#": "سي شارب",
      "C++": "سي بلس بلس",
      C: "سي",
      HTML: "إتش تي إم إل",
      CSS: "سي إس إس",
      Shell: "شل",
      Rust: "رست",
      Swift: "سويفت",
      Kotlin: "كوتلن",
    }

    return arabicNames[language] || language
  }

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row gap-3 mb-6 bg-card p-4 rounded-lg shadow-sm",
        language === "ar" && "flex-row-reverse",
      )}
    >
      <div className={cn("flex items-center text-sm text-muted-foreground", language === "ar" && "font-arabic")}>
        <Filter className="w-4 h-4 mr-2" />
        {language === "ar" ? "تصفية المشاريع:" : "Filter projects:"}
      </div>

      <div className={cn("flex flex-wrap gap-3", language === "ar" && "flex-row-reverse")}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={cn("flex items-center", language === "ar" && "font-arabic flex-row-reverse")}
            >
              {language === "ar"
                ? categories.find((c) => c.id === selectedCategory)?.labelAr
                : categories.find((c) => c.id === selectedCategory)?.labelEn}
              <ChevronDown className={cn("ml-2 h-4 w-4", language === "ar" && "mr-2 ml-0")} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuLabel className={language === "ar" ? "font-arabic text-right" : ""}>
              {language === "ar" ? "الفئة" : "Category"}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {categories.map((category) => (
              <DropdownMenuCheckboxItem
                key={category.id}
                checked={selectedCategory === category.id}
                onCheckedChange={() => {
                  setSelectedCategory(category.id)
                  updateFilters("category", category.id)
                }}
                className={language === "ar" ? "font-arabic text-right justify-between" : ""}
              >
                {language === "ar" ? category.labelAr : category.labelEn}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={cn("flex items-center", language === "ar" && "font-arabic flex-row-reverse")}
            >
              {language === "ar"
                ? languages.find((l) => l.id === selectedLanguage)?.labelAr
                : languages.find((l) => l.id === selectedLanguage)?.labelEn}
              <ChevronDown className={cn("ml-2 h-4 w-4", language === "ar" && "mr-2 ml-0")} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48 max-h-[300px] overflow-y-auto">
            <DropdownMenuLabel className={language === "ar" ? "font-arabic text-right" : ""}>
              {language === "ar" ? "لغة البرمجة" : "Programming Language"}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {languages.map((lang) => (
              <DropdownMenuCheckboxItem
                key={lang.id}
                checked={selectedLanguage === lang.id}
                onCheckedChange={() => {
                  setSelectedLanguage(lang.id)
                  updateFilters("language", lang.id)
                }}
                className={language === "ar" ? "font-arabic text-right justify-between" : ""}
              >
                {language === "ar" ? lang.labelAr : lang.labelEn}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={cn("flex items-center", language === "ar" && "font-arabic flex-row-reverse")}
            >
              {language === "ar"
                ? licenses.find((l) => l.id === selectedLicense)?.labelAr
                : licenses.find((l) => l.id === selectedLicense)?.labelEn}
              <ChevronDown className={cn("ml-2 h-4 w-4", language === "ar" && "mr-2 ml-0")} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuLabel className={language === "ar" ? "font-arabic text-right" : ""}>
              {language === "ar" ? "الترخيص" : "License"}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {licenses.map((license) => (
              <DropdownMenuCheckboxItem
                key={license.id}
                checked={selectedLicense === license.id}
                onCheckedChange={() => {
                  setSelectedLicense(license.id)
                  updateFilters("license", license.id)
                }}
                className={language === "ar" ? "font-arabic text-right justify-between" : ""}
              >
                {language === "ar" ? license.labelAr : license.labelEn}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

