export interface PaginatedResult<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface UncountedPaginatedResult<T> {
  items: T[];
  page: number;
  limit: number;
  hasNextPage: boolean;
}
