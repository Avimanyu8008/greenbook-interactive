import { useState } from "react";
import { ExternalLink, PlayCircle, BookOpen, GitFork, FileText, Search } from "lucide-react";

interface Resource {
  title: string;
  description: string;
  url: string;
  type: "youtube" | "book" | "github" | "article" | "course";
  tags: string[];
  free: boolean;
}

const RESOURCES: Resource[] = [
  // ── Books / PDFs ──────────────────────────────────────────────────
  {
    title: "A Practical Guide to Quant Finance Interviews",
    description: "The GreenBook itself. Essential probability, brainteasers, statistics, and finance questions with full solutions.",
    url: "https://www.amazon.com/Practical-Guide-Quantitative-Finance-Interviews/dp/1438236662",
    type: "book",
    tags: ["probability", "brainteasers", "must-read"],
    free: false,
  },
  {
    title: "Paul Wilmott on Quantitative Finance",
    description: "Comprehensive 3-volume reference on derivatives pricing, stochastic calculus, and numerical methods.",
    url: "https://www.wiley.com/en-us/Paul+Wilmott+on+Quantitative+Finance-p-9780470018705",
    type: "book",
    tags: ["derivatives", "stochastic calculus", "pricing"],
    free: false,
  },
  {
    title: "Options, Futures, and Other Derivatives — Hull",
    description: "The definitive textbook on derivatives. Covers forwards, futures, options, swaps, and risk management.",
    url: "https://www.pearson.com/en-us/subject-catalog/p/options-futures-and-other-derivatives/P200000005938",
    type: "book",
    tags: ["derivatives", "options", "futures"],
    free: false,
  },
  {
    title: "Statistical Inference — Casella & Berger (PDF)",
    description: "Foundational graduate-level statistics text. Probability theory, distributions, hypothesis testing, MLE.",
    url: "https://archive.org/details/statistical-inference-casella-berger",
    type: "book",
    tags: ["statistics", "probability theory", "MLE"],
    free: true,
  },
  {
    title: "Mathematics for Finance — Capiński & Zastawniak",
    description: "Concise introduction to mathematical finance: portfolio theory, options, interest rates.",
    url: "https://link.springer.com/book/10.1007/978-1-85233-330-0",
    type: "book",
    tags: ["portfolio theory", "options", "interest rates"],
    free: false,
  },
  {
    title: "Fifty Challenging Problems in Probability",
    description: "Frederick Mosteller's classic. 50 beautifully stated problems that sharpen probabilistic reasoning.",
    url: "https://www.amazon.com/Challenging-Problems-Probability-Solutions-Mathematics/dp/0486653552",
    type: "book",
    tags: ["probability", "puzzles", "classic"],
    free: false,
  },
  {
    title: "Introduction to Probability — Blitzstein & Hwang (free)",
    description: "Harvard's STAT 110 textbook. Exceptionally clear — conditional probability, distributions, limit theorems.",
    url: "https://projects.iq.harvard.edu/stat110/home",
    type: "book",
    tags: ["probability", "distributions", "beginner-friendly"],
    free: true,
  },

  // ── YouTube Channels ─────────────────────────────────────────────
  {
    title: "3Blue1Brown",
    description: "Visual math explanations — linear algebra, calculus, statistics. Makes abstract ideas click instantly.",
    url: "https://www.youtube.com/@3blue1brown",
    type: "youtube",
    tags: ["linear algebra", "calculus", "visualization"],
    free: true,
  },
  {
    title: "MIT OpenCourseWare — 18.650 Statistics for Applications",
    description: "Full MIT lecture series on statistics: estimation, hypothesis testing, regression, Bayesian methods.",
    url: "https://www.youtube.com/playlist?list=PLUl4u3cNGP60uVBMaoNERc6knT_MgPKS0",
    type: "youtube",
    tags: ["statistics", "regression", "Bayesian"],
    free: true,
  },
  {
    title: "StatQuest with Josh Starmer",
    description: "Exceptionally clear explanations of stats and ML: p-values, distributions, PCA, GLMs — no jargon.",
    url: "https://www.youtube.com/@statquest",
    type: "youtube",
    tags: ["statistics", "machine learning", "beginner-friendly"],
    free: true,
  },
  {
    title: "Quantitative Finance & Algo Trading — QuantPy",
    description: "Python-based channel covering portfolio optimization, options pricing, backtesting, factor models.",
    url: "https://www.youtube.com/@QuantPy",
    type: "youtube",
    tags: ["Python", "algo trading", "portfolio"],
    free: true,
  },
  {
    title: "MIT 6.041 Probabilistic Systems Analysis",
    description: "John Tsitsiklis's full lecture series. Rigorous probability from first principles — transforms, Markov chains.",
    url: "https://www.youtube.com/playlist?list=PLUl4u3cNGP61MdtwGTqZA0MreSeDybji2",
    type: "youtube",
    tags: ["probability", "Markov chains", "MIT"],
    free: true,
  },
  {
    title: "Numberphile",
    description: "Fun, accessible math videos — combinatorics, number theory, probability puzzles with world-class mathematicians.",
    url: "https://www.youtube.com/@numberphile",
    type: "youtube",
    tags: ["combinatorics", "puzzles", "recreational math"],
    free: true,
  },

  // ── GitHub Repos ─────────────────────────────────────────────────
  {
    title: "awesome-quant",
    description: "Curated list of quant libraries, data sources, trading frameworks, papers, and books.",
    url: "https://github.com/wilsonfreitas/awesome-quant",
    type: "github",
    tags: ["libraries", "data", "trading"],
    free: true,
  },
  {
    title: "quantlib",
    description: "Industry-standard C++ library for pricing derivatives, fixed income, risk management. Python bindings available.",
    url: "https://github.com/lballabio/QuantLib",
    type: "github",
    tags: ["derivatives pricing", "C++", "risk"],
    free: true,
  },
  {
    title: "zipline-reloaded",
    description: "Pythonic algorithmic trading simulator. Backtesting engine originally from Quantopian, now community-maintained.",
    url: "https://github.com/stefan-jansen/zipline-reloaded",
    type: "github",
    tags: ["backtesting", "Python", "algo trading"],
    free: true,
  },
  {
    title: "financial-machine-learning (MLFinLab)",
    description: "Implements Advances in Financial Machine Learning by Marcos Lopez de Prado: bars, labeling, features.",
    url: "https://github.com/hudson-and-thames/mlfinlab",
    type: "github",
    tags: ["machine learning", "features", "advanced"],
    free: true,
  },
  {
    title: "Quant Interview Problems — GitHub Collection",
    description: "Community-compiled quant interview questions and solutions across probability, stats, and mental math.",
    url: "https://github.com/topics/quant-interview",
    type: "github",
    tags: ["interview prep", "probability", "mental math"],
    free: true,
  },
  {
    title: "riskfolio-lib",
    description: "Portfolio optimization library: mean-variance, CVaR, risk parity, hierarchical risk parity, factor models.",
    url: "https://github.com/dcajasn/Riskfolio-Lib",
    type: "github",
    tags: ["portfolio optimization", "Python", "risk parity"],
    free: true,
  },

  // ── Articles / Blogs ─────────────────────────────────────────────
  {
    title: "Quantitative Research Notes — Quant Stack Exchange",
    description: "Deep Q&A on derivatives, stochastic calculus, and quant methods. Search for any specific topic.",
    url: "https://quant.stackexchange.com",
    type: "article",
    tags: ["derivatives", "stochastic calculus", "Q&A"],
    free: true,
  },
  {
    title: "Breaking Into Wall Street — Quant Blog",
    description: "Career-oriented articles on quant roles, networking, resume tips, and interview strategy.",
    url: "https://breakingintowallstreet.com",
    type: "article",
    tags: ["career", "interview strategy", "roles"],
    free: false,
  },
  {
    title: "Wilmott Forums",
    description: "The oldest and most active quant community online. Deep technical discussions on all aspects of quant finance.",
    url: "https://forum.wilmott.com",
    type: "article",
    tags: ["community", "derivatives", "advanced"],
    free: true,
  },
  {
    title: "QuantLib Notebooks — Luigi Ballabio",
    description: "Jupyter notebooks demonstrating QuantLib for options pricing, term structures, and credit derivatives.",
    url: "https://www.implementingquantlib.com/p/blog-page.html",
    type: "article",
    tags: ["QuantLib", "options", "Python"],
    free: true,
  },
  {
    title: "Towards Data Science — Quantitative Finance",
    description: "Practical articles on quant topics: Black-Scholes, Monte Carlo, pairs trading, volatility surface construction.",
    url: "https://towardsdatascience.com/tagged/quantitative-finance",
    type: "article",
    tags: ["Monte Carlo", "options", "volatility"],
    free: true,
  },

  // ── Courses ───────────────────────────────────────────────────────
  {
    title: "STAT 110: Probability — Harvard (Free)",
    description: "Joe Blitzstein's legendary Harvard probability course. Full lectures, problem sets, and the textbook are free.",
    url: "https://projects.iq.harvard.edu/stat110/home",
    type: "course",
    tags: ["probability", "Harvard", "free"],
    free: true,
  },
  {
    title: "Introduction to Computational Finance — Coursera",
    description: "Covers time series, regression, portfolio optimization, and risk management with R.",
    url: "https://www.coursera.org/learn/computational-finance",
    type: "course",
    tags: ["computational finance", "R", "portfolio"],
    free: false,
  },
  {
    title: "Python for Finance — Yves Hilpisch",
    description: "Comprehensive online course on Python for quant finance: NumPy, pandas, derivatives, AI/ML strategies.",
    url: "https://home.tpq.io",
    type: "course",
    tags: ["Python", "derivatives", "ML"],
    free: false,
  },
];

