import { useState, useEffect, useCallback, useRef } from "react";
import { Brain, CheckCircle, XCircle, Timer, RotateCcw, Trophy, Zap, ChevronRight } from "lucide-react";

type DrillMode = "arithmetic" | "fractions" | "percentages" | "powers" | "quant" | "mixed";
type GameState = "idle" | "playing" | "finished";

interface Question {
  text: string;
  answer: number;
  tolerance?: number; // for decimal answers
}

const rnd = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

function generateArithmetic(): Question {
  const templates = [
    // Two 3-digit addition
    () => { const a = rnd(100, 999), b = rnd(100, 999); return { text: `${a} + ${b}`, answer: a + b }; },
    // Two 3-digit subtraction
    () => { const a = rnd(200, 999), b = rnd(100, a - 1); return { text: `${a} − ${b}`, answer: a - b }; },
    // Multiplication up to 25×25
    () => { const a = rnd(2, 25), b = rnd(2, 25); return { text: `${a} × ${b}`, answer: a * b }; },
    // Large × small
    () => { const a = rnd(50, 999), b = rnd(2, 9); return { text: `${a} × ${b}`, answer: a * b }; },
    // Clean division
    () => { const b = rnd(2, 15), ans = rnd(10, 99); return { text: `${b * ans} ÷ ${b}`, answer: ans }; },
    // Three number addition
    () => { const a = rnd(10, 200), b = rnd(10, 200), c = rnd(10, 200); return { text: `${a} + ${b} + ${c}`, answer: a + b + c }; },
    // Multiply by 11
    () => { const a = rnd(11, 99); return { text: `${a} × 11`, answer: a * 11 }; },
    // Multiply by 15
    () => { const a = rnd(4, 40); return { text: `${a} × 15`, answer: a * 15 }; },
    // Multiply by 25
    () => { const a = rnd(4, 40); return { text: `${a} × 25`, answer: a * 25 }; },
    // Double a number
    () => { const a = rnd(100, 9999); return { text: `Double ${a}`, answer: a * 2 }; },
    // Half a number
    () => { const a = rnd(50, 500) * 2; return { text: `Half of ${a}`, answer: a / 2 }; },
    // 1000 minus
    () => { const a = rnd(1, 999); return { text: `1000 − ${a}`, answer: 1000 - a }; },
    // Multiply by 5 (halve then ×10)
    () => { const a = rnd(20, 200); return { text: `${a} × 5`, answer: a * 5 }; },
    // Two digit × two digit
    () => { const a = rnd(11, 49), b = rnd(11, 49); return { text: `${a} × ${b}`, answer: a * b }; },
    // Large addition chain
    () => { const a = rnd(100, 500), b = rnd(100, 500), c = rnd(100, 500); return { text: `${a} + ${b} + ${c}`, answer: a + b + c }; },
    // Subtraction from round number
    () => { const base = pick([500, 1000, 2000, 5000]), sub = rnd(1, base - 1); return { text: `${base} − ${sub}`, answer: base - sub }; },
    // Multiply by 9 trick
    () => { const a = rnd(5, 50); return { text: `${a} × 9`, answer: a * 9 }; },
    // Multiply by 99
    () => { const a = rnd(2, 20); return { text: `${a} × 99`, answer: a * 99 }; },
  ];
  return pick(templates)();
}

