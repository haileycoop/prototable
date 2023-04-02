import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCfudHStVYSjKV_WtO1c8xalvWLi_8cAl8",
  authDomain: "prototable-c06d8.firebaseapp.com",
  projectId: "prototable-c06d8",
  storageBucket: "prototable-c06d8.appspot.com",
  messagingSenderId: "780593428437",
  appId: "1:780593428437:web:5004bf8b3662875ab1ef5c"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

export { app, auth, db };