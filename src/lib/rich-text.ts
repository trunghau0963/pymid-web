import { marked } from "marked";

const API_BASE = "https://api.pymid.com";

function mergeClassAttr(tagAttrs: string, className: string): string {
  if (/\bclass\s*=/.test(tagAttrs)) {
    return tagAttrs.replace(
      /class=(['"])(.*?)\1/i,
      (_, quote: string, existing: string) => `class=${quote}${existing} ${className}${quote}`
    );
  }

  return `${tagAttrs} class="${className}"`;
}

export function normalizeRichTextSource(raw: string): string {
  let text = raw ?? "";

  text = text.replace(/\r\n?/g, "\n");
  text = text.replace(/<br\s*\/?>/gi, "\n");
  text = text.replace(/&#42;|&ast;/gi, "*");
  text = text.replace(/&#95;/gi, "_");

  // Normalize odd heading patterns from API (ex: ##**Title:**, ###***Title***).
  text = text.replace(/^(#{1,6})\s*\*\*\s*(.+?)\s*\*\*\s*$/gm, "$1 $2");
  text = text.replace(/^(#{1,6})\s*\*{3}\s*(.+?)\s*\*{3}\s*$/gm, "$1 $2");

  // Some API fields mix HTML + markdown; pre-convert bold markers so stars never leak.
  text = text.replace(/\*\*([^*\n][^*\n]*?)\*\*/g, "<strong>$1</strong>");
  text = text.replace(/__([^_\n][^_\n]*?)__/g, "<strong>$1</strong>");

  // Promote standalone triple-emphasis lines to heading level 3.
  text = text.replace(
    /^\s*(?:\*{3}|_{3})\s*([^\n*_][^\n]*?)\s*(?:\*{3}|_{3})\s*$/gm,
    "### $1"
  );

  // Remove orphan heading markers like a single "##" line.
  text = text.replace(/^\s*#{1,6}\s*$/gm, "");

  // Normalize long separators to markdown horizontal rule.
  text = text.replace(/^\s*(?:={6,}|-{6,})\s*$/gm, "\n---\n");

  text = text.replace(/\n{3,}/g, "\n\n");

  return text.trim();
}

export function looksLikeMarkdown(input: string): boolean {
  const hints = [
    /^\s{0,3}#{1,6}\s+\S/m,
    /\*\*[^*]+\*\*/,
    /\[[^\]]+\]\([^)]+\)/,
    /^\s*[-*+]\s+\S/m,
    /^\s*\d+\.\s+\S/m,
    /^\s*>\s+\S/m,
    /^\s*```/m,
    /^\s*---+\s*$/m,
    /!\[[^\]]*\]\([^)]+\)/,
  ];

  return hints.some((pattern) => pattern.test(input));
}

function postProcessHtml(html: string): string {
  let processed = html;

  // Fallback cleanup for markdown markers that survive because they were nested inside raw HTML.
  processed = processed.replace(/\*\*([^*<][^<]*?)\*\*/g, "<strong>$1</strong>");
  processed = processed.replace(/__([^_<][^<]*?)__/g, "<strong>$1</strong>");

  processed = processed.replace(
    /<img\b([^>]*)>/gi,
    (_, attrs: string) => {
      let nextAttrs = attrs;

      nextAttrs = nextAttrs.replace(
        /src=(['"])([^'"]+)\1/i,
        (srcMatch: string, quote: string, src: string) => {
          if (src.startsWith("http") || src.startsWith("data:")) {
            return srcMatch;
          }

          if (src.startsWith("/")) {
            return `src=${quote}${API_BASE}${src}${quote}`;
          }

          return srcMatch;
        }
      );

      if (!/\bloading\s*=/.test(nextAttrs)) {
        nextAttrs += ' loading="lazy"';
      }

      nextAttrs = mergeClassAttr(
        nextAttrs,
        "mx-auto my-4 h-auto max-w-full rounded-lg shadow-sm"
      );

      return `<img${nextAttrs}>`;
    }
  );

  processed = processed.replace(
    /<a\b([^>]*)>/gi,
    (_, attrs: string) => {
      let nextAttrs = attrs;

      const hrefMatch = nextAttrs.match(/href=(['"])([^'"]+)\1/i);
      const href = hrefMatch?.[2] || "";

      if (/^https?:\/\//i.test(href)) {
        if (!/\btarget\s*=/.test(nextAttrs)) {
          nextAttrs += ' target="_blank"';
        }

        if (!/\brel\s*=/.test(nextAttrs)) {
          nextAttrs += ' rel="noopener noreferrer"';
        }
      }

      nextAttrs = mergeClassAttr(
        nextAttrs,
        "font-semibold text-primary underline-offset-4 hover:underline"
      );

      return `<a${nextAttrs}>`;
    }
  );

  processed = processed.replace(
    /<iframe\b([^>]*)><\/iframe>/gi,
    (_, attrs: string) => {
      let nextAttrs = attrs;

      if (!/\bloading\s*=/.test(nextAttrs)) {
        nextAttrs += ' loading="lazy"';
      }

      nextAttrs = mergeClassAttr(nextAttrs, "h-full w-full border-0");

      return `<div class="my-4 aspect-video overflow-hidden rounded-lg border border-border/60 bg-black/5"><iframe${nextAttrs}></iframe></div>`;
    }
  );

  return processed;
}

export function renderRichTextHtml(raw: string): string {
  const normalized = normalizeRichTextSource(raw);

  if (!normalized) {
    return "";
  }

  const hasHtmlTags = /<\/?[a-z][\s\S]*>/i.test(normalized);
  const shouldParseMarkdown = looksLikeMarkdown(normalized) || !hasHtmlTags;

  const rendered = shouldParseMarkdown
    ? (marked.parse(normalized, {
        async: false,
        gfm: true,
        breaks: true,
      }) as string)
    : normalized.replace(/\n/g, "<br/>");

  return postProcessHtml(rendered);
}
