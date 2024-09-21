import { firestore } from '../firebaseConfig';
import { addDoc, collection, getDocs, doc, updateDoc, deleteDoc, getDoc, query, where } from 'firebase/firestore';

// Create a new color
export const createColor = async (values: any) => {
  const status = true;
  const docRef = await addDoc(collection(firestore, 'color'), values);
  return docRef.id;
};

// Get all active colors (status == true)
export const getColors = async () => {
  const q = query(collection(firestore, 'color'), where('status', '==', true));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Get all deleted colors (status == false)
export const getDeletedColors = async () => {
  const q = query(collection(firestore, 'color'), where('status', '==', false));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Get a specific color by its ID
export const getColorById = async (id: string) => {
  const colorRef = doc(firestore, 'color', id);
  const colorSnap = await getDoc(colorRef);

  if (colorSnap.exists()) {
    return { id: colorSnap.id, ...colorSnap.data() };
  } else {
    return null;
  }
};

// Update a specific color
export const updateColor = async (id: string, values: any) => {
  const colorRef = doc(firestore, 'color', id);
  await updateDoc(colorRef, values);
};

// Delete (soft delete) a specific color by changing its status
export const deleteColor = async (id: string) => {
  const colorRef = doc(firestore, 'color', id);
  await deleteDoc(colorRef);
};
