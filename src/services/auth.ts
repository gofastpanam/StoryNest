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
      return await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      if (error && typeof error === 'object' && 'code' in error) {
        throw this.handleError(error as FirebaseAuthError);
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
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      if (error && typeof error === 'object' && 'code' in error) {
        throw this.handleError(error as FirebaseAuthError);
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
    const code = error.code || 'auth/unknown';
    let message = 'An unknown error occurred';

    switch (code) {
      case 'auth/email-already-in-use':
        message = 'This email is already in use';
        break;
      case 'auth/invalid-email':
        message = 'The email address is invalid';
        break;
      case 'auth/operation-not-allowed':
        message = 'This operation is not allowed';
        break;
      case 'auth/weak-password':
        message = 'The password is too weak';
        break;
      case 'auth/user-disabled':
        message = 'This account has been disabled';
        break;
      case 'auth/user-not-found':
        message = 'No user found with this email';
        break;
      case 'auth/wrong-password':
        message = 'Incorrect password';
        break;
      default:
        message = error.message || message;
    }

    return this.createError(code, message);
  }
}
