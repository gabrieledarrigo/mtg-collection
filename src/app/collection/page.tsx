import { getCollectionItems } from "@app/lib/collection";
import { Pagination } from "@app/lib/pagination";
import { FilterBar } from "./components/FilterBar/FilterBar";
import { CollectionView } from "./components/CollectionView/CollectionView";
import { PaginationView } from "./components/PaginationView/PaginationView";
import { PaginationCount } from "@app/components/PaginationCount/PaginationCount";
import styles from "./page.module.css";
import { collectionSearchParams } from "./schemas/searchParams.schema";

export type CollectionProps = {
  searchParams?: Promise<Record<string, string>>;
};

export default async function Collection({ searchParams }: CollectionProps) {
  const { page, size, view, ...filters } = collectionSearchParams.parse(
    (await searchParams) ?? {},
  );
  const pagination = Pagination.from({
    page,
    size,
  });
  const collectionItems = await getCollectionItems(filters, pagination);

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
