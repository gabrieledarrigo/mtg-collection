# Piano Implementativo - MTG Collection Web App

## Epic: Collection Web Interface

Sviluppo dell'interfaccia web per visualizzare e gestire la collezione di carte Magic: The Gathering.

---

## Struttura Target

```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                      # Home → redirect a /collection
│   ├── globals.css
│   │
│   ├── components/                   # Componenti condivisi app-wide
│   │   ├── Header.tsx
│   │   └── Navigation.tsx
│   │
│   ├── collection/
│   │   ├── page.tsx
│   │   ├── loading.tsx
│   │   └── components/
│   │       ├── CollectionView.tsx
│   │       ├── CardGrid.tsx
│   │       ├── CardList.tsx
│   │       ├── CardTile.tsx
│   │       ├── CardRow.tsx
│   │       ├── FilterBar.tsx
│   │       ├── FilterModal.tsx
│   │       ├── ColorFilter.tsx
│   │       ├── SearchBox.tsx
│   │       ├── ViewToggle.tsx
│   │       └── Pagination.tsx
│   │
│   └── cards/
│       └── [set]/
│           └── [number]/
│               └── [language]/
│                   ├── page.tsx
│                   ├── loading.tsx
│                   ├── not-found.tsx
│                   └── components/
│                       └── CardDetail.tsx
│
├── components/                       # UI primitives (Base UI wrappers)
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Select.tsx
│   ├── Modal.tsx
│   ├── Badge.tsx
│   ├── Checkbox.tsx
│   ├── ManaSymbol.tsx
│   └── index.ts
│
├── hooks/
│   ├── useDebounce.ts
│   └── useUpdateURL.ts
│
├── lib/
│   ├── queries.ts
│   ├── types.ts
│   └── utils.ts
│
├── config/
├── database/
└── importer/
```

---

## US-001: Setup Next.js e Struttura Base

### Descrizione

Configurare Next.js nel progetto esistente per sviluppare l'interfaccia web.

### Criteri di Accettazione

- [ ] Next.js configurato con App Router
- [ ] TypeScript paths aggiornati
- [ ] Immagini Scryfall abilitate
- [ ] `npm run dev` avvia l'applicazione

### Dettagli Tecnici

**Subtask:**

1. Installare dipendenze: `next`, `react`, `react-dom`, `@types/react`, `@types/react-dom`
2. Creare `next.config.ts` con `images.remotePatterns` per `cards.scryfall.io`
3. Aggiornare `tsconfig.json`: aggiungere `jsx`, `dom` lib, paths (`@/*`, `@hooks/*`, `@lib/*`)
4. Aggiornare `package.json` scripts: `dev`, `build`, `start`
5. Creare `src/app/layout.tsx` e `src/app/page.tsx` base
6. Aggiungere `.next` a `.gitignore`

---

## US-002: Layout e Navigazione

### Descrizione

Header con navigazione per accedere alle diverse sezioni dell'app.

### Criteri di Accettazione

- [ ] Header con logo "MTG Collection"
- [ ] Link navigazione: "Collection"
- [ ] Layout responsive
- [ ] Header presente in tutte le pagine

### Dettagli Tecnici

**Subtask:**

1. Creare `src/app/components/Header.tsx`
2. Creare `src/app/components/Navigation.tsx`
3. Integrare in `src/app/layout.tsx`
4. Aggiungere stili base in `globals.css`

---

## US-003: Componenti UI Base (Base UI)

### Descrizione

Componenti UI riutilizzabili per mantenere consistenza visiva.

### Criteri di Accettazione

- [ ] Button con varianti (primary, secondary, ghost)
- [ ] Input text
- [ ] Select dropdown
- [ ] Modal/Dialog
- [ ] Badge
- [ ] Checkbox

### Dettagli Tecnici

**Subtask:**

