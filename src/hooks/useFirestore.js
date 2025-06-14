import { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';

export default function useFirestore(collectionName, conditions = []) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        let q;
        const collectionRef = collection(db, collectionName);

        if (conditions.length > 0) {
          q = query(collectionRef, ...conditions.map(cond => where(...cond)));
        } else {
          q = query(collectionRef);
        }

        const querySnapshot = await getDocs(q);
        const fetchedData = querySnapshot.docs.map(document => ({
          id: document.id,
          ...document.data()
        }));
        setData(fetchedData);
      } catch (err) {
        console.error("Error fetching Firestore data:", err);
        setError(err.message || 'An error occurred while fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [collectionName, JSON.stringify(conditions)]);

  // Function to get a single document by ID
  const getDocument = async (id) => {
    try {
      const docRef = doc(db, collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (err) {
      console.error("Error fetching document:", err);
      throw err;
    }
  };

  return { data, loading, error, getDocument };
}