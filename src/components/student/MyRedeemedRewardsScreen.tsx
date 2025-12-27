/**
 * MY REDEEMED REWARDS SCREEN
 * QR Wallet showing all saved redemptions with status badges
 * Modal overlay for accessing saved QR codes
 */

import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  Eye,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle2,
  Zap,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { RedemptionData } from "@/lib/qr-utils";

interface MyRedeemedRewardsScreenProps {
  redemptions: RedemptionData[];
  onBack: () => void;
  onViewQR: (redemption: RedemptionData) => void;
  QRCodeComponent?: React.ComponentType<any>;
}

interface StatusConfig {
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  label: string;
  timestamp?: string;
}

export function MyRedeemedRewardsScreen({
  redemptions,
  onBack,
  onViewQR,
  QRCodeComponent,
}: MyRedeemedRewardsScreenProps) {
  const { t } = useTranslation();
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const getStatusConfig = (
    status: RedemptionData["status"],
    expiryDate: number
  ): StatusConfig => {
    const isExpired = expiryDate < Date.now();

    if (isExpired) {
      return {
        icon: <AlertCircle className="h-4 w-4" />,
        color: "text-red-400",
        bgColor: "bg-red-400/10 border-red-400/30",
        label: t("redemption.status.expired", { defaultValue: "🔴 Expired" }),
      };
    }

    const configs = {
      pending: {
        icon: <Clock className="h-4 w-4" />,
        color: "text-yellow-400",
        bgColor: "bg-yellow-400/10 border-yellow-400/30",
        label: t("redemption.status.pending", {
          defaultValue: "🟡 Ready for Pickup",
        }),
      },
      verified: {
        icon: <Zap className="h-4 w-4" />,
        color: "text-blue-400",
        bgColor: "bg-blue-400/10 border-blue-400/30",
        label: t("redemption.status.verified", { defaultValue: "🔵 Verified" }),
      },
      collected: {
        icon: <CheckCircle2 className="h-4 w-4" />,
        color: "text-green-400",
        bgColor: "bg-green-400/10 border-green-400/30",
        label: t("redemption.status.collected", {
          defaultValue: "🟢 Collected",
        }),
      },
      rejected: {
        icon: <AlertCircle className="h-4 w-4" />,
        color: "text-red-500",
        bgColor: "bg-red-500/10 border-red-500/30",
        label: t("redemption.status.rejected", { defaultValue: "❌ Rejected" }),
      },
      expired: {
        icon: <AlertCircle className="h-4 w-4" />,
        color: "text-red-400",
        bgColor: "bg-red-400/10 border-red-400/30",
        label: t("redemption.status.expired", { defaultValue: "🔴 Expired" }),
      },
    };

    return configs[status] || configs.pending;
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getDaysUntilExpiry = (expiryDate: number) => {
    const daysLeft = Math.ceil((expiryDate - Date.now()) / (1000 * 60 * 60 * 24));
    return daysLeft;
  };

  // Group redemptions by status
  const groupedRedemptions = useMemo(() => {
    const groups = {
      ready: [] as RedemptionData[],
      collected: [] as RedemptionData[],
      other: [] as RedemptionData[],
    };

    redemptions.forEach((r) => {
      const isExpired = r.expiryDate < Date.now();
      if (r.status === "collected") {
        groups.collected.push(r);
      } else if ((r.status === "pending" || r.status === "verified") && !isExpired) {
        groups.ready.push(r);
      } else {
        groups.other.push(r);
      }
    });

    return groups;
  }, [redemptions]);

  if (redemptions.length === 0) {
    return (
      <div className="fixed inset-0 z-50 overflow-auto bg-black/40 backdrop-blur-sm flex items-center justify-center pointer-events-none p-4">
        {/* Modal Card Container */}
        <div className="relative w-full max-w-md rounded-3xl bg-gradient-to-br from-card/95 via-card/85 to-card/75 backdrop-blur-xl border-2 border-primary/20 shadow-2xl shadow-primary/50 pointer-events-auto animate-fade-in">
          {/* Header */}
          <div className="sticky top-0 z-40 border-b border-border/30 bg-background/40 backdrop-blur-xl rounded-t-3xl">
            <div className="flex items-center justify-between gap-4 px-4 py-4">
              <button
                onClick={onBack}
                className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-card transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-foreground" />
              </button>
              <h1 className="flex-1 text-center font-heading text-base font-semibold text-foreground whitespace-nowrap">
                {t("redemption.qrWallet", { defaultValue: "QR Wallet" })}
              </h1>
              <button
                onClick={onBack}
                className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-card transition-colors"
              >
                <X className="h-5 w-5 text-foreground" />
              </button>
            </div>
          </div>

          {/* Empty State */}
          <div className="flex flex-col items-center justify-center gap-4 px-6 py-12">
            <div className="rounded-full bg-primary/10 p-4">
              <AlertCircle className="h-8 w-8 text-primary" />
            </div>
            <h2 className="font-heading text-base font-semibold text-foreground text-center">
              {t("redemption.noRewards", {
                defaultValue: "No Saved Rewards Yet",
              })}
            </h2>
            <p className="text-center text-xs text-muted-foreground">
              {t("redemption.startRedeemingProducts", {
                defaultValue:
                  "Redeem products to save QR codes for offline access.",
              })}
            </p>
            <Button
              onClick={onBack}
              className="mt-4 bg-secondary hover:bg-secondary/90 text-sm"
            >
              {t("redemption.browseRewards", {
                defaultValue: "Browse Rewards",
              })}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black/40 backdrop-blur-sm flex items-center justify-center pointer-events-none p-4">
      {/* Modal Card Container */}
      <div className="relative w-full max-w-md max-h-[85vh] overflow-auto rounded-3xl bg-gradient-to-br from-card/95 via-card/85 to-card/75 backdrop-blur-xl border-2 border-primary/20 shadow-2xl shadow-primary/50 pointer-events-auto animate-fade-in">
        
        {/* Header */}
        <div className="sticky top-0 z-40 border-b border-border/30 bg-background/40 backdrop-blur-xl rounded-t-3xl">
          <div className="flex items-center justify-between gap-4 px-4 py-4">
            <button
              onClick={onBack}
              className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-card transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-foreground" />
            </button>
            <div className="flex-1 text-center">
              <h1 className="font-heading text-base font-semibold text-foreground">
                {t("redemption.qrWallet", { defaultValue: "QR Wallet" })}
              </h1>
              <p className="text-xs text-muted-foreground">
                {redemptions.length} {t("redemption.saved", { defaultValue: "saved" })}
              </p>
            </div>
            <button
              onClick={onBack}
              className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-card transition-colors"
            >
              <X className="h-5 w-5 text-foreground" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6 px-4 py-6">
          {/* Ready for Pickup Section */}
          {groupedRedemptions.ready.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-yellow-400" />
                <h2 className="font-heading text-sm font-semibold text-foreground">
                  {t("redemption.readyForPickup", {
                    defaultValue: "Ready",
                  })}
                </h2>
                <Badge className="bg-yellow-400/20 text-yellow-400 border-yellow-400/30 text-xs">
                  {groupedRedemptions.ready.length}
                </Badge>
              </div>
              <div className="space-y-2">
                {groupedRedemptions.ready.map((redemption) => (
                  <RedemptionCard
                    key={redemption.id}
                    redemption={redemption}
                    onViewQR={onViewQR}
                    statusConfig={getStatusConfig(
                      redemption.status,
                      redemption.expiryDate
                    )}
                    daysUntilExpiry={getDaysUntilExpiry(redemption.expiryDate)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Collected Section */}
          {groupedRedemptions.collected.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-400" />
                <h2 className="font-heading text-sm font-semibold text-foreground">
                  {t("redemption.collected", { defaultValue: "Collected" })}
                </h2>
                <Badge className="bg-green-400/20 text-green-400 border-green-400/30 text-xs">
                  {groupedRedemptions.collected.length}
                </Badge>
              </div>
              <div className="space-y-2">
                {groupedRedemptions.collected.map((redemption) => (
                  <RedemptionCard
                    key={redemption.id}
                    redemption={redemption}
                    onViewQR={onViewQR}
                    statusConfig={getStatusConfig(
                      redemption.status,
                      redemption.expiryDate
                    )}
                    daysUntilExpiry={getDaysUntilExpiry(redemption.expiryDate)}
                    disabled={true}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Other / Expired Section */}
          {groupedRedemptions.other.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
                <h2 className="font-heading text-sm font-semibold text-foreground">
                  {t("redemption.other", { defaultValue: "Other" })}
                </h2>
                <Badge className="bg-muted/30 text-muted-foreground border-border/30 text-xs">
                  {groupedRedemptions.other.length}
                </Badge>
              </div>
              <div className="space-y-2">
                {groupedRedemptions.other.map((redemption) => (
                  <RedemptionCard
                    key={redemption.id}
                    redemption={redemption}
                    onViewQR={onViewQR}
                    statusConfig={getStatusConfig(
                      redemption.status,
                      redemption.expiryDate
                    )}
                    daysUntilExpiry={getDaysUntilExpiry(redemption.expiryDate)}
                    disabled={redemption.expiryDate < Date.now()}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Individual Redemption Card Component
 */
function RedemptionCard({
  redemption,
  onViewQR,
  statusConfig,
  daysUntilExpiry,
  disabled = false,
}: {
  redemption: RedemptionData;
  onViewQR: (redemption: RedemptionData) => void;
  statusConfig: StatusConfig;
  daysUntilExpiry: number;
  disabled?: boolean;
}) {
  const { t } = useTranslation();

  return (
    <div
      onClick={() => !disabled && onViewQR(redemption)}
      className={`w-full text-left rounded-lg border-2 overflow-hidden transition-all ${
        disabled
          ? "bg-card/20 opacity-50 border-border/30 cursor-not-allowed"
          : "bg-card/40 border-primary/20 hover:bg-card/50 hover:border-primary/40 cursor-pointer"
      }`}
    >
      {/* Status Badge */}
      <div className={`border-b border-border/30 px-3 py-2 flex items-center gap-2 ${statusConfig.bgColor}`}>
        {statusConfig.icon}
        <span className={`text-xs font-semibold ${statusConfig.color}`}>
          {statusConfig.label}
        </span>
      </div>

      {/* Content */}
      <div className="space-y-2 p-3">
        {/* Product Name */}
        <div>
          <h3 className="font-heading font-semibold text-foreground line-clamp-2 text-xs">
            {redemption.productName}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            <Calendar className="h-3 w-3 inline mr-1" />
            {new Date(redemption.timestamp).toLocaleDateString()}
          </p>
        </div>

        {/* Redemption Code */}
        <div className="rounded-lg bg-primary/5 p-2 border border-primary/20">
          <code className="block font-mono text-xs font-bold text-primary">
            {redemption.redemptionCode}
          </code>
        </div>

        {/* Expiry Info & Action */}
        <div className="flex items-center justify-between gap-2 pt-1">
          {daysUntilExpiry >= 0 && !disabled && (
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {daysUntilExpiry > 0
                ? `${daysUntilExpiry}d left`
                : "Today"}
            </div>
          )}
          {!disabled && (
            <div className="text-xs font-semibold text-primary hover:text-primary/80 flex items-center gap-1 transition-colors">
              <Eye className="h-3 w-3" />
              View
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
