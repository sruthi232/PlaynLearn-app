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
  ChevronRight,
} from "lucide-react";

interface LogicRoom {
  id: number;
  name: string;
  description: string;
  condition: string;
  options: { text: string; isCorrect: boolean }[];
  icon: string;
}

const ROOMS: LogicRoom[] = [
  {
    id: 1,
    name: "Light Switch Room",
    description: "The light is not turning on. What's wrong?",
    condition: "IF button pressed = true THEN light turns on",
    options: [
      { text: "✓ Circuit is complete and power is on", isCorrect: true },
      { text: "✗ The room is too bright already", isCorrect: false },
      { text: "✗ The switch is made of plastic", isCorrect: false },
    ],
    icon: "💡",
  },
  {
    id: 2,
    name: "Water Level Room",
    description: "The water tank is overflowing. What's the error?",
    condition:
      "IF water level > maximum THEN stop filling AND open drain",
    options: [
      { text: "✓ The overflow sensor is broken", isCorrect: true },
      { text: "✗ Water is too wet", isCorrect: false },
      { text: "✗ The tank is the wrong color", isCorrect: false },
    ],
    icon: "💧",
  },
  {
    id: 3,
    name: "Traffic Light Room",
    description: "Traffic is stuck. All lights are red. What failed?",
    condition: "IF cars waiting > 5 THEN change light to green",
    options: [
      { text: "✓ The sensor detecting cars is not working", isCorrect: true },
      { text: "✗ The roads are too long", isCorrect: false },
      { text: "✗ The lights are LED instead of incandescent", isCorrect: false },
    ],
    icon: "🚦",
  },
  {
    id: 4,
    name: "Temperature Room",
    description: "The room is too cold. The heater won't turn on.",
    condition: "IF temperature < setPoint THEN turn ON heater",
    options: [
      { text: "✓ The temperature sensor is giving wrong readings", isCorrect: true },
      { text: "✗ Winter is too cold", isCorrect: false },
      { text: "✗ The heater doesn't like the furniture", isCorrect: false },
    ],
    icon: "🌡️",
  },
  {
    id: 5,
    name: "Robot Direction Room",
    description: "The robot keeps turning left instead of right.",
    condition: "IF command = 'right' THEN rotate 90 degrees clockwise",
    options: [
      { text: "✓ The left-right logic in the code is reversed", isCorrect: true },
      { text: "✗ The robot is tired", isCorrect: false },
      { text: "✗ Gravity is pulling it left", isCorrect: false },
    ],
    icon: "🤖",
  },
];

