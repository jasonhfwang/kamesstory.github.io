"use client";

import { useState, useEffect, useMemo } from "react";
import { useScramble } from "use-scramble";
import { useQuery } from "@tanstack/react-query";

type ContentSectionProps = {
  title: string;
  sectionType: "projects" | "specialities" | "thoughts";
};

// Preset animation timings that feel random but are consistent
const animationPresets: Record<
  string,
  { breathe: number; glow: number; delay: number }
> = {
  projects: { breathe: 6.2, glow: 8.5, delay: -3.7 },
  specialities: { breathe: 7.8, glow: 9.3, delay: -6.1 },
  thoughts: { breathe: 5.4, glow: 10.7, delay: -2.3 },
};

type ContentItem = {
  title: string;
  content: string;
  slug: string;
};

// Strip markdown formatting to plain text for scrambling
function stripMarkdownLinks(text: string): string {
  return text
    .replace(/\*\*([^*]+)\*\*/g, "$1") // bold
    .replace(/_([^_]+)_/g, "$1") // italic (underscore)
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1"); // links
}

// Convert markdown to HTML (bold, italic, links)
function markdownToHTML(text: string): string {
  return text
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/_([^_]+)_/g, "<em>$1</em>")
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-accent hover:text-secondary transition-colors duration-150">$1</a>'
    );
}

// Fisher-Yates shuffle
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function ContentSection({
  title,
  sectionType,
}: ContentSectionProps) {
  const [shuffledItems, setShuffledItems] = useState<ContentItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRefreshable, setIsRefreshable] = useState(true);
  const [isScrambling, setIsScrambling] = useState(true);

  // Get preset timing based on section type (deterministic for SSR)
  const timing = animationPresets[sectionType];

  const { data: allItems, isLoading } = useQuery({
    queryKey: ["content", sectionType],
    queryFn: async () => {
      const response = await fetch(`/api/content/${sectionType}/all`);
      if (!response.ok) throw new Error("Failed to fetch content");
      return response.json() as Promise<ContentItem[]>;
    },
  });

  // Shuffle items once when they arrive or when sectionType changes
  useEffect(() => {
    if (allItems && allItems.length > 0) {
      setShuffledItems(shuffleArray(allItems));
      setCurrentIndex(0);
      setIsScrambling(true);
    }
  }, [allItems, sectionType]);

  const currentItem = shuffledItems[currentIndex];

  const processedContent = useMemo(() => {
    if (!currentItem)
      return { title: "", body: "", hasColon: false, stripped: "" };

    const content = currentItem.content;
    const titleMatch = content.match(/^\*\*([^*]+)\*\*(:?)\s*/);

    if (titleMatch) {
      return {
        title: titleMatch[1],
        hasColon: titleMatch[2] === ":",
        body: content.substring(titleMatch[0].length),
        stripped: stripMarkdownLinks(content.substring(titleMatch[0].length)),
      };
    } else {
      return {
        title: "",
        hasColon: false,
        body: content,
        stripped: stripMarkdownLinks(content),
      };
    }
  }, [currentItem]);

  const handleRefresh = () => {
    if (!isRefreshable || shuffledItems.length <= 1) return;

    setIsRefreshable(false);
    setIsScrambling(true);

    setCurrentIndex((prev) => (prev + 1) % shuffledItems.length);

    // Add a small delay before allowing another refresh for visual feedback
    setTimeout(() => setIsRefreshable(true), 500);
  };

  const { ref } = useScramble({
    text: processedContent.stripped,
    speed: 1,
    tick: 1,
    step: 3,
    scramble: 8,
    seed: 2,
    chance: 0.8,
    range: [65, 125],
    overdrive: false,
    playOnMount: true,
    onAnimationEnd: () => setIsScrambling(false),
  });

  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-display font-semibold text-foreground tracking-tight">
          {title}
        </h2>
        <button
          onClick={handleRefresh}
          onMouseLeave={(e) => e.currentTarget.blur()}
          disabled={!isRefreshable || isLoading}
          className="text-accent hover:text-secondary focus:text-accent active:scale-100 transition-all duration-100 cursor-pointer border-0 bg-transparent p-1 inline-flex items-center justify-center group text-xl focus:outline-none disabled:opacity-50 disabled:cursor-default disabled:hover:text-accent"
          style={{ textDecoration: "none", borderBottom: "none" }}
          title="Refresh content"
        >
          <span
            className={`inline-block ${
              !isRefreshable || isLoading ? "animate-spin-slow" : ""
            } group-hover:[text-shadow:0_0_4px_rgba(0,212,255,0.2),0_0_8px_rgba(0,212,255,0.1)]`}
            style={{ paddingBottom: "4px", transformOrigin: "center" }}
          >
            ↻
          </span>
        </button>
      </div>
      <div className="relative">
        {/* Second box underneath - implies more content */}
        <div className="absolute inset-0 translate-x-2 translate-y-2 border border-muted/15 bg-accent/3"></div>

        {/* Main box */}
        <div
          className="relative border border-muted/20 p-4 bg-background transition-shadow duration-300 hover:shadow-[0_0_18px_3px_rgba(0,136,255,0.15)]"
          style={{
            animation: `breathe ${timing.breathe}s ease-in-out infinite, subtle-glow ${timing.glow}s ease-in-out infinite`,
            animationDelay: `${timing.delay}s, ${timing.delay * 0.8}s`,
          }}
        >
          <div className="text-foreground leading-relaxed font-mono min-h-[1.5em]">
            {processedContent.title && (
              <>
                <strong className="font-bold">{processedContent.title}</strong>
                {processedContent.hasColon ? ": " : " "}
              </>
            )}
            {isScrambling ? (
              <span ref={ref} />
            ) : (
              <span
                ref={ref}
                className="[&_a]:border-b [&_a]:border-accent"
                dangerouslySetInnerHTML={{
                  __html: markdownToHTML(processedContent.body),
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
