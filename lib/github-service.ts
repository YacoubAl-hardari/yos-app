import type { Contributor, Project } from "@/lib/types";

const GITHUB_API_BASE = "https://api.github.com";
const GITHUB_ORG = "YemenOpenSource";
const CACHE_KEY = "github_repos";
const CACHE_EXPIRY_KEY = "github_repos_expiry";
const CACHE_DURATION = 3600 * 1000; // 1 hour in milliseconds
import {
  getCachedItem,
  setCachedItem,
  isRateLimited,
  getTimeUntilReset,
  setRateLimitInfo,
  getRateLimitInfo,
} from "@/lib/cache-utils";

const CACHE_TIMES = {
  REPOSITORIES: 2 * 60 * 60 * 1000, // 2 hours
  REPOSITORY_DETAILS: 3 * 60 * 60 * 1000, // 3 hours
  CONTRIBUTORS: 3 * 60 * 60 * 1000, // 3 hours
  README: 24 * 60 * 60 * 1000, // 24 hours
  RATE_LIMIT: 60 * 1000, // 1 minute
};

// Maximum number of retries for API calls
const MAX_RETRIES = 3;

// Extract rate limit info from response headers
function extractRateLimitInfo(response: Response, resource = "core"): void {
  const limit = response.headers.get("x-ratelimit-limit");
  const remaining = response.headers.get("x-ratelimit-remaining");
  const reset = response.headers.get("x-ratelimit-reset");

  if (limit && remaining && reset) {
    setRateLimitInfo({
      limit: Number.parseInt(limit),
      remaining: Number.parseInt(remaining),
      reset: Number.parseInt(reset),
      resource,
    });
  }
}

// Modify the githubFetch function to better handle rate limits
async function githubFetch<T>(
  url: string,
  options: RequestInit & { timeout?: number } = {},
  cacheKey?: string,
  cacheTime: number = CACHE_TIMES.REPOSITORIES,
  resource = "core"
): Promise<T> {
  // Check if we're rate limited before making any request
  if (isRateLimited(resource)) {
    const timeUntilReset = getTimeUntilReset(resource);
    if (timeUntilReset) {
      console.warn(
        `Rate limited for ${resource}. Reset in ${Math.ceil(
          timeUntilReset / 1000
        )} seconds.`
      );

      // Check if we have a cached response
      if (cacheKey) {
        const cachedData = getCachedItem<T>(cacheKey);
        if (cachedData) {
          console.log(`Using cached data for ${cacheKey} due to rate limit`);
          return cachedData;
        }
      }

      // If we don't have cached data, throw a clear error
      throw new Error(
        `GitHub API rate limit exceeded. Reset in ${Math.ceil(
          timeUntilReset / 1000
        )} seconds.`
      );
    }
  }

  // Check cache first if we have a cache key
  if (cacheKey) {
    const cachedData = getCachedItem<T>(cacheKey);
    if (cachedData) {
      return cachedData;
    }
  }

  // Add default headers
  const headers = new Headers(options.headers);
  if (!headers.has("Accept")) {
    headers.set("Accept", "application/vnd.github.v3+json");
  }
  if (!headers.has("User-Agent")) {
    headers.set("User-Agent", "YemeniOpenSourceDirectory");
  }

  // Add timeout to prevent hanging requests
  const controller = new AbortController();
  const timeoutMs = options.timeout || 15000; // Default 15 second timeout
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    // Make the request
    const response = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
      next: { revalidate: Math.floor(cacheTime / 1000) }, // Convert ms to seconds for Next.js
    });

    // Extract and store rate limit info
    extractRateLimitInfo(response, resource);

    // Handle rate limiting with better error messages
    if (response.status === 403 || response.status === 429) {
      const remaining = response.headers.get("x-ratelimit-remaining");
      const reset = response.headers.get("x-ratelimit-reset");
      const resetTime = reset
        ? new Date(Number.parseInt(reset) * 1000).toLocaleTimeString()
        : "unknown time";

      console.warn(
        `GitHub API rate limit exceeded (${response.status}). Remaining: ${remaining}, Reset at: ${resetTime}`
      );

      // Check if we have a cached response
      if (cacheKey) {
        const cachedData = getCachedItem<T>(cacheKey);
        if (cachedData) {
          console.log(`Using cached data for ${cacheKey} due to rate limit`);
          return cachedData;
        }
      }

      throw new Error(
        `GitHub API rate limit exceeded: ${response.status}. Reset at ${resetTime}`
      );
    }

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = (await response.json()) as T;

    // Cache the response if we have a cache key
    if (cacheKey) {
      setCachedItem(cacheKey, data, cacheTime);
    }

    return data;
  } finally {
    clearTimeout(timeoutId);
  }
}

