import { http, HttpResponse } from 'msw';

export const MOCK_MOVIE = {
  id: 1,
  title: 'Test Movie',
  poster_path: '/test-poster.jpg',
  backdrop_path: '/test-backdrop.jpg',
  vote_average: 7.5,
  release_date: '2024-03-01',
  overview: 'A test movie overview.',
  genres: [
    { id: 28, name: 'Action' },
    { id: 12, name: 'Adventure' },
  ],
  runtime: 120,
  tagline: 'This is a test tagline.',
};

export const MOCK_SHOW = {
  id: 2,
  name: 'Test Show',
  poster_path: '/test-show-poster.jpg',
  backdrop_path: '/test-show-backdrop.jpg',
  vote_average: 8.0,
  first_air_date: '2024-01-15',
  overview: 'A test TV show overview.',
  genres: [{ id: 18, name: 'Drama' }],
  number_of_seasons: 3,
  tagline: 'A test show tagline.',
};

export const handlers = [
  http.get('https://api.themoviedb.org/3/trending/movie/day', () =>
    HttpResponse.json({ results: [MOCK_MOVIE], page: 1, total_pages: 1 })
  ),

  http.get('https://api.themoviedb.org/3/tv/popular', () =>
    HttpResponse.json({ results: [MOCK_SHOW], page: 1, total_pages: 1 })
  ),

  http.get('https://api.themoviedb.org/3/search/multi', () =>
    HttpResponse.json({
      results: [
        { ...MOCK_MOVIE, media_type: 'movie' },
        { ...MOCK_SHOW, media_type: 'tv', title: undefined },
      ],
      page: 1,
      total_pages: 1,
    })
  ),

  http.get('https://api.themoviedb.org/3/movie/:id', () =>
    HttpResponse.json(MOCK_MOVIE)
  ),

  http.get('https://api.themoviedb.org/3/tv/:id', () =>
    HttpResponse.json(MOCK_SHOW)
  ),
];
