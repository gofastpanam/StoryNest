import { SerializableGeneratedStory } from '../services/openai';

export type RootStackParamList = {
  // Auth screens
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;

  // Main app screens
  Home: undefined;
  StoryGenerator: undefined;
  StoryViewer: { story: SerializableGeneratedStory };
  MyStories: undefined;
};
