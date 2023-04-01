// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const db = firebase.firestore();

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCfudHStVYSjKV_WtO1c8xalvWLi_8cAl8",
  authDomain: "prototable-c06d8.firebaseapp.com",
  projectId: "prototable-c06d8",
  storageBucket: "prototable-c06d8.appspot.com",
  messagingSenderId: "780593428437",
  appId: "1:780593428437:web:5004bf8b3662875ab1ef5c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);