/**
 * REWARD VERIFICATION CARD
 * Glassmorphism card showing reward details during QR verification
 * Displays: Student name, product image, EduCoins, status checklist
 */

import { Card } from "@/components/ui/card";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

interface RewardVerificationCardProps {
  studentName: string;
  productName: string;
  productImage?: string;
  eduCoinsUsed: number;
  redemptionCode: string;
  isExpired: boolean;
  showAnimation?: boolean;
}

export function RewardVerificationCard({
  studentName,
  productName,
  productImage,
  eduCoinsUsed,
  redemptionCode,
  isExpired,
  showAnimation = false,
}: RewardVerificationCardProps) {
  const { t } = useTranslation();

  const statusItems = [
    {
      id: "learning",
      label: t("teacher.learningProgressVerified", {
        defaultValue: "Learning Progress Verified",
      }),
      verified: true,
    },
    {
      id: "coins",
      label: t("teacher.eduCoinsReserved", {
        defaultValue: "EduCoins Reserved",
      }),
      verified: true,
    },
    {
      id: "product",
      label: t("teacher.productLocked", { defaultValue: "Product Locked" }),
      verified: true,
    },
    {
      id: "qr",
      label: t("teacher.offlineQRValid", { defaultValue: "Offline QR Valid" }),
      verified: !isExpired,
    },
  ];

  return (
    <div className="space-y-4">
      {/* Product Card */}
      {productImage && (
        <Card className="border-border/50 bg-card/40 overflow-hidden backdrop-blur-sm">
          <div className="relative h-40 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center overflow-hidden">
            <img
              src={productImage}
              alt={productName}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              {t("teacher.productReward", { defaultValue: "Reward Product" })}
            </p>
            <h3 className="font-heading text-lg font-bold text-foreground mb-2">
              {productName}
            </h3>
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center h-6 w-6 rounded-full bg-accent/20">
                <span className="font-mono text-xs font-bold text-accent">
                  {eduCoinsUsed}
                </span>
              </div>
              <span className="text-sm text-muted-foreground">EduCoins</span>
            </div>
          </div>
        </Card>
      )}

      {/* Student Info */}
      <Card className="border-border/50 bg-card/40 p-4 backdrop-blur-sm">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
          {t("teacher.studentName", { defaultValue: "Student" })}
        </p>
        <p className="font-heading text-lg font-bold text-foreground">
          {studentName}
        </p>
      </Card>

      {/* Redemption Code */}
      <Card className="border-primary/30 bg-card/40 p-4 backdrop-blur-sm">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
          {t("teacher.redemptionCode", { defaultValue: "Redemption Code" })}
        </p>
        <code className="font-mono text-sm font-bold text-primary break-all">
          {redemptionCode}
        </code>
      </Card>

      {/* Status Checklist */}
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-1">
          {t("teacher.verificationStatus", { defaultValue: "Verification Status" })}
        </p>
        <div className="space-y-2">
          {statusItems.map((item, index) => (
            <div
              key={item.id}
              className={`flex items-center gap-3 rounded-lg p-3 border transition-all ${
                item.verified
                  ? "border-secondary/30 bg-secondary/5"
                  : "border-destructive/30 bg-destructive/5"
              } ${showAnimation ? "animate-slide-in" : ""}`}
              style={showAnimation ? { animationDelay: `${index * 50}ms` } : {}}
            >
              {item.verified ? (
                <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0" />
              ) : (
                <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />
              )}
              <span
                className={`text-sm font-medium ${
                  item.verified
                    ? "text-secondary"
                    : "text-destructive"
                }`}
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Expiry Warning */}
      {isExpired && (
        <div className="rounded-lg border-2 border-destructive/50 bg-destructive/5 p-4 flex gap-3">
          <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-destructive text-sm mb-1">
              {t("teacher.qrExpiredTitle", { defaultValue: "QR Code Expired" })}
            </p>
            <p className="text-xs text-muted-foreground">
              {t("teacher.qrExpiredMessage", {
                defaultValue:
                  "This QR code is no longer valid. Student must generate a new one.",
              })}
            </p>
          </div>
        </div>
      )}

      {/* CSS for animations */}
      <style>{`
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-slide-in {
          animation: slide-in 0.3s ease-out forwards;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-slide-in {
            animation: none;
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
