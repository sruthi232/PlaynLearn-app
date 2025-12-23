import { useState, useRef, useEffect } from "react";
import { AppLayout } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { ConceptIntroPopup } from "@/components/ui/concept-intro-popup";
import { GameCompletionPopup } from "@/components/ui/game-completion-popup";
import { ArrowLeft, Maximize2, Minimize2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface Cart {
  x: number;
  vx: number;
  active: boolean;
}

const GAME_WIDTH = 800;
const GAME_HEIGHT = 400;
const CART_START_X = 100;
const CART_START_Y = 280;
const CART_WIDTH = 40;
const CART_HEIGHT = 30;

const SURFACES = {
  mud: {
    name: "Mud",
    friction: 0.92,
    color: "#8B6F47",
    grassColor: "#6B4423",
    distance: 0,
  },
  grass: {
    name: "Grass",
    friction: 0.96,
    color: "#90EE90",
    grassColor: "#228B22",
    distance: 0,
  },
  stone: {
    name: "Stone",
    friction: 0.98,
    color: "#A9A9A9",
    grassColor: "#696969",
    distance: 0,
  },
};

export default function VillagePhysicsExplorer() {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showTutorial, setShowTutorial] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [selectedSurface, setSelectedSurface] = useState<keyof typeof SURFACES>("mud");
  const [results, setResults] = useState<Record<keyof typeof SURFACES, number>>({
    mud: 0,
    grass: 0,
    stone: 0,
  });
  const [currentCart, setCurrentCart] = useState<Cart>({
    x: CART_START_X,
    vx: 0,
    active: false,
  });
  const [attempts, setAttempts] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [lastDistance, setLastDistance] = useState(0);
  const animationRef = useRef<number | null>(null);

  const push = () => {
    const pushForce = 8;
    setCurrentCart({
      x: CART_START_X,
      vx: pushForce,
      active: true,
    });
    setAttempts((prev) => prev + 1);
  };

  useEffect(() => {
    if (!currentCart.active) return;

    const animate = () => {
      setCurrentCart((prev) => {
        let newCart = { ...prev };
        const surface = SURFACES[selectedSurface];
        newCart.vx *= surface.friction;

        if (Math.abs(newCart.vx) < 0.1) {
          newCart.active = false;
          const distance = Math.round(newCart.x - CART_START_X);
          setLastDistance(distance);
          setResults((prev) => ({
            ...prev,
            [selectedSurface]: distance,
          }));
          setShowResult(true);
          return newCart;
        }

        newCart.x += newCart.vx;
        if (newCart.x > GAME_WIDTH - 50) {
          newCart.active = false;
          const distance = GAME_WIDTH - 50 - CART_START_X;
          setLastDistance(distance);
          setResults((prev) => ({
            ...prev,
            [selectedSurface]: distance,
          }));
          setShowResult(true);
          return newCart;
        }

        return newCart;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [currentCart.active, selectedSurface]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const surface = SURFACES[selectedSurface];

    // Sky
    ctx.fillStyle = "#87CEEB";
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Sun
    ctx.fillStyle = "#FFD700";
    ctx.beginPath();
    ctx.arc(700, 80, 40, 0, Math.PI * 2);
    ctx.fill();

    // Road/Surface
    ctx.fillStyle = surface.color;
    ctx.fillRect(0, CART_START_Y + CART_HEIGHT + 10, GAME_WIDTH, GAME_HEIGHT - CART_START_Y - CART_HEIGHT - 10);

    // Grass pattern for surface
    ctx.fillStyle = surface.grassColor;
    for (let i = 0; i < GAME_WIDTH; i += 50) {
      ctx.fillRect(i, CART_START_Y + CART_HEIGHT + 10, 25, 5);
    }

    // Distance marker lines
    ctx.strokeStyle = "rgba(0, 0, 0, 0.3)";
    ctx.lineWidth = 1;
    for (let i = 0; i < GAME_WIDTH; i += 100) {
      ctx.beginPath();
      ctx.moveTo(i, CART_START_Y + CART_HEIGHT + 5);
      ctx.lineTo(i, CART_START_Y + CART_HEIGHT + 20);
      ctx.stroke();
    }

    // Cart
    const cartY = CART_START_Y;
    ctx.fillStyle = "#FF0000";
    ctx.fillRect(currentCart.x, cartY, CART_WIDTH, CART_HEIGHT);

    // Wheels
    ctx.fillStyle = "#333";
    ctx.beginPath();
    ctx.arc(currentCart.x + 10, cartY + CART_HEIGHT, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(currentCart.x + 30, cartY + CART_HEIGHT, 6, 0, Math.PI * 2);
    ctx.fill();

    // Cart handle
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(currentCart.x, cartY);
    ctx.lineTo(currentCart.x - 10, cartY - 10);
    ctx.stroke();

    // Surface name
    ctx.fillStyle = "#000";
    ctx.font = "bold 24px Arial";
    ctx.textAlign = "center";
    ctx.fillText(surface.name, GAME_WIDTH / 2, 50);

    // Distance traveled
    if (showResult && lastDistance > 0) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
      ctx.font = "bold 18px Arial";
      ctx.textAlign = "center";
      ctx.fillText(`Distance: ${lastDistance}px`, GAME_WIDTH / 2, 100);
    }

    // Friction visualization arrow while moving
    if (currentCart.active && currentCart.vx > 0.2) {
      const frictionArrowX = currentCart.x + CART_WIDTH / 2;
      const frictionArrowY = CART_START_Y - 40;
      const arrowLength = Math.abs(currentCart.vx) * 5;

      // Draw friction arrow pointing backward (opposing motion)
      ctx.strokeStyle = "#FF6B35";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(frictionArrowX, frictionArrowY);
      ctx.lineTo(frictionArrowX - arrowLength, frictionArrowY);
      ctx.stroke();

      // Arrow head
      ctx.beginPath();
      ctx.moveTo(frictionArrowX - arrowLength, frictionArrowY);
      ctx.lineTo(frictionArrowX - arrowLength + 10, frictionArrowY - 6);
      ctx.lineTo(frictionArrowX - arrowLength + 10, frictionArrowY + 6);
      ctx.closePath();
      ctx.fillStyle = "#FF6B35";
      ctx.fill();

      // Friction label
      ctx.fillStyle = "#000";
      ctx.font = "bold 12px Arial";
      ctx.textAlign = "center";
      ctx.fillText("Friction", frictionArrowX - arrowLength / 2, frictionArrowY - 15);
    }

    // Friction indicator
    ctx.fillStyle = "#666";
    ctx.font = "14px Arial";
    ctx.textAlign = "right";
    ctx.fillText(`Friction: ${(surface.friction * 100).toFixed(0)}%`, GAME_WIDTH - 20, GAME_HEIGHT - 20);
  }, [currentCart, selectedSurface, showResult, lastDistance]);

  const handleResultNext = () => {
    setShowResult(false);
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

  const allSurfacesTested = Object.keys(SURFACES).length === 3 && results.mud > 0 && results.grass > 0 && results.stone > 0;

  const gameContainer = (
    <div
      className={cn(
        "flex flex-col items-center justify-center transition-all duration-300",
        isFullscreen ? "fixed inset-0 z-50 bg-black p-0" : "w-full bg-background p-4"
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
        "rounded-lg border-2 border-border shadow-lg bg-card overflow-hidden",
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
        <div className="mt-6 w-full max-w-4xl bg-card p-6 rounded-lg border border-border">
          <div className="space-y-6">
            {/* Surface Selection */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-700">
                Choose a Surface
              </label>
              <div className="grid grid-cols-3 gap-3">
                {Object.entries(SURFACES).map(([key, surface]) => (
                  <Button
                    key={key}
                    onClick={() => {
                      setSelectedSurface(key as keyof typeof SURFACES);
                      setShowResult(false);
                      setCurrentCart({ x: CART_START_X, vx: 0, active: false });
                    }}
                    variant={selectedSurface === key ? "default" : "outline"}
                    className="w-full"
                  >
                    {surface.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Push Button */}
            <Button
              onClick={push}
              disabled={currentCart.active}
              size="lg"
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold"
            >
              💨 PUSH (Same Force)
            </Button>

            {/* Result Display */}
            {showResult && (
              <div className="p-4 rounded-lg bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-300">
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-purple-700 mb-2">
                    {lastDistance}px
                  </div>
                  <div className="text-sm text-gray-700">
                    The cart rolled {lastDistance} pixels on {SURFACES[selectedSurface].name.toLowerCase()}
                  </div>
                </div>
                <Button
                  onClick={handleResultNext}
                  className="w-full"
                >
                  Try Another Surface
                </Button>
              </div>
            )}

            {/* Comparison Table */}
            {Object.values(results).some((r) => r > 0) && (
              <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                <h3 className="font-bold text-gray-800 mb-3">📊 Distances Recorded</h3>
                <div className="space-y-2">
                  {Object.entries(SURFACES).map(([key, surface]) => (
                    <div key={key} className="flex justify-between items-center">
                      <span className="text-sm font-medium">{surface.name}:</span>
                      <div className="flex items-center gap-3 flex-1 ml-4">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          {results[key as keyof typeof SURFACES] > 0 && (
                            <div
                              className="bg-green-500 h-2 rounded-full transition-all"
                              style={{
                                width: `${Math.min((results[key as keyof typeof SURFACES] / 400) * 100, 100)}%`,
                              }}
                            />
                          )}
                        </div>
                        {results[key as keyof typeof SURFACES] > 0 && (
                          <span className="text-sm font-bold w-12 text-right">
                            {results[key as keyof typeof SURFACES]}px
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
              Total Pushes: {attempts}
            </div>
          </div>
        </div>
      )}

      {/* Embedded Info */}
      {!isFullscreen && (
        <div className="mt-6 w-full max-w-4xl bg-green-50 p-6 rounded-lg border border-green-200">
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-gray-800 mb-2">📘 Concept</h3>
              <p className="text-sm text-gray-700">
                Different surfaces create different amounts of friction. Friction opposes motion and makes things slow down faster.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-gray-800 mb-2">🕹 How to Play</h3>
              <p className="text-sm text-gray-700">
                Select a surface, push the cart with the same force each time, and observe how far it travels. Compare distances across surfaces!
              </p>
            </div>
            <div>
              <h3 className="font-bold text-gray-800 mb-2">🧠 What You Learn</h3>
              <p className="text-sm text-gray-700">
                Mud has high friction (stops quickly). Grass is moderate. Stone has low friction (rolls farthest). Surface matters more than force!
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
        conceptName="Village Physics Explorer"
        whatYouWillUnderstand="Discover how different surfaces change how things move. Same push, different result!"
        gameSteps={[
          "Choose a surface (Mud, Grass, or Stone)",
          "Push the cart with the same force",
          "Observe how far it travels",
          "Try other surfaces and compare",
        ]}
        successMeaning="You win when you test all surfaces and compare their distances. Stone lets the cart roll farthest!"
        icon="🏞️"
      />

      <GameCompletionPopup
        isOpen={showCompletion && allSurfacesTested}
        onPlayAgain={() => {
          setResults({ mud: 0, grass: 0, stone: 0 });
          setAttempts(0);
          setShowCompletion(false);
        }}
        onExitFullscreen={handleExitFullscreen}
        onBackToGames={handleGoBack}
        learningOutcome="You discovered how friction works! You now understand that the surface matters more than the force applied."
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

        {allSurfacesTested && !showCompletion && (
          <div className="mt-4 max-w-4xl mx-auto">
            <Button
              onClick={() => setShowCompletion(true)}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold"
              size="lg"
            >
              ✅ I Understand Friction!
            </Button>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
