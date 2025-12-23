import { SubjectLayout } from "@/components/student/SubjectLayout";
import { GameCard } from "@/components/ui/game-card";
import { VillageLightUp, DebugDungeon, SystemBuilder } from "@/components/games";
import { Laptop, Zap, Bug, Cog } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const techGames = [
  {
    title: "Village Light-Up",
    description: "Complete electrical circuits to light up the festival",
    emoji: "⚡",
    icon: Zap,
    path: "/student/technology/village-light-up",
    reward: 150,
    difficulty: "easy" as const,
  },
  {
    title: "System Builder",
    description: "Arrange steps in the correct order to make systems work",
    emoji: "🧩",
    icon: Cog,
    path: "/student/technology/system-builder",
    reward: 165,
    difficulty: "medium" as const,
  },
  {
    title: "Debug Dungeon",
    description: "Find and fix logical errors to escape the dungeon",
    emoji: "🐉",
    icon: Bug,
    path: "/student/technology/debug-dungeon",
    reward: 155,
    difficulty: "medium" as const,
  },
];

export default function TechnologyPage() {
  const navigate = useNavigate();

  return (
    <SubjectLayout
      title="Technology"
      icon={Laptop}
      iconColor="text-primary"
      progress={30}
      totalLessons={3}
      completedLessons={0}
      xpEarned={0}
    >
      <div className="slide-up" style={{ animationDelay: "150ms" }}>
        <h3 className="mb-4 font-heading font-semibold text-foreground">
          🎮 Gamified Learning
        </h3>
        <p className="text-sm text-muted-foreground mb-6">
          Master technology thinking through interactive games. Each game teaches real concepts through hands-on play!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {techGames.map((game, index) => (
            <div
              key={game.title}
              className="slide-up"
              style={{ animationDelay: `${200 + index * 50}ms` }}
            >
              <div
                onClick={() => navigate(game.path)}
                className="cursor-pointer group"
              >
                <div className="relative rounded-2xl overflow-hidden border-2 border-primary/30 bg-gradient-to-br from-primary/10 to-primary/5 p-6 hover:border-primary/60 hover:shadow-glow transition-all duration-300 glass-card touch-scale h-full">
                  {/* Background decoration */}
                  <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full blur-2xl opacity-20 bg-primary/30" />

                  <div className="relative z-10">
                    {/* Game Emoji */}
                    <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                      {game.emoji}
                    </div>

                    {/* Game Title */}
                    <h4 className="font-heading font-bold text-lg text-foreground mb-2">
                      {game.title}
                    </h4>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground mb-4">
                      {game.description}
                    </p>

                    {/* Game Stats */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex gap-2">
                        <span className="inline-block px-2 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium">
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
                      <span className="text-xl">⛶</span>
                    </div>

                    {/* Play Button */}
                    <button className="w-full py-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-semibold rounded-lg transition-all transform hover:scale-105">
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
