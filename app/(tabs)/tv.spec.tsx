import React from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react-native';
import { renderWithQuery } from '@/test-utils';
import TVScreen from './tv';

describe('TVScreen', () => {
  it('renders the section header', async () => {
    renderWithQuery(<TVScreen />);
    await waitFor(() => {
      expect(screen.getByText('Popular TV Shows')).toBeTruthy();
    });
  });

  it('renders TV show cards after data loads', async () => {
    renderWithQuery(<TVScreen />);
    await waitFor(() => {
      expect(screen.getByText('Test Show')).toBeTruthy();
    });
  });

  it('renders the first air year on the show card', async () => {
    renderWithQuery(<TVScreen />);
    await waitFor(() => {
      expect(screen.getByText('2024')).toBeTruthy();
    });
  });

  it('renders the rating badge for shows with a rating', async () => {
    renderWithQuery(<TVScreen />);
    await waitFor(() => {
      expect(screen.getByText('8.0')).toBeTruthy();
    });
  });

  it('navigates to the TV detail screen on card press', async () => {
    const { useRouter } = require('expo-router');
    const mockPush = jest.fn();
    useRouter.mockReturnValue({ push: mockPush });

    renderWithQuery(<TVScreen />);
    await waitFor(() => screen.getByText('Test Show'));

    fireEvent.press(screen.getByText('Test Show'));

    expect(mockPush).toHaveBeenCalledWith('/tv/2');
  });
});
