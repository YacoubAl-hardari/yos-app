// Cache expiration times (in milliseconds)
const CACHE_TIMES = {
  REPOSITORIES: 2 * 60 * 60 * 1000, // 2 hours
  REPOSITORY_DETAILS: 1 * 60 * 60 * 1000, // 1 hour
  CONTRIBUTORS: 30 * 60 * 1000, // 30 minutes
  README: 24 * 60 * 60 * 1000, // 24 hours
  RATE_LIMIT: 60 * 1000 // 1 minute
}

// Export all constants and functions
export { CACHE_TIMES }

// Check if localStorage is available
export function isLocalStorageAvailable() {
  try {
    const testKey = "__test__"
    localStorage.setItem(testKey, testKey)
    localStorage.removeItem(testKey)
    return true
  } catch (e) {
    return false
  }
}

// Get item from cache with expiration check
export function getCachedItem<T>(key: string): T | null {
  if (!isLocalStorageAvailable()) return null

  try {
    const cachedData = localStorage.getItem(key)
    if (!cachedData) return null

    const { value, expiry } = JSON.parse(cachedData)

    // Check if the cache has expired
    if (expiry && Date.now() > expiry) {
      localStorage.removeItem(key)
      return null
    }

    return value as T
  } catch (error) {
    console.error(`Error retrieving cached item for key ${key}:`, error)
    return null
  }
}

// Set item in cache with expiration
export function setCachedItem<T>(key: string, value: T, expiryTime: number): void {
  if (!isLocalStorageAvailable()) return

  try {
    const item = {
      value,
      expiry: Date.now() + expiryTime,
    }

    localStorage.setItem(key, JSON.stringify(item))
  } catch (error) {
    console.error(`Error setting cached item for key ${key}:`, error)
    // If localStorage is full, clear older items
    if (error instanceof DOMException && error.name === "QuotaExceededError") {
      clearOldestCacheItems()
      // Try again
      try {
        const item = {
          value,
          expiry: Date.now() + expiryTime,
        }
        localStorage.setItem(key, JSON.stringify(item))
      } catch (retryError) {
        console.error(`Failed to set cache item after clearing space:`, retryError)
      }
    }
  }
}

// Clear all cached items
export function clearCache(): void {
  if (!isLocalStorageAvailable()) return

  try {
    // Only clear our app's cache items, not all localStorage
    const keysToRemove: string[] = []

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && (key.startsWith("github_") || key.startsWith("rate_limit"))) {
        keysToRemove.push(key)
      }
    }

    keysToRemove.forEach((key) => localStorage.removeItem(key))
  } catch (error) {
    console.error("Error clearing cache:", error)
  }
}

// Clear oldest cache items to make space
function clearOldestCacheItems(): void {
  if (!isLocalStorageAvailable()) return

  try {
    const cacheItems: { key: string; expiry: number }[] = []

    // Collect all cache items with their expiry
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && (key.startsWith("github_") || key.startsWith("rate_limit"))) {
        const item = localStorage.getItem(key)
        if (item) {
          try {
            const { expiry } = JSON.parse(item)
            if (expiry) {
              cacheItems.push({ key, expiry })
            }
          } catch (e) {
            // If we can't parse it, it's safe to remove
            localStorage.removeItem(key)
          }
        }
      }
    }

    // Sort by expiry (oldest first)
    cacheItems.sort((a, b) => a.expiry - b.expiry)

    // Remove the oldest 20% of items
    const itemsToRemove = Math.max(1, Math.ceil(cacheItems.length * 0.2))
    cacheItems.slice(0, itemsToRemove).forEach((item) => {
      localStorage.removeItem(item.key)
    })
  } catch (error) {
    console.error("Error clearing oldest cache items:", error)
  }
}

// Rate limit handling
export interface RateLimitInfo {
  limit: number
  remaining: number
  reset: number // Unix timestamp
  resource: string
}

export function getRateLimitInfo(resource = "core"): RateLimitInfo | null {
  return getCachedItem<RateLimitInfo>(`rate_limit_${resource}`)
}

export function setRateLimitInfo(info: RateLimitInfo): void {
  setCachedItem(`rate_limit_${info.resource}`, info, CACHE_TIMES.RATE_LIMIT)
}

// Improve the isRateLimited function to be more conservative
export function isRateLimited(resource = "core"): boolean {
  const rateLimitInfo = getRateLimitInfo(resource)

  if (!rateLimitInfo) return false

  // If we have less than 100 requests remaining (increased from 50) or we're past the reset time
  const safetyThreshold = 10
  if (rateLimitInfo.remaining < safetyThreshold) {
    // Check if we're past the reset time
    if (Date.now() > rateLimitInfo.reset * 1000) {
      // Reset time has passed, we should be good to go
      return false
    }
    return true
  }

  return false
}

// Improve the getTimeUntilReset function to provide better information
export function getTimeUntilReset(resource = "core"): number | null {
  const rateLimitInfo = getRateLimitInfo(resource)

  if (!rateLimitInfo) return null

  // Return milliseconds until reset
  const resetTime = rateLimitInfo.reset * 1000
  const timeUntilReset = Math.max(0, resetTime - Date.now())

  // If the reset time is in the past, return 0
  return timeUntilReset > 0 ? timeUntilReset : 0
}

