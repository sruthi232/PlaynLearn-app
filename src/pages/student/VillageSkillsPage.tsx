import { SubjectLayout } from "@/components/student/SubjectLayout";
import { GameCard } from "@/components/ui/game-card";
import { TreePine } from "lucide-react";
import { useNavigate } from "react-router-dom";

const villageSkillsGames = [
  {
    id: "smart-farmer",
    title: "Smart Farmer",
    subtitle: "Grow healthy crops with balanced care",
    emoji: "🌾",
    description: "Learn sustainable farming through resource management",
    reward: 100,
    difficulty: "medium" as const,
    path: "/student/village-skills/smart-farmer",
  },
  {
    id: "water-saver",
    title: "Water Saver Mission",
    subtitle: "Fix leaks and save water",
    emoji: "💧",
    description: "Conserve water by fixing household leaks",
    reward: 100,
    difficulty: "medium" as const,
    path: "/student/village-skills/water-saver",
  },
  {
    id: "market-manager",
    title: "Village Market Manager",
    subtitle: "Set fair prices and build trust",
    emoji: "🏪",
    description: "Learn economics through market pricing",
    reward: 100,
    difficulty: "hard" as const,
    path: "/student/village-skills/market-manager",
  },
];

export default function VillageSkillsPage() {
  const navigate = useNavigate();

  return (
    <SubjectLayout
      title="Village & Life Skills"
      icon={TreePine}
      iconColor="text-secondary"
      progress={0}
      totalLessons={3}
      completedLessons={0}
      xpEarned={0}
    >
      <div className="slide-up" style={{ animationDelay: "150ms" }}>
        <div className="mb-6 rounded-xl border border-secondary/30 bg-secondary/10 p-4">
          <p className="text-sm">
            🌱 Master village life skills through interactive games and real-world simulations!
          </p>
        </div>

        <h3 className="mb-4 font-heading font-semibold">🎮 Gamified Learning</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Each game teaches a practical life skill through hands-on simulation. Learn by doing!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {villageSkillsGames.map((game, index) => (
            <div
              key={game.id}
              className="slide-up"
              style={{ animationDelay: `${200 + index * 75}ms` }}
              onClick={() => navigate(game.path)}
            >
              <GameCard
                variant="secondary"
                size="lg"
                colorScheme="secondary"
                className="h-full cursor-pointer"
              >
                <div className="mb-4">
                  <div className="text-5xl mb-2">{game.emoji}</div>
                  <h3 className="font-heading font-bold text-lg text-foreground mb-1">
                    {game.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{game.subtitle}</p>
                </div>

                <p className="text-xs text-muted-foreground mb-4 line-clamp-2">
                  {game.description}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-secondary/20">
                  <span className="inline-block px-2 py-1 rounded-full bg-secondary/20 text-secondary text-xs font-medium">
                    🏆 {game.reward} XP
                  </span>
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      game.difficulty === "medium"
                        ? "bg-yellow-500/20 text-yellow-600"
                        : "bg-red-500/20 text-red-600"
                    }`}
                  >
                    {game.difficulty === "medium" ? "🟡 Medium" : "🔴 Hard"}
                  </span>
                </div>

                <button className="w-full mt-4 py-2 bg-gradient-to-r from-secondary to-secondary/80 hover:from-secondary/90 hover:to-secondary/70 text-secondary-foreground font-semibold rounded-lg transition-all transform hover:scale-105">
                  ▶ Play Game
                </button>
              </GameCard>
            </div>
          ))}
        </div>
      </div>
    </SubjectLayout>
  );
}
