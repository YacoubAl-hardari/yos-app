"use client"

import { useState } from "react"
import { formatDistanceToNow, format } from "date-fns"
import { arSA, enUS } from "date-fns/locale"
import { useLanguage } from "@/lib/language-context"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { GitCommit, GitPullRequest, Tag, GitFork, Star, AlertCircle, ChevronDown } from "lucide-react"

interface ActivityTimelineProps {
  activities: Array<{
    id: string
    type: string
    title: string
    description: string
    author: {
      name: string
      avatar: string
      url: string
    }
    date: string
    repo: string
  }>
}

export function ActivityTimeline({ activities }: ActivityTimelineProps) {
  const { language } = useLanguage()
  const [visibleCount, setVisibleCount] = useState(5)

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "commit":
        return <GitCommit className="h-5 w-5 text-yemen-red" />
      case "pull_request":
        return <GitPullRequest className="h-5 w-5 text-purple-500" />
      case "issue":
        return <AlertCircle className="h-5 w-5 text-blue-500" />
      case "release":
        return <Tag className="h-5 w-5 text-green-500" />
      case "fork":
        return <GitFork className="h-5 w-5 text-orange-500" />
      case "star":
        return <Star className="h-5 w-5 text-yellow-500" />
      default:
        return <GitCommit className="h-5 w-5 text-yemen-red" />
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const relativeTime = formatDistanceToNow(date, {
      addSuffix: true,
      locale: language === "ar" ? arSA : enUS,
    })

    const fullDate = format(date, "PPpp", {
      locale: language === "ar" ? arSA : enUS,
    })

    return { relativeTime, fullDate }
  }

  const loadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 5, activities.length))
  }

  return (
    <div className="space-y-4">
      <h3 className={cn("text-lg font-medium", language === "ar" && "font-arabic")}>
        {language === "ar" ? "النشاط الأخير" : "Recent Activity"}
      </h3>

      <div className="space-y-4">
        {activities.slice(0, visibleCount).map((activity, index) => {
          const { relativeTime, fullDate } = formatDate(activity.date)

          return (
            <div
              key={activity.id}
              className={cn(
                "flex gap-4 p-4 rounded-lg border bg-card transition-colors hover:bg-muted/50",
                language === "ar" && "flex-row-reverse text-right",
              )}
            >
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  {getActivityIcon(activity.type)}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={activity.author.avatar} alt={activity.author.name} />
                      <AvatarFallback>{activity.author.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <a
                      href={activity.author.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium hover:underline"
                    >
                      {activity.author.name}
                    </a>
                  </div>

                  <time dateTime={activity.date} title={fullDate} className="text-sm text-muted-foreground">
                    {relativeTime}
                  </time>
                </div>

                <div className="space-y-1">
                  <p className="font-medium">{activity.title}</p>
                  <p className="text-sm text-muted-foreground line-clamp-2">{activity.description}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {visibleCount < activities.length && (
        <div className="flex justify-center mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={loadMore}
            className={cn(
              "border-yemen-red/20 text-yemen-red hover:bg-yemen-red/5",
              language === "ar" && "font-arabic",
            )}
          >
            <ChevronDown className="h-4 w-4 mr-2" />
            {language === "ar" ? "عرض المزيد" : "Show more"}
          </Button>
        </div>
      )}
    </div>
  )
}

