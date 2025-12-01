import type { ScryfallCard, ScryfallList } from "@scryfall/api-types";
import type { Language } from "@database/index";

export type SearchParams = {
  name: string;
  language: Language;
  collectorNumber?: string;
};

const CARDS_URL = "https://api.scryfall.com/cards";
const FETCH_DELAY = 150;

function createScryfallClient() {
  let lastRequestTime = 0;

  return async function (url: string): Promise<Response> {
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime;

    if (timeSinceLastRequest < FETCH_DELAY) {
      await new Promise((resolve) => setTimeout(resolve, FETCH_DELAY));
    }

    lastRequestTime = Date.now();

    return fetch(url, {
      headers: {
        Accept: "application/json",
        "User-Agent": "mtg-collection/1.0",
      },
    });
  };
}

const fetchScryfall = createScryfallClient();

export async function bySetAndNumber(
  setCode: string,
  collectorNumber: string,
  language: Language,
): Promise<ScryfallCard.Any> {
  const URL = `${CARDS_URL}/${setCode}/${collectorNumber}/${language.toLowerCase()}`;

  const response = await fetchScryfall(URL);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch card with data: ${setCode}, ${collectorNumber}, ${language}. ${response.status} ${response.statusText}`,
    );
  }

  const card = (await response.json()) as ScryfallCard.Any;

  return card;
}

export async function search(
  params: SearchParams,
): Promise<ScryfallList.Cards> {
  const searchParams = new URLSearchParams();
  const query = [params.name, `language:${params.language.toLowerCase()}`];
  searchParams.append("q", query.join("+"));
  searchParams.append("include_multilingual", "true");
  searchParams.append("include_extras", "true");
  searchParams.append("unique", "prints");

  const URL = `https://api.scryfall.com/cards/search?${searchParams.toString()}`;
  const response = await fetchScryfall(URL);

  if (!response.ok) {
    throw new Error(
      `Failed to search for card "${params.name}": ${response.status} ${response.statusText}`,
    );
  }

  const list = (await response.json()) as ScryfallList.Cards;

  return list;
}
