export interface PaginatedResponse<T> {
    items: T[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
}

/** Shape returned directly by the API (uses `page` not `pageNumber`). */
export interface ApiPagedResult<T> {
    items: T[];
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
}

export interface GridQueryParams {
    pageIndex: number;
    pageSize: number;
    sortField?: string;
    sortDirection?: 'asc' | 'desc';
    filters?: string; // Sieve-compatible filter string like: "name@=john,age>25"
}

export function createEmptyPaginatedResponse<T>(): PaginatedResponse<T> {
    return {
        items: [],
        totalCount: 0,
        pageNumber: 1,
        pageSize: 10,
        totalPages: 0,
        hasPreviousPage: false,
        hasNextPage: false
    };
}

export function toPagedResponse<TDto, TRow>(
    result: ApiPagedResult<TDto>,
    mapItem: (item: TDto) => TRow
): PaginatedResponse<TRow> {
    return {
        items: result.items.map(mapItem),
        totalCount: result.totalCount,
        pageNumber: result.page,
        pageSize: result.pageSize,
        totalPages: result.totalPages,
        hasPreviousPage: result.hasPreviousPage,
        hasNextPage: result.hasNextPage,
    };
}