export default function TechnologyDebugDungeon() {
  const navigate = useNavigate();
  const [showIntro, setShowIntro] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [currentRoomIndex, setCurrentRoomIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [gameWon, setGameWon] = useState(false);

  const currentRoom = ROOMS[currentRoomIndex];

  const handleGameStart = () => {
    setShowIntro(false);
  };

  const handleAnswerSelect = (optionIndex: number) => {
    if (!answered) {
      setSelectedAnswer(optionIndex);
      setAnswered(true);

      const isCorrect = currentRoom.options[optionIndex].isCorrect;
      if (isCorrect) {
        setCorrectAnswers(correctAnswers + 1);
      }
    }
  };

  const handleNextRoom = () => {
    if (currentRoomIndex < ROOMS.length - 1) {
      setCurrentRoomIndex(currentRoomIndex + 1);
      setSelectedAnswer(null);
      setAnswered(false);
    } else {
      setGameWon(true);
    }
  };

  const handleComplete = () => {
    navigate("/student/technology");
  };

  // Game intro modal
  if (showIntro) {
    return (
      <Dialog open={showIntro} onOpenChange={setShowIntro}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl">🐉 Debug Dungeon</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-primary/10 rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-2">📘 What You Will Learn</h3>
              <p className="text-sm text-muted-foreground">
                Finding and fixing errors is core to technology. Learn logical thinking
                by identifying what's broken in systems and understanding how to fix them!
              </p>
            </div>

            <div className="bg-secondary/10 rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-2">🎮 How to Play</h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Navigate through dungeon rooms</li>
                <li>• Each room has a broken system</li>
                <li>• Read the logic and find the error</li>
                <li>• Select the correct problem to fix the system</li>
              </ul>
            </div>

            <div className="bg-accent/10 rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-2">🏆 What Success Looks Like</h3>
              <p className="text-sm text-muted-foreground">
                Solve all rooms correctly. Each correct answer lights up the dungeon and
                opens the next door. Escape with all solutions!
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

  // Game completion modal
  if (gameWon) {
    const scorePercentage = Math.round((correctAnswers / ROOMS.length) * 100);
    return (
      <Dialog open={gameWon} onOpenChange={() => {}}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl">🎉 Dungeon Escaped!</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-6xl mb-4">🗝️</p>
              <p className="text-lg font-semibold text-primary">You fixed it all!</p>
              <p className="text-sm text-muted-foreground mt-2">
                You successfully debugged {correctAnswers}/{ROOMS.length} systems and
                escaped the dungeon!
              </p>
            </div>

            <div className="bg-primary/10 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Your Score: {scorePercentage}%</h3>
              <p className="text-sm text-muted-foreground">
                {scorePercentage === 100
                  ? "Perfect debugging! You're a master troubleshooter!"
                  : scorePercentage >= 80
                    ? "Excellent debugging skills!"
                    : "Good work! Keep practicing!"}
              </p>
            </div>

            <div className="bg-primary/10 rounded-lg p-4">
              <h3 className="font-semibold mb-2">💡 Concept Summary</h3>
              <p className="text-sm text-muted-foreground">
                Debugging is solving problems by understanding logic. You learned to
                identify when systems fail and why!
              </p>
            </div>

            <Button
              onClick={handleComplete}
              className="w-full bg-secondary"
            >
              🏠 Back to Games
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Main game view
  const gameContent = (
    <div className="w-full h-full bg-gradient-to-b from-purple-950 via-red-950 to-purple-900 flex flex-col items-center justify-center p-6 relative">
      {/* Header */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">🐉 Debug Dungeon</h2>
          <p className="text-sm text-red-200">
            Room {currentRoomIndex + 1}/{ROOMS.length} | Fixed: {correctAnswers}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsSoundOn(!isSoundOn)}
            className="bg-white/20 hover:bg-white/30 p-2 rounded-lg text-white transition"
          >
            {isSoundOn ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>
          {!isFullscreen && (
            <button
              onClick={() => setIsFullscreen(true)}
              className="bg-white/20 hover:bg-white/30 p-2 rounded-lg text-white transition"
            >
              <Maximize2 size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Room Content */}
      <div className="mt-16 max-w-lg w-full space-y-6">
        {/* Room Icon */}
        <div className="text-center">
          <div className="text-7xl mb-4">{currentRoom.icon}</div>
          <h3 className="text-2xl font-bold text-white mb-2">{currentRoom.name}</h3>
          <p className="text-red-200 mb-4">{currentRoom.description}</p>

          {/* Logic Display */}
          <div className="bg-red-900/30 border-2 border-red-500 rounded-lg p-4 text-left">
            <p className="text-yellow-300 font-mono text-sm">
              {currentRoom.condition}
            </p>
          </div>
        </div>

        {/* Answer Options */}
        <div className="space-y-3">
          {currentRoom.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              disabled={answered}
              className={`w-full p-4 rounded-lg text-left font-medium transition transform ${
                selectedAnswer === index
                  ? option.isCorrect
                    ? "bg-green-500 text-white scale-105"
                    : "bg-red-500 text-white scale-105"
                  : answered
                    ? "bg-gray-500 text-white opacity-50"
                    : "bg-white/10 text-white hover:bg-white/20 hover:scale-105"
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{option.text}</span>
                {selectedAnswer === index &&
                  (option.isCorrect ? "✓" : "✗")}
              </div>
            </button>
          ))}
        </div>

        {/* Next Button */}
        {answered && (
          <button
            onClick={handleNextRoom}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition transform hover:scale-105"
          >
            {currentRoomIndex < ROOMS.length - 1
              ? "Next Room"
              : "Escape Dungeon!"}
            <ChevronRight size={20} />
          </button>
        )}
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 left-4 right-4 bg-black/50 text-white rounded-lg p-3 text-sm">
        <p>
          🔍 <strong>Analyze the logic.</strong> Find what's broken. Choose the correct
          fix!
        </p>
      </div>
    </div>
  );

  // Fullscreen mode
  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-gradient-to-b from-purple-950 via-red-950 to-purple-900 flex flex-col">
        {/* Top Controls - Always visible and accessible */}
        <div className="absolute top-4 right-4 flex gap-2 z-50">
          <button
            onClick={() => setIsSoundOn(!isSoundOn)}
            className="bg-white/20 hover:bg-white/30 p-3 rounded-lg text-white transition"
            title="Toggle sound"
          >
            {isSoundOn ? <Volume2 size={24} /> : <VolumeX size={24} />}
          </button>
          <button
            onClick={() => setIsFullscreen(false)}
            className="bg-yellow-500 hover:bg-yellow-600 p-3 rounded-lg text-white transition font-bold flex items-center gap-2"
            title="Minimize (ESC also works)"
          >
            <Minimize2 size={24} />
            EXIT
          </button>
          <button
            onClick={() => navigate("/student/technology")}
            className="bg-red-500 hover:bg-red-600 p-3 rounded-lg text-white transition"
            title="Go back to games"
          >
            <X size={24} />
          </button>
        </div>

        {/* Game Content Area */}
        <div className="flex-1 w-full flex items-center justify-center overflow-hidden">
          {gameContent}
        </div>
      </div>
    );
  }

  // Embedded game view
  return (
    <div className="fixed inset-0 z-40 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-background rounded-2xl overflow-hidden shadow-2xl max-w-2xl w-full">
        <div className="bg-gradient-to-b from-purple-950 via-red-950 to-purple-900 h-96">
          {gameContent}
        </div>

        <div className="p-6 space-y-4">
          <div>
            <h3 className="font-semibold text-lg mb-2">About This Game</h3>
            <p className="text-sm text-muted-foreground">
              Welcome to Debug Dungeon! Systems are broken, and you need to find the
              errors. Read the logic, understand what should happen, identify what's
              wrong, and fix it!
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-2">💡 Key Concept</h3>
            <p className="text-xs text-muted-foreground">
              Debugging means understanding the system's logic and finding where it fails.
              It's a critical skill in technology - even the best programmers spend time
              debugging!
            </p>
          </div>

          <Button
            onClick={() => setIsFullscreen(true)}
            className="w-full bg-primary"
          >
            ⛶ Full Screen
          </Button>
        </div>
      </div>
    </div>
  );
}
