"use client"

import { useLanguage } from "@/lib/language-context"
import { cn } from "@/lib/utils"
import { AboutHero } from "@/components/about-hero"
import { SocialLinks } from "@/components/social-links"
import { Card, CardContent } from "@/components/ui/card"
import { Globe, Heart, Code, Users, Lightbulb } from "lucide-react"

export default function AboutPage() {
  const { language } = useLanguage()

  return (
    <main className="min-h-screen">
      <AboutHero />

      <div className="container mx-auto px-4 py-12">
        {/* Mission and Vision */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className={cn("text-3xl font-bold mb-8 text-center", language === "ar" && "font-arabic")}>
            {language === "ar" ? "مهمتنا ورؤيتنا" : "Our Mission & Vision"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-yemen-red/20 hover:border-yemen-red/40 transition-colors">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-yemen-red/10 flex items-center justify-center text-yemen-red mr-3">
                    <Heart className="w-5 h-5" />
                  </div>
                  <h3 className={cn("text-xl font-bold", language === "ar" && "font-arabic")}>
                    {language === "ar" ? "مهمتنا" : "Our Mission"}
                  </h3>
                </div>
                <p className={cn("text-muted-foreground", language === "ar" && "font-arabic")}>
                  {language === "ar"
                    ? "تعزيز وتطوير مجتمع المصادر المفتوحة في اليمن من خلال توفير منصة للمطورين اليمنيين لمشاركة مشاريعهم والتعاون والتعلم من بعضهم البعض. نحن نسعى لبناء بيئة داعمة تشجع على الابتكار والمساهمة في عالم البرمجيات مفتوحة المصدر."
                    : "To foster and grow the open source community in Yemen by providing a platform for Yemeni developers to share their projects, collaborate, and learn from each other. We strive to build a supportive environment that encourages innovation and contribution to the world of open source software."}
                </p>
              </CardContent>
            </Card>

            <Card className="border-yemen-red/20 hover:border-yemen-red/40 transition-colors">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-yemen-red/10 flex items-center justify-center text-yemen-red mr-3">
                    <Lightbulb className="w-5 h-5" />
                  </div>
                  <h3 className={cn("text-xl font-bold", language === "ar" && "font-arabic")}>
                    {language === "ar" ? "رؤيتنا" : "Our Vision"}
                  </h3>
                </div>
                <p className={cn("text-muted-foreground", language === "ar" && "font-arabic")}>
                  {language === "ar"
                    ? "نتطلع إلى مستقبل يكون فيه المطورون اليمنيون مساهمين نشطين في مجتمع البرمجيات مفتوحة المصدر العالمي، مع الاعتراف بمواهبهم وإبداعهم. نحن نهدف إلى جعل اليمن مركزًا للابتكار التقني وتطوير البرمجيات عالية الجودة."
                    : "We envision a future where Yemeni developers are active contributors to the global open source software community, with their talents and creativity recognized. We aim to make Yemen a hub for technological innovation and high-quality software development."}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* What We Do */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className={cn("text-3xl font-bold mb-8 text-center", language === "ar" && "font-arabic")}>
            {language === "ar" ? "ما نقوم به" : "What We Do"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-yemen-red/20 hover:border-yemen-red/40 transition-colors">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-yemen-red/10 flex items-center justify-center text-yemen-red mb-4">
                    <Code className="w-6 h-6" />
                  </div>
                  <h3 className={cn("text-lg font-bold", language === "ar" && "font-arabic")}>
                    {language === "ar" ? "تطوير المشاريع" : "Project Development"}
                  </h3>
                </div>
                <p className={cn("text-muted-foreground text-center", language === "ar" && "font-arabic")}>
                  {language === "ar"
                    ? "نطور ونحافظ على مجموعة متنوعة من المشاريع مفتوحة المصدر التي تخدم المجتمع اليمني والعالمي."
                    : "We develop and maintain a diverse range of open source projects that serve both the Yemeni and global community."}
                </p>
              </CardContent>
            </Card>

            <Card className="border-yemen-red/20 hover:border-yemen-red/40 transition-colors">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-yemen-red/10 flex items-center justify-center text-yemen-red mb-4">
                    <Users className="w-6 h-6" />
                  </div>
                  <h3 className={cn("text-lg font-bold", language === "ar" && "font-arabic")}>
                    {language === "ar" ? "بناء المجتمع" : "Community Building"}
                  </h3>
                </div>
                <p className={cn("text-muted-foreground text-center", language === "ar" && "font-arabic")}>
                  {language === "ar"
                    ? "نجمع المطورين اليمنيين معًا من خلال الفعاليات والمشاريع التعاونية وفرص التوجيه."
                    : "We bring Yemeni developers together through events, collaborative projects, and mentorship opportunities."}
                </p>
              </CardContent>
            </Card>

            <Card className="border-yemen-red/20 hover:border-yemen-red/40 transition-colors">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-yemen-red/10 flex items-center justify-center text-yemen-red mb-4">
                    <Globe className="w-6 h-6" />
                  </div>
                  <h3 className={cn("text-lg font-bold", language === "ar" && "font-arabic")}>
                    {language === "ar" ? "التمثيل العالمي" : "Global Representation"}
                  </h3>
                </div>
                <p className={cn("text-muted-foreground text-center", language === "ar" && "font-arabic")}>
                  {language === "ar"
                    ? "نمثل المواهب اليمنية في المجتمع التقني العالمي ونعزز التعاون الدولي."
                    : "We represent Yemeni talent in the global tech community and foster international collaboration."}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Join Us */}
        <div className="max-w-4xl mx-auto mb-16 bg-gradient-to-r from-yemen-red/5 to-yemen-green/5 p-8 rounded-lg border border-yemen-red/10">
          <div className="text-center mb-8">
            <h2 className={cn("text-3xl font-bold mb-4", language === "ar" && "font-arabic")}>
              {language === "ar" ? "انضم إلينا" : "Join Our Community"}
            </h2>
            <p className={cn("text-muted-foreground max-w-2xl mx-auto", language === "ar" && "font-arabic")}>
              {language === "ar"
                ? "نحن نرحب بالمطورين والمصممين والكتّاب وجميع المهتمين بالمصادر المفتوحة للانضمام إلى مجتمعنا والمساهمة في مشاريعنا."
                : "We welcome developers, designers, writers, and all open source enthusiasts to join our community and contribute to our projects."}
            </p>
          </div>

          <SocialLinks />
        </div>

        
      </div>
    </main>
  )
}