1. Installare `@base-ui-components/react`
2. Creare `src/components/Button.tsx`
3. Creare `src/components/Input.tsx`
4. Creare `src/components/Select.tsx`
5. Creare `src/components/Modal.tsx`
6. Creare `src/components/Badge.tsx`
7. Creare `src/components/Checkbox.tsx`
8. Creare `src/components/index.ts` (barrel export)

---

## US-004: Pagina Collection con Vista Grid

### Descrizione

Pagina base della collezione con visualizzazione a griglia.

### Criteri di Accettazione

- [ ] URL: `/collection`
- [ ] Mostra tutte le carte in griglia (4 colonne desktop, 2 mobile)
- [ ] Ogni carta mostra immagine e badge quantità
- [ ] Empty state se collezione vuota
- [ ] Loading state durante fetch

### Dettagli Tecnici

**Subtask:**

1. Creare `src/lib/queries.ts` con `getCollectionItems()` (senza filtri)
2. Definire tipo `CollectionItemWithCard` in `src/lib/types.ts`
3. Creare `src/app/collection/page.tsx` (Server Component)
4. Creare `src/app/collection/loading.tsx`
5. Creare `src/app/collection/components/CollectionView.tsx` (Client Component)
6. Creare `src/app/collection/components/CardGrid.tsx` (Client)
7. Creare `src/app/collection/components/CardTile.tsx` (senza link, solo visualizzazione)
8. Usare `next/image` per immagini ottimizzate
9. Empty state con messaggio descrittivo

---

## US-005: Vista List + Toggle Grid/List

### Descrizione

Aggiunge la vista tabella e il toggle per alternare tra Grid e List.

### Criteri di Accettazione

- [ ] Toggle Grid/List view (aggiorna URL con `?view=grid` o `?view=list`)
- [ ] Vista tabella con colonne: Quantity, Name, Set, Condition, Language, Foil, Price
- [ ] Righe cliccabili (predisposizione, link aggiunto in US-009)
- [ ] Responsive (scroll orizzontale su mobile)
- [ ] Formattazione prezzo in EUR
- [ ] Badge per Foil (YES/NO)

### Dettagli Tecnici

**Subtask:**

1. Creare `src/hooks/useUpdateURL.ts`
2. Creare `src/app/collection/components/ViewToggle.tsx` (Client)
3. Creare `src/app/collection/components/CardList.tsx` (Client)
4. Creare `src/app/collection/components/CardRow.tsx`
5. Aggiornare `CollectionView.tsx` per renderizzare Grid/List in base a `?view`
6. Usare `useRouter`, `useSearchParams`, `usePathname`
7. Usare `useTransition` per loading state durante cambio vista

---

## US-006: FilterBar - Filtri Rapidi

### Descrizione

Barra con filtri rapidi per set, colore e ricerca.

### Criteri di Accettazione

- [ ] Dropdown selezione Set
- [ ] Filtro colori WUBRG (toggle multiplo)
- [ ] Campo ricerca con debounce (300ms)
- [ ] Bottone per aprire filtri avanzati
- [ ] URL aggiornato con filtri applicati

### Dettagli Tecnici

**Subtask:**

1. Estendere `getCollectionItems(filters)` in `src/lib/queries.ts` per supportare filtri
2. Definire tipo `CollectionFilters` in `src/lib/types.ts`
3. Aggiornare `src/app/collection/page.tsx` per leggere `searchParams`
4. Creare `src/components/ManaSymbol.tsx` (usa mtg-font da `public/styles/mtg-font.css`)
5. Aggiungere `getAvailableSets()` a `src/lib/queries.ts`
6. Creare `src/app/collection/components/FilterBar.tsx` (Client)
7. Creare `src/app/collection/components/ColorFilter.tsx` (Client) - usa `ManaSymbol`
8. Creare `src/app/collection/components/SearchBox.tsx` (Client)
9. Creare `src/hooks/useDebounce.ts`
10. Integrare con `useUpdateURL()`

