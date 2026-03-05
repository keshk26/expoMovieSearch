import React from 'react';
import { render, screen, waitFor } from '@testing-library/react-native';
import { useLocalSearchParams } from 'expo-router';
import { http, HttpResponse } from 'msw';
import { server } from '@/mocks/server';
import MovieDetailScreen from './[id]';

beforeEach(() => {
  (useLocalSearchParams as jest.Mock).mockReturnValue({ id: '1' });
});

describe('MovieDetailScreen', () => {
  it('shows the movie title after loading', async () => {
    render(<MovieDetailScreen />);
    await waitFor(() => {
      expect(screen.getByText('Test Movie')).toBeTruthy();
    });
  });

  it('shows the release year', async () => {
    render(<MovieDetailScreen />);
    await waitFor(() => {
      expect(screen.getByText('2024')).toBeTruthy();
    });
  });

  it('shows the runtime', async () => {
    render(<MovieDetailScreen />);
    await waitFor(() => {
      // 120 min → 2h 0m
      expect(screen.getByText('2h 0m')).toBeTruthy();
    });
  });

  it('shows the rating badge', async () => {
    render(<MovieDetailScreen />);
    await waitFor(() => {
      expect(screen.getByText('7.5')).toBeTruthy();
    });
  });

  it('shows the tagline', async () => {
    render(<MovieDetailScreen />);
    await waitFor(() => {
      expect(screen.getByText('"This is a test tagline."')).toBeTruthy();
    });
  });

  it('shows genre chips', async () => {
    render(<MovieDetailScreen />);
    await waitFor(() => {
      expect(screen.getByText('Action')).toBeTruthy();
      expect(screen.getByText('Adventure')).toBeTruthy();
    });
  });

  it('shows the Overview section with text', async () => {
    render(<MovieDetailScreen />);
    await waitFor(() => {
      expect(screen.getByText('Overview')).toBeTruthy();
      expect(screen.getByText('A test movie overview.')).toBeTruthy();
    });
  });

  it('shows an error message when the fetch fails', async () => {
    server.use(
      http.get('https://api.themoviedb.org/3/movie/:id', () =>
        HttpResponse.error()
      )
    );
    render(<MovieDetailScreen />);
    await waitFor(() => {
      expect(screen.getByText('Failed to load movie.')).toBeTruthy();
    });
  });
});
