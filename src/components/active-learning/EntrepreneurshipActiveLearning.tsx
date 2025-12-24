import React, { useState } from "react";

interface ModuleProps {
  title: string;
  goal: string;
  children: React.ReactNode;
}

function ActiveLearningModule({ title, goal, children }: ModuleProps) {
  return (
    <div className="glass-card rounded-xl border border-border p-5">
      <h4 className="font-heading font-semibold text-foreground mb-1">{title}</h4>
      <p className="text-xs text-muted-foreground mb-4">{goal}</p>
      <div className="glass-card rounded-lg p-4 min-h-32 border border-border/50">
        {children}
      </div>
    </div>
  );
}

// Module 1: Problem → Solution Mapper
function ProblemSolutionMapper() {
  const problems = [
    {
      id: 1,
      problem: "villagers walk 5km for water",
      solutions: [
        { text: "Build well nearby", feasible: true },
        { text: "Import magic wand", feasible: false },
      ],
    },
    {
      id: 2,
      problem: "crops need better soil",
      solutions: [
        { text: "Teach composting", feasible: true },
        { text: "Paint soil green", feasible: false },
      ],
    },
    {
      id: 3,
      problem: "children can't go to school",
      solutions: [
        { text: "Build school in village", feasible: true },
        { text: "Make children fly", feasible: false },
      ],
    },
  ];

  const [selected, setSelected] = useState<number | null>(0);
  const [chosen, setChosen] = useState<Record<number, boolean | null>>({
    1: null,
    2: null,
    3: null,
  });

  const currentProblem = selected !== null ? problems[selected] : null;
  const allCorrect = Object.values(chosen).every((v) => v === true);

  return (
    <ActiveLearningModule
      title="💡 Problem → Solution Mapper"
      goal="Choose feasible solutions to village problems"
    >
      <div className="space-y-4">
        {/* Problem Selection */}
        <div>
          <div className="text-xs font-semibold mb-2">Select a Problem:</div>
          <div className="space-y-2">
            {problems.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelected(p.id - 1)}
                className={`w-full text-left p-3 rounded-lg transition-all ${
                  selected === p.id - 1
                    ? "bg-primary/20 text-primary border border-primary/50"
                    : "glass-card bg-card/50 border border-border hover:border-primary/50"
                }`}
              >
                <div className="text-sm font-semibold">Problem {p.id}: {p.problem}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Solutions */}
        {currentProblem && (
          <div>
            <div className="text-xs font-semibold mb-2">Choose Solutions:</div>
            <div className="space-y-2">
              {currentProblem.solutions.map((solution, idx) => (
                <button
                  key={idx}
                  onClick={() =>
                    setChosen({
                      ...chosen,
                      [currentProblem.id]: solution.feasible,
                    })
                  }
                  className={`w-full p-3 rounded-lg transition-all text-left ${
                    chosen[currentProblem.id] === solution.feasible
                      ? solution.feasible
                        ? "bg-green-500/20 border border-green-500/50 text-green-600"
                        : "bg-red-500/20 border border-red-500/50 text-red-600"
                      : "glass-card border border-border hover:border-primary/50"
                  }`}
                >
                  <div className="text-sm font-semibold">{solution.text}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {solution.feasible ? "✓ Can really work" : "❌ Not realistic"}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Feedback */}
        {allCorrect && (
          <div className="bg-green-500/20 border border-green-500/50 p-3 rounded-lg text-center">
            <div className="text-sm font-bold text-green-600">
              ✓ Great business thinking! 🎉
            </div>
          </div>
        )}

        <div className="text-xs text-center text-muted-foreground glass-card border border-border/50 p-2 rounded">
          Every business solves a real problem
        </div>
      </div>
    </ActiveLearningModule>
  );
}

// Module 2: Cost vs Profit Slider
function CostVsProfitSlider() {
  const [cost, setCost] = useState(30);
  const [price, setPrice] = useState(60);
  const [demand, setDemand] = useState(50);

  const calculateProfit = () => {
    if (price <= cost) return 0;
    const profitPerItem = price - cost;
    const sold = Math.floor((demand / 100) * 100);
    return profitPerItem * sold;
  };

  const profit = calculateProfit();
  const profitPerItem = Math.max(0, price - cost);
  const sold = Math.floor((demand / 100) * 100);

  const getStatus = () => {
    if (price <= cost) return { text: "❌ Losing money!", color: "text-red-600", bg: "bg-red-500/20" };
    if (profit < 500) return { text: "⚠️ Low profit", color: "text-orange-600", bg: "bg-orange-500/20" };
    if (profit > 2000) return { text: "✓ Great profit!", color: "text-green-600", bg: "bg-green-500/20" };
    return { text: "✓ Good profit", color: "text-yellow-600", bg: "bg-yellow-500/20" };
  };

  const status = getStatus();

  return (
    <ActiveLearningModule
      title="💰 Cost vs Profit Slider"
      goal="Adjust cost, price, and demand to maximize profit"
    >
      <div className="space-y-4">
        {/* Profit Display */}
        <div className={`p-4 rounded-lg text-center ${status.bg}`}>
          <div className={`text-3xl font-bold ${status.color}`}>₹{profit}</div>
          <div className={`text-sm font-semibold ${status.color}`}>{status.text}</div>
        </div>

        {/* Sliders */}
        <div className="space-y-3">
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-xs font-semibold">Cost to Make: ₹{cost}</label>
              <span className="text-xs text-red-600 font-bold">Cost</span>
            </div>
            <input
              type="range"
              min="10"
              max="80"
              value={cost}
              onChange={(e) => setCost(Number(e.target.value))}
              className="w-full"
            />
            <div className="text-xs text-muted-foreground mt-1">
              Lower cost = higher profit per item
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="text-xs font-semibold">Selling Price: ₹{price}</label>
              <span className="text-xs text-green-600 font-bold">Price</span>
            </div>
            <input
              type="range"
              min="10"
              max="150"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full"
            />
            <div className="text-xs text-muted-foreground mt-1">
              Higher price = less demand but more profit per item
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="text-xs font-semibold">Customer Demand: {demand}%</label>
              <span className="text-xs text-primary font-bold">Demand</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              value={demand}
              onChange={(e) => setDemand(Number(e.target.value))}
              className="w-full"
            />
            <div className="text-xs text-muted-foreground mt-1">
              Good price & quality = higher demand
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="glass-card p-3 rounded-lg space-y-1 text-sm border border-border/50">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Profit per item:</span>
            <span className="font-bold text-primary">₹{profitPerItem}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Items sold:</span>
            <span className="font-bold text-primary">{sold}</span>
          </div>
          <div className="flex justify-between border-t border-border pt-2">
            <span className="text-muted-foreground">Total Profit:</span>
            <span className="font-bold text-primary">₹{profit}</span>
          </div>
        </div>

        <div className="text-xs text-center text-muted-foreground glass-card border border-border/50 p-2 rounded">
          Find the right balance between cost, price, and demand
        </div>
      </div>
    </ActiveLearningModule>
  );
}

// Module 3: Decision Consequence Board
function DecisionConsequenceBoard() {
  const decisions = [
    {
      id: 1,
      title: "Lower Price to Get Customers",
      shortTerm: "✓ More people buy",
      longTerm: "❌ Less money per item",
    },
    {
      id: 2,
      title: "Invest in Advertising",
      shortTerm: "💰 Costs money today",
      longTerm: "✓ More customers forever",
    },
    {
      id: 3,
      title: "Hire Local Workers",
      shortTerm: "💰 Extra salary cost",
      longTerm: "✓ Faster, better business",
    },
    {
      id: 4,
      title: "Use Cheap Materials",
      shortTerm: "✓ Save money now",
      longTerm: "❌ Customers lose trust",
    },
  ];

  const [understanding, setUnderstanding] = useState<Record<number, boolean | null>>({
    1: null,
    2: null,
    3: null,
    4: null,
  });

  const goodDecisions = [2, 3];
  const correct = decisions.filter((d) =>
    goodDecisions.includes(d.id)
      ? understanding[d.id] === true
      : understanding[d.id] === false
  ).length;

  return (
    <ActiveLearningModule
      title="🎯 Decision Consequence Board"
      goal="Mark decisions as good (✓) or bad (❌) based on long-term impact"
    >
      <div className="space-y-4">
        {/* Score */}
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">{correct}/4</div>
          <div className="text-xs text-muted-foreground">Correct Decisions</div>
        </div>

        {/* Decisions */}
        <div className="space-y-2">
          {decisions.map((decision) => (
            <div
              key={decision.id}
              className="p-3 rounded-lg border border-border glass-card"
            >
              <div className="text-sm font-semibold mb-2">{decision.title}</div>
              <div className="text-xs text-muted-foreground mb-2 space-y-1">
                <div>🔥 Short-term: {decision.shortTerm}</div>
                <div>📈 Long-term: {decision.longTerm}</div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    setUnderstanding({
                      ...understanding,
                      [decision.id]: understanding[decision.id] === true ? null : true,
                    })
                  }
                  className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-colors ${
                    understanding[decision.id] === true
                      ? "bg-green-500 text-white"
                      : "bg-slate-500/20 text-slate-600 hover:bg-slate-500/30"
                  }`}
                >
                  ✓ Good
                </button>
                <button
                  onClick={() =>
                    setUnderstanding({
                      ...understanding,
                      [decision.id]: understanding[decision.id] === false ? null : false,
                    })
                  }
                  className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-colors ${
                    understanding[decision.id] === false
                      ? "bg-red-500 text-white"
                      : "bg-slate-500/20 text-slate-600 hover:bg-slate-500/30"
                  }`}
                >
                  ❌ Bad
                </button>
              </div>
            </div>
          ))}
        </div>

        {correct === 4 && (
          <div className="bg-green-500/20 border border-green-500/50 p-3 rounded-lg text-center">
            <div className="text-sm font-bold text-green-600">
              ✓ You think like a real entrepreneur! 🎉
            </div>
          </div>
        )}

        <div className="text-xs text-center text-muted-foreground glass-card border border-border/50 p-2 rounded">
          Good decisions help your business grow long-term
        </div>
      </div>
    </ActiveLearningModule>
  );
}

export function EntrepreneurshipActiveLearning() {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="mb-2 font-heading font-semibold">Active Learning</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Learn business thinking through solving real problems!
        </p>
      </div>
      <ProblemSolutionMapper />
      <CostVsProfitSlider />
      <DecisionConsequenceBoard />
    </div>
  );
}
