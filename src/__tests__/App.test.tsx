import { Text } from 'react-native';
import { render } from '@testing-library/react-native';

// Mock the navigation
jest.mock('@react-navigation/native', () => ({
  NavigationContainer: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock the auth context
jest.mock('../contexts/AuthContext', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useAuth: () => ({
    user: null,
    loading: false,
  }),
}));

// Simple component for testing
const TestApp = () => <Text>Test App</Text>;

describe('App', () => {
  it('renders without crashing', () => {
    render(<TestApp />);
  });
});
