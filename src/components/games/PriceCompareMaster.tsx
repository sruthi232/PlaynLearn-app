import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

interface Product {
  id: string;
  shopName: string;
  price: number;
  quantity: number;
  unit: string;
  icon: string;
}

interface Round {
  id: number;
  productName: string;
  products: Product[];
  bestDealId: string;
}

const rounds: Round[] = [
  {
    id: 1,
    productName: "🥛 Milk",
    products: [
      { id: "a", shopName: "Local Store", price: 60, quantity: 1, unit: "L", icon: "🏪" },
      { id: "b", shopName: "Big Bazaar", price: 100, quantity: 2, unit: "L", icon: "🏬" },
      { id: "c", shopName: "Premium Shop", price: 80, quantity: 1.5, unit: "L", icon: "✨" },
    ],
    bestDealId: "b", // 50 per liter
  },
  {
    id: 2,
    productName: "🍎 Apples",
    products: [
      { id: "a", shopName: "Street Vendor", price: 120, quantity: 1.5, unit: "kg", icon: "🚗" },
      { id: "b", shopName: "Supermarket", price: 100, quantity: 1, unit: "kg", icon: "🏬" },
      { id: "c", shopName: "Organic Shop", price: 180, quantity: 2, unit: "kg", icon: "🌱" },
    ],
    bestDealId: "a", // 80 per kg
  },
  {
    id: 3,
    productName: "📓 Notebooks",
    products: [
      { id: "a", shopName: "Stationery Store", price: 50, quantity: 1, unit: "piece", icon: "📚" },
      { id: "b", shopName: "Online Store", price: 150, quantity: 4, unit: "pieces", icon: "💻" },
      { id: "c", shopName: "School Shop", price: 200, quantity: 5, unit: "pieces", icon: "🏫" },
    ],
    bestDealId: "b", // 37.5 per piece
  },
];

interface GameState {
  currentRound: number;
  score: number;
  correctAnswers: number;
  gameStatus: "playing" | "won" | "lost";
}

