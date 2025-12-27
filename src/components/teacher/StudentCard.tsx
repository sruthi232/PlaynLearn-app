/**
 * STUDENT CARD
 * Card-based student progress display with learning streak and subject progress
 */

import { Flame, TrendingUp, Eye } from "lucide-react";
import { useTranslation } from "react-i18next";

interface SubjectProgress {
  name: string;
  progress: number;
  color: string;
}

interface StudentCardProps {
  id: string;
  name: string;
  avatar: string;
  class: string;
  learningStreak: number;
  lastActive: string;
  subjects: SubjectProgress[];
  onClick: () => void;
}

export function StudentCard({
  id,
  name,
  avatar,
  class: studentClass,
  learningStreak,
  lastActive,
  subjects,
  onClick,
}: StudentCardProps) {
  const { t } = useTranslation();

  const avgProgress = Math.round(
    subjects.reduce((sum, s) => sum + s.progress, 0) / subjects.length
  );

  return (
    <button
      onClick={onClick}
      className="text-left w-full group relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:border-border hover:bg-card/80 hover:shadow-lg"
    >
      {/* Gradient background on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Content */}
      <div className="relative z-10 p-4 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 font-heading font-bold text-primary text-sm">
              {avatar}
            </div>
            <div>
              <p className="font-heading font-semibold text-foreground">{name}</p>
              <p className="text-xs text-muted-foreground">{studentClass}</p>
            </div>
          </div>
          <Eye className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
        </div>

        {/* Streak */}
        {learningStreak > 0 && (
          <div className="flex items-center gap-2 text-sm">
            <Flame className="h-4 w-4 text-destructive" />
            <span className="font-medium text-foreground">{learningStreak}</span>
            <span className="text-muted-foreground">
              {t("teacher.dayStreak", { defaultValue: "day streak" })}
            </span>
          </div>
        )}

        {/* Overall Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-foreground">
              {t("teacher.overall", { defaultValue: "Overall Progress" })}
            </span>
            <span className="text-accent font-bold">{avgProgress}%</span>
          </div>
          <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-300"
              style={{ width: `${avgProgress}%` }}
            />
          </div>
        </div>

        {/* Subject Progress - Mini bars */}
        <div className="space-y-1.5">
          {subjects.slice(0, 3).map((subject) => (
            <div key={subject.name} className="flex items-center gap-2 text-xs">
              <div className="flex-1">
                <div className="h-1.5 bg-muted/30 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${subject.color}`}
                    style={{ width: `${subject.progress}%` }}
                  />
                </div>
              </div>
              <span className="text-muted-foreground w-8 text-right">
                {subject.progress}%
              </span>
            </div>
          ))}
        </div>

        {/* Last Active */}
        <p className="text-xs text-muted-foreground border-t border-border/50 pt-3">
          {t("teacher.lastActive", { defaultValue: "Last active:" })} {lastActive}
        </p>
      </div>
    </button>
  );
}
