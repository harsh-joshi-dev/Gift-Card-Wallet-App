/**
 * @format
 */

import React from 'react';
import { render } from '@testing-library/react-native';

// Mock all the dependencies to avoid import issues
jest.mock('react-redux', () => ({
  Provider: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('../src/store', () => ({
  store: {},
}));

jest.mock('../src/navigation/AppNavigator', () => {
  return function MockAppNavigator() {
    return null;
  };
});

// Import App after mocking
const App = require('../App').default;

describe('App Component', () => {
  it('renders without crashing', () => {
    const { toJSON } = render(<App />);
    expect(toJSON()).toBeDefined();
  });

  it('renders successfully', () => {
    const { UNSAFE_root } = render(<App />);
    expect(UNSAFE_root).toBeDefined();
  });
});
