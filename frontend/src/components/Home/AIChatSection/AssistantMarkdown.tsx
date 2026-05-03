import ReactMarkdown, { type Components } from "react-markdown";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";

const remarkPlugins = [remarkGfm, remarkBreaks];

/**
 * Element-level classes restore standard markdown affordances (bullets, numbers,
 * heading sizes, code, etc.) that Tailwind's preflight resets. No bubble chrome here.
 */
const components: Components = {
  p: ({ className, ...props }) => (
    <p className={`my-2 first:mt-0 last:mb-0 leading-relaxed ${className ?? ""}`} {...props} />
  ),
  h1: ({ className, ...props }) => (
    <h1 className={`mt-4 mb-2 first:mt-0 text-lg md:text-xl font-bold ${className ?? ""}`} {...props} />
  ),
  h2: ({ className, ...props }) => (
    <h2 className={`mt-4 mb-2 first:mt-0 text-base md:text-lg font-bold ${className ?? ""}`} {...props} />
  ),
  h3: ({ className, ...props }) => (
    <h3 className={`mt-3 mb-1 first:mt-0 text-sm md:text-base font-semibold ${className ?? ""}`} {...props} />
  ),
  h4: ({ className, ...props }) => (
    <h4 className={`mt-3 mb-1 first:mt-0 text-sm font-semibold ${className ?? ""}`} {...props} />
  ),
  ul: ({ className, ...props }) => (
    <ul className={`my-2 ps-5 list-disc list-outside space-y-1 marker:text-purple-300 ${className ?? ""}`} {...props} />
  ),
  ol: ({ className, ...props }) => (
    <ol className={`my-2 ps-5 list-decimal list-outside space-y-1 marker:text-purple-300 ${className ?? ""}`} {...props} />
  ),
  li: ({ className, ...props }) => (
    <li className={`leading-relaxed [&>p]:my-0 ${className ?? ""}`} {...props} />
  ),
  blockquote: ({ className, ...props }) => (
    <blockquote
      className={`my-2 border-l-2 border-purple-300/60 ps-3 italic opacity-90 ${className ?? ""}`}
      {...props}
    />
  ),
  hr: ({ className, ...props }) => (
    <hr className={`my-3 border-white/10 ${className ?? ""}`} {...props} />
  ),
  a: ({ children, className, ...props }) => (
    <a
      {...props}
      className={`text-purple-300 underline underline-offset-2 hover:text-purple-200 wrap-break-word ${className ?? ""}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  ),
  strong: ({ className, ...props }) => (
    <strong className={`font-semibold ${className ?? ""}`} {...props} />
  ),
  em: ({ className, ...props }) => <em className={`italic ${className ?? ""}`} {...props} />,
  code: ({ className, children, ...props }) => {
    const isBlock = /\blanguage-/.test(className ?? "");
    if (isBlock) {
      return (
        <code className={`block font-mono text-[0.85em] leading-relaxed ${className ?? ""}`} {...props}>
          {children}
        </code>
      );
    }
    return (
      <code
        className={`font-mono text-[0.85em] px-1 py-0.5 rounded bg-white/10 ${className ?? ""}`}
        {...props}
      >
        {children}
      </code>
    );
  },
  pre: ({ className, ...props }) => (
    <pre
      className={`my-2 p-3 rounded-md bg-black/40 overflow-x-auto text-[0.85em] leading-relaxed ${className ?? ""}`}
      {...props}
    />
  ),
  table: ({ className, ...props }) => (
    <div className="my-2 overflow-x-auto">
      <table className={`w-full text-left border-collapse ${className ?? ""}`} {...props} />
    </div>
  ),
  thead: ({ className, ...props }) => (
    <thead className={`border-b border-white/15 ${className ?? ""}`} {...props} />
  ),
  th: ({ className, ...props }) => (
    <th className={`px-2 py-1 font-semibold ${className ?? ""}`} {...props} />
  ),
  td: ({ className, ...props }) => (
    <td className={`px-2 py-1 border-b border-white/5 ${className ?? ""}`} {...props} />
  ),
};

type Props = { children: string; className?: string };

/**
 * Renders assistant text as Markdown (GFM + single-newline breaks). Used for
 * both streaming and final assistant messages so they look identical.
 */
export default function AssistantMarkdown({ children, className }: Props) {
  return (
    <div className={className}>
      <ReactMarkdown remarkPlugins={remarkPlugins} components={components}>
        {children}
      </ReactMarkdown>
    </div>
  );
}
