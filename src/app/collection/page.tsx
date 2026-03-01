import { getCollectionItems } from "@app/lib/collection";
import { Pagination } from "@app/lib/pagination";
import { FilterBar, ViewToggle } from "./components/FilterBar/FilterBar";
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
  const view = params?.view as ViewToggle | undefined;
  console.log("[page.tsx SERVER] view from searchParams:", params?.view);

  return (
    <section>
      <header>
        <FilterBar />
      </header>

      <CollectionView view={view} collectionItems={collectionItems.items} />
    </section>
  );
}
