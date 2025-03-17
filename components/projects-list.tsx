"use client"

import { useMemo, useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { useLanguage } from "@/lib/language-context"
import { cn } from "@/lib/utils"
import ProjectCard from "@/components/project-card"
import { fetchRepositories } from "@/lib/github-service"
import { Button } from "@/components/ui/button"
import type { Project } from "@/lib/types"

export default function ProjectsList() {
  const searchParams = useSearchParams()
  const { language } = useLanguage()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [visibleCount, setVisibleCount] = useState(20) 

  useEffect(() => {
    async function loadProjects() {
      try {
        setLoading(true)
        const data = await fetchRepositories()
        setProjects(data)
        setError(null)
      } catch (err) {
        setError("Failed to load projects. Please try again later.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadProjects()
  }, [])

  // Use useMemo to derive filtered projects
    const filteredProjects = useMemo(() => {
    const searchTerm = searchParams.get("search") || ""
    const category = searchParams.get("category") || "all"
    const programmingLanguage = searchParams.get("language") || "all"
    const license = searchParams.get("license") || "all"

    let filtered = [...projects]

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter((project) => {
        const searchIn =
          language === "ar"
            ? [project.titleAr, project.descriptionAr, ...project.tags]
            : [project.titleEn, project.descriptionEn, ...project.tags]

        return searchIn.some((text) => text?.toLowerCase().includes(searchTerm.toLowerCase()))
      })
    }

    // Apply category filter
    if (category !== "all") {
      filtered = filtered.filter((project) => project.category === category)
    }

    // Apply programming language filter
    if (programmingLanguage !== "all") {
      filtered = filtered.filter(
        (project) => project.programmingLanguage.toLowerCase() === programmingLanguage.toLowerCase(),
      )
    }

    // Apply license filter
    if (license !== "all") {
      filtered = filtered.filter((project) => project.license.toLowerCase() === license.toLowerCase())
    }

    return filtered
  }, [searchParams.toString(), language, projects])

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(20)
  }, [searchParams.toString()])

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 20)
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
        <p className="mt-4 text-muted-foreground">
          {language === "ar" ? "جاري تحميل المشاريع..." : "Loading projects..."}
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12 text-destructive">
        <p>{language === "ar" ? "حدث خطأ: " + error : "Error: " + error}</p>
      </div>
    )
  }

  // Get only the visible projects
  const visibleProjects = filteredProjects.slice(0, visibleCount)
  const hasMoreProjects = visibleCount < filteredProjects.length

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className={cn("text-2xl font-bold", language === "ar" && "font-arabic")}>
          {language === "ar" ? "المشاريع المعروضة" : "Featured Projects"}
        </h2>
        <p className={cn("text-sm text-muted-foreground", language === "ar" && "font-arabic")}>
          {language === "ar"
            ? `${visibleProjects.length} من ${filteredProjects.length} مشروع`
            : `${visibleProjects.length} of ${filteredProjects.length} projects`}
        </p>
      </div>

      {filteredProjects.length === 0 ? (
        <div className={cn("text-center py-16 bg-muted rounded-lg", language === "ar" && "font-arabic")}>
          <p className="text-xl text-muted-foreground">
            {language === "ar"
              ? "لم يتم العثور على مشاريع مطابقة للمعايير"
              : "No projects found matching your criteria"}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {language === "ar" ? "جرب معايير بحث أو تصفية مختلفة" : "Try different search or filter criteria"}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>

          {hasMoreProjects && (
            <div className="mt-10 text-center">
              <Button
                onClick={handleLoadMore}
                className={cn("bg-yemen-red hover:bg-yemen-red/90 px-8", language === "ar" && "font-arabic")}
              >
                {language === "ar" ? "تحميل المزيد من المشاريع" : "Load More Projects"}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

