import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions"; // Add this import

const firebaseConfig = {
  apiKey: "AIzaSyAcX2GuGqP5CH3_-r0ZwnBuiKXFiH-9Dsg",
  authDomain: "kakamega-high.firebaseapp.com",
  projectId: "kakamega-high",
  storageBucket: "kakamega-high.appspot.com",
  messagingSenderId: "833010096557",
  appId: "1:833010096557:web:6a4d13e469d4d0109fa924"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app); // Add this export