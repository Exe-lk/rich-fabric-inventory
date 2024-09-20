import { firestore } from '../firebaseConfig';
import { addDoc, collection, getDocs, doc, updateDoc, deleteDoc, getDoc, query, where } from 'firebase/firestore';

// Create a new lot
export const createSupplier = async (values:any) => {
  const status = true;
  const docRef = await addDoc(collection(firestore, 'supplier'), values);
  return docRef.id;
};

// Get all active lots (status == true)
export const getSuppliers = async () => {
  const q = query(collection(firestore, 'supplier'), where('status', '==', true));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Get all deleted lots (status == false)
export const getDeletedSuppliers= async () => {
  const q = query(collection(firestore, 'supplier'), where('status', '==', false));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Get a specific lot by its ID
export const getSupplierById = async (id: string) => {
  const lotRef = doc(firestore, 'supplier', id);
  const lotSnap = await getDoc(lotRef);

  if (lotSnap.exists()) {
    return { id: lotSnap.id, ...lotSnap.data() };
  } else {
    return null;
  }
};

// Update a specific lot
export const updateSupplier = async (id: string,values:any) => {
  const supplierRef = doc(firestore, 'supplier', id);
  await updateDoc(supplierRef,values);
};

// Delete (soft delete) a specific lot by changing its status
export const deleteSupplier = async (id: string) => {
  const supplierRef = doc(firestore, 'supplier', id);
  await deleteDoc(supplierRef);
};
