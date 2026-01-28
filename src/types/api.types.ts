// The One API Movie response
export interface Movie {
    _id: string;
    name: string;
    runtimeInMinutes: number;
    budgetInMillions: number;
    boxOfficeRevenueInMillions: number;
    academyAwardNominations: number;
    academyAwardWins: number;
    rottenTomatoesScore: number;
}

// The One API Character response
export interface Character {
    _id: string;
    height: string;
    race: string;
    gender: string;
    birth: string;
    spouse: string;
    death: string;
    realm: string;
    hair: string;
    name: string;
    wikiUrl?: string;
}

// The One API standard response wrapper
export interface OneApiResponse<T> {
    docs: T[];
    total: number;
    limit: number;
    offset?: number;
    page?: number;
    pages?: number;
}
