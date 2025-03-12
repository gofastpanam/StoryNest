import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useStory } from '../../contexts/StoryContext';
import { StoryParams } from '../../services/openai';
import { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'StoryGenerator'>;

export const StoryGeneratorScreen: React.FC<Props> = ({ navigation }) => {
  const { generateStory, isGenerating } = useStory();
  const [storyParams, setStoryParams] = useState<StoryParams>({
    mainCharacter: '',
    setting: '',
    theme: '',
    ageGroup: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof StoryParams, string>>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof StoryParams, string>> = {};
    let isValid = true;

    Object.entries(storyParams).forEach(([key, value]) => {
      if (!value.trim()) {
        newErrors[key as keyof StoryParams] =
          `${key.charAt(0).toUpperCase() + key.slice(1)} is required`;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleGenerate = async () => {
    if (!validateForm()) return;

    try {
      const story = await generateStory(storyParams);
      const storyToPass = {
        ...story,
        createdAt: story.createdAt.toISOString(),
      };
      navigation.navigate('StoryViewer', { story: storyToPass });
    } catch (error) {
      Alert.alert('Error', 'Failed to generate story. Please try again.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Create Your Story</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Main Character</Text>
        <TextInput
          style={[styles.input, errors.mainCharacter ? styles.inputError : null]}
          value={storyParams.mainCharacter}
          onChangeText={(text) => {
            setStoryParams({ ...storyParams, mainCharacter: text });
            if (errors.mainCharacter) {
              setErrors({ ...errors, mainCharacter: undefined });
            }
          }}
          placeholder="Enter the main character's name"
        />
        {errors.mainCharacter ? <Text style={styles.errorText}>{errors.mainCharacter}</Text> : null}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Setting</Text>
        <TextInput
          style={[styles.input, errors.setting ? styles.inputError : null]}
          value={storyParams.setting}
          onChangeText={(text) => {
            setStoryParams({ ...storyParams, setting: text });
            if (errors.setting) {
              setErrors({ ...errors, setting: undefined });
            }
          }}
          placeholder="Where does the story take place?"
        />
        {errors.setting ? <Text style={styles.errorText}>{errors.setting}</Text> : null}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Theme</Text>
        <TextInput
          style={[styles.input, errors.theme ? styles.inputError : null]}
          value={storyParams.theme}
          onChangeText={(text) => {
            setStoryParams({ ...storyParams, theme: text });
            if (errors.theme) {
              setErrors({ ...errors, theme: undefined });
            }
          }}
          placeholder="Adventure, Mystery, Fantasy..."
        />
        {errors.theme ? <Text style={styles.errorText}>{errors.theme}</Text> : null}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Age Group</Text>
        <TextInput
          style={[styles.input, errors.ageGroup ? styles.inputError : null]}
          value={storyParams.ageGroup}
          onChangeText={(text) => {
            setStoryParams({ ...storyParams, ageGroup: text });
            if (errors.ageGroup) {
              setErrors({ ...errors, ageGroup: undefined });
            }
          }}
          placeholder="Children, Young Adult..."
        />
        {errors.ageGroup ? <Text style={styles.errorText}>{errors.ageGroup}</Text> : null}
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
  inputError: {
    borderColor: '#ff3b30',
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 14,
    marginTop: 4,
  },
  generateButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 40,
  },
  generateButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
