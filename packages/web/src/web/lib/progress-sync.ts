/**
 * DB-backed progress sync. When user is logged in, progress is saved to Turso.
 * When not logged in, falls back to localStorage.
 */
import { loadProgress, saveProgress, type ProgressStore } from "./progress";

type ProgressRow = {
  problemId: string;
  solved: boolean;
  bookmarked: boolean;
  hintsViewed: number;
  solvedAt: number | null;
};

// Fetch server progress and merge with local
export async function syncProgressFromServer(): Promise<void> {
  try {
    const res = await fetch("/api/progress", { credentials: "include" });
    if (!res.ok) return;
    const rows: ProgressRow[] = await res.json();

    const local = loadProgress();

    // Merge: server wins for solved/bookmarked; take max hintsViewed
    const merged: ProgressStore = { ...local };
    for (const row of rows) {
      merged.solved = { ...merged.solved, [row.problemId]: row.solved };
      merged.bookmarked = { ...merged.bookmarked, [row.problemId]: row.bookmarked };
      merged.hintsViewed = {
        ...merged.hintsViewed,
        [row.problemId]: Math.max(row.hintsViewed, merged.hintsViewed?.[row.problemId] ?? 0),
      };
    }
    saveProgress(merged);
  } catch {
    // offline or not logged in — silent
  }
}

export async function pushProgressToServer(
  problemId: string,
  update: { solved?: boolean; bookmarked?: boolean; hintsViewed?: number }
): Promise<void> {
  try {
    await fetch("/api/progress", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ problemId, ...update }),
    });
  } catch {
    // silent — local already saved
  }
}