function generateFraction(): Question {
  const templates = [
    // Fraction to percent
    () => {
      const n = rnd(1, 9);
      const d = pick([4, 5, 8, 10, 16, 20, 25, 50]);
      return { text: `${n}/${d} as % (round)`, answer: Math.round((n / d) * 100) };
    },
    // Add fractions, find numerator
    () => {
      const a = rnd(1, 7), b = rnd(1, 7);
      const d1 = pick([2, 3, 4, 5, 6]), d2 = pick([2, 3, 4, 5, 6]);
      return { text: `${a}/${d1} + ${b}/${d2} = ?/${d1 * d2}`, answer: a * d2 + b * d1 };
    },
    // Simplify: what is n/d × d2?
    () => {
      const d = pick([2, 3, 4, 5, 6, 8, 10]);
      const n = rnd(1, d - 1);
      const mult = rnd(2, 10) * d;
      return { text: `${n}/${d} of ${mult}`, answer: (n * mult) / d };
    },
    // Fraction comparison: which is larger? (answer 1 or 2)
    () => {
      const pairs = [[2, 3, 3, 4], [3, 5, 2, 3], [4, 7, 3, 5], [5, 8, 3, 4], [2, 5, 3, 8]];
      const [a, b, c, d] = pick(pairs);
      const ans = a / b > c / d ? 1 : 2;
      return { text: `${a}/${b} vs ${c}/${d}: larger? (1 or 2)`, answer: ans };
    },
    // Mixed number addition
    () => {
      const w1 = rnd(1, 5), w2 = rnd(1, 5);
      const d = pick([2, 4, 5, 10]);
      const n1 = rnd(1, d - 1), n2 = rnd(1, d - 1);
      const totalN = n1 + n2;
      const extra = Math.floor(totalN / d);
      const rem = totalN % d;
      const ans = w1 + w2 + extra;
      return { text: `${w1} ${n1}/${d} + ${w2} ${n2}/${d}: whole part?`, answer: ans };
    },
    // Decimal to fraction denominator
    () => {
      const pairs = [[0.25, 4], [0.5, 2], [0.2, 5], [0.125, 8], [0.1, 10], [0.333, 3], [0.75, 4], [0.4, 5], [0.6, 5], [0.8, 5]];
      const [dec, denom] = pick(pairs);
      return { text: `${dec} ≈ 1/?`, answer: denom };
    },
    // n/d × m/p
    () => {
      const a = rnd(1, 6), b = rnd(2, 8), c = rnd(1, 6), d = rnd(2, 8);
      const num = a * c, den = b * d;
      const g = gcd(num, den);
      return { text: `${a}/${b} × ${c}/${d} = ?/${den / g} (numerator)`, answer: num / g };
    },
    // What fraction of X is Y?
    () => {
      const d = pick([2, 3, 4, 5, 8, 10]);
      const n = rnd(1, d - 1);
      const whole = rnd(2, 10) * d;
      return { text: `${(n / d * whole)} out of ${whole} = ?/${d}`, answer: n };
    },
  ];
  return pick(templates)();
}

function gcd(a: number, b: number): number { return b === 0 ? a : gcd(b, a % b); }

function generatePercentage(): Question {
  const templates = [
    // Basic % of number
    () => {
      const pct = pick([5, 10, 12.5, 15, 20, 25, 30, 33, 40, 50, 60, 75, 80]);
      const n = rnd(2, 40) * 10;
      return { text: `${pct}% of ${n}`, answer: Math.round(n * pct / 100) };
    },
    // % increase
    () => {
      const start = rnd(2, 20) * 50;
      const pct = pick([10, 20, 25, 50, 100]);
      return { text: `${start} increased by ${pct}%`, answer: Math.round(start * (1 + pct / 100)) };
    },
    // % decrease
    () => {
      const start = rnd(2, 20) * 50;
      const pct = pick([10, 20, 25, 50]);
      return { text: `${start} decreased by ${pct}%`, answer: Math.round(start * (1 - pct / 100)) };
    },
    // What % is A of B
    () => {
      const b = pick([20, 25, 40, 50, 80, 100, 200, 400, 500]);
      const n = pick([1, 2, 4, 5, 8, 10]);
      return { text: `${n} is what % of ${b}?`, answer: Math.round(n / b * 100) };
    },
    // Reverse: X% of ? = Y
    () => {
      const pct = pick([10, 20, 25, 50]);
      const ans = rnd(2, 20) * 10;
      return { text: `${pct}% of ? = ${pct * ans / 100}`, answer: ans };
    },
    // Combined % changes
    () => {
      const p1 = pick([10, 20, 25, 50]);
      const p2 = pick([10, 20, 25, 50]);
      const start = pick([100, 200, 400, 500, 1000]);
      const result = Math.round(start * (1 + p1 / 100) * (1 - p2 / 100));
      return { text: `${start} up ${p1}% then down ${p2}%`, answer: result };
    },
    // % of % 
    () => {
      const p1 = pick([10, 20, 25, 50]);
      const p2 = pick([10, 20, 25, 50]);
      const n = pick([100, 200, 400, 500, 1000]);
      return { text: `${p1}% of ${p2}% of ${n}`, answer: Math.round(n * p1 / 100 * p2 / 100) };
    },
    // Tip calculation
    () => {
      const bill = rnd(2, 20) * 10;
      const pct = pick([10, 15, 20]);
      return { text: `${pct}% tip on ${bill}`, answer: Math.round(bill * pct / 100) };
    },
    // Break even
    () => {
      const cost = rnd(5, 30) * 10;
      const pct = pick([10, 20, 25, 50]);
      return { text: `Buy at ${cost}, sell at ${pct}% profit = ?`, answer: Math.round(cost * (1 + pct / 100)) };
    },
    // 1% of large number
    () => {
      const n = rnd(1, 9) * 1000 + rnd(0, 9) * 100;
      return { text: `1% of ${n}`, answer: Math.round(n / 100) };
    },
  ];
  return pick(templates)();
}

