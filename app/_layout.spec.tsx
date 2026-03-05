import React from 'react';
import { render } from '@testing-library/react-native';
import RootLayout from './_layout';

describe('RootLayout', () => {
  it('renders without crashing', () => {
    expect(() => render(<RootLayout />)).not.toThrow();
  });
});
