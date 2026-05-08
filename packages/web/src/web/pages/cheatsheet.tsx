import { useState } from "react";
import { BookOpen, Copy, Check } from "lucide-react";
import "katex/dist/katex.min.css";
import { BlockMath, InlineMath } from "react-katex";

interface FormulaCard {
  title: string;
  category: string;
  latex: string;
  description: string;
  example?: string;
}

const FORMULAS: FormulaCard[] = [
  // Probability basics
  { category: "Basics", title: "Bayes' Theorem", latex: "P(A|B) = \\frac{P(B|A)\\,P(A)}{P(B)}", description: "Updates probability given evidence.", example: "Disease testing, Monty Hall" },
  { category: "Basics", title: "Law of Total Probability", latex: "P(B) = \\sum_i P(B|A_i)P(A_i)", description: "Marginalizes over a partition.", example: "Two-stage problems" },
  { category: "Basics", title: "Complement Rule", latex: "P(A^c) = 1 - P(A)", description: "Often easier to compute the complement." },
  { category: "Basics", title: "Inclusion-Exclusion", latex: "P(A \\cup B) = P(A) + P(B) - P(A \\cap B)", description: "Avoids double-counting." },
  { category: "Basics", title: "Conditional Probability", latex: "P(A|B) = \\frac{P(A \\cap B)}{P(B)}", description: "Probability of A given B occurred." },
  { category: "Basics", title: "Independence", latex: "P(A \\cap B) = P(A)\\,P(B)", description: "A and B are independent iff this holds." },

  // Combinatorics
  { category: "Combinatorics", title: "Combinations", latex: "\\binom{n}{k} = \\frac{n!}{k!(n-k)!}", description: "Choose k from n, order doesn't matter." },
  { category: "Combinatorics", title: "Permutations", latex: "P(n,k) = \\frac{n!}{(n-k)!}", description: "Arrange k items from n, order matters." },
  { category: "Combinatorics", title: "Stars & Bars", latex: "\\binom{n+k-1}{k-1}", description: "Distribute n identical items into k bins." },
  { category: "Combinatorics", title: "Derangements", latex: "D_n = n!\\sum_{k=0}^n \\frac{(-1)^k}{k!} \\approx \\frac{n!}{e}", description: "Permutations with no fixed points.", example: "Hat-check problem" },
  { category: "Combinatorics", title: "Birthday Problem", latex: "P(\\text{collision}) = 1 - \\frac{n!}{n^k \\binom{n}{k}} \\approx 1 - e^{-k^2/2n}", description: "Probability ≥1 shared birthday among k people.", example: "~23 people for 50%" },

  // Expected Value
  { category: "Expected Value", title: "Definition", latex: "E[X] = \\sum_x x\\,P(X=x)", description: "Weighted average of outcomes." },
  { category: "Expected Value", title: "Linearity of Expectation", latex: "E[aX + bY] = aE[X] + bE[Y]", description: "Always holds — even for dependent variables.", example: "Coupon collector, random walk" },
  { category: "Expected Value", title: "Law of Total Expectation", latex: "E[X] = E[E[X|Y]]", description: "Tower property — condition on an event or RV.", example: "Amoeba extinction" },
  { category: "Expected Value", title: "Variance", latex: "\\text{Var}(X) = E[X^2] - (E[X])^2", description: "Spread of a distribution." },
  { category: "Expected Value", title: "Geometric Sum", latex: "\\sum_{k=0}^\\infty r^k = \\frac{1}{1-r}, \\quad |r|<1", description: "Infinite geometric series.", example: "Expected trials until success" },

  // Common Distributions
  { category: "Distributions", title: "Bernoulli", latex: "P(X=1)=p,\\quad E[X]=p,\\quad \\text{Var}=p(1-p)", description: "Single trial with probability p." },
  { category: "Distributions", title: "Binomial", latex: "P(X=k)=\\binom{n}{k}p^k(1-p)^{n-k},\\quad E[X]=np", description: "n independent Bernoulli trials.", example: "Coin flips" },
  { category: "Distributions", title: "Geometric", latex: "P(X=k)=(1-p)^{k-1}p,\\quad E[X]=\\frac{1}{p}", description: "Trials until first success. Memoryless.", example: "Dice rolls until 6" },
  { category: "Distributions", title: "Negative Binomial", latex: "P(X=k)=\\binom{k-1}{r-1}p^r(1-p)^{k-r},\\quad E[X]=\\frac{r}{p}", description: "Trials until r-th success." },
  { category: "Distributions", title: "Poisson", latex: "P(X=k)=\\frac{\\lambda^k e^{-\\lambda}}{k!},\\quad E[X]=\\lambda", description: "Count of rare events. Approx Binomial when n large, p small.", example: "λ=np" },
  { category: "Distributions", title: "Uniform", latex: "f(x)=\\frac{1}{b-a},\\quad E[X]=\\frac{a+b}{2},\\quad \\text{Var}=\\frac{(b-a)^2}{12}", description: "Continuous, equally likely on [a,b]." },
  { category: "Distributions", title: "Exponential", latex: "f(x)=\\lambda e^{-\\lambda x},\\quad E[X]=\\frac{1}{\\lambda}", description: "Continuous memoryless distribution.", example: "Time between Poisson events" },
  { category: "Distributions", title: "Normal", latex: "f(x)=\\frac{1}{\\sigma\\sqrt{2\\pi}}e^{-\\frac{(x-\\mu)^2}{2\\sigma^2}}", description: "Bell curve. Central Limit Theorem limit." },

  // Random Walks & Gambler's Ruin
  { category: "Random Walks", title: "Gambler's Ruin (fair)", latex: "P(\\text{ruin from }i) = 1 - \\frac{i}{N}", description: "Start at i, absorb at 0 or N. Fair coin." },
  { category: "Random Walks", title: "Gambler's Ruin (unfair)", latex: "P(\\text{win}) = \\frac{1-(q/p)^i}{1-(q/p)^N}", description: "p ≠ 0.5, start at i, target N." },
  { category: "Random Walks", title: "Expected Duration (fair)", latex: "E[T] = i(N-i)", description: "Expected steps in Gambler's Ruin.", example: "Start at 1, target N: E[T]=N-1" },

  // Stopping Problems
  { category: "Stopping", title: "Secretary Problem (Optimal)", latex: "\\text{Cutoff} = \\lfloor N/e \\rfloor", description: "Observe and reject first N/e candidates, then take next best. P(best) → 1/e." },
  { category: "Stopping", title: "Optimal Stopping (Uniform)", latex: "E[\\max] = \\frac{n}{n+1}", description: "Expected maximum of n Uniform[0,1] samples." },

  // Geometric Probability
  { category: "Geometric", title: "Buffon's Needle", latex: "P = \\frac{2L}{\\pi d}", description: "Needle of length L, gap d: probability of crossing a line." },
  { category: "Geometric", title: "Bertrand's Chord (Method 3)", latex: "P = \\frac{1}{3}", description: "Random chord longer than inscribed triangle side.", example: "Result depends on method!" },

  // Finance / Game Theory
  { category: "Finance", title: "Kelly Criterion", latex: "f^* = \\frac{p(b+1)-1}{b} = \\frac{p \\cdot b - q}{b}", description: "Optimal fraction of bankroll to bet. p=win prob, b=net odds.", example: "Maximizes long-run log wealth" },
  { category: "Finance", title: "Risk-Neutral Pricing", latex: "V_0 = e^{-rT}E^Q[V_T]", description: "Price = discounted expectation under risk-neutral measure Q." },
  { category: "Finance", title: "Put-Call Parity", latex: "C - P = S_0 - Ke^{-rT}", description: "No-arbitrage relation between calls and puts." },

  // Inequalities & Limits
  { category: "Inequalities", title: "Markov's Inequality", latex: "P(X \\geq a) \\leq \\frac{E[X]}{a}", description: "Non-negative X, a > 0." },
  { category: "Inequalities", title: "Chebyshev's Inequality", latex: "P(|X-\\mu| \\geq k\\sigma) \\leq \\frac{1}{k^2}", description: "Bounds probability of deviation from mean." },
  { category: "Inequalities", title: "Jensen's Inequality", latex: "E[f(X)] \\geq f(E[X]) \\text{ if } f \\text{ convex}", description: "Convex functions — expected value of function ≥ function of expected value." },
  { category: "Inequalities", title: "Law of Large Numbers", latex: "\\bar{X}_n \\xrightarrow{p} \\mu \\text{ as } n\\to\\infty", description: "Sample mean converges to true mean." },
  { category: "Inequalities", title: "Central Limit Theorem", latex: "\\frac{\\sqrt{n}(\\bar{X}_n - \\mu)}{\\sigma} \\xrightarrow{d} N(0,1)", description: "Normalized sum converges to normal." },
];

