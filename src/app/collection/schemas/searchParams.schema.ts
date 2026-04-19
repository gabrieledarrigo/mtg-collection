import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@app/lib/pagination";
import { Color, ViewToggle } from "@app/lib/types";
import { Condition, Language, Rarity } from "@database/models";
import { z } from "zod";

export const collectionSearchParams = z.object({
  page: z.coerce.number().min(1).default(DEFAULT_PAGE).catch(DEFAULT_PAGE),
  size: z.coerce
    .number()
    .min(1)
    .default(DEFAULT_PAGE_SIZE)
    .catch(DEFAULT_PAGE_SIZE),
  view: z.enum(ViewToggle).default(ViewToggle.GRID).catch(ViewToggle.GRID),
  search: z.string().optional(),
  setCode: z.string().optional(),
  colors: z
    .string()
    .transform((s) => s.split(",") as Color[])
    .optional(),
  rarity: z.enum(Rarity).optional().catch(undefined),
  language: z.enum(Language).optional().catch(undefined),
  condition: z.enum(Condition).optional().catch(undefined),
  foil: z
    .stringbool({
      truthy: ["true"],
      falsy: ["false"],
    })
    .optional()
    .catch(undefined),
});