// Updated fetchRepositories to ensure caching and handle fetch errors
export async function fetchRepositories(): Promise<Project[]> {
  const cacheKey = "github_repositories";
  // 1) Return cached if still fresh
  const cached = getCachedItem<Project[]>(cacheKey);
  if (cached) {
    console.log("Using cached repositories");
    return cached;
  }

  // 2) Page through all org repos
  const allRepos: any[] = [];
  let page = 1;
  while (true) {
    const resp = await fetch(
      `${GITHUB_API_BASE}/orgs/${GITHUB_ORG}/repos?per_page=100&page=${page}&sort=updated`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "YemeniOpenSource-App",
        },
      }
    );
    if (!resp.ok) {
      console.error(`GitHub API error (${resp.status}) fetching page ${page}`);
      break;
    }
    const reposPage = await resp.json();
    if (!Array.isArray(reposPage) || reposPage.length === 0) {
      break;
    }
    allRepos.push(...reposPage);
    page++;
  }

  // 3) Map to your Project type, fetching parent data for forks
  const projects: Project[] = [];
  for (const repo of allRepos) {
    let sourceRepo;
    if (repo.fork) {
      // pulls from cache or does a /repos/:owner/:repo fetch under the hood
      sourceRepo = await getSourceRepository(repo);
    }

    const stars = repo.fork && sourceRepo
      ? sourceRepo.stars
      : repo.stargazers_count;

    projects.push({
      id: repo.id.toString(),
      titleEn: repo.name,
      titleAr: repo.name,
      descriptionEn: repo.description || `A ${repo.language || "Unknown"} project`,
      descriptionAr: repo.description || `مشروع ${repo.language || "Unknown"}`,
      githubUrl: repo.html_url,
      websiteUrl: repo.homepage || repo.html_url,
      programmingLanguage: repo.language || "Unknown",
      category: getCategoryFromRepo(repo),
      license: repo.license?.spdx_id || "Unknown",
      lastUpdated: formatLastUpdated(repo.updated_at),
      contributors: repo.contributors_count || 0,
      tags: repo.topics?.length
        ? repo.topics
        : [(repo.language || "unknown").toLowerCase(), "open-source", "yemen"],
      owner: repo.owner.login,
      defaultBranch: repo.default_branch || "main",
      fullName: repo.full_name,
      createdAt: repo.created_at,
      updatedAt: repo.updated_at,
      fork: repo.fork,
      sourceRepo,
      stars: repo.fork && sourceRepo ? sourceRepo.stars : repo.stargazers_count,
    });
  }

  // 4) Cache & sort by descending stars
  setCachedItem(cacheKey, projects, CACHE_TIMES.REPOSITORIES);
  return projects.sort((a, b) => b.stars - a.stars);
}

