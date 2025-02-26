import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAuth } from '../../contexts/AuthContext';
import { CustomAuthError } from '../../services/auth';
import { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

export const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { register } = useAuth();

  const handleRegister = async () => {
    console.log('Register button pressed');
    console.log('Form state:', { email, password, confirmPassword, isLoading });

    setError(null);

    if (!email || !password || !confirmPassword) {
      console.log('Validation failed: empty fields');
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      console.log('Validation failed: passwords do not match');
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      console.log('Validation failed: password too short');
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);
    try {
      console.log('Starting registration process...');
      await register(email, password);
      console.log('Registration completed successfully');
      Alert.alert(
        'Success',
        'Account created successfully! You will be redirected to the home screen.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Registration error in screen:', error);
      const authError = error as CustomAuthError;
      setError(authError.message || 'An error occurred during registration');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.form}>
        <Text style={styles.title}>Create Account</Text>

        {error && <Text style={styles.errorText}>{error}</Text>}

        <TextInput
          style={[styles.input, error ? styles.inputError : null]}
          placeholder="Email"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setError(null);
          }}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          editable={!isLoading}
        />

        <TextInput
          style={[styles.input, error ? styles.inputError : null]}
          placeholder="Password"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setError(null);
          }}
          secureTextEntry
          autoCapitalize="none"
          editable={!isLoading}
        />

        <TextInput
          style={[styles.input, error ? styles.inputError : null]}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={(text) => {
            setConfirmPassword(text);
            setError(null);
          }}
          secureTextEntry
          autoCapitalize="none"
          editable={!isLoading}
        />

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleRegister}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Sign Up</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.linkButton}
          onPress={() => navigation.navigate('Login')}
          disabled={isLoading}
        >
          <Text style={styles.linkText}>Already have an account? Sign in</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  form: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: '#ff6b6b',
  },
  button: {
    height: 50,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkButton: {
    marginTop: 15,
    padding: 10,
  },
  linkText: {
    color: '#007AFF',
    textAlign: 'center',
  },
  errorText: {
    color: '#ff6b6b',
    marginBottom: 15,
    textAlign: 'center',
  },
});
