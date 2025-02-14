// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth} from "firebase/auth"
import {getFirestore} from "firebase/firestore"
import { getStorage} from "firebase/storage"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
  
  // const firebaseConfig = {
  //   apiKey: import.meta.env.VITE_API_KEY,
  //   // apiKey: "AIzaSyBXNTZQTggvBAAWUNLFSVBAfdFNekfrzGo",
  //   authDomain: "reactchat-53a05.firebaseapp.com",
  //   projectId: "reactchat-53a05",
  //   storageBucket: "reactchat-53a05.firebasestorage.app",
  //   messagingSenderId: "971842048956",
  //   appId: "1:971842048956:web:e71dc11093b31a8d6d51b9",
  //   measurementId: "G-6R04TZX1FH"
  // };
  const firebaseConfig = {
    apiKey: "AIzaSyBXNTZQTggvBAAWUNLFSVBAfdFNekfrzGo",
    authDomain: "reactchat-53a05.firebaseapp.com",
    projectId: "reactchat-53a05",
    storageBucket: "reactchat-53a05.firebasestorage.app",
    messagingSenderId: "971842048956",
    appId: "1:971842048956:web:e71dc11093b31a8d6d51b9",
    measurementId: "G-6R04TZX1FH"
  };
  

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
// const analytics = getAnalytics(app);