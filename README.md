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

Děkuji

# Bookbot – KB Case Study Monorepo

NX monorepo s **NestJS** backendem, **Next.js** frontendem, sdílenými knihovnami a Prisma ORM.

## 🏗️ Architektura

```
kb-case-study-monorepo/
├── apps/
│   ├── bookbot-backend/          ← NestJS API (port 8080)
│   └── bookbot-frontend/         ← Next.js App Router (port 3000)
├── packages/
│   ├── book-utils/               ← Sdílené typy, mappery, ordering (@bookbot/book-utils)
│   ├── constants/                ← Sdílené enumy — Language, Binding, Condition (@bookbot/constants)
│   └── db/                       ← Prisma schéma, migrace, seed, PrismaModule (@bookbot/db)
├── docker-compose.yml            ← PostgreSQL 17 + Redis 7
└── .env.example
```

### Technologie

| Vrstva | Technologie |
|---|---|
| **Frontend** | Next.js 16, React 19, Tailwind CSS, React Query, next-intl |
| **Backend** | NestJS, Prisma ORM, nestjs-pino, class-validator |
| **Databáze** | PostgreSQL 17, Redis 7 (cache filtrů) |
| **Monorepo** | Nx, TypeScript project references |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- npm 10+
- Docker & Docker Compose (pro PostgreSQL a Redis)

### 1. Instalace závislostí

```sh
npm install
```

### 2. Nastavení prostředí

```sh
cp .env.example .env
```

Výchozí `.env` hodnoty:

| Proměnná | Výchozí hodnota | Popis |
|---|---|---|
| `DATABASE_URL` | `postgresql://bookbot:bookbot@localhost:5432/bookbot` | PostgreSQL connection string |
| `REDIS_URL` | `redis://localhost:6379` | Redis connection string |
| `NEXT_PUBLIC_API_URL` | `http://localhost:8080/api` | URL backendu pro frontend |
| `PORT` | `8080` | Port backendu (volitelné) |
| `CORS_ORIGIN` | `http://localhost:3000` | Povolený CORS origin (volitelné) |

### 3. Spuštění infrastruktury (PostgreSQL + Redis)

```sh
docker compose up -d
```

### 4. Vytvoření DB schématu a seed dat

```sh
npm run db:migrate
npm run db:seed
```

### 5. Spuštění aplikací

```sh
# Backend + Frontend najednou
npm run start:all

# Nebo jednotlivě:
npm run start:api    # NestJS API → http://localhost:8080/api
npm run start:web    # Next.js   → http://localhost:3000
```

---

## 📡 API Endpoints

### Book Listing

```
GET /api/books
```

Query parametry (všechny volitelné):

| Parametr | Typ | Příklad | Popis |
|---|---|---|---|
| `page` | number | `2` | Číslo stránky (výchozí 1) |
| `languages` | CSV string | `CS,EN` | Filtr jazyků |
| `bindings` | CSV string | `SOFT,HARD` | Filtr vazby |
| `conditions` | CSV string | `VERY_GOOD,GOOD` | Filtr stavu |
| `authorIds` | CSV number | `1,2` | Filtr podle ID autorů |
| `publisherIds` | CSV number | `3,5` | Filtr podle ID nakladatelství |
| `priceFrom` | number | `50` | Minimální cena |
| `priceTo` | number | `200` | Maximální cena |
| `yearFrom` | number | `2000` | Rok vydání od |
| `yearTo` | number | `2024` | Rok vydání do |
| `inStock` | boolean | `true` | Pouze skladem |

Příklad:

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

Vrací dostupné filtry s počty (jazyky, vazby, stavy, top autoři, top nakladatelství, cenový a rokový rozsah). Výsledek je cachován v Redis (1 hodina).

---

## 🎨 Frontend

Next.js App Router s těmito stránkami:

| Route | Popis | Rendering |
|---|---|---|
| `/` | Seznam knih s filtry a stránkováním | Server Component (SSR) |
| `/books/[slug]` | Detail knihy s edicemi a položkami | Server Component (SSR) |

### Komponenty

```
src/
├── app/
│   ├── layout.tsx          ← Root layout (next-intl, QueryProvider)
│   ├── page.tsx            ← Listing — Server Component
│   └── books/[slug]/
│       └── page.tsx        ← Detail — Server Component
├── components/
│   ├── BookCard.tsx        ← Karta knihy (Server Component)
│   ├── BookList.tsx        ← Grid knih (Server Component)
│   ├── EditionCard.tsx     ← Karta edice na detail stránce
│   ├── Filters.tsx         ← Sidebar filtry (Client Component)
│   ├── FilterSection.tsx   ← Sekce jednoho filtru (checkbox list)
│   ├── Pagination.tsx      ← Stránkování
│   ├── StockBadge.tsx      ← Badge dostupnosti (pure)
│   ├── PriceDisplay.tsx    ← Zobrazení ceny (pure)
│   └── QueryProvider.tsx   ← React Query provider
├── hooks/
│   └── useBooks.ts         ← React Query hooky
├── lib/
│   ├── api.ts              ← Fetch funkce (books, filters, detail)
│   └── config.ts           ← Konfigurace (API URL)
├── i18n/
│   └── request.ts          ← next-intl konfigurace
└── messages/
    └── cs.json             ← České překlady
```

### Lokalizace

Používá `next-intl`. Překlady jsou v `src/messages/cs.json`. Pro přidání nového jazyka stačí vytvořit nový soubor (např. `en.json`) a upravit `src/i18n/request.ts`.

---

## 🗃️ Databázový model

```
Book (titul)
 └── BookEdition (vydání — jazyk, vazba, rok, nakladatel)
      ├── BookItem (konkrétní výtisk — stav, cena, status)
      └── AuthorsOnBookEditions ← → Author

Publisher (nakladatelství)
```

Klíčový koncept: **Book** = abstraktní titul, **BookEdition** = konkrétní vydání (jazyk, vazba, nakladatel), **BookItem** = fyzický výtisk na skladě (stav, cena, dostupnost).

### Enumy

| Enum | Hodnoty |
|---|---|
| `Language` | CS, EN, DE, IT, FR, SK, ES, RU, PL |
| `Binding` | SOFT, HARD, STAPLED, RING, LEPORELO, FLEX, OTHER |
| `BookCondition` | VERY_GOOD, GOOD, DAMAGED |
| `CopyStatus` | AVAILABLE, SOLD, RESERVED |

---

## 📋 Užitečné příkazy

| Příkaz | Popis |
|---|---|
| `npm run start:api` | Spustit backend (port 8080) |
| `npm run start:web` | Spustit frontend (port 3000) |
| `npm run start:all` | Spustit backend + frontend najednou |
| `npm run db:migrate` | Spustit Prisma migrace |
| `npm run db:seed` | Naplnit DB seed daty |
| `npm run db:reset` | Reset DB + migrace + seed |
| `npx nx build bookbot-backend` | Build backendu |
| `npx nx build bookbot-frontend` | Build frontendu |
| `npx nx test bookbot-backend` | Testy backendu |
| `npx nx lint bookbot-backend` | Lint backendu |
| `npx nx graph` | Vizualizace dependency grafu |
| `docker compose up -d` | Spustit PostgreSQL + Redis |
| `docker compose down` | Zastavit infrastrukturu |
