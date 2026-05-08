import { useState } from "react";
import { Link } from "wouter";
import { Trophy, Flame, Bookmark, BarChart2, ArrowRight, Calendar } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";
import { PROBLEMS } from "../data/problems";
import { loadProgress, getStats } from "../lib/progress";

export default function StatsPage() {
  const [store] = useState(loadProgress());
  const stats = getStats(store, PROBLEMS.length);

  const byDiff = ["Easy", "Medium", "Hard"].map(d => {
    const total = PROBLEMS.filter(p => p.difficulty === d).length;
    const solved = PROBLEMS.filter(p => p.difficulty === d && store.problems[p.id]?.solved).length;
    return { name: d, solved, total, pct: total > 0 ? Math.round((solved / total) * 100) : 0 };
  });

  const byCat = PROBLEMS.reduce<Record<string, { total: number; solved: number }>>((acc, p) => {
    if (!acc[p.category]) acc[p.category] = { total: 0, solved: 0 };
    acc[p.category].total++;
    if (store.problems[p.id]?.solved) acc[p.category].solved++;
    return acc;
  }, {});

  const catData = Object.entries(byCat).map(([name, { total, solved }]) => ({
    name: name.split(" ").slice(0, 2).join(" "),
    solved,
    remaining: total - solved,
  }));

  // Build 90-day activity heatmap
  const today = new Date();
  const days90: { date: string; count: number }[] = [];
  for (let i = 89; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    days90.push({ date: dateStr, count: 0 });
  }
  Object.values(store.problems).forEach(p => {
    if (p.solved && p.lastAttempt) {
      const dateStr = new Date(p.lastAttempt).toISOString().slice(0, 10);
      const entry = days90.find(d => d.date === dateStr);
      if (entry) entry.count++;
    }
  });
  const maxCount = Math.max(...days90.map(d => d.count), 1);

  const recentSolved = PROBLEMS.filter(p => store.problems[p.id]?.solved)
    .sort((a, b) => (store.problems[b.id]?.lastAttempt ?? 0) - (store.problems[a.id]?.lastAttempt ?? 0))
    .slice(0, 5);

  const diffColors: Record<string, string> = {
    Easy: "var(--easy)", Medium: "var(--medium)", Hard: "var(--hard)",
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <h1
        className="text-4xl font-bold mb-1"
        style={{ fontFamily: "DM Serif Display, serif", color: "var(--text)" }}
      >
        My Stats
      </h1>
      <p className="text-sm mb-8" style={{ color: "var(--text-muted)" }}>
        Your progress across all GreenBook problems
      </p>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { icon: Trophy, label: "Solved", value: stats.solved, sub: `of ${stats.total}`, color: "var(--accent)" },
          { icon: Flame, label: "Streak", value: stats.streak, sub: "days", color: "#d97706" },
          { icon: Bookmark, label: "Bookmarked", value: stats.bookmarked, sub: "problems", color: "#6366f1" },
          { icon: BarChart2, label: "Completion", value: `${stats.pct}%`, sub: "overall", color: "var(--accent)" },
        ].map(({ icon: Icon, label, value, sub, color }) => (
          <div
            key={label}
            className="rounded-xl border p-4"
            style={{ background: "var(--surface)", borderColor: "var(--border)" }}
          >
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
              style={{ background: `${color}18` }}
            >
              <Icon size={18} style={{ color }} />
            </div>
            <div className="text-2xl font-bold mb-0.5" style={{ color, fontFamily: "JetBrains Mono, monospace" }}>
              {value}
            </div>
            <div className="text-xs" style={{ color: "var(--text-muted)" }}>{label} · {sub}</div>
          </div>
        ))}
      </div>

      {/* Activity Heatmap */}
      <div
        className="rounded-xl border p-5 mb-8"
        style={{ background: "var(--surface)", borderColor: "var(--border)" }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Calendar size={16} style={{ color: "var(--accent)" }} />
          <h3
            className="font-semibold"
            style={{ fontFamily: "DM Serif Display, serif", color: "var(--text)" }}
          >
            Activity — Last 90 Days
          </h3>
        </div>
        <div className="overflow-x-auto pb-1">
          <div
            className="grid gap-1"
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${Math.ceil(days90.length / 7)}, 1fr)`,
              gridTemplateRows: "repeat(7, 1fr)",
              gridAutoFlow: "column",
              width: "max-content",
              minWidth: "100%",
            }}
          >
            {days90.map(({ date, count }) => {
              const intensity = count === 0 ? 0 : Math.max(0.15, count / maxCount);
              const isToday = date === today.toISOString().slice(0, 10);
              return (
                <div
                  key={date}
                  title={`${date}: ${count} solved`}
                  style={{
                    width: 13,
                    height: 13,
                    borderRadius: 3,
                    background: count === 0
                      ? "var(--surface-2)"
                      : `rgba(58, 125, 68, ${intensity})`,
                    outline: isToday ? "2px solid var(--accent)" : "none",
                    outlineOffset: 1,
                    cursor: "default",
                  }}
                />
              );
            })}
          </div>
        </div>
        <div className="flex items-center justify-end gap-1.5 mt-3">
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>Less</span>
          {[0, 0.2, 0.5, 0.8, 1].map(v => (
            <div
              key={v}
              style={{
                width: 11,
                height: 11,
                borderRadius: 2,
                background: v === 0 ? "var(--surface-2)" : `rgba(58, 125, 68, ${v})`,
              }}
            />
          ))}
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>More</span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Difficulty breakdown */}
        <div
          className="rounded-xl border p-5"
          style={{ background: "var(--surface)", borderColor: "var(--border)" }}
        >
          <h3
            className="font-semibold mb-4"
            style={{ fontFamily: "DM Serif Display, serif", color: "var(--text)" }}
          >
            Progress by Difficulty
          </h3>
          <div className="space-y-4">
            {byDiff.map(({ name, solved, total, pct }) => (
              <div key={name}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium" style={{ color: diffColors[name] }}>{name}</span>
                  <span style={{ color: "var(--text-muted)" }}>{solved}/{total}</span>
                </div>
                <div className="w-full h-2 rounded-full" style={{ background: "var(--border)" }}>
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{ width: `${pct}%`, background: diffColors[name] }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category breakdown */}
        <div
          className="rounded-xl border p-5"
          style={{ background: "var(--surface)", borderColor: "var(--border)" }}
        >
          <h3
            className="font-semibold mb-4"
            style={{ fontFamily: "DM Serif Display, serif", color: "var(--text)" }}
          >
            By Category
          </h3>
          <div style={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={catData} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10, fill: "var(--text-muted)" }} />
                <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 9, fill: "var(--text-muted)" }} />
                <Tooltip
                  contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 6, fontSize: 12 }}
                />
                <Bar dataKey="solved" stackId="a" fill="var(--accent)" radius={[0, 0, 0, 0]} />
                <Bar dataKey="remaining" stackId="a" fill="var(--border)" radius={[0, 3, 3, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recently Solved */}
      <div
        className="rounded-xl border p-5"
        style={{ background: "var(--surface)", borderColor: "var(--border)" }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3
            className="font-semibold"
            style={{ fontFamily: "DM Serif Display, serif", color: "var(--text)" }}
          >
            Recently Solved
          </h3>
          <Link to="/problems">
            <span className="text-xs font-medium cursor-pointer flex items-center gap-1" style={{ color: "var(--accent)" }}>
              All problems <ArrowRight size={12} />
            </span>
          </Link>
        </div>
        {recentSolved.length === 0 ? (
          <p className="text-sm text-center py-8" style={{ color: "var(--text-muted)" }}>
            No solved problems yet. <Link to="/problems"><span className="cursor-pointer underline" style={{ color: "var(--accent)" }}>Start solving!</span></Link>
          </p>
        ) : (
          <div className="space-y-2">
            {recentSolved.map(p => (
              <Link key={p.id} to={`/problems/${p.id}`}>
                <div
                  className="flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer hover:bg-[var(--surface-2)] transition-colors"
                >
                  <div>
                    <span className="text-sm font-medium" style={{ color: "var(--text)" }}>{p.title}</span>
                    <span className="text-xs ml-2" style={{ color: "var(--text-muted)" }}>{p.category}</span>
                  </div>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{
                      background: `${diffColors[p.difficulty]}18`,
                      color: diffColors[p.difficulty],
                    }}
                  >
                    {p.difficulty}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
