import { auth, db } from '../config/firebase';
import { 
  createUserWithEmailAndPassword, 
  fetchSignInMethodsForEmail,
  getAuth
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export async function createAdminAccount() {
  const adminEmail = 'admin@kakamega.com';
  const adminPassword = 'TempAdminPass123!';
  const authInstance = getAuth();

  try {
    // Check if user exists in auth
    const methods = await fetchSignInMethodsForEmail(authInstance, adminEmail);
    
    if (methods.length > 0) {
      // User exists in auth - check Firestore
      const user = authInstance.currentUser || (await authInstance.getUserByEmail(adminEmail));
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (userDoc.exists()) {
        // Update role if needed
        if (userDoc.data().role !== 'admin') {
          await setDoc(doc(db, 'users', user.uid), {
            ...userDoc.data(),
            role: 'admin',
            isApproved: true
          }, { merge: true });
          console.log('⚠️ Existing account upgraded to admin');
        }
        return true;
      }
    }

    // Create new admin account
    const userCredential = await createUserWithEmailAndPassword(
      authInstance,
      adminEmail,
      adminPassword
    );

    await setDoc(doc(db, 'users', userCredential.user.uid), {
      email: adminEmail,
      role: 'admin',
      isApproved: true,
      createdAt: new Date().toISOString(),
      fullName: 'System Administrator',
      uid: userCredential.user.uid
    }, { merge: true });

    console.log('✅ Admin account created successfully');
    console.log(`Email: ${adminEmail}`);
    console.log(`Temporary Password: ${adminPassword}`);
    console.log('IMPORTANT: Change this password immediately after first login!');
    
    return true;
  } catch (error) {
    console.error('❌ Error creating admin account:', error);
    if (error.code === 'auth/email-already-in-use') {
      console.log('Account exists but may not be properly configured');
    }
    return false;
  }
}