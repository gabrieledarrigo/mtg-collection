export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 20;

export type Page<T> = {
  items: T[];
  page: number;
  totalItems: number;
};

export class Pagination {
  public readonly page: number;
  public readonly size: number;
  public readonly skip: number;

  private constructor(page: number, size: number) {
    this.page = page;
    this.size = size;
    this.skip = (page - 1) * size;
  }

  public static fromParams(params: {
    page?: string;
    size?: string;
  }): Pagination {
    const parsedPage = parseInt(params?.page ?? `${DEFAULT_PAGE}`);
    const parsedSize = parseInt(params?.size ?? `${DEFAULT_PAGE_SIZE}`);

    const page = Math.max(
      1,
      Number.isNaN(parsedPage) ? DEFAULT_PAGE : parsedPage,
    );
    const size = Math.max(
      1,
      Number.isNaN(parsedSize) ? DEFAULT_PAGE_SIZE : parsedSize,
    );

    return new Pagination(page, size);
  }

  public static default(): Pagination {
    return new Pagination(DEFAULT_PAGE, DEFAULT_PAGE_SIZE);
  }
}
