import { useState, useEffect, useCallback } from 'react';
import { onAuthStateChanged, User, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { auth } from '../services/firebaseService';

export const useAuth = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const changePassword = useCallback((currentPassword: string, newPassword: string): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      if (!currentUser || !currentUser.email) {
          reject({ code: 'auth/no-user' });
          return;
      }
      try {
          const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);
          await reauthenticateWithCredential(currentUser, credential);
          await updatePassword(currentUser, newPassword);
          resolve();
      } catch (error: any) {
          reject(error); // Pass the whole firebase error object up
      }
    });
  }, [currentUser]);

  return { currentUser, isAuthLoading, changePassword };
};