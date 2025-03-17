"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Mountain, Moon, Sun, Github, Menu } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { useLanguage } from "@/lib/language-context"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Image from "next/image";
const NavLinks = ({ mobile = false, onClick = () => {} }) => {
  const { language } = useLanguage()

  return (
    <div
      className={cn(
        mobile ? "flex flex-col space-y-4 mt-8" : "hidden md:flex md:items-center md:space-x-4",
        language === "ar" && !mobile && "md:space-x-reverse",
      )}
    >
      <Link
        href="/"
        className={cn("text-sm font-medium transition-colors hover:text-yemen-red", language === "ar" && "font-arabic")}
        onClick={onClick}
      >
        {language === "ar" ? "الرئيسية" : "Home"}
      </Link>
      <Link
        href="/about"
        className={cn("text-sm font-medium transition-colors hover:text-yemen-red", language === "ar" && "font-arabic")}
        onClick={onClick}
      >
        {language === "ar" ? "من نحن" : "About"}
      </Link>
     
    </div>
  )
}

export default function Navbar() {
  const { theme, setTheme } = useTheme()
  const { language, toggleLanguage } = useLanguage()
  const [sheetOpen, setSheetOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  // After mounting, we can safely show the UI that depends on the theme
  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    if (theme === "dark") {
      setTheme("light")
    } else {
      setTheme("dark")
    }
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-4">
      <Link href="/" className={cn("flex items-center gap-2 ", language === "ar" && "order-1 md:order-1" , language === "ar" ? "pl-5" : "pr-5" )}>
      <Image src="/images/logo.jpg" alt="Logo" width={40} height={40} />
    </Link>

        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn("md:hidden", language === "ar" ? "order-3 md:order-3" : "order-1 md:order-1")}
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side={language === "ar" ? "right" : "left"} className="pt-10">
            <Link
              href="/"
              className={cn("flex items-center gap-2", language === "ar" && "flex-row-reverse justify-end font-arabic")}
              onClick={() => setSheetOpen(false)}
            >
              <Mountain className="h-6 w-6 text-yemen-red" />
              <span className="font-bold text-lg">{language === "ar" ? "مشاريع اليمن" : "Yemen OSS"}</span>
            </Link>
            <NavLinks mobile onClick={() => setSheetOpen(false)} />
            <div className="flex flex-col space-y-4 mt-8">
              <Button
                variant="outline"
                className={language === "ar" ? "font-arabic" : ""}
                onClick={() => {
                  toggleLanguage()
                  setSheetOpen(false)
                }}
              >
                {language === "ar" ? "English" : "العربية"}
              </Button>
              <Button
                variant="default"
                className={cn(
                  "flex items-center gap-2 bg-yemen-red hover:bg-yemen-red/90",
                  language === "ar" && "font-arabic flex-row-reverse",
                )}
                asChild
              >
                <Link href="https://github.com" target="_blank">
                  <Github className={cn("h-4 w-4", language === "ar" ? "ml-2" : "mr-2")} />
                  {language === "ar" ? "شارك على جيتهب" : "Contribute on GitHub"}
                </Link>
              </Button>
            </div>
          </SheetContent>
        </Sheet>

        <nav
          className={cn(
            "flex-1 items-center justify-center",
            language === "ar" ? "order-2 md:order-2" : "order-2 md:order-2",
          )}
        >
          <NavLinks />
        </nav>

        <div
          className={cn(
            "flex items-center gap-2",
            language === "ar" ? "order-2 md:ml-auto md:order-3" : "order-3 md:ml-auto md:order-3",
          )}
        >
          {mounted && (
            <Button variant="ghost" size="icon" aria-label="Toggle theme" className="mr-1" onClick={toggleTheme}>
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          )}

          <Button
            variant="ghost"
            className={cn("hover:text-yemen-red hover:bg-yemen-red/5", language === "ar" ? "font-arabic" : "")}
            onClick={toggleLanguage}
          >
            {language === "ar" ? "English" : "العربية"}
          </Button>

          <Button
            variant="default"
            size="sm"
            className={cn(
              "hidden md:flex items-center gap-2 bg-yemen-red hover:bg-yemen-red/90",
              language === "ar" && "font-arabic flex-row-reverse",
            )}
            asChild
          >
            <Link href="https://github.com" target="_blank">
              <Github className={cn("h-4 w-4", language === "ar" ? "ml-2" : "mr-2")} />
              {language === "ar" ? "شارك على جيتهب" : "Contribute on GitHub"}
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}

