import React, { useState } from "react";

interface ModuleProps {
  title: string;
  goal: string;
  children: React.ReactNode;
}

function ActiveLearningModule({ title, goal, children }: ModuleProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h4 className="font-heading font-semibold text-foreground mb-1">{title}</h4>
      <p className="text-xs text-muted-foreground mb-4">{goal}</p>
      <div className="bg-primary/5 rounded-lg p-4 min-h-32">
        {children}
      </div>
    </div>
  );
}

// Module 1: Life Process Simulator
function LifeProcessSimulator() {
  const [water, setWater] = useState(50);
  const [air, setAir] = useState(50);
  const [food, setFood] = useState(50);
  const [message, setMessage] = useState("Your organism is thriving! 🌱");
  const [health, setHealth] = useState(100);

  const calculateHealth = () => {
    const avg = (water + air + food) / 3;
    let status = "Thriving! 🌱";
    let color = "text-green-600";
    let bgColor = "bg-green-500/20";
    let healthValue = 100;

    if (avg < 20) {
      status = "Organism is struggling... 😢";
      color = "text-red-600";
      bgColor = "bg-red-500/20";
      healthValue = 20;
    } else if (avg < 40) {
      status = "Organism is weak 😔";
      color = "text-orange-600";
      bgColor = "bg-orange-500/20";
      healthValue = 40;
    } else if (avg > 80) {
      status = "Organism is thriving! 🌟";
      color = "text-green-600";
      bgColor = "bg-green-500/20";
      healthValue = 100;
    } else {
      status = "Organism is doing okay 😐";
      color = "text-yellow-600";
      bgColor = "bg-yellow-500/20";
      healthValue = 60;
    }

    return { status, color, bgColor, healthValue };
  };

  const { status, color, bgColor, healthValue } = calculateHealth();

  return (
    <ActiveLearningModule
      title="🌱 Life Process Simulator"
      goal="Toggle water, air, and food to see how organisms react"
    >
      <div className="space-y-4">
        {/* Organism Display */}
        <div className={`p-4 rounded-lg text-center ${bgColor}`}>
          <div className="text-4xl mb-2">
            {healthValue >= 80 ? "🦋" : healthValue >= 40 ? "🐛" : "😞"}
          </div>
          <div className={`text-sm font-semibold ${color}`}>{status}</div>
        </div>

        {/* Health Bar */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold">Life Health</span>
            <span className="text-xs font-bold text-primary">{healthValue}%</span>
          </div>
          <div className="h-3 bg-slate-300 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-300"
              style={{ width: `${healthValue}%` }}
            />
          </div>
        </div>

        {/* Sliders for Life Needs */}
        <div className="space-y-3">
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-xs font-semibold">💧 Water</label>
              <span className="text-xs font-bold text-blue-600">{water}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={water}
              onChange={(e) => setWater(Number(e.target.value))}
              className="w-full"
            />
            <div className="text-xs text-muted-foreground mt-1">
              {water < 30 ? "❌ Too dry" : water > 80 ? "❌ Too wet" : "✓ Good level"}
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="text-xs font-semibold">💨 Air</label>
              <span className="text-xs font-bold text-cyan-600">{air}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={air}
              onChange={(e) => setAir(Number(e.target.value))}
              className="w-full"
            />
            <div className="text-xs text-muted-foreground mt-1">
              {air < 30 ? "❌ Can't breathe" : air > 80 ? "❌ Too much wind" : "✓ Perfect"}
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="text-xs font-semibold">🍎 Food</label>
              <span className="text-xs font-bold text-orange-600">{food}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={food}
              onChange={(e) => setFood(Number(e.target.value))}
              className="w-full"
            />
            <div className="text-xs text-muted-foreground mt-1">
              {food < 30 ? "❌ Hungry" : food > 80 ? "❌ Overfed" : "✓ Just right"}
            </div>
          </div>
        </div>

        <div className="text-xs text-center text-muted-foreground bg-white dark:bg-slate-800 p-2 rounded">
          Balance all three to keep the organism healthy!
        </div>
      </div>
    </ActiveLearningModule>
  );
}

// Module 2: Organ Explorer
function OrganExplorer() {
  const organs = [
    { name: "Heart", emoji: "❤️", role: "Pumps blood" },
    { name: "Lungs", emoji: "💨", role: "Gets oxygen" },
    { name: "Brain", emoji: "🧠", role: "Controls body" },
    { name: "Stomach", emoji: "🍽️", role: "Digests food" },
  ];

  const [selectedOrgan, setSelectedOrgan] = useState<string | null>("Heart");
  const [working, setWorking] = useState<Record<string, boolean>>({
    Heart: true,
    Lungs: true,
    Brain: true,
    Stomach: true,
  });

  const getEffects = (): Record<string, string[]> => {
    const effects: Record<string, string[]> = {
      Heart: [],
      Lungs: [],
      Brain: [],
      Stomach: [],
    };

    if (!working.Heart) {
      effects.Heart.push("❌ Blood stops flowing");
      effects.Brain.push("⚠️ Brain gets no oxygen");
      effects.Lungs.push("⚠️ Can't help blood");
    }

    if (!working.Lungs) {
      effects.Lungs.push("❌ Can't get oxygen");
      effects.Heart.push("⚠️ Nothing to pump");
      effects.Brain.push("⚠️ No oxygen!");
    }

    if (!working.Brain) {
      effects.Brain.push("❌ Can't control body");
      effects.Heart.push("⚠️ Heartbeat irregular");
      effects.Stomach.push("⚠️ Can't digest");
    }

    if (!working.Stomach) {
      effects.Stomach.push("❌ Can't digest food");
      effects.Heart.push("⚠️ No energy for blood");
      effects.Brain.push("⚠️ Weak and tired");
    }

    return effects;
  };

  const effects = getEffects();
  const allWorking = Object.values(working).every((w) => w);

  return (
    <ActiveLearningModule
      title="🫀 Organ Explorer"
      goal="Tap organs to turn them off and see how the body reacts"
    >
      <div className="space-y-4">
        {/* Status */}
        <div
          className={`p-3 rounded-lg text-center font-semibold ${
            allWorking
              ? "bg-green-500/20 text-green-600"
              : "bg-red-500/20 text-red-600"
          }`}
        >
          {allWorking ? "✓ All organs working!" : "⚠️ Some organs are broken!"}
        </div>

        {/* Organ Grid */}
        <div className="grid grid-cols-2 gap-2">
          {organs.map((organ) => (
            <button
              key={organ.name}
              onClick={() =>
                setWorking({ ...working, [organ.name]: !working[organ.name] })
              }
              className={`p-4 rounded-lg transition-all ${
                working[organ.name]
                  ? "bg-white dark:bg-slate-800 border-2 border-green-500/50 hover:border-green-500"
                  : "bg-red-500/20 border-2 border-red-500/50"
              }`}
            >
              <div className="text-3xl mb-2">{organ.emoji}</div>
              <div className="text-sm font-semibold">{organ.name}</div>
              <div className="text-xs text-muted-foreground">{organ.role}</div>
              <div className="text-xs font-bold mt-1">
                {working[organ.name] ? "✓ Working" : "❌ Broken"}
              </div>
            </button>
          ))}
        </div>

        {/* Effects Display */}
        {selectedOrgan && effects[selectedOrgan]?.length > 0 && (
          <div className="bg-orange-500/20 border border-orange-500/50 p-3 rounded-lg">
            <div className="text-xs font-semibold text-orange-600 mb-2">
              What happens when {selectedOrgan} stops working:
            </div>
            {effects[selectedOrgan].map((effect, idx) => (
              <div key={idx} className="text-xs text-orange-600">
                • {effect}
              </div>
            ))}
          </div>
        )}

        <div className="text-xs text-center text-muted-foreground bg-white dark:bg-slate-800 p-2 rounded">
          Tap an organ to turn it off and see chain reactions!
        </div>
      </div>
    </ActiveLearningModule>
  );
}

// Module 3: Living vs Non-Living Sorter
function LivingVsNonLivingSorter() {
  const items = [
    { id: 1, name: "Tree", emoji: "🌳", isLiving: true },
    { id: 2, name: "Rock", emoji: "🪨", isLiving: false },
    { id: 3, name: "Dog", emoji: "🐕", isLiving: true },
    { id: 4, name: "Cup", emoji: "🥤", isLiving: false },
    { id: 5, name: "Flower", emoji: "🌸", isLiving: true },
    { id: 6, name: "Pen", emoji: "✏️", isLiving: false },
  ];

  const [sorted, setSorted] = useState<Record<number, "living" | "dead" | null>>({
    1: null,
    2: null,
    3: null,
    4: null,
    5: null,
    6: null,
  });

  const correct = items.filter(
    (item) =>
      (item.isLiving && sorted[item.id] === "living") ||
      (!item.isLiving && sorted[item.id] === "dead")
  ).length;

  const handleSort = (id: number, zone: "living" | "dead") => {
    setSorted({ ...sorted, [id]: sorted[id] === zone ? null : zone });
  };

  const handleReset = () => {
    setSorted({
      1: null,
      2: null,
      3: null,
      4: null,
      5: null,
      6: null,
    });
  };

  return (
    <ActiveLearningModule
      title="🐱 Living vs Non-Living Sorter"
      goal="Drag items into the correct zones — Living or Non-Living"
    >
      <div className="space-y-4">
        {/* Score */}
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">{correct}/6</div>
          <div className="text-xs text-muted-foreground">Correct Sorts</div>
        </div>

        {/* Items to Sort */}
        <div className="grid grid-cols-3 gap-2">
          {items.map((item) => (
            <div key={item.id} className="space-y-2">
              <div className="text-2xl text-center">{item.emoji}</div>
              <div className="text-xs text-center font-semibold text-muted-foreground">
                {item.name}
              </div>
              <div className="flex gap-1 justify-center">
                <button
                  onClick={() => handleSort(item.id, "living")}
                  className={`text-xs px-2 py-1 rounded transition-colors ${
                    sorted[item.id] === "living"
                      ? "bg-green-500 text-white"
                      : "bg-slate-500/20 text-slate-600 hover:bg-slate-500/30"
                  }`}
                >
                  🌱
                </button>
                <button
                  onClick={() => handleSort(item.id, "dead")}
                  className={`text-xs px-2 py-1 rounded transition-colors ${
                    sorted[item.id] === "dead"
                      ? "bg-gray-500 text-white"
                      : "bg-slate-500/20 text-slate-600 hover:bg-slate-500/30"
                  }`}
                >
                  🪨
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Reset Button */}
        <div className="flex justify-center">
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-slate-500/20 text-slate-600 rounded-lg font-semibold hover:bg-slate-500/30 transition-colors text-sm"
          >
            Reset All
          </button>
        </div>

        {correct === 6 && (
          <div className="bg-green-500/20 border border-green-500/50 p-3 rounded-lg text-center">
            <div className="text-sm font-bold text-green-600">
              ✓ Perfect! You know the difference! 🎉
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground bg-white dark:bg-slate-800 p-2 rounded text-center">
          Living things grow, eat, and move. Non-living things don't!
        </div>
      </div>
    </ActiveLearningModule>
  );
}

export function BiologyActiveLearning() {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="mb-2 font-heading font-semibold">Active Learning</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Learn biology by interacting — simulate, explore, and discover!
        </p>
      </div>
      <LifeProcessSimulator />
      <OrganExplorer />
      <LivingVsNonLivingSorter />
    </div>
  );
}
