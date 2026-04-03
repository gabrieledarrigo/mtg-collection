import Image from "next/image";
import { CollectionItemWithCard } from "@database/models";
import styles from "./Card.module.css";

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
  const imageUrl =
    variant === CardVariant.MEDIUM
      ? (collectionItem.card.imageUrlNormal ?? NO_IMAGE_AVAILABLE)
      : (collectionItem.card.imageUrlLarge ?? NO_IMAGE_AVAILABLE);

  return (
    <article className={`${styles.card} ${styles[`card--${variant}`]}`}>
      <figure className={styles.card__picture}>
        <Image
          src={imageUrl}
          alt={collectionItem.card.name}
          fill={true}
          title={`${collectionItem.card.name} - ${collectionItem.card.setName} (${collectionItem.card.setCode.toUpperCase()}) #${collectionItem.card.collectorNumber}`}
          sizes="100%"
        />
      </figure>

      {footer && <footer className={styles.card__footer}>{footer}</footer>}
    </article>
  );
}
