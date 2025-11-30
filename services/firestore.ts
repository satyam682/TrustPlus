// Firestore data persistence service
import {
    collection,
    doc,
    setDoc,
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    onSnapshot,
    Timestamp,
    Unsubscribe
} from 'firebase/firestore';
import { db } from './firebase';
import { AppData, FeedbackData, UserData } from '../components/context/DataContext';

/**
 * Save user profile to Firestore
 */
export async function saveUserProfile(userId: string, userData: UserData): Promise<void> {
    try {
        await setDoc(doc(db, 'users', userId, 'profile', 'data'), {
            ...userData,
            updatedAt: Timestamp.now()
        });
    } catch (error) {
        console.error('Error saving user profile:', error);
        throw error;
    }
}

/**
 * Load user profile from Firestore
 */
export async function loadUserProfile(userId: string): Promise<UserData | null> {
    try {
        const docRef = doc(db, 'users', userId, 'profile', 'data');
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data() as UserData;
        }
        return null;
    } catch (error) {
        console.error('Error loading user profile:', error);
        return null;
    }
}

/**
 * Save an app to Firestore
 */
export async function saveApp(userId: string, app: AppData): Promise<void> {
    try {
        await setDoc(doc(db, 'users', userId, 'apps', app.id), {
            ...app,
            updatedAt: Timestamp.now()
        });
    } catch (error) {
        console.error('Error saving app:', error);
        throw error;
    }
}

/**
 * Load all apps for a user
 */
export async function loadApps(userId: string): Promise<AppData[]> {
    try {
        const appsRef = collection(db, 'users', userId, 'apps');
        const querySnapshot = await getDocs(appsRef);

        const apps: AppData[] = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            apps.push({
                id: doc.id,
                name: data.name,
                url: data.url,
                platform: data.platform,
                iconBg: data.iconBg,
                status: data.status,
                createdAt: data.createdAt,
                description: data.description
            });
        });

        return apps;
    } catch (error) {
        console.error('Error loading apps:', error);
        return [];
    }
}

/**
 * Delete an app from Firestore
 */
export async function deleteApp(userId: string, appId: string): Promise<void> {
    try {
        await deleteDoc(doc(db, 'users', userId, 'apps', appId));
    } catch (error) {
        console.error('Error deleting app:', error);
        throw error;
    }
}

/**
 * Save feedback to Firestore
 */
export async function saveFeedback(userId: string, feedback: FeedbackData): Promise<void> {
    try {
        await setDoc(doc(db, 'users', userId, 'feedback', feedback.id.toString()), {
            ...feedback,
            updatedAt: Timestamp.now()
        });
    } catch (error) {
        console.error('Error saving feedback:', error);
        throw error;
    }
}

/**
 * Load all feedback for a user
 */
export async function loadFeedback(userId: string): Promise<FeedbackData[]> {
    try {
        const feedbackRef = collection(db, 'users', userId, 'feedback');
        const querySnapshot = await getDocs(feedbackRef);

        const feedbacks: FeedbackData[] = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            feedbacks.push({
                id: parseInt(doc.id),
                appId: data.appId,
                appName: data.appName,
                user: data.user,
                email: data.email,
                time: data.time,
                timestamp: data.timestamp,
                content: data.content,
                rating: data.rating,
                sentiment: data.sentiment,
                tags: data.tags,
                isVerified: data.isVerified
            });
        });

        return feedbacks;
    } catch (error) {
        console.error('Error loading feedback:', error);
        return [];
    }
}

/**
 * Load all FLAGGED feedback for a user
 */
export async function loadFlaggedFeedback(userId: string): Promise<any[]> {
    try {
        const feedbackRef = collection(db, 'users', userId, 'flaggedFeedback');
        const querySnapshot = await getDocs(feedbackRef);

        const feedbacks: any[] = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            feedbacks.push({
                ...data,
                id: parseInt(doc.id) || doc.id
            });
        });

        return feedbacks;
    } catch (error) {
        console.error('Error loading flagged feedback:', error);
        return [];
    }
}

