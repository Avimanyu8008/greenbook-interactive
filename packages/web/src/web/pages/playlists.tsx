import { Link } from "wouter";
import { PROBLEMS } from "../data/problems";
import { EXTRA_PROBLEMS } from "../data/problems-extra";
import { loadProgress } from "../lib/progress";

const ALL_PROBLEMS = [...PROBLEMS, ...EXTRA_PROBLEMS];
import { ListChecks, Lock, ChevronRight, CheckCircle } from "lucide-react";

interface Playlist {
  id: string;
  title: string;
  description: string;
  emoji: string;
  problemIds: string[];
  color: string;
  accent: string;
}

const PLAYLISTS: Playlist[] = [
  {
    id: "beginner",
    title: "Beginner 20",
    description: "The perfect starting point. Foundational probability and expected value.",
    emoji: "🌱",
    color: "#f0fdf4",
    accent: "#16a34a",
    problemIds: [
      // base problems (easy entry points)
      "birthday-problem", "monty-hall", "boy-or-girl", "secretary-problem",
      "two-envelopes", "random-walk", "urn-drawing", "card-problem",
      // extra problems (easy/medium foundational)
      "sock-drawer", "hat-check", "matching-problem", "sum-dice",
      "coin-sequence", "geometric-series-expected", "birthday-same-month",
      "normal-dist-prob", "geometric-distribution", "law-large-numbers",
      "poisson-process-arrivals", "conditional-expectation-tower",
    ],
  },
  {
    id: "greenbook-classics",
    title: "Classic Green Book 31",
    description: "The most-asked problems from Xinfeng Zhou's book. Essential reading.",
    emoji: "📗",
    color: "#f9faf7",
    accent: "#3d8c4f",
    problemIds: [
      // all 13 base problems
      "monty-hall", "birthday-problem", "gamblers-ruin", "coupon-collector",
      "boy-or-girl", "secretary-problem", "two-envelopes", "random-walk",
      "dice-stopping", "expected-rolls", "urn-drawing", "card-problem",
      "three-doors-variant",
      // canonical extra problems from the book
      "airplane-boarding", "russian-roulette", "three-prisoners",
      "coin-sequence", "geometric-series-expected", "noodle-loop",
      "pirate-gold", "ballot-problem", "random-chord", "stick-breaking",
      "ruin-unfair", "buffon-needle", "three-way-duel", "optimal-bet",
      "sum-random-variables", "record-values", "banach-matchbox",
      "optimal-stopping-uniform",
    ],
  },
  {
    id: "jane-street",
    title: "Jane Street Favorites",
    description: "Problems frequently reported from Jane Street interviews.",
    emoji: "🏦",
    color: "#eff6ff",
    accent: "#1d4ed8",
    problemIds: [
      "secretary-problem", "two-envelopes", "random-walk", "gamblers-ruin",
      "russian-roulette", "pirate-gold", "geometric-series-expected",
      "coin-sequence", "hat-check", "ballot-problem",
      "airplane-boarding", "three-way-duel", "optimal-stopping-uniform",
      "random-chord",
    ],
  },
  {
    id: "citadel",
    title: "Citadel & Optiver",
    description: "Fast-paced probability and expected value — quant trading style.",
    emoji: "⚡",
    color: "#fefce8",
    accent: "#ca8a04",
    problemIds: [
      "monty-hall", "birthday-problem", "coupon-collector", "boy-or-girl",
      "urn-drawing", "dice-stopping", "expected-rolls", "three-prisoners",
      "sock-drawer", "order-statistics", "geometric-waiting",
      "poisson-approximation", "sum-dice", "buffon-needle",
    ],
  },
  {
    id: "must-know-50",
    title: "Must-Know 50",
    description: "If you only prep 50 problems, these are the ones. Covers every major topic.",
    emoji: "🎯",
    color: "#fdf4ff",
    accent: "#9333ea",
    problemIds: [
      // base (all 13)
      "monty-hall", "birthday-problem", "gamblers-ruin", "coupon-collector",
      "boy-or-girl", "secretary-problem", "two-envelopes", "random-walk",
      "dice-stopping", "expected-rolls", "urn-drawing", "card-problem",
      "three-doors-variant",
      // extra — conditional probability
      "airplane-boarding", "russian-roulette", "three-prisoners",
      "simpson-paradox", "card-order", "geometric-distribution",
      // extra — expected value
      "coin-sequence", "geometric-series-expected", "noodle-loop",
      "matching-problem", "order-statistics", "record-values",
      "sum-random-variables", "exponential-min", "correlation-causation",
      "banach-matchbox", "conditional-expectation-tower",
      // extra — combinatorics / geo probability
      "hat-check", "sock-drawer", "ballot-problem", "random-chord",
      "buffon-needle", "stick-breaking", "sum-dice", "runs-test",
      "negative-hypergeometric",
      // extra — game theory / stopping
      "pirate-gold", "three-way-duel", "optimal-bet",
      "optimal-stopping-uniform", "martingale-doublng",
      // extra — random walks / advanced
      "ruin-unfair", "drunkard-walk", "markov-chain-absorbing",
      "brownian-max", "law-large-numbers", "poker-full-house",
    ],
  },
  {
    id: "advanced",
    title: "Advanced Topics",
    description: "Brownian motion, martingales, optimal stopping — senior quant level.",
    emoji: "🔬",
    color: "#fff1f2",
    accent: "#e11d48",
    problemIds: [
      "brownian-bridge", "brownian-max", "martingale-doublng",
      "optimal-bet", "markov-chain-absorbing", "optimal-stopping-uniform",
      "order-statistics", "record-values", "banach-matchbox",
      "correlation-causation", "law-large-numbers", "poisson-process-arrivals",
      "conditional-expectation-tower", "geometric-waiting",
      "negative-hypergeometric",
    ],
  },
];

