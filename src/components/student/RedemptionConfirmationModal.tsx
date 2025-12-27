/**
 * REDEMPTION CONFIRMATION MODAL
 * Initial step when student clicks "Redeem" on a product
 * Shows glassmorphism design with product details and balance check
 * Handles QR generation internally with premium animation
 */

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { createRedemptionData } from "@/lib/qr-utils";
import { QRGenerationAnimated } from "./QRGenerationAnimated";

interface Product {
  id: string;
  name: string;
  educoinsCost: number;
  image?: string;
  description?: string;
}

interface RedemptionConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  product: Product;
  currentBalance: number;
  isLoading?: boolean;
  onGenerateQR?: (redemptionData: any) => void;
}

export function RedemptionConfirmationModal({
  open,
  onClose,
  onConfirm,
  product,
  currentBalance,
  isLoading = false,
  onGenerateQR,
}: RedemptionConfirmationModalProps) {
  const { t } = useTranslation();
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAnimatedLoading, setShowAnimatedLoading] = useState(false);
  const canAfford = currentBalance >= product.educoinsCost;

  // Handle Generate QR click - shows animated loading
  const handleGenerateQRClick = async () => {
    setIsGenerating(true);
    setShowAnimatedLoading(true);
  };

  // Handle animated loading completion
  const handleAnimationComplete = () => {
    // Create redemption data after animation completes
    const redemptionData = createRedemptionData(
      "student_" + Date.now(), // Placeholder student ID
      product.id,
      product.name,
      product.educoinsCost
    );

    // Notify parent about the generated redemption
    onGenerateQR?.(redemptionData);

    // Close this modal and animation
    setShowAnimatedLoading(false);
    setIsGenerating(false);
    onClose();
  };

  return (
    <>
      {/* Animated QR Generation Loading */}
      <QRGenerationAnimated
        isOpen={showAnimatedLoading}
        onComplete={handleAnimationComplete}
      />

      {/* Confirmation Modal */}
      <Dialog open={open && !showAnimatedLoading} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          {/* Glassmorphism background effect */}
          <div className="absolute inset-0 -z-10 rounded-lg bg-gradient-to-br from-primary/10 via-transparent to-accent/5 backdrop-blur-xl" />

          <DialogHeader>
            <DialogTitle className="text-center text-xl font-heading">
              {t("redemption.confirmTitle", { defaultValue: "Confirm Redemption" })}
            </DialogTitle>
            <DialogDescription className="text-center">
              {t(
                "redemption.confirmSubtitle",
                {
                  defaultValue: "This reward will be redeemed using offline verification.",
                }
              )}
            </DialogDescription>
          </DialogHeader>

          {/* Product Card */}
          <div className="space-y-4">
            {product.image && (
              <div className="flex justify-center">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-32 w-32 rounded-lg object-cover shadow-lg"
                />
              </div>
            )}

            {/* Product Details */}
            <div className="space-y-3 rounded-lg bg-card/40 p-4 backdrop-blur-sm">
              <div>
                <p className="text-sm font-semibold text-muted-foreground">
                  {t("redemption.productName", { defaultValue: "Product" })}
                </p>
                <p className="text-lg font-heading font-semibold text-foreground">
                  {product.name}
                </p>
              </div>

              {product.description && (
                <div>
                  <p className="text-sm text-muted-foreground">{product.description}</p>
                </div>
              )}

              {/* Cost and Balance Info */}
              <div className="space-y-2 border-t border-border/30 pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {t("redemption.coinsRequired", {
                      defaultValue: "EduCoins Required:",
                    })}
                  </span>
                  <span className="font-heading text-lg font-semibold text-secondary">
                    {product.educoinsCost}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {t("redemption.currentBalance", {
                      defaultValue: "Your Balance:",
                    })}
                  </span>
                  <span
                    className={`font-heading text-lg font-semibold ${
                      canAfford ? "text-secondary" : "text-destructive"
                    }`}
                  >
                    {currentBalance}
                  </span>
                </div>
              </div>
            </div>

            {/* Warning if insufficient balance */}
            {!canAfford && (
              <div className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-3">
                <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-destructive" />
                <div className="text-sm text-destructive">
                  <p className="font-semibold">
                    {t("redemption.insufficientBalance", {
                      defaultValue: "Insufficient Balance",
                    })}
                  </p>
                  <p className="mt-1">
                    {t("redemption.needMoreCoins", {
                      defaultValue: `You need ${product.educoinsCost - currentBalance} more EduCoins`,
                      needed: product.educoinsCost - currentBalance,
                    })}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Actions - Stacked layout for clarity */}
          <DialogFooter className="flex flex-col gap-3 sm:gap-3">
            <Button
              onClick={handleGenerateQRClick}
              disabled={!canAfford || isGenerating}
              className="w-full bg-gradient-to-r from-secondary to-secondary/90 hover:from-secondary/95 hover:to-secondary/85 text-white font-semibold rounded-xl py-6 text-base transition-all disabled:opacity-50"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {t("common.generating", { defaultValue: "Generating..." })}
                </>
              ) : (
                t("redemption.generateQrCode", {
                  defaultValue: "Generate QR Code",
                })
              )}
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isGenerating}
              className="w-full rounded-xl py-2.5"
            >
              {t("common.cancel", { defaultValue: "Cancel" })}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
