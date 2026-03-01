import { getCollectionItems } from "@app/lib/collection";
import { Pagination } from "@app/lib/pagination";
import { FilterBar } from "./components/FilterBar/FilterBar";
import { CollectionView } from "./components/CollectionView/CollectionView";
import { Suspense } from "react";

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

  console.log("[page.tsx SERVER] view from searchParams:", params?.view);

  return (
    <section>
      <header>
        <Suspense fallback={null}>
          <FilterBar />
        </Suspense>
      </header>

      <Suspense fallback={null}>
        <CollectionView collectionItems={collectionItems.items} />
      </Suspense>
    </section>
  );
}
