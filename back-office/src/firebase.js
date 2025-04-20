import { initializeApp } from "firebase/app";
import {
  addDoc,
  collection,
  getFirestore,
  doc,
  updateDoc,
} from "firebase/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD3N8Qjadp7YXEuQriKOtKrS_4YQ-abI8o",
  authDomain: "login-10361.firebaseapp.com",
  projectId: "login-10361",
  storageBucket: "login-10361.firebasestorage.app",
  messagingSenderId: "179958839045",
  appId: "1:179958839045:web:98b3f9078afd4559e8a96c",
  measurementId: "G-F53FK8VD5J",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account",
});

export async function addPerito(DadosPerito) {
  try {
    // First add the document to Firestore
    const Perito = {
      nome: DadosPerito.nome || "",
      email: DadosPerito.email || "",
      morada: DadosPerito.morada || "",
      dataNascimento: DadosPerito.dataNascimento || "",
      especialidade: DadosPerito.especialidade || "",
      numeroTelemovel: DadosPerito.numeroTelemovel || "",
      estado: "Disponivel",
      timestamp: new Date(), // Add timestamp for tracking
    };

    const docRef = await addDoc(collection(db, "peritos"), Perito);
    console.log("Perito Registado com ID: " + docRef.id);

    // Then try to create the user account
    try {
      const randomPassword = Math.random().toString(36).slice(-8);
      await createUserWithEmailAndPassword(
        auth,
        DadosPerito.email,
        randomPassword
      );
      console.log("Conta de usuário criada com sucesso");
    } catch (authError) {
      // If auth fails, still return the document ID since the data was saved
      console.error("Erro ao criar conta de usuário:", authError);
      // You might want to handle this case - perhaps flag the perito as needing account setup
      await updateDoc(doc(db, "peritos", docRef.id), {
        contaCriada: false,
      });
    }

    return docRef.id;
  } catch (error) {
    console.error("Erro ao adicionar perito:", error);
    throw error;
  }
}
