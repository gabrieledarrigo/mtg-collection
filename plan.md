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
│   │   ├── Header/
│   │   │   ├── Header.tsx
│   │   │   └── Header.module.css
│   │   └── Navigation/
│   │       ├── Navigation.tsx
│   │       └── Navigation.module.css
│   │
│   ├── collection/
│   │   ├── page.tsx
│   │   ├── loading.tsx
│   │   └── components/
│   │       ├── CollectionView/
│   │       │   ├── CollectionView.tsx
│   │       │   └── CollectionView.module.css
│   │       ├── CardGrid/
│   │       │   ├── CardGrid.tsx
│   │       │   └── CardGrid.module.css
│   │       ├── CardList/
│   │       │   ├── CardList.tsx
│   │       │   └── CardList.module.css
│   │       ├── CardTile/
│   │       │   ├── CardTile.tsx
│   │       │   └── CardTile.module.css
│   │       ├── CardRow/
│   │       │   ├── CardRow.tsx
│   │       │   └── CardRow.module.css
│   │       ├── FilterBar/
│   │       │   ├── FilterBar.tsx
│   │       │   └── FilterBar.module.css
│   │       ├── FilterModal/
│   │       │   ├── FilterModal.tsx
│   │       │   └── FilterModal.module.css
│   │       ├── ColorFilter/
│   │       │   ├── ColorFilter.tsx
│   │       │   └── ColorFilter.module.css
│   │       ├── SearchBox/
│   │       │   ├── SearchBox.tsx
│   │       │   └── SearchBox.module.css
│   │       ├── ViewToggle/
│   │       │   ├── ViewToggle.tsx
│   │       │   └── ViewToggle.module.css
│   │       └── Pagination/
│   │           ├── Pagination.tsx
│   │           └── Pagination.module.css
│   │
│   └── cards/
│       └── [set]/
│           └── [number]/
│               └── [language]/
│                   ├── page.tsx
│                   ├── loading.tsx
│                   ├── not-found.tsx
│                   └── components/
│                       └── CardDetail/
│                           ├── CardDetail.tsx
│                           └── CardDetail.module.css
│
├── components/                       # UI primitives (Base UI wrappers)
│   ├── Icon/
│   │   ├── Icon.tsx
│   │   └── Icon.module.css
│   ├── Button/
│   │   ├── Button.tsx
│   │   └── Button.module.css
│   ├── Input/
│   │   ├── Input.tsx
│   │   └── Input.module.css
│   ├── Select/
│   │   ├── Select.tsx
│   │   └── Select.module.css
│   ├── Modal/
│   │   ├── Modal.tsx
│   │   └── Modal.module.css
│   ├── Badge/
│   │   ├── Badge.tsx
│   │   └── Badge.module.css
│   ├── Toggle/
│   │   ├── Toggle.tsx
│   │   └── Toggle.module.css
│   ├── ManaSymbol/
│   │   ├── ManaSymbol.tsx
│   │   └── ManaSymbol.module.css
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

## Convenzioni

- **Componenti React**: Ogni cartella componente include `.tsx`, `.module.css`, `.test.tsx`
- **Hooks**: Ogni hook include `.ts` e `.test.ts`
- **Nei subtask**: I file `.module.css` e `.test.tsx` sono impliciti e non elencati separatamente
- **Test**: Usare React Testing Library + Jest. Indicare il tipo di test nel subtask (es. "test rendering", "test interazione")

---

## US-000: Configurazione Test React

### Descrizione

Configurare l'ambiente di test per i componenti React usando Jest con jsdom e React Testing Library.

### Criteri di Accettazione

- [ ] Jest configurato con ambiente `jsdom` per test React
- [ ] React Testing Library installata e funzionante
- [ ] CSS modules mockati correttamente nei test
- [ ] `npm test` esegue sia test node che test React
- [ ] Test di esempio funzionante

### Dettagli Tecnici

**Dipendenze:**

```bash
npm install -D @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom identity-obj-proxy
```

**Subtask:**

1. Installare dipendenze testing React
2. Aggiornare `jest.config.js` con progetto `jsdom` per test React
3. Configurare `identity-obj-proxy` per mockare CSS modules
4. Creare `test/setup-react.ts` con setup `@testing-library/jest-dom`
5. Creare test di esempio per verificare configurazione

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

1. Creare `src/app/components/Header/Header.tsx` - test rendering logo e contenuto
2. Creare `src/app/components/Navigation/Navigation.tsx` - test rendering link
3. Integrare in `src/app/layout.tsx`
4. Aggiungere stili base e variabili CSS in `globals.css`

---

## US-003: Componenti UI Base (Base UI)

### Descrizione

Componenti UI riutilizzabili per mantenere consistenza visiva.

### Criteri di Accettazione

