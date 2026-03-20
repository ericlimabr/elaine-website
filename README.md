# Elaine Barbosa — Website

Personal website and blog platform for Elaine Barbosa, psychologist specializing in women's mental health. Built with Next.js App Router, a full admin panel, Supabase for auth and storage, and Prisma for database access.

---

## Tech Stack

| Layer            | Technology                                 |
| ---------------- | ------------------------------------------ |
| Framework        | Next.js 16+ (App Router) + React 19        |
| Styling          | Tailwind CSS 4 + `@tailwindcss/typography` |
| Database         | PostgreSQL via **Prisma ORM**              |
| Auth + Storage   | **Supabase** (SSR client)                  |
| Rich Text Editor | TipTap                                     |
| Validation       | Zod                                        |
| Email            | Nodemailer (SMTP)                          |
| Testing          | Vitest                                     |
| Local DB         | Supabase CLI (Docker)                      |
| Language         | TypeScript (strict)                        |
| Deployment       | Vercel                                     |

---

## Project Structure

```
src/
├── app/
│   ├── (site)/               # Public-facing routes (home, blog, contact)
│   ├── (protectedRoutes)/    # Admin panel (auth-gated via middleware)
│   │   └── admin/            # Posts, tags, media, messages, settings
│   ├── actions/              # Next.js Server Actions (posts, tags, settings, contact)
│   └── layout.tsx            # Root layout (fonts, GA, custom scripts)
├── components/
│   ├── ui/                   # Atomic primitives (shadcn/ui)
│   ├── layout/               # Header, footer, sidebar, navigation
│   ├── features/             # Business logic components (forms, uploaders, editors)
│   └── pages/                # Full-page components
├── lib/
│   ├── prisma.ts             # Prisma client singleton
│   └── mail.ts               # Nodemailer email sender
├── utils/                    # Pure utility functions (strings, files, numbers, auth)
├── constants/                # Shared constants (allowed MIME types, etc.)
├── hooks/                    # Custom React hooks
└── middleware.ts             # Route protection — redirects /admin/* to /login

prisma/
├── schema.prisma             # Database schema
└── migrations/               # Prisma migration history

supabase/
└── config.toml               # Local Supabase instance configuration
```

---

## Environment Variables

Copy `.env.example` to `.env` (for production) or `.env.test.example` to `.env.test` (for local testing).

| Variable                        | Description                                            |
| ------------------------------- | ------------------------------------------------------ |
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase project URL                                   |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous (public) key                        |
| `SUPABASE_SERVICE_ROLE_KEY`     | Supabase service role key — bypasses RLS, keep secret  |
| `DATABASE_URL`                  | Prisma connection string (pooled, e.g. PgBouncer)      |
| `DIRECT_URL`                    | Prisma direct connection string (used for migrations)  |
| `GLOBAL_CONFIG_ID`              | ID of the single `GlobalSettings` record in the DB     |
| `SMTP_HOST`                     | SMTP server host                                       |
| `SMTP_PORT`                     | SMTP server port (465 for SSL, 587 for TLS)            |
| `SMTP_USER`                     | SMTP authentication username                           |
| `SMTP_PASS`                     | SMTP password or app password                          |
| `CONTACT_EMAIL_DESTINATION`     | Email address that receives contact form notifications |

---

## Getting Started

**Requirements:** Node.js 18.17+, Docker (for local Supabase)

```bash
# Install dependencies
npm install

# Start the development server (Turbopack)
npm run dev
```

The app runs at `http://localhost:3000`.

---

## Local Database (Supabase + Docker)

The project includes a local Supabase instance via the Supabase CLI, which spins up PostgreSQL, Auth, Storage, and a local email catcher — all in Docker, with no cloud account needed.

### First-time setup

```bash
# 1. Start all Supabase Docker containers
npm run db:start

# 2. Note the credentials printed — they match the defaults in .env.test.example
npm run db:status

# 3. Copy the example env file and adjust if needed
cp .env.test.example .env.test

# 4. Push the Prisma schema to the local DB
npx prisma migrate deploy
```

### Daily use

```bash
npm run db:start      # Start containers
npm run db:stop       # Stop containers (data is preserved)
npm run db:status     # Print local API URL, keys, and DB connection string
npm run db:reset      # Wipe local DB and re-run all migrations from scratch
```

### Local service URLs (after `db:start`)

