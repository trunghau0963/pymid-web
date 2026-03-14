"use client";

import { ContentSlider } from "@/components/content-slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play } from "lucide-react";
import { normalizeRichTextSource, renderRichTextHtml } from "@/lib/rich-text";

interface ContentSection {
  title: string;
  videoUrl: string | null;
  description: string;
}

function toPlainTitle(value: string): string {
  return value
    .replace(/<[^>]*>/g, "")
    .replace(/^[*_#\s]+/, "")
    .replace(/[*_\s]+$/, "")
    .trim();
}

function extractTitle(segment: string, index: number): string {
  const headings = [...segment.matchAll(/^#{1,6}\s+(.+)$/gm)];
  if (headings.length > 0) {
    return toPlainTitle(headings[headings.length - 1][1]) || `Quy trình ${index}`;
  }

  const strongLine = segment.match(/^\s*[^\w\s]?\s*\*\*(.+?)\*\*\s*:?.*$/m);
  if (strongLine?.[1]) {
    return toPlainTitle(strongLine[1]) || `Quy trình ${index}`;
  }

  const firstLine = segment
    .split("\n")
    .map((line) => line.trim())
    .find((line) => line.length > 0);

  if (firstLine) {
    return toPlainTitle(firstLine).slice(0, 80) || `Quy trình ${index}`;
  }

  return `Quy trình ${index}`;
}

function stripPrimaryTitle(segment: string): string {
  return segment
    .replace(/^\s*#{1,6}\s+.+$/m, "")
    .replace(/^\s*[^\w\s]?\s*\*\*.+?\*\*\s*:?.*$/m, "")
    .trim();
}

function parseFlowContent(raw: string): ContentSection[] {
  const sections: ContentSection[] = [];
  const content = normalizeRichTextSource(raw);

  if (!content) {
    return sections;
  }

  const iframeRegex = /<iframe[^>]*src=["']([^"']+)["'][^>]*><\/iframe>/gi;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let step = 1;

  while ((match = iframeRegex.exec(content)) !== null) {
    const beforeIframe = content.slice(lastIndex, match.index).trim();
    const videoUrl = match[1];
    const title = extractTitle(beforeIframe, step);
    const description = stripPrimaryTitle(beforeIframe);

    sections.push({
      title,
      videoUrl,
      description,
    });

    lastIndex = iframeRegex.lastIndex;
    step += 1;
  }

  const trailing = content.slice(lastIndex).trim();
  if (trailing) {
    const headingChunks = trailing.split(/(?=^#{2,6}\s+.+$)/gm).filter((item) => item.trim());
    const chunks = headingChunks.length > 1 ? headingChunks : [trailing];

    chunks.forEach((chunk, index) => {
      sections.push({
        title: extractTitle(chunk, step + index),
        videoUrl: null,
        description: chunk.trim(),
      });
    });
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
  const descriptionHtml = section.description
    ? renderRichTextHtml(section.description)
    : "";

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
        {descriptionHtml ? (
          <div
            className="rich-text mb-4 max-w-none text-[15px] sm:text-base"
            dangerouslySetInnerHTML={{ __html: descriptionHtml }}
          />
        ) : null}

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
        ) : !descriptionHtml ? (
          <div className="aspect-video rounded-lg bg-slate-100 flex items-center justify-center text-muted-foreground">
            <Play className="h-12 w-12" />
          </div>
        ) : null}
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
