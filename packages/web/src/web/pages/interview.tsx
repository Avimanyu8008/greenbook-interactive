import { useState, useEffect } from "react";
import { PROBLEMS } from "../data/problems";
import { Timer, Play, SkipForward, CheckCircle, Trophy, RotateCcw, Target, Building2, Shuffle } from "lucide-react";

type Difficulty = "Easy" | "Medium" | "Hard" | "Mixed";
type GameState = "setup" | "playing" | "finished";
type FirmPreset = "none" | "Jane Street" | "Optiver" | "Citadel" | "Two Sigma" | "DE Shaw";

interface SessionProblem {
  id: string;
  title: string;
  category: string;
  difficulty: string;
  statement: string;
  answer: string;
  startedAt?: number;
  timeSpent?: number;
  solved?: boolean;
  skipped?: boolean;
}

const TIME_OPTIONS = [15, 20, 30, 45, 60];
const COUNT_OPTIONS = [5, 10, 15, 20];

const FIRM_META: Record<string, { color: string; description: string }> = {
  "Jane Street": {
    color: "#1d4ed8",
    description: "Heavy probability, EV, random walks, and Bayesian reasoning",
  },
  "Optiver": {
    color: "#d97706",
    description: "Mental math speed, combinatorics, market making intuition",
  },
  "Citadel": {
    color: "#6d28d9",
    description: "Stats, stochastic processes, brainteasers, and brain vs. math",
  },
  "Two Sigma": {
    color: "#0891b2",
    description: "Data-driven thinking, statistics, ML reasoning, and probability",
  },
  "DE Shaw": {
    color: "#065f46",
    description: "Advanced probability, coding puzzles, mathematical olympiad style",
  },
};

