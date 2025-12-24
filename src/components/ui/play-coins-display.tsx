import { cn } from "@/lib/utils";
import { EduCoin } from "./edu-coin";

interface PlayCoinsDisplayProps {
  amount: number;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
  animated?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: "text-sm px-2.5 py-1",
  md: "text-base px-3 py-1.5",
  lg: "text-xl px-4 py-2",
};

const coinSizeMap = {
  sm: "sm" as const,
  md: "md" as const,
  lg: "lg" as const,
};

export function PlayCoinsDisplay({
  amount,
  size = "md",
  showIcon = true,
  animated = true,
  className,
}: PlayCoinsDisplayProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 font-heading font-semibold rounded-full glass-card border border-secondary/50 backdrop-blur-xl sm:mx-0 mx-5",
        sizeClasses[size],
        className,
        "[@media(max-width:640px)]:justify-start"
      )}
      style={{
        backgroundImage: "linear-gradient(145deg, rgba(33, 27, 45, 0.8), rgba(23, 19, 32, 0.9))",
        boxShadow: "0 0 20px rgba(59, 168, 66, 0.25), 0 0 40px rgba(59, 168, 66, 0.15) inset",
        animation: "glow-pulse 3s ease-in-out infinite",
      }}
    >
      <style>{`
        @keyframes glow-pulse {
          0%, 100% {
            box-shadow: 0 0 20px rgba(59, 168, 66, 0.25), 0 0 40px rgba(59, 168, 66, 0.15) inset;
          }
          50% {
            box-shadow: 0 0 30px rgba(59, 168, 66, 0.4), 0 0 60px rgba(59, 168, 66, 0.25) inset;
          }
        }
      `}</style>
      {showIcon && (
        <div className="edu-coin-header">
          <EduCoin
            size={coinSizeMap[size]}
            animated={animated}
          />
        </div>
      )}
      <span className="text-secondary font-bold">
        {amount.toLocaleString()}
      </span>
      <span className="text-secondary">EduCoins</span>
    </div>
  );
}
