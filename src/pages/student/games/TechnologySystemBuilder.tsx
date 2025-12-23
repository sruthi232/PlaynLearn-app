import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  X,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

interface Step {
  id: string;
  name: string;
  icon: string;
  correctOrder: number;
  explanation: string;
}

interface SystemConfig {
  name: string;
  description: string;
  visual: string;
  steps: Step[];
  wrongOrderFeedback: string;
  rightOrderFeedback: string;
}

const SYSTEMS: Record<string, SystemConfig> = {
  level1: {
    name: "💧 Water Pump System",
    description: "A pump that moves water from one place to another",
    visual: "🏠💧→🌳",
    steps: [
      {
        id: "power",
        name: "Power ON",
        icon: "🔌",
        correctOrder: 1,
        explanation:
          "First, we need electricity! Without power, nothing can happen. The pump motor needs energy to run.",
      },
      {
        id: "control",
        name: "Start Control",
        icon: "🎛️",
        correctOrder: 2,
        explanation:
          "Next, activate the control system. This tells the pump HOW to work - how fast, how much pressure, etc.",
      },
      {
        id: "action",
        name: "Pump Action",
        icon: "💧",
        correctOrder: 3,
        explanation:
          "Finally, water pumps! With power ON and control activated, the pump can now move water successfully.",
      },
    ],
    wrongOrderFeedback:
      "❌ Wrong order! If you try to pump before power is on, nothing happens. If control isn't set first, the pump breaks!",
    rightOrderFeedback:
      "✓ Perfect! Power flows → Control activates → Pump works! Water flows smoothly.",
  },
  level2: {
    name: "🚦 Traffic Light System",
    description: "A smart system that manages traffic flow at intersections",
    visual: "🚗🚦🚗",
    steps: [
      {
        id: "detect",
        name: "Detect Traffic",
        icon: "🚗",
        correctOrder: 1,
        explanation:
          "Sensors detect cars waiting at the light. The system reads 'How many cars? Which direction?'",
      },
      {
        id: "process",
        name: "Calculate Timing",
        icon: "⚙️",
        correctOrder: 2,
        explanation:
          "The computer thinks: 'More cars here, less there. Change light timing.' Processing makes decisions based on data.",
      },
      {
        id: "control",
        name: "Change Lights",
        icon: "🚦",
        correctOrder: 3,
        explanation:
          "Based on the calculation, change the light colors. This tells drivers when it's their turn to go.",
      },
      {
        id: "result",
        name: "Traffic Flows",
        icon: "✅",
        correctOrder: 4,
        explanation:
          "Result! Cars move smoothly. No traffic jams. The system worked perfectly!",
      },
    ],
    wrongOrderFeedback:
      "❌ Chaos! If you change lights before detecting traffic, cars crash! Wrong timing = traffic jams!",
    rightOrderFeedback:
      "✓ Smart system! Detect → Process → Control → Flow! Traffic moves like magic!",
  },
  level3: {
    name: "🌱 Smart Farm System",
    description: "An automated system that waters crops when they need it",
    visual: "📊→⚙️→💧🌱",
    steps: [
      {
        id: "sense",
        name: "Sensors Check",
        icon: "📊",
        correctOrder: 1,
        explanation:
          "Sensors measure soil moisture. Are the plants dry? How dry? This is the DATA we need.",
      },
      {
        id: "measure",
        name: "Compare Data",
        icon: "📏",
        correctOrder: 2,
        explanation:
          "Compare: 'Current moisture: 30%, Ideal: 60%. We need MORE water!' Decision-making happens here.",
      },
      {
        id: "decide",
        name: "Make Decision",
        icon: "🤖",
        correctOrder: 3,
        explanation:
          "The AI decides: 'Yes, turn on irrigation!' This decision controls what happens next.",
      },
      {
        id: "act",
        name: "Water Plants",
        icon: "💨",
        correctOrder: 4,
        explanation:
          "Water flows to plants! The action executes based on the decision. Plants get exactly what they need.",
      },
      {
        id: "monitor",
        name: "Monitor Result",
        icon: "🌱",
        correctOrder: 5,
        explanation:
          "Check: Did plants grow? Is soil moist? Monitor the outcome. This feedback improves future decisions!",
      },
    ],
    wrongOrderFeedback:
      "❌ Disaster! If you water before checking soil, you waste water and drown plants! Wrong order = dead crops!",
    rightOrderFeedback:
      "✓ Perfect farming! Sense → Compare → Decide → Act → Monitor = Healthy crops!",
  },
};

