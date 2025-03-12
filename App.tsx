import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/contexts/AuthContext';
import { FirestoreProvider } from './src/contexts/FirestoreContext';
import { StoryProvider } from './src/contexts/StoryContext';
import { AppNavigator } from './src/navigation/AppNavigator';

export default function App() {
  return (
    <AuthProvider>
      <StoryProvider>
        <FirestoreProvider>
          <AppNavigator />
          <StatusBar style="auto" />
        </FirestoreProvider>
      </StoryProvider>
    </AuthProvider>
  );
}
