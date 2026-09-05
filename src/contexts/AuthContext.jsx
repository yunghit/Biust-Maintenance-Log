import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword,
  signOut, sendPasswordResetEmail, updateProfile,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [initializing, setInitializing] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [role, setRole] = useState(null);
  const [name, setName] = useState('');
  const [specialty, setSpecialty] = useState('all');
  const [assignedBlocks, setAssignedBlocks] = useState([]);
  const [publicMode, setPublicMode] = useState(false);
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setInitializing(false);
      setCurrentUser(user);
      setPublicMode(false);
      if (!user) {
        setRole(null);
        return;
      }
      try {
        const userRef = doc(db, 'users', user.uid);
        let snap = await getDoc(userRef);
        if (!snap.exists()) {
          await setDoc(userRef, {
            email: user.email,
            name: user.displayName || (user.email ? user.email.split('@')[0] : 'User'),
            role: 'reporter',
            assignedBlocks: [],
            createdAt: new Date().toISOString(),
          });
          snap = await getDoc(userRef);
        }
        const data = snap.data();
        setRole(data.role || 'reporter');
        setName(data.name || '');
        setSpecialty(data.specialty || 'all');
        setAssignedBlocks(Array.isArray(data.assignedBlocks) ? data.assignedBlocks : []);
      } catch (e) {
        console.error(e);
        setAuthError('Could not load your account. Try reloading the page.');
      }
    });
    return unsub;
  }, []);

  const signIn = useCallback(async (email, password) => {
    await signInWithEmailAndPassword(auth, email, password);
  }, []);

  const signUp = useCallback(async (email, password, displayName) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName });
  }, []);

  const logout = useCallback(() => signOut(auth), []);
  const forgotPassword = useCallback((email) => sendPasswordResetEmail(auth, email), []);
  const enterPublicMode = useCallback(() => setPublicMode(true), []);
  const exitPublicMode = useCallback(() => setPublicMode(false), []);

  const isAdmin = role === 'admin';
  const isMaintainer = role === 'maintainer';
  const isSupervisor = role === 'supervisor';
  const isReporter = role === 'reporter';
  const canManageTickets = isAdmin || isMaintainer;
  const canSeeOversight = isAdmin || isSupervisor;
  const isBoardView = isAdmin || isMaintainer || isSupervisor || publicMode;

  const value = {
    initializing, currentUser, role, name, specialty, assignedBlocks,
    publicMode, authError, setAuthError,
    signIn, signUp, logout, forgotPassword, enterPublicMode, exitPublicMode,
    isAdmin, isMaintainer, isSupervisor, isReporter, canManageTickets, canSeeOversight, isBoardView,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
