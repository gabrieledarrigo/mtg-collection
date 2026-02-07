import Image from "next/image";
import { CollectionItemWithCard } from "@app/lib/queries";
import styles from "./Card.module.css";
import React, { useMemo } from "react";

export enum CardVariant {
  MEDIUM = "medium",
  LARGE = "large",
}

export type CardProps = {
  collectionItem: CollectionItemWithCard;
  variant?: CardVariant;
  footer?: React.ReactNode;
};

export const NO_IMAGE_AVAILABLE = "/images/no_image_available.png";

export function Card({
  collectionItem,
  variant = CardVariant.MEDIUM,
  footer,
}: CardProps) {
  const imageUrl = useMemo(() => {
    if (variant === CardVariant.MEDIUM) {
      return collectionItem.card.imageUrlNormal ?? NO_IMAGE_AVAILABLE;
    }

    return collectionItem.card.imageUrlLarge ?? NO_IMAGE_AVAILABLE;
  }, [collectionItem.card, variant]);

  return (
    <article
      key={collectionItem.cardId}
      className={`${styles.card} ${styles[`card--${variant}`]}`}
    >
      <figure className={styles.card__picture}>
        <Image src={imageUrl} alt={collectionItem.card.name} fill={true} />
      </figure>

      {footer && <footer className={styles.card__footer}>{footer}</footer>}
    </article>
  );
}
