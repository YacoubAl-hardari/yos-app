"use client"

import { useState } from "react"
import { useLanguage } from "@/lib/language-context"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { GitCommit, GitMerge, GitPullRequest, Calendar, Clock } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import type { Contributor } from "@/lib/types"

interface ContributorsTimelineProps {
  contributors: Contributor[]
}

interface TimelineItem {
  id: string
  type: "commit" | "pull-request" | "merge"
  title: string
  description: string
  author: {
    name: string
    avatar: string
  }
  date: string
  time: string
}

export function ContributorsTimeline({ contributors }: ContributorsTimelineProps) {
  const { language } = useLanguage()
  const [visibleItems, setVisibleItems] = useState(10)

  const timelineItems: TimelineItem[] = generateMockTimelineData(contributors, 30)

  const loadMore = () => {
    setVisibleItems((prev) => prev + 10)
  }

  return (
    <div className="space-y-6">
      <h2 className={cn("text-2xl font-bold", language === "ar" && "font-arabic")}>
        {language === "ar" ? "الجدول الزمني للمساهمات" : "Contribution Timeline"}
      </h2>

      <div className="space-y-4">
        {timelineItems.slice(0, visibleItems).map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: language === "ar" ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className={cn(
              "relative pl-10 pb-8 border-l-2 border-muted last:border-l-transparent",
              language === "ar" && "pr-10 pl-0 border-l-0 border-r-2 last:border-r-transparent",
            )}
          >
            {/* Timeline dot */}
            <div
              className={cn(
                "absolute top-0 left-0 w-8 h-8 rounded-full flex items-center justify-center -translate-x-1/2 border-4 border-background",
                language === "ar" && "left-auto right-0 translate-x-1/2",
                item.type === "commit"
                  ? "bg-yemen-red"
                  : item.type === "pull-request"
                    ? "bg-purple-500"
                    : "bg-green-500",
              )}
            >
              {item.type === "commit" && <GitCommit className="h-4 w-4 text-white" />}
              {item.type === "pull-request" && <GitPullRequest className="h-4 w-4 text-white" />}
              {item.type === "merge" && <GitMerge className="h-4 w-4 text-white" />}
            </div>

            {/* Content */}
            <div className="bg-card border rounded-lg p-4 shadow-sm">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={item.author.avatar} alt={item.author.name} />
                    <AvatarFallback>{item.author.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{item.author.name}</div>
                    <div className="text-sm text-muted-foreground">{item.title}</div>
                  </div>
                </div>
                <div className={cn("text-xs text-muted-foreground flex flex-col items-end")}>
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {item.date}
                  </div>
                  <div className="flex items-center mt-1">
                    <Clock className="h-3 w-3 mr-1" />
                    {item.time}
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">{item.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {visibleItems < timelineItems.length && (
        <div className="flex justify-center mt-6">
          <Button
            onClick={loadMore}
            variant="outline"
            className={cn(
              "border-yemen-red/20 text-yemen-red hover:bg-yemen-red/5",
              language === "ar" && "font-arabic",
            )}
          >
            {language === "ar" ? "تحميل المزيد" : "Load More"}
          </Button>
        </div>
      )}
    </div>
  )
}

// Helper function to generate mock timeline data
function generateMockTimelineData(contributors: Contributor[], count: number): TimelineItem[] {
  const items: TimelineItem[] = []
  const types = ["commit", "pull-request", "merge"] as const
  const commitMessages = [
    "Fix bug in authentication flow",
    "Update documentation for API endpoints",
    "Add new feature for user profiles",
    "Refactor code for better performance",
    "Implement responsive design for mobile",
    "Fix typos in README",
    "Update dependencies to latest versions",
    "Add unit tests for core functionality",
    "Improve error handling in form submissions",
    "Optimize database queries for faster loading",
  ]

  const now = new Date()

  for (let i = 0; i < count; i++) {
    const randomContributor = contributors[Math.floor(Math.random() * contributors.length)]
    const type = types[Math.floor(Math.random() * types.length)]
    const messageIndex = Math.floor(Math.random() * commitMessages.length)

    // Generate a random date within the last 30 days
    const date = new Date(now)
    date.setDate(date.getDate() - Math.floor(Math.random() * 30))

    const formattedDate = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })

    const formattedTime = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })

    let title = ""
    let description = ""

    if (type === "commit") {
      title = "Committed changes"
      description = commitMessages[messageIndex]
    } else if (type === "pull-request") {
      title = "Opened pull request"
      description = `PR #${Math.floor(Math.random() * 100) + 1}: ${commitMessages[messageIndex]}`
    } else {
      title = "Merged pull request"
      description = `Merged PR #${Math.floor(Math.random() * 100) + 1} into main branch`
    }

    items.push({
      id: `timeline-${i}`,
      type,
      title,
      description,
      author: {
        name: randomContributor.login,
        avatar: randomContributor.avatar_url,
      },
      date: formattedDate,
      time: formattedTime,
    })
  }

  // Sort by date (newest first)
  items.sort((a, b) => {
    const dateA = new Date(`${a.date} ${a.time}`)
    const dateB = new Date(`${b.date} ${b.time}`)
    return dateB.getTime() - dateA.getTime()
  })

  return items
}

