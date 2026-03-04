# Bookbot – KB Case Study Monorepo

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL 15+ (lokálně nebo Docker)
- npm 10+

### První spuštění (pořadí kroků je důležité)

**1. Instalace závislostí**
```sh
npm install
```

**2. Nastavení prostředí**
```sh
cp .env.example .env
# Upravte DATABASE_URL v .env dle vaší PostgreSQL konfigurace
# Např.: DATABASE_URL=postgresql://postgres:password@localhost:5432/bookbot
```

**3. Vytvoření DB schématu přes migrace**
```sh
npm run nx -- run db:migrate
# Prisma se zeptá na název migrace, např.: "init"
```

**4. Vygenerování Prisma klienta**
```sh
npm run nx -- run db:generate
# Vygeneruje TypeScript typy do packages/db/src/generated/client/
```

**5. Naplnění DB seed daty**
```sh
npm run nx -- run db:seed
# Vytvoří autory, nakladatelství, tituly, edice a kopie knih
```

**6. Spuštění NestJS API**
```sh
npm run nx -- run bookbot-backend:serve
# API běží na http://localhost:3000/api
```

### Užitečné příkazy

| Příkaz | Popis |
|---|---|
| `npm run nx -- run db:migrate` | Spustit Prisma migrace (dev) |
| `npm run nx -- run db:migrate:deploy` | Spustit migrace v produkci |
| `npm run nx -- run db:migrate:reset` | Reset DB + znovu spustit migrace |
| `npm run nx -- run db:generate` | Vygenerovat Prisma client |
| `npm run nx -- run db:seed` | Naplnit DB seed daty |
| `npm run nx -- run db:studio` | Otevřít Prisma Studio (GUI pro DB) |
| `npm run nx -- run bookbot-backend:serve` | Spustit API v dev módu |
| `npm run nx -- run bookbot-backend:build` | Build API |

### Struktura projektu

```
kb-case-study-monorepo/
  apps/
    bookbot-backend/        ← NestJS API (port 3000)
  packages/
    db/                     ← Sdílená Prisma knihovna (@bookbot/db)
      prisma/
        schema.prisma       ← DB schéma (modely, enums)
        seed.ts             ← Seed script s reálnými daty
      src/
        generated/client/   ← Prisma client (gitignored, generovat přes db:generate)
        prisma.service.ts   ← NestJS injectable PrismaService
        prisma.module.ts    ← NestJS global PrismaModule
        index.ts            ← Barrel export
```

---

# New Nx Repository

<a alt="Nx logo" href="https://nx.dev" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="45"></a>

✨ Your new, shiny [Nx workspace](https://nx.dev) is ready ✨.

[Learn more about this workspace setup and its capabilities](https://nx.dev/nx-api/js?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) or run `npx nx graph` to visually explore what was created. Now, let's get you up to speed!
## Try the full Nx platform
🚀 If you haven't connected to Nx Cloud yet, [complete your setup here](https://cloud.nx.app/setup/connect-workspace/guide). Get faster builds with remote caching, distributed task execution, and self-healing CI. [See how your workspace can benefit](#nx-cloud).
## Generate a library

```sh
npx nx g @nx/js:lib packages/pkg1 --publishable --importPath=@my-org/pkg1
```

## Run tasks

To build the library use:

```sh
npx nx build pkg1
```

To run any task with Nx use:

```sh
npx nx <target> <project-name>
```

These targets are either [inferred automatically](https://nx.dev/concepts/inferred-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) or defined in the `project.json` or `package.json` files.

[More about running tasks in the docs &raquo;](https://nx.dev/features/run-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Versioning and releasing

To version and release the library use

```
npx nx release
```

Pass `--dry-run` to see what would happen without actually releasing the library.

[Learn more about Nx release &raquo;](https://nx.dev/features/manage-releases?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Keep TypeScript project references up to date

Nx automatically updates TypeScript [project references](https://www.typescriptlang.org/docs/handbook/project-references.html) in `tsconfig.json` files to ensure they remain accurate based on your project dependencies (`import` or `require` statements). This sync is automatically done when running tasks such as `build` or `typecheck`, which require updated references to function correctly.

To manually trigger the process to sync the project graph dependencies information to the TypeScript project references, run the following command:

```sh
npx nx sync
```

You can enforce that the TypeScript project references are always in the correct state when running in CI by adding a step to your CI job configuration that runs the following command:

```sh
npx nx sync:check
```

[Learn more about nx sync](https://nx.dev/reference/nx-commands#sync)

## Nx Cloud

Nx Cloud ensures a [fast and scalable CI](https://nx.dev/ci/intro/why-nx-cloud?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) pipeline. It includes features such as:

- [Remote caching](https://nx.dev/ci/features/remote-cache?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Task distribution across multiple machines](https://nx.dev/ci/features/distribute-task-execution?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Automated e2e test splitting](https://nx.dev/ci/features/split-e2e-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Task flakiness detection and rerunning](https://nx.dev/ci/features/flaky-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

### Set up CI (non-Github Actions CI)

**Note:** This is only required if your CI provider is not GitHub Actions.

Use the following command to configure a CI workflow for your workspace:

```sh
npx nx g ci-workflow
```

[Learn more about Nx on CI](https://nx.dev/ci/intro/ci-with-nx#ready-get-started-with-your-provider?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Install Nx Console

Nx Console is an editor extension that enriches your developer experience. It lets you run tasks, generate code, and improves code autocompletion in your IDE. It is available for VSCode and IntelliJ.

[Install Nx Console &raquo;](https://nx.dev/getting-started/editor-setup?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Useful links

Learn more:

- [Learn more about this workspace setup](https://nx.dev/nx-api/js?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Learn about Nx on CI](https://nx.dev/ci/intro/ci-with-nx?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Releasing Packages with Nx release](https://nx.dev/features/manage-releases?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [What are Nx plugins?](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

And join the Nx community:

- [Discord](https://go.nx.dev/community)
- [Follow us on X](https://twitter.com/nxdevtools) or [LinkedIn](https://www.linkedin.com/company/nrwl)
- [Our Youtube channel](https://www.youtube.com/@nxdevtools)
- [Our blog](https://nx.dev/blog?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
