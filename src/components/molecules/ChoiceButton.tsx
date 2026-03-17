import { cn } from "@/lib/utils";

type ChoiceState = "default" | "correct" | "wrong" | "dimmed";

interface ChoiceButtonProps {
  label: string;
  text: string;
  state: ChoiceState;
  icon?: string | null;
  disabled?: boolean;
  onClick?: () => void;
}

const stateStyles: Record<ChoiceState, string> = {
  default: "bg-card border-border hover:border-primary/50 hover:bg-primary/5 active:scale-[0.99]",
  correct: "bg-green-500/10 border-green-500 text-green-700 dark:text-green-400",
  wrong: "bg-red-500/10 border-red-500 text-red-700 dark:text-red-400",
  dimmed: "bg-card border-border opacity-50",
};

export function ChoiceButton({ label, text, state, icon, disabled, onClick }: ChoiceButtonProps) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={cn("w-full text-left p-3.5 rounded-xl border-2 transition-all flex items-start gap-3", stateStyles[state])}
    >
      <span className="shrink-0 w-7 h-7 rounded-full bg-muted flex items-center justify-center text-xs font-bold">
        {icon || label}
      </span>
      <span className="text-sm leading-relaxed pt-0.5">{text}</span>
    </button>
  );
}