export default function TechnologySystemBuilder() {
  const navigate = useNavigate();
  const [showIntro, setShowIntro] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [userOrder, setUserOrder] = useState<string[]>([]);
  const [gameWon, setGameWon] = useState(false);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [systemStatus, setSystemStatus] = useState<"idle" | "broken" | "working">(
    "idle"
  );
  const [feedback, setFeedback] = useState<string>("");

  const currentSystem = SYSTEMS[`level${currentLevel}` as keyof typeof SYSTEMS];
  const allSteps = currentSystem.steps;

  useEffect(() => {
    if (!showIntro) {
      initializeGame();
    }
  }, [showIntro, currentLevel]);

  const initializeGame = () => {
    const shuffled = [...allSteps].sort(() => Math.random() - 0.5);
    setUserOrder(shuffled.map((s) => s.id));
    setGameWon(false);
    setSystemStatus("idle");
    setFeedback("");
  };

  const handleGameStart = () => {
    setShowIntro(false);
  };

  const handleNextLevel = () => {
    if (currentLevel < 3) {
      setCurrentLevel(currentLevel + 1);
      setGameWon(false);
    }
  };

  const handleComplete = () => {
    navigate("/student/technology");
  };

  const getStepById = (id: string) => allSteps.find((s) => s.id === id)!;

  const checkWin = (order: string[]) => {
    const isCorrect = order.every(
      (id, index) => getStepById(id).correctOrder === index + 1
    );

    if (isCorrect) {
      setSystemStatus("working");
      setFeedback(currentSystem.rightOrderFeedback);
      setGameWon(true);
    } else {
      // Provide hint about what's wrong
      const incorrectItems = order.filter(
        (id, index) => getStepById(id).correctOrder !== index + 1
      );
      if (incorrectItems.length > 0) {
        setSystemStatus("broken");
        setFeedback(currentSystem.wrongOrderFeedback);
      }
    }
  };

  const handleMoveStep = (fromIndex: number, toIndex: number) => {
    const newOrder = [...userOrder];
    const [removed] = newOrder.splice(fromIndex, 1);
    newOrder.splice(toIndex, 0, removed);
    setUserOrder(newOrder);
    checkWin(newOrder);
  };

  // Intro
  if (showIntro) {
    return (
      <Dialog open={showIntro} onOpenChange={setShowIntro}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl">🧩 System Builder</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-primary/10 rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-2">📘 What You Will Learn</h3>
              <p className="text-sm text-muted-foreground">
                Every system has steps that MUST happen in the RIGHT ORDER. Power before
                control. Detect before you react. Learn why sequence matters for technology!
              </p>
            </div>

            <div className="bg-secondary/10 rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-2">🎮 How to Play</h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Drag steps to arrange them in the correct order</li>
                <li>• Each step has an explanation - learn WHY it matters</li>
                <li>• Wrong order = system breaks! You'll see the error</li>
                <li>• Right order = system works perfectly! ✓</li>
              </ul>
            </div>

            <div className="bg-accent/10 rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-2">🏆 What Success Looks Like</h3>
              <p className="text-sm text-muted-foreground">
                All steps turn green, system status shows "WORKING", and you see why this
                order makes sense!
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => navigate("/student/technology")}
                className="flex-1"
              >
                ❌ Go Back
              </Button>
              <Button onClick={handleGameStart} className="flex-1 bg-primary">
                ▶ Start Game
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Win modal
  if (gameWon) {
    return (
      <Dialog open={gameWon} onOpenChange={() => {}}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl">🎉 System Works!</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-6xl mb-4">⚙️✨</p>
              <p className="text-lg font-semibold text-primary">
                {currentSystem.name} is PERFECT!
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                You've mastered system thinking! Order matters, and you got it right!
              </p>
            </div>

            <div className="bg-green-500/20 border border-green-500 rounded-lg p-4">
              <h3 className="font-semibold mb-2 text-green-700">✓ What You Learned:</h3>
              <ul className="text-sm text-green-600 space-y-1">
                <li>• Systems need steps in correct order</li>
                <li>• Each step enables the next one</li>
                <li>• Wrong order = broken system</li>
                <li>• Technology works through sequences!</li>
              </ul>
            </div>

            <div className="text-center">
              <p className="text-sm font-semibold text-accent">
                ⭐ +{165 + currentLevel * 20} XP Earned!
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button onClick={handleComplete} className="flex-1 bg-secondary">
                🏠 Back to Games
              </Button>
              {currentLevel < 3 && (
                <Button onClick={handleNextLevel} className="flex-1 bg-primary">
                  ➡️ Next Level
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Main game
  return (
    <div className="fixed inset-0 z-40 bg-black/50 flex items-center justify-center p-4">
      <div className={`bg-background rounded-2xl overflow-hidden shadow-2xl ${isFullscreen ? "w-full h-full" : "max-w-2xl w-full"}`}>
        {/* Game Area */}
        <div
          className={`${
            isFullscreen ? "h-screen" : "h-96"
          } bg-gradient-to-br from-teal-900 via-green-900 to-emerald-800 flex flex-col p-6 relative overflow-hidden`}
        >
          {/* Controls */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
            <div className="text-white">
              <h2 className="text-2xl font-bold">{currentSystem.name}</h2>
              <p className="text-sm text-green-200">Level {currentLevel}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setIsSoundOn(!isSoundOn)}
                className="bg-white/20 hover:bg-white/30 p-2 rounded-lg text-white transition"
              >
                {isSoundOn ? <Volume2 size={20} /> : <VolumeX size={20} />}
              </button>
              {isFullscreen ? (
                <button
                  onClick={() => setIsFullscreen(false)}
                  className="bg-yellow-500 hover:bg-yellow-600 px-3 py-2 rounded-lg text-white transition font-bold flex items-center gap-1"
                >
                  <Minimize2 size={20} /> EXIT
                </button>
              ) : (
                <button
                  onClick={() => setIsFullscreen(true)}
                  className="bg-white/20 hover:bg-white/30 p-2 rounded-lg text-white transition"
                >
                  <Maximize2 size={20} />
                </button>
              )}
              {isFullscreen && (
                <button
                  onClick={() => navigate("/student/technology")}
                  className="bg-red-500 hover:bg-red-600 p-2 rounded-lg text-white transition"
                >
                  <X size={20} />
                </button>
              )}
            </div>
          </div>

          {/* System Description */}
          <div className="mt-12 text-center mb-4">
            <p className="text-white text-sm mb-2">
              <strong>{currentSystem.description}</strong>
            </p>
            <p className="text-4xl">{currentSystem.visual}</p>
          </div>

          {/* System Status Indicator */}
          <div
            className={`mb-4 p-3 rounded-lg text-center transition-all ${
              systemStatus === "working"
                ? "bg-green-500/30 border border-green-500 text-green-100"
                : systemStatus === "broken"
                  ? "bg-red-500/30 border border-red-500 text-red-100"
                  : "bg-white/10 border border-white/30 text-white"
            }`}
          >
            {systemStatus === "working" ? (
              <div className="flex items-center justify-center gap-2">
                <CheckCircle2 size={20} />
                <strong>✓ SYSTEM WORKING PERFECTLY!</strong>
              </div>
            ) : systemStatus === "broken" ? (
              <div className="flex items-center justify-center gap-2">
                <AlertCircle size={20} />
                <strong>✗ SYSTEM BROKEN - WRONG ORDER!</strong>
              </div>
            ) : (
              <div>Drag steps to start the system...</div>
            )}
          </div>

          {/* Draggable Steps */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-2">
            {userOrder.map((stepId, index) => {
              const step = getStepById(stepId);
              const isCorrect = step.correctOrder === index + 1;

              return (
                <div
                  key={stepId}
                  draggable
                  onDragStart={() => setDraggedItem(stepId)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => {
                    if (draggedItem && draggedItem !== stepId) {
                      const fromIndex = userOrder.indexOf(draggedItem);
                      handleMoveStep(fromIndex, index);
                    }
                  }}
                  className={`p-4 rounded-lg cursor-move hover:scale-105 transition transform border-2 ${
                    isCorrect
                      ? "bg-green-500/30 border-green-500 shadow-lg shadow-green-500/50"
                      : "bg-white/10 border-white/30 hover:bg-white/20"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-3xl mt-1">{step.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-bold">
                          Step {index + 1}: {step.name}
                        </span>
                        {isCorrect && (
                          <span className="text-green-300 font-bold">✓</span>
                        )}
                      </div>
                      <p className="text-xs text-white/80 mt-1">{step.explanation}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Feedback Message */}
          {feedback && (
            <div
              className={`mt-4 p-3 rounded-lg text-center text-sm font-semibold ${
                systemStatus === "working"
                  ? "bg-green-500/30 text-green-100 border border-green-500"
                  : "bg-red-500/30 text-red-100 border border-red-500"
              }`}
            >
              {feedback}
            </div>
          )}
        </div>

        {/* Info Panel */}
        {!isFullscreen && (
          <div className="p-6 space-y-4 bg-background max-h-64 overflow-y-auto">
            <div>
              <h3 className="font-semibold text-lg mb-2">💡 How This Works</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Drag the steps to put them in the correct order. Notice how each step
                explains WHY it matters. When all are in correct sequence, the system
                comes alive!
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-sm mb-2">🎯 Learning Goal</h3>
              <p className="text-xs text-muted-foreground">
                Every technology system has dependencies. Power must come before control.
                Detection comes before reaction. Understand the sequence, and you understand
                how systems work!
              </p>
            </div>

            <Button
              onClick={() => setIsFullscreen(true)}
              className="w-full bg-primary"
            >
              ⛶ Play Full Screen
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
