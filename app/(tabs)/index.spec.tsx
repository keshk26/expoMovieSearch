import React from 'react';
import { screen, waitFor } from '@testing-library/react-native';
import { renderWithQuery } from '@/test-utils';
import MoviesScreen from './index';

describe('MoviesScreen', () => {
  it('renders the section header', async () => {
    renderWithQuery(<MoviesScreen />);
    await waitFor(() => {
      expect(screen.getByText('Trending Today')).toBeTruthy();
    });
  });

  it('renders movie cards after data loads', async () => {
    renderWithQuery(<MoviesScreen />);
    await waitFor(() => {
      expect(screen.getByText('Test Movie')).toBeTruthy();
    });
  });

  it('renders the release year on the movie card', async () => {
    renderWithQuery(<MoviesScreen />);
    await waitFor(() => {
      expect(screen.getByText('2024')).toBeTruthy();
    });
  });

  it('renders the rating badge for movies with a rating', async () => {
    renderWithQuery(<MoviesScreen />);
    await waitFor(() => {
      expect(screen.getByText('7.5')).toBeTruthy();
    });
  });

  it('navigates to the movie detail screen on card press', async () => {
    const { useRouter } = require('expo-router');
    const mockPush = jest.fn();
    useRouter.mockReturnValue({ push: mockPush });

    renderWithQuery(<MoviesScreen />);
    await waitFor(() => screen.getByText('Test Movie'));

    const { fireEvent } = require('@testing-library/react-native');
    fireEvent.press(screen.getByText('Test Movie'));

    expect(mockPush).toHaveBeenCalledWith('/movie/1');
  });
});
