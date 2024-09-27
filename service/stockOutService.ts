import { firestore } from '../firebaseConfig';
import { addDoc, collection, getDocs, doc, updateDoc, deleteDoc, getDoc, query, where } from 'firebase/firestore';

// Create a new lot
export const createLot = async (values:any) => {
  const status = true;
  const docRef = await addDoc(collection(firestore, 'stockOut'), values);
  return docRef.id;
};

// Get all active lots (status == true)
export const getLots = async () => {
  const q = query(collection(firestore, 'stockOut'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Get all deleted lots (status == false)
export const getDeletedLots = async () => {
  const q = query(collection(firestore, 'stockOut'), where('status', '==', false));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Get a specific lot by its ID
export const getLotById = async (id: string) => {
  const lotRef = doc(firestore, 'stockOut', id);
  const lotSnap = await getDoc(lotRef);

  if (lotSnap.exists()) {
    return { id: lotSnap.id, ...lotSnap.data() };
  } else {
    return null;
  }
};

// Update a specific lot
export const updateLot = async (id: string,values:any) => {
  const lotRef = doc(firestore, 'stockOut', id);
  await updateDoc(lotRef,values);
};

// Delete (soft delete) a specific lot by changing its status
export const deleteLot = async (id: string) => {
  const lotRef = doc(firestore, 'stockOut', id);
  console.log(id)
  await deleteDoc(lotRef);
};
