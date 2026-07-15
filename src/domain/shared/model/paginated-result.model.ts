export interface PaginatedResult<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PublicPaginatedResult<T> {
  items: T[];
  page: number;
  limit: number;
  hasNextPage: boolean;
}
