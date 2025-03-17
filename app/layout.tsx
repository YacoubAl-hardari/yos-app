import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import localFont from "next/font/local"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from "@/lib/language-context"
import Navbar from "@/components/navbar"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

// Add Arabic font
const arabic = localFont({
  src: "fonts/ArbFONTS-ArbFONTS-Janna-LT-Bold.ttf",
  variable: "--font-arabic",
})

export const metadata: Metadata = {
  title: "Yemeni Open Source Projects Directory",
  description: "Discover and contribute to open source software projects from Yemeni developers",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" suppressHydrationWarning  className={`${inter.variable} ${arabic.variable}`}>
      <head />
      <body className="font-sans" suppressHydrationWarning >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <LanguageProvider>
            <div className="relative min-h-screen flex flex-col">
              <Navbar />
              <div className="flex-1">{children}</div>
              <footer className="w-full border-t py-6 md:py-0 bg-gradient-to-t from-yemen-green/5 to-transparent dark:from-yemen-green/10">
                <div className="container flex flex-col md:flex-row items-center justify-between gap-4 md:h-16 px-4">
                  <p className="text-sm text-muted-foreground">
                    &copy; {new Date().getFullYear()} Yemeni Open Source Directory. All rights reserved.
                  </p>
                </div>
              </footer>
            </div>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

