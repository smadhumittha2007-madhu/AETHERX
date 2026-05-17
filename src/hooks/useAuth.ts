import { useState, useEffect } from 'react';
import { db, auth } from '../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, async (u) => {
      if (u) {
        // Ensure user exists in Firestore
        const userDoc = doc(db, 'users', u.uid);
        const snap = await getDoc(userDoc);
        if (!snap.exists()) {
          await setDoc(userDoc, {
            uid: u.uid,
            email: u.email,
            name: u.displayName || 'Guest',
            totalCo2Saved: 0,
            totalEcoPoints: 0,
            createdAt: new Date().toISOString()
          });
        }
      }
      setUser(u);
      setLoading(false);
    });
  }, []);

  return { user, loading };
}
