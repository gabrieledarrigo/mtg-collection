# Entity-Relationship Diagram

ER diagram for the MTG collection database, generated from [prisma/schema.prisma](../prisma/schema.prisma).

Table and column names below reflect the physical database names (`@map` / `@@map`), i.e. snake_case.

## Relationships

- A **users** row owns many **collection_items** (one per unique card/foil/condition combination).
- A **cards** row (a specific printing) appears in many **collection_items**.
- A **collection_items** row has many **purchases** tracking how the copies were acquired.

```mermaid
erDiagram
    users            ||--o{ collection_items : "owns"
    cards            ||--o{ collection_items : "appears in"
    collection_items ||--o{ purchases        : "acquired via"

    users {
        string   id PK "uuid v7"
        string   username UK
        string   email UK
        datetime created_at
        datetime updated_at
    }

    cards {
        string   id PK "uuid v7"
        uuid     scryfall_id UK
        string   scryfall_uri
        uuid     oracle_id "nullable"
        string   name
        string   set_code
        string   set_name
        string   collector_number
        Language language
        Rarity   rarity
        string   type_line
        string   image_url_small "nullable"
        string   image_url_normal "nullable"
        string   image_url_large "nullable"
        string   oracle_text "nullable"
        string   flavor_text "nullable"
        string   printed_name "nullable"
        string   printed_type_line "nullable"
        string   printed_text "nullable"
        string   artist "nullable"
        string   mana_cost "nullable"
        float    cmc
        string   color_identity "string[]"
        string   layout
        json     card_faces "nullable"
        datetime created_at
        datetime updated_at
    }

    collection_items {
        string    id PK "uuid v7"
        string    user_id FK
        string    card_id FK
        boolean   foil
        Condition condition
        int       quantity
        datetime  created_at
        datetime  updated_at
    }

    purchases {
        string   id PK "uuid v7"
        string   collection_item_id FK
        int      quantity
        int      price_per_card
        Currency currency
        Source   source
        string   source_order_id
        datetime purchased_at
        datetime created_at
        datetime updated_at
    }
```

## Unique constraints

- **users**: `username`, `email`
- **cards**: `scryfall_id`; composite `(set_code, collector_number, language)` — one row per printing per language
- **collection_items**: composite `(user_id, card_id, foil, condition)` — one row per distinct condition/finish a user owns

## Enums

| Enum        | Values |
|-------------|--------|
| `Rarity`    | COMMON, UNCOMMON, RARE, SPECIAL, MYTHIC, BONUS |
| `Condition` | MINT, NEAR_MINT, EXCELLENT, GOOD, LIGHT_PLAYED, PLAYED, POOR |
| `Language`  | EN, ES, FR, DE, IT, PT, JA, KO, RU, ZHS, ZHT, HE, LA, GRC, AR, SA, PH |
| `Currency`  | EUR |
| `Source`    | CARDTRADER, DIRECT_PURCHASE, TRADE, GIFT, OTHER |
