import { cn } from "@/lib/utils";
import { EduCoin } from "./edu-coin";

interface WalletBalanceHeaderProps {
  balance: number;
  className?: string;
}

/**
 * WalletBalanceHeader
 * Single source of truth for top-right wallet coin display
 *
 * Specifications (locked):
 * - Mobile (max-width: 640px): coin width 20px
 * - Desktop: coin width 32px (md size)
 * - 1:1 aspect ratio maintained
 * - Consistent spacing and vertical alignment
 * - Never scales per page or screen size
 * - Only affects header wallet, not coins in cards/canvas/game UI
 */
export function WalletBalanceHeader({ balance, className }: WalletBalanceHeaderProps) {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        .wallet-balance-header {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          border-radius: 9999px;
          padding: 0.375rem 0.75rem;
          background-image: linear-gradient(145deg, rgba(33, 27, 45, 0.8), rgba(23, 19, 32, 0.9));
          border: 1px solid rgba(177, 162, 196, 0.5);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          box-shadow: 0 0 20px rgba(59, 168, 66, 0.25), 0 0 40px rgba(59, 168, 66, 0.15) inset;
          animation: wallet-glow-pulse 3s ease-in-out infinite;
        }

        @keyframes wallet-glow-pulse {
          0%, 100% {
            box-shadow: 0 0 20px rgba(59, 168, 66, 0.25), 0 0 40px rgba(59, 168, 66, 0.15) inset;
          }
          50% {
            box-shadow: 0 0 30px rgba(59, 168, 66, 0.4), 0 0 60px rgba(59, 168, 66, 0.25) inset;
          }
        }

        .wallet-coin-container {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .wallet-coin-container img {
          width: 32px;
          height: 32px;
          aspect-ratio: 1 / 1;
          object-fit: contain;
          display: block;
        }

        .wallet-amount {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          font-weight: 600;
          font-size: 0.875rem;
          letter-spacing: -0.2px;
          color: rgb(16, 183, 127);
        }

        @media (max-width: 640px) {
          .wallet-amount {
            font-family: "Fredoka, sans-serif";
            font-weight: 600;
          }
        }

        .wallet-label {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          font-weight: 500;
          font-size: 0.875rem;
          color: rgb(138, 148, 168);
        }

        @media (max-width: 640px) {
          .wallet-label {
            font-family: "Fredoka, sans-serif";
          }
        }

        /* Mobile: Reduce coin size to 20px */
        @media (max-width: 640px) {
          .wallet-coin-container img {
            width: 20px !important;
            height: 20px !important;
          }
        }
      `}</style>

      <div className={cn("wallet-balance-header", className)}>
        <div className="wallet-coin-container">
          <EduCoin size="md" animated={true} />
        </div>
        <span className="wallet-amount">
          {balance.toLocaleString()}
        </span>
        <span className="wallet-label">EduCoins</span>
      </div>
    </>
  );
}