**Filtri supportati:**

- `search`: nome carta (case insensitive, su `name` e `printedName`)
- `setCode`: codice set
- `colors`: array di colori (W, U, B, R, G)
- `rarity`: COMMON, UNCOMMON, RARE, MYTHIC
- `language`: EN, IT, etc.
- `condition`: NEAR_MINT, PLAYED, etc.
- `foil`: boolean

**URL esempio:** `/collection?search=bolt&set=m21&colors=R`

---

## US-007: FilterModal - Filtri Avanzati

### Descrizione

Modal con tutti i filtri disponibili per ricerche precise.

### Criteri di Accettazione

- [ ] Modal con filtri: Set, Condition, Language, Rarity, Colors, Foil
- [ ] Bottoni Cancel e Submit
- [ ] Submit applica filtri e chiude modal
- [ ] Cancel chiude senza applicare

### Dettagli Tecnici

**Subtask:**

1. Creare `src/app/collection/components/FilterModal.tsx` (Client)
2. Usare `Modal` da `@/components`
3. Stato locale per filtri pending
4. On submit: `onApply(pendingFilters)` → aggiorna URL

---

## US-008: Paginazione

### Descrizione

Navigazione tra le pagine della collezione.

### Criteri di Accettazione

- [ ] Mostra "Showing X of Y"
- [ ] Bottone "Load more" o navigazione pagine
- [ ] Aggiorna URL con `?page=N`

### Dettagli Tecnici

**Subtask:**

1. Estendere `getCollectionItems()` per supportare paginazione (`page`, `limit`)
2. Aggiornare `src/app/collection/page.tsx` per leggere `page` da searchParams
3. Creare `src/app/collection/components/Pagination.tsx` (Client)
4. Calcolare `totalPages = Math.ceil(total / limit)`
5. On click: `updateURL({ page: newPage })``

---

## US-009: Pagina Card Detail

### Descrizione

Dettagli completi di una carta specifica.

### Criteri di Accettazione

- [ ] URL: `/cards/:set/:number/:language`
- [ ] Immagine carta (large)
- [ ] Nome, Type line, Oracle text, Flavor text
- [ ] Set, Collector number, Artist
- [ ] Info collezione: Quantity, Condition, Language, Foil, Prezzo totale
- [ ] Bottone "Back" → torna a collection
- [ ] Click su carta in Grid/List → naviga a dettaglio

### Dettagli Tecnici

**Subtask:**

1. Aggiungere `getCardBySetNumberLanguage(set, number, language)` a `src/lib/queries.ts`
2. Creare `src/app/cards/[set]/[number]/[language]/page.tsx` (Server)
3. Creare `src/app/cards/[set]/[number]/[language]/loading.tsx`
4. Creare `src/app/cards/[set]/[number]/[language]/not-found.tsx`
5. Creare `src/app/cards/[set]/[number]/[language]/components/CardDetail.tsx` - usa `ManaSymbol` per mana cost
6. Chiamare `getCardBySetNumberLanguage(set, number, language)`
7. Implementare `generateMetadata()` per SEO
8. Aggiornare `CardTile.tsx` per linkare a `/cards/:set/:number/:language`
9. Aggiornare `CardRow.tsx` per linkare a `/cards/:set/:number/:language`

---

## Ordine di Implementazione

```
US-001 → US-002 → US-003
                    ↓
         US-004 (Collection Page + Grid)
                    ↓
         US-005 (List + Toggle)
                    ↓
         US-006 → US-007 (Filtri)
                    ↓
              US-008 (Paginazione)
                    ↓
         US-009 (Card Detail + Link)
```

**Milestone 1 (Setup):** US-001, US-002, US-003
**Milestone 2 (Collection Page - MVP):** US-004, US-005
**Milestone 3 (Filtri):** US-006, US-007
**Milestone 4 (Paginazione):** US-008
**Milestone 5 (Card Detail):** US-009
