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
} from "lucide-react";

interface CircuitTile {
  id: number;
  // Connections on each side: top, right, bottom, left
  connections: [boolean, boolean, boolean, boolean];
  rotation: number; // 0, 90, 180, 270
  gridX: number;
  gridY: number;
}

export default function TechnologyVillageLightUp() {
  const navigate = useNavigate();
  const [showIntro, setShowIntro] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [tiles, setTiles] = useState<CircuitTile[]>([]);
  const [gameWon, setGameWon] = useState(false);
  const [level, setLevel] = useState(1);
  const [gridSize, setGridSize] = useState(3);

  // Initialize game
  useEffect(() => {
    if (!showIntro) {
      initializeGame();
    }
  }, [showIntro, level]);

  const initializeGame = () => {
    const size = level === 1 ? 3 : level === 2 ? 4 : 5;
    setGridSize(size);

    // Define correct circuit path for each level
    const newTiles: CircuitTile[] = [];
    
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const id = y * size + x;
        
        // Define which tiles should have connections based on level
        // Level 1: simple 3x3 grid with straight line from top-left to bottom-right
        let connections: [boolean, boolean, boolean, boolean] = [false, false, false, false];
        
        if (level === 1) {
          // Simple path: top row, middle column, bottom row
          if (y === 0) connections = [true, x < 2, true, x > 0]; // top row
          else if (x === 1 && y > 0 && y < 2) connections = [true, true, true, true]; // middle center
          else if (y === 2) connections = [true, x < 2, true, x > 0]; // bottom row
        } else if (level === 2) {
          // More complex pattern
          if ((x === 0 || x === 3) && y <= 3) connections = [y > 0, false, y < 3, false];
          else if (y === 0 || y === 3) connections = [false, x < 3, false, x > 0];
        } else {
          // Level 3: complex grid
          if (x === 2 && y <= 4) connections = [y > 0, false, y < 4, false];
          else if (y === 2 && x <= 4) connections = [false, x < 4, false, x > 0];
        }

        // Randomize rotation but keep at least 1 wrong initially
        let rotation = [0, 90, 180, 270][Math.floor(Math.random() * 4)];
        
        newTiles.push({
          id,
          connections,
          rotation,
          gridX: x,
          gridY: y,
        });
      }
    }

    setTiles(newTiles);
    setGameWon(false);
  };

  const rotateClockwise = (id: number) => {
    setTiles((prevTiles) => {
      const updated = prevTiles.map((tile) =>
        tile.id === id ? { ...tile, rotation: (tile.rotation + 90) % 360 } : tile
      );
      checkWinCondition(updated);
      return updated;
    });
  };

  const checkWinCondition = (currentTiles: CircuitTile[]) => {
    // Win when all connections are pointing in correct cardinal directions (0° = up)
    const allCorrect = currentTiles.every((tile) => tile.rotation === 0);
    if (allCorrect) {
      setGameWon(true);
    }
  };

  const handleGameStart = () => {
    setShowIntro(false);
  };

  const handleNextLevel = () => {
    if (level < 3) {
      setLevel(level + 1);
      setGameWon(false);
    }
  };

  const handleComplete = () => {
    navigate("/student/technology");
  };

  const getTileVisual = (tile: CircuitTile) => {
    // Determine which sides have connections
    const [top, right, bottom, left] = tile.connections;
    
    // Create a simple visual representation
    let visual = "□";
    if (top && bottom) visual = "║";
    else if (left && right) visual = "═";
    else if ((top && right) || (right && bottom) || (bottom && left) || (left && top)) visual = "╔";
    
    if (tile.rotation === 0) visual = "↑";
    else if (tile.rotation === 90) visual = "→";
    else if (tile.rotation === 180) visual = "↓";
    else if (tile.rotation === 270) visual = "←";

    return visual;
  };

  const isCorrect = (tile: CircuitTile) => tile.rotation === 0;

  // Intro modal
  if (showIntro) {
    return (
      <Dialog open={showIntro} onOpenChange={setShowIntro}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl">⚡ Village Light-Up</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-primary/10 rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-2">📘 What You Will Learn</h3>
              <p className="text-sm text-muted-foreground">
                Understand how electrical circuits work. All connection points must point in the same direction for electricity to flow!
              </p>
            </div>

            <div className="bg-secondary/10 rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-2">🎮 How to Play</h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• <strong>Goal:</strong> Rotate all tiles so arrows point UP (↑)</li>
                <li>• Tap any tile to rotate it 90° clockwise</li>
                <li>• Tiles show: ↑ (correct) or → ↓ ← (needs rotation)</li>
                <li>• <strong>All tiles pointing UP = complete circuit = WIN!</strong></li>
              </ul>
            </div>

            <div className="bg-accent/10 rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-2">💡 Key Concept</h3>
              <p className="text-sm text-muted-foreground">
                Each time you tap, the tile rotates 90°. Keep tapping until all arrows point UP to complete the circuit!
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
            <DialogTitle className="text-2xl">🎉 Circuit Complete!</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-6xl mb-4">💡✨</p>
              <p className="text-lg font-semibold text-primary">Village is GLOWING!</p>
              <p className="text-sm text-muted-foreground mt-2">
                All connections aligned! Electricity flows perfectly!
              </p>
            </div>

            <div className="bg-green-500/20 border border-green-500 rounded-lg p-4">
              <h3 className="font-semibold mb-2 text-green-700">✓ You Learned:</h3>
              <p className="text-sm text-green-600">
                Circuits need complete paths with all connections pointing the same direction. That's how electricity flows!
              </p>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              <p>⭐ +{150 + level * 15} XP Earned!</p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button onClick={handleComplete} className="flex-1 bg-secondary">
                🏠 Back to Games
              </Button>
              {level < 3 && (
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

  // Main game UI
  return (
    <div className="fixed inset-0 z-40 bg-black/50 flex items-center justify-center p-4">
      <div className={`bg-background rounded-2xl overflow-hidden shadow-2xl ${isFullscreen ? 'w-full h-full' : 'max-w-2xl w-full'}`}>
        {/* Game Area */}
        <div className={`${isFullscreen ? 'h-screen' : 'h-96'} bg-gradient-to-b from-purple-900 via-blue-900 to-blue-800 flex flex-col relative`}>
          {/* Controls - Always visible and on top */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
            <div className="text-white">
              <h2 className="text-2xl font-bold">⚡ Village Light-Up</h2>
              <p className="text-sm text-blue-200">Level {level} - Make all arrows point UP ↑</p>
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
                  className="bg-yellow-500 hover:bg-yellow-600 p-2 rounded-lg text-white transition font-bold"
                  title="Minimize (ESC also works)"
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

          {/* Game Grid */}
          <div className="flex-1 flex items-center justify-center p-8">
            <div
              className="grid gap-2"
              style={{
                gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
                width: Math.min(400, (gridSize * 80) + (gridSize * 8)),
              }}
            >
              {tiles.map((tile) => (
                <button
                  key={tile.id}
                  onClick={() => rotateClockwise(tile.id)}
                  className={`
                    w-16 h-16 rounded-lg font-bold text-2xl transition-all
                    flex items-center justify-center cursor-pointer
                    transform hover:scale-110 active:scale-95
                    border-2 shadow-lg
                    ${
                      isCorrect(tile)
                        ? "bg-gradient-to-br from-green-400 to-emerald-500 border-green-600 text-white"
                        : "bg-gradient-to-br from-yellow-400 to-orange-500 border-yellow-600 text-white hover:shadow-2xl"
                    }
                  `}
                  title={`Tap to rotate | Currently: ${["↑ UP", "→ RIGHT", "↓ DOWN", "← LEFT"][tile.rotation / 90]}`}
                >
                  {tile.rotation === 0 ? "↑" : tile.rotation === 90 ? "→" : tile.rotation === 180 ? "↓" : "←"}
                </button>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div className="absolute bottom-4 left-4 right-4 bg-black/60 text-white rounded-lg p-3 text-sm">
            <p>
              <strong>⬆️ Rotate all tiles so arrows point UP!</strong> Yellow = rotate needed. Green = correct! ✓
            </p>
          </div>
        </div>

        {/* Info Panel (only show when not fullscreen) */}
        {!isFullscreen && (
          <div className="p-6 space-y-4 bg-background max-h-64 overflow-y-auto">
            <div>
              <h3 className="font-semibold text-lg mb-2">💡 How This Game Works</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Each tile shows an arrow. You must rotate ALL tiles so they point UP. When all arrows point UP, the circuit is complete!
              </p>
              
              <div className="bg-primary/10 rounded p-3 mb-3">
                <p className="text-xs text-primary font-semibold mb-1">Progress:</p>
                <div className="w-full bg-gray-300 rounded h-2">
                  <div
                    className="bg-green-500 h-2 rounded transition-all"
                    style={{
                      width: `${(tiles.filter(isCorrect).length / tiles.length) * 100}%`,
                    }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {tiles.filter(isCorrect).length}/{tiles.length} tiles correct
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-sm mb-2">🎯 Learning Concept</h3>
              <p className="text-xs text-muted-foreground">
                Electricity flows through circuits when all parts are aligned correctly. Misaligned connections = broken circuit = no light!
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
