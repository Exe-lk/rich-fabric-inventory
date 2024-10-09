// services/lotMovementService.ts
import { firestore } from '../firebaseConfig';
import { addDoc, collection, getDocs, doc, updateDoc, deleteDoc, getDoc, query, where } from 'firebase/firestore';

// Create a new lot movement
export const createLotMovement = async (values: any) => {
  const status = true;
  const docRef = await addDoc(collection(firestore, 'lotMovement'), values);
  return docRef.id;
};

// Get all active lot movements (status == true)
export const getLotMovements = async () => {
  const q = query(collection(firestore, 'lotMovement'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Get all deleted lot movements (status == false)
export const getDeletedLotMovements = async () => {
  const q = query(collection(firestore, 'lotMovement'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Get a specific lot movement by its ID
export const getLotMovementById = async (id: string) => {
  const lotMovementRef = doc(firestore, 'lotMovement', id);
  const lotMovementSnap = await getDoc(lotMovementRef);

  if (lotMovementSnap.exists()) {
    return { id: lotMovementSnap.id, ...lotMovementSnap.data() };
  } else {
    return null;
  }
};

// Update a specific lot movement
export const updateLotMovement = async (id: string, values: any) => {
  const lotMovementRef = doc(firestore, 'lotMovement', id);
  await updateDoc(lotMovementRef, values);
};

// Delete (soft delete) a specific lot movement by changing its status
export const deleteLotMovement = async (id: string) => {
  const lotMovementRef = doc(firestore, 'lotMovement', id);
  await deleteDoc(lotMovementRef);
};
