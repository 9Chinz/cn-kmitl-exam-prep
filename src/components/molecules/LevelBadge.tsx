import { Badge } from "@/components/atoms/Badge";
import { levelLabels, levelColors } from "@/constants/levels";

interface LevelBadgeProps {
  level: string;
  size?: "sm" | "md";
}

export function LevelBadge({ level, size = "sm" }: LevelBadgeProps) {
  const color = levelColors[level] || "bg-gray-500";
  const label = levelLabels[level] || level;
  const sizeClass = size === "md" ? "px-3 py-1" : "px-2 py-0.5";

  return (
    <Badge className={`${color} ${sizeClass}`}>
      {label}
    </Badge>
  );
}
