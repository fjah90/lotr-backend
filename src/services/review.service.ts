import { pool } from '../config/database.js';
import type {
    Review,
    CreateReviewDto,
    ReviewResponse,
    ReviewQueryParams,
} from '../types/review.types.js';
import type { PaginatedResponse } from '../types/common.types.js';
import { DatabaseError, NotFoundError } from '../middleware/error-handler.js';
import { sanitizeInput } from '../utils/sanitize.js';

class ReviewService {
    private mapReviewToResponse(review: Review): ReviewResponse {
        return {
            id: review.id,
            movieId: review.movie_id,
            userName: review.user_name,
            rating: review.rating,
            comment: review.comment,
            createdAt: review.created_at.toISOString(),
            updatedAt: review.updated_at.toISOString(),
        };
    }

    async createReview(data: CreateReviewDto): Promise<ReviewResponse> {
        try {
            const query = `
        INSERT INTO reviews (movie_id, user_name, rating, comment)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `;

            // Sanitize comment to prevent XSS attacks
            const sanitizedComment = sanitizeInput(data.comment);

            const values = [data.movieId, data.userName, data.rating, sanitizedComment];
            const result = await pool.query<Review>(query, values);

            return this.mapReviewToResponse(result.rows[0]);
        } catch (error) {
            throw new DatabaseError('Failed to create review', {
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }

    async getReviews(params: ReviewQueryParams): Promise<PaginatedResponse<ReviewResponse>> {
        try {
            const { movieId, page = 1, limit = 10 } = params;
            const offset = (page - 1) * limit;

            let countQuery = 'SELECT COUNT(*) FROM reviews';
            let dataQuery = 'SELECT * FROM reviews';
            const values: unknown[] = [];

            if (movieId) {
                countQuery += ' WHERE movie_id = $1';
                dataQuery += ' WHERE movie_id = $1';
                values.push(movieId);
            }

            dataQuery += ' ORDER BY created_at DESC LIMIT $' + (values.length + 1) + ' OFFSET $' + (values.length + 2);
            values.push(limit, offset);

            const [countResult, dataResult] = await Promise.all([
                pool.query<{ count: string }>(countQuery, movieId ? [movieId] : []),
                pool.query<Review>(dataQuery, values),
            ]);

            const total = parseInt(countResult.rows[0].count, 10);
            const pages = Math.ceil(total / limit);

            return {
                success: true,
                data: dataResult.rows.map((review) => this.mapReviewToResponse(review)),
                pagination: {
                    total,
                    page,
                    limit,
                    pages,
                },
            };
        } catch (error) {
            throw new DatabaseError('Failed to fetch reviews', {
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }

    async getReviewById(id: number): Promise<ReviewResponse> {
        try {
            const query = 'SELECT * FROM reviews WHERE id = $1';
            const result = await pool.query<Review>(query, [id]);

            if (result.rows.length === 0) {
                throw new NotFoundError('Review not found');
            }

            return this.mapReviewToResponse(result.rows[0]);
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            throw new DatabaseError('Failed to fetch review', {
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }

    async updateReview(id: number, data: { rating?: number; comment?: string }): Promise<ReviewResponse> {
        try {
            const updates: string[] = [];
            const values: any[] = [];
            let paramIndex = 1;

            if (data.rating !== undefined) {
                updates.push(`rating = $${paramIndex++}`);
                values.push(data.rating);
            }

            if (data.comment !== undefined) {
                const sanitizedComment = sanitizeInput(data.comment);
                updates.push(`comment = $${paramIndex++}`);
                values.push(sanitizedComment);
            }

            if (updates.length === 0) {
                throw new Error('No fields to update');
            }

            values.push(id);

            const query = `
                UPDATE reviews
                SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
                WHERE id = $${paramIndex}
                RETURNING *
            `;

            const result = await pool.query<Review>(query, values);

            if (result.rows.length === 0) {
                throw new NotFoundError('Review not found');
            }

            return this.mapReviewToResponse(result.rows[0]);
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            throw new DatabaseError('Failed to update review', {
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }

    async deleteReview(id: number): Promise<boolean> {
        try {
            const query = 'DELETE FROM reviews WHERE id = $1 RETURNING id';
            const result = await pool.query(query, [id]);
            return result.rowCount !== null && result.rowCount > 0;
        } catch (error) {
            throw new DatabaseError('Failed to delete review', {
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }
}

export const reviewService = new ReviewService();
