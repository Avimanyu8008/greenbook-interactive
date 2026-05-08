import { useState } from "react";
import { ChevronDown, ChevronUp, Lightbulb, Target, Brain } from "lucide-react";

interface FermiProblem {
  id: string;
  question: string;
  hint: string;
  answer: string;
  range: { low: string; mid: string; high: string };
  approach: string[];
  difficulty: "Easy" | "Medium" | "Hard";
  tags: string[];
}

const FERMI_PROBLEMS: FermiProblem[] = [
  {
    id: "f01",
    question: "How many piano tuners are there in Chicago?",
    hint: "Think about how often pianos need tuning and how long it takes per piano.",
    answer: "~225 piano tuners",
    range: { low: "100", mid: "225", high: "350" },
    approach: [
      "Chicago population: ~2.7 million → ~1 million households",
      "Piano ownership rate: ~1 in 20 households = 50,000 pianos",
      "Tuning frequency: once or twice per year → ~75,000 tunings/year",
      "Tuner capacity: 4 pianos/day × 250 days = 1,000 pianos/year per tuner",
      "75,000 / 1,000 ≈ 75 tuners (add commercial/institutional: ×3) → ~225",
    ],
    difficulty: "Easy",
    tags: ["classic", "market sizing"],
  },
  {
    id: "f02",
    question: "How many golf balls fit in a Boeing 747?",
    hint: "Estimate the usable interior volume and subtract for passenger space.",
    answer: "~31 million golf balls",
    range: { low: "20M", mid: "31M", high: "50M" },
    approach: [
      "747 interior volume: ~876 m³ (cabin + cargo hold)",
      "Golf ball volume: diameter 4.27 cm → V = (4/3)π(2.135cm)³ ≈ 40.7 cm³",
      "Packing efficiency (random sphere packing): ~64%",
      "876 m³ × 0.64 / 40.7 cm³ = 876 × 10⁶ cm³ × 0.64 / 40.7 ≈ 13.8 million ... but full fuselage (876 m³) gives ~31 million.",
      "876,000,000 cm³ × 0.64 / 40.7 cm³ ≈ 13.8M net; total with cargo hold ≈ 31M",
    ],
    difficulty: "Easy",
    tags: ["classic", "volume estimation"],
  },
  {
    id: "f03",
    question: "How many seconds would it take to count to 1 billion out loud?",
    hint: "How long does it take to say a number? Does it scale linearly?",
    answer: "~95 years",
    range: { low: "70 years", mid: "95 years", high: "120 years" },
    approach: [
      "Average time to say a number: ~0.5 seconds for small numbers, ~2s for large ones",
      "Numbers 1–999,999: avg ~1 second each → 1,000,000 × 1s = 11.6 days",
      "Numbers 1M–999M: avg ~3 seconds (three hundred forty-two million…) → 999M × 3s",
      "Total ≈ 3 billion seconds / (3600 × 24 × 365) ≈ 95 years",
    ],
    difficulty: "Easy",
    tags: ["time", "arithmetic"],
  },
  {
    id: "f04",
    question: "How many active satellites are currently orbiting Earth?",
    hint: "Think about commercial, government, and military satellites.",
    answer: "~7,000–9,000 active satellites",
    range: { low: "5,000", mid: "8,000", high: "12,000" },
    approach: [
      "SpaceX Starlink alone: ~5,000+ satellites (rapidly growing)",
      "OneWeb, Amazon Kuiper: ~800 combined",
      "Traditional commercial/government/military: ~1,000–2,000",
      "As of 2024: ~8,000 active. Total objects in orbit (debris included): ~45,000",
    ],
    difficulty: "Easy",
    tags: ["space", "current events"],
  },
  {
    id: "f05",
    question: "Estimate the total number of words in all books ever written.",
    hint: "How many books have been published throughout history? How long is a typical book?",
    answer: "~100 trillion words",
    range: { low: "10T", mid: "100T", high: "1Q" },
    approach: [
      "Books ever published: ~130 million (Google estimate)",
      "Average words per book: ~70,000",
      "130 million × 70,000 ≈ 9 trillion words",
      "But many historical books are lost; surviving manuscript copies add ~10× → ~100 trillion",
    ],
    difficulty: "Medium",
    tags: ["literature", "scale"],
  },
  {
    id: "f06",
    question: "What is the total market cap of all publicly listed companies in the world?",
    hint: "Think about the US market (you know the S&P 500 well) and then extrapolate globally.",
    answer: "~$110 trillion",
    range: { low: "$80T", mid: "$110T", high: "$130T" },
    approach: [
      "US stock market cap: ~$50T (late 2024)",
      "US is ~40% of global market cap",
      "$50T / 0.40 ≈ $125T — but some double-counting from ADRs",
      "World Federation of Exchanges: ~$109T as of 2024",
    ],
    difficulty: "Medium",
    tags: ["finance", "markets"],
  },
  {
    id: "f07",
    question: "How many times does the average person's heart beat in a lifetime?",
    hint: "Heart rate and lifespan are the key inputs.",
    answer: "~3 billion beats",
    range: { low: "2.5B", mid: "3B", high: "3.5B" },
    approach: [
      "Resting heart rate: ~70 bpm",
      "Average lifespan: 72 years",
      "70 × 60 min × 24 hr × 365 days × 72 years",
      "= 70 × 525,600 min/yr × 72 = 70 × 37,843,200 ≈ 2.65 billion",
      "Exercise/higher resting rate pushes it above 3 billion",
    ],
    difficulty: "Easy",
    tags: ["biology", "arithmetic"],
  },
  {
    id: "f08",
    question: "Estimate the number of transactions processed by Visa globally per day.",
    hint: "You know global card spend approximately. Divide by average ticket size.",
    answer: "~800 million transactions/day",
    range: { low: "500M", mid: "800M", high: "1.2B" },
    approach: [
      "Visa annual volume: ~$15 trillion in transactions",
      "Average transaction: ~$50",
      "$15T / $50 = 300 billion transactions/year",
      "300B / 365 ≈ 820 million/day",
      "Visa's reported figure (2024): ~850M per day ✓",
    ],
    difficulty: "Medium",
    tags: ["finance", "payments", "market sizing"],
  },
  {
    id: "f09",
    question: "How many gas stations are there in the United States?",
    hint: "Think per-capita car ownership and how frequently people fill up.",
    answer: "~145,000",
    range: { low: "100,000", mid: "145,000", high: "200,000" },
    approach: [
      "~280 million registered vehicles in the US",
      "Average fill-up: once per week → 280M / 7 = 40M fill-ups per day",
      "Pumps per station: ~8 active pumps, ~12 vehicles/pump/day → 96 cars/station/day",
      "40M / 96 ≈ 415,000 — but stations handle peak periods; actual ~145,000",
      "Actual US figure: ~145,000 stations (EIA data)",
    ],
    difficulty: "Medium",
    tags: ["market sizing", "logistics"],
  },
  {
    id: "f10",
    question: "Estimate the total value of gold ever mined in human history.",
    hint: "How much gold has been mined? What is the current price?",
    answer: "~$13 trillion",
    range: { low: "$10T", mid: "$13T", high: "$16T" },
    approach: [
      "Total gold ever mined: ~205,000 metric tons (World Gold Council)",
      "Gold price: ~$2,000/troy oz (2024 baseline)",
      "1 metric ton = 32,150 troy oz",
      "205,000 × 32,150 × $2,000 = 205,000 × $64.3M ≈ $13.2 trillion",
    ],
    difficulty: "Medium",
    tags: ["commodities", "finance", "history"],
  },
  {
    id: "f11",
    question: "How many unique IP addresses does Google's infrastructure use?",
    hint: "Google serves ~8 billion queries/day. Think about load balancing and server density.",
    answer: "~1–4 million IPs",
    range: { low: "500K", mid: "2M", high: "5M" },
    approach: [
      "Google has ~21 data centers globally + edge nodes",
      "Estimated servers: 2–3 million",
      "Each server may use 1–2 IPs; load balancers, CDN nodes, transit each consume blocks",
      "Google owns /8 blocks (16M IPs each) — they hold ~8.5 million routable IPs",
      "Actively used: conservatively 1–4 million",
    ],
    difficulty: "Hard",
    tags: ["tech", "infrastructure", "market sizing"],
  },
  {
    id: "f12",
    question: "What is the total amount of data stored digitally on Earth (in bytes)?",
    hint: "Think about data centers, personal devices, and IoT.",
    answer: "~120 zettabytes",
    range: { low: "60 ZB", mid: "120 ZB", high: "200 ZB" },
    approach: [
      "Seagate/IDC estimate global datasphere (2023): ~120 ZB installed storage",
      "Consumer devices: 5B smartphones × 128GB avg = 640 EB",
      "Data centers: ~1,000 hyperscale + millions of enterprise = ~40 ZB usable",
      "IoT devices, tapes, legacy: another ~10 ZB",
      "Total installed (not all used): ~120 ZB = 1.2 × 10²³ bytes",
    ],
    difficulty: "Hard",
    tags: ["tech", "data", "scale"],
  },
  {
    id: "f13",
    question: "Estimate the probability that two people in a room of 23 share a birthday.",
    hint: "This is a famous problem — use the complement approach.",
    answer: "~50.7%",
    range: { low: "48%", mid: "50.7%", high: "53%" },
    approach: [
      "P(no shared birthday among 23) = (365/365) × (364/365) × … × (343/365)",
      "= 365! / (342! × 365²³)",
      "≈ e^{-23×22/(2×365)} = e^{-0.693} ≈ 0.50",
      "P(at least one match) = 1 - 0.493 ≈ 50.7%",
      "Famous result: you only need 23 people for >50% chance of shared birthday",
    ],
    difficulty: "Easy",
    tags: ["probability", "birthday problem", "classic"],
  },
  {
    id: "f14",
    question: "How much would it cost to print the entire English Wikipedia?",
    hint: "Estimate total article word count, then compute pages and printing cost.",
    answer: "~$500,000–$2M",
    range: { low: "$300K", mid: "$1M", high: "$2M" },
    approach: [
      "English Wikipedia: ~6.7 million articles",
      "Average article: ~1,000 words → 6.7 billion words total",
      "Words per printed page: ~500 → 13.4 million pages",
      "Print cost (office printing): $0.05–0.10/page → $670K–$1.34M",
      "Paper cost: ~13,400 reams × $5 = $67,000 (included in above)",
      "Total with binding/overhead: ~$1M–$2M",
    ],
    difficulty: "Medium",
    tags: ["cost estimation", "scale", "tech"],
  },
  {
    id: "f15",
    question: "What fraction of all energy produced on Earth is consumed by data centers?",
    hint: "Global electricity production is ~28,000 TWh/year. Estimate data center draw.",
    answer: "~1–2% of global electricity",
    range: { low: "0.8%", mid: "1.5%", high: "3%" },
    approach: [
      "Global electricity: ~28,000 TWh/year",
      "Global data center energy (2023, IEA): ~250–340 TWh/year",
      "340 / 28,000 ≈ 1.2%",
      "AI/crypto workloads are rapidly growing this share",
      "Projected to reach 3–4% by 2030",
    ],
    difficulty: "Hard",
    tags: ["energy", "tech", "environment"],
  },
];

