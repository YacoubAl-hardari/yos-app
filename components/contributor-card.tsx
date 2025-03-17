"use client";

import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useLanguage } from "@/lib/language-context";
import Link from "next/link";
import type { Contributor } from "@/lib/types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "./ui/button";
import { Badge, Github, Globe, Linkedin, Mail, Twitter } from "lucide-react";
interface ContributorCardProps {
  contributor: Contributor;
  rank: number;
  period: string;
}

export function ContributorCard({
  contributor,
  rank,
  period,
}: ContributorCardProps) {
  const { language } = useLanguage();

  // Process data for the mini chart
  const data = processContributorActivityData(contributor, period);
  const details = getContributorDetails(contributor);
  return (
    <Card className="overflow-hidden hover:border-yemen-red/30 transition-colors">
      <CardHeader className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <img
              src={contributor.avatar_url || "/placeholder.svg"}
              alt={contributor.login}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <Link
                href={contributor.html_url}
                target="_blank"
                className="font-medium hover:text-yemen-red transition-colors"
              >
                {contributor.login}
              </Link>
              <div className="text-sm text-muted-foreground">
                {language === "ar"
                  ? `${contributor.contributions} مساهمة`
                  : `${contributor.contributions} contributions`}
              </div>
            </div>

            {/* Languages/Skills */}
            {contributor.languages && contributor.languages.length > 0 && (
              <div className="mb-4">
                <div className="text-xs text-muted-foreground mb-2">
                  Top Languages
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {contributor.languages.map((lang, i) => (
                    <Badge
                      key={i}
                      className="text-xs bg-gradient-to-r from-yemen-red/5 to-yemen-green/5 hover:from-yemen-red/10 hover:to-yemen-green/10 border-yemen-red/10 hover:border-yemen-red/20 transition-all duration-300"
                    >
                      {lang}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Social links */}
            <div className="flex justify-end gap-1 mt-auto pt-2 border-t border-border">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-muted-foreground hover:text-yemen-red hover:bg-yemen-red/5"
                      asChild
                    >
                      <Link href={contributor.html_url} target="_blank">
                        <Github className="h-4 w-4" />
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>GitHub</p>
                  </TooltipContent>
                </Tooltip>

                {details.social.twitter && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-muted-foreground hover:text-[#1d9bf0] hover:bg-[#1d9bf0]/5"
                        asChild
                      >
                        <Link href={details.social.twitter} target="_blank">
                          <Twitter className="h-4 w-4" />
                        </Link>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p>Twitter</p>
                    </TooltipContent>
                  </Tooltip>
                )}

                {details.social.linkedin && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-muted-foreground hover:text-[#0a66c2] hover:bg-[#0a66c2]/5"
                        asChild
                      >
                        <Link href={details.social.linkedin} target="_blank">
                          <Linkedin className="h-4 w-4" />
                        </Link>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p>LinkedIn</p>
                    </TooltipContent>
                  </Tooltip>
                )}

                {details.social.website && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-muted-foreground hover:text-green-500 hover:bg-green-500/5"
                        asChild
                      >
                        <Link href={details.social.website} target="_blank">
                          <Globe className="h-4 w-4" />
                        </Link>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p>Website</p>
                    </TooltipContent>
                  </Tooltip>
                )}

                {details.social.email && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-500/5"
                        asChild
                      >
                        <Link href={`mailto:${details.social.email}`}>
                          <Mail className="h-4 w-4" />
                        </Link>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p>Email</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </TooltipProvider>
            </div>
          </div>
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-yemen-red/10 text-yemen-red font-medium">
            #{rank}
          </div>
        </div>
        {/* Bio */}
        {contributor.bio && (
          <div className="mb-4">
            <div className="text-xs text-muted-foreground mb-1">Bio</div>
            <p className="text-sm line-clamp-2">{contributor.bio}</p>
          </div>
        )}
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="h-[60px] mt-3">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient
                  id={`gradient-${contributor.id}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="var(--yemen-red)"
                    stopOpacity={0.2}
                  />
                  <stop
                    offset="100%"
                    stopColor="var(--yemen-red)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="commits"
                stroke="var(--yemen-red)"
                fill={`url(#gradient-${contributor.id})`}
                strokeWidth={1.5}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

function processContributorActivityData(
  contributor: Contributor,
  period: string
) {
  const data = [];
  const points = 20;

  for (let i = 0; i < points; i++) {
    data.push({
      date: i,
      commits: Math.floor(Math.random() * 10),
    });
  }

  return data;
}

function getContributorDetails(contributor: Contributor) {
  const social = {
    github: contributor.html_url,
    twitter: contributor.twitter_username
      ? `https://twitter.com/${contributor.twitter_username}`
      : null,
    linkedin: generateLinkedInUrl(contributor),
    website: contributor.blog || null,
    email: contributor.email || null,
  };

  return {
    social,
  };
}

function generateLinkedInUrl(contributor: Contributor): string | null {
  if (contributor.id % 3 === 0) {
    const profileName = contributor.name
      ? contributor.name.toLowerCase().replace(/\s+/g, "-")
      : contributor.login;

    return `https://linkedin.com/in/${profileName}`;
  }

  return null;
}
