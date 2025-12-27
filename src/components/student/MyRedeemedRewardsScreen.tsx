/**
 * MY REDEEMED REWARDS SCREEN
 * QR Wallet showing all saved redemptions with status badges
 * Acts as central hub for accessing saved QR codes
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
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        {/* Header */}
        <div className="sticky top-0 z-40 border-b border-border/30 bg-background/80 backdrop-blur-sm">
          <div className="flex items-center gap-4 px-4 py-4 sm:px-6">
            <button
              onClick={onBack}
              className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-card transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-foreground" />
            </button>
            <h1 className="flex-1 font-heading text-lg font-semibold text-foreground">
              {t("redemption.myRewards", { defaultValue: "My Rewards" })}
            </h1>
          </div>
        </div>

        {/* Empty State */}
        <div className="flex min-h-[calc(100vh-120px)] flex-col items-center justify-center gap-4 px-4 py-16">
          <div className="rounded-full bg-primary/10 p-4">
            <AlertCircle className="h-8 w-8 text-primary" />
          </div>
          <h2 className="font-heading text-lg font-semibold text-foreground">
            {t("redemption.noRewards", {
              defaultValue: "No Saved Rewards Yet",
            })}
          </h2>
          <p className="text-center text-sm text-muted-foreground max-w-sm">
            {t("redemption.startRedeemingProducts", {
              defaultValue:
                "Redeem products to see them here. Your QR codes will be saved for offline access.",
            })}
          </p>
          <Button
            onClick={onBack}
            className="mt-4 bg-secondary hover:bg-secondary/90"
          >
            {t("redemption.browseRewards", {
              defaultValue: "Browse Rewards",
            })}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-border/30 bg-background/80 backdrop-blur-sm">
        <div className="flex items-center gap-4 px-4 py-4 sm:px-6">
          <button
            onClick={onBack}
            className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-card transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <div className="flex-1">
            <h1 className="font-heading text-lg font-semibold text-foreground">
              {t("redemption.myRewards", { defaultValue: "My Rewards" })}
            </h1>
            <p className="text-xs text-muted-foreground">
              {redemptions.length} {t("redemption.saved", { defaultValue: "saved" })}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-8 px-4 py-8 sm:px-6 sm:py-10">
        {/* Ready for Pickup Section */}
        {groupedRedemptions.ready.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-400" />
              <h2 className="font-heading text-base font-semibold text-foreground">
                {t("redemption.readyForPickup", {
                  defaultValue: "Ready for Pickup",
                })}
              </h2>
              <Badge className="bg-yellow-400/20 text-yellow-400 border-yellow-400/30">
                {groupedRedemptions.ready.length}
              </Badge>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-400" />
              <h2 className="font-heading text-base font-semibold text-foreground">
                {t("redemption.collected", { defaultValue: "Collected" })}
              </h2>
              <Badge className="bg-green-400/20 text-green-400 border-green-400/30">
                {groupedRedemptions.collected.length}
              </Badge>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-muted-foreground" />
              <h2 className="font-heading text-base font-semibold text-foreground">
                {t("redemption.other", { defaultValue: "Other" })}
              </h2>
              <Badge className="bg-muted/30 text-muted-foreground border-border/30">
                {groupedRedemptions.other.length}
              </Badge>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
    <Card
      className={`overflow-hidden border-primary/20 backdrop-blur-sm flex flex-col transition-all ${
        disabled
          ? "bg-card/20 opacity-60"
          : "bg-card/40 hover:bg-card/50 hover:border-primary/40"
      }`}
    >
      {/* Status Badge */}
      <div className={`border-b border-border/30 px-4 py-3 flex items-center justify-between ${statusConfig.bgColor}`}>
        <div className="flex items-center gap-2">
          {statusConfig.icon}
          <span className={`text-xs font-semibold ${statusConfig.color}`}>
            {statusConfig.label}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 space-y-3 p-4">
        {/* Product Name */}
        <div>
          <h3 className="font-heading font-semibold text-foreground line-clamp-2 text-sm">
            {redemption.productName}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            <Calendar className="h-3 w-3 inline mr-1" />
            {new Date(redemption.timestamp).toLocaleDateString()}
          </p>
        </div>

        {/* Redemption Code */}
        <div className="rounded-lg bg-primary/5 p-2 border border-primary/20">
          <p className="text-xs text-muted-foreground mb-1">Code</p>
          <code className="block font-mono text-xs font-bold text-primary">
            {redemption.redemptionCode}
          </code>
        </div>

        {/* Expiry Info */}
        {daysUntilExpiry >= 0 && !disabled && (
          <div className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {daysUntilExpiry > 0
              ? `${daysUntilExpiry} days left`
              : "Expires today"}
          </div>
        )}
      </div>

      {/* Action Button */}
      <div className="border-t border-border/30 p-3">
        <Button
          onClick={() => onViewQR(redemption)}
          disabled={disabled}
          variant="outline"
          size="sm"
          className="w-full gap-1"
        >
          <Eye className="h-3.5 w-3.5" />
          {t("redemption.viewQR", { defaultValue: "View QR" })}
        </Button>
      </div>
    </Card>
  );
}
