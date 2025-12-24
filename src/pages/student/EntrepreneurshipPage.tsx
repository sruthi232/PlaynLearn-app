import { SubjectLayout } from "@/components/student/SubjectLayout";
import { Lightbulb } from "lucide-react";
import { useNavigate } from "react-router-dom";

const entrepreneurshipGames = [
  {
    title: "Idea to Income",
    description: "Turn problems into profit by pitching solutions to villagers",
    emoji: "💡",
    path: "/student/entrepreneurship/idea-to-income",
    reward: 150,
    difficulty: "medium" as const,
    concept: "Problems → Ideas → Revenue"
  },
  {
    title: "Startup Survival",
    description: "Run a juice stall for 7 days, manage cash flow and stay profitable",
    emoji: "🚀",
    path: "/student/entrepreneurship/startup-survival",
    reward: 200,
    difficulty: "medium" as const,
    concept: "Cash Flow Management"
  },
  {
    title: "Customer First",
    description: "Listen to feedback and improve your product each round",
    emoji: "👥",
    path: "/student/entrepreneurship/customer-first",
    reward: 150,
    difficulty: "easy" as const,
    concept: "Customer Feedback Loop"
  },
];

export default function EntrepreneurshipPage() {
  const navigate = useNavigate();

  return (
    <SubjectLayout
      title="Entrepreneurship"
      icon={Lightbulb}
      iconColor="text-accent"
      progress={0}
      totalLessons={5}
      completedLessons={0}
      xpEarned={0}
    >
      <div className="slide-up" style={{ animationDelay: "150ms" }}>
        <h3 className="mb-4 font-heading font-semibold text-foreground">
          🎮 Gamified Learning
        </h3>
        <p className="text-sm text-muted-foreground mb-6">
          Master entrepreneurship through interactive games. Each game teaches real business concepts through hands-on play!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4">
          {entrepreneurshipGames.map((game, index) => (
            <div
              key={game.title}
              className="slide-up"
              style={{ animationDelay: `${200 + index * 50}ms` }}
            >
              <div
                onClick={() => navigate(game.path)}
                className="cursor-pointer group h-full"
              >
                <div className="relative rounded-2xl overflow-hidden border-2 border-accent/30 bg-gradient-to-br from-accent/10 to-accent/5 p-6 hover:border-accent/60 hover:shadow-glow transition-all duration-300 glass-card touch-scale flex flex-col">
                  {/* Background decoration */}
                  <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full blur-2xl opacity-20 bg-accent/30" />

                  <div className="relative z-10 flex flex-col h-full">
                    {/* Game Emoji */}
                    <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">
                      {game.emoji}
                    </div>

                    {/* Game Title */}
                    <h4 className="font-heading font-bold text-2xl text-foreground mb-2">
                      {game.title}
                    </h4>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground mb-2">
                      {game.description}
                    </p>

                    {/* Concept Badge */}
                    <div className="inline-block mb-4">
                      <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium">
                        🧠 {game.concept}
                      </span>
                    </div>

                    {/* Spacer */}
                    <div className="flex-1" />

                    {/* Game Stats */}
                    <div className="flex items-center justify-between mb-4 mt-4">
                      <div className="flex gap-2">
                        <span className="inline-block px-2 py-1 rounded-full bg-accent/20 text-accent text-xs font-medium">
                          🏆 {game.reward} XP
                        </span>
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                            game.difficulty === "easy"
                              ? "bg-green-500/20 text-green-600"
                              : game.difficulty === "medium"
                                ? "bg-yellow-500/20 text-yellow-600"
                                : "bg-red-500/20 text-red-600"
                          }`}
                        >
                          {game.difficulty === "easy"
                            ? "🟢 Easy"
                            : game.difficulty === "medium"
                              ? "🟡 Medium"
                              : "🔴 Hard"}
                        </span>
                      </div>
                    </div>

                    {/* Play Button */}
                    <button className="w-full py-2 bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 text-accent-foreground font-semibold rounded-lg transition-all transform hover:scale-105">
                      👉 Play Game
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SubjectLayout>
  );
}
