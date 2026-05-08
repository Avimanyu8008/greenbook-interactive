import { useState, useEffect, useCallback } from "react";
import { Brain, CheckCircle, XCircle, Timer, RotateCcw, Trophy, Zap, ChevronRight } from "lucide-react";

type DrillMode = "arithmetic" | "fractions" | "percentages" | "powers" | "mixed";
type GameState = "idle" | "playing" | "finished";

interface Question {
  text: string;
  answer: number;
  tolerance?: number; // for decimal answers
}

function generateArithmetic(): Question {
  const ops = ["+", "-", "×", "÷"] as const;
  const op = ops[Math.floor(Math.random() * ops.length)];
  let a: number, b: number, answer: number, text: string;
  switch (op) {
    case "+":
      a = Math.floor(Math.random() * 999) + 1;
      b = Math.floor(Math.random() * 999) + 1;
      answer = a + b;
      text = `${a} + ${b}`;
      break;
    case "-":
      a = Math.floor(Math.random() * 999) + 100;
      b = Math.floor(Math.random() * (a - 1)) + 1;
      answer = a - b;
      text = `${a} − ${b}`;
      break;
    case "×":
      a = Math.floor(Math.random() * 25) + 2;
      b = Math.floor(Math.random() * 25) + 2;
      answer = a * b;
      text = `${a} × ${b}`;
      break;
    default:
      b = Math.floor(Math.random() * 12) + 2;
      answer = Math.floor(Math.random() * 50) + 2;
      a = b * answer;
      text = `${a} ÷ ${b}`;
  }
  return { text, answer };
}

function generateFraction(): Question {
  const templates = [
    () => {
      const n = Math.floor(Math.random() * 9) + 1;
      const d = [4, 5, 8, 10, 16, 20, 25, 100][Math.floor(Math.random() * 8)];
      return { text: `${n}/${d} as a decimal (×100 = ?)`, answer: Math.round((n / d) * 100), tolerance: 0 };
    },
    () => {
      const a = Math.floor(Math.random() * 8) + 1;
      const b = Math.floor(Math.random() * 8) + 1;
      const d1 = [2, 3, 4, 5, 6, 8][Math.floor(Math.random() * 6)];
      const d2 = [2, 3, 4, 5, 6, 8][Math.floor(Math.random() * 6)];
      const ans = a * d2 + b * d1;
      return { text: `${a}/${d1} + ${b}/${d2} = ?/${d1 * d2}`, answer: ans, tolerance: 0 };
    },
  ];
  return templates[Math.floor(Math.random() * templates.length)]();
}

function generatePercentage(): Question {
  const templates = [
    () => {
      const pct = [5, 10, 15, 20, 25, 30, 40, 50, 75][Math.floor(Math.random() * 9)];
      const n = Math.floor(Math.random() * 20) * 10 + 20;
      return { text: `${pct}% of ${n}`, answer: Math.round(n * pct / 100) };
    },
    () => {
      const a = Math.floor(Math.random() * 90) + 10;
      const b = Math.floor(Math.random() * 90) + 10;
      const pct = Math.round(a / b * 100);
      return { text: `${a} is what % of ${b}? (round)`, answer: pct };
    },
    () => {
      const start = Math.floor(Math.random() * 50) * 10 + 50;
      const pct = [10, 20, 25, 50][Math.floor(Math.random() * 4)];
      return { text: `${start} increased by ${pct}%`, answer: Math.round(start * (1 + pct / 100)) };
    },
  ];
  return templates[Math.floor(Math.random() * templates.length)]();
}

function generatePower(): Question {
  const templates = [
    () => {
      const base = Math.floor(Math.random() * 15) + 2;
      return { text: `${base}²`, answer: base * base };
    },
    () => {
      const base = Math.floor(Math.random() * 8) + 2;
      return { text: `${base}³`, answer: base * base * base };
    },
    () => {
      const n = [4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144, 169, 196, 225][Math.floor(Math.random() * 14)];
      return { text: `√${n}`, answer: Math.round(Math.sqrt(n)) };
    },
    () => {
      const exp = Math.floor(Math.random() * 10) + 1;
      return { text: `2^${exp}`, answer: Math.pow(2, exp) };
    },
  ];
  return templates[Math.floor(Math.random() * templates.length)]();
}

function generateQuestion(mode: DrillMode): Question {
  if (mode === "arithmetic") return generateArithmetic();
  if (mode === "fractions") return generateFraction();
  if (mode === "percentages") return generatePercentage();
  if (mode === "powers") return generatePower();
  // mixed
  const gen = [generateArithmetic, generateFraction, generatePercentage, generatePower];
  return gen[Math.floor(Math.random() * gen.length)]();
}

const MODE_LABELS: Record<DrillMode, string> = {
  arithmetic: "Arithmetic",
  fractions: "Fractions",
  percentages: "Percentages",
  powers: "Powers & Roots",
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
    if (ok) setCorrect(c => c + 1);
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
    <div className="max-w-2xl mx-auto px-4 py-10">
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
