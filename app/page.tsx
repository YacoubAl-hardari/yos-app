import { Suspense } from "react"
import ProjectsList from "@/components/projects-list"
import SearchFilters from "@/components/search-filters"
import { HeroSection } from "@/components/hero-section"
import ProjectsLoading from "@/components/projects-loading"

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <div className="container mx-auto px-4 py-8">
        <SearchFilters />
        <Suspense fallback={<ProjectsLoading />}>
          <ProjectsList />
        </Suspense>
      </div>
    </main>
  )
}

