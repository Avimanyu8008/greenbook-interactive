import { Hono } from 'hono';
import { cors } from "hono/cors";
import { secureHeaders } from "hono/secure-headers";
import { auth } from "./auth";
import { db } from "./database";
import { userProgress } from "./database/schema";
import { and, eq } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";

// ── Simple in-memory rate limiter ─────────────────────────────────
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
function isRateLimited(ip: string, limit = 60, windowMs = 60_000): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs });
    return false;
  }
  entry.count++;
  return entry.count > limit;
}
// Clean up old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, val] of rateLimitMap) {
    if (now > val.resetAt) rateLimitMap.delete(key);
  }
}, 5 * 60_000);

// ── Allowed origins ────────────────────────────────────────────────
const ALLOWED_ORIGINS = [
  process.env.WEBSITE_URL,
  "http://localhost:4200",
  "http://localhost:5173",
].filter(Boolean) as string[];

const app = new Hono()
  // Security headers on every response
  .use(secureHeaders({
    xFrameOptions: "DENY",
    xContentTypeOptions: "nosniff",
    referrerPolicy: "strict-origin-when-cross-origin",
    strictTransportSecurity: "max-age=63072000; includeSubDomains; preload",
    contentSecurityPolicy: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "cdn.jsdelivr.net"],
      styleSrc: ["'self'", "'unsafe-inline'", "cdn.jsdelivr.net", "fonts.googleapis.com"],
      fontSrc: ["'self'", "fonts.gstatic.com", "cdn.jsdelivr.net"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
    },
    permissionsPolicy: {
      camera: [],
      microphone: [],
      geolocation: [],
    },
  }))
  // CORS — locked to allowed origins only
  .use(cors({
    origin: (origin) => {
      if (!origin) return null;
      if (ALLOWED_ORIGINS.some(o => origin.startsWith(o))) return origin;
      return null;
    },
    credentials: true,
    allowMethods: ["GET", "POST", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    maxAge: 86400,
  }))
  // Rate limiting middleware
  .use(async (c, next) => {
    const ip =
      c.req.header("cf-connecting-ip") ||
      c.req.header("x-forwarded-for")?.split(",")[0].trim() ||
      "unknown";
    if (isRateLimited(ip, 100, 60_000)) {
      return c.json({ error: "Too many requests" }, 429);
    }
    await next();
  })
  // Mount Better Auth BEFORE basePath
  .on(["GET", "POST"], "/api/auth/*", (c) => auth.handler(c.req.raw))
  .basePath('api')
  .get('/ping', (c) => c.json({ message: `Pong! ${Date.now()}` }, 200))
  .get('/health', (c) => c.json({ status: 'ok' }, 200))

  // ── Progress routes (require auth) ────────────────────────────────
  .get('/progress', async (c) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    if (!session?.user) return c.json({ error: 'Unauthorized' }, 401);
    const rows = await db.select().from(userProgress).where(eq(userProgress.userId, session.user.id));
    return c.json(rows, 200);
  })

  .post('/progress', async (c) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    if (!session?.user) return c.json({ error: 'Unauthorized' }, 401);

    let body: unknown;
    try {
      body = await c.req.json();
    } catch {
      return c.json({ error: 'Invalid JSON' }, 400);
    }

    // Input validation
    if (!body || typeof body !== 'object') return c.json({ error: 'Invalid body' }, 400);
    const { problemId, solved, bookmarked, hintsViewed } = body as Record<string, unknown>;

    if (!problemId || typeof problemId !== 'string' || problemId.length > 100) {
      return c.json({ error: 'Invalid problemId' }, 400);
    }
    if (solved !== undefined && typeof solved !== 'boolean') {
      return c.json({ error: 'Invalid solved' }, 400);
    }
    if (bookmarked !== undefined && typeof bookmarked !== 'boolean') {
      return c.json({ error: 'Invalid bookmarked' }, 400);
    }
    if (hintsViewed !== undefined && (typeof hintsViewed !== 'number' || hintsViewed < 0 || hintsViewed > 100)) {
      return c.json({ error: 'Invalid hintsViewed' }, 400);
    }

    const existing = await db.select().from(userProgress).where(
      and(eq(userProgress.userId, session.user.id), eq(userProgress.problemId, problemId))
    );

    const now = Date.now();
    if (existing.length > 0) {
      await db.update(userProgress)
        .set({
          solved: solved ?? existing[0].solved,
          bookmarked: bookmarked ?? existing[0].bookmarked,
          hintsViewed: hintsViewed ?? existing[0].hintsViewed,
          solvedAt: solved ? (existing[0].solvedAt ?? now) : existing[0].solvedAt,
          updatedAt: now,
        })
        .where(and(eq(userProgress.userId, session.user.id), eq(userProgress.problemId, problemId)));
    } else {
      await db.insert(userProgress).values({
        id: createId(),
        userId: session.user.id,
        problemId,
        solved: solved ?? false,
        bookmarked: bookmarked ?? false,
        hintsViewed: hintsViewed ?? 0,
        solvedAt: solved ? now : null,
        createdAt: now,
        updatedAt: now,
      });
    }
    return c.json({ ok: true }, 200);
  })

  .delete('/progress/:problemId', async (c) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    if (!session?.user) return c.json({ error: 'Unauthorized' }, 401);
    const problemId = c.req.param('problemId');
    if (!problemId || problemId.length > 100) return c.json({ error: 'Invalid problemId' }, 400);
    await db.delete(userProgress).where(
      and(eq(userProgress.userId, session.user.id), eq(userProgress.problemId, problemId))
    );
    return c.json({ ok: true }, 200);
  });

export type AppType = typeof app;
export default app;
