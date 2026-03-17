import { cn } from "@/lib/utils";

interface BadgeProps {
  className?: string;
  children: React.ReactNode;
}

export function Badge({ className, children }: BadgeProps) {
  return (
    <span className={cn("text-white text-xs font-bold px-2 py-0.5 rounded", className)}>
      {children}
    </span>
  );
}
