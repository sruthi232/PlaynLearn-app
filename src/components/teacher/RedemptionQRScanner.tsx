/**
 * TEACHER DASHBOARD - REDEMPTION QR SCANNER
 * Allows teachers to scan and verify student reward redemptions
 * Simple offline-capable interface for village settings
 */

import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Camera,
  CheckCircle2,
  AlertCircle,
  XCircle,
  QrCode,
  Copy,
} from "lucide-react";
import { toast } from "sonner";
import { validateRedemptionQR } from "@/lib/qr-utils";
import type { RedemptionData } from "@/lib/qr-utils";

interface ScannedRedemption {
  id: string;
  studentId: string;
  productId: string;
  redemptionCode: string;
  token: string;
  timestamp: number;
  expiry: number;
}

interface RedemptionQRScannerProps {
  open: boolean;
  onClose: () => void;
  onVerify?: (redemptionCode: string, approved: boolean, reason?: string) => Promise<void>;
}

type ScannerStep = "scan" | "review" | "result";
type ActionResult = "verified" | "rejected" | null;

export function RedemptionQRScanner({
  open,
  onClose,
  onVerify,
}: RedemptionQRScannerProps) {
  const { t } = useTranslation();
  const [step, setStep] = useState<ScannerStep>("scan");
  const [scannedData, setScannedData] = useState<ScannedRedemption | null>(null);
  const [actionResult, setActionResult] = useState<ActionResult>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleScan = (qrString: string) => {
    const validation = validateRedemptionQR(qrString);

    if (!validation.valid) {
      toast.error(
        validation.error ||
          t("teacher.invalidQRCode", { defaultValue: "Invalid QR code" })
      );
      return;
    }

    // Extract scanned data
    const data = validation.data as ScannedRedemption;
    setScannedData(data);
    setStep("review");
  };

  const handleVerify = async (approved: boolean) => {
    if (!scannedData) return;

    setIsProcessing(true);

    try {
      // Call parent verification handler if provided
      await onVerify?.(
        scannedData.redemptionCode,
        approved,
        approved ? undefined : rejectionReason
      );

      setActionResult(approved ? "verified" : "rejected");
      setStep("result");
    } catch (error) {
      toast.error(
        t("teacher.verificationFailed", {
          defaultValue: "Verification failed. Please try again.",
        })
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setStep("scan");
    setScannedData(null);
    setActionResult(null);
    setRejectionReason("");
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const handleManualInput = (code: string) => {
    // Allow manual entry of redemption code for offline scenarios
    handleScan(code);
  };

  const handleCopyCode = () => {
    if (scannedData?.redemptionCode) {
      navigator.clipboard.writeText(scannedData.redemptionCode);
      toast.success(
        t("teacher.codeCopied", { defaultValue: "Code copied!" })
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {step === "scan" && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <QrCode className="h-5 w-5 text-primary" />
                {t("teacher.scanRewardQR", {
                  defaultValue: "Scan Student Reward QR",
                })}
              </DialogTitle>
              <DialogDescription>
                {t("teacher.scanInstructions", {
                  defaultValue:
                    "Scan the student's QR code or enter the redemption code manually",
                })}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Scan Button (In real app, would open camera) */}
              <Button
                variant="outline"
                className="w-full gap-2 py-6"
                onClick={() => {
                  // In production, would use device camera API
                  // For now, show demo functionality
                  toast.info(
                    t("teacher.cameraNotAvailable", {
                      defaultValue:
                        "Camera scanning would be available on mobile",
                    })
                  );
                }}
              >
                <Camera className="h-5 w-5" />
                {t("teacher.openCamera", { defaultValue: "Open Camera" })}
              </Button>

              {/* Manual Input Fallback */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-card px-2 text-muted-foreground">
                    {t("common.or", { defaultValue: "Or" })}
                  </span>
                </div>
              </div>

              {/* Manual Redemption Code Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t("teacher.manualCode", {
                    defaultValue: "Enter Redemption Code",
                  })}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="EDU-ABC-1234"
                    maxLength={15}
                    className="flex-1 rounded-lg border border-border bg-card px-3 py-2 text-sm placeholder-muted-foreground focus:border-primary focus:outline-none"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        const code = (e.target as HTMLInputElement).value;
                        if (code.trim()) {
                          handleManualInput(code);
                          (e.target as HTMLInputElement).value = "";
                        }
                      }
                    }}
                  />
                  <Button
                    size="sm"
                    onClick={(e) => {
                      const input = (
                        e.currentTarget.parentElement?.querySelector("input")
                      ) as HTMLInputElement;
                      if (input?.value.trim()) {
                        handleManualInput(input.value);
                        input.value = "";
                      }
                    }}
                  >
                    {t("common.scan", { defaultValue: "Scan" })}
                  </Button>
                </div>
              </div>

              {/* Demo hint */}
              <div className="rounded-lg border border-accent/20 bg-accent/5 p-3 text-xs text-muted-foreground">
                <p className="font-medium mb-1">Demo Hint:</p>
                <p>Enter any code in format "EDU-XXX-XXXX" to test verification</p>
              </div>
            </div>
          </>
        )}

        {step === "review" && scannedData && (
          <>
            <DialogHeader>
              <DialogTitle>
                {t("teacher.verifyRedemption", {
                  defaultValue: "Verify Redemption",
                })}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              {/* Redemption Code */}
              <Card className="border-primary/30 bg-card/40 p-4 backdrop-blur-sm">
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {t("teacher.redemptionCode", {
                      defaultValue: "Redemption Code",
                    })}
                  </p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 font-mono text-lg font-bold text-primary">
                      {scannedData.redemptionCode}
                    </code>
                    <button
                      onClick={handleCopyCode}
                      className="p-2 hover:bg-primary/10 rounded transition-colors"
                    >
                      <Copy className="h-4 w-4 text-primary" />
                    </button>
                  </div>
                </div>
              </Card>

              {/* Student Info */}
              <Card className="border-border/50 bg-card/40 p-4 backdrop-blur-sm">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  {t("teacher.studentID", { defaultValue: "Student ID" })}
                </p>
                <p className="text-sm font-mono text-foreground">
                  {scannedData.studentId}
                </p>
              </Card>

              {/* Expiry Status */}
              <div
                className={`flex items-start gap-3 rounded-lg border p-3 ${
                  scannedData.expiry < Date.now()
                    ? "border-red-400/30 bg-red-400/5"
                    : "border-green-400/30 bg-green-400/5"
                }`}
              >
                {scannedData.expiry < Date.now() ? (
                  <>
                    <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-400" />
                    <div className="text-sm text-red-400">
                      {t("teacher.qrExpired", {
                        defaultValue: "This QR code has expired",
                      })}
                    </div>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-400" />
                    <div className="text-sm text-green-400">
                      {t("teacher.qrValid", {
                        defaultValue: "This QR code is valid",
                      })}
                    </div>
                  </>
                )}
              </div>

              {/* Rejection Reason (if needed) */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t("teacher.rejectionReason", {
                    defaultValue: "Rejection Reason (if applicable)",
                  })}
                </label>
                <Textarea
                  placeholder={t("teacher.reasonPlaceholder", {
                    defaultValue: "Enter reason for rejection...",
                  })}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  disabled={scannedData.expiry < Date.now()}
                  className="min-h-24 resize-none"
                />
              </div>
            </div>

            <DialogFooter className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setStep("scan")}
                disabled={isProcessing}
              >
                {t("common.cancel", { defaultValue: "Cancel" })}
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleVerify(false)}
                disabled={
                  isProcessing || scannedData.expiry < Date.now()
                }
              >
                {isProcessing ? "..." : t("teacher.reject", { defaultValue: "Reject" })}
              </Button>
              <Button
                onClick={() => handleVerify(true)}
                disabled={
                  isProcessing || scannedData.expiry < Date.now()
                }
                className="bg-secondary hover:bg-secondary/90"
              >
                {isProcessing ? "..." : t("teacher.verify", { defaultValue: "Verify & Hand Over" })}
              </Button>
            </DialogFooter>
          </>
        )}

        {step === "result" && (
          <>
            <DialogHeader>
              <DialogTitle>
                {actionResult === "verified"
                  ? t("teacher.verificationSuccess", {
                      defaultValue: "Verified!",
                    })
                  : t("teacher.rejectionConfirmed", {
                      defaultValue: "Rejected",
                    })}
              </DialogTitle>
            </DialogHeader>

            <div className="flex flex-col items-center gap-4 py-6">
              {actionResult === "verified" ? (
                <>
                  <div className="rounded-full bg-green-400/20 p-4">
                    <CheckCircle2 className="h-12 w-12 text-green-400" />
                  </div>
                  <div className="text-center">
                    <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
                      {t("teacher.rewardHandedOver", {
                        defaultValue: "Reward handed over successfully!",
                      })}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {scannedData?.redemptionCode}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="rounded-full bg-red-400/20 p-4">
                    <XCircle className="h-12 w-12 text-red-400" />
                  </div>
                  <div className="text-center">
                    <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
                      {t("teacher.redemptionRejected", {
                        defaultValue: "Redemption Rejected",
                      })}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {rejectionReason || "No reason provided"}
                    </p>
                  </div>
                </>
              )}
            </div>

            <DialogFooter>
              <Button onClick={handleReset} className="w-full bg-secondary hover:bg-secondary/90">
                {t("teacher.scanAnother", {
                  defaultValue: "Scan Another QR",
                })}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