/**
 * Initialize user data structure in Firestore (called after registration)
 */
export async function initializeUserData(userId: string, userData: Partial<UserData>): Promise<void> {
    try {
        // Create user profile
        await saveUserProfile(userId, {
            name: userData.name || 'User',
            email: userData.email || '',
            company: userData.company || '',
            jobTitle: userData.jobTitle || '',
            photoUrl: userData.photoUrl || null
        });

        console.log('User data initialized in Firestore');
    } catch (error) {
        console.error('Error initializing user data:', error);
        throw error;
    }
}

/**
 * Load all user data from Firestore
 */
export async function loadUserData(userId: string): Promise<{
    profile: UserData | null;
    apps: AppData[];
    feedback: FeedbackData[];
    flaggedFeedback: any[];
}> {
    try {
        const [profile, apps, feedback, flaggedFeedback] = await Promise.all([
            loadUserProfile(userId),
            loadApps(userId),
            loadFeedback(userId),
            loadFlaggedFeedback(userId)
        ]);

        return { profile, apps, feedback, flaggedFeedback };
    } catch (error) {
        console.error('Error loading user data:', error);
        return {
            profile: null,
            apps: [],
            feedback: [],
            flaggedFeedback: []
        };
    }
}

// Public function to load a single app for feedback form (NO AUTH REQUIRED)
export async function loadPublicApp(appId: string): Promise<AppData | null> {
    try {
        // Search ALL users for this app ID (public access)
        const usersRef = collection(db, 'users');
        const usersSnapshot = await getDocs(usersRef);

        for (const userDoc of usersSnapshot.docs) {
            const appRef = doc(db, 'users', userDoc.id, 'apps', appId);
            const appSnap = await getDoc(appRef);

            if (appSnap.exists()) {
                const appData = appSnap.data();
                return {
                    id: appSnap.id,
                    name: appData.name,
                    url: appData.url,
                    platform: appData.platform,
                    iconBg: appData.iconBg || 'bg-blue-600',
                    status: appData.status || 'active',
                    createdAt: appData.createdAt || new Date().toISOString(),
                    description: appData.description
                } as AppData;
            }
        }

        return null; // App not found
    } catch (error) {
        console.error('Error loading public app:', error);
        return null;
    }
}

// Public function to save feedback WITHOUT auth (finds the app owner automatically)
export async function savePublicFeedback(appId: string, feedback: any): Promise<boolean> {
    try {
        // Find which user owns this app
        const usersRef = collection(db, 'users');
        const usersSnapshot = await getDocs(usersRef);

        for (const userDoc of usersSnapshot.docs) {
            const appRef = doc(db, 'users', userDoc.id, 'apps', appId);
            const appSnap = await getDoc(appRef);

            if (appSnap.exists()) {
                // Found the app owner! Save feedback to their collection
                await saveFeedback(userDoc.id, feedback);
                return true;
            }
        }

        return false; // App not found
    } catch (error) {
        console.error('Error saving public feedback:', error);
        return false;
    }
}

// Public function to save FLAGGED feedback WITHOUT auth
export async function savePublicFlaggedFeedback(appId: string, feedback: any): Promise<boolean> {
    try {
        // Find which user owns this app
        const usersRef = collection(db, 'users');
        const usersSnapshot = await getDocs(usersRef);

        for (const userDoc of usersSnapshot.docs) {
            const appRef = doc(db, 'users', userDoc.id, 'apps', appId);
            const appSnap = await getDoc(appRef);

            if (appSnap.exists()) {
                // Found the app owner! Save to their flagged feedback collection
                // We use a subcollection 'flaggedFeedback' under the user
                await setDoc(doc(db, 'users', userDoc.id, 'flaggedFeedback', feedback.id.toString()), {
                    ...feedback,
                    updatedAt: Timestamp.now()
                });
                return true;
            }
        }

        return false; // App not found
    } catch (error) {
        console.error('Error saving public flagged feedback:', error);
        return false;
    }
}
