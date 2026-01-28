// Database review entity
export interface Review {
    id: number;
    movie_id: string;
    user_name: string;
    rating: number;
    comment: string | null;
    created_at: Date;
    updated_at: Date;
}

// DTO for creating a review
export interface CreateReviewDto {
    movieId: string;
    userName: string;
    rating: number;
    comment?: string;
}

// DTO for review response
export interface ReviewResponse {
    id: number;
    movieId: string;
    userName: string;
    rating: number;
    comment: string | null;
    createdAt: string;
    updatedAt: string;
}

// Query parameters for fetching reviews
export interface ReviewQueryParams {
    movieId?: string;
    page?: number;
    limit?: number;
}
