import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { GeneratedStory } from './openai';
import { User } from 'firebase/auth';

export interface StoredStory extends GeneratedStory {
  id: string;
  userId: string;
  isFavorite: boolean;
  tags: string[];
}

export class FirestoreService {
  private static STORIES_COLLECTION = 'stories';

  static async saveStory(story: GeneratedStory, user: User): Promise<string> {
    try {
      // Simplifier au maximum
      const storyToSave = {
        title: story.title,
        content: story.content,
        summary: story.summary,
        userId: user.uid,
        isFavorite: false,
        tags: [],
        createdAt: Timestamp.fromDate(new Date())
      };
  
      const docRef = await addDoc(collection(db, this.STORIES_COLLECTION), storyToSave);
      return docRef.id;
    } catch (error) {
      console.error('Error saving story:', error);
      throw new Error('Failed to save story');
    }
  }

  static async getUserStories(user: User): Promise<StoredStory[]> {
    try {
      const q = query(
        collection(db, this.STORIES_COLLECTION),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => {
        const data = doc.data();
        // Check if createdAt is a Firestore Timestamp before calling toDate()
        const createdAt =
          data.createdAt && typeof data.createdAt.toDate === 'function'
            ? data.createdAt.toDate()
            : new Date();

        return {
          id: doc.id,
          ...data,
          createdAt: createdAt,
        } as StoredStory;
      });
    } catch (error) {
      console.error('Error getting user stories:', error);
      throw new Error('Failed to get user stories');
    }
  }

  static async toggleFavorite(storyId: string, isFavorite: boolean): Promise<void> {
    try {
      const storyRef = doc(db, this.STORIES_COLLECTION, storyId);
      await updateDoc(storyRef, {
        isFavorite,
      });
    } catch (error) {
      console.error('Error toggling favorite:', error);
      throw new Error('Failed to update story');
    }
  }

  static async deleteStory(storyId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, this.STORIES_COLLECTION, storyId));
    } catch (error) {
      console.error('Error deleting story:', error);
      throw new Error('Failed to delete story');
    }
  }

  static async addTag(storyId: string, tag: string): Promise<void> {
    try {
      const storyRef = doc(db, this.STORIES_COLLECTION, storyId);
      const storySnap = await getDoc(storyRef);

      if (storySnap.exists()) {
        const storyData = storySnap.data();
        const tags = storyData.tags || [];

        if (!tags.includes(tag)) {
          await updateDoc(storyRef, {
            tags: [...tags, tag],
          });
        }
      }
    } catch (error) {
      console.error('Error adding tag:', error);
      throw new Error('Failed to update story tags');
    }
  }
}
