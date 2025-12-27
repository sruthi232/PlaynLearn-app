/**
 * PREMIUM SYNC RING LOADER
 * Multi-layer animated ring loader with gradient, glow, and success morph animation
 * 3 layers: outer ring (clockwise), inner ring (counter-clockwise with glow), center sync icon
 * Morphs into success checkmark when completed
 */

import { useEffect, useState } from "react";
import { Check } from "lucide-react";

interface PremiumSyncRingLoaderProps {
  isLoading: boolean;
  showSuccess?: boolean;
}

export function PremiumSyncRingLoader({
  isLoading,
  showSuccess = false,
}: PremiumSyncRingLoaderProps) {
  const [displaySuccess, setDisplaySuccess] = useState(false);

  useEffect(() => {
    if (showSuccess) {
      // Small delay before showing success to let the rings slow down
      const timer = setTimeout(() => {
        setDisplaySuccess(true);
      }, 200);
      return () => clearTimeout(timer);
    } else {
      setDisplaySuccess(false);
    }
  }, [showSuccess]);

  return (
    <div className="relative w-20 h-20">
      <style>{`
        @keyframes ring-rotate-cw {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes ring-rotate-ccw {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(-360deg);
          }
        }

        @keyframes sync-icon-rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes glow-pulse {
          0%, 100% {
            filter: drop-shadow(0 0 4px rgba(139, 92, 246, 0.4)) drop-shadow(0 0 12px rgba(34, 197, 94, 0.2));
          }
          50% {
            filter: drop-shadow(0 0 8px rgba(139, 92, 246, 0.6)) drop-shadow(0 0 20px rgba(34, 197, 94, 0.3));
          }
        }

        @keyframes rings-fade-out {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }

        @keyframes ring-slow-stop {
          to {
            transform: rotate(0deg);
          }
        }

        @keyframes checkmark-scale-in {
          0% {
            opacity: 0;
            transform: scale(0.9);
          }
          60% {
            opacity: 1;
            transform: scale(1.05);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes checkmark-glow-pulse {
          0%, 100% {
            filter: drop-shadow(0 0 4px rgba(34, 197, 94, 0.4));
          }
          50% {
            filter: drop-shadow(0 0 8px rgba(34, 197, 94, 0.6));
          }
        }

        .ring-outer {
          animation: ${!displaySuccess && isLoading ? "ring-rotate-cw 3s linear infinite" : "ring-slow-stop 0.6s ease-out forwards"};
          opacity: ${displaySuccess ? 0 : 1};
          transition: opacity 0.6s ease-out;
        }

        .ring-inner {
          animation: ${!displaySuccess && isLoading ? "ring-rotate-ccw 2.5s linear infinite, glow-pulse 2s ease-in-out infinite" : "ring-slow-stop 0.6s ease-out forwards"};
          opacity: ${displaySuccess ? 0 : 1};
          transition: opacity 0.6s ease-out;
        }

        .sync-icon {
          animation: ${!displaySuccess && isLoading ? "sync-icon-rotate 2s linear infinite" : "ring-slow-stop 0.6s ease-out forwards"};
        }

        .success-checkmark {
          animation: checkmark-scale-in 0.6s ease-out forwards, checkmark-glow-pulse 1.5s ease-in-out 0.6s;
        }

        @media (prefers-reduced-motion: reduce) {
          .ring-outer,
          .ring-inner,
          .sync-icon {
            animation: none;
          }

          .success-checkmark {
            animation: none;
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>

      {/* SVG Rings */}
      {!displaySuccess && (
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 80 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient
              id="ringGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" style={{ stopColor: "rgb(139, 92, 246)", stopOpacity: 1 }} />
              <stop offset="50%" style={{ stopColor: "rgb(34, 197, 94)", stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: "rgb(34, 197, 94)", stopOpacity: 1 }} />
            </linearGradient>
          </defs>

          {/* Outer Ring - Thin, Clockwise */}
          <g className="ring-outer" style={{ transformOrigin: "40px 40px" }}>
            <circle
              cx="40"
              cy="40"
              r="35"
              stroke="url(#ringGradient)"
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0.8"
            />
          </g>

          {/* Inner Ring - Thicker, Counter-clockwise with Glow */}
          <g className="ring-inner" style={{ transformOrigin: "40px 40px" }}>
            <circle
              cx="40"
              cy="40"
              r="28"
              stroke="url(#ringGradient)"
              strokeWidth="2.5"
              strokeLinecap="round"
              opacity="0.9"
            />
          </g>

          {/* Center Sync Icon */}
          <g
            className="sync-icon"
            style={{ transformOrigin: "40px 40px" }}
          >
            {/* Sync arrow paths - double arrow rotation icon */}
            <path
              d="M35 28 L25 38 L28 35"
              stroke="url(#ringGradient)"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M45 52 L55 42 L52 45"
              stroke="url(#ringGradient)"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Curved arrows */}
            <path
              d="M25 40 Q25 25 40 25 Q55 25 55 40"
              stroke="url(#ringGradient)"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M55 40 Q55 55 40 55 Q25 55 25 40"
              stroke="url(#ringGradient)"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
            />
          </g>
        </svg>
      )}

      {/* Success Checkmark */}
      {displaySuccess && (
        <div className="absolute inset-0 flex items-center justify-center success-checkmark">
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Checkmark circle background */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: "linear-gradient(135deg, rgb(34, 197, 94), rgb(34, 197, 94))",
                opacity: 0.15,
              }}
            />
            {/* Checkmark icon */}
            <Check
              className="w-10 h-10 text-green-500"
              strokeWidth={3}
              style={{
                filter: "drop-shadow(0 0 4px rgba(34, 197, 94, 0.6))",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
