const API_KEY = process.env.EXPO_PUBLIC_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
export const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';
export const BACKDROP_BASE = 'https://image.tmdb.org/t/p/w780';

async function get<T>(path: string, params: Record<string, string> = {}): Promise<T> {
  const query = new URLSearchParams({ api_key: API_KEY ?? '', ...params }).toString();
  const res = await fetch(`${BASE_URL}${path}?${query}`);
  if (!res.ok) throw new Error(`TMDB error: ${res.status}`);
  return res.json();
}

export interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date: string;
  overview: string;
  genres?: { id: number; name: string }[];
  runtime?: number;
  tagline?: string;
}

export interface TVShow {
  id: number;
  name: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  first_air_date: string;
  overview: string;
  genres?: { id: number; name: string }[];
  number_of_seasons?: number;
  tagline?: string;
}

export interface SearchResult {
  id: number;
  media_type: 'movie' | 'tv' | 'person';
  title?: string;
  name?: string;
  poster_path: string | null;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
}

interface PagedResponse<T> {
  results: T[];
  page: number;
  total_pages: number;
}

export const getTrendingMovies = (page = 1) =>
  get<PagedResponse<Movie>>('/trending/movie/day', { page: String(page) });

export const getPopularTV = (page = 1) =>
  get<PagedResponse<TVShow>>('/tv/popular', { page: String(page) });

export const searchMulti = (query: string, page = 1) =>
  get<PagedResponse<SearchResult>>('/search/multi', { query, page: String(page) });

export const getMovieDetail = (id: number) =>
  get<Movie>(`/movie/${id}`);

export const getTVDetail = (id: number) =>
  get<TVShow>(`/tv/${id}`);
