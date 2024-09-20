// services/knitTypeService.ts
import { firestore } from '../firebaseConfig';
import { addDoc, collection, getDocs, doc, updateDoc, deleteDoc, getDoc, query, where } from 'firebase/firestore';

// Create a new knit type
export const createKnitType = async (values: any) => {
  const status = true;
  const docRef = await addDoc(collection(firestore, 'knittype'), values);
  return docRef.id;
};

// Get all active knit types (status == true)
export const getKnitTypes = async () => {
  const q = query(collection(firestore, 'knittype'), where('status', '==', true));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Get all deleted knit types (status == false)
export const getDeletedKnitTypes = async () => {
  const q = query(collection(firestore, 'knittype'), where('status', '==', false));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Get a specific knit type by its ID
export const getKnitTypeById = async (id: string) => {
  const knitTypeRef = doc(firestore, 'knittype', id);
  const knitTypeSnap = await getDoc(knitTypeRef);

  if (knitTypeSnap.exists()) {
    return { id: knitTypeSnap.id, ...knitTypeSnap.data() };
  } else {
    return null;
  }
};

// Update a specific knit type
export const updateKnitType = async (id: string, values: any) => {
  const knitTypeRef = doc(firestore, 'knittype', id);
  await updateDoc(knitTypeRef, values);
};

// Delete (soft delete) a specific knit type by changing its status
export const deleteKnitType = async (id: string) => {
  const knitTypeRef = doc(firestore, 'knittype', id);
  await deleteDoc(knitTypeRef);
};
