import { useState } from "react";
import { useParams } from "react-router-dom";
import { AppLayout } from "@/components/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AnimatedProgress } from "@/components/ui/animated-progress";
import { 
  BookOpen, 
  ChevronRight, 
  ChevronLeft,
  CheckCircle2,
  Clock,
  Bookmark,
  Sparkles,
  Lightbulb,
  Beaker,
  Zap,
  Globe,
  Brain,
  Users,
  Target,
  TrendingUp,
  Calculator,
  Wallet,
  Laptop,
  TreePine
} from "lucide-react";
import { useReadingProgress } from "@/hooks/use-reading-progress";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import mascotTeacher from "@/assets/mascot-teacher.png";
import mascotEager from "@/assets/mascot-eager.png";
import mascotCelebrating from "@/assets/mascot-celebrating.png";

interface Chapter {
  id: string;
  title: string;
  duration: string;
  icon: React.ElementType;
  content: {
    heading: string;
    paragraphs: string[];
    keyPoints?: string[];
    funFact?: string;
    illustration?: string;
    activity?: {
      title: string;
      description: string;
    };
  }[];
}

interface SubjectContent {
  title: string;
  description: string;
  chapters: Chapter[];
}

const subjectContents: Record<string, SubjectContent> = {
  physics: {
    title: "Physics",
    description: "Understanding the laws that govern our universe",
    chapters: [
      {
        id: "motion",
        title: "Motion & Movement",
        duration: "10 min",
        icon: Zap,
        content: [
          {
            heading: "What is Motion?",
            paragraphs: [
              "Motion is everywhere around us. When a bird flies, a car moves, or even when you walk to school - that's all motion!",
              "In physics, we say an object is in motion when its position changes with respect to its surroundings over time.",
              "Think about it: even as you sit reading this, the Earth is moving around the Sun at 107,000 km per hour!",
            ],
            keyPoints: [
              "Motion means change in position",
              "We need a reference point to describe motion",
              "Everything in the universe is constantly moving",
            ],
            illustration: "🌍 → 🌞 The Earth orbits the Sun",
          },
          {
            heading: "Types of Motion",
            paragraphs: [
              "There are different types of motion we see every day. Understanding them helps us predict how objects will move.",
              "• Linear Motion: Moving in a straight line (like a train on tracks)",
              "• Circular Motion: Moving in a circle (like a ceiling fan)",
              "• Oscillatory Motion: Moving back and forth (like a swing or pendulum)",
              "• Random Motion: Moving without a pattern (like dust particles in air)",
            ],
            funFact: "The Earth is moving around the Sun at about 107,000 km per hour, but we don't feel it because everything around us moves together!",
            activity: {
              title: "Try This!",
              description: "Drop a ball and watch it bounce. Can you identify what type of motion it makes? (Hint: It's a combination!)"
            },
          },
          {
            heading: "Speed and Velocity",
            paragraphs: [
              "Speed tells us how fast something is moving. It's calculated as: Speed = Distance ÷ Time",
              "For example, if you walk 5 km in 1 hour, your speed is 5 km/h.",
              "Velocity is speed with direction. A car going 60 km/h North has a different velocity than one going 60 km/h South!",
            ],
            keyPoints: [
              "Speed = Distance ÷ Time",
              "Velocity includes direction",
              "Average speed = Total distance ÷ Total time",
            ],
            illustration: "🚗 → 60 km/h = Speed | 🚗 → 60 km/h North = Velocity",
          },
        ],
      },
      {
        id: "force",
        title: "Force & Its Effects",
        duration: "12 min",
        icon: Target,
        content: [
          {
            heading: "Understanding Force",
            paragraphs: [
              "A force is a push or pull that can change the motion of an object. When you kick a ball, you apply force to it.",
              "Forces can make things start moving, stop moving, speed up, slow down, or change direction.",
              "Forces always come in pairs - when you push against a wall, the wall pushes back against you!",
            ],
            keyPoints: [
              "Force = Push or Pull",
              "Force can change speed and direction",
              "Force is measured in Newtons (N)",
              "Forces always act in pairs",
            ],
            illustration: "👋 → ⚽ = Ball moves | 👋 → 🧱 = Wall pushes back",
          },
          {
            heading: "Newton's First Law",
            paragraphs: [
              "An object stays at rest or continues moving in a straight line unless a force acts on it.",
              "This is called the Law of Inertia. Inertia is the tendency of objects to resist changes in their motion.",
              "That's why you feel pushed forward when a bus suddenly stops - your body wants to keep moving!",
            ],
            funFact: "Newton supposedly got inspired to think about gravity when he saw an apple fall from a tree!",
            activity: {
              title: "Quick Experiment",
              description: "Place a coin on a card over a glass. Flick the card quickly. The coin falls straight down because of inertia!"
            },
          },
          {
            heading: "Newton's Second & Third Laws",
            paragraphs: [
              "Second Law: Force = Mass × Acceleration (F = ma). Heavier objects need more force to accelerate.",
              "Third Law: Every action has an equal and opposite reaction. When you jump, you push the ground down, and it pushes you up!",
              "These laws explain everything from why rockets fly to why you can walk.",
            ],
            keyPoints: [
              "F = ma (Force equals mass times acceleration)",
              "More mass = more force needed",
              "Every action has an equal opposite reaction",
            ],
            illustration: "🚀 = Fire pushes down, rocket goes up!",
          },
        ],
      },
      {
        id: "energy",
        title: "Energy & Its Forms",
        duration: "15 min",
        icon: Lightbulb,
        content: [
          {
            heading: "What is Energy?",
            paragraphs: [
              "Energy is the ability to do work. Without energy, nothing can move, grow, or change.",
              "Energy cannot be created or destroyed - it can only change from one form to another. This is called Conservation of Energy.",
              "The Sun is our main source of energy. Plants use it to make food, which we eat to get energy!",
            ],
            keyPoints: [
              "Energy is needed for all activities",
              "Energy is measured in Joules (J)",
              "Energy can transform between forms",
              "Total energy in a system stays constant",
            ],
            illustration: "☀️ → 🌱 → 🥕 → 🏃 Energy Flow!",
          },
          {
            heading: "Types of Energy",
            paragraphs: [
              "Kinetic Energy: Energy of motion. A moving car, a running child, flowing water all have kinetic energy.",
              "Potential Energy: Stored energy. A stretched rubber band, water in a dam, food - all have potential energy.",
              "Other forms include heat (thermal), light, sound, electrical, chemical, and nuclear energy!",
            ],
            funFact: "A single lightning bolt contains enough energy to toast 100,000 slices of bread!",
            activity: {
              title: "Energy Hunt",
              description: "Look around your room. Can you find 5 things that have energy? What type of energy do they have?"
            },
          },
          {
            heading: "Energy Transformation",
            paragraphs: [
              "Energy constantly changes from one form to another. A fan converts electrical energy to kinetic energy.",
              "In your body, chemical energy from food becomes kinetic energy for movement and heat energy to keep you warm.",
              "Power plants convert various energy sources (coal, water, sunlight) into electrical energy for our use.",
            ],
            keyPoints: [
              "Energy changes form, never disappears",
              "Some energy is always lost as heat",
              "Machines transform energy for useful work",
            ],
          },
        ],
      },
      {
        id: "electricity",
        title: "Electricity Basics",
        duration: "14 min",
        icon: Zap,
        content: [
          {
            heading: "The Flow of Electrons",
            paragraphs: [
              "Electricity is the flow of tiny particles called electrons through a conductor like wire.",
              "Just like water flows through pipes, electricity flows through wires to power our devices.",
              "Electrons are so small that billions of them flow through a wire every second!",
            ],
            keyPoints: [
              "Electrons carry electric charge",
              "Conductors allow electricity to flow",
              "Insulators stop electricity flow",
              "Metals are good conductors",
            ],
            funFact: "A bolt of lightning can contain up to 1 billion volts of electricity and reach temperatures of 30,000°C!",
          },
          {
            heading: "Electric Circuits",
            paragraphs: [
              "A circuit is a complete path through which electricity can flow. It needs a power source, wires, and a device.",
              "If the circuit is broken (like when you switch off a light), electricity stops flowing.",
              "Series circuits have components in a line. Parallel circuits have multiple paths for electricity.",
            ],
            activity: {
              title: "Safety First!",
              description: "Always remember: Never touch electrical outlets with wet hands. Water conducts electricity and can be dangerous!"
            },
            illustration: "🔋 → 💡 → 🔋 Complete Circuit = Light ON!",
          },
        ],
      },
      {
        id: "waves",
        title: "Waves & Sound",
        duration: "13 min",
        icon: Globe,
        content: [
          {
            heading: "What are Waves?",
            paragraphs: [
              "Waves are disturbances that transfer energy from one place to another without transferring matter.",
              "When you drop a stone in water, the ripples are waves. The water moves up and down, but doesn't travel with the wave.",
              "Sound, light, and even earthquakes are all types of waves!",
            ],
            keyPoints: [
              "Waves transfer energy, not matter",
              "Waves have crests (high points) and troughs (low points)",
              "Wavelength is the distance between two crests",
            ],
          },
          {
            heading: "Sound Waves",
            paragraphs: [
              "Sound is a wave that travels through air (or other materials) when objects vibrate.",
              "When you speak, your vocal cords vibrate and create sound waves that travel to others' ears.",
              "Sound cannot travel through vacuum (empty space) - that's why space is silent!",
            ],
            funFact: "Dolphins can hear sounds that are 14 times higher than what humans can hear!",
            activity: {
              title: "Sound Experiment",
              description: "Put your fingers on your throat and hum. Feel the vibrations? That's how you make sound!"
            },
          },
        ],
      },
    ],
  },
  chemistry: {
    title: "Chemistry",
    description: "Exploring the building blocks of matter",
    chapters: [
      {
        id: "matter",
        title: "Matter & Its States",
        duration: "11 min",
        icon: Beaker,
        content: [
          {
            heading: "What is Matter?",
            paragraphs: [
              "Everything around you is made of matter. Your book, the air you breathe, even you yourself!",
              "Matter is anything that has mass and takes up space (volume).",
              "Even things we can't see, like air, are made of matter. That's why balloons expand when filled!",
            ],
            keyPoints: [
              "Matter has mass and volume",
              "Three main states: Solid, Liquid, Gas",
              "Matter is made of tiny particles called atoms",
              "Atoms combine to form molecules",
            ],
            illustration: "🧊 Solid → 💧 Liquid → 💨 Gas",
          },
          {
            heading: "States of Matter",
            paragraphs: [
              "Solids have a fixed shape and volume. Particles are tightly packed and vibrate in place.",
              "Liquids have a fixed volume but take the shape of their container. Particles can slide past each other.",
              "Gases have no fixed shape or volume. Particles move freely and spread to fill any container.",
            ],
            funFact: "Water is the only substance on Earth that naturally exists in all three states: ice, water, and steam!",
            activity: {
              title: "Kitchen Science",
              description: "Watch an ice cube melt, then ask an adult to boil some water. You just saw all three states of matter!"
            },
          },
          {
            heading: "Changing States",
            paragraphs: [
              "Matter can change from one state to another by adding or removing heat energy.",
              "Melting: Solid to liquid (ice to water). Freezing: Liquid to solid (water to ice).",
              "Evaporation: Liquid to gas (water to steam). Condensation: Gas to liquid (steam to water droplets).",
            ],
            keyPoints: [
              "Heat causes particles to move faster",
              "Melting point of water: 0°C",
              "Boiling point of water: 100°C",
            ],
          },
        ],
      },
      {
        id: "atoms",
        title: "Atoms & Elements",
        duration: "14 min",
        icon: Globe,
        content: [
          {
            heading: "The Tiny Building Blocks",
            paragraphs: [
              "Everything is made of atoms - they're the building blocks of all matter!",
              "Atoms are incredibly tiny. A single drop of water contains more atoms than there are stars in the sky!",
              "An atom has a nucleus (center) with protons and neutrons, and electrons that orbit around it.",
            ],
            keyPoints: [
              "Atoms are the smallest unit of an element",
              "Protons have positive charge",
              "Electrons have negative charge",
              "Neutrons have no charge",
            ],
            illustration: "⚛️ Nucleus (protons + neutrons) with electrons orbiting",
          },
          {
            heading: "Elements",
            paragraphs: [
              "An element is a pure substance made of only one type of atom. Gold is made only of gold atoms.",
              "There are 118 known elements, organized in the Periodic Table.",
              "Common elements: Oxygen (O), Carbon (C), Hydrogen (H), Iron (Fe), Gold (Au)",
            ],
            funFact: "Your body is about 65% oxygen, 18% carbon, and 10% hydrogen by mass!",
          },
        ],
      },
      {
        id: "reactions",
        title: "Chemical Reactions",
        duration: "13 min",
        icon: Zap,
        content: [
          {
            heading: "When Substances Change",
            paragraphs: [
              "A chemical reaction happens when substances combine or break apart to form new substances.",
              "When you cook food, burn wood, or even digest your lunch - these are all chemical reactions!",
              "Signs of a chemical reaction: color change, gas bubbles, heat/light released, new smell.",
            ],
            keyPoints: [
              "New substances are formed",
              "Energy may be released or absorbed",
              "Reactions can be fast or slow",
              "Reactions cannot be easily reversed",
            ],
            funFact: "Your body performs millions of chemical reactions every second just to keep you alive!",
          },
          {
            heading: "Types of Reactions",
            paragraphs: [
              "Combination: Two or more substances combine to form one (like iron + oxygen = rust).",
              "Decomposition: One substance breaks into simpler substances (like water splitting into hydrogen and oxygen).",
              "Combustion: Burning! A substance reacts with oxygen to release heat and light.",
            ],
            activity: {
              title: "Safe Reaction",
              description: "Mix baking soda and vinegar in a bowl. The fizzing is a chemical reaction producing carbon dioxide gas!"
            },
          },
        ],
      },
      {
        id: "acids",
        title: "Acids, Bases & Salts",
        duration: "12 min",
        icon: Beaker,
        content: [
          {
            heading: "Understanding pH",
            paragraphs: [
              "Acids taste sour (like lemon), bases taste bitter (like soap), and salts are formed when acids and bases react.",
              "We measure how acidic or basic something is using the pH scale, from 0 to 14.",
              "Never taste chemicals to test them! Scientists use indicators like litmus paper.",
            ],
            keyPoints: [
              "pH 7 is neutral (like pure water)",
              "Below 7 is acidic (lemon = 2)",
              "Above 7 is basic/alkaline (soap = 9-10)",
              "Stomach acid has pH around 2!",
            ],
            illustration: "🍋 pH 2 ← → pH 7 💧 ← → pH 12 🧼",
          },
          {
            heading: "Acids and Bases in Daily Life",
            paragraphs: [
              "Common acids: Citric acid (citrus fruits), Acetic acid (vinegar), Hydrochloric acid (stomach acid).",
              "Common bases: Baking soda, Soap, Ammonia (cleaning products).",
              "When an acid and base react, they neutralize each other and form salt + water!",
            ],
            funFact: "Bee stings are acidic, so applying a base like baking soda can help reduce the pain!",
            activity: {
              title: "pH Detective",
              description: "Red cabbage juice changes color based on pH! It's pink in acid, purple in neutral, and green in base."
            },
          },
        ],
      },
    ],
  },
  biology: {
    title: "Biology",
    description: "The study of living things",
    chapters: [
      {
        id: "cells",
        title: "The Cell - Building Block of Life",
        duration: "12 min",
        icon: Globe,
        content: [
          {
            heading: "Tiny Factories of Life",
            paragraphs: [
              "Every living thing is made up of cells - they are the smallest unit of life.",
              "Some organisms have just one cell (bacteria), while humans have about 37 trillion cells!",
              "Cells are like tiny factories, each with different parts doing specific jobs.",
            ],
            keyPoints: [
              "Cells are the basic unit of life",
              "All living things are made of cells",
              "Cells come from existing cells",
              "Different cells have different functions",
            ],
            funFact: "Red blood cells travel through your body about 3 times every minute!",
            illustration: "🦠 Single cell → 🧬 Many cells = 🧍 You!",
          },
          {
            heading: "Parts of a Cell",
            paragraphs: [
              "Cell Membrane: The outer boundary that controls what enters and exits the cell.",
              "Nucleus: The 'brain' of the cell containing DNA - instructions for everything the cell does.",
              "Mitochondria: The 'powerhouse' that produces energy for the cell.",
              "Cytoplasm: The jelly-like substance where all cell activities happen.",
            ],
            keyPoints: [
              "Plant cells have cell walls and chloroplasts",
              "Animal cells are more flexible",
              "Nucleus contains genetic material",
              "Mitochondria provide energy",
            ],
          },
          {
            heading: "Plant vs Animal Cells",
            paragraphs: [
              "Plant cells have a rigid cell wall for support and shape. Animal cells only have a flexible membrane.",
              "Plant cells have chloroplasts for photosynthesis - making food from sunlight. Animal cells don't.",
              "Plant cells often have large vacuoles for water storage. Animal cells have smaller vacuoles.",
            ],
            activity: {
              title: "Cell Model",
              description: "Make a cell model using jello (cytoplasm), a grape (nucleus), and various candies for other parts!"
            },
          },
        ],
      },
      {
        id: "nutrition",
        title: "Nutrition & Digestion",
        duration: "14 min",
        icon: Users,
        content: [
          {
            heading: "Food for Energy",
            paragraphs: [
              "Our body needs food to get energy, grow, and repair itself.",
              "The digestive system breaks down food into nutrients that our body can use.",
              "Good nutrition means eating a balanced diet with all the nutrients your body needs.",
            ],
            keyPoints: [
              "Carbohydrates give energy (rice, bread)",
              "Proteins help build muscles (dal, eggs)",
              "Fats store energy (oil, nuts)",
              "Vitamins keep us healthy (fruits, vegetables)",
            ],
            illustration: "🍚 + 🥚 + 🥗 + 🍎 = 💪 Balanced Diet!",
          },
          {
            heading: "The Digestive Journey",
            paragraphs: [
              "Mouth: Teeth break down food, saliva starts digesting carbohydrates.",
              "Stomach: Acids and enzymes break down proteins. Food becomes a paste called chyme.",
              "Small Intestine: Nutrients are absorbed into the blood. This is where most digestion happens!",
              "Large Intestine: Water is absorbed, and waste is prepared for removal.",
            ],
            funFact: "Your small intestine is about 6 meters long - that's as long as a giraffe!",
            activity: {
              title: "Digestion Timer",
              description: "It takes about 6-8 hours for food to pass through your stomach and small intestine!"
            },
          },
        ],
      },
      {
        id: "systems",
        title: "Body Systems",
        duration: "15 min",
        icon: Brain,
        content: [
          {
            heading: "Working Together",
            paragraphs: [
              "Your body has many organ systems that work together to keep you alive and healthy.",
              "Each system has specific organs that perform specific functions.",
              "All systems are connected and depend on each other!",
            ],
            keyPoints: [
              "Circulatory: Heart, blood vessels - transports nutrients",
              "Respiratory: Lungs - takes in oxygen",
              "Nervous: Brain, nerves - controls everything",
              "Skeletal: Bones - provides structure and protection",
            ],
          },
          {
            heading: "The Heart and Blood",
            paragraphs: [
              "Your heart is a muscle that pumps blood throughout your body, about 100,000 times a day!",
              "Blood carries oxygen and nutrients to cells, and removes waste like carbon dioxide.",
              "Arteries carry blood away from the heart, veins bring it back.",
            ],
            funFact: "If you laid out all your blood vessels in a line, they would stretch around the Earth twice!",
            illustration: "❤️ → 🔴 Arteries → Body → 🔵 Veins → ❤️",
          },
        ],
      },
    ],
  },
  mathematics: {
    title: "Mathematics",
    description: "The language of patterns and logic",
    chapters: [
      {
        id: "numbers",
        title: "Number Systems",
        duration: "10 min",
        icon: Calculator,
        content: [
          {
            heading: "The World of Numbers",
            paragraphs: [
              "Numbers are everywhere! From counting objects to measuring distances, we use numbers constantly.",
              "There are different types of numbers: natural numbers, whole numbers, integers, and more.",
              "Understanding number types helps us solve different kinds of problems.",
            ],
            keyPoints: [
              "Natural numbers: 1, 2, 3, ... (counting)",
              "Whole numbers: 0, 1, 2, 3, ... (includes zero)",
              "Integers: ..., -2, -1, 0, 1, 2, ... (includes negatives)",
              "Rational numbers: fractions like 1/2, 3/4",
            ],
            illustration: "Counting: 1️⃣ 2️⃣ 3️⃣ 4️⃣ 5️⃣ ...",
          },
          {
            heading: "Place Value",
            paragraphs: [
              "The position of a digit in a number determines its value. In 352, the 3 means 300!",
              "We use a base-10 system: ones, tens, hundreds, thousands, and so on.",
              "This system was invented in ancient India and spread worldwide!",
            ],
            funFact: "The concept of zero was developed in India around 500 AD. It changed mathematics forever!",
            activity: {
              title: "Number Detective",
              description: "In the number 4,567, what is the place value of 5? (Answer: 500 - it's in the hundreds place!)"
            },
          },
        ],
      },
      {
        id: "algebra",
        title: "Introduction to Algebra",
        duration: "15 min",
        icon: Target,
        content: [
          {
            heading: "Letters in Math?",
            paragraphs: [
              "In algebra, we use letters like x and y to represent unknown numbers.",
              "This helps us solve problems where we don't know the answer yet.",
              "Variables are like empty boxes that we fill with the right number.",
            ],
            keyPoints: [
              "Variables represent unknowns",
              "Equations show relationships",
              "Solve to find the unknown",
              "Same rules apply as with numbers",
            ],
            funFact: "Algebra was invented over 1,200 years ago by a Persian mathematician named Al-Khwarizmi! The word 'algebra' comes from Arabic.",
          },
          {
            heading: "Solving Simple Equations",
            paragraphs: [
              "An equation is like a balance scale - both sides must be equal.",
              "To solve x + 5 = 12, we need to find what number plus 5 equals 12.",
              "We 'undo' operations: subtract 5 from both sides. x = 12 - 5 = 7!",
            ],
            activity: {
              title: "Balance It!",
              description: "If x + 3 = 10, what is x? (Think: what number plus 3 equals 10?)"
            },
            illustration: "⚖️ x + 5 = 12 → x = 12 - 5 → x = 7 ✓",
          },
        ],
      },
      {
        id: "geometry",
        title: "Basic Geometry",
        duration: "12 min",
        icon: Globe,
        content: [
          {
            heading: "Shapes All Around",
            paragraphs: [
              "Geometry is the study of shapes, sizes, and positions of figures.",
              "Basic shapes include triangles, squares, rectangles, circles, and more.",
              "Every shape has properties like sides, angles, area, and perimeter.",
            ],
            keyPoints: [
              "Triangle: 3 sides, 3 angles",
              "Square: 4 equal sides, 4 right angles",
              "Circle: all points equal distance from center",
              "Perimeter: distance around a shape",
            ],
            illustration: "🔺 Triangle  ⬜ Square  ⭕ Circle",
          },
          {
            heading: "Measuring Shapes",
            paragraphs: [
              "Perimeter is the distance around a shape. Add all the sides!",
              "Area is the space inside a shape. For a rectangle: length × width.",
              "For a circle, we use pi (π ≈ 3.14): Area = πr²",
            ],
            funFact: "The ancient Egyptians used geometry to build the pyramids over 4,500 years ago!",
          },
        ],
      },
    ],
  },
  finance: {
    title: "Finance",
    description: "Managing money wisely",
    chapters: [
      {
        id: "money-basics",
        title: "Understanding Money",
        duration: "8 min",
        icon: Wallet,
        content: [
          {
            heading: "What is Money?",
            paragraphs: [
              "Money is a tool we use to buy things we need and want. It comes in coins and paper notes.",
              "Long ago, people used to trade goods directly (barter). Now we use money to make trading easier.",
              "Money has value because everyone agrees it does. It's a medium of exchange.",
            ],
            keyPoints: [
              "Money is a medium of exchange",
              "Different countries have different currencies",
              "India uses Rupees (₹)",
              "Money should be used wisely",
            ],
            illustration: "🐔 🔄 🌾 (Barter) → 💰 (Money makes it easier!)",
          },
          {
            heading: "Earning Money",
            paragraphs: [
              "People earn money by working - using their skills and time to help others.",
              "Farmers grow food, teachers educate, doctors heal - all earning money for their work.",
              "You can also earn money from savings (interest) or by starting a small business!",
            ],
            funFact: "The first coins were made over 2,500 years ago in ancient Lydia (now Turkey)!",
          },
        ],
      },
      {
        id: "saving",
        title: "The Power of Saving",
        duration: "10 min",
        icon: TrendingUp,
        content: [
          {
            heading: "Save for Tomorrow",
            paragraphs: [
              "Saving means keeping some money aside instead of spending it all.",
              "Even small savings add up over time. ₹10 saved daily becomes ₹3,650 in a year!",
              "Savings help during emergencies and for buying expensive things later.",
            ],
            keyPoints: [
              "Pay yourself first (save before spending)",
              "Set saving goals",
              "Start small, stay consistent",
              "Every rupee counts!",
            ],
            funFact: "If you save ₹100 per month starting at age 15, you could have over ₹1 lakh by age 25 (with interest)!",
            illustration: "📅 Day 1: ₹10 → Day 365: ₹3,650! 🎉",
          },
          {
            heading: "Where to Save",
            paragraphs: [
              "Piggy bank at home is good for small amounts, but not safe for large sums.",
              "Banks are safer and pay you interest - extra money for keeping your money there!",
              "Savings accounts, fixed deposits, and post office schemes are common options.",
            ],
            activity: {
              title: "Start Today!",
              description: "Set a goal to save ₹5 every day for a week. At the end, you'll have ₹35!"
            },
          },
        ],
      },
      {
        id: "budgeting",
        title: "Creating a Budget",
        duration: "12 min",
        icon: Target,
        content: [
          {
            heading: "Plan Your Money",
            paragraphs: [
              "A budget is a plan for how you will spend and save your money.",
              "It helps you make sure you have enough for what you need and want.",
              "Write down your income, then list your expenses. Save the difference!",
            ],
            keyPoints: [
              "List your income (pocket money, earnings)",
              "List your expenses (school, snacks, fun)",
              "Needs vs Wants - prioritize needs!",
              "Save the difference",
            ],
            illustration: "💰 Income - 🛒 Expenses = 🏦 Savings",
          },
          {
            heading: "Needs vs Wants",
            paragraphs: [
              "Needs are things you must have: food, water, shelter, education, medicine.",
              "Wants are things you'd like to have: toys, games, fancy clothes, treats.",
              "A good budget covers all needs first, then uses leftover money for wants.",
            ],
            activity: {
              title: "Budget Exercise",
              description: "If you get ₹100 pocket money, plan: How much for savings? Snacks? Fun? Write it down!"
            },
          },
        ],
      },
    ],
  },
  entrepreneurship: {
    title: "Entrepreneurship",
    description: "Building businesses and solving problems",
    chapters: [
      {
        id: "ideas",
        title: "Finding Business Ideas",
        duration: "10 min",
        icon: Lightbulb,
        content: [
          {
            heading: "Ideas Are Everywhere",
            paragraphs: [
              "Every big business started with a simple idea. Look around - what problems can you solve?",
              "Good business ideas come from observing what people need and finding ways to help them.",
              "Think about problems in your village, school, or home. Each problem is an opportunity!",
            ],
            keyPoints: [
              "Observe problems around you",
              "Think of solutions",
              "Start small and learn",
              "Every big business started small",
            ],
            funFact: "Many successful entrepreneurs started their first business as teenagers! Mark Zuckerberg created Facebook at 19!",
            illustration: "👀 Problem → 💡 Idea → 🚀 Business!",
          },
          {
            heading: "Problem-Solution Thinking",
            paragraphs: [
              "Ask: What do people struggle with? What takes too much time? What's missing?",
              "Example: People in village need fresh vegetables but market is far. Solution: Bring vegetables to them!",
              "Not all ideas will work, and that's okay. Entrepreneurs learn from failures.",
            ],
            activity: {
              title: "Idea Generator",
              description: "List 3 problems you see around you. Now think of a simple solution for each. You just found 3 business ideas!"
            },
          },
        ],
      },
      {
        id: "profit",
        title: "Understanding Profit",
        duration: "11 min",
        icon: TrendingUp,
        content: [
          {
            heading: "Making Money in Business",
            paragraphs: [
              "Profit is the money left after you subtract all your costs from your earnings.",
              "Profit = Revenue (money earned) - Costs (money spent)",
              "Without profit, a business cannot survive or grow.",
            ],
            keyPoints: [
              "Revenue is total money earned from sales",
              "Costs include materials, time, transport",
              "Profit is what you keep",
              "Reinvest profit to grow",
            ],
            illustration: "🍋 Sell for ₹10 - 🍋 Cost ₹6 = 💰 Profit ₹4!",
          },
          {
            heading: "Pricing Your Product",
            paragraphs: [
              "Price too high? No one buys. Price too low? No profit. Find the balance!",
              "Consider: material cost + your time + fair profit = selling price.",
              "Watch competitors - what do others charge for similar products?",
            ],
            funFact: "The lemonade stand is a classic first business! Many entrepreneurs started by selling simple things as kids.",
            activity: {
              title: "Price It Right",
              description: "If you spend ₹30 on materials and want ₹20 profit, what should you charge? (Answer: ₹50!)"
            },
          },
        ],
      },
      {
        id: "customers",
        title: "Finding Customers",
        duration: "12 min",
        icon: Users,
        content: [
          {
            heading: "Who Will Buy?",
            paragraphs: [
              "Customers are people who pay for your product or service. You need to know who they are!",
              "Think about: Who has this problem? Who can afford my solution? Where can I find them?",
              "Understanding your customer helps you serve them better.",
            ],
            keyPoints: [
              "Know your target customer",
              "Understand their needs",
              "Find where they are",
              "Make it easy for them to buy",
            ],
          },
          {
            heading: "Marketing Basics",
            paragraphs: [
              "Marketing is letting people know about your product. You can't sell if no one knows!",
              "Simple marketing: Tell friends, put up a sign, go where customers are.",
              "Good service creates word-of-mouth - happy customers tell others!",
            ],
            activity: {
              title: "Customer Profile",
              description: "Pick a product idea. Who would buy it? What's their age? Where do they live? What do they need?"
            },
          },
        ],
      },
    ],
  },
  technology: {
    title: "Technology",
    description: "How technology shapes our world",
    chapters: [
      {
        id: "what-is-tech",
        title: "What Is Technology?",
        duration: "11 min",
        icon: Laptop,
        content: [
          {
            heading: "Technology Through Time",
            paragraphs: [
              "Technology is anything created by humans to solve problems or make life easier.",
              "It started with simple tools like fire and wheels, and evolved to computers and the internet.",
              "From ancient plows to smartphones, technology has always been part of human progress.",
            ],
            illustration: "🪨 Tools → 🚜 Machines → 🖥️ Computers → 📱 Smart Systems",
            keyPoints: [
              "Technology solves human problems",
              "It evolves over time",
              "Every tool is technology",
              "Technology shapes society",
            ],
          },
          {
            heading: "Tech Today: Computers & Digital Systems",
            paragraphs: [
              "Modern technology is often digital - using electricity and data.",
              "Computers are machines that process information incredibly fast.",
              "Software (apps, programs) tells hardware (physical devices) what to do.",
              "The internet connects billions of devices, letting us share information instantly!",
            ],
            keyPoints: [
              "Computers: Input → Process → Output",
              "Software controls hardware",
              "Networks connect devices",
              "Data flows through circuits",
            ],
            funFact: "Your smartphone is more powerful than computers that sent humans to the moon in 1969!",
            illustration: "📱 = Billions of calculations per second!",
          },
          {
            heading: "Technology Everywhere",
            paragraphs: [
              "Look around - technology is in your phone, TV, fan, fridge, car, and even your watch!",
              "Some technology is obvious (like a computer), but some is hidden (like in a car's engine).",
              "Every technology has inputs (what it receives), processes (what it does), and outputs (what it produces).",
            ],
            activity: {
              title: "Tech Hunt",
              description: "Find 5 different pieces of technology in your home. For each, identify: What does it do? What inputs does it need? What output does it create?"
            },
          },
        ],
      },
      {
        id: "tech-solutions",
        title: "How Technology Solves Problems",
        duration: "12 min",
        icon: Lightbulb,
        content: [
          {
            heading: "Finding Problems, Creating Solutions",
            paragraphs: [
              "Technology starts with a problem someone wants to solve.",
              "Before phones, people couldn't talk to distant friends - phones solved that!",
              "Before internet, finding information took weeks - the internet solved that!",
              "Good technology makes life easier, saves time, or helps us do new things.",
            ],
            keyPoints: [
              "Problem → Idea → Solution → Technology",
              "Technology serves human needs",
              "Better solutions replace old ones",
              "Innovation never stops",
            ],
            illustration: "🤔 Problem → 💡 Idea → 🚀 Technology",
          },
          {
            heading: "Before & After: Technology at Work",
            paragraphs: [
              "Before: Farmer measured fields manually, took days. After: GPS and drones measure in minutes!",
              "Before: Finding a person took asking others. After: Phone calls connect instantly!",
              "Before: Doctors examined patients in person. After: Telemedicine allows remote diagnosis!",
              "Before: Calculations by hand took hours. After: Computers solve in seconds!",
            ],
            funFact: "The COVID-19 pandemic showed how important technology is - schools, hospitals, and businesses moved online instantly!",
          },
          {
            heading: "Technology Creates New Opportunities",
            paragraphs: [
              "Technology doesn't just solve old problems - it enables completely new possibilities!",
              "The internet let people work from home, start global businesses, and learn anything online.",
              "Medical technology helps doctors save lives in ways previously impossible.",
              "Communication technology connects people across the globe in real-time.",
            ],
            activity: {
              title: "Solution Detective",
              description: "Pick a problem you face (like remembering homework, finding information, staying connected). What technology could solve it? Design your own solution!"
            },
          },
        ],
      },
      {
        id: "thinking-like-technologist",
        title: "Thinking Like a Technologist",
        duration: "13 min",
        icon: Brain,
        content: [
          {
            heading: "The Technologist's Mindset",
            paragraphs: [
              "Technologists think systematically: break big problems into smaller parts.",
              "They observe how things work, understand the rules, then build solutions.",
              "A technologist asks: 'How does this work? What inputs does it need? What does it produce?'",
              "This thinking helps solve problems in any field - not just computers!",
            ],
            illustration: "🔍 Observe → 🤔 Understand → 🛠️ Build → ✅ Test",
            keyPoints: [
              "Break problems into steps",
              "Input → Process → Output",
              "Test and improve",
              "Learn from mistakes",
            ],
          },
          {
            heading: "The Four Steps of Technology Thinking",
            paragraphs: [
              "1. Break the Problem: What exactly are we trying to solve? What are the steps needed?",
              "2. Build the Solution: Gather resources, create your system, code your software.",
              "3. Test Thoroughly: Does it work? What breaks? How can we improve it?",
              "4. Improve It: Use what you learned to make v2 better than v1!",
            ],
            keyPoints: [
              "Problem-solving is a process",
              "Every failure teaches something",
              "Iteration leads to excellence",
              "Keep improving",
            ],
            activity: {
              title: "Design a System",
              description: "Design a technology to solve a school problem (like tracking attendance or organizing group projects). Draw the inputs, processes, and outputs!"
            },
          },
          {
            heading: "The Technology Designer's Toolkit",
            paragraphs: [
              "Logic: Using rules and rules of 'if-then' thinking to build systems.",
              "Systems Thinking: Understanding how parts connect and affect each other.",
              "Creativity: Imagining new possibilities and combinations.",
              "Testing Mindset: Trying things, finding what breaks, and fixing it.",
            ],
            funFact: "The best technologists are often artists, mathematicians, and scientists combined - using both logic and creativity!",
          },
        ],
      },
    ],
  },
  "village-skills": {
    title: "Village Skills",
    description: "Practical skills for rural life",
    chapters: [
      {
        id: "farming",
        title: "Basic Farming Knowledge",
        duration: "12 min",
        icon: TreePine,
        content: [
          {
            heading: "The Art of Farming",
            paragraphs: [
              "Farming is one of the most important activities in villages. It provides food for everyone.",
              "Good farming requires understanding of soil, seasons, water, and crops.",
              "Farmers are scientists - they observe nature and make decisions based on knowledge!",
            ],
            keyPoints: [
              "Choose crops based on season",
              "Soil health is crucial",
              "Water management matters",
              "Crop rotation keeps soil healthy",
            ],
            funFact: "India has two main crop seasons - Kharif (monsoon crops like rice) and Rabi (winter crops like wheat)!",
          },
          {
            heading: "Understanding Soil",
            paragraphs: [
              "Soil is alive! It contains minerals, water, air, and tiny organisms.",
              "Different soils suit different crops. Sandy soil drains fast, clay soil holds water.",
              "Adding organic matter (compost, manure) makes soil healthier and more productive.",
            ],
            activity: {
              title: "Soil Test",
              description: "Take some soil and add water. Sandy soil settles quickly, clay stays suspended longer. What type is in your area?"
            },
          },
        ],
      },
      {
        id: "water",
        title: "Water Conservation",
        duration: "10 min",
        icon: Globe,
        content: [
          {
            heading: "Every Drop Counts",
            paragraphs: [
              "Water is precious and limited. In many villages, water scarcity is a real problem.",
              "Conservation means using water wisely and not wasting it.",
              "Traditional methods like rainwater harvesting can help save water for dry seasons.",
            ],
            keyPoints: [
              "Fix leaky taps immediately",
              "Reuse water when possible",
              "Rainwater harvesting saves water",
              "Drip irrigation uses less water",
            ],
            funFact: "Only 1% of Earth's water is available for human use. The rest is saltwater or frozen!",
          },
          {
            heading: "Rainwater Harvesting",
            paragraphs: [
              "Rainwater harvesting collects rain for later use. It's an ancient and effective technique.",
              "Rooftop collection: Rain falls on roof, flows through pipes to a storage tank.",
              "This water can be used for farming, cleaning, and after treatment, even drinking.",
            ],
            illustration: "🌧️ → 🏠 roof → 📦 tank → 🌾 farming",
          },
        ],
      },
      {
        id: "crafts",
        title: "Traditional Crafts",
        duration: "11 min",
        icon: Lightbulb,
        content: [
          {
            heading: "Skills from Our Ancestors",
            paragraphs: [
              "Villages have rich traditions of crafts passed down through generations.",
              "These skills - pottery, weaving, woodwork - can become income sources.",
              "Traditional crafts are valued today as people seek authentic, handmade products.",
            ],
            keyPoints: [
              "Every village has unique crafts",
              "Learn from elders",
              "Crafts can become businesses",
              "Preserve traditional knowledge",
            ],
            funFact: "Indian handicrafts are famous worldwide. Items like Pashmina shawls, Channapatna toys, and Bidri work are globally recognized!",
            activity: {
              title: "Craft Discovery",
              description: "Ask elders in your village about traditional crafts. What skills have been passed down? Can you learn one?"
            },
          },
        ],
      },
    ],
  },
};

