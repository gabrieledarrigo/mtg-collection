import { CollectionItemGetPayload } from "./generated/models";

export * from "./generated/browser";
export * from "./generated/models";
export * from "./generated/enums";

export type CollectionItemWithCard = CollectionItemGetPayload<{
  include: {
    card: true;
    purchases: true;
  };
}>;
