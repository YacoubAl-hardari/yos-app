"use client"
import { useLanguage } from "@/lib/language-context"
import { ContributionGraph } from "@/components/contribution-graph"
import { ActivityTimeline } from "@/components/activity-timeline"
import type { Contributor } from "@/lib/types"

interface ContributorsChartProps {
  contributors: Contributor[]
  period: string
}

export function ContributorsChart({ contributors, period }: ContributorsChartProps) {
  const { language } = useLanguage()

  // Generate daily contribution data for the past year
  const contributionData = generateDailyContributions()

  // Generate activity timeline data
  const activityData = generateActivityData(contributors, 15)

  return (
    <div className="space-y-8">
      {/* Contribution Graph */}
      <ContributionGraph data={contributionData} contributors={contributors} />

      {/* Activity Timeline */}
      <ActivityTimeline activities={activityData} />
    </div>
  )
}

// Helper function to generate daily contribution data
function generateDailyContributions() {
  const data = []
  const now = new Date()
  const oneYearAgo = new Date(now)
  oneYearAgo.setFullYear(now.getFullYear() - 1)

  for (let d = new Date(oneYearAgo); d <= now; d.setDate(d.getDate() + 1)) {
    // Generate random contribution count (0-12)
    const count = Math.floor(Math.random() * 13)
    data.push({
      date: d.toISOString().split("T")[0],
      count,
    })
  }

  return data
}

// Helper function to generate activity data
function generateActivityData(contributors: Contributor[], count: number) {
  const activityTypes = ["commit", "pull_request", "issue", "release", "fork", "star"]
  const activities = []
  const now = new Date()

  for (let i = 0; i < count; i++) {
    const randomContributor = contributors[Math.floor(Math.random() * contributors.length)]
    const activityType = activityTypes[Math.floor(Math.random() * activityTypes.length)]

    // Generate a random date within the last 30 days
    const date = new Date(now)
    date.setDate(date.getDate() - Math.floor(Math.random() * 30))

    let title = ""
    let description = ""

    switch (activityType) {
      case "commit":
        title = "Committed changes"
        description = `${randomCommitMessage()}`
        break
      case "pull_request":
        title = "Opened pull request"
        description = `#${Math.floor(Math.random() * 100) + 1}: ${randomCommitMessage()}`
        break
      case "issue":
        title = "Opened issue"
        description = `#${Math.floor(Math.random() * 100) + 1}: ${randomIssueTitle()}`
        break
      case "release":
        title = "Released new version"
        description = `v${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}`
        break
      case "fork":
        title = "Forked repository"
        description = "Created a new fork"
        break
      case "star":
        title = "Starred repository"
        description = "Added to favorites"
        break
    }

    activities.push({
      id: `activity-${i}`,
      type: activityType,
      title,
      description,
      author: {
        name: randomContributor.login,
        avatar: randomContributor.avatar_url,
        url: randomContributor.html_url,
      },
      date: date.toISOString(),
      repo: "main-repo",
    })
  }

  // Sort by date (newest first)
  activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return activities
}

// Helper function to generate random commit messages
function randomCommitMessage() {
  const messages = [
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

  return messages[Math.floor(Math.random() * messages.length)]
}

// Helper function to generate random issue titles
function randomIssueTitle() {
  const titles = [
    "Authentication not working on Safari",
    "Need to improve mobile responsiveness",
    "Feature request: dark mode support",
    "Documentation is outdated",
    "Performance issue on large datasets",
    "Security vulnerability in login form",
    "Add support for Arabic language",
    "UI breaks on small screens",
    "Memory leak in component",
    "Add export to PDF functionality",
  ]

  return titles[Math.floor(Math.random() * titles.length)]
}

