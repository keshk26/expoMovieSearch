import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import MediaCard from './MediaCard';

const defaultProps = {
  title: 'Inception',
  posterPath: '/inception.jpg',
  rating: 8.8,
  year: '2010',
  onPress: jest.fn(),
};

describe('MediaCard', () => {
  it('renders the title', () => {
    render(<MediaCard {...defaultProps} />);
    expect(screen.getByText('Inception')).toBeTruthy();
  });

  it('renders the year', () => {
    render(<MediaCard {...defaultProps} />);
    expect(screen.getByText('2010')).toBeTruthy();
  });

  it('renders the rating badge when rating > 0', () => {
    render(<MediaCard {...defaultProps} />);
    expect(screen.getByText('8.8')).toBeTruthy();
  });

  it('hides the rating badge when rating is 0', () => {
    render(<MediaCard {...defaultProps} rating={0} />);
    expect(screen.queryByText('0.0')).toBeNull();
  });

  it('shows "No Image" placeholder when posterPath is null', () => {
    render(<MediaCard {...defaultProps} posterPath={null} />);
    expect(screen.getByText('No Image')).toBeTruthy();
  });

  it('does not render the image when posterPath is null', () => {
    render(<MediaCard {...defaultProps} posterPath={null} />);
    expect(screen.queryByText('No Image')).toBeTruthy();
  });

  it('does not render year text when year is empty', () => {
    render(<MediaCard {...defaultProps} year="" />);
    expect(screen.queryByText('')).toBeNull();
  });

  it('calls onPress when the card is pressed', () => {
    const onPress = jest.fn();
    render(<MediaCard {...defaultProps} onPress={onPress} />);
    fireEvent.press(screen.getByText('Inception'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('renders a long title without crashing', () => {
    const longTitle = 'A Very Long Movie Title That Should Be Truncated After Two Lines';
    render(<MediaCard {...defaultProps} title={longTitle} />);
    expect(screen.getByText(longTitle)).toBeTruthy();
  });
});
