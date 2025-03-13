import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../contexts/AuthContext';

// Screens
import { LoginScreen } from '../screens/auth/LoginScreen';
import { RegisterScreen } from '../screens/auth/RegisterScreen';
import { ForgotPasswordScreen } from '../screens/auth/ForgotPasswordScreen';
import { HomeScreen } from '../screens/home/HomeScreen';
import { StoryGeneratorScreen } from '../screens/story/StoryGeneratorScreen';
import { StoryViewerScreen } from '../screens/story/StoryViewerScreen';
import { RootStackParamList } from './types';
import { MyStoriesScreen } from '../screens/story/MyStoriesScreen';


const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  const { user, loading } = useAuth();

  console.log('AppNavigator: Auth state:', { user: user?.email, loading });

  if (loading) {
    return null; // or a loading screen
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          // Authenticated stack
          <Stack.Group>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="StoryGenerator" component={StoryGeneratorScreen} />
            <Stack.Screen name="StoryViewer" component={StoryViewerScreen} />
            <Stack.Screen name="MyStories" component={MyStoriesScreen} />
          </Stack.Group>
        ) : (
          // Non-authenticated stack
          <Stack.Group>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
