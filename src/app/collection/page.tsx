import { getCollectionItems } from "@app/lib/collection";
import { Pagination } from "@app/lib/pagination";
import { FilterBar } from "./components/FilterBar/FilterBar";
import { parseViewToggle } from "@app/lib/view";
import { CollectionView } from "./components/CollectionView/CollectionView";
import { PaginationView } from "./components/PaginationView/PaginationView";
import { PaginationCount } from "@app/components/PaginationCount/PaginationCount";
import styles from "./page.module.css";

export type SearchParams = {
  searchParams?: Promise<{
    page?: string;
    size?: string;
    view?: string;
  }>;
};

export default async function Collection({ searchParams }: SearchParams) {
  const params = await searchParams;
  const pagination = Pagination.fromParams({
    page: params?.page,
    size: params?.size,
  });
  const collectionItems = await getCollectionItems(pagination);
  const view = parseViewToggle(params?.view ?? null);

  return (
    <section>
      <header className={styles.header}>
        <FilterBar />
      </header>

      <div className={styles["collection-count"]}>
        <PaginationCount
          currentPage={collectionItems.page}
          size={collectionItems.size}
          totalItems={collectionItems.totalItems}
          itemsName="cards"
        />
      </div>

      <CollectionView view={view} collectionItems={collectionItems.items} />

      <footer className={styles.footer}>
        <PaginationView collectionItems={collectionItems} />
      </footer>
    </section>
  );
}
