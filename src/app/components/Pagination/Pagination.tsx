"use client";

import { useMemo } from "react";
import { Button, ButtonVariant } from "../Button/Button";
import styles from "./Pagination.module.css";
import { Icon, IconName } from "../Icon/Icon";
import { Select } from "../Select/Select";
import { PaginationCount } from "../PaginationCount/PaginationCount";

export type PaginationProps = {
  currentPage: number;
  size: number;
  totalItems: number;
  itemsName?: string;
  onPageChange: (page: number) => void;
  onSizeChange: (size: number) => void;
};

export function Pagination({
  currentPage,
  size,
  totalItems,
  itemsName = "items",
  onPageChange,
  onSizeChange,
}: PaginationProps) {
  const totalPages = Math.ceil(totalItems / size);

  const pages = useMemo(() => {
    const delta = 2;
    const left = currentPage - delta;
    const right = currentPage + delta;
    const results: (string | number)[] = [];
    let previousPage = 0;

    for (let page = 1; page <= totalPages; page++) {
      if (
        page === 1 ||
        page === totalPages ||
        (page >= left && page <= right)
      ) {
        if (page - previousPage > 2) {
          results.push("...");
        } else if (page - previousPage === 2) {
          results.push(previousPage + 1);
        }

        results.push(page);
        previousPage = page;
      }
    }

    return results;
  }, [currentPage, totalPages]);

  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage >= totalPages;

  return (
    <div className={styles.pagination}>
      <div className={styles.pagination__nav}>
        <Button
          disabled={isFirstPage}
          variant={ButtonVariant.NEUTRAL}
          title="Previous page"
          onClick={() => onPageChange(currentPage - 1)}
        >
          <Icon name={IconName.ARROW_BACKWARD} size={20} />
          <span className={styles.pagination__label}>Previous</span>
        </Button>

        <div className={styles.pagination__pages}>
          {pages.map((page, i) =>
            page === "..." ? (
              <div key={i} className={styles.pagination__ellipsis}>
                ...
              </div>
            ) : (
              <Button
                key={i}
                variant={
                  page === currentPage
                    ? ButtonVariant.PRIMARY
                    : ButtonVariant.NEUTRAL
                }
                title={`Page: ${page}`}
                onClick={() => onPageChange(page as number)}
              >
                {page}
              </Button>
            ),
          )}
        </div>

        <Button
          disabled={isLastPage}
          variant={ButtonVariant.NEUTRAL}
          title="Next page"
          onClick={() => onPageChange(currentPage + 1)}
        >
          <span className={styles.pagination__label}>Next</span>
          <Icon name={IconName.ARROW_FORWARD} size={20} />
        </Button>
      </div>

      <div className={styles.pagination__size}>
        <span>Per page</span>
        <Select
          options={[
            { value: "12", label: "12" },
            { value: "24", label: "24" },
            { value: "48", label: "48" },
            { value: "96", label: "96" },
            { value: "120", label: "120" },
          ]}
          value={String(size)}
          onChange={(value) => onSizeChange(Number(value))}
          showClearButton={false}
        />
      </div>

      <div className={styles.pagination__count}>
        <PaginationCount
          currentPage={currentPage}
          size={size}
          totalItems={totalItems}
          itemsName={itemsName}
        />
      </div>
    </div>
  );
}
