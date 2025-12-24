import { useTranslation } from "react-i18next";
import { AppLayout } from "@/components/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AnimatedProgress } from "@/components/ui/animated-progress";
import { GameBadge } from "@/components/ui/game-badge";
import {
  Heart,
  Lock,
  Play,
  Star,
  Trophy,
  Zap,
  CheckCircle2,
  ChevronRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface GameLevel {
  id: string;
  level: number;
  name: string;
  description: string;
  game: string;
  xp: number;
  coins: number;
  status: "locked" | "available" | "completed";
  stars?: number;
  route: string;
}

const levels: GameLevel[] = [
  {
    id: "1",
    level: 1,
    name: "Human Body",
    description: "Explore organs, systems, and how your body works",
    game: "Body Explorer",
    xp: 100,
    coins: 25,
    status: "completed",
    stars: 2,
    route: "/student/biology/level/1"
  },
  {
    id: "2",
    level: 2,
    name: "Plants & Environment",
    description: "Learn about photosynthesis and ecosystems",
    game: "Garden Guardian",
    xp: 150,
    coins: 35,
    status: "available",
    route: "/student/biology/level/2"
  },
  {
    id: "3",
    level: 3,
    name: "Health & Diseases",
    description: "Understand diseases, prevention, and healthy habits",
    game: "Village Health Guardian",
    xp: 200,
    coins: 50,
    status: "locked",
    route: "/student/biology/level/3"
  }
];

export default function BiologySubjectPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const totalProgress = 30;
  const completedLevels = levels.filter(l => l.status === "completed").length;

  return (
    <AppLayout role="student" playCoins={1250} title={t('subjects.biology')}>
      <div className="px-4 py-6 pb-24">
        {/* Subject Header */}
        <div className="mb-6 slide-up">
          <div className="glass-card rounded-2xl p-5 border border-border bg-gradient-to-br from-destructive/20 to-destructive/5">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-16 w-16 rounded-2xl bg-destructive/30 flex items-center justify-center">
                <Heart className="h-8 w-8 text-destructive" />
              </div>
              <div className="flex-1">
                <h2 className="font-heading text-2xl font-bold text-foreground">{t('subjects.biology')}</h2>
                <p className="text-sm text-muted-foreground">{t('subjects.biology_description')}</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-semibold text-destructive">{totalProgress}%</span>
              </div>
              <AnimatedProgress value={totalProgress} variant="default" />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{completedLevels}/{levels.length} {t('common.complete')}</span>
                <GameBadge variant="primary" size="sm">
                  <Trophy className="h-3 w-3 mr-1" />
                  {t('common.beginner')}
                </GameBadge>
              </div>
            </div>
          </div>
        </div>

        {/* Game Levels */}
        <div className="mb-4">
          <h3 className="font-heading font-semibold text-foreground mb-3 flex items-center gap-2">
            <Zap className="h-5 w-5 text-accent" />
            {t('common.gameLevels')}
          </h3>
        </div>

        <div className="space-y-4">
          {levels.map((level, index) => (
            <Card 
              key={level.id}
              className={`glass-card border p-4 slide-up ${
                level.status === "locked" ? "border-border opacity-60" : "border-destructive/30"
              }`}
              style={{ animationDelay: `${100 + index * 75}ms` }}
            >
              <div className="flex items-start gap-4">
                <div className={`h-14 w-14 rounded-xl flex items-center justify-center shrink-0 ${
                  level.status === "completed" 
                    ? "bg-secondary" 
                    : level.status === "available"
                    ? "bg-destructive"
                    : "bg-muted"
                }`}>
                  {level.status === "locked" ? (
                    <Lock className="h-6 w-6 text-muted-foreground" />
                  ) : level.status === "completed" ? (
                    <CheckCircle2 className="h-6 w-6 text-secondary-foreground" />
                  ) : (
                    <span className="font-display text-xl text-destructive-foreground">{level.level}</span>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <h4 className="font-heading font-semibold text-foreground">
                        Level {level.level}: {level.name}
                      </h4>
                      <p className="text-sm text-muted-foreground">{level.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <Badge variant="outline" className="text-xs">
                      <Play className="h-3 w-3 mr-1" />
                      {level.game}
                    </Badge>
                    <span className="text-xs text-accent">+{level.coins} 🪙</span>
                    <span className="text-xs text-primary">+{level.xp} XP</span>
                  </div>

                  {level.status === "completed" && level.stars && (
                    <div className="flex items-center gap-1 mt-2">
                      {[1, 2, 3].map((star) => (
                        <Star 
                          key={star}
                          className={`h-5 w-5 ${
                            star <= level.stars! ? "text-accent fill-accent" : "text-muted-foreground"
                          }`}
                        />
                      ))}
                    </div>
                  )}

                  {level.status !== "locked" && (
                    <Button
                      onClick={() => navigate(level.route)}
                      className={`mt-3 w-full ${
                        level.status === "completed"
                          ? "bg-secondary hover:bg-secondary/90"
                          : "bg-destructive hover:bg-destructive/90"
                      }`}
                      size="sm"
                    >
                      {level.status === "completed" ? t('common.playAgain') : t('common.startLevel')}
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
