import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Maximize2, Minimize2, RotateCcw, X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface GameContainerProps {
  gameComponent: React.ReactNode;
  instructions: string;
  conceptLearned: string;
  onRetry: () => void;
  onExit: () => void;
  gameName: string;
}

export function GameContainer({
  gameComponent,
  instructions,
  conceptLearned,
  onRetry,
  onExit,
  gameName,
}: GameContainerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isExpandedView, setIsExpandedView] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [fullscreenUnavailable, setFullscreenUnavailable] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleFullscreenClick = async () => {
    try {
      const element = containerRef.current?.querySelector("[data-game-canvas]");
      if (!isFullscreen && element) {
        if (element.requestFullscreen) {
          try {
            await element.requestFullscreen();
            setIsFullscreen(true);
            // Lock scroll
            document.documentElement.style.overflow = "hidden";
            document.body.style.overflow = "hidden";
          } catch (fullscreenError: any) {
            // Fullscreen API is blocked by permissions policy or browser
            console.warn("Fullscreen not available, using expanded view instead:", fullscreenError);
            setFullscreenUnavailable(true);
            setIsExpandedView(true);
          }
        } else {
          // Fullscreen not supported, use expanded view
          setFullscreenUnavailable(true);
          setIsExpandedView(true);
        }
      } else if (isFullscreen) {
        if (document.fullscreenElement) {
          await document.exitFullscreen();
        }
        setIsFullscreen(false);
        // Unlock scroll
        document.documentElement.style.overflow = "";
        document.body.style.overflow = "";
      } else if (isExpandedView) {
        setIsExpandedView(false);
      }
    } catch (error) {
      console.error("Fullscreen error:", error);
      // Fallback to expanded view
      setFullscreenUnavailable(true);
      setIsExpandedView(!isExpandedView);
    }
  };

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setIsFullscreen(false);
        document.documentElement.style.overflow = "";
        document.body.style.overflow = "";
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // Check if fullscreen is available on mount
  useEffect(() => {
    const element = containerRef.current?.querySelector("[data-game-canvas]") as Element;
    const hasFullscreenSupport =
      element && (
        (element as any).requestFullscreen ||
        (element as any).webkitRequestFullscreen ||
        (element as any).mozRequestFullScreen ||
        (element as any).msRequestFullscreen
      );

    if (!hasFullscreenSupport) {
      setFullscreenUnavailable(true);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, []);

  const handleExitClick = () => {
    if (isFullscreen || isExpandedView) {
      setShowExitConfirm(true);
    } else {
      onExit();
    }
  };

  const handleConfirmExit = async () => {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    }
    setIsFullscreen(false);
    setIsExpandedView(false);
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
    onExit();
  };

  const isInExpandedMode = isFullscreen || isExpandedView;

  return (
    <div ref={containerRef} className="w-full mx-auto">
      {/* Game Canvas Container */}
      <div
        data-game-canvas
        className={`w-full bg-gradient-to-b from-background to-muted/30 rounded-2xl overflow-hidden border border-border/50 ${
          isExpandedView ? "fixed inset-0 z-50 rounded-none border-0" : ""
        }`}
      >
        <div className="relative w-full" style={{ aspectRatio: isExpandedView ? "auto" : "16 / 9" }}>
          {/* Expand/Fullscreen Button - Top Right */}
          <button
            onClick={handleFullscreenClick}
            className="absolute top-4 right-4 z-50 h-10 w-10 rounded-lg bg-black/50 hover:bg-black/70 flex items-center justify-center text-white transition-colors"
            title={
              isFullscreen
                ? "Exit Fullscreen"
                : isExpandedView
                ? "Exit Expanded View"
                : fullscreenUnavailable
                ? "Expand to Fill Screen"
                : "Fullscreen"
            }
          >
            {isInExpandedMode ? (
              <Minimize2 className="h-5 w-5" />
            ) : (
              <Maximize2 className="h-5 w-5" />
            )}
          </button>

          {/* Game Component */}
          <div className={`w-full h-full flex items-center justify-center overflow-hidden ${
            isExpandedView ? "h-screen" : ""
          }`}>
            {gameComponent}
          </div>

          {/* Expanded/Fullscreen Controls */}
          {isInExpandedMode && (
            <div className="absolute bottom-4 left-4 right-4 z-50 flex gap-2 justify-center flex-wrap">
              <Button
                onClick={onRetry}
                size="sm"
                className="bg-primary hover:bg-primary/90"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Retry
              </Button>
              <Button
                onClick={handleExitClick}
                size="sm"
                className="bg-destructive hover:bg-destructive/90"
              >
                <X className="h-4 w-4 mr-2" />
                Exit
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Fullscreen Unavailable Info */}
      {fullscreenUnavailable && !isInExpandedMode && (
        <div className="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
          <p className="text-sm text-blue-800">
            💡 <strong>Tip:</strong> Click the expand button in the top-right to play in a larger view!
          </p>
        </div>
      )}

      {/* Instructions & Learning Section */}
      {!isInExpandedMode && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Instructions */}
          <Card className="glass-card border border-border/50 p-5 rounded-xl">
            <h3 className="font-heading font-semibold text-foreground mb-3 flex items-center gap-2">
              <span className="text-lg">📘</span>
              Instructions
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{instructions}</p>
          </Card>

          {/* Concept Learned */}
          <Card className="glass-card border border-border/50 p-5 rounded-xl">
            <h3 className="font-heading font-semibold text-foreground mb-3 flex items-center gap-2">
              <span className="text-lg">🧠</span>
              Concept Learned
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{conceptLearned}</p>
          </Card>
        </div>
      )}

      {/* Game Controls */}
      {!isInExpandedMode && (
        <div className="mt-8 flex gap-3 justify-center flex-wrap">
          <Button
            onClick={onRetry}
            variant="outline"
            className="px-6 py-2 rounded-lg"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Retry
          </Button>
          <Button
            onClick={handleExitClick}
            variant="outline"
            className="px-6 py-2 rounded-lg"
          >
            <X className="h-4 w-4 mr-2" />
            Exit Game
          </Button>
        </div>
      )}

      {/* Exit Confirmation Dialog */}
      <Dialog open={showExitConfirm} onOpenChange={setShowExitConfirm}>
        <DialogContent>
          <DialogTitle>Exit Game?</DialogTitle>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mt-1">
                Your progress will be saved. Are you sure you want to exit?
              </p>
            </div>
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowExitConfirm(false)}
                className="flex-1"
              >
                Keep Playing
              </Button>
              <Button
                onClick={handleConfirmExit}
                className="flex-1 bg-destructive hover:bg-destructive/90"
              >
                Exit
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
