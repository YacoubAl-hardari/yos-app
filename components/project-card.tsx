"use client"

import Link from "next/link"
import { ExternalLink, GitFork, Github, Star } from "lucide-react"
import { motion } from "framer-motion"
import { useLanguage } from "@/lib/language-context"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Project } from "@/lib/types"

interface ProjectCardProps {
  project: Project
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const { language } = useLanguage()
  const displayStars = project.fork && project.sourceRepo
                    ? project.sourceRepo.stars
                    : project.stars

  const MotionCard = motion(Card)

  return (
    <MotionCard
      className="overflow-hidden h-full flex flex-col border-yemen-red/10 hover:border-yemen-red/30 transition-colors"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Link href={project.id ? `/projects/${project.id}` : "#"} className="flex-grow flex flex-col">
        <CardHeader className={cn("pb-3", language === "ar" && "text-right")}>
          <div className="flex items-center justify-between mb-1">
            <div
              className={cn(
                "text-md font-medium tracking-tight line-clamp-1",
                language === "ar" && "font-arabic order-2",
              )}
            >
              {language === "ar" ? project.titleAr : project.titleEn}
            </div>
            <div className={cn("flex items-center gap-1 text-yellow-500", language === "ar" && "order-1")}>
              <Star className="h-4 w-4 fill-current" />
              <span className="text-sm">{displayStars}</span>
            </div>
          </div>
          <div
            className={cn(
              "line-clamp-2 text-sm text-muted-foreground min-h-[40px]",
              language === "ar" && "font-arabic",
            )}
          >
            {language === "ar" ? project.descriptionAr : project.descriptionEn}
          </div>
        </CardHeader>
        <CardContent className={cn("pb-2 flex-grow", language === "ar" && "text-right")}>
          <div className={cn(" text-center gap-2 mt-1 mb-3 ", language === "ar" && "flex-row-reverse")}>
            {project.tags?.slice(0, 3).map((tag, idx) => (
              <Badge
                key={idx}
                variant="outline"
                className={cn(
                  "border-yemen-red/20 text-yemen-red/80 hover:bg-yemen-red/5",
                  language === "ar" && "font-arabic",
                )}
              >
                {tag}
              </Badge>
            ))}
            {project.tags?.length > 3 && (
              <Badge
                variant="outline"
                className={cn(
                  "border-yemen-red/20 text-yemen-red/80 hover:bg-yemen-red/5",
                  language === "ar" && "font-arabic",
                )}
              >
                {language === "ar" ? `+${project.tags.length - 3}` : `+${project.tags.length - 3}`}
              </Badge>
            )}
          </div>

          <div className={cn("grid grid-cols-2 gap-2 text-sm ", language === "ar" && "font-arabic")}>
            <div className={cn("flex flex-col", language === "ar" && "items-center")}>
              <span className="text-muted-foreground">{language === "ar" ? "لغة البرمجة" : "Language"}</span>
              <span className="font-medium">{project.programmingLanguage}</span>
            </div>
            <div className={cn("flex flex-col", language === "ar" && "items-center")}>
              <span className="text-muted-foreground">{language === "ar" ? "الترخيص" : "License"}</span>
              <span className="font-medium">{project.license}</span>
            </div>
            <div className={cn("flex flex-col", language === "ar" && "items-center")}>
              <span className="text-muted-foreground">{language === "ar" ? "آخر تحديث" : "Last Updated"}</span>
              <span className="font-medium">{project.lastUpdated}</span>
            </div>
              <div className={cn("flex flex-col", language === "ar" && "items-center")}>

              <span className="text-muted-foreground">
                {language === "ar" ? "المساهمون" : "Contributors"}
              </span>
              <span className="font-medium">
                {project.contributorsList?.length || project.contributors || 0}
              </span>
              
            </div>

          </div>
        </CardContent>
      </Link>
      <CardFooter className={cn("pt-3 border-t", language === "ar" && "flex-row-reverse")}>
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "flex-1 border-yemen-red/20 hover:bg-yemen-red/5 hover:text-yemen-red",
              language === "ar" && "font-arabic flex-row-reverse",
            )}
            asChild
          >
            <Link href={project.githubUrl || "#"} target="_blank">
              <Github className="h-4 w-4 mr-2" />
              {language === "ar" ? "المستودع" : "Repository"}
            </Link>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "flex-1 border-yemen-red/20 hover:bg-yemen-red/5 hover:text-yemen-red",
              language === "ar" && "font-arabic flex-row-reverse",
            )}
            asChild
          >
            <Link href={project.websiteUrl || "#"} target="_blank">
              <ExternalLink className="h-4 w-4 mr-2" />
              {language === "ar" ? "الموقع" : "Website"}
            </Link>
          </Button>
        </div>
      </CardFooter>
         {project.fork && project.sourceRepo && (
              <div className="border-t bg-muted/20 px-4 py-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <GitFork className="h-3 w-3" />
                  <a
                    href={project.sourceRepo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-yemen-red hover:underline"
                  >
                    {project.sourceRepo.fullName}
                  </a>
                  <span>Forked from </span>
                </div>
              </div>
            )}
    </MotionCard>
  )
}
