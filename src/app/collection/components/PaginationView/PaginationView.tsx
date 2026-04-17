"use client";

import { Pagination } from "@app/components/Pagination/Pagination";
import { useUpdateSearchParams } from "@app/hooks/useUpdateSearchParams";
import { Page } from "@app/lib/pagination";
import { CollectionItem } from "@database/models";

export type PaginationViewProps = {
  collectionItems: Page<CollectionItem>;
};

export function PaginationView({ collectionItems }: PaginationViewProps) {
  const updateSearchParams = useUpdateSearchParams();

  return (
    <Pagination
      currentPage={collectionItems.page}
      size={collectionItems.size}
      totalItems={collectionItems.totalItems}
      itemsName="cards"
      onPageChange={(page) => updateSearchParams({ page: String(page) })}
      onSizeChange={(size) =>
        updateSearchParams({ page: "1", size: String(size) })
      }
    />
  );
}