export default function PlaylistsPage() {
  const progress = loadProgress();

  function getCompletion(playlist: Playlist) {
    const found = playlist.problemIds.filter(id => ALL_PROBLEMS.find(p => p.id === id));
    const solved = found.filter(id => progress.solved?.[id]);
    return { found: found.length, solved: solved.length };
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <ListChecks size={20} style={{ color: "var(--accent)" }} />
          <h1 className="text-2xl font-bold" style={{ fontFamily: "DM Serif Display, serif", color: "var(--text)" }}>
            Study Playlists
          </h1>
        </div>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Curated sets for every level — from first-timer to Jane Street finalist
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {PLAYLISTS.map(pl => {
          const { found, solved } = getCompletion(pl);
          const pct = found > 0 ? Math.round((solved / found) * 100) : 0;

          return (
            <Link key={pl.id} to={`/playlists/${pl.id}`}>
              <div
                className="rounded-2xl p-6 cursor-pointer transition-all hover:shadow-md group"
                style={{ background: pl.color, border: `1px solid ${pl.accent}30` }}
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-2xl">{pl.emoji}</span>
                  <ChevronRight
                    size={16}
                    className="group-hover:translate-x-0.5 transition-transform"
                    style={{ color: pl.accent }}
                  />
                </div>
                <h3 className="font-bold text-base mb-1" style={{ color: "var(--text)" }}>
                  {pl.title}
                </h3>
                <p className="text-xs leading-relaxed mb-4" style={{ color: "var(--text-muted)" }}>
                  {pl.description}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium" style={{ color: pl.accent }}>
                    {found} problems
                  </span>
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                    {solved}/{found} done
                  </span>
                </div>

                {/* Progress bar */}
                <div className="h-1.5 rounded-full mt-2 overflow-hidden" style={{ background: `${pl.accent}20` }}>
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${pct}%`, background: pl.accent }}
                  />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

// Re-export playlists for the detail page
export { PLAYLISTS };
