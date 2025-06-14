import { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../config/firebase';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updatePassword,
  sendPasswordResetEmail,
  fetchSignInMethodsForEmail,
  deleteUser
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  const handleMissingUserDoc = async (user) => {
    try {
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        role: 'user',
        isApproved: false,
        createdAt: new Date().toISOString(),
        uid: user.uid,
        firstName: '',
        lastName: ''
      });
      return true;
    } catch (error) {
      console.error('Failed to create user document:', error);
      return false;
    }
  };

  const updateUserData = (newData) => {
    setUserData(prev => ({ ...prev, ...newData }));
    if (currentUser) {
      setCurrentUser(prev => ({ ...prev, ...newData }));
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        setLoading(true);
        if (user) {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          
          if (!userDoc.exists()) {
            console.warn(`User document missing for UID: ${user.uid}, creating...`);
            const recovered = await handleMissingUserDoc(user);
            
            if (!recovered) {
              throw new Error('Failed to create user profile');
            }
            
            // Fetch newly created document
            const newDoc = await getDoc(doc(db, 'users', user.uid));
            const data = newDoc.data();
            setUserData(data);
            setCurrentUser({ 
              ...user, 
              ...data,
              isAdmin: data.role === 'admin'  // Add isAdmin property
            });
          } else {
            const data = userDoc.data();
            setUserData(data);
            setCurrentUser({ 
              ...user, 
              ...data,
              isAdmin: data.role === 'admin'  // Add isAdmin property
            });
          }
        } else {
          setCurrentUser(null);
          setUserData(null);
        }
      } catch (error) {
        console.error("Auth state error:", error);
        setAuthError(error);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  async function login(email, password, isAdminLogin = false) {
    setAuthError(null);
    setLoading(true);
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      
      if (!userDoc.exists()) {
        throw new Error('User account not properly configured');
      }

      const userData = userDoc.data();
      
      // Check admin privileges if admin login
      if (isAdminLogin && userData.role !== 'admin') {
        throw new Error('Admin privileges required');
      }
      
      // Immediately update state
      setUserData(userData);
      setCurrentUser({ 
        ...userCredential.user, 
        ...userData,
        isAdmin: userData.role === 'admin'  // Add isAdmin property
      });
      
      return {
        ...userCredential.user,
        ...userData,
        isAdmin: userData.role === 'admin'
      };
    } catch (error) {
      console.error('Login error:', error);
      let errorMessage = 'Login failed. Please try again.';
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Account temporarily locked. Try again later.';
      } else if (error.message.includes('privileges') || error.message.includes('Admin')) {
        errorMessage = 'Admin privileges required';
      }
      
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  async function register(email, password, userData) {
    setAuthError(null);
    setLoading(true);
    let userCredential;
    
    try {
      const methods = await fetchSignInMethodsForEmail(auth, email);
      if (methods.length > 0) {
        throw { code: 'auth/email-already-in-use' };
      }

      userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const { confirmPassword, ...cleanData } = userData;
      
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        ...cleanData,
        email,
        role: 'user',
        isApproved: false,
        createdAt: new Date().toISOString(),
        uid: userCredential.user.uid
      });

      return userCredential.user;
    } catch (error) {
      console.error('Registration error:', error);
      
      // Clean up partially created user
      if (userCredential?.user) {
        try {
          await deleteUser(userCredential.user);
        } catch (deleteError) {
          console.error('Failed to clean up auth user:', deleteError);
        }
      }
      
      let errorMessage = 'Registration failed. Please try again.';
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Email already registered';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password must be at least 6 characters';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address';
      }
      
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile(profileData) {
    try {
      if (!currentUser) {
        throw new Error('No authenticated user');
      }
      
      await updateDoc(doc(db, 'users', currentUser.uid), {
        ...profileData,
        lastUpdated: new Date().toISOString()
      });
      
      // Update local state
      updateUserData(profileData);
      
      return true;
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  }

  async function changePassword(newPassword) {
    setAuthError(null);
    try {
      if (!auth.currentUser) {
        throw new Error('No authenticated user');
      }
      await updatePassword(auth.currentUser, newPassword);
      return true;
    } catch (error) {
      console.error('Password change error:', error);
      setAuthError(error);
      throw error;
    }
  }

  async function resetPassword(email) {
    setAuthError(null);
    try {
      await sendPasswordResetEmail(auth, email);
      return true;
    } catch (error) {
      console.error('Password reset error:', error);
      
      let errorMessage = 'Password reset failed';
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email';
      }
      
      setAuthError(errorMessage);
      throw new Error(errorMessage);
    }
  }

  async function logout() {
    setAuthError(null);
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
      setAuthError(error);
      throw error;
    }
  }

  const value = {
    currentUser,
    userData,
    loading,
    authError,
    login,
    register,
    updateProfile,
    changePassword,
    resetPassword,
    logout,
    isAdmin: userData?.role === 'admin',
    clearError: () => setAuthError(null),
    updateUserData
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}