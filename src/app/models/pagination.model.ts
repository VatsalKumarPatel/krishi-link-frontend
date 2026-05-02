export interface PaginatedResponse<T> {
    items: T[];
    totalCount: number;
    pageNumber: number;
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