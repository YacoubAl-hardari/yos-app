export interface Project {
  id: string
  titleEn: string
  titleAr: string
  descriptionEn: string
  descriptionAr: string
  githubUrl: string
  websiteUrl: string
  stars: number
  programmingLanguage: string
  category: string
  license: string
  lastUpdated: string
  contributors: number
  contributorsList?: Contributor[]
  tags: string[]
  owner?: string
  defaultBranch: string;
  fullName?: string
  createdAt?: string
  updatedAt?: string
  fork?: boolean
  sourceRepo?: {
    name: string
    fullName: string
    url: string
    stars: number
    contributors: number
  }
  parent?: {
    name: string
    fullName: string
    url: string
    stars: number
    contributors: number
  }

}

export interface Contributor {
  id: number
  login: string
  avatar_url: string
  html_url: string
  contributions: number
  name?: string
  bio?: string
  location?: string
  company?: string
  blog?: string
  email?: string
  twitter_username?: string
  
  social_links?: {
    github?: string
    twitter?: string
    linkedin?: string
    website?: string
    email?: string
  }
  languages?: string[]
}

export interface ReadmeContent {
  content: string
  error?: string
}