export default function PassiveLearningPage() {
  const { subject } = useParams<{ subject: string }>();
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);
  const [contentIndex, setContentIndex] = useState(0);
  const { user } = useAuth();
  
  const {
    progress,
    isLoading,
    saveProgress,
    isChapterCompleted,
    getLastReadIndex,
    completedChaptersCount,
  } = useReadingProgress(subject || "physics");

  const content = subjectContents[subject || "physics"];
  
  if (!content) {
    return (
      <AppLayout role="student" playCoins={0} title="Content Not Found">
        <div className="flex items-center justify-center min-h-[50vh]">
          <p className="text-muted-foreground">Content not found</p>
        </div>
      </AppLayout>
    );
  }

  const chaptersWithProgress = content.chapters.map(chapter => ({
    ...chapter,
    completed: isChapterCompleted(chapter.id),
  }));

  const progressPercent = content.chapters.length > 0 
    ? Math.round((completedChaptersCount / content.chapters.length) * 100) 
    : 0;
  
  const currentChapter = chaptersWithProgress.find(c => c.id === selectedChapter);

  const handleSelectChapter = (chapterId: string) => {
    const lastIndex = getLastReadIndex(chapterId);
    setSelectedChapter(chapterId);
    setContentIndex(lastIndex);
  };

  const handleNext = () => {
    if (currentChapter && contentIndex < currentChapter.content.length - 1) {
      const newIndex = contentIndex + 1;
      setContentIndex(newIndex);
      if (user) {
        saveProgress({
          chapterId: currentChapter.id,
          contentIndex: newIndex,
          isCompleted: false,
        });
      }
    }
  };

  const handlePrev = () => {
    if (contentIndex > 0) {
      setContentIndex(contentIndex - 1);
    }
  };

  const handleComplete = () => {
    if (currentChapter && user) {
      saveProgress({
        chapterId: currentChapter.id,
        contentIndex: currentChapter.content.length - 1,
        isCompleted: true,
      });
      toast({
        title: "Chapter Completed! 🎉",
        description: "Great job! Keep learning to earn more rewards.",
      });
    }
    setSelectedChapter(null);
    setContentIndex(0);
  };

  if (selectedChapter && currentChapter) {
    const section = currentChapter.content[contentIndex];
    const ChapterIcon = currentChapter.icon;
    
    return (
      <AppLayout role="student" playCoins={0} title={currentChapter.title}>
        <div className="px-4 py-6 pb-24 relative">
          {/* Mascot for reading */}
          <div className="fixed bottom-24 right-4 z-10 pointer-events-none">
            <img 
              src={mascotTeacher} 
              alt="Mascot" 
              className="w-24 h-24 object-contain opacity-80" 
            />
          </div>

          {/* Reading Header */}
          <div className="mb-6 slide-up">
            <div className="flex items-center justify-between mb-2">
              <Badge variant="outline" className="text-xs">
                <ChapterIcon className="h-3 w-3 mr-1" />
                {content.title}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {contentIndex + 1} / {currentChapter.content.length}
              </span>
            </div>
            <AnimatedProgress value={(contentIndex + 1) / currentChapter.content.length * 100} />
          </div>

          {/* Content Card - Digital Book Style */}
          <Card className="glass-card border border-border p-6 mb-6 slide-up min-h-[400px]" style={{ animationDelay: "100ms" }}>
            <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
              {section.heading}
            </h2>
            
            <div className="space-y-4">
              {section.paragraphs.map((para, idx) => (
                <p key={idx} className="text-foreground/90 leading-relaxed text-base">
                  {para}
                </p>
              ))}
            </div>

            {/* Illustration */}
            {section.illustration && (
              <div className="mt-4 p-4 rounded-xl bg-muted/30 border border-border text-center">
                <p className="text-lg font-mono text-foreground/80">
                  {section.illustration}
                </p>
              </div>
            )}

            {section.keyPoints && (
              <div className="mt-6 p-4 rounded-xl bg-primary/10 border border-primary/20">
                <h4 className="font-semibold text-primary mb-2 text-sm">📌 Key Points</h4>
                <ul className="space-y-2">
                  {section.keyPoints.map((point, idx) => (
                    <li key={idx} className="text-sm text-foreground/80 flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {section.funFact && (
              <div className="mt-4 p-4 rounded-xl bg-accent/10 border border-accent/20">
                <p className="text-sm text-foreground/80">
                  <Sparkles className="h-4 w-4 text-accent inline mr-2" />
                  <strong>Fun Fact:</strong> {section.funFact}
                </p>
              </div>
            )}

            {section.activity && (
              <div className="mt-4 p-4 rounded-xl bg-secondary/10 border border-secondary/20">
                <h4 className="font-semibold text-secondary mb-1 text-sm flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  {section.activity.title}
                </h4>
                <p className="text-sm text-foreground/80">
                  {section.activity.description}
                </p>
              </div>
            )}
          </Card>

          {/* Navigation */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={handlePrev}
              disabled={contentIndex === 0}
              className="flex-1"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            
            {contentIndex < currentChapter.content.length - 1 ? (
              <Button
                onClick={handleNext}
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button
                onClick={handleComplete}
                className="flex-1 bg-secondary hover:bg-secondary/90"
              >
                <CheckCircle2 className="h-4 w-4 mr-1" />
                Complete
              </Button>
            )}
          </div>

          {/* Back to Chapters */}
          <Button
            variant="ghost"
            onClick={() => {
              setSelectedChapter(null);
              setContentIndex(0);
            }}
            className="w-full mt-3 text-muted-foreground"
          >
            Back to Chapters
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout role="student" playCoins={0} title={`${content.title} - Reading`}>
      <div className="px-4 py-6 pb-24 relative">
        {/* Mascot for chapter selection */}
        <div className="fixed bottom-24 right-4 z-10 pointer-events-none">
          <img 
            src={mascotEager} 
            alt="Mascot" 
            className="w-24 h-24 object-contain opacity-80 animate-fade-in" 
          />
        </div>

        {/* Header */}
        <div className="mb-6 slide-up">
          <div className="glass-card rounded-2xl p-5 border border-border bg-gradient-to-br from-secondary/20 to-secondary/5">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-14 w-14 rounded-xl bg-secondary/30 flex items-center justify-center">
                <BookOpen className="h-7 w-7 text-secondary" />
              </div>
              <div className="flex-1">
                <h2 className="font-heading text-xl font-bold text-foreground">{content.title}</h2>
                <p className="text-sm text-muted-foreground">{content.description}</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Reading Progress</span>
                <span className="font-semibold text-secondary">{progressPercent}%</span>
              </div>
              <AnimatedProgress value={progressPercent} variant="success" />
              <p className="text-xs text-muted-foreground">
                {completedChaptersCount}/{content.chapters.length} Chapters Completed
              </p>
            </div>
          </div>
        </div>

        {/* Chapter List */}
        <h3 className="font-heading font-semibold text-foreground mb-3 flex items-center gap-2">
          <Bookmark className="h-5 w-5 text-secondary" />
          Chapters
        </h3>

        <div className="space-y-3 mb-24">
          {chaptersWithProgress.map((chapter, index) => {
            const ChapterIcon = chapter.icon;
            return (
              <Card
                key={chapter.id}
                className={`glass-card border p-4 cursor-pointer hover:scale-[1.02] transition-all slide-up ${
                  chapter.completed ? "border-secondary/40" : "border-border"
                }`}
                style={{ animationDelay: `${100 + index * 50}ms` }}
                onClick={() => handleSelectChapter(chapter.id)}
              >
                <div className="flex items-center gap-4">
                  <div className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 ${
                    chapter.completed ? "bg-secondary" : "bg-muted"
                  }`}>
                    {chapter.completed ? (
                      <CheckCircle2 className="h-6 w-6 text-secondary-foreground" />
                    ) : (
                      <ChapterIcon className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-heading font-semibold text-foreground">{chapter.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        {chapter.duration}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {chapter.content.length} sections
                      </Badge>
                      {chapter.completed && (
                        <Badge className="text-xs bg-secondary/20 text-secondary border-0">
                          Completed
                        </Badge>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
