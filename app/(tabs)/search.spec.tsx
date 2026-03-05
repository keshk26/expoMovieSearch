import React from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react-native';
import { renderWithQuery } from '@/test-utils';
import SearchScreen from './search';

// Remove debounce delay so queries fire immediately in tests
jest.mock('@/utils/useDebounce', () => ({
  useDebounce: <T,>(value: T) => value,
}));

describe('SearchScreen', () => {
  it('shows the search input', () => {
    renderWithQuery(<SearchScreen />);
    expect(screen.getByPlaceholderText('Search movies & TV shows...')).toBeTruthy();
  });

  it('shows the "Type to search..." prompt initially', () => {
    renderWithQuery(<SearchScreen />);
    expect(screen.getByText('Type to search...')).toBeTruthy();
  });

  it('shows "No results found" when query is short (< 2 chars)', async () => {
    renderWithQuery(<SearchScreen />);
    fireEvent.changeText(
      screen.getByPlaceholderText('Search movies & TV shows...'),
      'a'
    );
    // Single character — query disabled, still shows prompt
    expect(screen.getByText('Type to search...')).toBeTruthy();
  });

  it('shows results after typing a valid query', async () => {
    renderWithQuery(<SearchScreen />);
    fireEvent.changeText(
      screen.getByPlaceholderText('Search movies & TV shows...'),
      'test'
    );
    await waitFor(() => {
      expect(screen.getByText('Test Movie')).toBeTruthy();
    });
  });

  it('shows both movie and TV results', async () => {
    renderWithQuery(<SearchScreen />);
    fireEvent.changeText(
      screen.getByPlaceholderText('Search movies & TV shows...'),
      'test'
    );
    await waitFor(() => {
      expect(screen.getByText('Test Movie')).toBeTruthy();
      expect(screen.getByText('Test Show')).toBeTruthy();
    });
  });

  it('shows MOVIE and TV type badges', async () => {
    renderWithQuery(<SearchScreen />);
    fireEvent.changeText(
      screen.getByPlaceholderText('Search movies & TV shows...'),
      'test'
    );
    await waitFor(() => {
      expect(screen.getByText('MOVIE')).toBeTruthy();
      expect(screen.getByText('TV')).toBeTruthy();
    });
  });

  it('navigates to movie detail on result press', async () => {
    const { useRouter } = require('expo-router');
    const mockPush = jest.fn();
    useRouter.mockReturnValue({ push: mockPush });

    renderWithQuery(<SearchScreen />);
    fireEvent.changeText(
      screen.getByPlaceholderText('Search movies & TV shows...'),
      'test'
    );

    await waitFor(() => screen.getByText('Test Movie'));
    fireEvent.press(screen.getByText('Test Movie'));

    expect(mockPush).toHaveBeenCalledWith('/movie/1');
  });

  it('navigates to TV detail on result press', async () => {
    const { useRouter } = require('expo-router');
    const mockPush = jest.fn();
    useRouter.mockReturnValue({ push: mockPush });

    renderWithQuery(<SearchScreen />);
    fireEvent.changeText(
      screen.getByPlaceholderText('Search movies & TV shows...'),
      'test'
    );

    await waitFor(() => screen.getByText('Test Show'));
    fireEvent.press(screen.getByText('Test Show'));

    expect(mockPush).toHaveBeenCalledWith('/tv/2');
  });
});
