"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ContributorsHero } from "@/components/contributors-hero"
import { ContributorsChart } from "@/components/contributors-chart"
import { ContributorCard } from "@/components/contributor-card"
import { ContributorsStatistics } from "@/components/contributors-statistics"
import { ContributorsTimeline } from "@/components/contributors-timeline"
import { fetchRepositories, fetchRepositoryContributors, fetchRepositoryReadme } from "@/lib/github-service"
import { PageTransition } from "@/components/page-transition"
import { Markdown } from "@/components/markdown"   
import type { Project, Contributor } from "@/lib/types"

export default function ContributorsPage() {
  const params = useParams()
  const router = useRouter()
  const { language } = useLanguage()
  const [project, setProject] = useState<Project | null>(null)
  const [contributors, setContributors] = useState<Contributor[]>([])
  const [period, setPeriod] = useState("all")
  const [activeTab, setActiveTab] = useState("overview")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [readmeContent, setReadmeContent] = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        const projectId = params.id as string

        // Fetch project details
        const repos = await fetchRepositories()
        const foundProject = repos.find((p) => p.id === projectId)

        if (!foundProject) {
          setError("Project not found")
          return
        }

        setProject(foundProject)

        // Fetch contributors with detailed stats
        if (foundProject.owner && foundProject.fullName) {
          const [owner, repo] = foundProject.fullName.split("/")
          const contributorsData = await fetchRepositoryContributors(owner, repo, true, true)
          setContributors(contributorsData)
        }

        setError(null)
      } catch (err) {
        console.error("Error loading data:", err)
        setError("Failed to load contributor data")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [params.id])

  useEffect(() => {
    async function loadReadme() {
      if (project?.owner && project?.fullName) {
        try {
          const [owner, repo] = project.fullName.split("/")
          const readme = await fetchRepositoryReadme(owner, repo, project.defaultBranch)
          setReadmeContent(readme)
        } catch (error) {
          console.error("Error fetching README:", error)
          setReadmeContent("Failed to load README content.")
        }
      }
    }

    if (project) {
      loadReadme()
    }
  }, [project])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin w-12 h-12 rounded-full border-4 border-yemen-red/20 border-t-yemen-red"></div>
          <p className="mt-4 text-muted-foreground">
            {language === "ar" ? "جاري تحميل البيانات..." : "Loading data..."}
          </p>
        </div>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className={cn("text-2xl font-bold mb-4", language === "ar" && "font-arabic")}>
          {language === "ar" ? "حدث خطأ" : "Error Occurred"}
        </h1>
        <p className={cn("text-muted-foreground mb-6", language === "ar" && "font-arabic")}>
          {language === "ar" ? error : error}
        </p>
        <Button
          onClick={() => router.back()}
          className={cn("bg-yemen-red hover:bg-yemen-red/90", language === "ar" && "font-arabic")}
        >
          {language === "ar" ? "العودة" : "Go Back"}
        </Button>
      </div>
    )
  }

  return (
    <PageTransition>
      <main className="min-h-screen">
        <ContributorsHero project={project} contributorsCount={contributors.length} />

        <div className="container mx-auto px-4 py-8">
          <Button
            variant="ghost"
            className={cn("mb-6 hover:text-yemen-red", language === "ar" && "font-arabic flex-row-reverse")}
            onClick={() => router.back()}
          >
            <ArrowLeft className={cn("h-4 w-4", language === "ar" ? "ml-2" : "mr-2")} />
            {language === "ar" ? "العودة" : "Back"}
          </Button>

          {/* Statistics Dashboard */}
          <div className="mb-8">
            <ContributorsStatistics contributors={contributors} />
          </div>

          {/* README Section */}
          {/* {readmeContent && ( */}
            {/*  <div className="bg-card border rounded-lg p-6 mb-8"> */}
              {/* <h2 className={cn("text-2xl font-bold mb-4", language === "ar" && "font-arabic")}> */}
                {/* README */}
              {/* </h2> */}
              {/* <div className={cn("prose dark:prose-invert max-w-none", language === "ar" && "rtl")}> */}
                {/* <Markdown content={readmeContent} />     ← render markdown here */}
              {/* </div> */}
            {/* </div> */}
          {/*  )} */}

          {/* Tabs for different views */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <TabsList>
                <TabsTrigger value="overview" className={language === "ar" ? "font-arabic" : ""}>
                  {language === "ar" ? "نظرة عامة" : "Overview"}
                </TabsTrigger>
                <TabsTrigger value="timeline" className={language === "ar" ? "font-arabic" : ""}>
                  {language === "ar" ? "الجدول الزمني" : "Timeline"}
                </TabsTrigger>
                <TabsTrigger value="contributors" className={language === "ar" ? "font-arabic" : ""}>
                  {language === "ar" ? "المساهمون" : "Contributors"}
                </TabsTrigger>
              </TabsList>

              <div className="flex gap-4">
                <Select value={period} onValueChange={setPeriod}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={language === "ar" ? "اختر الفترة" : "Select period"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{language === "ar" ? "كل الفترات" : "All time"}</SelectItem>
                    <SelectItem value="year">{language === "ar" ? "سنة واحدة" : "Past year"}</SelectItem>
                    <SelectItem value="6months">{language === "ar" ? "٦ أشهر" : "Past 6 months"}</SelectItem>
                    <SelectItem value="month">{language === "ar" ? "شهر واحد" : "Past month"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <TabsContent value="overview" className="space-y-8">
              {/* Main Chart */}
              <div className="bg-card border rounded-lg p-6">
                <h2 className={cn("text-2xl font-bold mb-4", language === "ar" && "font-arabic")}>
                  {language === "ar" ? "المساهمات عبر الزمن" : "Contributions over time"}
                </h2>
                <ContributorsChart contributors={contributors} period={period} />
              </div>

              {/* Top Contributors */}
              <div>
                <h2 className={cn("text-2xl font-bold mb-4", language === "ar" && "font-arabic")}>
                  {language === "ar" ? "أبرز المساهمين" : "Top Contributors"}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {contributors.slice(0, 6).map((contributor, index) => (
                    <ContributorCard key={contributor.id} contributor={contributor} rank={index + 1} period={period} />
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="timeline">
              <ContributorsTimeline contributors={contributors} />
            </TabsContent>

            <TabsContent value="contributors">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {contributors.map((contributor, index) => (
                  <ContributorCard key={contributor.id} contributor={contributor} rank={index + 1} period={period} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </PageTransition>
  )
}

