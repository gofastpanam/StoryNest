import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  User,
  UserCredential,
} from 'firebase/auth';
import { auth } from '../config/firebase';

export interface AuthError {
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
      throw this.handleError(error);
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
      throw this.handleError(error);
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
      throw this.handleError(error);
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
      throw this.handleError(error);
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
   * Standardized Firebase error handling
   * @param error - Firebase error
   * @returns AuthError
   */
  private static handleError(error: any): AuthError {
    const authError: AuthError = {
      code: 'auth/unknown',
      message: 'An unknown error occurred.',
    };

    if (error.code) {
      authError.code = error.code;
      switch (error.code) {
        case 'auth/email-already-in-use':
          authError.message = 'This email is already in use.';
          break;
        case 'auth/invalid-email':
          authError.message = 'The email address is invalid.';
          break;
        case 'auth/operation-not-allowed':
          authError.message = 'This operation is not allowed.';
          break;
        case 'auth/weak-password':
          authError.message = 'The password is too weak.';
          break;
        case 'auth/user-disabled':
          authError.message = 'This account has been disabled.';
          break;
        case 'auth/user-not-found':
          authError.message = 'No user found with this email.';
          break;
        case 'auth/wrong-password':
          authError.message = 'Incorrect password.';
          break;
        default:
          authError.message = error.message;
      }
    }

    return authError;
  }
}
