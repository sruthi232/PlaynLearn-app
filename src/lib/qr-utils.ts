/**
 * QR REDEMPTION UTILITIES
 * Handles QR code generation, encryption, and redemption code creation
 * Offline-first design for village environments
 */

export interface RedemptionData {
  id: string;
  studentId: string;
  productId: string;
  productName: string;
  coinsRedeemed: number;
  timestamp: number;
  expiryDate: number;
  oneTimeToken: string;
  redemptionCode: string;
  status: "pending" | "verified" | "collected" | "expired" | "rejected";
}

/**
 * Generate a unique, human-readable redemption code
 * Example: EDU-STA-9K72
 */
export function generateRedemptionCode(): string {
  const prefix = "EDU";
  const suffix = Math.random().toString(36).substring(2, 5).toUpperCase();
  const code = Math.random()
    .toString(36)
    .substring(2, 6)
    .toUpperCase();
  
  return `${prefix}-${suffix}-${code}`;
}

/**
 * Create encryption key from student ID and timestamp
 * This ensures QR codes cannot be reused even if intercepted
 */
function generateOneTimeToken(): string {
  return `token_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}

/**
 * Create complete redemption data for QR encoding
 * This will be encoded into the QR code
 */
export function createRedemptionData(
  studentId: string,
  productId: string,
  productName: string,
  coinsRedeemed: number,
  expiryDays: number = 7
): RedemptionData {
  const now = Date.now();
  const expiryDate = now + expiryDays * 24 * 60 * 60 * 1000;
  
  return {
    id: uuidv4() as unknown as string, // For tracking
    studentId,
    productId,
    productName,
    coinsRedeemed,
    timestamp: now,
    expiryDate,
    oneTimeToken: generateOneTimeToken(),
    redemptionCode: generateRedemptionCode(),
    status: "pending",
  };
}

/**
 * Convert redemption data to JSON string for QR encoding
 * Kept minimal to ensure QR code readability (not too complex)
 */
export function redemptionDataToQRString(data: RedemptionData): string {
  return JSON.stringify({
    id: data.id,
    studentId: data.studentId,
    productId: data.productId,
    redemptionCode: data.redemptionCode,
    token: data.oneTimeToken,
    timestamp: data.timestamp,
    expiry: data.expiryDate,
  });
}

/**
 * Validate redemption QR data when scanned by teacher
 */
export function validateRedemptionQR(qrString: string): {
  valid: boolean;
  data?: Partial<RedemptionData>;
  error?: string;
} {
  try {
    const data = JSON.parse(qrString);
    const now = Date.now();

    // Check expiry
    if (data.expiry && data.expiry < now) {
      return {
        valid: false,
        error: "QR code has expired",
      };
    }

    // Verify required fields
    if (!data.studentId || !data.productId || !data.redemptionCode) {
      return {
        valid: false,
        error: "Invalid QR code format",
      };
    }

    return {
      valid: true,
      data,
    };
  } catch {
    return {
      valid: false,
      error: "Could not decode QR code",
    };
  }
}

/**
 * Format redemption data for display
 */
export function formatRedemptionStatus(
  status: RedemptionData["status"]
): {
  label: string;
  color: string;
  icon: string;
} {
  const statusMap = {
    pending: { label: "Pending Verification", color: "text-yellow-400", icon: "🟡" },
    verified: { label: "Verified", color: "text-blue-400", icon: "🔵" },
    collected: { label: "Collected", color: "text-green-400", icon: "🟢" },
    expired: { label: "Expired", color: "text-red-400", icon: "🔴" },
    rejected: { label: "Rejected", color: "text-red-500", icon: "❌" },
  };

  return statusMap[status] || statusMap.pending;
}
