/**
 * QR GENERATION LOADING COMPONENT
 * Shows confident, trustworthy 5-second loading animation
 * Background blur + pulse glow + sequential progress messages
 */

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { RotateCcw } from "lucide-react";

interface QRGenerationLoadingProps {
  isOpen: boolean;
}

const loadingMessages = [
  "redemption.loading.step1",
  "redemption.loading.step2",
  "redemption.loading.step3",
];

const messageDefaults = {
  "redemption.loading.step1": "Generating secure redemption code...",
  "redemption.loading.step2": "Preparing offline QR...",
  "redemption.loading.step3": "Encrypting verification data...",
};

export function QRGenerationLoading({ isOpen }: QRGenerationLoadingProps) {
  const { t } = useTranslation();
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  // Change message every ~1.5 seconds (total 4.5 seconds for 3 messages)
  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => {
        if (prev >= loadingMessages.length - 1) {
          return prev; // Keep last message
        }
        return prev + 1;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Background blur and overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Content card */}
      <style>{`
        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(139, 92, 246, 0.3), 
                        0 0 40px rgba(139, 92, 246, 0.1);
          }
          50% {
            box-shadow: 0 0 30px rgba(139, 92, 246, 0.5), 
                        0 0 60px rgba(139, 92, 246, 0.2);
          }
        }

        @keyframes rotate-sync {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .qr-loading-card {
          animation: pulse-glow 2s ease-in-out infinite;
        }

        .sync-icon {
          animation: rotate-sync 2s linear infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .qr-loading-card {
            animation: none;
            box-shadow: 0 0 20px rgba(139, 92, 246, 0.3);
          }
          .sync-icon {
            animation: none;
          }
        }
      `}</style>

      <div className="relative z-10 space-y-6 rounded-2xl border border-primary/30 bg-gradient-to-br from-card/80 via-card/60 to-card/40 p-8 backdrop-blur-xl qr-loading-card sm:w-full sm:max-w-sm">
        {/* Sync Icon */}
        <div className="flex justify-center">
          <div className="rounded-full bg-primary/10 p-4">
            <RotateCcw className="h-12 w-12 text-primary sync-icon" />
          </div>
        </div>

        {/* Loading Text */}
        <div className="space-y-3 text-center">
          <h2 className="text-xl font-heading font-semibold text-foreground">
            {t("redemption.generatingQR", {
              defaultValue: "Preparing Your Reward",
            })}
          </h2>

          {/* Progress message - smooth transition */}
          <div className="h-6">
            <p
              key={currentMessageIndex}
              className="text-sm text-muted-foreground animate-fade-in"
            >
              {t(
                loadingMessages[currentMessageIndex],
                messageDefaults[loadingMessages[currentMessageIndex] as keyof typeof messageDefaults]
              )}
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1 w-full overflow-hidden rounded-full bg-border">
          <div
            className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300 ease-out"
            style={{
              width: `${((currentMessageIndex + 1) / loadingMessages.length) * 100}%`,
            }}
          />
        </div>

        {/* Loading dots */}
        <div className="flex justify-center gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-2 w-2 rounded-full bg-primary/40 transition-all"
              style={{
                animation: `pulse 1.5s ease-in-out ${i * 0.3}s infinite`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Add fade-in animation */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 0.4;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
