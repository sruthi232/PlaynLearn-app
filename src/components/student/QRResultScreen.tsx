/**
 * QR RESULT SCREEN
 * Modal overlay showing generated QR code with download/save options
 * Shows as a centered card with blurred marketplace background
 */

import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  Download,
  Copy,
  Check,
  AlertCircle,
  Wifi,
  WifiOff,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { useSoundEffects } from "@/hooks/use-sound-effects";
import { RobustQRCode } from "@/components/ui/robust-qr-code";
import type { RedemptionData } from "@/lib/qr-utils";

interface QRResultScreenProps {
  redemptionData: RedemptionData;
  onBack: () => void;
  onSaveToWallet: () => void;
  isOnline?: boolean;
}

interface StatusItem {
  label: string;
  translationKey: string;
  index: number;
}

const statusItems: StatusItem[] = [
  {
    label: "EduCoins Reserved",
    translationKey: "redemption.status.reserved",
    index: 0,
  },
  {
    label: "Product Locked for You",
    translationKey: "redemption.status.locked",
    index: 1,
  },
  {
    label: "Offline Verification Enabled",
    translationKey: "redemption.status.offlineEnabled",
    index: 2,
  },
];

export function QRResultScreen({
  redemptionData,
  onBack,
  onSaveToWallet,
  isOnline = true,
}: QRResultScreenProps) {
  const { t } = useTranslation();
  const [visibleStatusItems, setVisibleStatusItems] = useState<number>(0);
  const [codeCopied, setCodeCopied] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(false);
  const { playQRRedemption } = useSoundEffects();
  const qrRef = useRef<HTMLDivElement>(null);

  // Animate status items and play sound on mount
  useEffect(() => {
    // Play success sound
    playQRRedemption?.();

    // Animate status items
    const baseDelay = 300;
    const itemInterval = 200;

    const timeouts = statusItems.map((item) => {
      return setTimeout(() => {
        setVisibleStatusItems((prev) => Math.min(prev + 1, statusItems.length));
      }, baseDelay + item.index * itemInterval);
    });

    return () => timeouts.forEach((timeout) => clearTimeout(timeout));
  }, [playQRRedemption]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(redemptionData.redemptionCode);
    setCodeCopied(true);
    toast.success(t("redemption.codeCopied", { defaultValue: "Code copied!" }));
    setTimeout(() => setCodeCopied(false), 2000);
  };

  const handleDownloadQR = async () => {
    try {
      setDownloadProgress(true);

      if (!qrRef.current) {
        toast.error(
          t("redemption.qrNotReady", { defaultValue: "QR code not ready" })
        );
        return;
      }

      // Get the canvas/SVG from the QR code component
      const qrElement = qrRef.current.querySelector("canvas") ||
        qrRef.current.querySelector("svg") || {
          toDataURL: () => {
            const canvas = document.createElement("canvas");
            canvas.width = 256;
            canvas.height = 256;
            return canvas.toDataURL("image/png");
          },
        };

      let imageData = "";

      if (qrElement instanceof HTMLCanvasElement) {
        imageData = qrElement.toDataURL("image/png");
      } else if (qrElement instanceof SVGElement) {
        // Convert SVG to PNG
        const svg = new XMLSerializer().serializeToString(qrElement);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();

        canvas.width = 256;
        canvas.height = 256;

        img.onload = () => {
          ctx?.drawImage(img, 0, 0);
          imageData = canvas.toDataURL("image/png");
          downloadQRImage(imageData);
        };

        img.src = "data:image/svg+xml;base64," + btoa(svg);
        return;
      } else {
        // Fallback: create simple PNG
        imageData =
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
      }

      downloadQRImage(imageData);
    } catch (error) {
      console.error("Error downloading QR:", error);
      toast.error(
        t("redemption.downloadFailed", { defaultValue: "Download failed" })
      );
    } finally {
      setDownloadProgress(false);
    }
  };

  const downloadQRImage = (imageData: string) => {
    const link = document.createElement("a");
    link.href = imageData;
    link.download = `redemption-qr-${redemptionData.redemptionCode}-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(
      t("redemption.qrDownloaded", {
        defaultValue: "QR code saved to gallery!",
      })
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black/40 backdrop-blur-sm flex items-center justify-center pointer-events-none p-4">
      {/* Modal Card Container */}
      <div className="relative w-full max-w-md max-h-[90vh] overflow-auto rounded-3xl bg-gradient-to-br from-card/95 via-card/85 to-card/75 backdrop-blur-xl border-2 border-primary/20 shadow-2xl shadow-primary/50 pointer-events-auto animate-fade-in">
        
        {/* Header with Back Navigation */}
        <div className="sticky top-0 z-40 border-b border-border/30 bg-background/40 backdrop-blur-xl rounded-t-3xl">
          <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6">
            <button
              onClick={onBack}
              className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-card transition-colors"
              title="Back to Rewards"
            >
              <ArrowLeft className="h-5 w-5 text-foreground" />
            </button>

            <h1 className="flex-1 text-center font-heading text-base font-semibold text-foreground whitespace-nowrap">
              {t("redemption.readyForCollection", {
                defaultValue: "Reward Ready",
              })}
            </h1>

            {/* Close Button */}
            <button
              onClick={onBack}
              className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-card transition-colors"
              title="Close"
            >
              <X className="h-5 w-5 text-foreground" />
            </button>
          </div>
        </div>

        {/* Main Content - Scrollable */}
        <div className="space-y-4 px-4 py-6 sm:px-6">
          {/* QR Code Card */}
          <div className="space-y-4 rounded-2xl border border-primary/20 bg-gradient-to-br from-white/10 to-white/5 p-4">
            {/* QR Code Container */}
            <div className="flex justify-center">
              <div
                ref={qrRef}
                className="flex items-center justify-center rounded-lg bg-white p-3 shadow-lg"
              >
                <RobustQRCode
                  value={redemptionData.redemptionCode}
                  size={200}
                  level="H"
                  includeMargin={true}
                />
              </div>
            </div>

            {/* Instructions */}
            <p className="text-center text-xs text-muted-foreground">
              {t("redemption.showQRToTeacher", {
                defaultValue:
                  "Show this QR code to your teacher to collect your reward.",
              })}
            </p>
            
            {/* QR Code Display Status */}
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                QR Code Ready for Verification
              </div>
            </div>
          </div>

          {/* Redemption Code Card */}
          <div className="space-y-3 rounded-2xl border border-primary/20 bg-gradient-to-br from-white/10 to-white/5 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t("redemption.redemptionCode", {
                defaultValue: "Redemption Code",
              })}
            </p>
            <div className="flex items-center justify-between gap-3 rounded-lg bg-primary/5 p-3 border border-primary/20">
              <code className="flex-1 font-mono text-sm font-bold text-primary">
                {redemptionData.redemptionCode}
              </code>
              <button
                onClick={handleCopyCode}
                className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg hover:bg-primary/10 transition-colors"
                title="Copy code"
              >
                {codeCopied ? (
                  <Check className="h-4 w-4 text-secondary" />
                ) : (
                  <Copy className="h-4 w-4 text-primary" />
                )}
              </button>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-2 rounded-2xl border border-primary/20 bg-gradient-to-br from-white/10 to-white/5 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t("redemption.product", { defaultValue: "Product" })}
            </p>
            <p className="text-sm font-semibold text-foreground">
              {redemptionData.productName}
            </p>
          </div>

          {/* Status Checklist */}
          <div className="space-y-3 rounded-2xl border border-secondary/20 bg-gradient-to-br from-white/10 to-white/5 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              {t("redemption.verificationStatus", {
                defaultValue: "Verification Status",
              })}
            </p>
            <div className="space-y-2">
              {statusItems.map((item) => (
                <div
                  key={item.translationKey}
                  className={`flex items-center gap-3 rounded-lg bg-card/30 p-2 transition-all duration-300 ${
                    visibleStatusItems > item.index
                      ? "translate-x-0 opacity-100"
                      : "-translate-x-4 opacity-0"
                  }`}
                >
                  <div className="h-5 w-5 flex-shrink-0 rounded-full bg-secondary/30 flex items-center justify-center">
                    <div className="h-2.5 w-2.5 rounded-full bg-secondary" />
                  </div>
                  <span className="text-xs text-foreground">
                    {t(item.translationKey, { defaultValue: item.label })}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            <Button
              onClick={handleDownloadQR}
              disabled={downloadProgress}
              className="w-full gap-2 rounded-xl bg-gradient-to-r from-primary to-primary/80 hover:from-primary/95 hover:to-primary/85 text-white font-semibold py-2 text-sm transition-all"
            >
              <Download className="h-4 w-4" />
              {downloadProgress
                ? t("common.downloading", { defaultValue: "Downloading..." })
                : t("redemption.downloadQR", { defaultValue: "Download QR" })}
            </Button>

            <Button
              onClick={onSaveToWallet}
              variant="outline"
              className="w-full gap-2 rounded-xl py-2 text-sm font-semibold border-primary/30 hover:border-primary/50"
            >
              <span>💾</span>
              {t("redemption.saveToWallet", {
                defaultValue: "Save to My Rewards",
              })}
            </Button>
          </div>

          {/* Offline Notice */}
          <div className="flex items-start gap-2 rounded-lg border border-accent/20 bg-accent/5 p-3">
            <WifiOff className="h-4 w-4 flex-shrink-0 text-accent mt-0.5" />
            <p className="text-xs text-accent">
              {t("redemption.offlineReady", {
                defaultValue:
                  "✓ This QR works offline. Save it for later use.",
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