const CATEGORIES = [...new Set(FORMULAS.map(f => f.category))];

export default function CheatsheetPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [copied, setCopied] = useState<string | null>(null);

  const filtered = activeCategory === "All"
    ? FORMULAS
    : FORMULAS.filter(f => f.category === activeCategory);

  function copyLatex(latex: string) {
    navigator.clipboard.writeText(latex);
    setCopied(latex);
    setTimeout(() => setCopied(null), 1500);
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <BookOpen size={20} style={{ color: "var(--accent)" }} />
          <h1 className="text-2xl font-bold" style={{ fontFamily: "DM Serif Display, serif", color: "var(--text)" }}>
            Formula Cheat Sheet
          </h1>
        </div>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          All key probability, statistics, and finance formulas — click any formula to copy LaTeX
        </p>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setActiveCategory("All")}
          className="px-3 py-1.5 rounded-xl text-xs font-medium transition-all"
          style={{
            background: activeCategory === "All" ? "var(--accent)" : "var(--surface-2)",
            color: activeCategory === "All" ? "white" : "var(--text-muted)",
            border: `1px solid ${activeCategory === "All" ? "var(--accent)" : "var(--border)"}`,
          }}
        >
          All ({FORMULAS.length})
        </button>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className="px-3 py-1.5 rounded-xl text-xs font-medium transition-all"
            style={{
              background: activeCategory === cat ? "var(--accent)" : "var(--surface-2)",
              color: activeCategory === cat ? "white" : "var(--text-muted)",
              border: `1px solid ${activeCategory === cat ? "var(--accent)" : "var(--border)"}`,
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {filtered.map((f, i) => (
          <div
            key={i}
            className="rounded-2xl p-5 group"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-medium mr-2"
                  style={{ background: "var(--accent-light)", color: "var(--accent)" }}
                >
                  {f.category}
                </span>
                <span className="text-sm font-semibold" style={{ color: "var(--text)" }}>{f.title}</span>
              </div>
              <button
                onClick={() => copyLatex(f.latex)}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg"
                style={{ color: "var(--text-muted)", background: "var(--surface-2)" }}
                title="Copy LaTeX"
              >
                {copied === f.latex ? <Check size={13} color="#16a34a" /> : <Copy size={13} />}
              </button>
            </div>

            <div
              className="px-4 py-3 rounded-xl mb-3 overflow-x-auto cursor-pointer"
              style={{ background: "var(--surface-2)" }}
              onClick={() => copyLatex(f.latex)}
            >
              <BlockMath math={f.latex} />
            </div>

            <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>{f.description}</p>
            {f.example && (
              <p className="text-xs mt-1 font-medium" style={{ color: "var(--accent)" }}>
                e.g. {f.example}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
