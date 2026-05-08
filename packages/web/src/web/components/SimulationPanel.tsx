import { useState, useCallback } from "react";
import { Play, RotateCcw, TrendingUp } from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, ReferenceLine, CartesianGrid,
} from "recharts";
import type { Problem } from "../data/problems";
import { runSimulation, type SimResult } from "../lib/simulations";

type Props = {
  problem: Problem;
  onSolved?: () => void;
};

export default function SimulationPanel({ problem, onSolved }: Props) {
  const initParams = Object.fromEntries(
    Object.entries(problem.params).map(([k, v]) => [k, v.default])
  );
  const [params, setParams] = useState<Record<string, number>>(initParams);
  const [result, setResult] = useState<SimResult | null>(null);
  const [running, setRunning] = useState(false);

  const run = useCallback(() => {
    setRunning(true);
    setTimeout(() => {
      const res = runSimulation(problem.simulationType, params);
      setResult(res);
      setRunning(false);
      onSolved?.();
    }, 50);
  }, [problem.simulationType, params, onSolved]);

  const reset = () => {
    setParams(initParams);
    setResult(null);
  };

  const isBarChart =
    [
      "coupon-collector", "expected-rolls", "urn-drawing", "card-ace", "dice-stopping",
      "boy-or-girl", "two-envelopes", "disease-test",
      // new problem types
      "airplane-boarding", "russian-roulette", "three-prisoners", "sock-drawer",
      "poker-hand", "derangement", "expected-matches", "coin-sequence", "st-petersburg",
      "pirate-game", "order-statistics", "poker-flush", "ballot", "bertrand-chord",
      "dice-sum", "max-dice", "simpson", "record-values", "gamblers-ruin-unfair",
      "card-color", "buffon-needle", "truel", "absorbing-markov", "kelly-criterion",
      "coin-runs", "neg-binomial", "poisson", "martingale", "birthday-month",
      "coin-profit", "normal-probabilities", "geometric-memoryless", "random-triangle",
      "exp-minimum", "regression-mean", "banach-matchbox", "bus-wait",
      "optimal-stopping-uniform", "draw-until-red", "sum-uniforms",
    ].includes(problem.simulationType);

  return (
    <div className="rounded-xl overflow-hidden border" style={{ borderColor: "var(--border)" }}>
      {/* Header */}
      <div
        className="px-5 py-3 flex items-center gap-2 border-b"
        style={{ background: "var(--sim-bg)", borderColor: "#2a3326" }}
      >
        <TrendingUp size={14} className="text-green-400" />
        <span className="text-sm font-medium text-green-400" style={{ fontFamily: "JetBrains Mono, monospace" }}>
          Monte Carlo Simulator
        </span>
        <span className="ml-auto text-xs text-green-700" style={{ fontFamily: "JetBrains Mono, monospace" }}>
          {problem.simulationType}
        </span>
      </div>

      <div style={{ background: "var(--surface)" }}>
        {/* Parameters */}
        <div className="p-5 border-b" style={{ borderColor: "var(--border)" }}>
          <p className="text-xs font-semibold mb-3 uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
            Parameters
          </p>
          <div className="grid grid-cols-1 gap-4">
            {Object.entries(problem.params).map(([key, cfg]) => (
              <div key={key}>
                <div className="flex justify-between mb-1">
                  <label className="text-xs font-medium" style={{ color: "var(--text)" }}>
                    {cfg.label}
                  </label>
                  <span
                    className="text-xs font-semibold px-1.5 py-0.5 rounded"
                    style={{ background: "var(--accent-light)", color: "var(--accent)", fontFamily: "JetBrains Mono, monospace" }}
                  >
                    {params[key].toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min={cfg.min}
                  max={cfg.max}
                  step={cfg.step}
                  value={params[key]}
                  onChange={e => setParams(p => ({ ...p, [key]: +e.target.value }))}
                  className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                  style={{
                    accentColor: "var(--accent)",
                    background: `linear-gradient(to right, var(--accent) 0%, var(--accent) ${((params[key] - cfg.min) / (cfg.max - cfg.min)) * 100}%, var(--border) ${((params[key] - cfg.min) / (cfg.max - cfg.min)) * 100}%, var(--border) 100%)`,
                  }}
                />
                <div className="flex justify-between text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                  <span>{cfg.min.toLocaleString()}</span>
                  <span>{cfg.max.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={run}
              disabled={running}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold text-white transition-opacity"
              style={{ background: "var(--accent)", opacity: running ? 0.7 : 1 }}
            >
              <Play size={14} />
              {running ? "Simulating…" : "Run Simulation"}
            </button>
            <button
              onClick={reset}
              className="px-3 py-2.5 rounded-lg border text-sm transition-colors"
              style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
            >
              <RotateCcw size={14} />
            </button>
          </div>
        </div>

        {/* Results */}
        {result && (
          <div className="p-5 space-y-4">
            {/* Big number */}
            <div className="text-center py-3">
              <div
                className="text-4xl font-bold"
                style={{ color: "var(--accent)", fontFamily: "JetBrains Mono, monospace" }}
              >
                {typeof result.value === "number"
                  ? Number.isInteger(result.value)
                    ? result.value.toLocaleString()
                    : result.value.toFixed(2)
                  : result.value}
              </div>
              <div className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                {result.label}
              </div>
            </div>

            {/* Chart */}
            {result.chartData.length > 0 && (
              <div style={{ height: 200 }}>
                <ResponsiveContainer width="100%" height="100%">
                  {isBarChart ? (
                    <BarChart data={result.chartData} margin={{ top: 4, right: 4, bottom: 4, left: -20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="name" tick={{ fontSize: 10, fill: "var(--text-muted)" }} />
                      <YAxis tick={{ fontSize: 10, fill: "var(--text-muted)" }} />
                      <Tooltip
                        contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 6, fontSize: 12 }}
                      />
                      <Bar dataKey="value" fill="var(--accent)" radius={[3, 3, 0, 0]} opacity={0.85} />
                    </BarChart>
                  ) : (
                    <LineChart data={result.chartData} margin={{ top: 4, right: 4, bottom: 4, left: -20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="name" tick={{ fontSize: 10, fill: "var(--text-muted)" }} />
                      <YAxis tick={{ fontSize: 10, fill: "var(--text-muted)" }} />
                      <Tooltip
                        contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 6, fontSize: 12 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="var(--accent)"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 4 }}
                      />
                      {result.chartData[0]?.expected !== undefined && (
                        <ReferenceLine
                          y={result.chartData[0].expected}
                          stroke="var(--medium)"
                          strokeDasharray="4 4"
                          label={{ value: "Theory", fill: "var(--medium)", fontSize: 10 }}
                        />
                      )}
                    </LineChart>
                  )}
                </ResponsiveContainer>
              </div>
            )}

            {/* Stats table */}
            <div className="space-y-1.5">
              {result.stats.map(s => s.value && (
                <div
                  key={s.label}
                  className="flex justify-between items-center py-1.5 px-3 rounded-lg"
                  style={{ background: "var(--surface-2)" }}
                >
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>{s.label}</span>
                  <span
                    className="text-xs font-semibold"
                    style={{ color: "var(--text)", fontFamily: "JetBrains Mono, monospace" }}
                  >
                    {s.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
