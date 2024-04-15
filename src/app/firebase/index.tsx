// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, getDocs, Firestore, addDoc } from 'firebase/firestore/lite';
import { Item, User } from "../components/models";
import { getStorage } from 'firebase/storage';

// web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Función para traer datos de Items
export async function getItems(db: Firestore) {
  const itemsCol = collection(db, 'items');
  const itemsSnapshot = await getDocs(itemsCol);
  const itemsList = itemsSnapshot.docs.map(doc => doc.data());
  return itemsList;
}

// Función para agregar un nuevo item a la colección
export async function addItem(db: Firestore, newItemData: Item) {
  try {
    const itemsCol = collection(db, 'items');
    await addDoc(itemsCol, newItemData);
  } catch (error) {
    console.error("Error al agregar el item:", error);
  }
}
// Función para agregar un nuevo user a la colección users
export async function addUser(db: Firestore, newUserData: User) {
  try {
    const itemsCol = collection(db, 'users');
    await addDoc(itemsCol, newUserData);
  } catch (error) {
    console.error("Error al agregar el user:", error);
  }
}

export const auth = getAuth(app);

export const storage = getStorage(app);
