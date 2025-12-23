import { SubjectLayout } from "@/components/student/SubjectLayout";
import { GameMissionCard } from "@/components/student/GameMissionCard";
import {
  EquationBalance,
  FractionForge,
  PatternLock,
  GeometryBuilder,
  ProbabilityRun,
  PatternMaster,
  VillageBudgetPlanner,
  MathHeist,
  GroceryMarket,
  DailyMathSpin,
  PatternMasterGame,
  FarmYieldCalculator,
} from "@/components/games";
import {
  Calculator,
  Scale,
  PieChart,
  Lock,
  Square,
  Zap,
  Puzzle,
  PiggyBank,
  Vault,
  ShoppingCart,
  Loader,
  BarChart3,
  Sprout,
} from "lucide-react";
import { useState } from "react";

const mathGames = [
  {
    title: "Equation Balance",
    description: "Master linear equations by keeping both sides of the scale equal",
    icon: Scale,
    reward: 100,
    difficulty: "easy" as const,
    status: "available" as const,
    gameId: "balance",
  },
  {
    title: "Fraction Forge",
    description: "Build fractions perfectly by combining pieces of the whole",
    icon: PieChart,
    reward: 110,
    difficulty: "easy" as const,
    status: "available" as const,
    gameId: "fractions",
  },
  {
    title: "Pattern Lock",
    description: "Unlock the gate by predicting the next number in the sequence",
    icon: Lock,
    reward: 105,
    difficulty: "medium" as const,
    status: "available" as const,
    gameId: "lock",
  },
  {
    title: "Geometry Builder",
    description: "Build efficient shapes with the exact area and minimal perimeter",
    icon: Square,
    reward: 120,
    difficulty: "medium" as const,
    status: "available" as const,
    gameId: "geometry",
  },
  {
    title: "Probability Run",
    description: "Choose wisely between safe and risky paths based on probability",
    icon: Zap,
    reward: 125,
    difficulty: "hard" as const,
    status: "available" as const,
    gameId: "probability",
  },
  {
    title: "Pattern Master",
    description: "Unlock patterns with animated flows and limited attempts",
    icon: Puzzle,
    reward: 130,
    difficulty: "hard" as const,
    status: "available" as const,
    gameId: "pattern-master",
  },
  {
    title: "Village Budget Planner",
    description: "Balance family income with expenses, even with surprise events",
    icon: PiggyBank,
    reward: 135,
    difficulty: "hard" as const,
    status: "available" as const,
    gameId: "budget",
  },
  {
    title: "Math Heist",
    description: "Reach the exact target number using addition and subtraction cards",
    icon: Vault,
    reward: 150,
    difficulty: "easy" as const,
    status: "available" as const,
    gameId: "heist",
  },
  {
    title: "Grocery Market",
    description: "Weigh items and pay exact amounts using decimals and money",
    icon: ShoppingCart,
    reward: 160,
    difficulty: "medium" as const,
    status: "available" as const,
    gameId: "grocery",
  },
  {
    title: "Daily Math Spin",
    description: "Solve fast-paced spinning math problems and build your streak",
    icon: Loader,
    reward: 140,
    difficulty: "medium" as const,
    status: "available" as const,
    gameId: "spin",
  },
  {
    title: "Pattern Master Quest",
    description: "Complete number sequences by identifying the hidden pattern",
    icon: BarChart3,
    reward: 155,
    difficulty: "hard" as const,
    status: "available" as const,
    gameId: "pattern-quest",
  },
  {
    title: "Farm Yield Calculator",
    description: "Balance field size, seeds, and water to maximize crop yield",
    icon: Sprout,
    reward: 170,
    difficulty: "hard" as const,
    status: "available" as const,
    gameId: "farm",
  },
];

export default function MathematicsPage() {
  const [activeGame, setActiveGame] = useState<string | null>(null);

  const handleGameSelect = (gameId: string) => {
    setActiveGame(gameId);
  };

  const handleGameClose = () => {
    setActiveGame(null);
  };

  return (
    <>
      <SubjectLayout
        title="Mathematics"
        icon={Calculator}
        iconColor="text-badge"
        progress={65}
        totalLessons={7}
        completedLessons={0}
        xpEarned={0}
      >
        <div className="slide-up" style={{ animationDelay: "150ms" }}>
          <h3 className="mb-4 font-heading font-semibold">Gamified Learning Missions</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Master mathematical concepts through interactive puzzle games. Each game teaches one key concept through play.
          </p>
          <div className="space-y-3">
            {mathGames.map((game, index) => (
              <div
                key={game.gameId}
                className="slide-up"
                style={{ animationDelay: `${200 + index * 50}ms` }}
              >
                <GameMissionCard
                  title={game.title}
                  description={game.description}
                  icon={game.icon}
                  reward={game.reward}
                  difficulty={game.difficulty}
                  status={game.status}
                  onClick={() => handleGameSelect(game.gameId)}
                />
              </div>
            ))}
          </div>
        </div>
      </SubjectLayout>

      {/* Game Components */}
      {activeGame === "balance" && <EquationBalance onClose={handleGameClose} />}
      {activeGame === "fractions" && <FractionForge onClose={handleGameClose} />}
      {activeGame === "lock" && <PatternLock onClose={handleGameClose} />}
      {activeGame === "geometry" && <GeometryBuilder onClose={handleGameClose} />}
      {activeGame === "probability" && <ProbabilityRun onClose={handleGameClose} />}
      {activeGame === "pattern-master" && <PatternMaster onClose={handleGameClose} />}
      {activeGame === "budget" && <VillageBudgetPlanner onClose={handleGameClose} />}
      {activeGame === "heist" && <MathHeist onClose={handleGameClose} />}
      {activeGame === "grocery" && <GroceryMarket onClose={handleGameClose} />}
      {activeGame === "spin" && <DailyMathSpin onClose={handleGameClose} />}
      {activeGame === "pattern-quest" && <PatternMasterGame onClose={handleGameClose} />}
      {activeGame === "farm" && <FarmYieldCalculator onClose={handleGameClose} />}
    </>
  );
}
