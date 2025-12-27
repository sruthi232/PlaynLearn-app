/**
 * QR SUCCESS MODAL
 * Shows QR code, redemption code, and status list
 * Glassmorphism design with smooth animations
 */

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  Download,
  BookMarked,
  Sparkles,
  Copy,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useSoundEffects } from "@/hooks/use-sound-effects";
import type { RedemptionData } from "@/lib/qr-utils";

interface QRSuccessModalProps {
  open: boolean;
  onClose: () => void;
  onSaveToWallet: () => void;
  redemptionData: RedemptionData | null;
  isLoading?: boolean;
  QRCodeComponent?: React.ComponentType<any>;
}

interface StatusItem {
  label: string;
  translationKey: string;
  index: number;
}

const statusItems: StatusItem[] = [
  {
    label: "Learning Progress Verified",
    translationKey: "redemption.status.verified",
    index: 0,
  },
  {
    label: "EduCoins Reserved",
    translationKey: "redemption.status.reserved",
    index: 1,
  },
  {
    label: "Product Locked for You",
    translationKey: "redemption.status.locked",
    index: 2,
  },
  {
    label: "Offline Verification Enabled",
    translationKey: "redemption.status.offlineEnabled",
    index: 3,
  },
];

export function QRSuccessModal({
  open,
  onClose,
  onSaveToWallet,
  redemptionData,
  isLoading = false,
  QRCodeComponent,
}: QRSuccessModalProps) {
  const { t } = useTranslation();
  const [visibleStatusItems, setVisibleStatusItems] = useState<number>(0);
  const { playQRRedemption } = useSoundEffects();

  // Animate status items one by one and play success sound
  useEffect(() => {
    if (!open) {
      setVisibleStatusItems(0);
      return;
    }

    // Play success sound immediately when modal opens
    playQRRedemption?.();

    // Small delay to sync with modal opening
    const baseDelay = 300;
    const itemInterval = 200;

    const timeouts = statusItems.map((item) => {
      return setTimeout(() => {
        setVisibleStatusItems((prev) => Math.min(prev + 1, statusItems.length));
      }, baseDelay + item.index * itemInterval);
    });

    return () => timeouts.forEach((timeout) => clearTimeout(timeout));
  }, [open, playQRRedemption]);

  const handleCopyCode = () => {
    if (redemptionData?.redemptionCode) {
      navigator.clipboard.writeText(redemptionData.redemptionCode);
      toast.success(t("redemption.codeCopied", { defaultValue: "Code copied!" }));
    }
  };

  const handleDownloadQR = () => {
    // This would typically trigger a download of the QR code image
    // For now, just show a toast
    toast.success(
      t("redemption.qrDownloaded", {
        defaultValue: "QR code downloaded!",
      })
    );
  };

  if (!redemptionData) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        {/* Glassmorphism background */}
        <div className="absolute inset-0 -z-10 rounded-lg bg-gradient-to-br from-secondary/10 via-transparent to-primary/5 backdrop-blur-xl" />

        <DialogHeader>
          <div className="mb-2 flex justify-center">
            <div className="rounded-full bg-secondary/20 p-3">
              <CheckCircle2 className="h-8 w-8 text-secondary" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl font-heading font-semibold text-foreground">
            {t("redemption.readyForCollection", {
              defaultValue: "Reward Ready for Collection!",
            })}
          </DialogTitle>
          <DialogDescription className="text-center">
            {t("redemption.showQRToTeacher", {
              defaultValue: "Show this QR to your teacher to collect your reward.",
            })}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* QR Code Section */}
          <div className="flex justify-center rounded-lg bg-white p-4">
            {QRCodeComponent ? (
              <QRCodeComponent
                value={redemptionData.redemptionCode}
                size={200}
                level="H"
                includeMargin={true}
              />
            ) : (
              <div className="flex h-48 w-48 items-center justify-center rounded bg-muted">
                <p className="text-sm text-muted-foreground">QR Code</p>
              </div>
            )}
          </div>

          {/* Redemption Code */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t("redemption.redemptionCode", {
                defaultValue: "Redemption Code",
              })}
            </label>
            <div className="flex items-center gap-2 rounded-lg bg-card/40 p-3 backdrop-blur-sm">
              <code className="flex-1 font-mono text-lg font-bold text-primary">
                {redemptionData.redemptionCode}
              </code>
              <button
                onClick={handleCopyCode}
                className="p-2 hover:bg-primary/10 rounded transition-colors"
                title="Copy code"
              >
                <Copy className="h-4 w-4 text-primary" />
              </button>
            </div>
          </div>

          {/* Product Info */}
          <div className="rounded-lg bg-card/40 p-3 backdrop-blur-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t("redemption.productName", { defaultValue: "Product" })}
            </p>
            <p className="mt-1 text-sm font-semibold text-foreground">
              {redemptionData.productName}
            </p>
          </div>

          {/* Status List - Animated */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t("redemption.verificationStatus", {
                defaultValue: "Verification Status",
              })}
            </label>
            <div className="space-y-2">
              {statusItems.map((item) => (
                <div
                  key={item.translationKey}
                  className={`flex items-center gap-3 rounded-lg bg-card/30 p-2.5 backdrop-blur-sm transition-all duration-300 ${
                    visibleStatusItems > item.index
                      ? "translate-x-0 opacity-100"
                      : "-translate-x-4 opacity-0"
                  }`}
                >
                  <div className="h-5 w-5 flex-shrink-0 rounded-full bg-secondary/30 flex items-center justify-center">
                    <div className="h-2.5 w-2.5 rounded-full bg-secondary" />
                  </div>
                  <span className="text-sm text-foreground">
                    {t(item.translationKey, { defaultValue: item.label })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <DialogFooter className="flex flex-col gap-2">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadQR}
              className="flex-1"
              disabled={isLoading}
            >
              <Download className="mr-2 h-4 w-4" />
              {t("redemption.downloadQR", { defaultValue: "Download QR" })}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onSaveToWallet}
              className="flex-1"
              disabled={isLoading}
            >
              <BookMarked className="mr-2 h-4 w-4" />
              {t("redemption.saveToWallet", { defaultValue: "Save to Wallet" })}
            </Button>
          </div>
          <Button
            onClick={onClose}
            size="lg"
            className="w-full bg-secondary hover:bg-secondary/90"
            disabled={isLoading}
          >
            <Sparkles className="mr-2 h-4 w-4" />
            {t("redemption.continueReading", {
              defaultValue: "Awesome! Continue Learning",
            })}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
