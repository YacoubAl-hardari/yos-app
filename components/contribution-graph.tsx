"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { useLanguage } from "@/lib/language-context"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { Contributor } from "@/lib/types"

interface ContributionGraphProps {
  data: {
    date: string
    count: number
    contributors?: {
      login: string
      avatar_url: string
      contributions: number
    }[]
  }[]
  contributors: Contributor[]
}

export function ContributionGraph({ data, contributors }: ContributionGraphProps) {
  const { theme } = useTheme()
  const { language } = useLanguage()
  const [selectedYear, setSelectedYear] = useState("2024")
  const [timeRange, setTimeRange] = useState("year")
  const [filteredData, setFilteredData] = useState(data)
  const [hoveredDay, setHoveredDay] = useState<string | null>(null)

  // Get current date for positioning
  const now = new Date()
  const currentYear = now.getFullYear()

  // Create array of years for selection
  const years = Array.from({ length: 4 }, (_, i) => (currentYear - 3 + i).toString())

  // Create week days array
  const weekDays = language === "ar" ? ["الاثنين", "الأربعاء", "الجمعة"] : ["Mon", "Wed", "Fri"]

  // Create months array
  const months =
    language === "ar"
      ? [
          "مارس",
          "أبريل",
          "مايو",
          "يونيو",
          "يوليو",
          "أغسطس",
          "سبتمبر",
          "أكتوبر",
          "نوفمبر",
          "ديسمبر",
          "يناير",
          "فبراير",
          "مارس",
        ]
      : ["Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"]

  // Filter data based on time range
  useEffect(() => {
    const filterByTimeRange = () => {
      const currentDate = new Date()
      const startDate = new Date()

      switch (timeRange) {
        case "day":
          startDate.setDate(currentDate.getDate() - 1)
          break
        case "week":
          startDate.setDate(currentDate.getDate() - 7)
          break
        case "month":
          startDate.setMonth(currentDate.getMonth() - 1)
          break
        case "quarter":
          startDate.setMonth(currentDate.getMonth() - 3)
          break
        case "year":
        default:
          startDate.setFullYear(currentDate.getFullYear() - 1)
          break
      }

      // Filter data based on date range
      const filtered = data.filter((item) => {
        const itemDate = new Date(item.date)
        return itemDate >= startDate && itemDate <= currentDate
      })

      setFilteredData(filtered)
    }

    filterByTimeRange()
  }, [timeRange, data])

  // Calculate total contributions
  const totalContributions = filteredData.reduce((sum, day) => sum + day.count, 0)

  // Helper function to get color based on contribution count
  const getContributionColor = (count: number) => {
    if (count === 0) return theme === "dark" ? "bg-muted" : "bg-muted/30"
    if (count <= 3) return "bg-yemen-red/20 dark:bg-yemen-red/30"
    if (count <= 6) return "bg-yemen-red/40 dark:bg-yemen-red/50"
    if (count <= 9) return "bg-yemen-red/60 dark:bg-yemen-red/70"
    return "bg-yemen-red dark:bg-yemen-red"
  }

  // Generate grid data
  const gridData = Array.from({ length: 53 * 7 }, (_, index) => {
    const date = new Date(now)
    date.setDate(date.getDate() - (53 * 7 - index))

    const dayData = filteredData.find((d) => d.date === date.toISOString().split("T")[0])

    // Assign random contributors if none exist
    const dayContributors =
      dayData?.contributors ||
      (dayData?.count
        ? Array.from({ length: Math.min(dayData.count, 5) }, () => {
            const randomContributor = contributors[Math.floor(Math.random() * contributors.length)]
            return {
              login: randomContributor.login,
              avatar_url: randomContributor.avatar_url,
              contributions: Math.floor(Math.random() * 3) + 1,
            }
          })
        : [])

    return {
      date,
      count: dayData?.count || 0,
      contributors: dayContributors,
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <h3 className={cn("text-lg font-medium", language === "ar" && "font-arabic")}>
            {language === "ar"
              ? `${totalContributions} مساهمة في ${
                  timeRange === "day"
                    ? "اليوم الماضي"
                    : timeRange === "week"
                      ? "الأسبوع الماضي"
                      : timeRange === "month"
                        ? "الشهر الماضي"
                        : timeRange === "quarter"
                          ? "الربع الماضي"
                          : "العام الماضي"
                }`
              : `${totalContributions} contributions in the last ${
                  timeRange === "day"
                    ? "day"
                    : timeRange === "week"
                      ? "week"
                      : timeRange === "month"
                        ? "month"
                        : timeRange === "quarter"
                          ? "quarter"
                          : "year"
                }`}
          </h3>
        </div>
        <div className="flex gap-2 items-center">
          <Tabs value={timeRange} onValueChange={setTimeRange} className="w-full">
            <TabsList className="grid grid-cols-5">
              <TabsTrigger value="day" className="text-xs">
                {language === "ar" ? "يوم" : "Day"}
              </TabsTrigger>
              <TabsTrigger value="week" className="text-xs">
                {language === "ar" ? "أسبوع" : "Week"}
              </TabsTrigger>
              <TabsTrigger value="month" className="text-xs">
                {language === "ar" ? "شهر" : "Month"}
              </TabsTrigger>
              <TabsTrigger value="quarter" className="text-xs">
                {language === "ar" ? "ربع" : "Quarter"}
              </TabsTrigger>
              <TabsTrigger value="year" className="text-xs">
                {language === "ar" ? "سنة" : "Year"}
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder={selectedYear} />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className={cn("relative", language === "ar" && "direction-rtl")}>
        {/* Month labels */}
        <div className="flex mb-2 text-sm text-muted-foreground">
          <div className="w-10" /> {/* Spacer for weekday labels */}
          {months.map((month, i) => (
            <div key={i} className="flex-1 text-center">
              {month}
            </div>
          ))}
        </div>

        <div className="flex">
          {/* Weekday labels */}
          <div className="flex flex-col justify-around text-sm text-muted-foreground pr-2">
            {weekDays.map((day, i) => (
              <div key={i} className="h-[10px]">
                {day}
              </div>
            ))}
          </div>

          {/* Contribution grid */}
          <div className="flex-1">
            <div className="grid grid-cols-53 gap-1">
              {Array.from({ length: 53 }).map((_, weekIndex) => (
                <div key={weekIndex} className="grid grid-rows-7 gap-1">
                  {Array.from({ length: 7 }).map((_, dayIndex) => {
                    const dataIndex = weekIndex * 7 + dayIndex
                    const dayData = gridData[dataIndex]
                    const dateStr = dayData.date.toISOString().split("T")[0]

                    return (
                      <TooltipProvider key={dayIndex}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <motion.div
                              className={cn(
                                "w-[10px] h-[10px] rounded-sm cursor-pointer",
                                getContributionColor(dayData.count),
                                hoveredDay === dateStr && "ring-2 ring-offset-1 ring-yemen-red",
                              )}
                              whileHover={{ scale: 1.5 }}
                              onMouseEnter={() => setHoveredDay(dateStr)}
                              onMouseLeave={() => setHoveredDay(null)}
                            />
                          </TooltipTrigger>
                          <TooltipContent className="p-0 overflow-hidden">
                            <div className="p-2 bg-card">
                              <p className="font-medium mb-1">
                                {dayData.count} contributions on{" "}
                                {dayData.date.toLocaleDateString(language === "ar" ? "ar-SA" : "en-US", {
                                  weekday: "long",
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </p>

                              {dayData.count > 0 && dayData.contributors && dayData.contributors.length > 0 && (
                                <div className="mt-2 pt-2 border-t">
                                  <p className="text-xs text-muted-foreground mb-2">
                                    {language === "ar" ? "المساهمون:" : "Contributors:"}
                                  </p>
                                  <div className="flex flex-col gap-2 max-h-[150px] overflow-y-auto">
                                    {dayData.contributors.map((contributor, i) => (
                                      <div key={i} className="flex items-center gap-2">
                                        <Avatar className="h-6 w-6">
                                          <AvatarImage src={contributor.avatar_url} alt={contributor.login} />
                                          <AvatarFallback>{contributor.login.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                          <p className="text-sm font-medium">{contributor.login}</p>
                                          <p className="text-xs text-muted-foreground">
                                            {contributor.contributions}{" "}
                                            {contributor.contributions === 1 ? "contribution" : "contributions"}
                                          </p>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-end mt-4 text-sm text-muted-foreground gap-2">
          <span>{language === "ar" ? "أقل" : "Less"}</span>
          <div className="flex gap-1">
            {[0, 3, 6, 9, 12].map((count) => (
              <div key={count} className={cn("w-[10px] h-[10px] rounded-sm", getContributionColor(count))} />
            ))}
          </div>
          <span>{language === "ar" ? "أكثر" : "More"}</span>
        </div>
      </div>
    </div>
  )
}

