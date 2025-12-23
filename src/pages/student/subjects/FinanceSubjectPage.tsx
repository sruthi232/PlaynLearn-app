import { AppLayout } from "@/components/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AnimatedProgress } from "@/components/ui/animated-progress";
import { GameBadge } from "@/components/ui/game-badge";
import { GameIntroModal, GameContainer } from "@/components/games";
import {
  Wallet,
  Play,
  Star,
  Trophy,
  Zap,
  ChevronRight,
  Target,
  BookOpen,
  Gamepad2,
  Home,
  Lock,
  CheckCircle2
} from "lucide-react";
import { useState } from "react";

import {
  RealLifeBudgetSurvival,
  MarketPriceNegotiator,
  SavingsTree,
  BankInterestSimulator,
  MicroBusinessBuilder,
  DigitalMoneyChoices,
  MoneyFlowVisualizer,
  GuidedSorter,
  TimelineComparison,
  InterestStory,
} from "@/components/games";

interface GameCard {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  xp: number;
  coins: number;
  difficulty: "easy" | "medium" | "hard";
  status: "available" | "locked" | "completed";
  route: string;
  introConfig: {
    conceptName: string;
    concept: string;
    whatYouLearn: string[];
    howToPlay: string[];
    outcome: string;
  };
  component: React.ComponentType<{ onComplete: (score: number) => void }>;
  instructions: string;
  conceptLearned: string;
  stars?: number;
}

