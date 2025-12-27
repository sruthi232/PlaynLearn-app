import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase, hasSupabaseConfig } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface PlayCoinsWallet {
  id: string;
  user_id: string;
  balance: number;
  total_earned: number;
  total_spent: number;
  created_at: string;
  updated_at: string;
}

export interface PlayCoinsTransaction {
  id: string;
  user_id: string;
  amount: number;
  transaction_type: string;
  source_type: string;
  source_id: string | null;
  description: string;
  balance_after: number;
  created_at: string;
}

export function usePlayCoins() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const walletQuery = useQuery({
    queryKey: ["playcoins-wallet", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      // Return demo wallet if Supabase not configured
      if (!hasSupabaseConfig()) {
        return {
          id: "demo-wallet",
          user_id: user.id,
          balance: 1250,
          total_earned: 5000,
          total_spent: 3750,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } as PlayCoinsWallet;
      }

      try {
        const { data, error } = await supabase
          .from("playcoins_wallets")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();

        if (error) throw error;
        return data as PlayCoinsWallet | null;
      } catch (error) {
        console.error("Error fetching wallet:", error);
        return null;
      }
    },
    enabled: !!user?.id,
  });

  const transactionsQuery = useQuery({
    queryKey: ["playcoins-transactions", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      // Return empty transactions if Supabase not configured
      if (!hasSupabaseConfig()) {
        return [];
      }

      try {
        const { data, error } = await supabase
          .from("playcoins_transactions")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(50);

        if (error) throw error;
        return data as PlayCoinsTransaction[];
      } catch (error) {
        console.error("Error fetching transactions:", error);
        return [];
      }
    },
    enabled: !!user?.id,
  });

  const awardMutation = useMutation({
    mutationFn: async ({ 
      amount, 
      source_type, 
      source_id, 
      description 
    }: { 
      amount: number; 
      source_type: string; 
      source_id?: string;
      description: string;
    }) => {
      if (!user?.id) throw new Error("Not authenticated");
      
      const { data, error } = await supabase.functions.invoke("award-playcoins", {
        body: { 
          user_id: user.id, 
          amount, 
          source_type, 
          source_id, 
          description 
        }
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["playcoins-wallet"] });
      queryClient.invalidateQueries({ queryKey: ["playcoins-transactions"] });
      toast.success(`+${data.amount_awarded} PlayCoins!`);
    },
    onError: (error) => {
      toast.error("Failed to award PlayCoins");
      console.error(error);
    }
  });

  const spendMutation = useMutation({
    mutationFn: async ({ 
      reward_id, 
      delivery_address 
    }: { 
      reward_id: string; 
      delivery_address?: string;
    }) => {
      if (!user?.id) throw new Error("Not authenticated");
      
      const { data, error } = await supabase.functions.invoke("spend-playcoins", {
        body: { 
          user_id: user.id, 
          reward_id, 
          delivery_address 
        }
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["playcoins-wallet"] });
      queryClient.invalidateQueries({ queryKey: ["playcoins-transactions"] });
      queryClient.invalidateQueries({ queryKey: ["reward-redemptions"] });
      toast.success(`Redeemed: ${data.reward}`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to redeem reward");
      console.error(error);
    }
  });

  return {
    wallet: walletQuery.data,
    balance: walletQuery.data?.balance ?? 0,
    totalEarned: walletQuery.data?.total_earned ?? 0,
    totalSpent: walletQuery.data?.total_spent ?? 0,
    transactions: transactionsQuery.data ?? [],
    isLoading: walletQuery.isLoading || transactionsQuery.isLoading,
    awardPlayCoins: awardMutation.mutate,
    spendPlayCoins: spendMutation.mutate,
    isAwarding: awardMutation.isPending,
    isSpending: spendMutation.isPending,
  };
}
