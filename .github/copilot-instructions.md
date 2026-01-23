# MTG Collection - Copilot Instructions

## Project Overview

A Next.js 16 web app (React 19) for tracking Magic: The Gathering card collections. Uses PostgreSQL with Prisma ORM, imports card data from CardTrader CSV exports enriched via Scryfall API.

## Architecture

### Directory Structure

- `src/app/` - Next.js App Router pages and **shared UI components** (not `src/components/`)
- `src/database/` - Prisma client, generated types, seed scripts
- `src/importer/` - CLI tool for importing CardTrader orders
- `prisma/` - Schema and migrations

### Path Aliases (tsconfig.json)

Always use these aliases instead of relative paths:

- `@app/*` → `src/app/*`
- `@components/*` → `src/app/components/*`
- `@database/*` → `src/database/*`
- `@config/*` → `src/config/*`
- `@importer/*` → `src/importer/*`

## Component Conventions

### Structure

Each component lives in its own folder with co-located files:

```
ComponentName/
├── ComponentName.tsx       # Component implementation
├── ComponentName.module.css # CSS Modules styling
└── ComponentName.test.tsx  # Tests
```

### React Patterns

- **Client components**: Add `"use client"` directive when using hooks or browser APIs
- **UI primitives**: Wrap `@base-ui/react` components (see [Button.tsx](src/app/components/Button/Button.tsx), [Modal.tsx](src/app/components/Modal/Modal.tsx))
- **Props**: Define explicit `type ComponentProps = {...}` and export it
- **Enums**: Use TypeScript enums for variants (e.g., `ButtonVariant`, `IconName`)
- **CSS**: Use CSS Modules with BEM-like naming: `.component__element--modifier`

### Icon System

Icons are inline SVGs in [Icon.tsx](src/app/components/Icon/Icon.tsx). Add new icons to `IconName` enum and `iconPaths` record.

### MTG Mana Symbols

Custom font loaded from `public/styles/mtg-font.css` for mana cost display.

## Styling

### CSS Variables

Global design tokens in [globals.css](src/app/globals.css):

- Colors: `--color-primary`, `--color-neutral-{200,400,600,800}`, `--color-mtg-{w,u,g,r,b}`
- Spacing: `--spacing-{0-25,0-5,1,1-5,2,2-5,3}`
- Typography: `--size-{16..47}`, `--weight-{light..extra-bold}`

## Testing

### Two Jest Projects

1. **node** - For `src/database/` and `src/importer/` (`*.spec.ts`)
2. **react** - For `src/app/` components (`*.test.tsx`)

### Test Patterns

```tsx
import { jest, describe, it, expect } from "@jest/globals";
import { render, screen } from "@testing-library/react";
```

- Use `@testing-library/react` for component tests
- Use `data-testid` attributes for querying non-semantic elements (e.g., icons)
- CSS Modules are mocked via `identity-obj-proxy`
- Write simple, readable tests focusing on behavior.
- Don't nest `describe` blocks; Use a flat structure with clear `it` statements.

## Database

### Prisma Setup

- Schema: [prisma/schema.prisma](prisma/schema.prisma)
- Generated client outputs to `src/database/generated/`
- Uses `@prisma/adapter-pg` for PostgreSQL connection

### Key Models

- `Card` - MTG card data (from Scryfall)
- `CollectionItem` - User's owned cards (quantity, condition, foil status)
- `Purchase` - Purchase history per collection item

## Commands

```bash
npm run migrate:dev      # Create/apply migrations
npm run client:generate  # Regenerate Prisma client
npm run db:seed          # Seed database
npm run app:dev          # Start Next.js dev server
npm run test             # Run all tests
npm run typecheck        # TypeScript check
npm run format           # Prettier format
```

## Importer CLI

```bash
npm run import <csv-file>  # Import CardTrader order CSV
```

Fetches card data from Scryfall API with 150ms rate limiting. Errors logged to `data/scryfall_errors_*.csv`.