export async function fetchRepositoryDetails(
  owner: string,
  repo: string
): Promise<any> {
  try {
    const response = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}`, {
      headers: {
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json; charset=utf-8",
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(
      `Error fetching repository details for ${owner}/${repo}:`,
      error
    );
    return null;
  }
}

export async function fetchRepositoryReadme(
  owner: string,
  repo: string,
  branch: string // No default - requires explicit branch
): Promise<string> {
  try {
    // First try official README endpoint
    const readmeResponse = await githubFetch<{ content: string }>(
      `${GITHUB_API_BASE}/repos/${owner}/${repo}/readme?ref=${branch}`,
      {},
      `github_readme_${owner}_${repo}_${branch}`,
      CACHE_TIMES.README
    );

    if (readmeResponse.content) {
      return decodeBase64(readmeResponse.content);
    }

    // Fallback to content search
    const contents = await githubFetch<any[]>(
      `${GITHUB_API_BASE}/repos/${owner}/${repo}/contents?ref=${branch}`,
      {},
      `github_contents_${owner}_${repo}_${branch}`,
      CACHE_TIMES.README
    );

    // Find any README file
    const readmeFile = contents.find((file) => {
      const lowerName = file.name.toLowerCase();
      return (
        lowerName.startsWith("readme") &&
        (lowerName.endsWith(".md") ||
          lowerName.endsWith(".txt") ||
          lowerName === "readme")
      );
    });

    if (readmeFile) {
      const readmeContent = await githubFetch<{ content: string }>(
        readmeFile.url,
        {},
        `github_readme_${owner}_${repo}_${branch}_${readmeFile.name}`,
        CACHE_TIMES.README
      );
      return decodeBase64(readmeContent.content);
    }

    return "No README file found in repository root directory.";
  } catch (error) {
    console.error(`Error fetching README for ${owner}/${repo}:`, error);
    return "Failed to load README content.";
  }
}

// Update decodeBase64 to handle UTF-8 better
function decodeBase64(base64Content: string): string {
  try {
    // Handle both browser and Node.js environments
    if (typeof Buffer !== "undefined") {
      return Buffer.from(base64Content, "base64").toString("utf-8");
    } else {
      const binaryString = atob(base64Content);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return new TextDecoder("utf-8").decode(bytes);
    }
  } catch (error) {
    console.error("Error decoding base64 content:", error);
    return "Failed to decode README content.";
  }
}

export async function fetchRepositoryContributors(
  owner: string,
  repo: string,
  basicOnly = false,
  includeParentContributors = false
): Promise<Contributor[]> {
  const cacheKey = `github_contributors_${owner}/${repo}`;

  const cachedContributors = getCachedItem<Contributor[]>(cacheKey);
  if (cachedContributors && cachedContributors.length > 0) {
    return cachedContributors;
  }

  let allContributors: Contributor[] = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const contributorsPage = await githubFetch<any[]>(
      `${GITHUB_API_BASE}/repos/${owner}/${repo}/contributors?per_page=100&page=${page}`,
      {},
      `github_contributors_${owner}/${repo}_page_${page}`,
      CACHE_TIMES.CONTRIBUTORS
    );

    if (contributorsPage.length === 0) {
      hasMore = false;
    } else {
      allContributors.push(...contributorsPage.map(contributor => ({
        id: contributor.id,
        login: contributor.login,
        avatar_url: contributor.avatar_url,
        html_url: contributor.html_url,
        contributions: contributor.contributions,
        name: '',
        bio: '',
        location: '',
        company: '',
        blog: '',
        email: '',
        twitter_username: '',
        social_links: {},
        languages: []
      })));
      page++;
    }
  }

  setCachedItem(cacheKey, allContributors, CACHE_TIMES.CONTRIBUTORS);
  return allContributors;
}

export async function fetchProjectDetails(owner: string, repo: string): Promise<any> {
  try {
    // Fetch repository details
    const repoDetails = await fetchRepositoryDetails(owner, repo);

    if (!repoDetails) {
      throw new Error(`Failed to fetch details for repository: ${owner}/${repo}`);
    }

    // Fetch README file
    const readmeContent = await fetchRepositoryReadme(
      owner,
      repo,
      repoDetails.default_branch || "main"
    );

    // Fetch contributors
    const contributors = await fetchRepositoryContributors(owner, repo);

    // If the repository is a fork, fetch details of the source repository
    let sourceRepoDetails = null;
    if (repoDetails.fork && repoDetails.parent) {
      const [parentOwner, parentRepoName] = repoDetails.parent.full_name.split("/");
      sourceRepoDetails = await fetchRepositoryDetails(parentOwner, parentRepoName);
    }

    return {
      ...repoDetails,
      readme: readmeContent,
      contributors,
      sourceRepo: sourceRepoDetails,
    };
  } catch (error) {
    console.error(`Error fetching project details for ${owner}/${repo}:`, error);
    return null;
  }
}

// Helper functions
function getCategoryFromRepo(repo: any): string {
  const name = repo.name.toLowerCase();
  const desc = (repo.description || "").toLowerCase();
  const topics = repo.topics || [];

  if (topics.includes("library") || name.includes("lib") || desc.includes("library")) {
    return "library";
  }
  if (topics.includes("framework") || desc.includes("framework")) {
    return "framework";
  }
  if (topics.includes("tool") || desc.includes("tool") || desc.includes("utility")) {
    return "tool";
  }
  return "application";
}

function formatLastUpdated(dateString: string): string {
  const updatedDate = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - updatedDate.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return "today";
  } else if (diffDays === 1) {
    return "yesterday";
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`;
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `${months} ${months === 1 ? "month" : "months"} ago`;
  } else {
    const years = Math.floor(diffDays / 365);
    return `${years} ${years === 1 ? "year" : "years"} ago`;
  }
}