const financeGames: GameCard[] = [
  {
    id: "budget-survival",
    name: "Real Life Budget Survival",
    description: "Manage ₹3000 monthly salary with smart decisions",
    icon: Home,
    xp: 200,
    coins: 60,
    difficulty: "hard",
    status: "available",
    route: "/student/finance/game/budget-survival",
    component: RealLifeBudgetSurvival,
    instructions:
      "You get ₹3,000 salary monthly. Fixed expenses auto-deduct (rent, food, school). Random events appear (phone repair, gifts, medical). Choose to pay, delay, or skip. Win by ending with ₹500+ savings!",
    conceptLearned:
      "Budgeting means prioritizing needs over wants. Every expense decision has consequences. Build stress by delaying payments, save money by skipping optional items.",
    introConfig: {
      conceptName: "Real Life Budget Survival",
      concept: "Monthly Budgeting & Trade-offs",
      whatYouLearn: [
        "Manage a real monthly budget",
        "Understand fixed vs random expenses",
        "Make smart trade-off decisions",
      ],
      howToPlay: [
        "Receive ₹3,000 at month start",
        "Pay rent (₹1500), food (₹800), school (₹500)",
        "Random events appear during the month",
        "Choose: Pay now, delay payment, or skip",
        "End month with ₹500+ to win!",
      ],
      outcome:
        "You'll master real-world budgeting and understand that smart choices = financial stability!",
    },
  },
  {
    id: "price-negotiator",
    name: "Market Price Negotiator",
    description: "Compare 3 sellers and pick the best value",
    icon: Target,
    xp: 150,
    coins: 50,
    difficulty: "medium",
    status: "available",
    route: "/student/finance/game/price-negotiator",
    component: MarketPriceNegotiator,
    instructions:
      "Compare prices from 3 different sellers. Calculate price per unit, not just total price. Watch out for hidden costs! Pick the smartest deal.",
    conceptLearned:
      "Cheapest ≠ Best value. Always calculate price per unit. Sometimes premium quality is worth the extra cost. Smart shopping saves real money!",
    introConfig: {
      conceptName: "Market Price Negotiator",
      concept: "Value vs Price",
      whatYouLearn: [
        "Calculate price per unit",
        "Identify hidden costs",
        "Choose best value deals",
      ],
      howToPlay: [
        "See 3 shopping scenarios",
        "Each has 3 sellers with different prices/quantities",
        "Calculate ₹/unit for each option",
        "Pick the best value!",
      ],
      outcome:
        "You'll become a smart shopper who finds real value, not just low prices!",
    },
  },
  {
    id: "savings-tree",
    name: "Savings Tree",
    description: "Grow a tree through 30 days of consistent saving",
    icon: Zap,
    xp: 150,
    coins: 50,
    difficulty: "medium",
    status: "available",
    route: "/student/finance/game/savings-tree",
    component: SavingsTree,
    instructions:
      "Save ₹100 every day for 30 consecutive days. Miss even one day and your tree wilts! Watch how consistency beats big one-time savings.",
    conceptLearned:
      "Discipline beats intensity. ₹100 daily for 30 days = ₹3,000. One ₹3,000 deposit without follow-up = nothing gained. Small daily habits create real wealth!",
    introConfig: {
      conceptName: "Savings Tree",
      concept: "Consistency Over Amount",
      whatYouLearn: [
        "Save ₹100 daily for 30 days",
        "Build a healthy savings tree",
        "Learn discipline pays off",
      ],
      howToPlay: [
        "Each day, choose: Save ₹100 or Skip",
        "Save daily = tree grows, leaves appear",
        "Skip a day = tree wilts, leaves fall",
        "Get 30 consecutive saves to win!",
      ],
      outcome:
        "You'll understand that small daily actions compound into real wealth!",
    },
  },
  {
    id: "interest-simulator",
    name: "Bank Interest Simulator",
    description: "Deposit money and watch interest grow it over time",
    icon: Wallet,
    xp: 200,
    coins: 60,
    difficulty: "medium",
    status: "available",
    route: "/student/finance/game/interest-simulator",
    component: BankInterestSimulator,
    instructions:
      "Deposit money into your bank account. Use the time slider to see your money grow through 5% annual interest. Withdraw at any time!",
    conceptLearned:
      "Banks pay you for saving (interest). More time + more money = exponential growth. This is how wealth compounds. Start early to maximize growth!",
    introConfig: {
      conceptName: "Bank Interest Simulator",
      concept: "Time Value of Money",
      whatYouLearn: [
        "Deposit multiple amounts",
        "Watch interest multiply your money",
        "Understand compound growth",
      ],
      howToPlay: [
        "Make deposits into your bank account",
        "Slide time from month 0 to 24",
        "Watch interest grow your balance",
        "Withdraw anytime to see your returns!",
      ],
      outcome:
        "You'll see how patience + banks = wealth creation! Start saving today!",
    },
  },
  {
    id: "business-builder",
    name: "Micro Business Builder",
    description: "Run a juice stall: buy inventory, set prices, maximize profit",
    icon: Trophy,
    xp: 200,
    coins: 60,
    difficulty: "hard",
    status: "available",
    route: "/student/finance/game/business-builder",
    component: MicroBusinessBuilder,
    instructions:
      "You have ₹1,000. Buy juice bottles (₹30 each). Set your selling price. Customers buy more at low prices but with low profit. Find the perfect price for 7 days!",
    conceptLearned:
      "Profit = Revenue - Cost. Low price = high volume, low profit per item. High price = fewer sales, high profit per item. Smart businesses find the sweet spot!",
    introConfig: {
      conceptName: "Micro Business Builder",
      concept: "Profit & Loss Logic",
      whatYouLearn: [
        "Buy inventory with budget",
        "Set competitive prices",
        "Manage profit margins",
      ],
      howToPlay: [
        "Start with ₹1,000 cash",
        "Buy juice bottles at ₹30 each",
        "Set your selling price",
        "Run for 7 days, see profits grow!",
      ],
      outcome:
        "You'll learn that profit comes from smart pricing strategy, not just volume!",
    },
  },
  {
    id: "money-choices",
    name: "Digital Money Choices",
    description: "Choose the right payment method for each situation",
    icon: Wallet,
    xp: 150,
    coins: 50,
    difficulty: "easy",
    status: "available",
    route: "/student/finance/game/money-choices",
    component: DigitalMoneyChoices,
    instructions:
      "Face 5 real-world scenarios. Choose: Cash, UPI, or Card? Each has pros and cons. Pick the right method for each situation!",
    conceptLearned:
      "Cash = instant, fee-free, risky. UPI = fast, secure, online-only. Card = traceable, safe, possible fees. Different situations need different tools!",
    introConfig: {
      conceptName: "Digital Money Choices",
      concept: "Payment Methods Wisdom",
      whatYouLearn: [
        "When to use cash vs digital",
        "Pros and cons of each method",
        "Safety in transactions",
      ],
      howToPlay: [
        "Read 5 shopping scenarios",
        "Choose: Cash (💵), UPI (📱), or Card (💳)",
        "Get feedback on your choice",
        "Learn the right times for each!",
      ],
      outcome:
        "You'll be a payment expert who chooses the smart option every time!",
    },
  },
];

