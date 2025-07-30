/* eslint-env jest */
import 'react-native-gesture-handler/jestSetup';

jest.mock('react-native-linear-gradient', () => 'LinearGradient');
jest.mock('react-native-svg', () => 'Svg');

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock React Navigation
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
      addListener: jest.fn(() => jest.fn()),
    }),
    useRoute: () => ({
      params: {},
    }),
  };
});

jest.mock('@react-navigation/stack', () => {
  const actualStack = jest.requireActual('@react-navigation/stack');
  return {
    ...actualStack,
    createStackNavigator: () => ({
      Navigator: ({ children }) => children,
      Screen: ({ children }) => children,
    }),
  };
});

global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Cleanup after each test
afterEach(() => {
  jest.clearAllTimers();
  jest.clearAllMocks();
});

// Global teardown
afterAll(() => {
  jest.clearAllTimers();
  jest.clearAllMocks();
}); 