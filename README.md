## Ahoj
předem se chci omluvit, že to posílám tak pozdě. Snažil jsem se co nejvíce pracovat na backend (NestJs), 
bohužel FE jsem nesthil věnovat takovou péči, proto spíše berte FE jako demonstrační, že to opravdu funguje :)

Projekt není v konečné fázi a už vůbec ne production ready. Například na frontendu chybí testy, logování (Sentry,...), dodělání next featur jako 404 pages, 
error boundaries apod.

Na backendu se mi podařilo udělat více práce, ale také by se dal doladit, zejména vyhledávání apod. 
Bohužel jsem také nestihl napsat testy (Jest), ale v reálném světě bych se je samozřejmě snažil doimplementovat :)

Co se týče devops a CI/CD, použil bych Terraform pro nastavení infrastruktury, Github Pipelines pro deploy applikace např. do AWS.
K moniotringu, logovánání a altertování bych použil například NewRelic (případně Splunk), se kterými mám zkušenosti z dřívjejších projektů.
Určitě by se ale dalo použít více technologií.

Chtěl bych ještě dodat, že nejsem fanoušek používáním monorepa za všech okolnosti, ale v tomto případě mi to příšlo fajn, aby to bylo po kupě.

Děkuji

# Bookbot – KB Case Study Monorepo

NX monorepo with a **NestJS** backend, a **Next.js** frontend, shared libraries, and Prisma ORM.

## 🏗️ Architecture

```
kb-case-study-monorepo/
├── apps/
│   ├── bookbot-backend/          ← NestJS API (port 8080)
│   └── bookbot-frontend/         ← Next.js App Router (port 3000)
├── packages/
│   ├── book-utils/               ← Shared types, mappers, ordering (@bookbot/book-utils)
│   ├── constants/                ← Shared enums — Language, Binding, Condition (@bookbot/constants)
│   └── db/                       ← Prisma schema, migrations, seed, PrismaModule (@bookbot/db)
├── docker-compose.yml            ← PostgreSQL 17 + Redis 7
└── .env.example
```

### Technologies

| Layer | Technologies |
|---|---|
| **Frontend** | Next.js 16, React 19, Tailwind CSS, React Query, next-intl |
| **Backend** | NestJS, Prisma ORM, nestjs-pino, class-validator |
| **Database** | PostgreSQL 17, Redis 7 (filter cache) |
| **Monorepo** | Nx, TypeScript project references |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- npm 10+
- Docker & Docker Compose (for PostgreSQL and Redis)

### 1. Install dependencies

```sh
npm install
```

### 2. Configure environment

```sh
cp .env.example .env
```

Default `.env` values:

| Variable | Default value | Description |
|---|---|---|
| `DATABASE_URL` | `postgresql://bookbot:bookbot@localhost:5432/bookbot` | PostgreSQL connection string |
| `REDIS_URL` | `redis://localhost:6379` | Redis connection string |
| `NEXT_PUBLIC_API_URL` | `http://localhost:8080/api` | Backend URL for the frontend |
| `PORT` | `8080` | Backend port (optional) |
| `CORS_ORIGIN` | `http://localhost:3000` | Allowed CORS origin (optional) |

### 3. Start infrastructure (PostgreSQL + Redis)

```sh
docker compose up -d
```

### 4. Create DB schema and seed data

```sh
npm run db:migrate
npm run db:seed
```

### 5. Start applications

```sh
# Backend + Frontend najednou
npm run start:all

# Or individually:
npm run start:api    # NestJS API → http://localhost:8080/api
npm run start:web    # Next.js   → http://localhost:3000
```

---

## 📡 API Endpoints

### Book Listing

```
GET /api/books
```

Query parameters (all optional):

