import { firestore } from '../firebaseConfig';
import { addDoc, collection, getDocs, doc, updateDoc, deleteDoc, getDoc, query, where } from 'firebase/firestore';

// Create a new fabric
export const createFabric = async (values: any) => {
  const status = true;
  const docRef = await addDoc(collection(firestore, 'fabric'), values);
  return docRef.id;
};

// Get all active fabrics (status == true)
export const getFabrics = async () => {
  const q = query(collection(firestore, 'fabric'), where('status', '==', true));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Get all deleted fabrics (status == false)
export const getDeletedFabrics = async () => {
  const q = query(collection(firestore, 'fabric'), where('status', '==', false));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Get a specific fabric by its ID
export const getFabricById = async (id: string) => {
  const fabricRef = doc(firestore, 'fabric', id);
  const fabricSnap = await getDoc(fabricRef);

  if (fabricSnap.exists()) {
    return { id: fabricSnap.id, ...fabricSnap.data() };
  } else {
    return null;
  }
};

// Update a specific fabric
export const updateFabric = async (id: string, values: any) => {
  const fabricRef = doc(firestore, 'fabric', id);
  await updateDoc(fabricRef, values);
};

// Soft delete a specific fabric by changing its status
export const deleteFabric = async (id: string) => {
  const fabricRef = doc(firestore, 'fabric', id);
  await deleteDoc(fabricRef);
};