- [ ] Button con varianti (primary, secondary, icon)
- [ ] Icon component per icone SVG
- [ ] Input text con label opzionale
- [ ] Select dropdown con label
- [ ] Modal/Dialog
- [x] Badge
- [ ] Toggle (per grid/list view e yes/no)

### Dettagli Tecnici

**Subtask:**

1. Installare `@base-ui-components/react`
2. Creare `src/components/Icon/Icon.tsx` - test rendering icone
3. Creare `src/components/Button/Button.tsx` - test varianti (primary, secondary, icon) e click
4. Creare `src/components/Input/Input.tsx` - test onChange, placeholder e label
5. Creare `src/components/Select/Select.tsx` - test selezione opzioni e label
6. Creare `src/components/Modal/Modal.tsx` - test apertura/chiusura
7. Creare `src/components/Toggle/Toggle.tsx` - test toggle stato e varianti
8. Creare `src/components/index.ts` (barrel export)

**Base UI components:**

- Button → `@base-ui-components/react/button`
- Input → `@base-ui-components/react/field`
- Select → `@base-ui-components/react/select`
- Modal → `@base-ui-components/react/dialog`
- Toggle → `@base-ui-components/react/toggle-group`

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

1. Creare `src/lib/queries.ts` con `getCollectionItems()` (senza filtri) - test unitari query
2. Definire tipo `CollectionItemWithCard` in `src/lib/types.ts`
3. Creare `src/app/collection/page.tsx` (Server Component)
4. Creare `src/app/collection/loading.tsx`
5. Creare `src/app/collection/components/CollectionView/CollectionView.tsx` (Client) - test rendering griglia
6. Creare `src/app/collection/components/CardGrid/CardGrid.tsx` (Client) - test rendering items
7. Creare `src/app/collection/components/CardTile/CardTile.tsx` (senza link) - test rendering immagine e badge
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

1. Creare `src/hooks/useUpdateURL.ts` - test aggiornamento parametri URL
2. Creare `src/app/collection/components/ViewToggle/ViewToggle.tsx` (Client) - test toggle grid/list
3. Creare `src/app/collection/components/CardList/CardList.tsx` (Client) - test rendering righe
4. Creare `src/app/collection/components/CardRow/CardRow.tsx` - test rendering colonne
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

1. Estendere `getCollectionItems(filters)` in `src/lib/queries.ts` per supportare filtri - test filtri
2. Definire tipo `CollectionFilters` in `src/lib/types.ts`
3. Aggiornare `src/app/collection/page.tsx` per leggere `searchParams`
4. Creare `src/components/ManaSymbol/ManaSymbol.tsx` (usa mtg-font) - test rendering simboli WUBRG
5. Aggiungere `getAvailableSets()` a `src/lib/queries.ts` - test query
6. Creare `src/app/collection/components/FilterBar/FilterBar.tsx` (Client) - integration test filtri
7. Creare `src/app/collection/components/ColorFilter/ColorFilter.tsx` (Client) - test selezione colori
8. Creare `src/app/collection/components/SearchBox/SearchBox.tsx` (Client) - test input e debounce
9. Creare `src/hooks/useDebounce.ts` - test debounce timing
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

1. Creare `src/app/collection/components/FilterModal/FilterModal.tsx` (Client) - test apertura, selezione filtri, submit/cancel
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

1. Estendere `getCollectionItems()` per supportare paginazione (`page`, `limit`) - test paginazione
2. Aggiornare `src/app/collection/page.tsx` per leggere `page` da searchParams
3. Creare `src/app/collection/components/Pagination/Pagination.tsx` (Client) - test navigazione pagine
4. Calcolare `totalPages = Math.ceil(total / limit)`
5. On click: `updateURL({ page: newPage })`

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

1. Aggiungere `getCardBySetNumberLanguage(set, number, language)` a `src/lib/queries.ts` - test query
2. Creare `src/app/cards/[set]/[number]/[language]/page.tsx` (Server)
3. Creare `src/app/cards/[set]/[number]/[language]/loading.tsx`
4. Creare `src/app/cards/[set]/[number]/[language]/not-found.tsx`
5. Creare `src/app/cards/[set]/[number]/[language]/components/CardDetail/CardDetail.tsx` - test rendering dettagli
6. Chiamare `getCardBySetNumberLanguage(set, number, language)`
7. Implementare `generateMetadata()` per SEO
8. Aggiornare `CardTile.tsx` per linkare a `/cards/:set/:number/:language`
9. Aggiornare `CardRow.tsx` per linkare a `/cards/:set/:number/:language`

---

## Ordine di Implementazione

```
US-000 (Test Config)
        ↓
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

**Milestone 1 (Setup):** US-000, US-001, US-002, US-003
**Milestone 2 (Collection Page - MVP):** US-004, US-005
**Milestone 3 (Filtri):** US-006, US-007
**Milestone 4 (Paginazione):** US-008
**Milestone 5 (Card Detail):** US-009
