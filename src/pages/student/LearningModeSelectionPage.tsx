import { useNavigate, useParams } from "react-router-dom";
import { AppLayout } from "@/components/navigation";
import { Card } from "@/components/ui/card";
import { 
  Atom, 
  FlaskConical, 
  Heart, 
  Calculator, 
  Laptop, 
  Wallet, 
  Lightbulb, 
  TreePine,
  Gamepad2,
  BookOpen,
  Target,
  ChevronRight,
  Sparkles
} from "lucide-react";
import mascotPresenting from "@/assets/mascot-presenting.png";

const subjectConfig: Record<string, { 
  icon: React.ElementType; 
  title: string; 
  color: string;
  activePath: string;
  passivePath: string;
  gamifiedPath: string;
}> = {
  physics: { 
    icon: Atom, 
    title: "Physics", 
    color: "primary",
    activePath: "/learn/physics/levels",
    passivePath: "/learn/physics/read",
    gamifiedPath: "/student/physics"
  },
  chemistry: { 
    icon: FlaskConical, 
    title: "Chemistry", 
    color: "secondary",
    activePath: "/learn/chemistry/levels",
    passivePath: "/learn/chemistry/read",
    gamifiedPath: "/student/chemistry"
  },
  biology: { 
    icon: Heart, 
    title: "Biology", 
    color: "destructive",
    activePath: "/learn/biology/levels",
    passivePath: "/learn/biology/read",
    gamifiedPath: "/student/biology"
  },
  mathematics: { 
    icon: Calculator, 
    title: "Mathematics", 
    color: "badge",
    activePath: "/learn/mathematics/levels",
    passivePath: "/learn/mathematics/read",
    gamifiedPath: "/student/mathematics"
  },
  technology: { 
    icon: Laptop, 
    title: "Technology", 
    color: "primary",
    activePath: "/learn/technology/levels",
    passivePath: "/learn/technology/read",
    gamifiedPath: "/student/technology"
  },
  finance: { 
    icon: Wallet, 
    title: "Finance", 
    color: "accent",
    activePath: "/learn/finance/levels",
    passivePath: "/learn/finance/read",
    gamifiedPath: "/student/finance"
  },
  entrepreneurship: { 
    icon: Lightbulb, 
    title: "Entrepreneurship", 
    color: "badge",
    activePath: "/learn/entrepreneurship/levels",
    passivePath: "/learn/entrepreneurship/read",
    gamifiedPath: "/student/entrepreneurship"
  },
  "village-skills": { 
    icon: TreePine, 
    title: "Village Skills", 
    color: "secondary",
    activePath: "/learn/village-skills/levels",
    passivePath: "/learn/village-skills/read",
    gamifiedPath: "/student/village-skills"
  },
};

const learningModes = [
  {
    id: "active",
    title: "Active Learning",
    description: "Learn by doing and interacting",
    details: "Complete interactive activities, solve problems, and build skills step by step",
    icon: Target,
    gradient: "from-primary/30 to-primary/10",
    borderColor: "border-primary/40",
    pathKey: "activePath" as const,
  },
  {
    id: "passive",
    title: "Passive Learning",
    description: "Learn through visual stories",
    details: "Read illustrated chapters, watch concepts come to life, learn at your own pace",
    icon: BookOpen,
    gradient: "from-secondary/30 to-secondary/10",
    borderColor: "border-secondary/40",
    pathKey: "passivePath" as const,
  },
  {
    id: "gamified",
    title: "Gamified Learning",
    description: "Learn through interactive games",
    details: "Play engaging games that teach real concepts through hands-on gameplay",
    icon: Gamepad2,
    gradient: "from-accent/30 to-accent/10",
    borderColor: "border-accent/40",
    pathKey: "gamifiedPath" as const,
  },
];

export default function LearningModeSelectionPage() {
  const navigate = useNavigate();
  const { subject } = useParams<{ subject: string }>();
  
  const config = subjectConfig[subject || "physics"];
  const SubjectIcon = config?.icon || Atom;

  if (!config) {
    return (
      <AppLayout role="student" playCoins={0} title="Subject Not Found">
        <div className="flex items-center justify-center min-h-[50vh]">
          <p className="text-muted-foreground">Subject not found</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout role="student" playCoins={0} title={config.title}>
      <div className="px-4 py-6 pb-24 relative">
        {/* Mascot - Bottom Right */}
        <div className="fixed bottom-24 right-4 z-10 pointer-events-none">
          <img 
            src={mascotPresenting} 
            alt="Mascot" 
            className="w-28 h-28 object-contain opacity-90 animate-fade-in" 
          />
        </div>

        {/* Header Section */}
        <div className="mb-8 slide-up">
          <div className="glass-card rounded-2xl p-5 border border-border bg-gradient-to-br from-background to-muted/20">
            <div className="flex items-center gap-4">
              <div className={`h-16 w-16 rounded-2xl bg-${config.color}/20 flex items-center justify-center`}>
                <SubjectIcon className={`h-8 w-8 text-${config.color}`} />
              </div>
              <div className="flex-1">
                <h2 className="font-heading text-2xl font-bold text-foreground">
                  {config.title}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Choose how you want to learn today
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Question Header */}
        <div className="mb-6 text-center slide-up" style={{ animationDelay: "100ms" }}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Progress your Learning & Earning</span>
          </div>
          <h1 className="font-heading text-xl font-bold text-foreground">
            Learn to manage money early — it's the smartest power you can have
          </h1>
        </div>

        {/* Learning Mode Cards */}
        <div className="space-y-4 mb-32">
          {learningModes.map((mode, index) => (
            <Card
              key={mode.id}
              className={`glass-card border ${mode.borderColor} p-5 cursor-pointer 
                hover:scale-[1.02] transition-all duration-300 slide-up
                bg-gradient-to-br ${mode.gradient}`}
              style={{ animationDelay: `${150 + index * 75}ms` }}
              onClick={() => navigate(config[mode.pathKey])}
            >
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-xl bg-background/50 flex items-center justify-center shrink-0">
                  <mode.icon className="h-7 w-7 text-foreground" />
                </div>
                <div className="flex-1">
                  <h4 className="font-heading text-lg font-bold text-foreground mb-1">
                    {mode.title}
                  </h4>
                  <p className="text-sm font-medium text-foreground/80">
                    {mode.description}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {mode.details}
                  </p>
                </div>
                <ChevronRight className="h-6 w-6 text-muted-foreground" />
              </div>
            </Card>
          ))}
        </div>

        {/* Quick Tips */}
        <div className="slide-up" style={{ animationDelay: "400ms" }}>
          <div className="glass-card rounded-xl p-4 border border-border bg-muted/20">
            <p className="text-xs text-muted-foreground text-center">
              💡 <strong>Tip:</strong> Mix different learning styles for best results! 
              Start with passive learning to understand concepts, then practice with active learning.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