const DIFF_COLORS: Record<string, string> = {
  Easy: "var(--easy)",
  Medium: "var(--medium)",
  Hard: "var(--hard)",
};

function FermiCard({ p }: { p: FermiProblem }) {
  const [showHint, setShowHint] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  return (
    <div
      className="rounded-xl border overflow-hidden transition-all"
      style={{ background: "var(--surface)", borderColor: "var(--border)" }}
    >
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <p
            className="text-sm font-semibold leading-snug flex-1"
            style={{ color: "var(--text)", fontFamily: "DM Serif Display, serif", fontSize: "1rem" }}
          >
            {p.question}
          </p>
          <span
            className="text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0"
            style={{ background: `${DIFF_COLORS[p.difficulty]}18`, color: DIFF_COLORS[p.difficulty] }}
          >
            {p.difficulty}
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {p.tags.map(tag => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded-full"
              style={{ background: "var(--tag-bg)", color: "var(--tag-text)" }}
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowHint(!showHint)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors"
            style={{
              borderColor: "var(--border)",
              background: showHint ? "var(--accent-light)" : "var(--surface-2)",
              color: showHint ? "var(--accent)" : "var(--text-muted)",
            }}
          >
            <Lightbulb size={12} />
            {showHint ? "Hide hint" : "Hint"}
          </button>
          <button
            onClick={() => setShowAnswer(!showAnswer)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
            style={{
              background: showAnswer ? "var(--accent)" : "var(--surface-2)",
              color: showAnswer ? "white" : "var(--text-muted)",
            }}
          >
            {showAnswer ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            {showAnswer ? "Hide answer" : "Show answer"}
          </button>
        </div>

        {showHint && (
          <div
            className="mt-3 px-3 py-2.5 rounded-lg text-xs leading-relaxed"
            style={{ background: "var(--accent-light)", color: "var(--accent)" }}
          >
            <span className="font-semibold">Hint: </span>{p.hint}
          </div>
        )}
      </div>

      {showAnswer && (
        <div
          className="border-t px-5 py-4"
          style={{ borderColor: "var(--border)", background: "var(--surface-2)" }}
        >
          {/* Range */}
          <div className="flex gap-3 mb-4">
            {[
              { label: "Low", val: p.range.low, color: "var(--easy)" },
              { label: "Mid", val: p.range.mid, color: "var(--accent)" },
              { label: "High", val: p.range.high, color: "var(--medium)" },
            ].map(({ label, val, color }) => (
              <div
                key={label}
                className="flex-1 rounded-lg px-3 py-2 text-center border"
                style={{ borderColor: "var(--border)", background: "var(--surface)" }}
              >
                <div className="text-xs mb-0.5" style={{ color: "var(--text-muted)" }}>{label}</div>
                <div className="text-sm font-bold font-mono" style={{ color }}>{val}</div>
              </div>
            ))}
          </div>

          <div
            className="text-xs font-semibold mb-2"
            style={{ color: "var(--accent)" }}
          >
            Best estimate: {p.answer}
          </div>

          {/* Approach */}
          <div>
            <div className="text-xs font-semibold mb-2" style={{ color: "var(--text-muted)" }}>
              Step-by-step approach:
            </div>
            <ol className="space-y-1.5">
              {p.approach.map((step, i) => (
                <li key={i} className="flex gap-2 text-xs" style={{ color: "var(--text)" }}>
                  <span
                    className="flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold text-white mt-0.5"
                    style={{ background: "var(--accent)" }}
                  >
                    {i + 1}
                  </span>
                  <span className="leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}

export default function FermiPage() {
  const [difficulty, setDifficulty] = useState<"All" | "Easy" | "Medium" | "Hard">("All");

  const filtered = FERMI_PROBLEMS.filter(p => difficulty === "All" || p.difficulty === difficulty);

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Brain size={24} style={{ color: "var(--accent)" }} />
          <h1
            className="text-4xl font-bold"
            style={{ fontFamily: "DM Serif Display, serif", color: "var(--text)" }}
          >
            Fermi Estimation
          </h1>
        </div>
        <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>
          Order-of-magnitude thinking. Common in Jane Street, Optiver, and Two Sigma interviews.
        </p>

        <div
          className="rounded-xl border p-4 mb-6 text-sm"
          style={{ background: "var(--accent-light)", borderColor: "var(--accent)" }}
        >
          <div className="flex items-start gap-2">
            <Target size={15} className="mt-0.5 flex-shrink-0" style={{ color: "var(--accent)" }} />
            <div style={{ color: "var(--accent)" }}>
              <strong>The goal:</strong> Arrive at a reasonable estimate within 1–2 orders of magnitude using simple decomposition.
              Break the problem into factors you can estimate separately, then multiply through.
              Interviewers care about <em>your reasoning process</em>, not the exact number.
            </div>
          </div>
        </div>

        {/* Difficulty filter */}
        <div className="flex gap-2">
          {(["All", "Easy", "Medium", "Hard"] as const).map(d => (
            <button
              key={d}
              onClick={() => setDifficulty(d)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors"
              style={{
                background: difficulty === d
                  ? d === "All" ? "var(--accent)" : `${DIFF_COLORS[d]}18`
                  : "var(--surface)",
                borderColor: difficulty === d
                  ? d === "All" ? "var(--accent)" : DIFF_COLORS[d]
                  : "var(--border)",
                color: difficulty === d
                  ? d === "All" ? "white" : DIFF_COLORS[d]
                  : "var(--text-muted)",
              }}
            >
              {d} {d !== "All" && `(${FERMI_PROBLEMS.filter(p => p.difficulty === d).length})`}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filtered.map(p => (
          <FermiCard key={p.id} p={p} />
        ))}
      </div>
    </div>
  );
}
