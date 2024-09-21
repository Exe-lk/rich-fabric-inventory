// services/gsmService.ts
import { firestore } from '../firebaseConfig';
import { addDoc, collection, getDocs, doc, updateDoc, deleteDoc, getDoc, query, where } from 'firebase/firestore';

// Create a new GSM
export const createGsm = async (values: any) => {
  const status = true;
  const docRef = await addDoc(collection(firestore, 'gsm'), values);
  return docRef.id;
};

// Get all active GSMs (status == true)
export const getGsms = async () => {
  const q = query(collection(firestore, 'gsm'), where('status', '==', true));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Get all deleted GSMs (status == false)
export const getDeletedGsms = async () => {
  const q = query(collection(firestore, 'gsm'), where('status', '==', false));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Get a specific GSM by its ID
export const getGsmById = async (id: string) => {
  const gsmRef = doc(firestore, 'gsm', id);
  const gsmSnap = await getDoc(gsmRef);

  if (gsmSnap.exists()) {
    return { id: gsmSnap.id, ...gsmSnap.data() };
  } else {
    return null;
  }
};

// Update a specific GSM
export const updateGsm = async (id: string, values: any) => {
  const gsmRef = doc(firestore, 'gsm', id);
  await updateDoc(gsmRef, values);
};

// Delete (soft delete) a specific GSM by changing its status
export const deleteGsm = async (id: string) => {
  const gsmRef = doc(firestore, 'gsm', id);
  await deleteDoc(gsmRef);
};
