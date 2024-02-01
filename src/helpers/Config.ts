import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  deleteUser,
} from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import {
  getFirestore,
  doc,
  setDoc,
  addDoc,
  collection,
  getDoc,
  getDocs,
  where,
  query,
  updateDoc,
  arrayUnion,
  orderBy,
  deleteDoc,
  CollectionReference
} from "firebase/firestore";
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
  getMetadata,
} from "firebase/storage";

const FIREBASE_CONFIG = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};

const firebaseApp = initializeApp(FIREBASE_CONFIG);
const firebaseDB = getFirestore(firebaseApp);
const firebaseAuth = getAuth(firebaseApp);
const analytics = getAnalytics(firebaseApp);

// ACCESSING FIREBASE DOCS
const rolesRef: CollectionReference = collection(firebaseDB, "roles");
const userRef: CollectionReference = collection(firebaseDB, "users");
const categoryRef: CollectionReference = collection(firebaseDB, "categories");
const accountCollectionRef: CollectionReference = collection(firebaseDB, "accounts");
const tokenCreationRef: CollectionReference = collection(firebaseDB, "token_creations");



export {
  firebaseAuth,
  analytics,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  deleteUser,
  doc,
  setDoc,
  addDoc,
  getDoc,
  getDocs,
  where,
  query,
  updateDoc,
  arrayUnion,
  orderBy,
  deleteDoc,
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
  getMetadata,
  rolesRef,
  userRef,
  categoryRef,
  accountCollectionRef,
  tokenCreationRef
};
