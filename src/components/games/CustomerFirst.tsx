import React, { useState } from "react";
import { ChevronRight, ArrowLeft } from "lucide-react";

interface GameState {
  phase: "splash" | "selling" | "feedback" | "improvement" | "results";
  round: number;
  quality: number;
  design: number;
  durability: number;
  price: number;
  customerCount: number;
  satisfaction: number;
  revenue: number;
  totalRevenue: number;
  roundHistory: {
    round: number;
    satisfied: number;
    revenue: number;
    satisfaction: number;
  }[];
}

interface CustomerFeedback {
  name: string;
  emoji: string;
  complaint: string;
  weight: number;
}

const FEEDBACK_BANK: CustomerFeedback[] = [
  { name: "Ravi", emoji: "👨", complaint: "Pages come loose quickly", weight: 0.7 },
  { name: "Priya", emoji: "👩", complaint: "Too expensive for what you get", weight: 0.6 },
  { name: "Arjun", emoji: "👨‍💼", complaint: "Covers fade in sunlight", weight: 0.5 },
  { name: "Neha", emoji: "👧", complaint: "Colors are too dull", weight: 0.4 },
  { name: "Dev", emoji: "👨", complaint: "Paper quality isn't great", weight: 0.5 }
];

export function CustomerFirst({ onComplete, onBack }: { onComplete: (score: number) => void; onBack?: () => void }) {
  const [gameState, setGameState] = useState<GameState>({
    phase: "splash",
    round: 1,
    quality: 6,
    design: 5,
    durability: 7,
    price: 50,
    customerCount: 50,
    satisfaction: 4,
    revenue: 0,
    totalRevenue: 0,
    roundHistory: []
  });

  const [selectedFeedback, setSelectedFeedback] = useState<string | null>(null);
  const [showingFeedback, setShowingFeedback] = useState(false);
  const [improvementCost, setImprovementCost] = useState(0);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const handleBackPress = () => {
    // Show confirmation only if game is in progress
    if ((gameState.phase === "selling" && gameState.roundHistory.length > 0) ||
        (gameState.phase === "feedback" && gameState.roundHistory.length > 0) ||
        (gameState.phase === "improvement" && gameState.roundHistory.length > 0)) {
      setShowExitConfirm(true);
    } else if (onBack) {
      onBack();
    }
  };

  const handleStartGame = () => {
    setGameState(prev => ({ ...prev, phase: "selling" }));
  };

  const handleSellRound = () => {
    // Calculate revenue based on current stats
    const qualityScore = (gameState.quality + gameState.durability + gameState.design) / 30;
    const priceAdjustment = Math.pow(1 - (gameState.price - 40) / 100, 1.5);
    const customersToday = Math.floor(gameState.customerCount * priceAdjustment * (0.8 + Math.random() * 0.4));
    const roundRevenue = customersToday * gameState.price;
    const roundSatisfaction = Math.min(5, Math.floor(qualityScore * 5));

    setGameState(prev => ({
      ...prev,
      customerCount: customersToday,
      revenue: roundRevenue,
      totalRevenue: prev.totalRevenue + roundRevenue,
      satisfaction: roundSatisfaction,
      phase: "feedback",
      roundHistory: [
        ...prev.roundHistory,
        {
          round: prev.round,
          satisfied: customersToday,
          revenue: roundRevenue,
          satisfaction: roundSatisfaction
        }
      ]
    }));

    setShowingFeedback(true);
  };

  const handleSelectImprovement = (improvement: string) => {
    setSelectedFeedback(improvement);

    let newState = { ...gameState };
    let cost = 0;

    switch (improvement) {
      case "durability":
        newState.durability = Math.min(10, gameState.durability + 2);
        cost = 100;
        break;
      case "price":
        // Price adjustment happens in the next round
        cost = 0;
        break;
      case "design":
        newState.design = Math.min(10, gameState.design + 2);
        cost = 50;
        break;
    }

    setImprovementCost(cost);
    setGameState(prev => ({
      ...prev,
      phase: "improvement"
    }));
  };

  const handleConfirmImprovement = () => {
    let newState = { ...gameState };

    if (selectedFeedback === "durability") {
      newState.durability = Math.min(10, gameState.durability + 2);
    } else if (selectedFeedback === "design") {
      newState.design = Math.min(10, gameState.design + 2);
    } else if (selectedFeedback === "price") {
      newState.price = Math.max(20, gameState.price - 10);
    }

    const nextRound = gameState.round + 1;

    if (nextRound > 3) {
      // Calculate final score
      const avgSatisfaction = gameState.roundHistory.reduce((sum, h) => sum + h.satisfaction, 0) / gameState.roundHistory.length;
      const finalScore = Math.floor((avgSatisfaction * 100) + (gameState.totalRevenue / 10));
      setGameState(prev => ({ ...prev, phase: "results" }));
    } else {
      setGameState(prev => ({
        ...prev,
        round: nextRound,
        phase: "selling",
        selectedFeedback: null
      }));
    }

    setSelectedFeedback(null);
  };

  const handleExitGame = () => {
    onComplete(0);
  };

  const topComplaints = FEEDBACK_BANK.slice(0, 3);

  // Exit Confirmation Dialog
  if (showExitConfirm) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
        <div className="bg-card rounded-2xl border border-border p-6 max-w-sm w-full space-y-4">
          <div className="text-center">
            <div className="text-5xl mb-3">⚠️</div>
            <h3 className="font-heading text-xl font-bold text-foreground">Quit Game?</h3>
            <p className="text-sm text-muted-foreground mt-2">
              You have completed {gameState.roundHistory.length} round{gameState.roundHistory.length !== 1 ? "s" : ""}. You won't get credit for this attempt.
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-xs text-muted-foreground text-center">
              Your progress so far: <span className="font-semibold text-secondary">₹{gameState.totalRevenue}</span> earned
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowExitConfirm(false)}
              className="flex-1 py-2 bg-card border border-border text-foreground hover:border-primary/50 font-semibold rounded-lg transition-all"
            >
              Continue Game
            </button>
            <button
              onClick={() => {
                setShowExitConfirm(false);
                onBack?.();
              }}
              className="flex-1 py-2 bg-destructive/20 border border-destructive/50 text-destructive hover:bg-destructive/30 font-semibold rounded-lg transition-all"
            >
              Quit
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ===== RENDER: SPLASH SCREEN =====
  if (gameState.phase === "splash") {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
        <div className="bg-gradient-to-br from-secondary/20 to-card rounded-3xl border border-secondary/50 p-8 max-w-md w-full space-y-6 relative">
          {onBack && (
            <button
              onClick={handleBackPress}
              className="absolute top-4 left-4 p-2 hover:bg-card/50 rounded-lg transition-all text-muted-foreground hover:text-foreground"
              title="Back to Entrepreneurship"
            >
              <ArrowLeft size={24} />
            </button>
          )}
          <div className="text-center">
            <div className="text-6xl mb-4">👥</div>
            <h2 className="font-heading text-3xl font-bold text-foreground mb-2">Customer First</h2>
            <p className="text-sm text-muted-foreground">Listen, improve, succeed</p>
          </div>

          <div className="space-y-4 bg-card/50 rounded-xl p-4 border border-border/50">
            <div>
              <h3 className="font-heading font-semibold text-secondary mb-2">📘 What You Will Discover</h3>
              <p className="text-sm text-muted-foreground">Businesses that listen to customers win. Those that don't, fail.</p>
            </div>

            <div>
              <h3 className="font-heading font-semibold text-primary mb-2">🎯 What You Need To Do</h3>
              <p className="text-sm text-muted-foreground">Sell something, collect feedback, improve your product. Repeat. Each round, customers get happier or angrier based on your changes.</p>
            </div>

            <div>
              <h3 className="font-heading font-semibold text-accent mb-2">🏆 What Success Looks Like</h3>
              <p className="text-sm text-muted-foreground">Turn angry customers into happy fans. Higher satisfaction = higher revenue. Ignore feedback = fail.</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleStartGame}
              className="flex-1 py-3 bg-gradient-to-r from-secondary to-secondary/80 hover:from-secondary/90 hover:to-secondary/70 text-secondary-foreground font-semibold rounded-lg transition-all"
            >
              ▶ Start Game
            </button>
            <button
              onClick={handleExitGame}
              className="px-4 py-3 bg-card border border-border text-muted-foreground hover:border-primary/50 rounded-lg transition-all"
            >
              ❌
            </button>
          </div>

          <div className="text-xs text-center text-muted-foreground bg-muted/30 p-2 rounded">
            "The best businesses listen to customers and improve constantly."
          </div>
        </div>
      </div>
    );
  }

  // ===== RENDER: SELLING PHASE =====
  if (gameState.phase === "selling") {
    return (
      <div className="fixed inset-0 bg-gradient-to-b from-background to-background/80 flex flex-col p-4 overflow-auto">
        <div className="max-w-2xl mx-auto w-full space-y-6 py-6">
          {/* Header with Back Button */}
          <div className="flex items-start justify-between">
            <div>
              <h2 className="font-heading text-2xl font-bold text-foreground">📔 Round {gameState.round} Sales</h2>
              <p className="text-sm text-muted-foreground">Selling handmade notebooks</p>
            </div>
            <div className="text-right flex flex-col items-end gap-4">
              <div>
                <div className="text-3xl font-bold text-secondary">💰 ₹{gameState.totalRevenue}</div>
                <div className="text-xs text-muted-foreground">Total Revenue</div>
              </div>
              {onBack && (
                <button
                  onClick={handleBackPress}
                  className="p-2 hover:bg-card rounded-lg transition-all text-muted-foreground hover:text-foreground"
                  title="Back to Entrepreneurship"
                >
                  <ArrowLeft size={20} />
                </button>
              )}
            </div>
          </div>

          {/* Product Stats */}
          <div className="glass-card rounded-xl border border-secondary/50 p-6 bg-secondary/10 space-y-4">
            <h3 className="font-heading font-semibold text-foreground">Product Stats:</h3>
            <div className="space-y-3">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">✨ Design</span>
                  <span className="font-bold text-foreground">{gameState.design}/10</span>
                </div>
                <div className="h-2 bg-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-primary/80 transition-all"
                    style={{ width: `${gameState.design * 10}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">💪 Durability</span>
                  <span className="font-bold text-foreground">{gameState.durability}/10</span>
                </div>
                <div className="h-2 bg-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-accent to-accent/80 transition-all"
                    style={{ width: `${gameState.durability * 10}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">📝 Quality</span>
                  <span className="font-bold text-foreground">{gameState.quality}/10</span>
                </div>
                <div className="h-2 bg-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-badge to-badge/80 transition-all"
                    style={{ width: `${gameState.quality * 10}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">💵 Price</span>
                  <span className="font-bold text-secondary">₹{gameState.price}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Queue */}
          <div className="text-center">
            <div className="text-5xl mb-3">👥👥👥</div>
            <div className="text-2xl font-bold text-foreground">{gameState.customerCount}+ customers waiting</div>
            <p className="text-sm text-muted-foreground mt-2">Ready to buy your notebooks</p>
          </div>

          {/* Sell Button */}
          <button
            onClick={handleSellRound}
            className="w-full py-4 bg-gradient-to-r from-secondary to-secondary/80 hover:from-secondary/90 hover:to-secondary/70 text-secondary-foreground font-bold text-lg rounded-lg transition-all"
          >
            💼 Open Shop & Sell
          </button>

          <div className="text-xs text-center text-muted-foreground bg-muted/30 p-2 rounded">
            "The best businesses listen to customers and improve constantly."
          </div>
        </div>
      </div>
    );
  }

  // ===== RENDER: FEEDBACK PHASE =====
  if (gameState.phase === "feedback" && showingFeedback) {
    return (
      <div className="fixed inset-0 bg-gradient-to-b from-background to-background/80 flex flex-col p-4 overflow-auto">
        <div className="max-w-2xl mx-auto w-full space-y-6 py-6">
          {/* Header with Back Button */}
          <div className="flex items-center justify-between mb-2">
            <div />
            {onBack && (
              <button
                onClick={handleBackPress}
                className="p-2 hover:bg-card rounded-lg transition-all text-muted-foreground hover:text-foreground"
                title="Back to Entrepreneurship"
              >
                <ArrowLeft size={20} />
              </button>
            )}
          </div>
          {/* Result Display */}
          <div>
            <h2 className="font-heading text-2xl font-bold text-foreground mb-4">📊 Sales Result</h2>
            <div className="glass-card rounded-xl border border-secondary/50 p-6 bg-secondary/10 space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">👥 Customers served:</span>
                  <span className="font-bold text-foreground">{gameState.customerCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">💰 Revenue:</span>
                  <span className="font-bold text-secondary">₹{gameState.revenue}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">😊 Customer satisfaction:</span>
                  <span className="font-bold">
                    {[...Array(gameState.satisfaction)].map((_, i) => (
                      <span key={i}>⭐</span>
                    ))}
                    {[...Array(5 - gameState.satisfaction)].map((_, i) => (
                      <span key={i} className="opacity-30">⭐</span>
                    ))}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Top Complaints */}
          <div className="space-y-3">
            <h3 className="font-heading font-semibold text-foreground">🎯 Top Customer Complaints</h3>
            {topComplaints.map((feedback, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectImprovement(
                  feedback.complaint.includes("loose") ? "durability" :
                  feedback.complaint.includes("expensive") ? "price" :
                  "design"
                )}
                className="w-full text-left p-4 rounded-lg border-2 border-border hover:border-primary/50 bg-card/50 transition-all"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{feedback.emoji}</span>
                  <div className="flex-1">
                    <div className="font-semibold text-foreground">{feedback.name}</div>
                    <p className="text-sm text-muted-foreground">"{feedback.complaint}"</p>
                  </div>
                  <span className="text-lg">→</span>
                </div>
              </button>
            ))}
          </div>

          {gameState.round < 3 && (
            <p className="text-xs text-center text-muted-foreground bg-muted/30 p-2 rounded">
              Choose ONE thing to improve before Round {gameState.round + 1}
            </p>
          )}

          {gameState.round === 3 && (
            <button
              onClick={() => {
                const avgSatisfaction = gameState.roundHistory.reduce((sum, h) => sum + h.satisfaction, 0) / gameState.roundHistory.length;
                const finalScore = Math.floor((avgSatisfaction * 100) + (gameState.totalRevenue / 10));
                setGameState(prev => ({ ...prev, phase: "results" }));
              }}
              className="w-full py-3 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-semibold rounded-lg transition-all"
            >
              See Final Results
            </button>
          )}
        </div>
      </div>
    );
  }

  // ===== RENDER: IMPROVEMENT PHASE =====
  if (gameState.phase === "improvement") {
    const improvementTitle = selectedFeedback === "durability" ? "Improve Durability" :
                            selectedFeedback === "price" ? "Lower Price" :
                            "Improve Design";

    return (
      <div className="fixed inset-0 bg-gradient-to-b from-background to-background/80 flex flex-col p-4 overflow-auto">
        <div className="max-w-2xl mx-auto w-full space-y-6 py-6">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-2xl font-bold text-foreground">🔧 {improvementTitle}</h2>
            {onBack && (
              <button
                onClick={handleBackPress}
                className="p-2 hover:bg-card rounded-lg transition-all text-muted-foreground hover:text-foreground"
                title="Back to Entrepreneurship"
              >
                <ArrowLeft size={20} />
              </button>
            )}
          </div>

          <div className="glass-card rounded-xl border border-primary/50 p-6 bg-primary/10 space-y-4">
            <div className="space-y-4">
              {selectedFeedback === "durability" && (
                <>
                  <p className="text-foreground font-semibold">What will change:</p>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>✅ Use better binding materials</li>
                    <li>✅ Reinforce page connections</li>
                    <li>✅ Test durability more thoroughly</li>
                  </ul>
                  <div className="bg-card/50 p-3 rounded border border-border">
                    <div className="text-sm">💰 Cost: ₹{improvementCost}</div>
                    <div className="text-xs text-muted-foreground mt-1">This improves durability by 2 points</div>
                  </div>
                </>
              )}

              {selectedFeedback === "price" && (
                <>
                  <p className="text-foreground font-semibold">What will change:</p>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>✅ Lower selling price to ₹40</li>
                    <li>✅ Attract budget-conscious customers</li>
                    <li>✅ Increase order volume</li>
                  </ul>
                  <div className="bg-card/50 p-3 rounded border border-border">
                    <div className="text-sm">💰 Impact: Revenue per notebook goes down but volume goes up</div>
                    <div className="text-xs text-muted-foreground mt-1">This improves customer satisfaction through affordability</div>
                  </div>
                </>
              )}

              {selectedFeedback === "design" && (
                <>
                  <p className="text-foreground font-semibold">What will change:</p>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>✅ Better cover colors and patterns</li>
                    <li>✅ More appealing to younger customers</li>
                    <li>✅ Attract design-conscious buyers</li>
                  </ul>
                  <div className="bg-card/50 p-3 rounded border border-border">
                    <div className="text-sm">💰 Cost: ₹{improvementCost}</div>
                    <div className="text-xs text-muted-foreground mt-1">This improves design by 2 points</div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleConfirmImprovement}
              className="flex-1 py-3 bg-gradient-to-r from-secondary to-secondary/80 hover:from-secondary/90 hover:to-secondary/70 text-secondary-foreground font-semibold rounded-lg transition-all"
            >
              ✅ Make This Improvement
            </button>
            <button
              onClick={() => {
                setGameState(prev => ({ ...prev, phase: "feedback" }));
                setSelectedFeedback(null);
              }}
              className="flex-1 py-3 bg-card border border-border text-muted-foreground hover:border-primary/50 font-semibold rounded-lg transition-all"
            >
              Choose Different
            </button>
          </div>

          <div className="text-xs text-center text-muted-foreground bg-muted/30 p-2 rounded">
            "The best businesses listen to customers and improve constantly."
          </div>
        </div>
      </div>
    );
  }

  // ===== RENDER: RESULTS PHASE =====
  if (gameState.phase === "results") {
    const avgSatisfaction = gameState.roundHistory.reduce((sum, h) => sum + h.satisfaction, 0) / gameState.roundHistory.length;
    const finalScore = Math.floor((avgSatisfaction * 100) + (gameState.totalRevenue / 10));

    return (
      <div className="fixed inset-0 bg-gradient-to-b from-background to-background/80 flex items-center justify-center p-4 relative">
        {onBack && (
          <button
            onClick={() => onBack()}
            className="absolute top-4 left-4 p-2 hover:bg-card rounded-lg transition-all text-muted-foreground hover:text-foreground"
            title="Back to Entrepreneurship"
          >
            <ArrowLeft size={24} />
          </button>
        )}
        <div className="max-w-md w-full space-y-6">
          <div className="text-center">
            <div className="text-6xl mb-4 animate-bounce">🎉</div>
            <h2 className="font-heading text-3xl font-bold text-foreground">Game Complete!</h2>
          </div>

          <div className="glass-card rounded-xl border border-secondary/50 p-6 space-y-4 bg-secondary/10">
            <h3 className="font-heading font-semibold text-foreground">Your Journey:</h3>
            <div className="space-y-2">
              {gameState.roundHistory.map(history => (
                <div key={history.round} className="flex items-center justify-between p-2 bg-card/50 rounded text-sm">
                  <span className="text-muted-foreground">Round {history.round}:</span>
                  <div className="flex items-center gap-3">
                    <span className="text-foreground">
                      {[...Array(history.satisfaction)].map((_, i) => (
                        <span key={i} className="text-xs">⭐</span>
                      ))}
                    </span>
                    <span className="font-bold text-secondary">₹{history.revenue}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Average Satisfaction:</span>
                <span className="font-bold text-foreground">{avgSatisfaction.toFixed(1)}/5 ⭐</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Total Revenue:</span>
                <span className="font-bold text-secondary">₹{gameState.totalRevenue}</span>
              </div>
            </div>

            <div className="bg-secondary/20 border border-secondary/50 rounded-lg p-4 text-center mt-4">
              <p className="text-sm text-foreground">
                ✅ <strong>The best businesses listen to customers and improve constantly.</strong>
              </p>
            </div>

            <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg border border-primary/30">
              <span className="text-foreground font-semibold">Final Score:</span>
              <span className="text-2xl font-bold text-primary">{finalScore} XP</span>
            </div>
          </div>

          <button
            onClick={() => onComplete(finalScore)}
            className="w-full py-3 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-semibold rounded-lg transition-all"
          >
            Finish Game
          </button>

          <div className="text-xs text-center text-muted-foreground bg-muted/30 p-2 rounded">
            "The best businesses listen to customers and improve constantly."
          </div>
        </div>
      </div>
    );
  }

  return null;
}
