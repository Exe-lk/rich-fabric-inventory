import { firestore } from '../firebaseConfig';
import { addDoc, collection, getDocs, doc, updateDoc, deleteDoc, getDoc, query, where } from 'firebase/firestore';

// Create a new lot
export const createCustomer = async (values:any) => {
  const status = true;
  const docRef = await addDoc(collection(firestore, 'customer'), values);
  return docRef.id;
};

// Get all active lots (status == true)
export const getCustomer = async () => {
  const q = query(collection(firestore, 'customer'), where('status', '==', true));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Get all deleted lots (status == false)
export const getDeletedCustomer= async () => {
  const q = query(collection(firestore, 'customer'), where('status', '==', false));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Get a specific lot by its ID
export const getCustomerById = async (id: string) => {
  const customerRef = doc(firestore, 'customer', id);
  const customerSnap = await getDoc(customerRef);

  if (customerSnap.exists()) {
    return { id: customerSnap.id, ...customerSnap.data() };
  } else {
    return null;
  }
};

// Update a specific lot
export const updateCustomer = async (id: string,values:any) => {

  const customerRef = doc(firestore, 'customer', id);
  await updateDoc(customerRef,values);
};

// Delete (soft delete) a specific lot by changing its status
export const deleteCustomer = async (id: string) => {
  const customerRef = doc(firestore, 'customer', id);
  await deleteDoc(customerRef);
};
