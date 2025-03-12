import React, { createContext, useContext } from 'react';
import { FirestoreService, StoredStory } from '../services/firestore';
import { GeneratedStory } from '../services/openai';
import { useAuth } from './AuthContext';

interface FirestoreContextType {
  saveStory: (story: GeneratedStory) => Promise<string>;
  getUserStories: () => Promise<StoredStory[]>;
  toggleFavorite: (storyId: string, isFavorite: boolean) => Promise<void>;
  deleteStory: (storyId: string) => Promise<void>;
  addTag: (storyId: string, tag: string) => Promise<void>;
}

const FirestoreContext = createContext<FirestoreContextType | null>(null);

export const useFirestore = () => {
  const context = useContext(FirestoreContext);
  if (!context) {
    throw new Error('useFirestore must be used within a FirestoreProvider');
  }
  return context;
};

export const FirestoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  const saveStory = async (story: GeneratedStory): Promise<string> => {
    if (!user) throw new Error('User must be logged in to save stories');
    return FirestoreService.saveStory(story, user);
  };

  const getUserStories = async (): Promise<StoredStory[]> => {
    if (!user) throw new Error('User must be logged in to get stories');
    return FirestoreService.getUserStories(user);
  };

  const toggleFavorite = async (storyId: string, isFavorite: boolean): Promise<void> => {
    return FirestoreService.toggleFavorite(storyId, isFavorite);
  };

  const deleteStory = async (storyId: string): Promise<void> => {
    return FirestoreService.deleteStory(storyId);
  };

  const addTag = async (storyId: string, tag: string): Promise<void> => {
    return FirestoreService.addTag(storyId, tag);
  };

  return (
    <FirestoreContext.Provider
      value={{
        saveStory,
        getUserStories,
        toggleFavorite,
        deleteStory,
        addTag,
      }}
    >
      {children}
    </FirestoreContext.Provider>
  );
};
