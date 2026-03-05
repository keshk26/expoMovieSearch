import React from 'react';
import { render } from '@testing-library/react-native';
import TabLayout from './_layout';

describe('TabLayout', () => {
  it('renders without crashing', () => {
    expect(() => render(<TabLayout />)).not.toThrow();
  });
});