interface ActiveLearningModule {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  component: React.ComponentType;
  xp: number;
  coins: number;
}

const activeLearningModules: ActiveLearningModule[] = [
  {
    id: "money-flow",
    name: "Money Flow Explorer",
    description: "Understand where your money goes",
    icon: Wallet,
    component: MoneyFlowVisualizer,
    xp: 100,
    coins: 30
  },
  {
    id: "need-vs-want",
    name: "Need vs Want Sorter",
    description: "Learn to distinguish needs from wants",
    icon: Target,
    component: GuidedSorter,
    xp: 150,
    coins: 40
  },
  {
    id: "timeline",
    name: "Saving vs Spending",
    description: "See 30 days of compound decisions",
    icon: Zap,
    component: TimelineComparison,
    xp: 150,
    coins: 40
  },
  {
    id: "interest-story",
    name: "How Banks Work",
    description: "Explore the power of interest",
    icon: Wallet,
    component: InterestStory,
    xp: 200,
    coins: 60
  }
];

interface PassiveLearningChapter {
  chapter: number;
  title: string;
  duration: string;
}

const passiveLearningChapters: PassiveLearningChapter[] = [
  { chapter: 1, title: "Introduction to Money", duration: "5 min" },
  { chapter: 2, title: "Understanding Savings", duration: "7 min" },
  { chapter: 3, title: "Banking Basics", duration: "6 min" }
];

type LearningMode = "active" | "passive" | "gamified";

