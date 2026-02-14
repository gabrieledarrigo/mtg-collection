import { CollectionItemWithCard } from "@app/lib/collection";
import { Card } from "../Card/Card";
import styles from "./CardsGrid.module.css";
import { Badge, BadgeVariant } from "@app/components/Badge/Badge";
import { ConditionTag } from "@app/lib/types";

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
          key={collectionItem.id}
          collectionItem={collectionItem}
          footer={
            <>
              <Badge
                text={collectionItem.quantity}
                variant={BadgeVariant.INFO}
                title={`Quantity: ${collectionItem.quantity}`}
              />
              <Badge
                text={ConditionTag[collectionItem.condition]}
                variant={BadgeVariant.SUCCESS}
                title={`Condition: ${ConditionTag[collectionItem.condition]}`}
              />
              <Badge
                text={collectionItem.card.language}
                variant={BadgeVariant.PRIMARY}
                title={`Language: ${collectionItem.card.language}`}
              />
              <Badge
                text={collectionItem.foil ? "YES" : "NO"}
                variant={BadgeVariant.WARNING}
                title={`Foil: ${collectionItem.foil ? "YES" : "NO"}`}
              />
            </>
          }
        />
      ))}
    </div>
  );
}
