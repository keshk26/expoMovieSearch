import { server } from './mocks/server';

// MSW server lifecycle
beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// ─── expo-router ──────────────────────────────────────────────────────────────
jest.mock('expo-router', () => {
  const StackScreen = () => null;
  const Stack = ({ children }: { children?: React.ReactNode }) => children ?? null;
  Stack.Screen = StackScreen;

  const TabsScreen = () => null;
  const Tabs = ({ children }: { children?: React.ReactNode }) => children ?? null;
  Tabs.Screen = TabsScreen;

  return {
    useRouter: jest.fn(() => ({ push: jest.fn(), back: jest.fn(), replace: jest.fn() })),
    useLocalSearchParams: jest.fn(() => ({})),
    Stack,
    Tabs,
    Link: ({ children }: { children?: React.ReactNode }) => children ?? null,
  };
});

// ─── expo-status-bar ──────────────────────────────────────────────────────────
jest.mock('expo-status-bar', () => ({
  StatusBar: () => null,
}));
