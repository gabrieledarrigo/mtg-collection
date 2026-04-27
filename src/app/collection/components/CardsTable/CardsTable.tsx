"use client";

import { ConditionLabel } from "@app/lib/types";
import { formatCollectionItemTotalPrice } from "@app/lib/format";
import { CollectionItemWithCard } from "@database/models";
import styles from "./CardsTable.module.css";

export type CardsTableProps = {
  collectionItems: CollectionItemWithCard[];
};

export function CardsTable({ collectionItems }: CardsTableProps) {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Quantity</th>
          <th>Name</th>
          <th>Color</th>
          <th>Set</th>
          <th>Condition</th>
          <th>Foil</th>
          <th>Language</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>
        {collectionItems.map((collectionItem) => (
          <tr key={collectionItem.id}>
            <td>{collectionItem.quantity}</td>
            <td>{collectionItem.card.name}</td>
            <td>
              {collectionItem.card.colorIdentity.map((color) => (
                <i
                  key={color}
                  className={`mi mi-mana mi-${color.toLowerCase()}`}
                  role="img"
                  aria-label={`Mana ${color}`}
                />
              ))}
            </td>
            <td>
              {`${collectionItem.card.setCode.toUpperCase()} - #${collectionItem.card.collectorNumber}`}
            </td>
            <td>{ConditionLabel[collectionItem.condition]}</td>
            <td>{collectionItem.foil ? "YES" : "NO"}</td>
            <td>{collectionItem.card.language}</td>
            <td className="align-right">
              {formatCollectionItemTotalPrice(collectionItem)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