async function getSourceRepository(repo: any): Promise<any> {
  const cacheKey = `github_source_repo_${repo.full_name}`;

  // Check cache first
  const cachedSourceRepo = getCachedItem<any>(cacheKey);
  if (cachedSourceRepo) {
    return cachedSourceRepo;
  }

  // First check if the parent information is already available in the repo object
  if (repo.parent) {
    try {
      // Get contributors count for the parent repo
      let parentContributorsCount = 0;
      let parentContributorsList: Contributor[] = [];
      try {
        if (!isCloseToRateLimit()) {
          const [parentOwner, parentRepoName] = repo.parent.full_name.split("/");
          parentContributorsList = await fetchRepositoryContributors(
            parentOwner,
            parentRepoName,
            true,
            repo.fork
          );
          parentContributorsCount = parentContributorsList.length;
        } else {
          parentContributorsCount = repo.parent.contributors_count || 0;
        }
      } catch (error) {
        console.error(
          `Error fetching parent contributors for ${repo.parent.full_name}:`,
          error
        );
        parentContributorsCount = repo.parent.contributors_count || 0;
      }

      const sourceRepo = {
        name: repo.parent.name,
        fullName: repo.parent.full_name,
        url:
          repo.parent.html_url ||
          `https://github.com/${repo.parent.full_name}`,
        stars: repo.parent.stargazers_count,
        contributors: parentContributorsCount,
        contributorsList: parentContributorsList,
      };

      // Cache the result
      setCachedItem(cacheKey, sourceRepo, CACHE_TIMES.REPOSITORY_DETAILS);
      return sourceRepo;
    } catch (error) {
      console.error(`Error processing parent data for ${repo.full_name}:`, error);
    }
  }

  try {
    // Check if we're rate limited before making the request
    if (isRateLimited()) {
      console.warn(
        `Rate limited when trying to fetch parent repo for ${repo.full_name}`
      );
      // Return a default object with the fork's info
      const defaultSourceRepo = {
        name: repo.name,
        fullName: repo.full_name,
        url: repo.html_url,
        stars: repo.stargazers_count,
        contributors: 0,
        contributorsList: [],
      };

      // Cache the result
      setCachedItem(cacheKey, defaultSourceRepo, CACHE_TIMES.REPOSITORY_DETAILS);
      return defaultSourceRepo;
    }

    // Use githubFetch to get repo details
    const repoData = await githubFetch<any>(
      `${GITHUB_API_BASE}/repos/${repo.full_name}`,
      {},
      `github_repo_details_${repo.full_name}`,
      CACHE_TIMES.REPOSITORY_DETAILS
    );

    if (repoData && repoData.parent) {
      // Get contributors count for the parent repo
      let parentContributorsCount = 0;
      let parentContributorsList: Contributor[] = [];
      try {
        if (!isCloseToRateLimit()) {
          const [parentOwner, parentRepoName] = repoData.parent.full_name.split(
            "/"
          );
          parentContributorsList = await fetchRepositoryContributors(
            parentOwner,
            parentRepoName,
            true,
            repo.fork
          );
          parentContributorsCount = parentContributorsList.length;
        } else {
          parentContributorsCount = repoData.parent.contributors_count || 0;
        }
      } catch (error) {
        console.error(
          `Error fetching parent contributors for ${repoData.parent.full_name}:`,
          error
        );
        parentContributorsCount = repoData.parent.contributors_count || 0;
      }

      const sourceRepo = {
        name: repoData.parent.name,
        fullName: repoData.parent.full_name,
        url:
          repoData.parent.html_url ||
          `https://github.com/${repoData.parent.full_name}`,
        stars: repoData.parent.stargazers_count,
        contributors: parentContributorsCount,
        contributorsList: parentContributorsList,
      };

      // Cache the result
      setCachedItem(cacheKey, sourceRepo, CACHE_TIMES.REPOSITORY_DETAILS);
      return sourceRepo;
    }
  } catch (error) {
    console.error(
      `Error fetching parent repository for ${repo.full_name}:`,
      error
    );
  }

  // If we can't get the parent info, return a default object with the fork's info
  const defaultSourceRepo = {
    name: repo.name,
    fullName: repo.full_name,
    url: repo.html_url,
    stars: repo.stargazers_count,
    contributors: 0,
    contributorsList: [],
  };

  // Cache the result
  setCachedItem(cacheKey, defaultSourceRepo, CACHE_TIMES.REPOSITORY_DETAILS);
  return defaultSourceRepo;
}

function isCloseToRateLimit(threshold = 20): boolean {
  const rateLimitInfo = getRateLimitInfo();
  if (!rateLimitInfo) return false;

  return rateLimitInfo.remaining < threshold;
}

export function forceRefreshContributors(owner: string, repo: string) {
  const cacheKey = `github_contributors_${owner}/${repo}`;
  localStorage.removeItem(cacheKey);

  // Also remove paginated contributor pages
  for (let i = 1; i <= 10; i++) {
    localStorage.removeItem(`github_contributors_${owner}/${repo}_page_${i}`);
  }

  console.log(`Force refreshed contributors cache for ${owner}/${repo}`);
}