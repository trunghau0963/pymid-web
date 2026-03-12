const API_BASE = "https://api.pymid.com";

function processContent(html: string): string {
  let processed = html;

  // Convert markdown images ![alt](url) to HTML <img> with API base URL
  processed = processed.replace(
    /!\[([^\]]*)\]\(([^)]+)\)/g,
    (_, alt: string, src: string) => {
      const imgUrl = src.startsWith("http") ? src : `${API_BASE}${src}`;
      return `<img src="${imgUrl}" alt="${alt}" class="rounded-lg max-w-full h-auto shadow-sm my-4" loading="lazy" />`;
    }
  );

  // Convert markdown links [text](url) to HTML <a>
  processed = processed.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    (_, text: string, href: string) => {
      return `<a href="${href}" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">${text}</a>`;
    }
  );

  // Handle iframe wrapping for responsive video
  processed = processed.replace(
    /<iframe([^>]*)><\/iframe>/g,
    '<div class="aspect-video rounded-lg overflow-hidden my-4"><iframe$1 class="w-full h-full border-0"></iframe></div>'
  );

  // Normalize line breaks
  processed = processed.replace(/<BR>/gi, "<br/>");
  processed = processed.replace(/\n/g, "<br/>");

  // Process relative image src - convert to full API URL
  processed = processed.replace(
    /src="(\/uploads\/[^"]+)"/g,
    `src="${API_BASE}$1"`
  );

  // Add centering class to all img tags
  processed = processed.replace(
    /<img/g,
    '<img style="display:block;margin-left:auto;margin-right:auto"'
  );

  return processed;
}

export function RichText({
  content,
  className = "",
}: {
  content: string;
  className?: string;
}) {
  if (!content) return null;

  return (
    <div
      className={`
        prose prose-sm sm:prose-base max-w-none
        prose-headings:font-bold prose-headings:text-slate-800
        prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg
        prose-p:text-slate-600 prose-p:leading-relaxed
        prose-a:text-primary prose-a:no-underline hover:prose-a:underline
        prose-img:rounded-lg prose-img:shadow-sm prose-img:my-0 prose-img:mx-auto
        prose-strong:text-slate-800
        prose-ul:list-disc prose-ol:list-decimal
        prose-li:text-slate-600 prose-li:marker:text-primary
        prose-blockquote:border-l-primary prose-blockquote:bg-slate-50 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-lg
        prose-table:border-collapse
        prose-th:bg-slate-100 prose-th:p-3 prose-th:text-left prose-th:font-semibold
        prose-td:p-3 prose-td:border-b prose-td:border-slate-100
        ${className}
      `.trim()}
      dangerouslySetInnerHTML={{ __html: processContent(content) }}
    />
  );
}
