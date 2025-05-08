import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyD3N8Qjadp7YXEuQriKOtKrS_4YQ-abI8o",
    authDomain: "login-10361.firebaseapp.com",
    projectId: "login-10361",
    storageBucket: "login-10361.firebasestorage.app",
    messagingSenderId: "179958839045",
    appId: "1:179958839045:web:98b3f9078afd4559e8a96c",
    measurementId: "G-F53FK8VD5J"
  };
  

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account' 
});
