import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { AppLayout } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  QrCode,
  Camera,
  Check,
  X,
  AlertCircle,
  Gift,
  User,
  Calendar,
  Coins,
  RefreshCw,
  ScanLine,
  CheckCircle2,
  XCircle,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { SimpleQRCode } from "@/components/ui/simple-qr-code";
import { SimpleQRScanner } from "@/lib/qr-scanner";
import type { RedemptionData } from "@/lib/qr-utils";

interface ScannedRedemption extends RedemptionData {
  scannedAt: number;
  teacherDecision?: "approved" | "rejected";
  teacherNotes?: string;
}

export default function TeacherRewardQRScanPage() {
  const { t } = useTranslation();
  const [isScanning, setIsScanning] = useState(false);
  const [scannedCode, setScannedCode] = useState("");
  const [currentRedemption, setCurrentRedemption] = useState<RedemptionData | null>(null);
  const [scannedHistory, setScannedHistory] = useState<ScannedRedemption[]>([]);
  const [manualCodeInput, setManualCodeInput] = useState("");
  const [lastScannedCode, setLastScannedCode] = useState(""); // Track last scanned code
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load scanned history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("teacher_scanned_redemptions");
    if (saved) {
      setScannedHistory(JSON.parse(saved));
    }
  }, []);

  // Save scanned history to localStorage
  const saveScannedHistory = (history: ScannedRedemption[]) => {
    localStorage.setItem("teacher_scanned_redemptions", JSON.stringify(history));
    setScannedHistory(history);
  };

  // Delete individual verification record
  const deleteVerification = (redemptionCode: string) => {
    const updatedHistory = scannedHistory.filter(item => item.redemptionCode !== redemptionCode);
    saveScannedHistory(updatedHistory);
    toast.success("Verification record deleted");
  };

  // Start camera for QR scanning
  const startCamera = async () => {
    try {
      setIsScanning(true);
      setLastScannedCode(""); // Reset last scanned code when starting camera
      // Clear current redemption to allow fresh scanning
      setCurrentRedemption(null);
      setScannedCode("");
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }, // Use back camera if available
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        
        // Start scanning for QR codes
        videoRef.current.onloadedmetadata = () => {
          startQRDetection();
        };
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast.error("Unable to access camera. Please check permissions.");
      setIsScanning(false);
    }
  };

  // Start QR code detection
  const startQRDetection = () => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
    }
    
    scanIntervalRef.current = setInterval(() => {
      scanForQRCode();
    }, 1000); // Scan every 1 second
  };

  // Scan for QR code in video feed
  const scanForQRCode = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    if (!context || video.videoWidth === 0) return;
    
    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw current video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Get image data for QR scanning
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    
    // Use QR scanner to detect and decode QR codes
    try {
      const scannedCode = SimpleQRScanner.scanImageData(imageData);
      
      if (scannedCode && scannedCode !== lastScannedCode) {
        console.log('New QR code successfully scanned:', scannedCode);
        setLastScannedCode(scannedCode);
        // Stop scanning and process the code
        stopCamera();
        processRedemptionCode(scannedCode);
      }
    } catch (error) {
      console.error('Error scanning QR code:', error);
    }
  };



  // Stop camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    setIsScanning(false);
  };

  // Process scanned/entered code
  const processRedemptionCode = (code: string) => {
    console.log('Processing redemption code:', code);
    
    try {
      // Try to find the redemption in student's saved redemptions
      const allRedemptions = getAllStudentRedemptions();
      console.log('Searching in redemptions:', allRedemptions);
      
      const redemption = allRedemptions.find(r => {
        console.log('Comparing:', r.redemptionCode, 'with', code);
        return r.redemptionCode === code;
      });
      
      if (redemption) {
        console.log('Redemption found:', redemption);
        // Check if already processed
        const alreadyScanned = scannedHistory.find(s => s.redemptionCode === code);
        if (alreadyScanned) {
          toast.error(`This reward was already ${alreadyScanned.teacherDecision} on ${new Date(alreadyScanned.scannedAt).toLocaleDateString()}`);
          return;
        }

        setCurrentRedemption(redemption);
        setScannedCode(code);
        stopCamera();
        toast.success("QR code scanned successfully!");
      } else {
        console.log('No matching redemption found for code:', code);
        toast.error("Invalid or expired redemption code");
      }
    } catch (error) {
      console.error("Error processing code:", error);
      toast.error("Error processing redemption code");
    }
  };

  // Get all student redemptions (mock function - in real app would be API call)
  const getAllStudentRedemptions = (): RedemptionData[] => {
    // This would normally fetch from server
    // For now, we'll check localStorage for any saved redemptions
    const keys = Object.keys(localStorage);
    const redemptions: RedemptionData[] = [];
    
    console.log('Searching for redemptions in localStorage keys:', keys);
    
    keys.forEach(key => {
      if (key.startsWith("student_redemptions_")) {
        try {
          const studentRedemptions = JSON.parse(localStorage.getItem(key) || "[]");
          console.log(`Found redemptions in ${key}:`, studentRedemptions);
          redemptions.push(...studentRedemptions);
        } catch (e) {
          console.error(`Error parsing redemptions from ${key}:`, e);
        }
      }
    });
    
    console.log('All redemptions found:', redemptions);
    return redemptions;
  };

  // Handle teacher decision
  const handleTeacherDecision = (decision: "approved" | "rejected", notes?: string) => {
    if (!currentRedemption) return;

    const scannedRedemption: ScannedRedemption = {
      ...currentRedemption,
      scannedAt: Date.now(),
      teacherDecision: decision,
      teacherNotes: notes,
    };

    const newHistory = [scannedRedemption, ...scannedHistory];
    saveScannedHistory(newHistory);

    // Update the redemption status in student's wallet
    updateStudentRedemptionStatus(currentRedemption.redemptionCode, decision);

    toast.success(
      decision === "approved" 
        ? "Reward approved! Student can collect their reward." 
        : "Reward rejected. Student will be notified."
    );

    // Reset state
    setCurrentRedemption(null);
    setScannedCode("");
    setManualCodeInput("");
  };

  // Update student redemption status
  const updateStudentRedemptionStatus = (code: string, status: "approved" | "rejected") => {
    const keys = Object.keys(localStorage);
    
    keys.forEach(key => {
      if (key.startsWith("student_redemptions_")) {
        try {
          const redemptions = JSON.parse(localStorage.getItem(key) || "[]");
          const updated = redemptions.map((r: RedemptionData) => 
            r.redemptionCode === code 
              ? { ...r, status: status === "approved" ? "verified" : "rejected" }
              : r
          );
          localStorage.setItem(key, JSON.stringify(updated));
        } catch (e) {
          // Ignore invalid entries
        }
      }
    });
  };

  // Handle manual code entry
  const handleManualEntry = () => {
    if (manualCodeInput.trim()) {
      processRedemptionCode(manualCodeInput.trim().toUpperCase());
    }
  };

  return (
    <AppLayout role="teacher" title="Reward QR Scanner">
      <div className="px-4 py-6 space-y-6">
        {/* Header */}
        <div className="slide-up">
          <h2 className="font-heading text-2xl font-bold text-foreground mb-2">
            Reward QR Scanner
          </h2>
          <p className="text-muted-foreground">
            Scan student QR codes to verify and approve reward redemptions
          </p>
        </div>

        {/* Current Redemption Review */}
        {currentRedemption && (
          <Card className="slide-up border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary/20 rounded-lg">
                  <Gift className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-lg">Reward Verification</h3>
                  <p className="text-sm text-muted-foreground">Review and approve this redemption</p>
                </div>
              </div>

              {/* Redemption Details */}
              <div className="space-y-3 bg-card/50 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Student</p>
                    <p className="font-semibold">{currentRedemption.studentName || "Unknown Student"}</p>
                    <p className="text-xs text-muted-foreground">{currentRedemption.studentEmail || "No email"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Cost</p>
                    <div className="flex items-center gap-1">
                      <Coins className="h-4 w-4 text-accent" />
                      <span className="font-semibold">{currentRedemption.coinsRedeemed}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Product</p>
                  <p className="font-semibold">{currentRedemption.productName}</p>
                </div>
                
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Redemption Code</p>
                  <code className="font-mono text-sm bg-primary/10 px-2 py-1 rounded border">
                    {currentRedemption.redemptionCode}
                  </code>
                </div>

                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Redeemed On</p>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{new Date(currentRedemption.timestamp).toLocaleString()}</span>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Expires</p>
                  <span className="text-sm">
                    {new Date(currentRedemption.expiryDate).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Decision Buttons */}
              <div className="flex gap-3 pt-2">
                <Button
                  onClick={() => handleTeacherDecision("approved")}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Approve Reward
                </Button>
                <Button
                  onClick={() => handleTeacherDecision("rejected")}
                  variant="destructive"
                  className="flex-1"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject Reward
                </Button>
              </div>
              
              {/* Cancel Button */}
              <div className="pt-2">
                <Button
                  onClick={() => {
                    setCurrentRedemption(null);
                    setScannedCode("");
                    setManualCodeInput("");
                  }}
                  variant="outline"
                  className="w-full"
                >
                  Cancel Verification
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Scanner Section */}
        {!currentRedemption && (
          <div className="slide-up space-y-4" style={{ animationDelay: "100ms" }}>
            <Card className="p-6">
              <div className="space-y-4">
                <div className="text-center">
                  <div className="p-4 bg-primary/10 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                    <QrCode className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-heading font-semibold mb-2">Scan QR Code</h3>
                  <p className="text-sm text-muted-foreground">
                    Use your camera to scan student reward QR codes
                  </p>
                </div>

                {/* Camera Section */}
                {isScanning ? (
                  <div className="space-y-3">
                    <div className="relative bg-black rounded-lg overflow-hidden aspect-square max-w-sm mx-auto">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="border-2 border-primary w-48 h-48 rounded-lg">
                          <ScanLine className="h-6 w-6 text-primary animate-pulse mx-auto mt-20" />
                        </div>
                      </div>
                      {/* Instruction overlay */}
                      <div className="absolute bottom-4 left-4 right-4 bg-black/70 text-white p-2 rounded text-xs text-center">
                        Point camera at QR code to scan automatically
                      </div>
                    </div>
                    <Button onClick={stopCamera} variant="outline" className="w-full">
                      Stop Camera
                    </Button>
                  </div>
                ) : (
                  <Button onClick={startCamera} className="w-full">
                    <Camera className="h-4 w-4 mr-2" />
                    Start Camera Scanning
                  </Button>
                )}

                {/* Manual Entry */}
                <div className="border-t pt-4">
                  <p className="text-sm font-medium mb-2 text-center">Or enter code manually:</p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={manualCodeInput}
                      onChange={(e) => setManualCodeInput(e.target.value.toUpperCase())}
                      placeholder="Enter redemption code (e.g., EDU-ABC-1234)"
                      className="flex-1 px-3 py-2 border border-border rounded-lg bg-background"
                      maxLength={15}
                    />
                    <Button onClick={handleManualEntry} disabled={!manualCodeInput.trim()}>
                      Verify
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Scanned History */}
        <div className="slide-up space-y-3" style={{ animationDelay: "200ms" }}>
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-semibold">Recent Verifications</h3>
            <Badge variant="outline">{scannedHistory.length}</Badge>
          </div>

          {scannedHistory.length === 0 ? (
            <Card className="p-8 text-center">
              <QrCode className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="font-medium text-muted-foreground">No verifications yet</p>
              <p className="text-sm text-muted-foreground">
                Scan your first student reward QR code to get started
              </p>
            </Card>
          ) : (
            <div className="space-y-2">
              {scannedHistory.slice(0, 10).map((redemption, index) => (
                <Card key={redemption.redemptionCode} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        redemption.teacherDecision === "approved" 
                          ? "bg-green-100 text-green-600" 
                          : "bg-red-100 text-red-600"
                      }`}>
                        {redemption.teacherDecision === "approved" ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : (
                          <XCircle className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{redemption.productName}</p>
                        <p className="text-xs text-muted-foreground">
                          Code: {redemption.redemptionCode}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <Badge 
                          variant={redemption.teacherDecision === "approved" ? "default" : "destructive"}
                          className="text-xs"
                        >
                          {redemption.teacherDecision}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(redemption.scannedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Button
                        onClick={() => deleteVerification(redemption.redemptionCode)}
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Hidden canvas for QR processing */}
      <canvas ref={canvasRef} className="hidden" />
    </AppLayout>
  );
}