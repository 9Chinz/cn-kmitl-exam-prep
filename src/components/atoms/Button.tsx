import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "icon" | "danger";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: "w-full py-3 bg-primary text-primary-foreground font-semibold rounded-xl text-sm hover:opacity-90 active:scale-[0.98] transition-all",
  secondary: "w-full py-3 bg-secondary text-secondary-foreground font-medium rounded-xl text-sm border border-border hover:bg-accent transition-all",
  ghost: "w-full py-3 text-sm text-muted-foreground hover:text-foreground transition-colors",
  icon: "w-8 h-8 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors flex items-center justify-center",
  danger: "w-full py-3 px-4 bg-red-500 text-white font-medium rounded-xl text-sm hover:opacity-90 active:scale-[0.98] transition-all",
};

export function Button({ variant = "primary", className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(variantStyles[variant], className)}
      {...props}
    />
  );
}
