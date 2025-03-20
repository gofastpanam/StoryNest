import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { useFirestore } from '../../contexts/FirestoreContext';
import { StoredStory } from '../../services/firestore';
import { Ionicons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<RootStackParamList, 'MyStories'>;

export const MyStoriesScreen: React.FC<Props> = ({ navigation }) => {
  const { getUserStories, toggleFavorite, deleteStory } = useFirestore();
  const [stories, setStories] = useState<StoredStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'favorites'>('all');

  useEffect(() => {
    const loadStories = async () => {
      setLoading(true);
      try {
        const userStories = await getUserStories();
        setStories(userStories);
      } catch (error) {
        Alert.alert('Error', 'Failed to load stories');
      } finally {
        setLoading(false);
      }
    };

    loadStories();

    // Reload stories when the screen comes into focus
    const unsubscribe = navigation.addListener('focus', () => {
      loadStories();
    });

    return unsubscribe;
  }, [navigation, getUserStories]);

  const handleFavoriteToggle = async (story: StoredStory) => {
    try {
      await toggleFavorite(story.id, !story.isFavorite);
      // Update local state
      setStories(
        stories.map((s) => (s.id === story.id ? { ...s, isFavorite: !story.isFavorite } : s))
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to update favorite status');
    }
  };

  const handleDelete = async (storyId: string) => {
    Alert.alert('Delete Story', 'Are you sure you want to delete this story?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteStory(storyId);
            setStories(stories.filter((s) => s.id !== storyId));
          } catch (error) {
            Alert.alert('Error', 'Failed to delete story');
          }
        },
      },
    ]);
  };

  const handleViewStory = (story: StoredStory) => {
    // Convert date to ISO string for serialization
    const storyToPass = {
      ...story,
      createdAt: story.createdAt.toISOString(),
    };
    navigation.navigate('StoryViewer', { story: storyToPass });
  };

  const filteredStories = filter === 'all' ? stories : stories.filter((story) => story.isFavorite);

  const renderStoryItem = ({ item }: { item: StoredStory }) => (
    <TouchableOpacity style={styles.storyCard} onPress={() => handleViewStory(item)}>
      <View style={styles.storyHeader}>
        <Text style={styles.storyTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.iconButton} onPress={() => handleFavoriteToggle(item)}>
            <Ionicons
              name={item.isFavorite ? 'heart' : 'heart-outline'}
              size={24}
              color={item.isFavorite ? '#ff3b30' : '#666'}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconButton} onPress={() => handleDelete(item.id)}>
            <Ionicons name="trash-outline" size={24} color="#666" />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.storySummary} numberOfLines={2}>
        {item.summary}
      </Text>

      <Text style={styles.storyDate}>{new Date(item.createdAt).toLocaleDateString()}</Text>

      {item.tags.length > 0 && (
        <View style={styles.tagsContainer}>
          {item.tags.map((tag) => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'all' && styles.activeFilter]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterText, filter === 'all' && styles.activeFilterText]}>
            All Stories
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterButton, filter === 'favorites' && styles.activeFilter]}
          onPress={() => setFilter('favorites')}
        >
          <Text style={[styles.filterText, filter === 'favorites' && styles.activeFilterText]}>
            Favorites
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : filteredStories.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="book-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>
            {filter === 'all'
              ? "You haven't created any stories yet"
              : "You don't have any favorite stories"}
          </Text>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => navigation.navigate('StoryGenerator')}
          >
            <Text style={styles.createButtonText}>Create a Story</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredStories}
          renderItem={renderStoryItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  filterContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
  },
  activeFilter: {
    backgroundColor: '#007AFF',
  },
  filterText: {
    fontSize: 14,
    color: '#666',
  },
  activeFilterText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  createButton: {
    backgroundColor: '#3b152f',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 16,
  },
  storyCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  storyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  storyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  iconButton: {
    padding: 8,
    marginLeft: 8,
  },
  storySummary: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  storyDate: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  tag: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 12,
    color: '#666',
  },
});
