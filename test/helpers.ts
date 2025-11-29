export type PartialDeep<T> = T extends object
  ? T extends Array<infer U>
    ? Array<PartialDeep<U>>
    : { [K in keyof T]?: PartialDeep<T[K]> }
  : T;

export function createMock<T extends object>(values?: PartialDeep<T>): T {
  return (values ?? {}) as T;
}
