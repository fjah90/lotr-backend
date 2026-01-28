// Base API response wrapper
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: ErrorResponse;
}

// Error response structure
export interface ErrorResponse {
    code: string;
    message: string;
    details?: Record<string, unknown>;
}

// Pagination metadata
export interface PaginationMeta {
    total: number;
    page: number;
    limit: number;
    pages: number;
}

// Paginated response
export interface PaginatedResponse<T> {
    success: boolean;
    data: T[];
    pagination: PaginationMeta;
}
