import { useState, useEffect, useCallback } from 'react';
import { User } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, collection, getDocs, addDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import { db } from '../services/firebaseService';
import { UserSettings, IncorrectAnswer, Theme } from '../types';

const defaultSettings: UserSettings = {
  theme: 'system',
  language: 'ko',
  avatar: null,
  displayName: '',
};

export const useUserData = (user: User | null) => {
    const [userSettings, setUserSettings] = useState<UserSettings>(defaultSettings);
    const [incorrectAnswers, setIncorrectAnswers] = useState<IncorrectAnswer[]>([]);
    
    useEffect(() => {
        if (!user) {
          setIncorrectAnswers([]);
          setUserSettings(defaultSettings);
          return;
        }

        const loadUserData = async () => {
            try {
                const userDocRef = doc(db, 'users', user.uid);
                const docSnap = await getDoc(userDocRef);

                if (docSnap.exists()) {
                    const settingsData = docSnap.data() as UserSettings;
                    setUserSettings({ ...defaultSettings, ...settingsData });
                } else {
                    const initialDisplayName = user.displayName || user.email?.split('@')[0] || 'New User';
                    const newUserSettings: UserSettings = { ...defaultSettings, displayName: initialDisplayName, avatar: user.photoURL };
                    await setDoc(userDocRef, newUserSettings);
                    setUserSettings(newUserSettings);
                }

                const notesCollectionRef = collection(db, 'users', user.uid, 'incorrectAnswers');
                const notesSnapshot = await getDocs(notesCollectionRef);
                const loadedNotes = notesSnapshot.docs.map(doc => {
                    const data = doc.data();
                    return { 
                        ...data, 
                        id: doc.id,
                        timestamp: (data.timestamp as Timestamp).toMillis(),
                    } as IncorrectAnswer;
                });
                setIncorrectAnswers(loadedNotes);

            } catch (e) {
                console.error("Failed to load user data from Firestore:", e);
                setIncorrectAnswers([]);
                setUserSettings(defaultSettings);
            }
        };

        loadUserData();
    }, [user]);

    const updateSettings = useCallback(async (newSettings: Partial<UserSettings>) => {
        if (!user) return;
        const updatedSettings = { ...userSettings, ...newSettings };
        setUserSettings(updatedSettings); // Optimistic update
        try {
            const userDocRef = doc(db, 'users', user.uid);
            await updateDoc(userDocRef, newSettings);
        } catch (e) {
            console.error("Failed to update settings in Firestore:", e);
            // Optionally revert or show error
        }
    }, [user, userSettings]);

    const addIncorrectNotesBatch = useCallback(async (newNotes: Omit<IncorrectAnswer, 'id' | 'timestamp' | 'subject'>[], subject: string) => {
        if (!user || newNotes.length === 0) return;

        const notesCollectionRef = collection(db, 'users', user.uid, 'incorrectAnswers');
        const addedNotes: IncorrectAnswer[] = [];

        for (const note of newNotes) {
            if (incorrectAnswers.some(p => p.question === note.question)) {
                continue;
            }
            const timestamp = Date.now();
            const noteWithSubject = { ...note, subject };
            const newNoteData = {
                ...noteWithSubject,
                timestamp: Timestamp.fromMillis(timestamp),
            };
            try {
                const docRef = await addDoc(notesCollectionRef, newNoteData);
                addedNotes.push({ ...noteWithSubject, id: docRef.id, timestamp });
            } catch (e) {
                console.error("Error adding incorrect answer to Firestore:", e);
            }
        }
        setIncorrectAnswers(prev => [...prev, ...addedNotes]);
    }, [user, incorrectAnswers]);

    const deleteNote = useCallback(async (id: string) => {
        if (!user) return;
        const originalNotes = incorrectAnswers;
        setIncorrectAnswers(prev => prev.filter(note => note.id !== id));
        try {
            const noteDocRef = doc(db, 'users', user.uid, 'incorrectAnswers', id);
            await deleteDoc(noteDocRef);
        } catch (e) {
            console.error("Error deleting note from Firestore:", e);
            setIncorrectAnswers(originalNotes); // Revert on failure
        }
    }, [user, incorrectAnswers]);

    return { userSettings, incorrectAnswers, updateSettings, addIncorrectNotesBatch, deleteNote };
};