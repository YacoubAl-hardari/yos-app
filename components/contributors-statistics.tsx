"use client"

import { useLanguage } from "@/lib/language-context"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { GitCommit, GitPullRequest, GitMerge, Code, FileCode, FilePlus, FileMinus } from "lucide-react"
import type { Contributor } from "@/lib/types"

interface ContributorsStatisticsProps {
  contributors: Contributor[]
}

export function ContributorsStatistics({ contributors }: ContributorsStatisticsProps) {
  const { language } = useLanguage()

  // Calculate statistics (in a real app, these would come from the API)
  const totalContributors = contributors.length
  const totalCommits = contributors.reduce((sum, contributor) => sum + contributor.contributions, 0)

  // Simulated statistics (would be real data in production)
  const stats = {
    pullRequests: Math.floor(totalCommits * 0.4),
    merges: Math.floor(totalCommits * 0.3),
    filesChanged: Math.floor(totalCommits * 2.5),
    additions: Math.floor(totalCommits * 15),
    deletions: Math.floor(totalCommits * 8),
  }

  const statCards = [
    {
      title: language === "ar" ? "المساهمون" : "Contributors",
      value: totalContributors,
      icon: <Code className="h-5 w-5 text-blue-500" />,
      color: "bg-blue-500/10",
    },
    {
      title: language === "ar" ? "الالتزامات" : "Commits",
      value: totalCommits,
      icon: <GitCommit className="h-5 w-5 text-yemen-red" />,
      color: "bg-yemen-red/10",
    },
    {
      title: language === "ar" ? "طلبات السحب" : "Pull Requests",
      value: stats.pullRequests,
      icon: <GitPullRequest className="h-5 w-5 text-purple-500" />,
      color: "bg-purple-500/10",
    },
    {
      title: language === "ar" ? "عمليات الدمج" : "Merges",
      value: stats.merges,
      icon: <GitMerge className="h-5 w-5 text-green-500" />,
      color: "bg-green-500/10",
    },
    {
      title: language === "ar" ? "الملفات المتغيرة" : "Files Changed",
      value: stats.filesChanged,
      icon: <FileCode className="h-5 w-5 text-orange-500" />,
      color: "bg-orange-500/10",
    },
    {
      title: language === "ar" ? "الإضافات" : "Additions",
      value: `+${stats.additions.toLocaleString()}`,
      icon: <FilePlus className="h-5 w-5 text-emerald-500" />,
      color: "bg-emerald-500/10",
    },
    {
      title: language === "ar" ? "الحذف" : "Deletions",
      value: `-${stats.deletions.toLocaleString()}`,
      icon: <FileMinus className="h-5 w-5 text-red-500" />,
      color: "bg-red-500/10",
    },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className={cn("rounded-lg border p-4 flex flex-col items-center text-center", stat.color)}
        >
          <div className="mb-2">{stat.icon}</div>
          <div className={cn("text-2xl font-bold", language === "ar" && "font-arabic")}>{stat.value}</div>
          <div className={cn("text-xs text-muted-foreground mt-1", language === "ar" && "font-arabic")}>
            {stat.title}
          </div>
        </motion.div>
      ))}
    </div>
  )
}

