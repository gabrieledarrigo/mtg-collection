import styles from "./PaginationCount.module.css";

export type PaginationCountProps = {
  currentPage: number;
  size: number;
  totalItems: number;
  itemsName?: string;
};

export function PaginationCount({
  currentPage,
  size,
  totalItems,
  itemsName = "items",
}: PaginationCountProps) {
  const pageFirstItem = (currentPage - 1) * size + 1;
  const pageLastItem = Math.min(currentPage * size, totalItems);

  return (
    <span className={styles.count}>
      {totalItems === 0
        ? `0 ${itemsName} in your collection`
        : `${pageFirstItem} - ${pageLastItem} of ${totalItems} ${itemsName}`}
    </span>
  );
}
