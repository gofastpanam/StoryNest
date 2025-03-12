import React, { createContext, useContext, useState } from 'react';
import { OpenAIService, StoryParams, GeneratedStory } from '../services/openai';

interface StoryContextType {
  currentStory: GeneratedStory | null;
  isGenerating: boolean;
  generateStory: (params: StoryParams) => Promise<GeneratedStory>;
  clearCurrentStory: () => void;
  error: string | null;
}

const StoryContext = createContext<StoryContextType | null>(null);

export const useStory = () => {
  const context = useContext(StoryContext);
  if (!context) {
    throw new Error('useStory must be used within a StoryProvider');
  }
  return context;
};

export const StoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentStory, setCurrentStory] = useState<GeneratedStory | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateStory = async (params: StoryParams): Promise<GeneratedStory> => {
    setIsGenerating(true);
    setError(null);

    try {
      const story = await OpenAIService.generateStory(params);
      setCurrentStory(story);
      return story;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate story';
      setError(errorMessage);
      throw err;
    } finally {
      setIsGenerating(false);
    }
  };

  const clearCurrentStory = () => {
    setCurrentStory(null);
  };

  return (
    <StoryContext.Provider
      value={{
        currentStory,
        isGenerating,
        generateStory,
        clearCurrentStory,
        error,
      }}
    >
      {children}
    </StoryContext.Provider>
  );
};
