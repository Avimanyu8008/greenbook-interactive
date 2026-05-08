# GreenBook Feature Expansion Task

## Status

### DONE
- [x] 61 problems in problems.ts + problems-extra.ts
- [x] DB schema: auth-schema.ts + user_progress table
- [x] bun add better-auth@1.4.22
- [x] api/auth.ts created
- [x] db:push ran successfully
- [x] api/index.ts — auth mounted, progress routes added
- [x] lib/auth.ts (client)
- [x] lib/progress-sync.ts
- [x] components/ProtectedRoute.tsx
- [x] pages/sign-in.tsx

### IN PROGRESS
- [ ] Update Layout.tsx — add user menu (avatar, sign out) in navbar
- [ ] Update app.tsx — add routes for sign-in, drill, interview, playlists, cheatsheet
- [ ] pages/drill.tsx — mental math drill mode
- [ ] pages/interview.tsx — timed interview mode
- [ ] pages/playlists.tsx — curated playlists
- [ ] pages/cheatsheet.tsx — formula reference
- [ ] Add company tags to problems-extra.ts (Jane Street, Citadel, Optiver, etc.)
- [ ] Update problems.ts type to include companies?: string[]
- [ ] Update problems page to show company badges + filter by company
- [ ] Run bun run build, fix errors
- [ ] Restart dev server

## Decisions
- Auth: email/password only via Better Auth
- Progress: DB-backed when logged in, localStorage fallback when not
- No protected routes — everything is accessible, but stats/bookmarks sync to DB when signed in
- Company tags: added to problem type, shown as colored badges
- Playlists: static curated arrays referencing problem IDs
