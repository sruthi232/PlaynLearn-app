import { AppLayout } from "@/components/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AnimatedProgress } from "@/components/ui/animated-progress";
import { GameBadge } from "@/components/ui/game-badge";
import { 
  Trophy, 
  Flame, 
  Target, 
  Star,
  Atom,
  FlaskConical,
  Heart,
  Calculator,
  Laptop,
  Wallet,
  Lightbulb,
  TreePine,
  Award,
  Zap,
  Medal,
  Crown,
  ChevronRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import mascotPointing from "@/assets/mascot-pointing.png";

const subjectProgress = [
  { icon: Atom, name: "Physics", progress: 65, levels: "2/3", color: "text-primary", bgColor: "bg-primary/20" },
  { icon: FlaskConical, name: "Chemistry", progress: 45, levels: "1/3", color: "text-secondary", bgColor: "bg-secondary/20" },
  { icon: Heart, name: "Biology", progress: 30, levels: "1/3", color: "text-destructive", bgColor: "bg-destructive/20" },
  { icon: Calculator, name: "Mathematics", progress: 80, levels: "2/3", color: "text-badge", bgColor: "bg-badge/20" },
  { icon: Laptop, name: "Technology", progress: 20, levels: "1/3", color: "text-accent", bgColor: "bg-accent/20" },
  { icon: Wallet, name: "Finance", progress: 55, levels: "2/3", color: "text-secondary", bgColor: "bg-secondary/20" },
  { icon: Lightbulb, name: "Entrepreneurship", progress: 35, levels: "1/3", color: "text-accent", bgColor: "bg-accent/20" },
  { icon: TreePine, name: "Village Skills", progress: 10, levels: "0/3", color: "text-primary", bgColor: "bg-primary/20" },
];

const badges = [
  { icon: Award, name: "First Steps", description: "Complete your first lesson", earned: true, rarity: "common" },
  { icon: Flame, name: "7-Day Streak", description: "Learn for 7 days straight", earned: true, rarity: "rare" },
  { icon: Zap, name: "Quick Learner", description: "Complete 3 lessons in a day", earned: true, rarity: "common" },
  { icon: Trophy, name: "Physics Master", description: "Complete all Physics levels", earned: false, rarity: "epic" },
  { icon: Star, name: "Village Hero", description: "Complete 10 village tasks", earned: false, rarity: "legendary" },
  { icon: Medal, name: "Math Wizard", description: "Score 100% on Math quiz", earned: true, rarity: "rare" },
];

const rarityColors = {
  common: "border-muted-foreground/30 bg-muted/20",
  rare: "border-primary/50 bg-primary/10",
  epic: "border-badge/50 bg-badge/10",
  legendary: "border-accent/50 bg-accent/10"
};

export default function ProgressPage() {
  const navigate = useNavigate();
  const totalXP = 2450;
  const currentLevel = 8;
  const xpToNext = 550;
  const xpProgress = 450;
  const streak = 7;
  const badgesEarned = badges.filter(b => b.earned).length;

  return (
    <AppLayout role="student" playCoins={1250} title="Progress">
      <div className="px-4 py-6 pb-24">
        {/* Level & XP Card */}
        <div className="mb-6 slide-up">
          <div className="glass-card rounded-2xl p-5 border border-border">
            <div className="flex items-center gap-4 mb-4">
              <div className="relative">
                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                  <span className="font-display text-2xl text-primary-foreground">{currentLevel}</span>
                </div>
                <div className="absolute -bottom-1 -right-1 bg-secondary rounded-full px-2 py-0.5">
                  <span className="text-xs font-bold text-secondary-foreground">LVL</span>
                </div>
              </div>
              <div className="flex-1">
                <h2 className="font-heading text-lg font-bold text-foreground">Learning Champion</h2>
                <p className="text-sm text-muted-foreground mb-2">Total XP: {totalXP}</p>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Level {currentLevel}</span>
                    <span>{xpProgress}/{xpToNext} XP</span>
                  </div>
                  <AnimatedProgress value={(xpProgress / xpToNext) * 100} variant="default" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Leaderboard Link Card */}
        <Card 
          className="glass-card border border-primary/30 p-4 mb-6 slide-up cursor-pointer hover:border-primary/50 transition-all"
          style={{ animationDelay: "50ms" }}
          onClick={() => navigate("/student/leaderboard")}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-accent/60 flex items-center justify-center">
                <Crown className="h-6 w-6 text-accent-foreground" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-foreground">Village Leaderboard</h3>
                <p className="text-sm text-muted-foreground">See top learners in your village</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </div>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6 slide-up" style={{ animationDelay: "100ms" }}>
          <Card className="glass-card border border-border p-3 text-center">
            <Flame className="h-6 w-6 text-destructive mx-auto mb-1" />
            <p className="font-heading text-xl font-bold text-foreground">{streak}</p>
            <p className="text-xs text-muted-foreground">Day Streak</p>
          </Card>
          <Card className="glass-card border border-border p-3 text-center">
            <Trophy className="h-6 w-6 text-accent mx-auto mb-1" />
            <p className="font-heading text-xl font-bold text-foreground">{badgesEarned}</p>
            <p className="text-xs text-muted-foreground">Badges</p>
          </Card>
          <Card className="glass-card border border-border p-3 text-center">
            <Target className="h-6 w-6 text-secondary mx-auto mb-1" />
            <p className="font-heading text-xl font-bold text-foreground">12</p>
            <p className="text-xs text-muted-foreground">Tasks Done</p>
          </Card>
        </div>

        {/* Subject Progress */}
        <div className="mb-6 slide-up" style={{ animationDelay: "100ms" }}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-heading font-semibold text-foreground">Subject Progress</h3>
            <img src="https://cdn.builder.io/api/v1/image/assets%2Fe1d336b7ba7f491d80ce2b7cecac66a5%2F82f232a2071044f6a443a69ee79839f2" alt="Mascot" className="w-12 h-12 object-contain" />
          </div>
          <div className="space-y-3">
            {subjectProgress.map((subject, index) => (
              <Card 
                key={subject.name}
                className="glass-card border border-border p-3"
              >
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-xl ${subject.bgColor} flex items-center justify-center`}>
                    <subject.icon className={`h-5 w-5 ${subject.color}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-foreground text-sm">{subject.name}</span>
                      <span className="text-xs text-muted-foreground">{subject.levels} Levels</span>
                    </div>
                    <AnimatedProgress value={subject.progress} variant="default" className="h-2" />
                  </div>
                  <span className="text-sm font-bold text-primary">{subject.progress}%</span>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Badges */}
        <div className="slide-up" style={{ animationDelay: "150ms" }}>
          <h3 className="font-heading font-semibold text-foreground mb-3 flex items-center gap-2">
            <Award className="h-5 w-5 text-accent" />
            Badges Earned
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {badges.map((badge, index) => (
              <Card 
                key={badge.name}
                className={`glass-card border p-3 text-center ${
                  badge.earned 
                    ? rarityColors[badge.rarity as keyof typeof rarityColors]
                    : "border-border opacity-50"
                }`}
              >
                <div className={`h-12 w-12 rounded-full mx-auto mb-2 flex items-center justify-center ${
                  badge.earned ? "bg-primary/20" : "bg-muted/30"
                }`}>
                  <badge.icon className={`h-6 w-6 ${badge.earned ? "text-primary" : "text-muted-foreground"}`} />
                </div>
                <p className="text-xs font-medium text-foreground truncate">{badge.name}</p>
                {badge.earned && (
                  <Badge variant="secondary" className="mt-1 text-[10px] py-0">
                    {badge.rarity}
                  </Badge>
                )}
              </Card>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
