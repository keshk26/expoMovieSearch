import React from 'react';
import { render, screen } from '@testing-library/react-native';
import RatingBadge from './RatingBadge';

describe('RatingBadge', () => {
  it('renders the formatted rating', () => {
    render(<RatingBadge rating={7.5} />);
    expect(screen.getByText('7.5')).toBeTruthy();
  });

  it('renders the star symbol', () => {
    render(<RatingBadge rating={6.0} />);
    expect(screen.getByText('★')).toBeTruthy();
  });

  it('rounds to one decimal place', () => {
    render(<RatingBadge rating={8.15} />);
    expect(screen.getByText('8.2')).toBeTruthy();
  });

  it('renders 0.0 for a zero rating', () => {
    render(<RatingBadge rating={0} />);
    expect(screen.getByText('0.0')).toBeTruthy();
  });

  it('renders 10.0 for a perfect rating', () => {
    render(<RatingBadge rating={10} />);
    expect(screen.getByText('10.0')).toBeTruthy();
  });
});
