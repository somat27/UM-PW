// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDfrWf9cajeBe7BVT7PWT5nBOWj7gPDBiw",
    authDomain: "pw-g201.firebaseapp.com",
    projectId: "pw-g201",
    storageBucket: "pw-g201.firebasestorage.app",
    messagingSenderId: "858778948795",
    appId: "1:858778948795:web:8bb0688f9713fec265c59e",
    measurementId: "G-JWNEDZWNTX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };