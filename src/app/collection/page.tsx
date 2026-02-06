import { Badge, BadgeVariant } from "@app/components/Badge/Badge";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  getCollectionItems,
} from "@app/lib/queries";
import Image from "next/image";

export type SearchParams = {
  searchParams?: {
    page?: number;
  };
};

export default async function Collection({ searchParams }: SearchParams) {
  const page = (await searchParams?.page) ?? DEFAULT_PAGE;
  const size = DEFAULT_PAGE_SIZE;

  const collectionItems = await getCollectionItems({
    page,
    size,
  });

  return (
    <section>
      <div>
        {collectionItems.totalItems === 0 && (
          <div>No cards in your collection!</div>
        )}

        {collectionItems.items.map((collectionItem) => (
          <div key={collectionItem.cardId}>
            <h3>{collectionItem.card.name}</h3>
            <Image
              src={
                collectionItem.card.imageUrlNormal ||
                "https://cards.scryfall.io/large/front/1/7/179e954f-1d90-4ef4-b800-25845cc338e2.jpg?1562052788"
              }
              width={245}
              height={341}
              alt={collectionItem.card.name}
            />
            <Badge text={collectionItem.quantity} variant={BadgeVariant.INFO} />
          </div>
        ))}
      </div>
    </section>
  );
}
