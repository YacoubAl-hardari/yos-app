import type { Project } from "@/lib/types";

const GITHUB_API_BASE = "https://api.github.com";
const GITHUB_ORG = "YemenOpenSource";
const CACHE_KEY = "github_repos";
const CACHE_EXPIRY_KEY = "github_repos_expiry";
const CACHE_DURATION = 3600 * 1000; // 1 hour in milliseconds

export async function fetchRepositories(): Promise<Project[]> {
  try {
    // Check if data is in cache and not expired
    const cacheData = localStorage.getItem(CACHE_KEY);
    const cacheExpiry = localStorage.getItem(CACHE_EXPIRY_KEY);

    if (cacheData && cacheExpiry && Date.now() < Number(cacheExpiry)) {
      return JSON.parse(cacheData);
    }

    // Fetch data from GitHub API
    const response = await fetch(
      `${GITHUB_API_BASE}/orgs/${GITHUB_ORG}/repos?per_page=100&sort=updated`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          "X-GitHub-Api-Version": "2022-11-28",
          "User-Agent": "YemenOpenSource-App",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const repos = await response.json();

    // Transform GitHub repos to Project format
    const projects = repos.map((repo: any) => ({
      id: repo.id.toString(),
      titleEn: repo.name,
      titleAr: repo.name,
      descriptionEn: repo.description || `A ${repo.language || "Unknown"} project by YemenOpenSource`,
      descriptionAr: repo.description || `مشروع ${repo.language || "Unknown"} بواسطة مصادر اليمن المفتوحة`,
      githubUrl: repo.html_url,
      websiteUrl: repo.homepage || repo.html_url,
      stars: repo.stargazers_count,
      programmingLanguage: repo.language || "Unknown",
      category: getCategoryFromRepo(repo),
      license: repo.license?.spdx_id || "Unknown",
      lastUpdated: formatLastUpdated(repo.updated_at),
      contributors: 0, // Will fetch separately
      tags: repo.topics.length ? repo.topics : [repo.language?.toLowerCase() || "unknown", "open-source", "yemen"],
      owner: repo.owner.login,
      defaultBranch: repo.default_branch,
      fullName: repo.full_name,
      createdAt: repo.created_at,
      updatedAt: repo.updated_at,
    }));

    // Cache data and set expiry time
    localStorage.setItem(CACHE_KEY, JSON.stringify(projects));
    localStorage.setItem(CACHE_EXPIRY_KEY, (Date.now() + CACHE_DURATION).toString());

    return projects.sort((a: Project, b: Project) => b.stars - a.stars);
  } catch (error) {
    console.error("Error fetching repositories:", error);
    return [];
  }
}

export async function fetchRepositoryDetails(owner: string, repo: string): Promise<any> {
  try {
    const response = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}`, {
      headers: {
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json; charset=utf-8",
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`Error fetching repository details for ${owner}/${repo}:`, error)
    return null
  }
}

export async function fetchRepositoryReadme(owner: string, repo: string, branch = "main"): Promise<string> {
  try {
    // First try to fetch the README.md file
    let response = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/README.md?ref=${branch}`, {
      headers: {
        Accept: "application/vnd.github.v3+json",
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    // If README.md doesn't exist, try readme.md (lowercase)
    if (!response.ok) {
      response = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/readme.md?ref=${branch}`, {
        headers: {
          Accept: "application/vnd.github.v3+json",
        },
        next: { revalidate: 3600 },
      })
    }

    if (!response.ok) {
      return "No README file found for this repository."
    }

    const data = await response.json()

    const base64Content = data.content.replace(/\n/g, "")
    const binaryContent = atob(base64Content)
    const bytes = new Uint8Array(binaryContent.length)

    for (let i = 0; i < binaryContent.length; i++) {
      bytes[i] = binaryContent.charCodeAt(i)
    }

    const decoder = new TextDecoder("utf-8")
    return decoder.decode(bytes)
  } catch (error) {
    console.error(`Error fetching README for ${owner}/${repo}:`, error)
    return "Failed to load README content."
  }
}

export async function fetchRepositoryContributors(owner: string, repo: string): Promise<any[]> {
  try {
    const response = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}/contributors`, {
      headers: {
        Accept: "application/vnd.github.v3+json",
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`Error fetching contributors for ${owner}/${repo}:`, error)
    return []
  }
}

// Helper functions
function getCategoryFromRepo(repo: any): string {
  const name = repo.name.toLowerCase()
  const description = (repo.description || "").toLowerCase()
  const topics = repo.topics || []

  if (topics.includes("library") || name.includes("lib") || description.includes("library")) {
    return "library"
  } else if (topics.includes("framework") || description.includes("framework")) {
    return "framework"
  } else if (topics.includes("tool") || description.includes("tool") || description.includes("utility")) {
    return "tool"
  } else {
    return "application"
  }
}

function formatLastUpdated(dateString: string): string {
  const updatedDate = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - updatedDate.getTime())
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 0) {
    return "today"
  } else if (diffDays === 1) {
    return "yesterday"
  } else if (diffDays < 7) {
    return `${diffDays} days ago`
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7)
    return `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30)
    return `${months} ${months === 1 ? "month" : "months"} ago`
  } else {
    const years = Math.floor(diffDays / 365)
    return `${years} ${years === 1 ? "year" : "years"} ago`
  }
}