export default function InterviewPage() {
  const [difficulty, setDifficulty] = useState<Difficulty>("Mixed");
  const [firmPreset, setFirmPreset] = useState<FirmPreset>("none");
  const [timeLimit, setTimeLimit] = useState(20);
  const [count, setCount] = useState(10);
  const [gameState, setGameState] = useState<GameState>("setup");

  const [problems, setProblems] = useState<SessionProblem[]>([]);
  const [idx, setIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [qStart, setQStart] = useState(Date.now());

  // How many firm-tagged problems exist
  const firmCounts = Object.keys(FIRM_META).reduce<Record<string, number>>((acc, firm) => {
    acc[firm] = PROBLEMS.filter(p => (p as any).companies?.includes(firm)).length;
    return acc;
  }, {});

  function shuffle<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function startSession() {
    let pool = [...PROBLEMS];

    // Apply firm filter
    if (firmPreset !== "none") {
      const firmPool = pool.filter(p => (p as any).companies?.includes(firmPreset));
      if (firmPool.length >= 3) pool = firmPool;
    }

    // Apply difficulty filter
    if (difficulty !== "Mixed") pool = pool.filter(p => p.difficulty === difficulty);

    pool = shuffle(pool);
    const selected = pool.slice(0, Math.min(count, pool.length)).map(p => ({ ...p }));
    setProblems(selected);
    setIdx(0);
    setTimeLeft(timeLimit * 60);
    setShowAnswer(false);
    setQStart(Date.now());
    setGameState("playing");
  }

  useEffect(() => {
    if (gameState !== "playing") return;
    if (timeLeft <= 0) { setGameState("finished"); return; }
    const t = setTimeout(() => setTimeLeft(l => l - 1), 1000);
    return () => clearTimeout(t);
  }, [gameState, timeLeft]);

  function markSolved() {
    const spent = Math.round((Date.now() - qStart) / 1000);
    setProblems(ps => ps.map((p, i) => i === idx ? { ...p, solved: true, timeSpent: spent } : p));
    advance();
  }

  function skip() {
    const spent = Math.round((Date.now() - qStart) / 1000);
    setProblems(ps => ps.map((p, i) => i === idx ? { ...p, skipped: true, timeSpent: spent } : p));
    advance();
  }

  function advance() {
    if (idx + 1 >= problems.length) {
      setGameState("finished");
    } else {
      setIdx(i => i + 1);
      setShowAnswer(false);
      setQStart(Date.now());
    }
  }

  const mm = Math.floor(timeLeft / 60).toString().padStart(2, "0");
  const ss = (timeLeft % 60).toString().padStart(2, "0");
  const urgent = timeLeft < 60;

  const solved = problems.filter(p => p.solved).length;
  const skipped = problems.filter(p => p.skipped).length;
  const avgTime = problems.filter(p => p.timeSpent).reduce((a, b) => a + (b.timeSpent ?? 0), 0) /
    Math.max(1, problems.filter(p => p.timeSpent).length);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <Target size={20} style={{ color: "var(--accent)" }} />
          <h1 className="text-2xl font-bold" style={{ fontFamily: "DM Serif Display, serif", color: "var(--text)" }}>
            Interview Mode
          </h1>
        </div>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Simulate a real quant interview under time pressure
        </p>
      </div>

      {/* ── Setup ── */}
      {gameState === "setup" && (
        <div className="space-y-5">

          {/* Firm Presets */}
          <div
            className="rounded-2xl p-5"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Building2 size={14} style={{ color: "var(--text-muted)" }} />
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                Firm Preset
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
              <button
                onClick={() => setFirmPreset("none")}
                className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all border"
                style={{
                  background: firmPreset === "none" ? "var(--accent)" : "var(--surface-2)",
                  color: firmPreset === "none" ? "white" : "var(--text)",
                  borderColor: firmPreset === "none" ? "var(--accent)" : "var(--border)",
                }}
              >
                <Shuffle size={13} />
                Random Mix
              </button>
              {Object.keys(FIRM_META).map(firm => {
                const meta = FIRM_META[firm];
                const isActive = firmPreset === firm;
                return (
                  <button
                    key={firm}
                    onClick={() => setFirmPreset(firm as FirmPreset)}
                    className="flex flex-col items-start px-3 py-2.5 rounded-xl text-xs font-medium transition-all border text-left"
                    style={{
                      background: isActive ? `${meta.color}15` : "var(--surface-2)",
                      color: isActive ? meta.color : "var(--text)",
                      borderColor: isActive ? meta.color : "var(--border)",
                    }}
                  >
                    <span className="font-semibold text-sm">{firm}</span>
                    <span
                      className="text-[10px] mt-0.5"
                      style={{ color: isActive ? meta.color : "var(--text-muted)", opacity: 0.85 }}
                    >
                      {firmCounts[firm] ?? 0} tagged problems
                    </span>
                  </button>
                );
              })}
            </div>
            {firmPreset !== "none" && (
              <div
                className="text-xs px-3 py-2 rounded-lg"
                style={{
                  background: `${FIRM_META[firmPreset].color}10`,
                  color: FIRM_META[firmPreset].color,
                  border: `1px solid ${FIRM_META[firmPreset].color}30`,
                }}
              >
                <strong>{firmPreset}:</strong> {FIRM_META[firmPreset].description}
              </div>
            )}
          </div>

          {/* Difficulty */}
          <div
            className="rounded-2xl p-5"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>
              Difficulty
            </p>
            <div className="flex gap-2 flex-wrap">
              {(["Mixed", "Easy", "Medium", "Hard"] as Difficulty[]).map(d => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className="px-4 py-2 rounded-xl text-sm font-medium transition-all border"
                  style={{
                    background: difficulty === d ? "var(--accent)" : "var(--surface-2)",
                    color: difficulty === d ? "white" : "var(--text)",
                    borderColor: difficulty === d ? "var(--accent)" : "var(--border)",
                  }}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Time */}
            <div
              className="rounded-2xl p-5"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
            >
              <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>
                Time Limit
              </p>
              <div className="flex gap-2 flex-wrap">
                {TIME_OPTIONS.map(t => (
                  <button
                    key={t}
                    onClick={() => setTimeLimit(t)}
                    className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all border"
                    style={{
                      background: timeLimit === t ? "var(--accent)" : "var(--surface-2)",
                      color: timeLimit === t ? "white" : "var(--text)",
                      borderColor: timeLimit === t ? "var(--accent)" : "var(--border)",
                    }}
                  >
                    {t}m
                  </button>
                ))}
              </div>
            </div>

            {/* Count */}
            <div
              className="rounded-2xl p-5"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
            >
              <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>
                # Problems
              </p>
              <div className="flex gap-2 flex-wrap">
                {COUNT_OPTIONS.map(n => (
                  <button
                    key={n}
                    onClick={() => setCount(n)}
                    className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all border"
                    style={{
                      background: count === n ? "var(--accent)" : "var(--surface-2)",
                      color: count === n ? "white" : "var(--text)",
                      borderColor: count === n ? "var(--accent)" : "var(--border)",
                    }}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={startSession}
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: "var(--accent)" }}
          >
            <Play size={16} />
            {firmPreset !== "none" ? `Start ${firmPreset} Session` : "Start Interview"}
          </button>
        </div>
      )}

      {/* ── Playing ── */}
      {gameState === "playing" && problems[idx] && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>
                {idx + 1} / {problems.length}
              </span>
              <div className="h-1.5 w-32 rounded-full overflow-hidden" style={{ background: "var(--surface-2)" }}>
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${(idx / problems.length) * 100}%`, background: "var(--accent)" }}
                />
              </div>
              {firmPreset !== "none" && (
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{
                    background: `${FIRM_META[firmPreset].color}15`,
                    color: FIRM_META[firmPreset].color,
                  }}
                >
                  {firmPreset}
                </span>
              )}
            </div>
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-sm font-bold"
              style={{
                background: urgent ? "#fef2f2" : "var(--surface-2)",
                color: urgent ? "#dc2626" : "var(--text)",
                border: `1px solid ${urgent ? "#fecaca" : "var(--border)"}`,
              }}
            >
              <Timer size={14} />
              {mm}:{ss}
            </div>
          </div>

          <div
            className="rounded-2xl p-6 mb-4"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <div className="flex items-center gap-2 mb-4">
              <span
                className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{
                  background: problems[idx].difficulty === "Easy" ? "#dcfce7" : problems[idx].difficulty === "Medium" ? "#fef9c3" : "#fee2e2",
                  color: problems[idx].difficulty === "Easy" ? "#16a34a" : problems[idx].difficulty === "Medium" ? "#ca8a04" : "#dc2626",
                }}
              >
                {problems[idx].difficulty}
              </span>
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>{problems[idx].category}</span>
            </div>
            <h2 className="text-lg font-semibold mb-3" style={{ color: "var(--text)" }}>
              {problems[idx].title}
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
              {problems[idx].statement}
            </p>
          </div>

          {showAnswer && (
            <div
              className="rounded-2xl p-6 mb-4"
              style={{ background: "var(--accent-light)", border: "1px solid var(--border)" }}
            >
              <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--accent)" }}>
                Answer
              </p>
              <div className="text-sm" style={{ color: "var(--text)" }}>
                {problems[idx].answer}
              </div>
            </div>
          )}

          <div className="flex gap-3">
            {!showAnswer && (
              <button
                onClick={() => setShowAnswer(true)}
                className="flex-1 py-3 rounded-xl text-sm font-semibold border"
                style={{ background: "var(--surface-2)", color: "var(--text)", borderColor: "var(--border)" }}
              >
                Show Answer
              </button>
            )}
            {showAnswer && (
              <button
                onClick={markSolved}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white"
                style={{ background: "var(--accent)" }}
              >
                <CheckCircle size={15} />
                Got It
              </button>
            )}
            <button
              onClick={skip}
              className="px-5 py-3 rounded-xl text-sm font-medium flex items-center gap-1.5 border"
              style={{ background: "var(--surface-2)", color: "var(--text-muted)", borderColor: "var(--border)" }}
            >
              <SkipForward size={15} />
              Skip
            </button>
          </div>
        </div>
      )}

      {/* ── Finished ── */}
      {gameState === "finished" && (
        <div>
          <div
            className="rounded-2xl p-8 text-center mb-6"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <Trophy size={40} className="mx-auto mb-3" style={{ color: "var(--accent)" }} />
            {firmPreset !== "none" && (
              <p className="text-xs font-semibold mb-2" style={{ color: FIRM_META[firmPreset].color }}>
                {firmPreset} Mock Interview
              </p>
            )}
            <p className="text-4xl font-bold mb-1" style={{ fontFamily: "DM Serif Display, serif", color: "var(--text)" }}>
              {solved}/{problems.length}
            </p>
            <p className="text-lg font-semibold" style={{ color: "var(--accent)" }}>
              {Math.round((solved / Math.max(problems.length, 1)) * 100)}% solved
            </p>
            <div className="flex justify-center gap-6 mt-4 text-sm" style={{ color: "var(--text-muted)" }}>
              <span>⏭ {skipped} skipped</span>
              <span>⏱ avg {Math.round(avgTime)}s/problem</span>
            </div>
          </div>

          <div className="space-y-2 mb-6">
            {problems.map((p, i) => (
              <div
                key={i}
                className="flex items-center justify-between px-4 py-3 rounded-xl text-sm border"
                style={{
                  background: p.solved ? "var(--accent-light)" : p.skipped ? "#fef2f2" : "var(--surface-2)",
                  borderColor: p.solved ? "var(--border)" : p.skipped ? "#fecaca" : "var(--border)",
                }}
              >
                <span style={{ color: "var(--text)" }}>{p.title}</span>
                <div className="flex items-center gap-2 text-xs" style={{ color: "var(--text-muted)" }}>
                  {p.timeSpent && <span>{p.timeSpent}s</span>}
                  {p.solved && <CheckCircle size={14} color="var(--easy)" />}
                  {p.skipped && <SkipForward size={14} color="#dc2626" />}
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={startSession}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white"
              style={{ background: "var(--accent)" }}
            >
              <RotateCcw size={15} />
              New Session
            </button>
            <button
              onClick={() => setGameState("setup")}
              className="flex-1 py-3 rounded-xl text-sm font-semibold border"
              style={{ background: "var(--surface-2)", color: "var(--text)", borderColor: "var(--border)" }}
            >
              Change Settings
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
