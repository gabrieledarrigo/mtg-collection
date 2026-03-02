import { getCollectionItems } from "@app/lib/collection";
import { Pagination } from "@app/lib/pagination";
import { FilterBar } from "./components/FilterBar/FilterBar";
import { parseViewToggle } from "@app/lib/view";
import { CollectionView } from "./components/CollectionView/CollectionView";

export type SearchParams = {
  searchParams?: Promise<{
    page?: string;
    view?: string;
  }>;
};

export default async function Collection({ searchParams }: SearchParams) {
  const params = await searchParams;
  const pagination = Pagination.fromParams({ page: params?.page });
  const collectionItems = await getCollectionItems(pagination);
  const view = parseViewToggle(params?.view ?? null);

  return (
    <section>
      <header>
        <FilterBar />
      </header>

      <CollectionView view={view} collectionItems={collectionItems.items} />
    </section>
  );
}
