import { cn } from "@/lib/utils";

interface CodeBlockProps {
  code: string;
  className?: string;
}

export function CodeBlock({ code, className }: CodeBlockProps) {
  return (
    <pre
      className={cn(
        "overflow-x-auto rounded-xl bg-[#1e1e2e] p-4 text-sm leading-relaxed",
        className,
      )}
    >
      <code className="font-mono text-[#cdd6f4] whitespace-pre">{code}</code>
    </pre>
  );
}
