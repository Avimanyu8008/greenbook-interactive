import { Link, useRoute } from "wouter";
import { PROBLEMS } from "../data/problems";
import { EXTRA_PROBLEMS } from "../data/problems-extra";
import { loadProgress } from "../lib/progress";
import { PLAYLISTS } from "./playlists";
import { ArrowLeft, CheckCircle, ChevronRight, BookOpen } from "lucide-react";

const ALL_PROBLEMS = [...PROBLEMS, ...EXTRA_PROBLEMS];

export default function PlaylistDetailPage() {
  const [, params] = useRoute("/playlists/:id");
  const playlist = PLAYLISTS.find(p => p.id === params?.id);
  const progress = loadProgress();

  if (!playlist) return (
    <div className="max-w-2xl mx-auto px-4 py-10 text-center" style={{ color: "var(--text-muted)" }}>
      Playlist not found.{" "}
      <Link to="/playlists"><span className="underline cursor-pointer" style={{ color: "var(--accent)" }}>Back</span></Link>
    </div>
  );

  const problems = playlist.problemIds
    .map(id => ALL_PROBLEMS.find(p => p.id === id))
    .filter(Boolean) as typeof ALL_PROBLEMS;

  const solved = problems.filter(p => progress.solved?.[p.id]).length;
  const pct = Math.round((solved / problems.length) * 100);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <Link to="/playlists">
        <div className="flex items-center gap-1.5 text-sm mb-6 cursor-pointer" style={{ color: "var(--text-muted)" }}>
          <ArrowLeft size={14} />
          Playlists
        </div>
      </Link>

      <div className="mb-8">
        <span className="text-4xl mb-2 block">{playlist.emoji}</span>
        <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: "DM Serif Display, serif", color: "var(--text)" }}>
          {playlist.title}
        </h1>
        <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>{playlist.description}</p>

        <div className="flex items-center gap-3 text-sm" style={{ color: "var(--text-muted)" }}>
          <span>{solved}/{problems.length} solved</span>
          <span>·</span>
          <span>{pct}% complete</span>
        </div>
        <div className="h-2 rounded-full mt-2 overflow-hidden w-full max-w-xs" style={{ background: `${playlist.accent}20` }}>
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${pct}%`, background: playlist.accent }}
          />
        </div>
      </div>

      <div className="space-y-2">
        {problems.map((p, i) => {
          const isSolved = !!progress.solved?.[p.id];
          return (
            <Link key={p.id} to={`/problems/${p.id}`}>
              <div
                className="flex items-center gap-4 px-4 py-3.5 rounded-xl cursor-pointer transition-all hover:shadow-sm group"
                style={{
                  background: isSolved ? "#f0fdf4" : "var(--surface)",
                  border: `1px solid ${isSolved ? "#bbf7d0" : "var(--border)"}`,
                }}
              >
                <span
                  className="text-xs font-mono w-5 text-center flex-shrink-0"
                  style={{ color: "var(--text-muted)" }}
                >
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: "var(--text)" }}>{p.title}</p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>{p.category}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{
                      background: p.difficulty === "Easy" ? "#dcfce7" : p.difficulty === "Medium" ? "#fef9c3" : "#fee2e2",
                      color: p.difficulty === "Easy" ? "#16a34a" : p.difficulty === "Medium" ? "#ca8a04" : "#dc2626",
                    }}
                  >
                    {p.difficulty}
                  </span>
                  {isSolved
                    ? <CheckCircle size={15} color="#16a34a" />
                    : <ChevronRight size={15} className="group-hover:translate-x-0.5 transition-transform" style={{ color: "var(--text-muted)" }} />
                  }
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
