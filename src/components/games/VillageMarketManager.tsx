import React, { useState, useEffect } from "react";
import { GameStartPopup } from "./GameStartPopup";
import { GameCompletionPopup } from "./GameCompletionPopup";

interface Product {
  id: string;
  name: string;
  emoji: string;
  baseCost: number;
  price: number;
  inventory: number;
  maxInventory: number;
  demandLevel: number;
}

interface Customer {
  id: string;
  product: string;
  willPay: number;
  patience: number;
}

interface VillageMarketManagerProps {
  onGameComplete?: (success: boolean, score: number) => void;
  onExit?: () => void;
}

export function VillageMarketManager({ onGameComplete, onExit }: VillageMarketManagerProps) {
  const [showStartPopup, setShowStartPopup] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [gameSuccess, setGameSuccess] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const [profit, setProfit] = useState(0);
  const [gameTime, setGameTime] = useState(0);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [messages, setMessages] = useState<Array<{ id: string; text: string }>>([]);

  const [products, setProducts] = useState<Product[]>([
    {
      id: "vegetables",
      name: "Vegetables",
      emoji: "🥕",
      baseCost: 20,
      price: 30,
      inventory: 50,
      maxInventory: 100,
      demandLevel: 70,
    },
    {
      id: "grains",
      name: "Grains",
      emoji: "🌾",
      baseCost: 15,
      price: 25,
      inventory: 40,
      maxInventory: 80,
      demandLevel: 65,
    },
    {
      id: "dairy",
      name: "Dairy Products",
      emoji: "🥛",
      baseCost: 25,
      price: 40,
      inventory: 30,
      maxInventory: 60,
      demandLevel: 60,
    },
  ]);

  const [marketReputation, setMarketReputation] = useState(50);

  // Game loop
  useEffect(() => {
    if (!gameStarted || gameComplete) return;

    const interval = setInterval(() => {
      setGameTime((t) => t + 1);

      // Spawn customers randomly
      if (Math.random() > 0.6) {
        const randomProduct = products[Math.floor(Math.random() * products.length)];
        const willPay = randomProduct.baseCost * (2 + Math.random()); // Customer budget

        setCustomers((prev) => [
          ...prev,
          {
            id: Math.random().toString(),
            product: randomProduct.id,
            willPay,
            patience: 5,
          },
        ]);
      }

      // Process customers
      setCustomers((prevCustomers) => {
        const newCustomers = prevCustomers
          .map((customer) => ({
            ...customer,
            patience: customer.patience - 1,
          }))
          .filter((customer) => {
            if (customer.patience <= 0) {
              // Customer left
              addMessage("😞 Customer left - prices too high or inventory empty");
              setMarketReputation((r) => Math.max(0, r - 5));
              return false;
            }

            const product = products.find((p) => p.id === customer.product);
            if (!product) return false;

            // Check if customer will buy
            if (customer.willPay >= product.price && product.inventory > 0) {
              // Purchase!
              const transactionProfit = product.price - product.baseCost;
              setProfit((prev) => prev + transactionProfit);
              addMessage(`✓ Sold ${product.name}! +${transactionProfit} coins`);

              // Update inventory
              setProducts((prev) =>
                prev.map((p) =>
                  p.id === product.id ? { ...p, inventory: p.inventory - 1 } : p
                )
              );

              // Increase reputation
              setMarketReputation((r) => Math.min(100, r + 3));

              return false;
            }

            return true;
          });

        return newCustomers;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [gameStarted, gameComplete, products]);

  // Check win condition
  useEffect(() => {
    if (!gameStarted || gameComplete) return;

    // Win - make good profit and maintain reputation
    if (profit >= 200 && marketReputation >= 70 && gameTime > 15) {
      setGameComplete(true);
      setGameSuccess(true);
      onGameComplete?.(true, 100);
    }

    // Lose - market crashes
    if (marketReputation <= 10 && gameTime > 10) {
      setGameComplete(true);
      setGameSuccess(false);
      onGameComplete?.(false, 30);
    }
  }, [profit, marketReputation, gameComplete, gameStarted, gameTime, onGameComplete]);

  const handlePriceChange = (productId: string, newPrice: number) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, price: Math.max(p.baseCost, newPrice) } : p
      )
    );
  };

  const addMessage = (text: string) => {
    const id = Math.random().toString();
    setMessages((prev) => [...prev, { id, text }]);
    setTimeout(() => {
      setMessages((prev) => prev.filter((m) => m.id !== id));
    }, 2000);
  };

  const getPriceAssessment = (product: Product) => {
    const markup = ((product.price - product.baseCost) / product.baseCost) * 100;
    if (markup < 10) return "Too cheap!";
    if (markup > 80) return "Too expensive!";
    return "Fair price ✓";
  };

  const getCustomerIcon = (product: Product) => {
    if (product.price > product.baseCost * 2.5) return "😠";
    if (product.price < product.baseCost * 1.2) return "😊";
    return "😐";
  };

  const gameContent = (
    <div className="w-full max-w-2xl mx-auto">
      {/* Game Title */}
      <div className="text-center mb-6">
        <h2 className="font-heading text-3xl font-bold text-foreground">🏪 Village Market Manager</h2>
        <p className="text-muted-foreground mt-2">Set fair prices and build your market reputation</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-accent/20 rounded-lg p-3 text-center border border-accent/30">
          <div className="text-2xl font-bold text-accent">{Math.floor(profit)}</div>
          <div className="text-xs text-muted-foreground">Profit (coins)</div>
        </div>
        <div className="bg-secondary/20 rounded-lg p-3 text-center border border-secondary/30">
          <div className="text-2xl font-bold text-secondary">{marketReputation}%</div>
          <div className="text-xs text-muted-foreground">Reputation</div>
        </div>
        <div className="bg-primary/20 rounded-lg p-3 text-center border border-primary/30">
          <div className="text-2xl font-bold text-primary">{gameTime}s</div>
          <div className="text-xs text-muted-foreground">Time</div>
        </div>
      </div>

      {/* Reputation Bar */}
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-semibold text-foreground">📊 Community Trust</span>
          <span className="text-sm font-bold text-secondary">{marketReputation}%</span>
        </div>
        <div className="h-3 bg-slate-700/50 rounded-full overflow-hidden border border-slate-600/50">
          <div
            className={`h-full transition-all ${
              marketReputation < 30
                ? "bg-red-500"
                : marketReputation < 60
                  ? "bg-yellow-500"
                  : "bg-green-500"
            }`}
            style={{ width: `${marketReputation}%` }}
          />
        </div>
      </div>

      {/* Messages */}
      <div className="h-6 mb-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className="text-sm text-green-400 font-semibold animate-fade-out"
          >
            {msg.text}
          </div>
        ))}
      </div>

      {/* Customer Queue */}
      <div className="mb-6 p-4 bg-slate-700/30 rounded-xl border border-slate-600/50">
        <div className="text-sm font-semibold text-muted-foreground mb-2">👥 Customers Waiting</div>
        {customers.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground text-sm">
            No customers yet... set good prices to attract them!
          </div>
        ) : (
          <div className="space-y-1 max-h-16 overflow-y-auto">
            {customers.slice(0, 4).map((customer) => {
              const product = products.find((p) => p.id === customer.product);
              return (
                <div key={customer.id} className="text-xs text-muted-foreground flex justify-between">
                  <span>{product?.emoji} Wants {product?.name}</span>
                  <span className="text-yellow-400">Can pay: {Math.floor(customer.willPay)}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Product Controls */}
      <div className="space-y-4 mb-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="border-2 border-slate-600/50 rounded-xl p-4 bg-slate-700/20"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-3xl">{product.emoji}</span>
                <div>
                  <h3 className="font-semibold text-foreground text-sm">{product.name}</h3>
                  <div className="text-xs text-muted-foreground">
                    Cost: {product.baseCost} | {getCustomerIcon(product)} {getPriceAssessment(product)}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-accent">{Math.floor(product.price)}</div>
                <div className="text-xs text-muted-foreground">Your Price</div>
              </div>
            </div>

            {/* Price Slider */}
            <div className="mb-3">
              <input
                type="range"
                min={Math.max(product.baseCost, 10)}
                max={product.baseCost * 4}
                value={product.price}
                onChange={(e) => handlePriceChange(product.id, parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Cost: {product.baseCost}</span>
                <span>Profit: +{product.price - product.baseCost} per item</span>
              </div>
            </div>

            {/* Inventory */}
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span className="text-xs font-semibold">📦 Stock</span>
                  <span className="text-xs">{product.inventory}/{product.maxInventory}</span>
                </div>
                <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 transition-all"
                    style={{ width: `${(product.inventory / product.maxInventory) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* How to Play */}
      <div className="space-y-3">
        <div className="bg-secondary/10 border border-secondary/30 rounded-xl p-4">
          <h3 className="font-heading font-semibold text-foreground mb-2">🧭 How to Play</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>✓ Adjust prices with sliders</li>
            <li>✓ Fair prices attract customers</li>
            <li>✓ High prices = less customers</li>
            <li>✓ Make profit while keeping reputation high!</li>
          </ul>
        </div>

        <div className="bg-primary/10 border border-primary/30 rounded-xl p-4">
          <h3 className="font-heading font-semibold text-foreground mb-2">🧠 What You Learn</h3>
          <p className="text-sm text-muted-foreground">
            Fair prices build strong communities. Balance profit with customer happiness to create a thriving market everyone trusts.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full">
      {showStartPopup && (
        <GameStartPopup
          title="Village Market Manager"
          discover="How village markets work and why fair prices matter"
          challenge="Set prices that attract customers and build your profit"
          success="Make 200 coins while keeping community reputation high"
          onStart={() => {
            setShowStartPopup(false);
            setGameStarted(true);
          }}
          onCancel={onExit || (() => {})}
        />
      )}

      {gameComplete && (
        <GameCompletionPopup
          title="Village Market Manager"
          message={gameSuccess ? "Your market thrives! Fair prices built trust! 🏪" : "Market reputation crashed - prices were too unfair!"}
          isSuccess={gameSuccess}
          coins={gameSuccess ? 50 : 10}
          xp={gameSuccess ? 100 : 30}
          onReplay={() => {
            setGameComplete(false);
            setGameSuccess(false);
            setGameTime(0);
            setProfit(0);
            setMarketReputation(50);
            setCustomers([]);
            setShowStartPopup(true);
            setGameStarted(false);
            setProducts([
              {
                id: "vegetables",
                name: "Vegetables",
                emoji: "🥕",
                baseCost: 20,
                price: 30,
                inventory: 50,
                maxInventory: 100,
                demandLevel: 70,
              },
              {
                id: "grains",
                name: "Grains",
                emoji: "🌾",
                baseCost: 15,
                price: 25,
                inventory: 40,
                maxInventory: 80,
                demandLevel: 65,
              },
              {
                id: "dairy",
                name: "Dairy Products",
                emoji: "🥛",
                baseCost: 25,
                price: 40,
                inventory: 30,
                maxInventory: 60,
                demandLevel: 60,
              },
            ]);
          }}
          onExit={onExit || (() => {})}
        />
      )}

      {gameStarted && !gameComplete && (
        <div className={`${isFullscreen ? "fixed inset-0 z-40 bg-background" : ""} flex items-center justify-center p-4`}>
          <div className={`${isFullscreen ? "w-full h-full flex flex-col" : "w-full max-w-3xl"} relative`}>
            {/* Fullscreen Button */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="absolute top-4 right-4 p-2 bg-muted hover:bg-muted/80 rounded-lg text-foreground transition-colors z-10"
              title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
            >
              ⛶
            </button>

            {/* Game Content */}
            <div className={isFullscreen ? "flex-1 overflow-y-auto p-4" : ""}>{gameContent}</div>
          </div>
        </div>
      )}

      {!gameStarted && !showStartPopup && <div className="p-4">{gameContent}</div>}
    </div>
  );
}
