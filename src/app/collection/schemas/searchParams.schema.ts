import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@app/lib/pagination";
import {
  Color,
  SortCriteria,
  SortDirection,
  SortField,
  ViewToggle,
} from "@app/lib/types";
import { Condition, Language, Rarity } from "@database/models";
import { z } from "zod";

const SORT_PARAMS_REGEX = new RegExp(
  `^(?<field>${Object.values(SortField).join("|")})\\.(?<direction>${Object.values(SortDirection).join("|")})$`,
);

/**
 * Transforms string in the form ${SortField}.{SortDiretction} into a SortCriteria object.
 * Return undefined if the string doesn't match SORT_PARAMS_REGEX
 *
 * @param str The input string
 * @returns A SortCriteria object or undefined otherwise
 */
export function transformSortParam(str: string): SortCriteria | undefined {
  const result = str.match(SORT_PARAMS_REGEX);

  const field = result?.groups?.field;
  const direction = result?.groups?.direction;

  if (!field || !direction) {
    return;
  }

  return {
    [field]: direction,
  };
}

/**
 * Define a zod union for the given schema, and transform the value into an array, if needed.
 *
 * @param schema The zod schema
 * @returns The trasnformed schema into an array
 */
function arrayable<T extends z.ZodType>(schema: T) {
  return z
    .union([schema, z.array(schema)])
    .transform((value) => (Array.isArray(value) ? value : [value]));
}

export const collectionSearchParams = z.object({
  page: z.coerce
    .number()
    .int()
    .min(1)
    .default(DEFAULT_PAGE)
    .catch(DEFAULT_PAGE),
  size: z.coerce
    .number()
    .int()
    .min(1)
    .default(DEFAULT_PAGE_SIZE)
    .catch(DEFAULT_PAGE_SIZE),
  view: z.enum(ViewToggle).default(ViewToggle.GRID).catch(ViewToggle.GRID),
  search: z.string().optional().catch(undefined),
  setCode: arrayable(z.string()).optional().catch(undefined),
  color: arrayable(z.enum(Color)).optional().catch(undefined),
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
  sort: arrayable(z.string())
    .transform((values) => {
      return values.reduce<SortCriteria>(
        (criteria, value) => ({
          ...criteria,
          ...transformSortParam(value),
        }),
        {},
      );
    })
    .optional()
    .catch(undefined),
});
