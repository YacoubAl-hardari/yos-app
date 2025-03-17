# Yemeni Open Source

A platform to discover and contribute to open source projects created by Yemeni developers.
## Live Demo
You can view a live demo of the platform here: [Yemeni Open Source](https://yemenopensource.vercel.app/)

## Links

- **[GitHub](https://github.com/YemenOpenSource)** ![GitHub](https://img.shields.io/badge/GitHub-black)
- **[Twitter](https://x.com/yemenopensource)** ![Twitter](https://img.shields.io/badge/Twitter-blue)
- **[LinkedIn](https://www.linkedin.com/company/yemenopensource)** ![LinkedIn](https://img.shields.io/badge/LinkedIn-blue)
- **[Website](https://yemenopensource.vercel.app/)** ![Website](https://img.shields.io/badge/Website-green)
- **[Email](mailto:opensource.ye@gmail.com)** ![Email](https://img.shields.io/badge/Email-red)


## 📋 Project Overview

```mermaid
graph TD
    A[User] -->|Visits| B(Home Page)
    B --> C{Language Selection}
    C -->|Arabic| D[Arabic UI]
    C -->|English| E[English UI]
    D --> F[Project List]
    E --> F
    F --> G[Project Details]
    G --> H[Contributors]
    H --> I[Contributor Profiles]
    F --> J[Search/Filter]
    J --> K[Filtered Results]
```

## ✨ Features

- 🌍 Multilingual support (Arabic/English)
- 📊 Interactive contribution graphs
- 🔍 Advanced search and filtering
- 👥 Contributor statistics and timelines
- 🔄 Real-time GitHub API synchronization
- 🎨 Responsive design with theme support

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### Installation
```bash
git clone https://github.com/YacoubAl-hardari/yos-app.git
cd yos-app
npm install --legacy-peer-deps
npm run dev
```

## 📂 Directory Structure

```mermaid
graph LR
    Root["yacoubal-hardari-yos-app/"]
    
    Root --> README["README.md"]
    Root --> ConfigFiles["Config Files"]
    Root --> App
    Root --> Components
    Root --> Lib
    Root --> Public

    ConfigFiles --> ComponentsJSON["components.json"]
    ConfigFiles --> NextConfig["next.config.mjs"]
    ConfigFiles --> PackageJSON["package.json"]
    ConfigFiles --> PostCSS["postcss.config.mjs"]
    ConfigFiles --> Tailwind["tailwind.config.ts"]
    ConfigFiles --> TSConfig["tsconfig.json"]
    ConfigFiles --> ESLint[".eslintrc.json"]

    App --> Globals["globals.css"]
    App --> Layout["layout.tsx"]
    App --> Loading["loading.tsx"]
    App --> Page["page.tsx"]

    App --> About["about/"]
    About --> AboutPage["page.tsx"]

    App --> Fonts["fonts/"]
    Fonts --> Font1["ArbFONTS-ArbFONTS-Janna-LT-Bold.ttf"]
    Fonts --> Font2["ArbFONTS-ArbFONTS-Janna-LT-Regular.ttf"]
    Fonts --> Font3["ArbFONTS-JannaLT-Regular.ttf"]

    App --> Projects["projects/"]
    Projects --> ProjectID["[id]/"]
    ProjectID --> ProjectPage["page.tsx"]

    ProjectID --> Contributors["contributors/"]
    Contributors --> ContributorsPage["page.tsx"]

    Components --> AboutHero["about-hero.tsx"]
    Components --> ActivityTimeline["activity-timeline.tsx"]
    Components --> ContributionGraph["contribution-graph.tsx"]
    Components --> ContributorCard["contributor-card.tsx"]
    Components --> ContributorsChart["contributors-chart.tsx"]
    Components --> ContributorsHero["contributors-hero.tsx"]
    Components --> ContributorsStatistics["contributors-statistics.tsx"]
    Components --> ContributorsTimeline["contributors-timeline.tsx"]
    Components --> HeroBackground["hero-background.tsx"]
    Components --> HeroSection["hero-section.tsx"]
    Components --> Markdown["markdown.tsx"]
    Components --> Navbar["navbar.tsx"]
    Components --> PageTransition["page-transition.tsx"]
    Components --> ProjectBanner["project-banner.tsx"]
    Components --> ProjectCard["project-card.tsx"]
    Components --> ProjectsList["projects-list.tsx"]
    Components --> ProjectsLoading["projects-loading.tsx"]
    Components --> SearchFilters["search-filters.tsx"]
    Components --> Skeleton["skeleton.tsx"]
    Components --> SocialLinks["social-links.tsx"]
    Components --> ThemeProvider["theme-provider.tsx"]

    Components --> UI["ui/"]
    UI --> Avatar["avatar.tsx"]
    UI --> Badge["badge.tsx"]
    UI --> Button["button.tsx"]
    UI --> Card["card.tsx"]
    UI --> Dropdown["dropdown-menu.tsx"]
    UI --> Input["input.tsx"]
    UI --> Select["select.tsx"]
    UI --> Sheet["sheet.tsx"]
    UI --> UITabs["tabs.tsx"]
    UI --> Tooltip["tooltip.tsx"]

    Lib --> GitHubService["github-service.ts"]
    Lib --> LanguageContext["language-context.tsx"]
    Lib --> Types["types.ts"]
    Lib --> Utils["utils.ts"]

    Public --> Images["images/"]


```

## 🔄 User Flow

```mermaid
sequenceDiagram
    participant User
    participant UI
    participant API
    participant GitHub
    
    User->>UI: Access Home Page
    UI->>API: Fetch Projects
    API->>GitHub: Get Repositories
    GitHub-->>API: Return Repo Data
    API-->>UI: Display Projects
    
    User->>UI: Select Project
    UI->>API: Get Project Details
    API->>GitHub: Fetch Repo Info
    GitHub-->>API: Return Details
    API-->>UI: Show Project Page
    
    User->>UI: View Contributors
    UI->>API: Request Contributors
    API->>GitHub: Get Contributors
    GitHub-->>API: Contributor Data
    API-->>UI: Display Contributors
```

## 🤖 GitHub API Integration Flow

```mermaid
graph LR
    A[🌐 Client] -->|1️⃣ Request Projects| B[⚡ Next.js API]
    B -->|2️⃣ Check Cache| C[(🗄️ Local Cache)]
    
    C --|✅ Cache Hit|--> B
    C --|❌ Cache Miss|--> D[🔄 GitHub API]
    
    D --|3️⃣ Fetch Data|--> B
    B --|4️⃣ Transform & Standardize|--> E[📊 Standardized Format]
    E --|5️⃣ Store in Cache & Return|--> A

    A --|6️⃣ Request Project Details|--> F[📂 Project Page]
    F --|7️⃣ Fetch README|--> D
    F --|8️⃣ Get Contributors|--> D
```

## 🛠 Technologies Used

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- GitHub API
- Shadcn UI
- Recharts
- Framer Motion

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request




