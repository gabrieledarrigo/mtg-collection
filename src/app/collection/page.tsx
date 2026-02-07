import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  getCollectionItems,
} from "@app/lib/queries";
import { CardsGrid } from "./components/CardsGrid/CardsGrid";

export type SearchParams = {
  searchParams?: {
    page?: number;
  };
};

export default async function Collection({ searchParams }: SearchParams) {
  const page = (await searchParams?.page) ?? DEFAULT_PAGE;
  const size = DEFAULT_PAGE_SIZE;

  const collectionItems = await getCollectionItems({
    page,
    size,
  });

  return (
    <section>
      <CardsGrid collectionItems={collectionItems.items} />
    </section>
  );
}
