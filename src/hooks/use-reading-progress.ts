import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

interface ReadingProgress {
  id: string;
  user_id: string;
  subject: string;
  chapter_id: string;
  content_index: number;
  is_completed: boolean;
  completed_at: string | null;
  last_read_at: string;
}

export function useReadingProgress(subject: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: progress, isLoading } = useQuery({
    queryKey: ["reading-progress", user?.id, subject],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from("reading_progress")
        .select("*")
        .eq("user_id", user.id)
        .eq("subject", subject);

      if (error) throw error;
      return data as ReadingProgress[];
    },
    enabled: !!user?.id && !!subject,
  });

  const saveProgressMutation = useMutation({
    mutationFn: async ({
      chapterId,
      contentIndex,
      isCompleted = false,
    }: {
      chapterId: string;
      contentIndex: number;
      isCompleted?: boolean;
    }) => {
      if (!user?.id) throw new Error("Not authenticated");

      try {
        const { data: existingList, error: queryError } = await supabase
          .from("reading_progress")
          .select("id")
          .eq("user_id", user.id)
          .eq("subject", subject)
          .eq("chapter_id", chapterId);

        if (queryError) {
          throw queryError;
        }

        const existingRecord = existingList && existingList.length > 0 ? existingList[0] : null;

        if (existingRecord?.id) {
          const { error } = await supabase
            .from("reading_progress")
            .update({
              content_index: contentIndex,
              is_completed: isCompleted,
              completed_at: isCompleted ? new Date().toISOString() : null,
              last_read_at: new Date().toISOString(),
            })
            .eq("id", existingRecord.id);

          if (error) throw error;
        } else {
          const { error } = await supabase.from("reading_progress").insert({
            user_id: user.id,
            subject,
            chapter_id: chapterId,
            content_index: contentIndex,
            is_completed: isCompleted,
            completed_at: isCompleted ? new Date().toISOString() : null,
          });

          if (error) throw error;
        }
      } catch (error) {
        console.error("Reading progress save error:", error);
        // Silently fail to prevent blocking user experience
        // Progress will still work, just won't persist to database
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["reading-progress", user?.id, subject],
      });
    },
  });

  const getChapterProgress = (chapterId: string) => {
    return progress?.find((p) => p.chapter_id === chapterId);
  };

  const isChapterCompleted = (chapterId: string) => {
    const chapterProgress = getChapterProgress(chapterId);
    return chapterProgress?.is_completed ?? false;
  };

  const getLastReadIndex = (chapterId: string) => {
    const chapterProgress = getChapterProgress(chapterId);
    return chapterProgress?.content_index ?? 0;
  };

  const completedChaptersCount = progress?.filter((p) => p.is_completed).length ?? 0;

  return {
    progress,
    isLoading,
    saveProgress: saveProgressMutation.mutate,
    isSaving: saveProgressMutation.isPending,
    getChapterProgress,
    isChapterCompleted,
    getLastReadIndex,
    completedChaptersCount,
  };
}
