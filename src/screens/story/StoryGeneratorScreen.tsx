import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';

type StoryParams = {
  mainCharacter: string;
  setting: string;
  theme: string;
  ageGroup: string;
};

export const StoryGeneratorScreen = () => {
  const [storyParams, setStoryParams] = useState<StoryParams>({
    mainCharacter: '',
    setting: '',
    theme: '',
    ageGroup: '',
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      // TODO: Implémenter la génération d'histoire
      console.log('Generating story with params:', storyParams);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulation
    } catch (error) {
      console.error('Error generating story:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Create Your Story</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Main Character</Text>
        <TextInput
          style={styles.input}
          value={storyParams.mainCharacter}
          onChangeText={(text) => setStoryParams({ ...storyParams, mainCharacter: text })}
          placeholder="Enter the main character's name"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Setting</Text>
        <TextInput
          style={styles.input}
          value={storyParams.setting}
          onChangeText={(text) => setStoryParams({ ...storyParams, setting: text })}
          placeholder="Where does the story take place?"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Theme</Text>
        <TextInput
          style={styles.input}
          value={storyParams.theme}
          onChangeText={(text) => setStoryParams({ ...storyParams, theme: text })}
          placeholder="Adventure, Mystery, Fantasy..."
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Age Group</Text>
        <TextInput
          style={styles.input}
          value={storyParams.ageGroup}
          onChangeText={(text) => setStoryParams({ ...storyParams, ageGroup: text })}
          placeholder="Children, Young Adult..."
        />
      </View>

      <TouchableOpacity 
        style={styles.generateButton}
        onPress={handleGenerate}
        disabled={isGenerating}
      >
        {isGenerating ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.generateButtonText}>Generate Story</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  generateButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  generateButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});