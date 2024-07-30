import { initializeApp } from "firebase/app";
import { initializeAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyBOyMb8TPtOj14R2d3WBg7OPRal3d_rKQA",
  authDomain: "minotes-3d472.firebaseapp.com",
  projectId: "minotes-3d472",
  storageBucket: "minotes-3d472.appspot.com",
  messagingSenderId: "509762728947",
  appId: "1:509762728947:web:9343ad4c8191027a379886",
  measurementId: "G-QDCSPNBGJX"
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export { app, auth, createUserWithEmailAndPassword, signInWithEmailAndPassword };