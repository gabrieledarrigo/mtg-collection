import { CollectionItemWithCard } from "@app/lib/collection";
import { Card } from "../Card/Card";
import styles from "./CardsGrid.module.css";
import { Badge, BadgeVariant } from "@app/components/Badge/Badge";

export type CardsGridProps = {
  collectionItems: CollectionItemWithCard[];
};

export function CardsGrid({ collectionItems }: CardsGridProps) {
  return (
    <div className={styles.grid}>
      {collectionItems.length === 0 && (
        <div>There are no cards in your collection!</div>
      )}

      {collectionItems.map((collectionItem) => (
        <Card
          key={collectionItem.cardId}
          collectionItem={collectionItem}
          footer={
            <>
              <Badge
                text={collectionItem.quantity}
                variant={BadgeVariant.INFO}
              />
              <Badge
                text={collectionItem.condition}
                variant={BadgeVariant.SUCCESS}
              />
              <Badge
                text={collectionItem.card.language}
                variant={BadgeVariant.PRIMARY}
              />
              <Badge
                text={collectionItem.foil ? "YES" : "NO"}
                variant={BadgeVariant.WARNING}
              />
            </>
          }
        />
      ))}
    </div>
  );
}