export function PriceCompareMaster({ onComplete }: { onComplete: (score: number) => void }) {
  const [gameState, setGameState] = useState<GameState>({
    currentRound: 0,
    score: 0,
    correctAnswers: 0,
    gameStatus: "playing",
  });

  const [feedback, setFeedback] = useState<string>("");
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const currentRound = rounds[gameState.currentRound];
  const products = currentRound?.products || [];

  const calculatePricePerUnit = (product: Product): number => {
    return product.price / product.quantity;
  };

  const handleSelectProduct = (product: Product) => {
    if (selectedOption) return; // Prevent multiple selections

    setSelectedOption(product.id);
    const isCorrect = product.id === currentRound.bestDealId;

    if (isCorrect) {
      setFeedback(`🎉 Correct! Best value: ₹${calculatePricePerUnit(product).toFixed(2)}/${product.unit}`);
      const newScore = gameState.score + 100;
      const newCorrect = gameState.correctAnswers + 1;

      setTimeout(() => {
        if (gameState.currentRound + 1 >= rounds.length) {
          setGameState({
            ...gameState,
            gameStatus: "won",
            score: newScore,
            correctAnswers: newCorrect,
          });
          onComplete(newScore);
        } else {
          setGameState({
            currentRound: gameState.currentRound + 1,
            score: newScore,
            correctAnswers: newCorrect,
            gameStatus: "playing",
          });
          setSelectedOption(null);
          setFeedback("");
        }
      }, 2000);
    } else {
      setFeedback(
        `❌ Not the best value! This costs ₹${calculatePricePerUnit(product).toFixed(2)}/${product.unit}`
      );
      const bestProduct = products.find((p) => p.id === currentRound.bestDealId)!;
      setFeedback(
        `❌ Not the best value! Best is ₹${calculatePricePerUnit(bestProduct).toFixed(2)}/${bestProduct.unit}`
      );

      setTimeout(() => {
        const newScore = Math.max(0, gameState.score - 20);
        if (gameState.currentRound + 1 >= rounds.length) {
          setGameState({
            ...gameState,
            gameStatus: "won",
            score: newScore,
          });
          onComplete(newScore);
        } else {
          setGameState({
            currentRound: gameState.currentRound + 1,
            score: newScore,
            correctAnswers: gameState.correctAnswers,
            gameStatus: "playing",
          });
          setSelectedOption(null);
          setFeedback("");
        }
      }, 2000);
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-purple-50 to-pink-50 p-8 gap-6 overflow-y-auto">
      {/* Title & Progress */}
      <div className="w-full max-w-4xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-gray-600 font-semibold">Round {gameState.currentRound + 1}/{rounds.length}</p>
            <p className="text-3xl font-bold text-purple-700">💰 Price Compare Master</p>
          </div>
          <div className="text-right bg-yellow-100 border-2 border-yellow-400 rounded-lg p-3">
            <p className="text-sm text-yellow-700 font-semibold">Score</p>
            <p className="text-2xl font-bold text-yellow-900">{gameState.score}</p>
          </div>
        </div>
      </div>

      {/* Product Name */}
      <div className="w-full max-w-4xl text-center">
        <p className="text-2xl font-bold text-purple-800 mb-2">Choose the best value for:</p>
        <p className="text-5xl mb-2">{currentRound?.productName}</p>
        <p className="text-sm text-gray-600">
          Best value = lowest price PER unit, not lowest total price!
        </p>
      </div>

      {/* Product Options */}
      <div className="w-full max-w-4xl space-y-3">
        {products.map((product, index) => {
          const pricePerUnit = calculatePricePerUnit(product);
          const isSelected = selectedOption === product.id;
          const bestProduct = products.find((p) => p.id === currentRound.bestDealId);
          const isBestDeal = product.id === currentRound.bestDealId;

          return (
            <button
              key={product.id}
              onClick={() => handleSelectProduct(product)}
              disabled={!!selectedOption}
              className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                isSelected
                  ? isBestDeal
                    ? "bg-green-200 border-green-500"
                    : "bg-red-200 border-red-500"
                  : "bg-white border-purple-300 hover:border-purple-500"
              } ${selectedOption ? "cursor-not-allowed" : "cursor-pointer"}`}
            >
              <div className="flex items-start gap-4">
                <div className="text-4xl">{product.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-bold text-lg text-gray-900">{product.shopName}</p>
                    {isSelected && (
                      <CheckCircle2 className={`h-6 w-6 ${isBestDeal ? "text-green-600" : "text-red-600"}`} />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {product.quantity} {product.unit} for ₹{product.price}
                  </p>
                  <div className="bg-gray-100 rounded p-2">
                    <p className="text-xs text-gray-500">Price per unit</p>
                    <p className="font-bold text-lg text-purple-700">
                      ₹{pricePerUnit.toFixed(2)}/{product.unit}
                    </p>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {feedback && (
        <Card className={`w-full max-w-4xl p-4 text-center font-semibold text-lg border-2 ${
          selectedOption === currentRound.bestDealId
            ? "bg-green-100 border-green-400 text-green-800"
            : "bg-red-100 border-red-400 text-red-800"
        }`}>
          {feedback}
        </Card>
      )}

      {/* Learning Tip */}
      {!feedback && (
        <Card className="w-full max-w-4xl bg-blue-50 border-2 border-blue-300 p-4">
          <p className="text-sm text-blue-900">
            💡 <strong>Tip:</strong> Calculate the price per unit (total price ÷ quantity) to compare fairly!
          </p>
        </Card>
      )}

      {/* Game Complete */}
      {gameState.gameStatus === "won" && (
        <Card className="w-full max-w-4xl bg-green-100 border-2 border-green-400 p-6 text-center">
          <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-2" />
          <h3 className="font-heading text-xl font-bold text-green-800">🎉 Expert Shopper!</h3>
          <p className="text-green-700 mt-2">You found {gameState.correctAnswers}/{rounds.length} best deals!</p>
          <p className="text-green-600 text-sm mt-1">Final Score: {gameState.score}</p>
        </Card>
      )}
    </div>
  );
}
