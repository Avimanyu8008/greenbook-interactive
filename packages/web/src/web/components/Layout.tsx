import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import {
  BookOpen, BarChart2, Bookmark, Home, Menu, X, Flame, Trophy,
  User, LogOut, ChevronDown, ListChecks, Brain, FileText,
  Target, Sun, Moon, Library, Sigma,
} from "lucide-react";
import { PROBLEMS } from "../data/problems";
import { loadProgress, getStats } from "../lib/progress";
import { authClient } from "../lib/auth";

function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    try {
      return (localStorage.getItem("gb_theme") as "light" | "dark") || "dark";
    } catch {
      return "dark";
    }
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try { localStorage.setItem("gb_theme", theme); } catch {}
  }, [theme]);

  // Apply on first render
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, []);

  return { theme, toggle: () => setTheme(t => (t === "light" ? "dark" : "light")) };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const store = loadProgress();
  const stats = getStats(store, PROBLEMS.length);
  const { data: session } = authClient.useSession();
  const { theme, toggle } = useTheme();

  const primaryLinks = [
    { to: "/", icon: Home, label: "Home" },
    { to: "/problems", icon: BookOpen, label: "Problems" },
    { to: "/playlists", icon: ListChecks, label: "Playlists" },
    { to: "/drill", icon: Brain, label: "Drill" },
    { to: "/interview", icon: Target, label: "Interview" },
    { to: "/cheatsheet", icon: FileText, label: "Cheatsheet" },
    { to: "/fermi", icon: Sigma, label: "Fermi" },
    { to: "/resources", icon: Library, label: "Resources" },
  ];

  const moreLinks = [
    { to: "/bookmarks", icon: Bookmark, label: "Bookmarks" },
    { to: "/stats", icon: BarChart2, label: "Stats" },
  ];

  const allMobileLinks = [...primaryLinks, ...moreLinks];

  async function handleSignOut() {
    await authClient.signOut();
    setUserMenuOpen(false);
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Nav */}
      <header
        className="sticky top-0 z-50 border-b"
        style={{
          background: "rgba(13, 17, 23, 0.8)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderColor: "var(--border)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
                style={{ background: "var(--accent)", fontFamily: "DM Serif Display, serif" }}
              >
                G
              </div>
              <span
                className="text-lg font-semibold tracking-tight"
                style={{ fontFamily: "DM Serif Display, serif", color: "var(--text)" }}
              >
                GreenBook
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-0.5">
            {primaryLinks.map(({ to, icon: Icon, label }) => (
              <Link key={to} to={to}>
                <span
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer whitespace-nowrap"
                  style={{
                    color: location === to ? "var(--accent)" : "#d4e8d0",
                    background: location === to ? "var(--accent-light)" : "transparent",
                  }}
                >
                  <Icon size={13} />
                  {label}
                </span>
              </Link>
            ))}

            {/* More dropdown */}
            <div className="relative">
              <button
                onClick={() => setMoreOpen(!moreOpen)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors"
                style={{
                  color: moreLinks.some(l => l.to === location) ? "var(--accent)" : "#d4e8d0",
                  background: moreLinks.some(l => l.to === location) ? "var(--accent-light)" : "transparent",
                }}
              >
                More
                <ChevronDown size={11} />
              </button>
              {moreOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setMoreOpen(false)} />
                  <div
                    className="absolute left-0 top-full mt-1 w-40 rounded-xl shadow-lg z-20 py-1"
                    style={{ background: "rgba(13,17,23,0.95)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", border: "1px solid var(--border)" }}
                  >
                    {moreLinks.map(({ to, icon: Icon, label }) => (
                      <Link key={to} to={to}>
                        <span
                          className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-[var(--surface-2)] transition-colors"
                          style={{ color: location === to ? "var(--accent)" : "var(--text)" }}
                          onClick={() => setMoreOpen(false)}
                        >
                          <Icon size={13} />
                          {label}
                        </span>
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>
          </nav>

          {/* Right side: stats + theme + user */}
          <div className="hidden md:flex items-center gap-2">
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
              style={{ background: "var(--accent-light)", color: "var(--accent)" }}
            >
              <Flame size={12} />
              {stats.streak}
            </div>
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
              style={{ background: "var(--surface-2)", color: "var(--text-muted)" }}
            >
              <Trophy size={12} />
              {stats.solved}/{stats.total}
            </div>

            {/* Theme toggle */}
            <button
              onClick={toggle}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-[var(--surface-2)]"
              style={{ color: "#d4e8d0" }}
              title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
            >
              {theme === "light" ? <Moon size={15} /> : <Sun size={15} />}
            </button>

            {session ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-sm font-medium transition-colors"
                  style={{ background: "var(--surface-2)", color: "var(--text)" }}
                >
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    style={{ background: "var(--accent)" }}
                  >
                    {session.user.name?.[0]?.toUpperCase() ?? "U"}
                  </div>
                  <span className="max-w-[80px] truncate">{session.user.name}</span>
                  <ChevronDown size={12} style={{ color: "var(--text-muted)" }} />
                </button>
                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                    <div
                      className="absolute right-0 top-full mt-1 w-48 rounded-xl shadow-lg z-20 py-1"
                      style={{ background: "rgba(13,17,23,0.95)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", border: "1px solid var(--border)" }}
                    >
                      <div className="px-3 py-2 border-b" style={{ borderColor: "var(--border)" }}>
                        <p className="text-xs font-medium" style={{ color: "var(--text)" }}>{session.user.name}</p>
                        <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>{session.user.email}</p>
                      </div>
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm transition-colors hover:bg-[var(--surface-2)]"
                        style={{ color: "var(--text-muted)" }}
                      >
                        <LogOut size={13} />
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link to="/sign-in">
                <span
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold text-white cursor-pointer transition-opacity hover:opacity-90"
                  style={{ background: "var(--accent)" }}
                >
                  <User size={13} />
                  Sign In
                </span>
              </Link>
            )}
          </div>

          {/* Mobile: theme + menu button */}
          <div className="md:hidden flex items-center gap-1">
            <button
              onClick={toggle}
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ color: "var(--text-muted)" }}
            >
              {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
            </button>
            <button
              className="p-2"
              style={{ color: "var(--text-muted)" }}
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div
            className="md:hidden border-t px-4 py-3 flex flex-col gap-1"
            style={{ borderColor: "var(--border)", background: "rgba(13,17,23,0.95)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }}
          >
            {allMobileLinks.map(({ to, icon: Icon, label }) => (
              <Link key={to} to={to}>
                <span
                  className="flex items-center gap-2 px-3 py-2 rounded-md text-sm cursor-pointer"
                  style={{
                    color: location === to ? "var(--accent)" : "#d4e8d0",
                    background: location === to ? "var(--accent-light)" : "transparent",
                  }}
                  onClick={() => setMobileOpen(false)}
                >
                  <Icon size={15} />
                  {label}
                </span>
              </Link>
            ))}
            <div className="border-t pt-2 mt-1" style={{ borderColor: "var(--border)" }}>
              {session ? (
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 px-3 py-2 rounded-md text-sm w-full"
                  style={{ color: "var(--text-muted)" }}
                >
                  <LogOut size={15} />
                  Sign Out ({session.user.name})
                </button>
              ) : (
                <Link to="/sign-in">
                  <span
                    className="flex items-center gap-2 px-3 py-2 rounded-md text-sm cursor-pointer font-medium"
                    style={{ color: "var(--accent)" }}
                    onClick={() => setMobileOpen(false)}
                  >
                    <User size={15} />
                    Sign In
                  </span>
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer
        className="border-t py-6 text-center text-xs"
        style={{ borderColor: "var(--border)", color: "#d4e8d0", background: "rgba(13,17,23,0.6)" }}
      >
        GreenBook Interactive — Inspired by{" "}
        <em>A Practical Guide to Quantitative Finance Interviews</em> by Xinfeng Zhou
      </footer>
    </div>
  );
}
