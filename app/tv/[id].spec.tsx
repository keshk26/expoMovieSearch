import React from 'react';
import { screen, waitFor } from '@testing-library/react-native';
import { useLocalSearchParams } from 'expo-router';
import { http, HttpResponse } from 'msw';
import { server } from '@/mocks/server';
import { renderWithQuery } from '@/test-utils';
import TVDetailScreen from './[id]';

beforeEach(() => {
  (useLocalSearchParams as jest.Mock).mockReturnValue({ id: '2' });
});

describe('TVDetailScreen', () => {
  it('shows the show name after loading', async () => {
    renderWithQuery(<TVDetailScreen />);
    await waitFor(() => {
      expect(screen.getByText('Test Show')).toBeTruthy();
    });
  });

  it('shows the first air year', async () => {
    renderWithQuery(<TVDetailScreen />);
    await waitFor(() => {
      expect(screen.getByText('2024')).toBeTruthy();
    });
  });

  it('shows the number of seasons', async () => {
    renderWithQuery(<TVDetailScreen />);
    await waitFor(() => {
      expect(screen.getByText('3 Seasons')).toBeTruthy();
    });
  });

  it('shows the rating badge', async () => {
    renderWithQuery(<TVDetailScreen />);
    await waitFor(() => {
      expect(screen.getByText('8.0')).toBeTruthy();
    });
  });

  it('shows the tagline', async () => {
    renderWithQuery(<TVDetailScreen />);
    await waitFor(() => {
      expect(screen.getByText('"A test show tagline."')).toBeTruthy();
    });
  });

  it('shows genre chips', async () => {
    renderWithQuery(<TVDetailScreen />);
    await waitFor(() => {
      expect(screen.getByText('Drama')).toBeTruthy();
    });
  });

  it('shows the Overview section with text', async () => {
    renderWithQuery(<TVDetailScreen />);
    await waitFor(() => {
      expect(screen.getByText('Overview')).toBeTruthy();
      expect(screen.getByText('A test TV show overview.')).toBeTruthy();
    });
  });

  it('shows an error message when the fetch fails', async () => {
    server.use(
      http.get('https://api.themoviedb.org/3/tv/:id', () =>
        HttpResponse.error()
      )
    );
    renderWithQuery(<TVDetailScreen />);
    await waitFor(() => {
      expect(screen.getByText('Failed to load TV show.')).toBeTruthy();
    });
  });
});
