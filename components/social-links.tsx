"use client"

import { useLanguage } from "@/lib/language-context"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Github, Twitter, Linkedin, Mail, Globe, MessageSquare } from "lucide-react"
import Link from "next/link"

export function SocialLinks() {
  const { language } = useLanguage()

  const socialLinks = [
    {
      name: "GitHub",
      icon: <Github className="h-5 w-5" />,
      url: "https://github.com/YemenOpenSource",
      color: "hover:bg-black/10 dark:hover:bg-white/10",
    },
    {
      name: "Twitter",
      icon: <Twitter className="h-5 w-5" />,
      url: "https://x.com/yemenopensource",
      color: "hover:bg-blue-500/10 hover:text-blue-500",
    },
    {
      name: "LinkedIn",
      icon: <Linkedin className="h-5 w-5" />,
      url: "https://www.linkedin.com/company/yemenopensource",
      color: "hover:bg-blue-700/10 hover:text-blue-700",
    },
    {
      name: "Website",
      icon: <Globe className="h-5 w-5" />,
      url: "https://yemenopensource.vercel.app/",
      color: "hover:bg-green-500/10 hover:text-green-500",
    },
    {
      name: "Email",
      icon: <Mail className="h-5 w-5" />,
      url: "mailto:opensource.ye@gmail.com",
      color: "hover:bg-red-500/10 hover:text-red-500",
    },
  ]

  return (
    <div className="flex flex-wrap justify-center gap-3">
      {socialLinks.map((link) => (
        <Button
          key={link.name}
          variant="outline"
          size="lg"
          className={cn(
            "border-yemen-red/10 transition-colors",
            link.color,
            language === "ar" && "font-arabic flex-row-reverse",
          )}
          asChild
        >
          <Link href={link.url} target="_blank" rel="noopener noreferrer">
            {link.icon}
            <span className={cn("ml-2", language === "ar" && "mr-2 ml-0")}>
              {language === "ar" ? getArabicName(link.name) : link.name}
            </span>
          </Link>
        </Button>
      ))}
    </div>
  )
}

function getArabicName(name: string): string {
  const arabicNames: Record<string, string> = {
    GitHub: "جيثب",
    Twitter: "تويتر",
    LinkedIn: "لينكد إن",
    Website: "الموقع",
    Email: "البريد الإلكتروني",
  }

  return arabicNames[name] || name
}

