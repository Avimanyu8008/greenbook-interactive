import { Hono } from 'hono';
import { cors } from "hono/cors";
import { auth } from "./auth";
import { db } from "./database";
import { userProgress } from "./database/schema";
import { and, eq } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";

const app = new Hono()
  .use(cors({ origin: (origin) => origin ?? "*", credentials: true }))
  // Mount Better Auth BEFORE basePath
  .on(["GET", "POST"], "/api/auth/*", (c) => auth.handler(c.req.raw))
  .basePath('api')
  .get('/ping', (c) => c.json({ message: `Pong! ${Date.now()}` }, 200))
  .get('/health', (c) => c.json({ status: 'ok' }, 200))

  // ---- Progress routes (require auth) ----
  .get('/progress', async (c) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    if (!session?.user) return c.json({ error: 'Unauthorized' }, 401);
    const rows = await db.select().from(userProgress).where(eq(userProgress.userId, session.user.id));
    return c.json(rows, 200);
  })

  .post('/progress', async (c) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    if (!session?.user) return c.json({ error: 'Unauthorized' }, 401);
    const body = await c.req.json() as { problemId: string; solved?: boolean; bookmarked?: boolean; hintsViewed?: number };
    const { problemId, solved, bookmarked, hintsViewed } = body;

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
    await db.delete(userProgress).where(
      and(eq(userProgress.userId, session.user.id), eq(userProgress.problemId, problemId))
    );
    return c.json({ ok: true }, 200);
  });

export type AppType = typeof app;
export default app;