| Service                    | URL                      |
| -------------------------- | ------------------------ |
| API / Supabase client      | `http://localhost:54321` |
| PostgreSQL                 | `localhost:54322`        |
| Supabase Studio (admin UI) | `http://localhost:54323` |
| Inbucket (email catcher)   | `http://localhost:54324` |

---

## Testing

The project uses **Vitest** for unit and integration tests. Tests mock Prisma and `getUser` — no running database is required for the current test suite.

### Run tests

```bash
# Run all tests once (CI mode)
npm test

# Watch mode during development
npm run test:watch

# Run a specific test file
npx vitest run src/app/actions/__tests__/contact.test.ts

# Run tests matching a name pattern
npx vitest run --reporter=verbose -t "auth guard"

# Run with coverage report
npx vitest run --coverage
```

### Test structure

```
src/
├── utils/__tests__/
│   ├── strings.test.ts          # sanitizeRawScript, escapeHtml, sanitizeEmail,
│   │                            #   isValidEmail, isValidGoogleAnalyticsId
│   ├── files.test.ts            # sanitizeFilename
│   └── numbers.test.ts          # formatFileSize, formatWhatsApp, formatCompactNumber
├── constants/__tests__/
│   └── allowedUploadTypes.test.ts  # MIME type allowlist
├── app/actions/__tests__/
│   ├── contact.test.ts          # Rate limiter, honeypot, form validation, auth guards
│   ├── settings.test.ts         # Auth guard, GA ID validation, DB upsert
│   ├── posts.test.ts            # Auth guards, Zod validation, create/update
│   └── tags.test.ts             # Auth guards, validation, create/delete
└── __tests__/
    └── securityHeaders.test.ts  # HTTP security headers in next.config.ts
```

### What is tested

| Category                  | Coverage                                                                     |
| ------------------------- | ---------------------------------------------------------------------------- |
| Security — XSS prevention | `sanitizeRawScript`, `escapeHtml`, GA ID injection                           |
| Security — auth guards    | All server actions reject unauthenticated callers                            |
| Security — rate limiting  | Contact form blocks after 3 submissions per hour                             |
| Security — HTTP headers   | X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy |
| Input validation          | Zod schemas for posts and tags, required fields on contact form              |
| Utilities                 | String, file, and number utility functions                                   |
| Constants                 | MIME type allowlist includes/excludes correct types                          |

---

## Available Scripts

```bash
npm run dev           # Start development server (Turbopack, http://localhost:3000)
npm run build         # Generate Prisma client + production build
npm run start         # Serve the production build locally
npm run lint          # Run ESLint
npm run format        # Run Prettier (auto-fix)
npm run check         # prisma validate + tsc --noEmit + lint
npm test              # Run Vitest test suite once
npm run test:watch    # Run Vitest in watch mode
npm run db:start      # Start local Supabase Docker containers
npm run db:stop       # Stop local Supabase Docker containers
npm run db:status     # Show local Supabase connection details
npm run db:reset      # Wipe and re-migrate local database
```

---

## Component Architecture

Components follow a four-layer hierarchy:

- **`components/ui/`** — Atomic, stateless primitives (buttons, inputs, cards). Based on shadcn/ui with Radix UI.
- **`components/layout/`** — Structural components: site header, footer, admin sidebar, navigation menus.
- **`components/features/`** — Business logic components: contact form, image uploaders, rich text editor, admin tables.
- **`components/pages/`** — Full-page components that compose the above layers.

---

## Route Architecture

| Route                  | Type      | Description      |
| ---------------------- | --------- | ---------------- |
| `/`                    | Public    | Homepage         |
| `/blog`                | Public    | Blog listing     |
| `/blog/[slug]`         | Public    | Single post      |
| `/sobre`               | Public    | About page       |
| `/servicos`            | Public    | Services page    |
| `/contato`             | Public    | Contact form     |
| `/login`               | Public    | Auth page        |
| `/admin`               | Protected | Dashboard        |
| `/admin/artigos`       | Protected | Post management  |
| `/admin/mensagens`     | Protected | Contact messages |
| `/admin/media`         | Protected | Media gallery    |
| `/admin/tags`          | Protected | Tag management   |
| `/admin/configuracoes` | Protected | Site settings    |

Route protection is enforced by `src/middleware.ts`, which redirects all `/admin/*` requests to `/login` when no valid session is present.

---

## Deployment

The project is optimized for **Vercel**. Connect the repository — Vercel detects Next.js automatically and configures builds with zero config.

Set all environment variables listed above in the Vercel project settings. Do not commit `.env` to version control.

For other providers: Node.js 18.17+, run `npm run build`, serve the `.next` directory.
