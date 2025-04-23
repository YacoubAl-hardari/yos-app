"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Github, ExternalLink, Star, Users, Calendar, FileCode, Shield } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ProjectBanner } from "@/components/project-banner"
import { fetchRepositories, fetchRepositoryReadme, fetchRepositoryContributors } from "@/lib/github-service"
import { Markdown } from "@/components/markdown"
import type { Project, Contributor } from "@/lib/types"
import Link from "next/link"
import { PageTransition } from "@/components/page-transition"
import { githubQueue } from "@/lib/github-queue";
export default function ProjectDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { language } = useLanguage()
  const [project, setProject] = useState<Project | null>(null)
  const [readme, setReadme] = useState<string>("")
  const [contributors, setContributors] = useState<Contributor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadProjectData() {
      try {
        setLoading(true);
        const projectId = params.id as string;
  
        // Queue repositories fetch
        const repos = await githubQueue.add(() => fetchRepositories());
        const foundProject = repos.find((p) => p.id === projectId);
  
        if (!foundProject) {
          setError("Project not found");
          setLoading(false);
          return;
        }
  
        setProject(foundProject);
  
        if (foundProject.owner && foundProject.fullName) {
          const [owner, repo] = foundProject.fullName.split("/");
          
          // Validate defaultBranch before fetching README
          if (!foundProject.defaultBranch) {
            console.error("Default branch is undefined for project:", foundProject);
            setError("Failed to load README: Default branch is missing.");
            setLoading(false);
            return;
          }

          // Parallelize README and contributors with queue
          const [readmeContent, contributorsData] = await Promise.all([
            githubQueue.add(() => 
              fetchRepositoryReadme(owner, repo, foundProject.defaultBranch!)
            ).catch((err) => {
              console.error("Error fetching README:", err);
              return "Failed to load README content.";
            }),
            githubQueue.add(() => 
              fetchRepositoryContributors(owner, repo, true, false)
            ).catch((err) => {
              console.error("Error fetching contributors:", err);
              return [];
            })
          ]);
  
          setReadme(readmeContent);
          setContributors(contributorsData);
        }
  
        setError(null);
      } catch (err) {
        console.error("Error loading project data:", err);
        setError("Failed to load project data. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
  
    loadProjectData();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin w-12 h-12 rounded-full border-4 border-yemen-red/20 border-t-yemen-red"></div>
          <p className="mt-4 text-muted-foreground">
            {language === "ar" ? "جاري تحميل بيانات المشروع..." : "Loading project data..."}
          </p>
        </div>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className={cn("text-2xl font-bold mb-4", language === "ar" && "font-arabic")}>
          {language === "ar" ? "المشروع غير موجود" : "Project Not Found"}
        </h1>
        <p className={cn("text-muted-foreground mb-6", language === "ar" && "font-arabic")}>
          {language === "ar"
            ? "عذراً، لم نتمكن من العثور على المشروع الذي تبحث عنه."
            : "Sorry, we couldn't find the project you're looking for."}
        </p>
        <Button
          onClick={() => router.push("/")}
          className={cn("bg-yemen-red hover:bg-yemen-red/90", language === "ar" && "font-arabic")}
        >
          {language === "ar" ? "العودة إلى الصفحة الرئيسية" : "Return to Home"}
        </Button>
      </div>
    )
  }

  const displayStars = project.fork && project.sourceRepo ? project.sourceRepo.stars : project.stars;

  return (
    <PageTransition>
      <main className="min-h-screen">
        <ProjectBanner project={project} />

        <div className="container mx-auto px-4 py-8">
          <Button
            variant="ghost"
            className={cn("mb-6 hover:text-yemen-red", language === "ar" && "font-arabic flex-row-reverse")}
            onClick={() => router.back()}
          >
            <ArrowLeft className={cn("h-4 w-4", language === "ar" ? "ml-2" : "mr-2")} />
            {language === "ar" ? "العودة" : "Back"}
          </Button>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="bg-card rounded-lg shadow-sm p-6 border border-border">
                <h2 className={cn("text-2xl font-bold mb-4", language === "ar" && "font-arabic")}>
                  {language === "ar" ? "نظرة عامة" : "Overview"}
                </h2>

                <div className={cn("prose dark:prose-invert max-w-none", language === "ar" && "rtl")}>
                  <Markdown content={readme} />
                </div>
              </div>
            </div>

            <div className="space-y-6 sticky top-20 h-fit">
              <div className="bg-card rounded-lg shadow-sm p-6 border border-border">
                <h3 className={cn("text-xl font-bold mb-4", language === "ar" && "font-arabic")}>
                  {language === "ar" ? "معلومات المشروع" : "Project Information"}
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Star className="h-5 w-5 text-yellow-500" />
                    <div>
                      <div className="text-sm text-muted-foreground">{language === "ar" ? "النجوم" : "Stars"}</div>
                      <div className="font-medium">{displayStars || "-"}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-blue-500" />
                    <div>
                      <div className="text-sm text-muted-foreground">
                        {language === "ar" ? "المساهمون" : "Contributors"}
                      </div>
                      <div className="font-medium">{contributors.length || project.contributors || "-"}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-green-500" />
                    <div>
                      <div className="text-sm text-muted-foreground">
                        {language === "ar" ? "آخر تحديث" : "Last Updated"}
                      </div>
                      <div className="font-medium">{project.lastUpdated}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <FileCode className="h-5 w-5 text-purple-500" />
                    <div>
                      <div className="text-sm text-muted-foreground">
                        {language === "ar" ? "لغة البرمجة" : "Programming Language"}
                      </div>
                      <div className="font-medium">{project.programmingLanguage}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-orange-500" />
                    <div>
                      <div className="text-sm text-muted-foreground">{language === "ar" ? "الترخيص" : "License"}</div>
                      <div className="font-medium">{project.license}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-lg shadow-sm p-6 border border-border">
                <h3 className={cn("text-xl font-bold mb-4", language === "ar" && "font-arabic")}>
                  {language === "ar" ? "الوسوم" : "Tags"}
                </h3>
                <div className={cn("flex flex-wrap gap-2", language === "ar" && "font-arabic")}>
                  {project.tags.map((tag, idx) => (
                    <Badge
                      key={idx}
                      variant="outline"
                      className="border-yemen-red/20 text-yemen-red/80 hover:bg-yemen-red/5"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="bg-card rounded-lg shadow-sm p-6 border border-border">
                <h3 className={cn("text-xl font-bold mb-4", language === "ar" && "font-arabic")}>
                  {language === "ar" ? "روابط" : "Links"}
                </h3>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start border-yemen-red/20 hover:bg-yemen-red/5 hover:text-yemen-red",
                      language === "ar" && "font-arabic flex-row-reverse",
                    )}
                    asChild
                  >
                    <Link href={project.githubUrl} target="_blank">
                      <Github className={cn("h-4 w-4", language === "ar" ? "ml-2" : "mr-2")} />
                      {language === "ar" ? "مستودع GitHub" : "GitHub Repository"}
                    </Link>
                  </Button>

                  {project.websiteUrl && project.websiteUrl !== project.githubUrl && (
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start border-yemen-red/20 hover:bg-yemen-red/5 hover:text-yemen-red",
                        language === "ar" && "font-arabic flex-row-reverse",
                      )}
                      asChild
                    >
                      <Link href={project.websiteUrl} target="_blank">
                        <ExternalLink className={cn("h-4 w-4", language === "ar" ? "ml-2" : "mr-2")} />
                        {language === "ar" ? "الموقع الرسمي" : "Official Website"}
                      </Link>
                    </Button>
                  )}

                  <Button
                    variant="default"
                    className={cn(
                      "w-full justify-start bg-yemen-red hover:bg-yemen-red/90",
                      language === "ar" && "font-arabic flex-row-reverse",
                    )}
                    asChild
                  >
                    <Link href={`${project.githubUrl}/issues`} target="_blank">
                      {language === "ar" ? "المساهمة في المشروع" : "Contribute to Project"}
                    </Link>
                  </Button>
                </div>
              </div>


              {project.fork && project.sourceRepo && (
                <div className="bg-card rounded-lg shadow-sm p-6 border border-border mt-6">
                  <h3 className={cn("text-xl font-bold mb-4", language === "ar" && "font-arabic")}>
                    {language === "ar" ? "المستودع الأصلي" : "Original Repository"}
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Github className="h-4 w-4" />
                      <Link
                        href={project.sourceRepo.url}
                        target="_blank"
                        className="font-medium hover:text-yemen-red transition-colors"
                      >
                        {project.sourceRepo.fullName}
                      </Link>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span>
                        {project.sourceRepo.stars} {language === "ar" ? "نجمة" : "stars"}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className={cn(
                        "mt-2 border-yemen-red/20 hover:bg-yemen-red/5 hover:text-yemen-red",
                        language === "ar" && "font-arabic flex-row-reverse",
                      )}
                      asChild
                    >
                      <Link href={project.sourceRepo.url} target="_blank">
                        <ExternalLink className={cn("h-4 w-4", language === "ar" ? "ml-2" : "mr-2")} />
                        {language === "ar" ? "زيارة المستودع الأصلي" : "Visit Original Repository"}
                      </Link>
                    </Button>
                  </div>
                </div>
              )}

              {contributors.length > 0 && (
                <div className="bg-card rounded-lg shadow-sm p-6 border border-border">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className={cn("text-xl font-bold", language === "ar" && "font-arabic")}>
                      {language === "ar" ? "المساهمون" : "Contributors"}
                    </h3>
                    <Button
                      variant="link"
                      className="text-yemen-red"
                      onClick={() => router.push(`/projects/${project.id}/contributors`)}
                    >
                      {language === "ar" ? "عرض التفاصيل" : "View details"}
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {contributors.slice(0, 6).map((contributor) => (
                      <Link
                        key={contributor.id}
                        href={contributor.html_url}
                        target="_blank"
                        className="flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors"
                      >
                        <img
                          src={contributor.avatar_url || "/placeholder.svg"}
                          alt={contributor.login}
                          className="w-8 h-8 rounded-full"
                        />
                        <div className="overflow-hidden">
                          <div className="font-medium truncate">{contributor.login}</div>
                          <div className="text-xs text-muted-foreground">
                            {contributor.contributions} {contributor.contributions === 1 ? "commit" : "commits"}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <Button variant="link" className="w-full mt-3 text-yemen-red" asChild>
                    <Link href={`/projects/${project.id}/contributors`}>
                      {language === "ar"
                        ? `عرض جميع المساهمين (${contributors.length})`
                        : `View all contributors (${contributors.length})`}
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </PageTransition>
  )
}
