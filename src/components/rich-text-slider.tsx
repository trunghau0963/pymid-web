"use client";

import { ContentSlider } from "@/components/content-slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play } from "lucide-react";

const API_BASE = "https://api.pymid.com";

interface ContentSection {
  title: string;
  videoUrl: string | null;
  description: string;
}

function parseFlowContent(html: string): ContentSection[] {
  const sections: ContentSection[] = [];
  
  // Normalize line breaks
  let content = html.replace(/<BR>/gi, "<br/>").replace(/\n/g, "<br/>");
  
  // Extract YouTube iframes and their preceding titles
  // Pattern: Look for titles (often marked with # or ** or ***) followed by video iframes
  
  // Split by iframe tags to separate sections
  const iframeRegex = /<iframe[^>]*src=["']([^"']+)["'][^>]*><\/iframe>/gi;
  const parts = content.split(iframeRegex);
  
  // Get all iframe URLs
  const iframeMatches = [...content.matchAll(/<iframe[^>]*src=["']([^"']+)["'][^>]*><\/iframe>/gi)];
  
  for (let i = 0; i < iframeMatches.length; i++) {
    const beforeIframe = parts[i * 2] || "";
    const iframeUrl = iframeMatches[i][1];
    
    // Extract title from before the iframe - look for markdown headers or bold text
    let title = "";
    
    // Try to find ## header or *** bold+italic title
    const headerMatch = beforeIframe.match(/(?:##+\s*|(?:\*{3}|_{3}))([^*_#<\n]+)(?:\*{3}|_{3})?[^<]*$/);
    if (headerMatch) {
      title = headerMatch[1].trim();
    } else {
      // Try to find any text near the end that looks like a title
      const textMatch = beforeIframe.match(/([^<>]{10,100}?)\s*(?:<br\/?>\s*)*$/);
      if (textMatch) {
        title = textMatch[1].replace(/[*#_]+/g, '').trim();
      }
    }
    
    // Clean up title
    title = title.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim();
    
    // Get description (remaining part before iframe, cleaned)
    let description = beforeIframe
      .replace(/#+\s*[^<\n]+/g, '') // Remove headers
      .replace(/\*{3}[^*]+\*{3}/g, '') // Remove bold+italic
      .replace(/<br\/?>\s*<br\/?>/gi, '<br/>') // Reduce multiple breaks
      .trim();
    
    sections.push({
      title: title || `Quy trình ${i + 1}`,
      videoUrl: iframeUrl,
      description: ""
    });
  }
  
  // If no iframes found, try to split by headers
  if (sections.length === 0) {
    // Split by ## headers or *** markers
    const headerSections = content.split(/(?=(?:##+|(?:\*{3}|_{3}))[^<\n]+)/);
    
    for (const section of headerSections) {
      if (!section.trim()) continue;
      
      const titleMatch = section.match(/^(?:##+\s*|(?:\*{3}|_{3}))([^*_#<\n]+)/);
      const title = titleMatch ? titleMatch[1].replace(/[*_]+$/, '').trim() : "";
      
      if (title) {
        sections.push({
          title,
          videoUrl: null,
          description: section.replace(/^(?:##+\s*|(?:\*{3}|_{3}))[^<\n]*/, '').trim()
        });
      }
    }
  }
  
  return sections;
}

function getYoutubeEmbedUrl(url: string): string {
  // Already an embed URL
  if (url.includes('/embed/')) return url;
  
  // Convert youtube.com/watch?v= or youtu.be/ to embed
  const videoIdMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?/]+)/);
  if (videoIdMatch) {
    return `https://www.youtube.com/embed/${videoIdMatch[1]}`;
  }
  return url;
}

function FlowSlide({ section, index, total }: { section: ContentSection; index: number; total: number }) {
  return (
    <Card className="rounded-sm overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
              {index + 1}
            </div>
            <span className="line-clamp-2">{section.title}</span>
          </CardTitle>
          <span className="text-sm text-muted-foreground shrink-0">
            {index + 1} / {total}
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {section.videoUrl ? (
          <div className="aspect-video rounded-lg overflow-hidden bg-slate-100">
            <iframe
              src={getYoutubeEmbedUrl(section.videoUrl)}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={section.title}
            />
          </div>
        ) : section.description ? (
          <div 
            className="prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: section.description }}
          />
        ) : (
          <div className="aspect-video rounded-lg bg-slate-100 flex items-center justify-center text-muted-foreground">
            <Play className="h-12 w-12" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function RichTextSlider({ content }: { content: string }) {
  const sections = parseFlowContent(content);
  
  if (sections.length === 0) {
    return (
      <div className="text-muted-foreground text-center py-8">
        Chưa có thông tin quy trình
      </div>
    );
  }
  
  if (sections.length === 1) {
    return <FlowSlide section={sections[0]} index={0} total={1} />;
  }
  
  return (
    <ContentSlider autoPlayInterval={0}>
      {sections.map((section, index) => (
        <FlowSlide key={index} section={section} index={index} total={sections.length} />
      ))}
    </ContentSlider>
  );
}
