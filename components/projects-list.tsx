"use client";

import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import ProjectCard from "@/components/project-card";
import { fetchRepositories } from "@/lib/github-service";
import { Button } from "@/components/ui/button";
import { getCachedItem, setCachedItem } from "@/lib/cache-utils";
import type { Project } from "@/lib/types";
import { isRateLimited, getTimeUntilReset } from "@/lib/cache-utils";

// Define the cache time directly in this component
const REPOSITORIES_CACHE_TIME = 2 * 60 * 60 * 1000;

export default function ProjectsList({ language }: { language: "ar" | "en" }) {
  const searchParams = useSearchParams();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(20); // Initially show 20 projects

  useEffect(() => {
    async function loadProjects() {
      let cachedProjects: Project[] | null = null;
      try {
        setLoading(true);

        // 1. Try to get from cache first
        cachedProjects = getCachedItem<Project[]>("github_repositories");

        // 2. Show cached data immediately if available
        if (cachedProjects?.length) {
          setProjects(cachedProjects);
          setError(null);

          // 3. Check cache freshness and rate limits before background refresh
          const cacheEntry = localStorage.getItem("github_repositories");
          if (cacheEntry) {
            try {
              const { expiry } = JSON.parse(cacheEntry);
              const cacheAge = Date.now() - (expiry - REPOSITORIES_CACHE_TIME);

              // Only refresh if cache is stale and not rate limited
              if (cacheAge > 30 * 60 * 1000 && !isRateLimited()) {
                console.log("Initiating background refresh...");
                try {
                  const freshData = await fetchRepositories();
                  if (freshData.length) {
                    const updatedProjects = freshData.map((p) => ({
                      ...p,
                      contributors: p.contributors || 1,
                    }));

                    // Update state and cache only if data changed
                    if (
                      JSON.stringify(updatedProjects) !==
                      JSON.stringify(cachedProjects)
                    ) {
                      setProjects(updatedProjects);
                      setCachedItem(
                        "github_repositories",
                        updatedProjects,
                        REPOSITORIES_CACHE_TIME
                      );
                    }
                  }
                } catch (refreshError) {
                  console.warn("Background refresh failed:", refreshError);
                }
              }
            } catch (parseError) {
              console.error("Error parsing cache:", parseError);
            }
          }
          return;
        }

        // 4. No cached data - fetch fresh
        await handleFreshFetch();
      } catch (err) {
        handleLoadError(err, cachedProjects);
      } finally {
        setLoading(false);
      }
    }

    // Helper functions
    async function handleFreshFetch() {
      try {
        const data = await fetchRepositories();
        if (!data.length) throw new Error("No projects found");

        const projectsWithContributors = data.map((p) => ({
          ...p,
          contributors: p.contributors || 1,
        }));

        setProjects(projectsWithContributors);
        setError(null);
        setCachedItem(
          "github_repositories",
          projectsWithContributors,
          REPOSITORIES_CACHE_TIME
        );
      } catch (error) {
        throw error; // Rethrow for outer catch
      }
    }

    function handleLoadError(
      error: unknown,
      cachedProjects: Project[] | null
    ) {
      console.error("Load error:", error);

      if (error instanceof Error) {
        if (error.message.includes("rate limit")) {
          const resetMinutes = Math.ceil(
            (getTimeUntilReset() || 0) / 60000
          );
          setError(
            cachedProjects?.length
              ? `Using cached data (refresh in ${resetMinutes}min)`
              : `API limit exceeded (try in ${resetMinutes}min)`
          );
        } else {
          setError(
            cachedProjects?.length
              ? "Using cached data (fetch failed)"
              : "Failed to load projects"
          );
        }
      } else {
        setError("Unknown error occurred");
      }
    }

    loadProjects();
  }, []);

  // Use useMemo to derive filtered projects
  const filteredProjects = useMemo(() => {
    const searchTerm = searchParams.get("search") || "";
    const category = searchParams.get("category") || "all";
    const programmingLanguage = searchParams.get("language") || "all";
    const license = searchParams.get("license") || "all";

    let filtered = [...projects];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter((project) => {
        const searchIn =
          language === "ar"
            ? [project.titleAr, project.descriptionAr, ...project.tags]
            : [project.titleEn, project.descriptionEn, ...project.tags];

        return searchIn.some((text) =>
          text?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }

    // Apply category filter
    if (category !== "all") {
      filtered = filtered.filter((project) => project.category === category);
    }

    // Apply programming language filter
    if (programmingLanguage !== "all") {
      filtered = filtered.filter(
        (project) =>
          project.programmingLanguage.toLowerCase() ===
          programmingLanguage.toLowerCase()
      );
    }

    // Apply license filter
    if (license !== "all") {
      filtered = filtered.filter(
        (project) =>
          project.license.toLowerCase() === license.toLowerCase()
      );
    }

    // Sort by effective stars (source repo stars for forks, own stars for originals)
    filtered.sort((a, b) => {
      const aStars = a.fork && a.sourceRepo ? a.sourceRepo.stars : a.stars;
      const bStars = b.fork && b.sourceRepo ? b.sourceRepo.stars : b.stars;
      return bStars - aStars;
    });

    return filtered;
  }, [searchParams.toString(), language, projects]);

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(20);
  }, [searchParams.toString()]);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 20);
  };

  if (loading && projects.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
        <p className="mt-4 text-muted-foreground">
          {language === "ar" ? "جاري تحميل المشاريع..." : "Loading projects..."}
        </p>
      </div>
    );
  }

  if (error && projects.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">
          {language === "ar" ? error : error}
        </p>
        <p className="text-sm text-muted-foreground">
          {language === "ar"
            ? "يرجى المحاولة مرة أخرى لاحقًا"
            : "Please try again later"}
        </p>
      </div>
    );
  }

  // Get only the visible projects
  const visibleProjects = filteredProjects.slice(0, visibleCount);
  const hasMoreProjects = visibleCount < filteredProjects.length;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2
          className={cn(
            "text-2xl font-bold",
            language === "ar" && "font-arabic"
          )}
        >
          {language === "ar" ? "المشاريع المعروضة" : "Featured Projects"}
        </h2>
        <p
          className={cn(
            "text-sm text-muted-foreground",
            language === "ar" && "font-arabic"
          )}
        >
          {language === "ar"
            ? `${visibleProjects.length} من ${filteredProjects.length} مشروع`
            : `${visibleProjects.length} of ${filteredProjects.length} projects`}
        </p>
      </div>

      {filteredProjects.length === 0 ? (
        <div
          className={cn(
            "text-center py-16 bg-muted rounded-lg",
            language === "ar" && "font-arabic"
          )}
        >
          <p className="text-xl text-muted-foreground">
            {language === "ar"
              ? "لم يتم العثور على مشاريع مطابقة للمعايير"
              : "No projects found matching your criteria"}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {language === "ar"
              ? "جرب معايير بحث أو تصفية مختلفة"
              : "Try different search or filter criteria"}
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
                className={cn(
                  "bg-yemen-red hover:bg-yemen-red/90 px-8",
                  language === "ar" && "font-arabic"
                )}
              >
                {language === "ar"
                  ? "تحميل المزيد من المشاريع"
                  : "Load More Projects"}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}





