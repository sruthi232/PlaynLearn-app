import { useState, useRef, useEffect } from "react";
import { AppLayout } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { ConceptIntroPopup } from "@/components/ui/concept-intro-popup";
import { GameCompletionPopup } from "@/components/ui/game-completion-popup";
import { ArrowLeft, Maximize2, Minimize2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface ObjectPhysics {
  x: number;
  vx: number;
  mass: number;
  name: string;
  color: string;
  width: number;
  height: number;
}

const GAME_WIDTH = 800;
const GAME_HEIGHT = 400;
const START_X = 50;
const OBJECT_Y = 250;
const FRICTION = 0.94;

const OBJECTS = {
  box: {
    mass: 1,
    name: "Light Box",
    color: "#FF6B6B",
    width: 40,
    height: 40,
  },
  crate: {
    mass: 3,
    name: "Heavy Crate",
    color: "#4ECDC4",
    width: 60,
    height: 50,
  },
  stone: {
    mass: 5,
    name: "Stone Block",
    color: "#95A5A6",
    width: 70,
    height: 60,
  },
};

export default function ForceBuilder() {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showTutorial, setShowTutorial] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [selectedObject, setSelectedObject] = useState<keyof typeof OBJECTS>("box");
  const [forceApplied, setForceApplied] = useState(0);
  const [object, setObject] = useState<ObjectPhysics>({
    x: START_X,
    vx: 0,
    mass: OBJECTS.box.mass,
    name: OBJECTS.box.name,
    color: OBJECTS.box.color,
    width: OBJECTS.box.width,
    height: OBJECTS.box.height,
  });
  const [isMoving, setIsMoving] = useState(false);
  const [results, setResults] = useState<Record<keyof typeof OBJECTS, number>>({
    box: 0,
    crate: 0,
    stone: 0,
  });
  const [showResult, setShowResult] = useState(false);
  const [lastDistance, setLastDistance] = useState(0);
  const animationRef = useRef<number | null>(null);
  const [attempts, setAttempts] = useState(0);

  const applyForce = (force: number) => {
    const acceleration = force / object.mass;
    setObject((prev) => ({
      ...prev,
      vx: acceleration,
    }));
    setForceApplied(force);
    setIsMoving(true);
    setAttempts((prev) => prev + 1);
  };

  const removeForce = () => {
    setForceApplied(0);
  };

  useEffect(() => {
    if (!isMoving) return;

    const animate = () => {
      setObject((prev) => {
        let newObject = { ...prev };
        newObject.vx *= FRICTION;

        if (Math.abs(newObject.vx) < 0.05) {
          newObject.vx = 0;
          setIsMoving(false);
          const distance = Math.round(newObject.x - START_X);
          setLastDistance(distance);
          setResults((prev) => ({
            ...prev,
            [selectedObject]: distance,
          }));
          setShowResult(true);
          return newObject;
        }

        newObject.x += newObject.vx;

        if (newObject.x > GAME_WIDTH - newObject.width) {
          newObject.x = GAME_WIDTH - newObject.width;
          newObject.vx = 0;
          setIsMoving(false);
          const distance = newObject.x - START_X;
          setLastDistance(distance);
          setResults((prev) => ({
            ...prev,
            [selectedObject]: distance,
          }));
          setShowResult(true);
          return newObject;
        }

        return newObject;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isMoving, selectedObject]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Sky and ground
    ctx.fillStyle = "#87CEEB";
    ctx.fillRect(0, 0, GAME_WIDTH, OBJECT_Y);

    ctx.fillStyle = "#8B7355";
    ctx.fillRect(0, OBJECT_Y + object.height + 20, GAME_WIDTH, GAME_HEIGHT - OBJECT_Y - object.height - 20);

    // Grid pattern
    ctx.strokeStyle = "rgba(0, 0, 0, 0.1)";
    ctx.lineWidth = 1;
    for (let i = 0; i < GAME_WIDTH; i += 50) {
      ctx.beginPath();
      ctx.moveTo(i, OBJECT_Y + object.height + 20);
      ctx.lineTo(i, OBJECT_Y + object.height + 35);
      ctx.stroke();
    }

    // Object
    ctx.fillStyle = object.color;
    ctx.fillRect(object.x, OBJECT_Y, object.width, object.height);
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 2;
    ctx.strokeRect(object.x, OBJECT_Y, object.width, object.height);

    // Object label
    ctx.fillStyle = "#000";
    ctx.font = "bold 12px Arial";
    ctx.textAlign = "center";
    ctx.fillText(
      `M: ${object.mass}`,
      object.x + object.width / 2,
      OBJECT_Y + object.height / 2 + 5
    );

    // Force arrow
    if (forceApplied > 0) {
      const arrowLength = Math.min(forceApplied * 20, 200);
      ctx.strokeStyle = "#FF0000";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(object.x - 30, OBJECT_Y + object.height / 2);
      ctx.lineTo(object.x - 30 - arrowLength, OBJECT_Y + object.height / 2);
      ctx.stroke();

      // Arrow head
      ctx.beginPath();
      ctx.moveTo(object.x - 30 - arrowLength, OBJECT_Y + object.height / 2);
      ctx.lineTo(object.x - 30 - arrowLength + 10, OBJECT_Y + object.height / 2 - 8);
      ctx.lineTo(object.x - 30 - arrowLength + 10, OBJECT_Y + object.height / 2 + 8);
      ctx.closePath();
      ctx.fillStyle = "#FF0000";
      ctx.fill();

      // Force label
      ctx.fillStyle = "#FF0000";
      ctx.font = "bold 14px Arial";
      ctx.textAlign = "center";
      ctx.fillText(`Force: ${forceApplied}`, object.x - 30 - arrowLength / 2, OBJECT_Y - 30);
    }

    // Velocity indicator
    if (object.vx !== 0) {
      ctx.fillStyle = "#00AA00";
      ctx.font = "bold 14px Arial";
      ctx.textAlign = "center";
      ctx.fillText(`Speed: ${Math.abs(object.vx).toFixed(1)}`, object.x + object.width / 2, OBJECT_Y - 30);
    }

    // Title
    ctx.fillStyle = "#000";
    ctx.font = "bold 24px Arial";
    ctx.textAlign = "center";
    ctx.fillText(object.name, GAME_WIDTH / 2, 50);

    // Instructions
    if (!isMoving && forceApplied === 0) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
      ctx.font = "14px Arial";
      ctx.textAlign = "center";
      ctx.fillText("Select a force and apply it →", GAME_WIDTH / 2, 100);
    }
  }, [object, forceApplied, isMoving]);

  const handleObjectChange = (objKey: keyof typeof OBJECTS) => {
    const objData = OBJECTS[objKey];
    setSelectedObject(objKey);
    setObject({
      x: START_X,
      vx: 0,
      mass: objData.mass,
      name: objData.name,
      color: objData.color,
      width: objData.width,
      height: objData.height,
    });
    setShowResult(false);
    setForceApplied(0);
  };

  const handleResultNext = () => {
    setShowResult(false);
    setForceApplied(0);
    setObject((prev) => ({
      ...prev,
      x: START_X,
      vx: 0,
    }));
  };

  const handleStart = () => {
    setShowTutorial(false);
  };

  const handleGoBack = () => {
    navigate("/student/physics");
  };

  const handleExitFullscreen = () => {
    setIsFullscreen(false);
  };

  const allObjectsTested =
    results.box > 0 && results.crate > 0 && results.stone > 0;

  const gameContainer = (
    <div
      className={cn(
        "flex flex-col items-center justify-center transition-all duration-300",
        isFullscreen ? "fixed inset-0 z-50 bg-black p-0" : "w-full bg-gradient-to-br from-blue-50 to-cyan-50 p-4"
      )}
    >
      {/* Fullscreen button */}
      {!isFullscreen && (
        <div className="absolute top-4 right-4 z-10">
          <Button
            onClick={() => setIsFullscreen(true)}
            size="sm"
            variant="outline"
            className="gap-2"
          >
            <Maximize2 className="w-4 h-4" />
            Full Screen
          </Button>
        </div>
      )}

      {isFullscreen && (
        <Button
          onClick={() => setIsFullscreen(false)}
          size="sm"
          variant="outline"
          className="absolute top-4 right-4 z-10 gap-2 bg-white"
        >
          <Minimize2 className="w-4 h-4" />
          Exit
        </Button>
      )}

      {/* Canvas */}
      <div className={cn(
        "rounded-lg border-2 border-gray-300 shadow-lg bg-white overflow-hidden",
        isFullscreen ? "w-screen h-screen" : "w-full max-w-4xl"
      )}>
        <canvas
          ref={canvasRef}
          width={GAME_WIDTH}
          height={GAME_HEIGHT}
          className="w-full h-full"
        />
      </div>

      {/* Controls */}
      {!isFullscreen && (
        <div className="mt-6 w-full max-w-4xl bg-white p-6 rounded-lg border border-gray-200">
          <div className="space-y-6">
            {/* Object Selection */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-700">
                Choose an Object
              </label>
              <div className="grid grid-cols-3 gap-3">
                {Object.entries(OBJECTS).map(([key, obj]) => (
                  <Button
                    key={key}
                    onClick={() => handleObjectChange(key as keyof typeof OBJECTS)}
                    variant={selectedObject === key ? "default" : "outline"}
                    className="w-full"
                  >
                    {obj.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Force Selection */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-700">
                Select a Force (Same for all objects)
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[2, 4, 6].map((force) => (
                  <Button
                    key={force}
                    onClick={() => applyForce(force)}
                    disabled={isMoving || forceApplied > 0}
                    variant={forceApplied === force ? "default" : "outline"}
                    className="w-full text-black"
                  >
                    Force {force}
                  </Button>
                ))}
              </div>
            </div>

            {/* Apply / Remove Force */}
            <div className="grid grid-cols-2 gap-3">
              {forceApplied > 0 && !isMoving && (
                <Button
                  onClick={() => applyForce(forceApplied)}
                  size="lg"
                  className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold"
                >
                  ➡️ APPLY!
                </Button>
              )}
              <Button
                onClick={() => {
                  setForceApplied(0);
                  handleObjectChange(selectedObject);
                }}
                variant="outline"
                size="lg"
                className={cn("w-full text-black", forceApplied === 0 && "col-span-2")}
              >
                🔄 Reset
              </Button>
            </div>

            {/* Result Display */}
            {showResult && (
              <div className="p-4 rounded-lg bg-gradient-to-r from-blue-100 to-purple-100 border border-blue-300">
                <div className="text-center mb-4">
                  <div className="text-2xl font-bold text-blue-700 mb-2">
                    {lastDistance}px
                  </div>
                  <div className="text-sm text-gray-700">
                    The {object.name.toLowerCase()} traveled {lastDistance}px
                  </div>
                  <div className="text-xs text-gray-600 mt-2">
                    Heavier objects moved slower with the same force!
                  </div>
                </div>
                <Button
                  onClick={handleResultNext}
                  className="w-full"
                >
                  Try Another Object
                </Button>
              </div>
            )}

            {/* Comparison Table */}
            {Object.values(results).some((r) => r > 0) && (
              <div className="p-4 rounded-lg bg-purple-50 border border-purple-200">
                <h3 className="font-bold text-gray-800 mb-3">📊 Accelerations Observed</h3>
                <div className="space-y-2">
                  {Object.entries(OBJECTS).map(([key, obj]) => (
                    <div key={key} className="flex justify-between items-center">
                      <span className="text-sm font-medium">{obj.name} (M={obj.mass}):</span>
                      <div className="flex items-center gap-3 flex-1 ml-4">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          {results[key as keyof typeof OBJECTS] > 0 && (
                            <div
                              className="bg-blue-500 h-2 rounded-full transition-all"
                              style={{
                                width: `${Math.min((results[key as keyof typeof OBJECTS] / 400) * 100, 100)}%`,
                              }}
                            />
                          )}
                        </div>
                        {results[key as keyof typeof OBJECTS] > 0 && (
                          <span className="text-sm font-bold w-12 text-right">
                            {results[key as keyof typeof OBJECTS]}px
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="text-sm text-gray-600 text-center">
              Total Attempts: {attempts}
            </div>
          </div>
        </div>
      )}

      {/* Embedded Info */}
      {!isFullscreen && (
        <div className="mt-6 w-full max-w-4xl bg-orange-50 p-6 rounded-lg border border-orange-200">
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-gray-800 mb-2">📘 Concept</h3>
              <p className="text-sm text-gray-700">
                Force causes acceleration, not motion itself. The same force creates different accelerations on different masses.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-gray-800 mb-2">🕹 How to Play</h3>
              <p className="text-sm text-gray-700">
                Select an object, choose a force, apply it, and watch what happens. Try different objects with the same force!
              </p>
            </div>
            <div>
              <h3 className="font-bold text-gray-800 mb-2">🧠 What You Learn</h3>
              <p className="text-sm text-gray-700">
                Light objects accelerate faster. Heavy objects resist acceleration. Once the force is removed, motion continues!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <AppLayout>
      <ConceptIntroPopup
        isOpen={showTutorial}
        onStart={handleStart}
        onGoBack={handleGoBack}
        conceptName="Force Builder"
        whatYouWillUnderstand="Understand how force causes acceleration, and how mass affects how much something accelerates."
        gameSteps={[
          "Select an object (Box, Crate, or Stone Block)",
          "Choose a force to apply",
          "Click APPLY! to see the acceleration",
          "Observe how far each object moves",
          "Compare results across objects",
        ]}
        successMeaning="You win when you test all objects with the same force and see that heavier objects accelerate less!"
        icon="⚡"
      />

      <GameCompletionPopup
        isOpen={showCompletion && allObjectsTested}
        onPlayAgain={() => {
          setResults({ box: 0, crate: 0, stone: 0 });
          setAttempts(0);
          setShowCompletion(false);
          handleObjectChange("box");
        }}
        onExitFullscreen={handleExitFullscreen}
        onBackToGames={handleGoBack}
        learningOutcome="You mastered Newton's second law! You understand that force causes acceleration, and mass resists acceleration."
        isFullscreen={isFullscreen}
      />

      <div className="py-6">
        <div className="mb-4 flex items-center gap-2">
          <Button
            onClick={handleGoBack}
            variant="outline"
            size="sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Physics
          </Button>
        </div>

        {gameContainer}

        {allObjectsTested && !showCompletion && (
          <div className="mt-4 max-w-4xl mx-auto">
            <Button
              onClick={() => setShowCompletion(true)}
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold"
              size="lg"
            >
              ✅ I Understand Force & Mass!
            </Button>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