const TYPE_META: Record<Resource["type"], { label: string; icon: typeof Youtube; color: string }> = {
  youtube: { label: "YouTube", icon: PlayCircle, color: "#dc2626" },
  book: { label: "Book", icon: BookOpen, color: "var(--accent)" },
  github: { label: "GitHub", icon: GitFork, color: "var(--text)" },
  article: { label: "Article / Blog", icon: FileText, color: "#7c3aed" },
  course: { label: "Course", icon: BookOpen, color: "#d97706" },
};

const SECTIONS = [
  { key: "book", title: "Books & References" },
  { key: "youtube", title: "YouTube Channels" },
  { key: "github", title: "GitHub Repositories" },
  { key: "article", title: "Articles & Blogs" },
  { key: "course", title: "Online Courses" },
] as const;

export default function ResourcesPage() {
  const [query, setQuery] = useState("");
  const [freeOnly, setFreeOnly] = useState(false);

  const filtered = RESOURCES.filter(r => {
    if (freeOnly && !r.free) return false;
    if (query) {
      const q = query.toLowerCase();
      return (
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1
          className="text-4xl font-bold mb-1"
          style={{ fontFamily: "DM Serif Display, serif", color: "var(--text)" }}
        >
          Resources
        </h1>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Curated books, courses, channels, and repos for quant dev, researcher, and engineer roles
        </p>
      </div>

      {/* Search + filter */}
      <div className="flex gap-3 mb-8">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
          <input
            type="text"
            placeholder="Search resources…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border outline-none"
            style={{ borderColor: "var(--border)", background: "var(--surface)", color: "var(--text)" }}
          />
        </div>
        <button
          onClick={() => setFreeOnly(!freeOnly)}
          className="px-4 py-2 rounded-xl text-sm font-medium border transition-colors"
          style={{
            background: freeOnly ? "var(--accent-light)" : "var(--surface)",
            borderColor: freeOnly ? "var(--accent)" : "var(--border)",
            color: freeOnly ? "var(--accent)" : "var(--text-muted)",
          }}
        >
          Free only
        </button>
      </div>

      {/* Sections */}
      {SECTIONS.map(({ key, title }) => {
        const items = filtered.filter(r => r.type === key);
        if (items.length === 0) return null;
        const meta = TYPE_META[key];
        const Icon = meta.icon;

        return (
          <div key={key} className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <Icon size={18} style={{ color: meta.color }} />
              <h2
                className="text-xl font-semibold"
                style={{ fontFamily: "DM Serif Display, serif", color: "var(--text)" }}
              >
                {title}
              </h2>
              <span
                className="text-xs px-2 py-0.5 rounded-full font-medium ml-1"
                style={{ background: "var(--surface-2)", color: "var(--text-muted)" }}
              >
                {items.length}
              </span>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              {items.map(r => (
                <a
                  key={r.url}
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-xl border p-4 transition-all group hover:border-[var(--accent)]"
                  style={{ background: "var(--surface)", borderColor: "var(--border)" }}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3
                      className="text-sm font-semibold group-hover:text-[var(--accent)] transition-colors leading-snug"
                      style={{ color: "var(--text)" }}
                    >
                      {r.title}
                    </h3>
                    <ExternalLink size={13} className="flex-shrink-0 mt-0.5 opacity-40 group-hover:opacity-100 transition-opacity" style={{ color: "var(--accent)" }} />
                  </div>
                  <p className="text-xs mb-3 leading-relaxed" style={{ color: "var(--text-muted)" }}>
                    {r.description}
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    {r.tags.slice(0, 3).map(tag => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{ background: "var(--tag-bg)", color: "var(--tag-text)" }}
                      >
                        {tag}
                      </span>
                    ))}
                    {r.free ? (
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-medium ml-auto"
                        style={{ background: "#e8f4eb", color: "var(--easy)" }}
                      >
                        Free
                      </span>
                    ) : (
                      <span
                        className="text-xs px-2 py-0.5 rounded-full ml-auto"
                        style={{ background: "var(--surface-2)", color: "var(--text-muted)" }}
                      >
                        Paid
                      </span>
                    )}
                  </div>
                </a>
              ))}
            </div>
          </div>
        );
      })}

      {filtered.length === 0 && (
        <div className="text-center py-16" style={{ color: "var(--text-muted)" }}>
          <p className="text-lg mb-1">No resources match your search.</p>
          <p className="text-sm">Try different keywords or clear the filter.</p>
        </div>
      )}
    </div>
  );
}
