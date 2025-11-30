// Authentication service using Firebase Auth
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    User,
    updateProfile,
    AuthError
} from 'firebase/auth';
import { auth } from './firebase';

export interface AuthUser {
    uid: string;
    email: string | null;
    displayName: string | null;
}

/**
 * Register a new user with email and password
 */
export async function registerUser(
    email: string,
    password: string,
    displayName: string
): Promise<{ user: AuthUser; error: null } | { user: null; error: string }> {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        // Update user profile with display name
        await updateProfile(userCredential.user, {
            displayName: displayName
        });

        return {
            user: {
                uid: userCredential.user.uid,
                email: userCredential.user.email,
                displayName: displayName
            },
            error: null
        };
    } catch (error) {
        const authError = error as AuthError;
        let errorMessage = 'Registration failed. Please try again.';

        switch (authError.code) {
            case 'auth/email-already-in-use':
                errorMessage = 'An account with this email already exists. Please login instead.';
                break;
            case 'auth/weak-password':
                errorMessage = 'Password is too weak. Please use at least 6 characters.';
                break;
            case 'auth/invalid-email':
                errorMessage = 'Invalid email format. Please check and try again.';
                break;
            case 'auth/operation-not-allowed':
                errorMessage = 'Email/password sign-in is not enabled. Please contact support.';
                break;
        }

        return { user: null, error: errorMessage };
    }
}

/**
 * Login user with email and password
 */
export async function loginUser(
    email: string,
    password: string
): Promise<{ user: AuthUser; error: null } | { user: null; error: string }> {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);

        return {
            user: {
                uid: userCredential.user.uid,
                email: userCredential.user.email,
                displayName: userCredential.user.displayName
            },
            error: null
        };
    } catch (error) {
        const authError = error as AuthError;
        let errorMessage = 'Login failed. Please try again.';

        switch (authError.code) {
            case 'auth/user-not-found':
                errorMessage = 'No account found with this email. Please sign up first.';
                break;
            case 'auth/wrong-password':
                errorMessage = 'Incorrect password. Please try again.';
                break;
            case 'auth/invalid-credential':
                errorMessage = 'Invalid email or password. Please check your credentials.';
                break;
            case 'auth/user-disabled':
                errorMessage = 'This account has been disabled. Please contact support.';
                break;
            case 'auth/too-many-requests':
                errorMessage = 'Too many failed attempts. Please try again later.';
                break;
        }

        return { user: null, error: errorMessage };
    }
}

/**
 * Logout current user
 */
export async function logoutUser(): Promise<{ success: boolean; error: string | null }> {
    try {
        await signOut(auth);
        return { success: true, error: null };
    } catch (error) {
        return {
            success: false,
            error: 'Logout failed. Please try again.'
        };
    }
}

/**
 * Get current authenticated user
 */
export function getCurrentUser(): User | null {
    return auth.currentUser;
}

/**
 * Listen to authentication state changes
 */
export function onAuthChange(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, callback);
}
