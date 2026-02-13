import { getCollectionItems } from "@app/lib/collection";
import { CardsGrid } from "./components/CardsGrid/CardsGrid";
import { Pagination } from "@app/lib/pagination";

export type SearchParams = {
  searchParams?: Promise<{
    page?: string;
  }>;
};

export default async function Collection({ searchParams }: SearchParams) {
  const params = await searchParams;
  const pagination = Pagination.fromParams(params ?? {});

  const collectionItems = await getCollectionItems(pagination);

  return (
    <section>
      <CardsGrid collectionItems={collectionItems.items} />
    </section>
  );
}
