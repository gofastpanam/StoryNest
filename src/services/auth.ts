import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  User,
  UserCredential,
  AuthError as FirebaseAuthError,
} from 'firebase/auth';
import { auth } from '../config/firebase';

// Our custom error interface
export interface CustomAuthError {
  code: string;
  message: string;
}

// Authentication service that handles all interactions with Firebase Auth
export class AuthService {
  /**
   * Register a new user
   * @param email - User's email
   * @param password - User's password
   * @returns Promise<UserCredential>
   */
  static async register(email: string, password: string): Promise<UserCredential> {
    try {
      console.log('Attempting to register with:', { email });
      const result = await createUserWithEmailAndPassword(auth, email, password);
      console.log('Registration successful');
      return result;
    } catch (error) {
      console.error('Registration error:', error);
      if (error && typeof error === 'object' && 'code' in error) {
        const firebaseError = error as FirebaseAuthError;
        console.error('Firebase error code:', firebaseError.code);
        throw this.handleError(firebaseError);
      }
      throw this.createError('auth/unknown', 'An unknown error occurred');
    }
  }

  /**
   * Login an existing user
   * @param email - User's email
   * @param password - User's password
   * @returns Promise<UserCredential>
   */
  static async login(email: string, password: string): Promise<UserCredential> {
    try {
      console.log('Attempting to login with:', { email });
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log('Login successful');
      return result;
    } catch (error) {
      console.error('Login error:', error);
      if (error && typeof error === 'object' && 'code' in error) {
        const firebaseError = error as FirebaseAuthError;
        console.error('Firebase login error code:', firebaseError.code);
        throw this.handleError(firebaseError);
      }
      throw this.createError('auth/unknown', 'An unknown error occurred');
    }
  }

  /**
   * Logout the current user
   * @returns Promise<void>
   */
  static async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      if (error && typeof error === 'object' && 'code' in error) {
        throw this.handleError(error as FirebaseAuthError);
      }
      throw this.createError('auth/unknown', 'An unknown error occurred');
    }
  }

  /**
   * Send a password reset email
   * @param email - User's email
   * @returns Promise<void>
   */
  static async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      if (error && typeof error === 'object' && 'code' in error) {
        throw this.handleError(error as FirebaseAuthError);
      }
      throw this.createError('auth/unknown', 'An unknown error occurred');
    }
  }

  /**
   * Get the currently logged in user
   * @returns User | null
   */
  static getCurrentUser(): User | null {
    return auth.currentUser;
  }

  /**
   * Create a standardized error object
   * @param code - Error code
   * @param message - Error message
   * @returns CustomAuthError
   */
  private static createError(code: string, message: string): CustomAuthError {
    return { code, message };
  }

  /**
   * Standardized Firebase error handling
   * @param error - Firebase error
   * @returns CustomAuthError
   */
  private static handleError(error: FirebaseAuthError): CustomAuthError {
    console.log('Handling Firebase error:', error);

    const errorMap: { [key: string]: string } = {
      'auth/email-already-in-use': 'This email is already registered.',
      'auth/invalid-email': 'The email address is not valid.',
      'auth/operation-not-allowed':
        'Email/password accounts are not enabled. Please enable them in the Firebase Console.',
      'auth/weak-password': 'The password is too weak.',
      'auth/configuration-not-found':
        'Authentication configuration is missing. Please check Firebase Console settings.',
      'auth/network-request-failed': 'Network error. Please check your connection.',
    };

    const message = errorMap[error.code] || error.message || 'An unknown error occurred';
    return this.createError(error.code, message);
  }
}
