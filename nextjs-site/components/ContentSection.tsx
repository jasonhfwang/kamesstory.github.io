"use client";

import { useState, useEffect } from "react";
import { useScramble } from "use-scramble";

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

export default function ContentSection({
  title,
  sectionType,
}: ContentSectionProps) {
  const [contentTitle, setContentTitle] = useState<string>("");
  const [contentBody, setContentBody] = useState<string>("");
  const [hasColon, setHasColon] = useState<boolean>(false);
  const [strippedContent, setStrippedContent] = useState<string>("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isScrambling, setIsScrambling] = useState(true);

  // Get preset timing based on section type (deterministic for SSR)
  const timing = animationPresets[sectionType];

  const fetchRandomContent = async () => {
    try {
      const response = await fetch(`/api/content/${sectionType}`);
      const data: ContentItem = await response.json();

      // Extract bold title from the beginning of content
      const titleMatch = data.content.match(/^\*\*([^*]+)\*\*(:?)\s*/);
      if (titleMatch) {
        setContentTitle(titleMatch[1]);
        setHasColon(titleMatch[2] === ":");
        setContentBody(data.content.substring(titleMatch[0].length));
        setStrippedContent(
          stripMarkdownLinks(data.content.substring(titleMatch[0].length))
        );
      } else {
        setContentTitle("");
        setHasColon(false);
        setContentBody(data.content);
        setStrippedContent(stripMarkdownLinks(data.content));
      }

      setIsScrambling(true);
    } catch (error) {
      console.error("Error fetching content:", error);
    }
  };

  useEffect(() => {
    fetchRandomContent();
  }, [sectionType]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchRandomContent();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const { ref } = useScramble({
    text: strippedContent,
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
          disabled={isRefreshing}
          className="text-accent hover:text-secondary focus:text-accent active:scale-100 transition-all duration-100 cursor-pointer border-0 bg-transparent p-1 inline-flex items-center justify-center group text-xl focus:outline-none"
          style={{ textDecoration: "none", borderBottom: "none" }}
          title="Refresh content"
        >
          <span
            className={`inline-block ${
              isRefreshing ? "animate-spin-slow" : ""
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
          <div className="text-foreground leading-relaxed font-mono">
            {contentTitle && (
              <>
                <strong className="font-bold">{contentTitle}</strong>
                {hasColon ? ": " : " "}
              </>
            )}
            {isScrambling ? (
              <span ref={ref} />
            ) : (
              <span
                className="[&_a]:border-b [&_a]:border-accent"
                dangerouslySetInnerHTML={{
                  __html: markdownToHTML(contentBody),
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
