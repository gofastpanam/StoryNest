import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Share, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { GeneratedStory } from '../../services/openai';
import { useStory } from '../../contexts/StoryContext';
import { useFirestore } from '../../contexts/FirestoreContext';

type Props = NativeStackScreenProps<RootStackParamList, 'StoryViewer'>;

export const StoryViewerScreen: React.FC<Props> = ({ route, navigation }) => {
  const { story: serializedStory } = route.params;

  // Convert ISO string to Date object
  const story = {
    ...serializedStory,
    createdAt: new Date(serializedStory.createdAt),
  };

  const { saveStory } = useFirestore();

  const handleSave = async () => {
    try {
      await saveStory(story);
      Alert.alert('Success', 'Story saved successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to save story. Please try again.');
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${story.title}\n\n${story.content}\n\nCreated with StoryNest`,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share story');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <Text style={styles.title}>{story.title}</Text>
        <Text style={styles.date}>Created on {new Date(story.createdAt).toLocaleDateString()}</Text>
        <Text style={styles.content}>{story.content}</Text>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Save Story</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.shareButton]} onPress={handleShare}>
          <Text style={styles.buttonText}>Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  date: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  content: {
    fontSize: 18,
    lineHeight: 28,
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  button: {
    flex: 1,
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  shareButton: {
    backgroundColor: '#34C759',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