export default function FinanceSubjectPage() {
  const [learningMode, setLearningMode] = useState<LearningMode>("active");
  const [selectedGame, setSelectedGame] = useState<GameCard | null>(null);
  const [showIntro, setShowIntro] = useState(false);
  const [playingGame, setPlayingGame] = useState<GameCard | null>(null);
  const [activeModule, setActiveModule] = useState<ActiveLearningModule | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<PassiveLearningChapter | null>(null);
  const totalProgress = 65;

  const handlePlayGame = (game: GameCard) => {
    setSelectedGame(game);
    setShowIntro(true);
  };

  const handleStartGame = () => {
    if (selectedGame) {
      setShowIntro(false);
      setPlayingGame(selectedGame);
    }
  };

  const handleGoBack = () => {
    setShowIntro(false);
    setSelectedGame(null);
  };

  const handleGameComplete = () => {
    setPlayingGame(null);
    setSelectedGame(null);
  };

  const handleExitGame = () => {
    setPlayingGame(null);
    setSelectedGame(null);
  };

  // Show chapter view
  if (selectedChapter) {
    return (
      <AppLayout role="student" playCoins={1250} title={`Chapter ${selectedChapter.chapter}: ${selectedChapter.title}`}>
        <div className="px-4 py-6 pb-24">
          <div className="mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedChapter(null)}
              className="flex items-center gap-2 mb-4"
            >
              <ChevronRight className="h-4 w-4 transform rotate-180" />
              Back to Passive Learning
            </Button>
          </div>

          {/* Chapter Content */}
          <div className="glass-card rounded-2xl p-6 border border-secondary/30 bg-gradient-to-br from-secondary/10 to-secondary/5">
            <div className="flex items-start gap-4 mb-6">
              <div className="h-16 w-16 rounded-xl bg-secondary/20 flex items-center justify-center shrink-0">
                <BookOpen className="h-8 w-8 text-secondary" />
              </div>
              <div className="flex-1">
                <h1 className="font-heading text-3xl font-bold text-foreground mb-2">
                  Chapter {selectedChapter.chapter}: {selectedChapter.title}
                </h1>
                <p className="text-sm text-muted-foreground">📖 {selectedChapter.duration} read time</p>
              </div>
            </div>

            {/* Chapter Body */}
            <div className="prose prose-invert max-w-none mb-8">
              <div className="space-y-4 text-foreground/90">
                {selectedChapter.chapter === 1 && (
                  <>
                    <h2 className="font-heading text-2xl font-bold text-foreground mt-6 mb-3">What is Money?</h2>
                    <p>Money is a medium of exchange that allows us to trade goods and services without barter. Throughout history, money has evolved from commodity-based systems to modern digital forms.</p>

                    <h3 className="font-heading text-lg font-semibold text-foreground mt-5 mb-2">Key Concepts:</h3>
                    <ul className="space-y-2 ml-4">
                      <li>• <strong>Currency:</strong> The form of money used in a specific country</li>
                      <li>• <strong>Value:</strong> The worth of money in relation to goods and services</li>
                      <li>• <strong>Purchasing Power:</strong> How much you can buy with your money</li>
                    </ul>

                    <h3 className="font-heading text-lg font-semibold text-foreground mt-5 mb-2">Types of Money:</h3>
                    <ul className="space-y-2 ml-4">
                      <li>• <strong>Cash:</strong> Physical coins and notes</li>
                      <li>• <strong>Digital Money:</strong> Transfers, cards, and mobile payments</li>
                      <li>• <strong>Cryptocurrency:</strong> Digital currencies like Bitcoin</li>
                    </ul>
                  </>
                )}

                {selectedChapter.chapter === 2 && (
                  <>
                    <h2 className="font-heading text-2xl font-bold text-foreground mt-6 mb-3">Understanding Savings</h2>
                    <p>Savings is the practice of setting aside money for future use instead of spending it immediately. It's one of the most important financial habits you can develop.</p>

                    <h3 className="font-heading text-lg font-semibold text-foreground mt-5 mb-2">Why Save?</h3>
                    <ul className="space-y-2 ml-4">
                      <li>• Build an emergency fund for unexpected expenses</li>
                      <li>• Plan for future goals (education, travel, housing)</li>
                      <li>• Create financial security and reduce stress</li>
                      <li>• Earn interest on your savings</li>
                    </ul>

                    <h3 className="font-heading text-lg font-semibold text-foreground mt-5 mb-2">Saving Strategies:</h3>
                    <ul className="space-y-2 ml-4">
                      <li>• <strong>Pay Yourself First:</strong> Save before spending</li>
                      <li>• <strong>Set Goals:</strong> Know what you're saving for</li>
                      <li>• <strong>Automate:</strong> Set up automatic transfers to savings</li>
                      <li>• <strong>Track Progress:</strong> Monitor your savings growth</li>
                    </ul>

                    <h3 className="font-heading text-lg font-semibold text-foreground mt-5 mb-2">Interest & Compound Growth:</h3>
                    <p>When you keep money in a bank account, the bank pays you interest. Compound interest means you earn interest on your interest, which grows your savings exponentially over time.</p>
                  </>
                )}

                {selectedChapter.chapter === 3 && (
                  <>
                    <h2 className="font-heading text-2xl font-bold text-foreground mt-6 mb-3">Banking Basics</h2>
                    <p>Banks are institutions that safely store your money and provide financial services to help you manage your wealth.</p>

                    <h3 className="font-heading text-lg font-semibold text-foreground mt-5 mb-2">What Banks Do:</h3>
                    <ul className="space-y-2 ml-4">
                      <li>• Safe storage of your money</li>
                      <li>• Provide savings and checking accounts</li>
                      <li>• Offer loans and credit products</li>
                      <li>• Process payments and transfers</li>
                      <li>• Pay interest on deposits</li>
                    </ul>

                    <h3 className="font-heading text-lg font-semibold text-foreground mt-5 mb-2">Types of Bank Accounts:</h3>
                    <ul className="space-y-2 ml-4">
                      <li>• <strong>Savings Account:</strong> For saving money and earning interest</li>
                      <li>• <strong>Checking Account:</strong> For everyday transactions</li>
                      <li>• <strong>Student Account:</strong> Special accounts for students</li>
                    </ul>

                    <h3 className="font-heading text-lg font-semibold text-foreground mt-5 mb-2">Digital Banking:</h3>
                    <p>Modern banks offer digital services like mobile apps, UPI transfers, and online banking that make managing your money convenient and secure.</p>

                    <h3 className="font-heading text-lg font-semibold text-foreground mt-5 mb-2">Bank Safety:</h3>
                    <p>Your deposits are protected by the government. Most countries have deposit insurance that guarantees your money is safe even if the bank fails.</p>
                  </>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-6 border-t border-secondary/30">
              <Button
                onClick={() => setSelectedChapter(null)}
                variant="outline"
                className="flex-1"
              >
                Back to Chapters
              </Button>
              <Button
                className="flex-1 bg-secondary hover:bg-secondary/90"
              >
                Mark as Complete
              </Button>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  // Show active module view
  if (activeModule) {
    const ModuleComponent = activeModule.component;
    return (
      <AppLayout role="student" playCoins={1250} title={activeModule.name}>
        <div className="px-4 py-6 pb-24">
          <div className="mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveModule(null)}
              className="flex items-center gap-2 mb-4"
            >
              <ChevronRight className="h-4 w-4 transform rotate-180" />
              Back to Active Learning
            </Button>
          </div>
          <div className="w-full h-full rounded-lg border border-border bg-card overflow-hidden">
            <ModuleComponent />
          </div>
        </div>
      </AppLayout>
    );
  }

  // Show active game view
  if (playingGame) {
    const GameComponent = playingGame.component;
    return (
      <AppLayout role="student" playCoins={1250} title={playingGame.name}>
        <div className="px-4 py-6 pb-24">
          <GameContainer
            gameComponent={
              <GameComponent onComplete={handleGameComplete} />
            }
            instructions={playingGame.instructions}
            conceptLearned={playingGame.conceptLearned}
            onRetry={() => setPlayingGame(playingGame)}
            onExit={handleExitGame}
            gameName={playingGame.name}
          />
        </div>
      </AppLayout>
    );
  }


  // ACTIVE LEARNING PAGE
  if (learningMode === "active") {
    return (
      <AppLayout role="student" playCoins={1250} title="Finance">
        <div className="px-4 py-6 pb-24">
          {/* Subject Header */}
          <div className="mb-6 slide-up">
            <div className="glass-card rounded-2xl p-5 border border-border bg-gradient-to-br from-accent/20 to-accent/5">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-16 w-16 rounded-2xl bg-accent/30 flex items-center justify-center">
                  <Wallet className="h-8 w-8 text-accent" />
                </div>
                <div className="flex-1">
                  <h2 className="font-heading text-2xl font-bold text-foreground">Finance</h2>
                  <p className="text-sm text-muted-foreground">Master your money skills</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-semibold text-accent">{totalProgress}%</span>
                </div>
                <AnimatedProgress value={totalProgress} variant="default" />
              </div>
            </div>
          </div>

          {/* Learning Mode Navigation */}
          <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
            <Button
              onClick={() => setLearningMode("active")}
              className={`flex items-center gap-2 whitespace-nowrap ${
                learningMode === "active"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
              size="sm"
            >
              <Target className="h-4 w-4" />
              Active
            </Button>
            <Button
              onClick={() => setLearningMode("passive")}
              className={`flex items-center gap-2 whitespace-nowrap ${
                learningMode === "passive"
                  ? "bg-secondary text-secondary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
              size="sm"
            >
              <BookOpen className="h-4 w-4" />
              Passive
            </Button>
            <Button
              onClick={() => setLearningMode("gamified")}
              className={`flex items-center gap-2 whitespace-nowrap ${
                learningMode === "gamified"
                  ? "bg-accent text-accent-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
              size="sm"
            >
              <Gamepad2 className="h-4 w-4" />
              Gamified
            </Button>
          </div>

          {/* Section Header */}
          <div className="mb-6 slide-up">
            <h2 className="font-heading text-2xl font-bold text-foreground flex items-center gap-3 mb-2">
              <Target className="h-7 w-7 text-primary" />
              Active Learning
            </h2>
            <p className="text-muted-foreground">Build mental models through guided exploration</p>
          </div>

          {/* Active Learning Modules - Vertical List */}
          <div className="space-y-4">
            {activeLearningModules.map((module, index) => {
              const Icon = module.icon;
              return (
                <Card
                  key={module.id}
                  className="glass-card border border-primary/30 p-4 hover:border-primary/60 transition-colors cursor-pointer slide-up"
                  style={{ animationDelay: `${100 + index * 75}ms` }}
                  onClick={() => setActiveModule(module)}
                >
                  <div className="flex items-start gap-4">
                    <div className="h-14 w-14 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>

                    <div className="flex-1">
                      <h4 className="font-heading font-semibold text-foreground mb-1">
                        {module.name}
                      </h4>
                      <p className="text-sm text-muted-foreground mb-3">{module.description}</p>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-accent">+{module.coins} 🪙</span>
                        <span className="text-xs text-primary">+{module.xp} XP</span>
                      </div>
                    </div>

                    <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0 mt-1" />
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </AppLayout>
    );
  }

  // PASSIVE LEARNING PAGE
  if (learningMode === "passive") {
    return (
      <AppLayout role="student" playCoins={1250} title="Finance">
        <div className="px-4 py-6 pb-24">
          {/* Subject Header */}
          <div className="mb-6 slide-up">
            <div className="glass-card rounded-2xl p-5 border border-border bg-gradient-to-br from-accent/20 to-accent/5">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-16 w-16 rounded-2xl bg-accent/30 flex items-center justify-center">
                  <Wallet className="h-8 w-8 text-accent" />
                </div>
                <div className="flex-1">
                  <h2 className="font-heading text-2xl font-bold text-foreground">Finance</h2>
                  <p className="text-sm text-muted-foreground">Master your money skills</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-semibold text-accent">{totalProgress}%</span>
                </div>
                <AnimatedProgress value={totalProgress} variant="default" />
              </div>
            </div>
          </div>

          {/* Learning Mode Navigation */}
          <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
            <Button
              onClick={() => setLearningMode("active")}
              className={`flex items-center gap-2 whitespace-nowrap ${
                learningMode === "active"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
              size="sm"
            >
              <Target className="h-4 w-4" />
              Active
            </Button>
            <Button
              onClick={() => setLearningMode("passive")}
              className={`flex items-center gap-2 whitespace-nowrap ${
                learningMode === "passive"
                  ? "bg-secondary text-secondary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
              size="sm"
            >
              <BookOpen className="h-4 w-4" />
              Passive
            </Button>
            <Button
              onClick={() => setLearningMode("gamified")}
              className={`flex items-center gap-2 whitespace-nowrap ${
                learningMode === "gamified"
                  ? "bg-accent text-accent-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
              size="sm"
            >
              <Gamepad2 className="h-4 w-4" />
              Gamified
            </Button>
          </div>

          {/* Section Header */}
          <div className="mb-6 slide-up">
            <h2 className="font-heading text-2xl font-bold text-foreground flex items-center gap-3 mb-2">
              <BookOpen className="h-7 w-7 text-secondary" />
              Passive Learning
            </h2>
            <p className="text-muted-foreground">Explore concepts at your own pace</p>
          </div>

          {/* Chapters - Vertical List */}
          <div className="space-y-4">
            {passiveLearningChapters.map((item, index) => (
              <Card
                key={item.chapter}
                className="glass-card border border-secondary/30 p-4 hover:border-secondary/60 transition-colors cursor-pointer slide-up"
                style={{ animationDelay: `${100 + index * 75}ms` }}
                onClick={() => setSelectedChapter(item)}
              >
                <div className="flex items-start gap-4">
                  <div className="h-14 w-14 rounded-xl bg-secondary/20 flex items-center justify-center shrink-0">
                    <BookOpen className="h-6 w-6 text-secondary" />
                  </div>

                  <div className="flex-1">
                    <h4 className="font-heading font-semibold text-foreground">
                      Chapter {item.chapter}: {item.title}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-2">📖 {item.duration} read</p>
                  </div>

                  <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0 mt-1" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </AppLayout>
    );
  }

  // GAMIFIED LEARNING PAGE - Vertical full-width game cards matching Biology
  if (learningMode === "gamified") {
    return (
      <AppLayout role="student" playCoins={1250} title="Finance">
        <div className="px-4 py-6 pb-24">
          {/* Subject Header */}
          <div className="mb-6 slide-up">
            <div className="glass-card rounded-2xl p-5 border border-border bg-gradient-to-br from-accent/20 to-accent/5">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-16 w-16 rounded-2xl bg-accent/30 flex items-center justify-center">
                  <Wallet className="h-8 w-8 text-accent" />
                </div>
                <div className="flex-1">
                  <h2 className="font-heading text-2xl font-bold text-foreground">Finance</h2>
                  <p className="text-sm text-muted-foreground">Master your money skills</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-semibold text-accent">{totalProgress}%</span>
                </div>
                <AnimatedProgress value={totalProgress} variant="default" />
              </div>
            </div>
          </div>

          {/* Learning Mode Navigation */}
          <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
            <Button
              onClick={() => setLearningMode("active")}
              className={`flex items-center gap-2 whitespace-nowrap ${
                learningMode === "active"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
              size="sm"
            >
              <Target className="h-4 w-4" />
              Active
            </Button>
            <Button
              onClick={() => setLearningMode("passive")}
              className={`flex items-center gap-2 whitespace-nowrap ${
                learningMode === "passive"
                  ? "bg-secondary text-secondary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
              size="sm"
            >
              <BookOpen className="h-4 w-4" />
              Passive
            </Button>
            <Button
              onClick={() => setLearningMode("gamified")}
              className={`flex items-center gap-2 whitespace-nowrap ${
                learningMode === "gamified"
                  ? "bg-accent text-accent-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
              size="sm"
            >
              <Gamepad2 className="h-4 w-4" />
              Gamified
            </Button>
          </div>

          {/* Section Header */}
          <div className="mb-6 slide-up">
            <h2 className="font-heading text-2xl font-bold text-foreground flex items-center gap-3 mb-2">
              <Gamepad2 className="h-7 w-7 text-accent" />
              Finance Games
            </h2>
            <p className="text-muted-foreground">Learn money skills by playing</p>
          </div>

          {/* Game Cards - Vertical List */}
          <div className="space-y-4">
            {financeGames.map((game, index) => {
              const Icon = game.icon;
              const difficultyColor = {
                easy: "bg-green-500/20 text-green-600",
                medium: "bg-yellow-500/20 text-yellow-600",
                hard: "bg-red-500/20 text-red-600"
              };

              return (
                <Card 
                  key={game.id}
                  className={`glass-card border p-4 slide-up ${
                    game.status === "locked" ? "border-border opacity-60" : "border-accent/30"
                  }`}
                  style={{ animationDelay: `${100 + index * 50}ms` }}
                >
                  <div className="flex items-start gap-4">
                    <div className={`h-14 w-14 rounded-xl flex items-center justify-center shrink-0 ${
                      game.status === "completed" 
                        ? "bg-secondary" 
                        : game.status === "available"
                        ? "bg-accent/20"
                        : "bg-muted"
                    }`}>
                      {game.status === "locked" ? (
                        <Lock className="h-6 w-6 text-muted-foreground" />
                      ) : game.status === "completed" ? (
                        <CheckCircle2 className="h-6 w-6 text-secondary-foreground" />
                      ) : (
                        <Icon className="h-6 w-6 text-accent" />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-heading font-semibold text-foreground">
                            {game.name}
                          </h4>
                          <p className="text-sm text-muted-foreground">{game.description}</p>
                        </div>
                        <Badge className={`text-xs capitalize shrink-0 ml-2 ${difficultyColor[game.difficulty]}`}>
                          {game.difficulty}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-2 mt-3 flex-wrap">
                        <span className="text-xs text-accent">+{game.coins} 🪙</span>
                        <span className="text-xs text-primary">+{game.xp} XP</span>
                      </div>

                      {game.status === "completed" && game.stars && (
                        <div className="flex items-center gap-1 mt-2">
                          {[1, 2, 3].map((star) => (
                            <Star 
                              key={star}
                              className={`h-4 w-4 ${
                                star <= game.stars! ? "text-accent fill-accent" : "text-muted-foreground"
                              }`}
                            />
                          ))}
                        </div>
                      )}

                      {game.status !== "locked" && (
                        <Button
                          onClick={() => handlePlayGame(game)}
                          className="mt-3 w-full bg-accent hover:bg-accent/90"
                          size="sm"
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Play Game
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Game Intro Modal */}
        {selectedGame && (
          <GameIntroModal
            isOpen={showIntro}
            config={{
              ...selectedGame.introConfig,
              gameIcon: selectedGame.icon,
            }}
            onStartGame={handleStartGame}
            onGoBack={handleGoBack}
          />
        )}
      </AppLayout>
    );
  }
}
