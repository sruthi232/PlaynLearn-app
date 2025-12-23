import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RotateCcw, Maximize2, X } from "lucide-react";

interface Step {
  id: string;
  label: string;
  order: number;
}

interface GameState {
  steps: Step[];
  sequence: string[];
  isFullscreen: boolean;
  gameResult: "none" | "won" | "lost";
  running: boolean;
}

export function SystemBuilder({ onClose }: { onClose: () => void }) {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState<GameState>({
    steps: [],
    sequence: [],
    isFullscreen: false,
    gameResult: "none",
    running: false,
  });

  const levels = [
    {
      title: "Send a Photo",
      steps: [
        { id: "1", label: "Take a photo", order: 0 },
        { id: "2", label: "Select contact", order: 1 },
        { id: "3", label: "Send", order: 2 },
      ],
    },
    {
      title: "Make Tea",
      steps: [
        { id: "1", label: "Boil water", order: 0 },
        { id: "2", label: "Add tea leaves", order: 1 },
        { id: "3", label: "Steep", order: 2 },
        { id: "4", label: "Serve", order: 3 },
      ],
    },
    {
      title: "Login to Account",
      steps: [
        { id: "1", label: "Enter username", order: 0 },
        { id: "2", label: "Enter password", order: 1 },
        { id: "3", label: "Verify credentials", order: 2 },
        { id: "4", label: "Load dashboard", order: 3 },
      ],
    },
  ];

  const level = levels[currentLevel];

  useEffect(() => {
    if (gameStarted && currentLevel < levels.length) {
      initializeLevel();
    }
  }, [currentLevel, gameStarted]);

  const initializeLevel = () => {
    const shuffled = [...level.steps].sort(() => Math.random() - 0.5);
    setGameState({
      steps: shuffled,
      sequence: [],
      isFullscreen: gameState.isFullscreen,
      gameResult: "none",
      running: false,
    });
  };

  const addToSequence = (stepId: string) => {
    if (gameState.gameResult !== "none" || gameState.sequence.includes(stepId))
      return;

    const newSequence = [...gameState.sequence, stepId];
    setGameState({
      ...gameState,
      sequence: newSequence,
    });
  };

  const removeFromSequence = (index: number) => {
    if (gameState.gameResult !== "none") return;

    const newSequence = gameState.sequence.filter((_, i) => i !== index);
    setGameState({
      ...gameState,
      sequence: newSequence,
    });
  };

  const runSystem = () => {
    if (gameState.gameResult !== "none") return;

    const correctSequence = level.steps
      .sort((a, b) => a.order - b.order)
      .map((s) => s.id);
    const isCorrect =
      JSON.stringify(gameState.sequence) === JSON.stringify(correctSequence);

    setGameState((prev) => ({
      ...prev,
      running: true,
    }));

    setTimeout(() => {
      if (isCorrect) {
        setGameState((prev) => ({
          ...prev,
          gameResult: "won",
        }));
      } else {
        setGameState((prev) => ({
          ...prev,
          gameResult: "lost",
        }));
      }
    }, 1500);
  };

  const handleRetry = () => {
    initializeLevel();
  };

  const nextLevel = () => {
    if (currentLevel < levels.length - 1) {
      setCurrentLevel(currentLevel + 1);
      setScore(score + 100);
    } else {
      setGameStarted(false);
    }
  };

  const toggleFullscreen = () => {
    setGameState({
      ...gameState,
      isFullscreen: !gameState.isFullscreen,
    });
  };

  if (!gameStarted) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>⚙️ System Builder</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <h3 className="font-semibold">🔄 Concept: Process Sequencing</h3>
              <p className="text-sm text-muted-foreground">
                Systems require correct order of operations to work properly.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">🎮 How To Play</h3>
              <p className="text-sm text-muted-foreground">
                Arrange steps in the correct order, then run the system!
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">🏆 What Success Means</h3>
              <p className="text-sm text-muted-foreground">
                The system runs smoothly when steps are in the right order.
              </p>
            </div>
            <div className="flex gap-2 pt-4">
              <Button onClick={onClose} variant="outline" className="flex-1">
                ❌ Go Back
              </Button>
              <Button onClick={() => setGameStarted(true)} className="flex-1">
                ▶ Start Game
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const GameplayUI = () => (
    <div className="space-y-6">
      {/* Level Info */}
      <div className="bg-gradient-to-r from-orange-100 to-amber-100 dark:from-orange-900 dark:to-amber-900 rounded-lg p-4 text-center">
        <div className="text-sm text-muted-foreground mb-2">Level {currentLevel + 1}/{levels.length}</div>
        <div className="text-lg font-bold text-primary">{level.title}</div>
      </div>

      {/* Available Steps */}
      <div className="space-y-2">
        <div className="text-sm font-semibold text-muted-foreground">
          📋 Available Steps
        </div>
        <div className="grid grid-cols-2 gap-2">
          {gameState.steps.map((step) => (
            <button
              key={step.id}
              onClick={() => addToSequence(step.id)}
              disabled={gameState.gameResult !== "none" || gameState.sequence.includes(step.id)}
              className="p-3 rounded-lg bg-card border-2 border-muted hover:border-primary text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {step.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sequence Timeline */}
      <div className="space-y-2">
        <div className="text-sm font-semibold text-muted-foreground">
          ⏱️ System Sequence
        </div>
        {gameState.sequence.length === 0 ? (
          <div className="bg-muted rounded-lg p-6 text-center text-muted-foreground">
            Click steps above to build your sequence
          </div>
        ) : (
          <div className="space-y-2">
            {gameState.sequence.map((stepId, idx) => {
              const step = gameState.steps.find((s) => s.id === stepId)!;
              return (
                <div key={idx} className="flex items-center gap-2">
                  <div className="bg-primary text-white font-bold w-8 h-8 rounded flex items-center justify-center">
                    {idx + 1}
                  </div>
                  <div className="flex-1 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-3 border border-primary/20">
                    {step.label}
                  </div>
                  <button
                    onClick={() => removeFromSequence(idx)}
                    className="p-1 hover:bg-red-500 rounded text-red-500 hover:text-white transition"
                  >
                    ✕
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Animation */}
      {gameState.running && (
        <div className="bg-blue-100 dark:bg-blue-900 rounded-lg p-4 text-center border-2 border-blue-500 animate-pulse">
          <div className="text-lg font-bold text-blue-800 dark:text-blue-200">
            🔄 System Running...
          </div>
        </div>
      )}

      {/* Result */}
      {gameState.gameResult === "won" && (
        <div className="bg-green-100 dark:bg-green-900 rounded-lg p-4 text-center border-2 border-green-500">
          <div className="text-4xl mb-2">🎉</div>
          <div className="font-bold text-lg text-green-800 dark:text-green-200">
            System Works Perfectly!
          </div>
          <p className="text-sm text-green-700 dark:text-green-300 mt-1">
            All steps in correct order!
          </p>
        </div>
      )}

      {gameState.gameResult === "lost" && (
        <div className="bg-red-100 dark:bg-red-900 rounded-lg p-4 text-center border-2 border-red-500">
          <div className="text-4xl mb-2">❌</div>
          <div className="font-bold text-lg text-red-800 dark:text-red-200">
            System Failed!
          </div>
          <p className="text-sm text-red-700 dark:text-red-300 mt-1">
            Wrong sequence order. Try again!
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        {gameState.gameResult === "none" && (
          <>
            <Button onClick={handleRetry} variant="outline" className="flex-1">
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
            <Button
              onClick={runSystem}
              disabled={gameState.sequence.length !== level.steps.length}
              className="flex-1"
            >
              ▶ Run System
            </Button>
          </>
        )}
        {gameState.gameResult !== "none" && (
          <>
            <Button onClick={handleRetry} variant="outline" className="flex-1">
              Try Again
            </Button>
            {gameState.gameResult === "won" && currentLevel < levels.length - 1 && (
              <Button onClick={nextLevel} className="flex-1">
                Next Level →
              </Button>
            )}
            {gameState.gameResult === "won" && currentLevel === levels.length - 1 && (
              <Button onClick={() => setGameStarted(false)} className="flex-1">
                Finish
              </Button>
            )}
          </>
        )}
      </div>

      {/* Info */}
      <div className="bg-muted rounded-lg p-3 text-center text-sm font-semibold text-muted-foreground">
        💡 "Order matters more than speed!"
      </div>
    </div>
  );

  if (gameState.isFullscreen) {
    return (
      <div className="fixed inset-0 bg-background z-50 p-4 flex flex-col overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-primary">
            ⚙️ System Builder
          </h2>
          <button
            onClick={toggleFullscreen}
            className="p-2 hover:bg-muted rounded-lg transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="flex-1 max-w-2xl mx-auto w-full">
          <GameplayUI />
        </div>
      </div>
    );
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-start">
            <DialogTitle>⚙️ System Builder</DialogTitle>
            <button
              onClick={toggleFullscreen}
              className="p-2 hover:bg-muted rounded-lg transition"
            >
              <Maximize2 className="w-5 h-5" />
            </button>
          </div>
        </DialogHeader>
        <GameplayUI />
      </DialogContent>
    </Dialog>
  );
}