| Parameter | Type | Example | Description |
|---|---|---|---|
| `page` | number | `2` | Page number (default 1) |
| `languages` | CSV string | `CS,EN` | Language filter |
| `bindings` | CSV string | `SOFT,HARD` | Binding filter |
| `conditions` | CSV string | `VERY_GOOD,GOOD` | Condition filter |
| `authorIds` | CSV number | `1,2` | Filter by author IDs |
| `publisherIds` | CSV number | `3,5` | Filter by publisher IDs |
| `priceFrom` | number | `50` | Minimum price |
| `priceTo` | number | `200` | Maximum price |
| `yearFrom` | number | `2000` | Publication year from |
| `yearTo` | number | `2024` | Publication year to |
| `inStock` | boolean | `true` | In stock only |

Example:

```sh
curl "http://localhost:8080/api/books?languages=CS,EN&inStock=true&page=1"
```

### Book Detail

```
GET /api/books/:slug
```

### Book Filters

```
GET /api/books/filters
```

Returns available filters with counts (languages, bindings, conditions, top authors, top publishers, price and year ranges). The result is cached in Redis (1 hour).

---

## 🎨 Frontend

Next.js App Router with these pages:

| Route | Description | Rendering |
|---|---|---|
| `/` | Book list with filters and pagination | Server Component (SSR) |
| `/books/[slug]` | Book detail with editions and items | Server Component (SSR) |

### Components

```
src/
├── app/
│   ├── layout.tsx          ← Root layout (next-intl, QueryProvider)
│   ├── page.tsx            ← Listing — Server Component
│   └── books/[slug]/
│       └── page.tsx        ← Detail — Server Component
├── components/
│   ├── BookCard.tsx        ← Book card (Server Component)
│   ├── BookList.tsx        ← Books grid (Server Component)
│   ├── EditionCard.tsx     ← Edition card on the detail page
│   ├── Filters.tsx         ← Filters sidebar (Client Component)
│   ├── FilterSection.tsx   ← Single filter section (checkbox list)
│   ├── Pagination.tsx      ← Pagination
│   ├── StockBadge.tsx      ← Availability badge (pure)
│   ├── PriceDisplay.tsx    ← Price display (pure)
│   └── QueryProvider.tsx   ← React Query provider
├── hooks/
│   └── useBooks.ts         ← React Query hooks
├── lib/
│   ├── api.ts              ← Fetch functions (books, filters, detail)
│   └── config.ts           ← Configuration (API URL)
├── i18n/
│   └── request.ts          ← next-intl configuration
└── messages/
    └── cs.json             ← Czech translations
```

### Localization

Uses `next-intl`. Translations are in `src/messages/cs.json`. To add a new language, create a new file (e.g. `en.json`) and update `src/i18n/request.ts`.

---

## 🗃️ Database model

```
Book (title)
 └── BookEdition (edition — language, binding, year, publisher)
      ├── BookItem (specific copy — condition, price, status)
      └── AuthorsOnBookEditions ← → Author

Publisher (publisher)
```

Key concept: **Book** = abstract title, **BookEdition** = a specific edition (language, binding, publisher), **BookItem** = a physical copy in stock (condition, price, availability).

### Enums

| Enum | Values |
|---|---|
| `Language` | CS, EN, DE, IT, FR, SK, ES, RU, PL |
| `Binding` | SOFT, HARD, STAPLED, RING, LEPORELO, FLEX, OTHER |
| `BookCondition` | VERY_GOOD, GOOD, DAMAGED |
| `CopyStatus` | AVAILABLE, SOLD, RESERVED |

---

## 📋 Useful commands

| Command | Description |
|---|---|
| `npm run start:api` | Start backend (port 8080) |
| `npm run start:web` | Start frontend (port 3000) |
| `npm run start:all` | Start backend + frontend together |
| `npm run db:migrate` | Run Prisma migrations |
| `npm run db:seed` | Seed the DB |
| `npm run db:reset` | Reset DB + migrations + seed |
| `npx nx build bookbot-backend` | Build backend |
| `npx nx build bookbot-frontend` | Build frontend |
| `npx nx test bookbot-backend` | Backend tests |
| `npx nx lint bookbot-backend` | Lint backend |
| `npx nx graph` | Dependency graph visualization |
| `docker compose up -d` | Start PostgreSQL + Redis |
| `docker compose down` | Stop infrastructure |
