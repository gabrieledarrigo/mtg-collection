import { describe, it, expect } from "@jest/globals";
import { ScryfallCard, ScryfallLayout } from "@scryfall/api-types";
import { toCardData, WITHOUT_CARD_FACES, WITH_CARD_FACES } from "./parsing";
import { createMock } from "@test/helpers";
import { Language, Rarity } from "@database/index";

describe("parsing", () => {
  describe("toCardData", () => {
    it("should transform a normal, single-faced card", () => {
      const card = createMock<ScryfallCard.Any>({
        id: "8e88390b-6467-4c9d-9167-ca79379408cf",
        scryfall_uri:
          "https://scryfall.com/card/clb/165/en/breath-weapon?utm_source=api",
        oracle_id: "f3dd1f6d-f7d7-4358-8139-7495404f29c7",
        name: "Breath Weapon",
        set: "clb",
        set_name: "Clash at the Castle",
        collector_number: "165",
        lang: "en",
        rarity: "common",
        type_line: "Instant",
        oracle_text:
          "Breath Weapon deals 2 damage to each non-Dragon creature.",
        flavor_text:
          "Dragons don't take kindly to imitators, especially ones that breathe poorly.",
        artist: "John Doe",
        mana_cost: "{2}{R}",
        cmc: 3,
        color_identity: ["R"],
        layout: ScryfallLayout.Normal,
        image_uris: {
          small: "https://cards.scryfall.io/small/front/8/e/8e88390b.jpg",
          normal: "https://cards.scryfall.io/normal/front/8/e/8e88390b.jpg",
          large: "https://cards.scryfall.io/large/front/8/e/8e88390b.jpg",
        },
      });

      const result = toCardData(card);

      expect(result).toEqual({
        scryfallId: "8e88390b-6467-4c9d-9167-ca79379408cf",
        scryfallUri:
          "https://scryfall.com/card/clb/165/en/breath-weapon?utm_source=api",
        oracleId: "f3dd1f6d-f7d7-4358-8139-7495404f29c7",
        name: "Breath Weapon",
        printedName: null,
        setCode: "clb",
        setName: "Clash at the Castle",
        collectorNumber: "165",
        language: Language.EN,
        rarity: Rarity.COMMON,
        typeLine: "Instant",
        printedTypeLine: null,
        imageUrlSmall: "https://cards.scryfall.io/small/front/8/e/8e88390b.jpg",
        imageUrlNormal:
          "https://cards.scryfall.io/normal/front/8/e/8e88390b.jpg",
        imageUrlLarge: "https://cards.scryfall.io/large/front/8/e/8e88390b.jpg",
        oracleText: "Breath Weapon deals 2 damage to each non-Dragon creature.",
        flavorText:
          "Dragons don't take kindly to imitators, especially ones that breathe poorly.",
        artist: "John Doe",
        printedText: null,
        manaCost: "{2}{R}",
        cmc: 3,
        colorIdentity: ["R"],
        layout: ScryfallLayout.Normal,
        cardFaces: null,
      });
    });

    it("should transform a single-faced localized card with printed fields", () => {
      const card = createMock<ScryfallCard.Any>({
        id: "0174e40a-0ef5-4439-91e6-3fc39f482520",
        oracle_id: "f3dd1f6d-f7d7-4358-8139-7495404f29c7",
        name: "Breath Weapon",
        printed_name: "Arma del Respiro",
        set: "clb",
        collector_number: "165",
        lang: "it",
        rarity: "common",
        type_line: "Instant",
        printed_type_line: "Istantaneo",
        oracle_text:
          "Breath Weapon deals 2 damage to each non-Dragon creature.",
        printed_text:
          "Arma del Respiro infligge 2 danni a ogni creatura non Drago.",
        mana_cost: "{2}{R}",
        cmc: 3,
        color_identity: ["R"],
        layout: ScryfallLayout.Normal,
        image_uris: {
          small: "https://cards.scryfall.io/small/front/0/1/0174e40a.jpg",
          normal: "https://cards.scryfall.io/normal/front/0/1/0174e40a.jpg",
          large: "https://cards.scryfall.io/large/front/0/1/0174e40a.jpg",
        },
      });

      const result = toCardData(card);

      expect(result).toMatchObject({
        name: "Breath Weapon",
        printedName: "Arma del Respiro",
        language: Language.IT,
        typeLine: "Instant",
        printedTypeLine: "Istantaneo",
        oracleText: "Breath Weapon deals 2 damage to each non-Dragon creature.",
        printedText:
          "Arma del Respiro infligge 2 danni a ogni creatura non Drago.",
      });
    });

    it("should transform a token", () => {
      const card = createMock<ScryfallCard.Any>({
        id: "token-id",
        name: "Dragon Token",
        set: "clb",
        collector_number: "T1",
        lang: "en",
        rarity: "common",
        type_line: "Token Creature — Dragon",
        cmc: 0,
        color_identity: ["R"],
        layout: ScryfallLayout.Token,
        image_uris: {
          small: "https://cards.scryfall.io/small/token.jpg",
          normal: "https://cards.scryfall.io/normal/token.jpg",
          large: "https://cards.scryfall.io/large/token.jpg",
        },
      });

      const result = toCardData(card);

      expect(result).toMatchObject({
        name: "Dragon Token",
        oracleId: null,
        oracleText: null,
        manaCost: null,
        cmc: 0,
        layout: ScryfallLayout.Token,
      });
    });

    it.each(WITHOUT_CARD_FACES)(
      "should handle %s layout with direct image_uris",
      (layout) => {
        const card = createMock<ScryfallCard.Any>({
          id: "test-id",
          name: "Test Card",
          set: "tst",
          collector_number: "1",
          lang: "en",
          rarity: "common",
          type_line: "Instant",
          color_identity: [],
          layout,
          image_uris: {
            small: "https://example.com/small.jpg",
            normal: "https://example.com/normal.jpg",
            large: "https://example.com/large.jpg",
          },
        });

        const result = toCardData(card);

        expect(result.imageUrlSmall).toBe("https://example.com/small.jpg");
        expect(result.imageUrlNormal).toBe("https://example.com/normal.jpg");
        expect(result.imageUrlLarge).toBe("https://example.com/large.jpg");
      },
    );

    it("should transform a transform card using front face image", () => {
      const card = createMock<ScryfallCard.Transform>({
        id: "dfc-id",
        oracle_id: "dfc-oracle-id",
        name: "Delver of Secrets // Insectile Aberration",
        set: "isd",
        collector_number: "51",
        lang: "en",
        rarity: "common",
        type_line: "Creature — Human Wizard // Creature — Human Insect",
        mana_cost: "{U}",
        cmc: 1,
        color_identity: ["U"],
        layout: ScryfallLayout.Transform,
        card_faces: [
          {
            name: "Delver of Secrets",
            image_uris: {
              small: "https://cards.scryfall.io/small/delver-front.jpg",
              normal: "https://cards.scryfall.io/normal/delver-front.jpg",
              large: "https://cards.scryfall.io/large/delver-front.jpg",
            },
          },
          {
            name: "Insectile Aberration",
            image_uris: {
              small: "https://cards.scryfall.io/small/delver-back.jpg",
              normal: "https://cards.scryfall.io/normal/delver-back.jpg",
              large: "https://cards.scryfall.io/large/delver-back.jpg",
            },
          },
        ],
      });

      const result = toCardData(card);

      expect(result).toMatchObject({
        name: "Delver of Secrets // Insectile Aberration",
        imageUrlSmall: "https://cards.scryfall.io/small/delver-front.jpg",
        imageUrlNormal: "https://cards.scryfall.io/normal/delver-front.jpg",
        imageUrlLarge: "https://cards.scryfall.io/large/delver-front.jpg",
        layout: ScryfallLayout.Transform,
      });
      expect(result.cardFaces).not.toBeNull();
    });

    it("should transform a modal DFC card", () => {
      const card = createMock<ScryfallCard.ModalDfc>({
        id: "mdfc-id",
        oracle_id: "mdfc-oracle-id",
        name: "Kazandu Mammoth // Kazandu Valley",
        set: "znr",
        collector_number: "189",
        lang: "en",
        rarity: "rare",
        type_line: "Creature — Elephant // Land",
        mana_cost: "{1}{G}{G}",
        cmc: 3,
        color_identity: ["G"],
        layout: ScryfallLayout.ModalDfc,
        card_faces: [
          {
            name: "Kazandu Mammoth",
            type_line: "Creature — Elephant",
            image_uris: {
              small: "https://cards.scryfall.io/small/mammoth-front.jpg",
              normal: "https://cards.scryfall.io/normal/mammoth-front.jpg",
              large: "https://cards.scryfall.io/large/mammoth-front.jpg",
            },
          },
          {
            name: "Kazandu Valley",
            type_line: "Land",
            image_uris: {
              small: "https://cards.scryfall.io/small/mammoth-back.jpg",
              normal: "https://cards.scryfall.io/normal/mammoth-back.jpg",
              large: "https://cards.scryfall.io/large/mammoth-back.jpg",
            },
          },
        ],
      });

      const result = toCardData(card);

      expect(result).toMatchObject({
        name: "Kazandu Mammoth // Kazandu Valley",
        imageUrlNormal: "https://cards.scryfall.io/normal/mammoth-front.jpg",
        layout: ScryfallLayout.ModalDfc,
        rarity: Rarity.RARE,
      });
    });

    it.each(WITH_CARD_FACES)(
      "should handle %s layout with card_faces images",
      (layout) => {
        const card = {
          id: "test-id",
          name: "Test DFC",
          set: "tst",
          collector_number: "1",
          lang: "en",
          rarity: "common",
          type_line: "Land",
          color_identity: [],
          layout,
          card_faces: [
            {
              name: "Front",
              image_uris: {
                small: "https://example.com/front-small.jpg",
                normal: "https://example.com/front-normal.jpg",
                large: "https://example.com/front-large.jpg",
              },
            },
            {
              name: "Back",
              image_uris: {
                small: "https://example.com/back-small.jpg",
                normal: "https://example.com/back-normal.jpg",
                large: "https://example.com/back-large.jpg",
              },
            },
          ],
        } as unknown as ScryfallCard.Any;

        const result = toCardData(card);

        expect(result.imageUrlSmall).toBe(
          "https://example.com/front-small.jpg",
        );
        expect(result.imageUrlNormal).toBe(
          "https://example.com/front-normal.jpg",
        );
        expect(result.imageUrlLarge).toBe(
          "https://example.com/front-large.jpg",
        );
      },
    );

    it("should handle cards without mana cost", () => {
      const card = createMock<ScryfallCard.Any>({
        id: "land-id",
        oracle_id: "land-oracle-id",
        name: "Forest",
        set: "clb",
        collector_number: "467",
        lang: "en",
        rarity: "common",
        type_line: "Basic Land — Forest",
        cmc: 0,
        color_identity: ["G"],
        layout: ScryfallLayout.Normal,
        image_uris: {
          small: "https://cards.scryfall.io/small/forest.jpg",
          normal: "https://cards.scryfall.io/normal/forest.jpg",
          large: "https://cards.scryfall.io/large/forest.jpg",
        },
      });

      const result = toCardData(card);

      expect(result.manaCost).toBeNull();
      expect(result.cmc).toBe(0);
    });

    it("should handle multicolor cards", () => {
      const card = createMock<ScryfallCard.Any>({
        id: "multi-id",
        oracle_id: "multi-oracle-id",
        name: "Niv-Mizzet, Parun",
        set: "grn",
        collector_number: "192",
        lang: "en",
        rarity: "rare",
        type_line: "Legendary Creature — Dragon Wizard",
        oracle_text:
          "This spell can't be countered. Flying. Whenever you draw a card, Niv-Mizzet, Parun deals 1 damage to any target.",
        mana_cost: "{U}{U}{U}{R}{R}{R}",
        cmc: 6,
        color_identity: ["U", "R"],
        layout: ScryfallLayout.Normal,
        image_uris: {
          small: "https://cards.scryfall.io/small/niv.jpg",
          normal: "https://cards.scryfall.io/normal/niv.jpg",
          large: "https://cards.scryfall.io/large/niv.jpg",
        },
      });

      const result = toCardData(card);

      expect(result.colorIdentity).toEqual(["U", "R"]);
      expect(result.manaCost).toBe("{U}{U}{U}{R}{R}{R}");
      expect(result.cmc).toBe(6);
    });

    it("should throw an error for cards without a type_line", () => {
      const card = createMock<ScryfallCard.Any>({
        id: "8e88390b-6467-4c9d-9167-ca79379408cf",
        scryfall_uri:
          "https://scryfall.com/card/clb/165/en/breath-weapon?utm_source=api",
        oracle_id: "f3dd1f6d-f7d7-4358-8139-7495404f29c7",
        name: "Breath Weapon",
        set: "clb",
        set_name: "Clash at the Castle",
        collector_number: "165",
        lang: "en",
        rarity: "common",
        oracle_text:
          "Breath Weapon deals 2 damage to each non-Dragon creature.",
        flavor_text:
          "Dragons don't take kindly to imitators, especially ones that breathe poorly.",
        artist: "John Doe",
        mana_cost: "{2}{R}",
        cmc: 3,
        color_identity: ["R"],
        layout: ScryfallLayout.Normal,
        image_uris: {
          small: "https://cards.scryfall.io/small/front/8/e/8e88390b.jpg",
          normal: "https://cards.scryfall.io/normal/front/8/e/8e88390b.jpg",
          large: "https://cards.scryfall.io/large/front/8/e/8e88390b.jpg",
        },
      });

      expect(() => toCardData(card)).toThrow(
        "No type_line found for card: Breath Weapon (clb/165)",
      );
    });

    it("should throw an error for cards without images", () => {
      const card = createMock<ScryfallCard.Any>({
        id: "no-image-id",
        name: "No Image Card",
        set: "tst",
        collector_number: "1",
        lang: "en",
        rarity: "common",
        type_line: "Land",
        color_identity: [],
        layout: ScryfallLayout.Normal,
        image_uris: undefined,
      });

      expect(() => toCardData(card)).toThrow(
        "No image found for card: No Image Card (tst/1)",
      );
    });

    it("should throw an error for DFC without card_faces images", () => {
      const card = createMock<ScryfallCard.Any>({
        id: "dfc-no-image-id",
        name: "DFC Without Images",
        set: "tst",
        collector_number: "1",
        lang: "en",
        rarity: "common",
        type_line: "Land",
        color_identity: [],
        layout: ScryfallLayout.Transform,
        card_faces: [
          {
            name: "Front",
            image_uris: undefined,
          },
          {
            name: "Back",
            image_uris: {
              small: "https://example.com/back-small.jpg",
              normal: "https://example.com/back-normal.jpg",
              large: "https://example.com/back-large.jpg",
            },
          },
        ],
      });

      expect(() => toCardData(card)).toThrow(
        "No image found for card: DFC Without Images (tst/1)",
      );
    });

    it("should store card_faces as JSON string", () => {
      const cardFaces = [
        { name: "Front", oracle_text: "Front text" },
        { name: "Back", oracle_text: "Back text" },
      ];

      const card = createMock<ScryfallCard.Transform>({
        id: "dfc-id",
        name: "DFC Card",
        set: "tst",
        collector_number: "1",
        lang: "en",
        rarity: "common",
        type_line: "Land",
        color_identity: [],
        layout: ScryfallLayout.Transform,
        card_faces: [
          {
            ...cardFaces[0],
            image_uris: {
              small: "https://example.com/small.jpg",
              normal: "https://example.com/normal.jpg",
              large: "https://example.com/large.jpg",
            },
          },
          {
            ...cardFaces[1],
          },
        ],
      });

      const result = toCardData(card);

      expect(result.cardFaces).not.toBeNull();
      expect(typeof result.cardFaces).toBe("string");

      const parsed = JSON.parse(result.cardFaces as string) as {
        name: string;
      }[];

      expect(parsed).toHaveLength(2);
      expect(parsed[0]?.name).toBe("Front");
      expect(parsed[1]?.name).toBe("Back");
    });
  });
});
