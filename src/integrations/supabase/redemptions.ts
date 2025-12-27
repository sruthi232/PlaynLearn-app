/**
 * SUPABASE REDEMPTIONS INTEGRATION
 * Handles storing, retrieving, and managing student reward redemptions
 * Offline-first with sync support
 */

import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";
import type { RedemptionData } from "@/lib/qr-utils";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);

export type Redemption = Database["public"]["Tables"]["redemptions"]["Row"];
export type InsertRedemption = Database["public"]["Tables"]["redemptions"]["Insert"];
export type UpdateRedemption = Database["public"]["Tables"]["redemptions"]["Update"];

/**
 * Save a new redemption to Supabase
 */
export async function saveRedemption(
  studentId: string,
  redemptionData: RedemptionData
): Promise<Redemption | null> {
  try {
    const insertData: InsertRedemption = {
      id: redemptionData.id,
      student_id: studentId,
      product_id: redemptionData.productId,
      product_name: redemptionData.productName,
      coins_redeemed: redemptionData.coinsRedeemed,
      redemption_code: redemptionData.redemptionCode,
      one_time_token: redemptionData.oneTimeToken,
      qr_data: JSON.stringify({
        id: redemptionData.id,
        studentId: redemptionData.studentId,
        productId: redemptionData.productId,
        redemptionCode: redemptionData.redemptionCode,
        token: redemptionData.oneTimeToken,
        timestamp: redemptionData.timestamp,
        expiry: redemptionData.expiryDate,
      }),
      status: "pending",
      created_at: new Date(redemptionData.timestamp).toISOString(),
      expires_at: new Date(redemptionData.expiryDate).toISOString(),
      verified_by: null,
      verified_at: null,
      rejected_reason: null,
    };

    const { data, error } = await supabase
      .from("redemptions")
      .insert([insertData])
      .select()
      .single();

    if (error) {
      console.error("Error saving redemption:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error saving redemption:", error);
    return null;
  }
}

/**
 * Get all redemptions for a student
 */
export async function getStudentRedemptions(
  studentId: string
): Promise<Redemption[]> {
  try {
    const { data, error } = await supabase
      .from("redemptions")
      .select("*")
      .eq("student_id", studentId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching redemptions:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error fetching redemptions:", error);
    return [];
  }
}

/**
 * Get redemption by QR code/redemption code
 */
export async function getRedemptionByCode(
  redemptionCode: string
): Promise<Redemption | null> {
  try {
    const { data, error } = await supabase
      .from("redemptions")
      .select("*")
      .eq("redemption_code", redemptionCode)
      .single();

    if (error) {
      console.error("Error fetching redemption by code:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error fetching redemption by code:", error);
    return null;
  }
}

/**
 * Verify a redemption (teacher approves)
 */
export async function verifyRedemption(
  redemptionCode: string,
  teacherId: string
): Promise<Redemption | null> {
  try {
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from("redemptions")
      .update({
        status: "collected" as const,
        verified_by: teacherId,
        verified_at: now,
      })
      .eq("redemption_code", redemptionCode)
      .select()
      .single();

    if (error) {
      console.error("Error verifying redemption:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error verifying redemption:", error);
    return null;
  }
}

/**
 * Reject a redemption (teacher rejects)
 */
export async function rejectRedemption(
  redemptionCode: string,
  teacherId: string,
  reason?: string
): Promise<Redemption | null> {
  try {
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from("redemptions")
      .update({
        status: "rejected" as const,
        verified_by: teacherId,
        verified_at: now,
        rejected_reason: reason || null,
      })
      .eq("redemption_code", redemptionCode)
      .select()
      .single();

    if (error) {
      console.error("Error rejecting redemption:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error rejecting redemption:", error);
    return null;
  }
}

/**
 * Get expired redemptions for cleanup
 */
export async function getExpiredRedemptions(): Promise<Redemption[]> {
  try {
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from("redemptions")
      .select("*")
      .lt("expires_at", now)
      .neq("status", "collected")
      .neq("status", "rejected");

    if (error) {
      console.error("Error fetching expired redemptions:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error fetching expired redemptions:", error);
    return [];
  }
}

/**
 * Mark redemptions as expired
 */
export async function markExpiredRedemptions(): Promise<void> {
  try {
    const now = new Date().toISOString();
    const { error } = await supabase
      .from("redemptions")
      .update({ status: "expired" as const })
      .lt("expires_at", now)
      .in("status", ["pending", "verified"]);

    if (error) {
      console.error("Error marking redemptions as expired:", error);
    }
  } catch (error) {
    console.error("Error marking redemptions as expired:", error);
  }
}

/**
 * Get redemption statistics for a student
 */
export async function getStudentRedemptionStats(studentId: string) {
  try {
    const { data, error } = await supabase
      .from("redemptions")
      .select("status, coins_redeemed")
      .eq("student_id", studentId);

    if (error) {
      console.error("Error fetching redemption stats:", error);
      return {
        total: 0,
        pending: 0,
        verified: 0,
        collected: 0,
        expired: 0,
        rejected: 0,
        totalCoinsSpent: 0,
      };
    }

    const stats = {
      total: data?.length || 0,
      pending: data?.filter((r) => r.status === "pending").length || 0,
      verified: data?.filter((r) => r.status === "verified").length || 0,
      collected: data?.filter((r) => r.status === "collected").length || 0,
      expired: data?.filter((r) => r.status === "expired").length || 0,
      rejected: data?.filter((r) => r.status === "rejected").length || 0,
      totalCoinsSpent:
        data?.reduce((sum, r) => sum + (r.coins_redeemed || 0), 0) || 0,
    };

    return stats;
  } catch (error) {
    console.error("Error fetching redemption stats:", error);
    return {
      total: 0,
      pending: 0,
      verified: 0,
      collected: 0,
      expired: 0,
      rejected: 0,
      totalCoinsSpent: 0,
    };
  }
}