function generatePower(): Question {
  const templates = [
    // Squares up to 30
    () => { const b = rnd(2, 30); return { text: `${b}²`, answer: b * b }; },
    // Cubes up to 12
    () => { const b = rnd(2, 12); return { text: `${b}³`, answer: b * b * b }; },
    // Perfect square roots
    () => {
      const bases = [2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
      const b = pick(bases);
      return { text: `√${b * b}`, answer: b };
    },
    // Powers of 2
    () => { const exp = rnd(1, 16); return { text: `2^${exp}`, answer: Math.pow(2, exp) }; },
    // Powers of 3
    () => { const exp = rnd(1, 8); return { text: `3^${exp}`, answer: Math.pow(3, exp) }; },
    // Powers of 5
    () => { const exp = rnd(1, 6); return { text: `5^${exp}`, answer: Math.pow(5, exp) }; },
    // Cube roots
    () => {
      const bases = [2, 3, 4, 5, 6, 7, 8, 9, 10];
      const b = pick(bases);
      return { text: `∛${b * b * b}`, answer: b };
    },
    // Square then add
    () => { const a = rnd(2, 15), b = rnd(2, 15); return { text: `${a}² + ${b}²`, answer: a*a + b*b }; },
    // Factorial
    () => {
      const facts: Record<number, number> = { 1:1, 2:2, 3:6, 4:24, 5:120, 6:720, 7:5040 };
      const n = pick([1,2,3,4,5,6,7]);
      return { text: `${n}!`, answer: facts[n] };
    },
    // Power of 10
    () => { const exp = rnd(1, 9); return { text: `10^${exp}`, answer: Math.pow(10, exp) }; },
    // n² − m²
    () => { const a = rnd(5, 20), b = rnd(2, a - 1); return { text: `${a}² − ${b}²`, answer: a*a - b*b }; },
    // (a+b)² expanded
    () => { const a = rnd(2, 10), b = rnd(2, 10); return { text: `(${a}+${b})²`, answer: (a+b)*(a+b) }; },
    // log base 2 (small)
    () => {
      const exp = rnd(1, 10);
      return { text: `log₂(${Math.pow(2, exp)})`, answer: exp };
    },
    // Powers of 4
    () => { const exp = rnd(1, 6); return { text: `4^${exp}`, answer: Math.pow(4, exp) }; },
    // LCM of two numbers
    () => {
      const pairs = [[4,6],[3,8],[6,10],[4,9],[5,6],[8,12],[6,15],[9,12]];
      const [a, b] = pick(pairs);
      const l = (a * b) / gcd(a, b);
      return { text: `LCM(${a}, ${b})`, answer: l };
    },
    // GCD
    () => {
      const pairs = [[12,18],[24,36],[15,25],[16,24],[30,45],[8,20],[21,35]];
      const [a, b] = pick(pairs);
      return { text: `GCD(${a}, ${b})`, answer: gcd(a, b) };
    },
  ];
  return pick(templates)();
}

// New: Quant-specific question types
function generateQuant(): Question {
  const templates = [
    // Expected value of a dice
    () => ({ text: `E[fair 6-sided die] × 6`, answer: 21 }),
    // Probability as fraction → percent
    () => {
      const pairs = [[1,4,25],[1,5,20],[1,3,33],[2,5,40],[3,4,75],[1,6,17],[1,8,13],[3,8,38]];
      const [n, d, pct] = pick(pairs);
      return { text: `P = ${n}/${d} as % (round)`, answer: pct };
    },
    // Combinations C(n,2)
    () => {
      const n = rnd(3, 15);
      return { text: `C(${n},2)`, answer: (n * (n - 1)) / 2 };
    },
    // C(n,3)
    () => {
      const n = rnd(4, 10);
      return { text: `C(${n},3)`, answer: (n * (n-1) * (n-2)) / 6 };
    },
    // Simple EV: coin flip
    () => {
      const win = rnd(2, 20) * 5;
      const lose = rnd(1, 10) * 5;
      const ev = Math.round((win - lose) / 2);
      return { text: `Fair coin: win ${win}, lose ${lose}. EV?`, answer: ev };
    },
    // 52 card probability
    () => {
      const cards = pick([
        { text: `P(ace from 52 cards) × 52`, answer: 4 },
        { text: `P(heart from 52 cards) × 52`, answer: 13 },
        { text: `P(face card from 52) × 52`, answer: 12 },
        { text: `P(red card from 52) × 52`, answer: 26 },
      ]);
      return cards;
    },
    // Sum of 1 to n
    () => {
      const n = pick([10, 15, 20, 25, 50, 100]);
      return { text: `1+2+...+${n}`, answer: (n * (n + 1)) / 2 };
    },
    // Geometric series sum
    () => {
      const r = pick([2, 3]);
      const n = rnd(3, 7);
      const sum = (Math.pow(r, n) - 1) / (r - 1);
      return { text: `1+${r}+${r}²+...+${r}^${n-1}`, answer: sum };
    },
    // n! / (n-1)!
    () => {
      const n = rnd(3, 10);
      return { text: `${n}! / ${n-1}!`, answer: n };
    },
    // Permutations P(n,2)
    () => {
      const n = rnd(4, 12);
      return { text: `P(${n},2) = ${n}×?`, answer: n - 1 };
    },
    // Interest: simple
    () => {
      const p = pick([100, 200, 500, 1000]);
      const r = pick([5, 10, 20]);
      const t = pick([1, 2, 3]);
      return { text: `Simple interest: ${p} at ${r}% for ${t}yr`, answer: p + p * r / 100 * t };
    },
    // Doubling time rule of 72
    () => {
      const r = pick([4, 6, 8, 9, 12]);
      return { text: `Rule of 72: ${r}% rate, years to double?`, answer: Math.round(72 / r) };
    },
  ];
  return pick(templates)();
}

function generateQuestion(mode: DrillMode): Question {
  if (mode === "arithmetic") return generateArithmetic();
  if (mode === "fractions") return generateFraction();
  if (mode === "percentages") return generatePercentage();
  if (mode === "powers") return generatePower();
  if (mode === "quant") return generateQuant();
  // mixed — weighted across all 6 generators
  const gen = [
    generateArithmetic, generateArithmetic, // slightly more arithmetic
    generateFraction,
    generatePercentage, generatePercentage,
    generatePower,
    generateQuant, generateQuant, // quant-specific gets good weight
  ];
  return pick(gen)();
}

const MODE_LABELS: Record<DrillMode, string> = {
  arithmetic: "Arithmetic",
  fractions: "Fractions",
  percentages: "Percentages",
  powers: "Powers & Roots",
  quant: "Quant",
  mixed: "Mixed",
};

const ROUND_COUNT = 10;
const TIME_LIMIT = 15; // seconds per question

export default function DrillPage() {
  const [mode, setMode] = useState<DrillMode>("mixed");
  const [gameState, setGameState] = useState<GameState>("idle");
  const [question, setQuestion] = useState<Question | null>(null);
  const [input, setInput] = useState("");
  const [round, setRound] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [history, setHistory] = useState<{ q: string; got: number; expected: number; ok: boolean }[]>([]);
  const [totalTime, setTotalTime] = useState(0);
  const [pointsPopups, setPointsPopups] = useState<{ id: number; x: number; y: number }[]>([]);
  const popupCounter = useRef(0);

  const nextQuestion = useCallback(() => {
    setQuestion(generateQuestion(mode));
    setInput("");
    setFeedback(null);
    setTimeLeft(TIME_LIMIT);
  }, [mode]);

  const advance = useCallback((got: number | null) => {
    if (!question) return;
    const expected = question.answer;
    const tol = question.tolerance ?? 0;
    const ok = got !== null && Math.abs(got - expected) <= Math.max(1, tol);
    setFeedback(ok ? "correct" : "wrong");
    setHistory(h => [...h, { q: question.text, got: got ?? -999, expected, ok }]);
    if (ok) {
      setCorrect(c => c + 1);
      const id = ++popupCounter.current;
      // random horizontal spread so multiple don't stack
      const x = 45 + Math.random() * 10;
      setPointsPopups(p => [...p, { id, x, y: 50 }]);
      setTimeout(() => setPointsPopups(p => p.filter(pp => pp.id !== id)), 900);
    }
    setTimeout(() => {
      if (round + 1 >= ROUND_COUNT) {
        setGameState("finished");
      } else {
        setRound(r => r + 1);
        nextQuestion();
      }
    }, 700);
  }, [question, round, nextQuestion]);

  // Timer
  useEffect(() => {
    if (gameState !== "playing" || feedback !== null) return;
    if (timeLeft <= 0) { advance(null); return; }
    const t = setTimeout(() => {
      setTimeLeft(l => l - 1);
      setTotalTime(tt => tt + 1);
    }, 1000);
    return () => clearTimeout(t);
  }, [gameState, timeLeft, feedback, advance]);

  function start() {
    setRound(0);
    setCorrect(0);
    setHistory([]);
    setTotalTime(0);
    setGameState("playing");
    setQuestion(generateQuestion(mode));
    setInput("");
    setFeedback(null);
    setTimeLeft(TIME_LIMIT);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const got = parseFloat(input.replace(/,/g, ""));
    advance(isNaN(got) ? null : got);
  }

  const pct = Math.round((correct / ROUND_COUNT) * 100);
  const timerPct = (timeLeft / TIME_LIMIT) * 100;

  return (
    <div className="max-w-2xl mx-auto px-4 py-10" style={{ position: "relative" }}>
      <style>{`
        @keyframes floatUp {
          0%   { opacity: 1; transform: translateY(0) scale(1.2); }
          60%  { opacity: 1; transform: translateY(-60px) scale(1); }
          100% { opacity: 0; transform: translateY(-90px) scale(0.8); }
        }
        .points-popup {
          position: fixed;
          pointer-events: none;
          z-index: 9999;
          font-size: 1.6rem;
          font-weight: 800;
          color: #22c55e;
          text-shadow: 0 2px 8px rgba(0,0,0,0.25);
          animation: floatUp 0.9s ease-out forwards;
        }
      `}</style>
      {pointsPopups.map(p => (
        <span
          key={p.id}
          className="points-popup"
          style={{ left: `${p.x}%`, top: `45%` }}
        >
          +1
        </span>
      ))}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <Brain size={20} style={{ color: "var(--accent)" }} />
          <h1 className="text-2xl font-bold" style={{ fontFamily: "DM Serif Display, serif", color: "var(--text)" }}>
            Mental Math Drill
          </h1>
        </div>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          {ROUND_COUNT} questions · {TIME_LIMIT}s each · No calculator. This is how quant interviews feel.
        </p>
      </div>

      {gameState === "idle" && (
        <div className="space-y-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>
              Choose Mode
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {(Object.keys(MODE_LABELS) as DrillMode[]).map(m => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className="py-3 px-4 rounded-xl text-sm font-medium transition-all text-left"
                  style={{
                    background: mode === m ? "var(--accent)" : "var(--surface-2)",
                    color: mode === m ? "white" : "var(--text)",
                    border: `1px solid ${mode === m ? "var(--accent)" : "var(--border)"}`,
                  }}
                >
                  {MODE_LABELS[m]}
                  {m === "mixed" && <span className="block text-xs opacity-70 mt-0.5">Recommended</span>}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={start}
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: "var(--accent)" }}
          >
            <Zap size={16} />
            Start Drill
          </button>
        </div>
      )}

      {gameState === "playing" && question && (
        <div>
          {/* Progress bar */}
          <div className="flex items-center justify-between text-xs mb-2" style={{ color: "var(--text-muted)" }}>
            <span>Question {round + 1} / {ROUND_COUNT}</span>
            <span style={{ color: correct > round * 0.7 ? "var(--accent)" : "var(--text-muted)" }}>
              {correct} correct
            </span>
          </div>
          <div className="h-1.5 rounded-full mb-6 overflow-hidden" style={{ background: "var(--surface-2)" }}>
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${((round) / ROUND_COUNT) * 100}%`, background: "var(--accent)" }}
            />
          </div>

          {/* Timer */}
          <div className="relative h-1.5 rounded-full mb-8 overflow-hidden" style={{ background: "var(--surface-2)" }}>
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{
                width: `${timerPct}%`,
                background: timeLeft > 5 ? "#3d8c4f" : "#ef4444",
              }}
            />
          </div>

          <div
            className="rounded-2xl p-8 text-center mb-6"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <div
              className="flex items-center justify-center gap-2 text-sm mb-4"
              style={{ color: timeLeft <= 5 ? "#ef4444" : "var(--text-muted)" }}
            >
              <Timer size={14} />
              {timeLeft}s
            </div>
            <p
              className="text-4xl font-bold mb-2"
              style={{ fontFamily: "DM Serif Display, serif", color: "var(--text)" }}
            >
              {question.text}
            </p>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}> = ?</p>
          </div>

          {feedback === "correct" && (
            <div className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold mb-4"
              style={{ background: "#dcfce7", color: "#16a34a" }}>
              <CheckCircle size={16} /> Correct!
            </div>
          )}
          {feedback === "wrong" && (
            <div className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold mb-4"
              style={{ background: "#fee2e2", color: "#dc2626" }}>
              <XCircle size={16} /> Answer: {question.answer}
            </div>
          )}

          {!feedback && (
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                autoFocus
                type="number"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Your answer"
                className="flex-1 px-4 py-3 rounded-xl text-lg font-medium outline-none"
                style={{
                  background: "var(--surface)",
                  border: "2px solid var(--accent)",
                  color: "var(--text)",
                }}
              />
              <button
                type="submit"
                className="px-5 py-3 rounded-xl font-semibold text-white"
                style={{ background: "var(--accent)" }}
              >
                <ChevronRight size={20} />
              </button>
            </form>
          )}
        </div>
      )}

      {gameState === "finished" && (
        <div>
          <div
            className="rounded-2xl p-8 text-center mb-6"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <Trophy size={40} className="mx-auto mb-3" style={{ color: "var(--accent)" }} />
            <p className="text-4xl font-bold mb-1" style={{ fontFamily: "DM Serif Display, serif", color: "var(--text)" }}>
              {correct}/{ROUND_COUNT}
            </p>
            <p className="text-lg font-semibold mb-1" style={{ color: "var(--accent)" }}>{pct}%</p>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              {pct >= 90 ? "Excellent — interview ready!" : pct >= 70 ? "Good — keep drilling!" : "Keep practicing — speed comes with reps."}
            </p>
          </div>

          {/* History */}
          <div className="space-y-1.5 mb-6">
            {history.map((h, i) => (
              <div
                key={i}
                className="flex items-center justify-between px-4 py-2 rounded-xl text-sm"
                style={{
                  background: h.ok ? "#f0fdf4" : "#fef2f2",
                  border: `1px solid ${h.ok ? "#bbf7d0" : "#fecaca"}`,
                }}
              >
                <span style={{ color: "var(--text)" }}>{h.q}</span>
                <div className="flex items-center gap-2">
                  {!h.ok && h.got !== -999 && (
                    <span style={{ color: "#dc2626" }}>you: {h.got}</span>
                  )}
                  {!h.ok && (
                    <span style={{ color: "#16a34a" }}>ans: {h.expected}</span>
                  )}
                  {h.ok ? <CheckCircle size={14} color="#16a34a" /> : <XCircle size={14} color="#dc2626" />}
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={start}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white"
              style={{ background: "var(--accent)" }}
            >
              <RotateCcw size={15} />
              Try Again
            </button>
            <button
              onClick={() => setGameState("idle")}
              className="flex-1 py-3 rounded-xl text-sm font-semibold"
              style={{ background: "var(--surface-2)", color: "var(--text)", border: "1px solid var(--border)" }}
            >
              Change Mode
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
