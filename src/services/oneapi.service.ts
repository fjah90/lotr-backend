import { env } from '../config/env.js';
import type { Movie, Character, OneApiResponse } from '../types/api.types.js';
import { ApiError } from '../middleware/error-handler.js';

class OneApiService {
    private baseUrl: string;
    private apiKey: string;

    constructor() {
        this.baseUrl = env.ONE_API_BASE_URL;
        this.apiKey = env.ONE_API_KEY;
    }

    private async fetch<T>(endpoint: string): Promise<OneApiResponse<T>> {
        try {
            const url = `${this.baseUrl}${endpoint}`;
            const response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new ApiError(
                    `The One API request failed: ${response.statusText}`,
                    { status: response.status, endpoint }
                );
            }

            const data = await response.json();
            return data as OneApiResponse<T>;
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError('Failed to fetch data from The One API', {
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }

    async getMovies(page: number = 1, limit: number = 10): Promise<OneApiResponse<Movie>> {
        const offset = (page - 1) * limit;
        return this.fetch<Movie>(`/movie?limit=${limit}&offset=${offset}`);
    }

    async getMovieById(id: string): Promise<Movie> {
        const response = await this.fetch<Movie>(`/movie/${id}`);
        if (!response.docs || response.docs.length === 0) {
            throw new ApiError('Movie not found in The One API', { movieId: id });
        }
        return response.docs[0];
    }

    async getCharacters(page: number = 1, limit: number = 10): Promise<OneApiResponse<Character>> {
        const offset = (page - 1) * limit;
        return this.fetch<Character>(`/character?limit=${limit}&offset=${offset}`);
    }

    async getCharacterById(id: string): Promise<Character> {
        const response = await this.fetch<Character>(`/character/${id}`);
        if (!response.docs || response.docs.length === 0) {
            throw new ApiError('Character not found in The One API', { characterId: id });
        }
        return response.docs[0];
    }
}

export const oneApiService = new OneApiService();
