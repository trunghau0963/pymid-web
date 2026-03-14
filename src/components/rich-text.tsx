import { renderRichTextHtml } from "@/lib/rich-text";

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
        rich-text max-w-none text-[15px] sm:text-base
        ${className}
      `.trim()}
      dangerouslySetInnerHTML={{ __html: renderRichTextHtml(content) }}
    />
  );
}
