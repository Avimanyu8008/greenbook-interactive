export type ProblemProgress = {
  solved: boolean;
  attempts: number;
  notes: string;
  bookmarked: boolean;
  lastAttempt?: number;
};

export type ProgressStore = {
  problems: Record<string, ProblemProgress>;
  streak: number;
  lastActiveDate: string;
  totalSolved: number;
};

const KEY = "greenbook_progress";

function getToday(): string {
  return new Date().toISOString().slice(0, 10);
}

export function loadProgress(): ProgressStore {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as ProgressStore;
  } catch {}
  return { problems: {}, streak: 0, lastActiveDate: "", totalSolved: 0 };
}

export function saveProgress(store: ProgressStore): void {
  localStorage.setItem(KEY, JSON.stringify(store));
}

export function markSolved(id: string): ProgressStore {
  const store = loadProgress();
  const prev = store.problems[id] || { solved: false, attempts: 0, notes: "", bookmarked: false };
  const wasSolved = prev.solved;
  store.problems[id] = { ...prev, solved: true, attempts: prev.attempts + 1, lastAttempt: Date.now() };
  if (!wasSolved) store.totalSolved++;
  // Update streak
  const today = getToday();
  if (store.lastActiveDate !== today) {
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    store.streak = store.lastActiveDate === yesterday ? store.streak + 1 : 1;
    store.lastActiveDate = today;
  }
  saveProgress(store);
  return store;
}

export function toggleBookmark(id: string): ProgressStore {
  const store = loadProgress();
  const prev = store.problems[id] || { solved: false, attempts: 0, notes: "", bookmarked: false };
  store.problems[id] = { ...prev, bookmarked: !prev.bookmarked };
  saveProgress(store);
  return store;
}

export function saveNotes(id: string, notes: string): ProgressStore {
  const store = loadProgress();
  const prev = store.problems[id] || { solved: false, attempts: 0, notes: "", bookmarked: false };
  store.problems[id] = { ...prev, notes };
  saveProgress(store);
  return store;
}

export function getStats(store: ProgressStore, total: number) {
  const solved = Object.values(store.problems).filter(p => p.solved).length;
  const bookmarked = Object.values(store.problems).filter(p => p.bookmarked).length;
  return { solved, bookmarked, total, streak: store.streak, pct: Math.round((solved / total) * 100) };
}
