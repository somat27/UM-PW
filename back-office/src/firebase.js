import { initializeApp } from "firebase/app";
import {
  addDoc,
  collection,
  getFirestore,
  doc,
  updateDoc,
  setDoc,
  getDoc,
} from "firebase/firestore";
import {
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDfrWf9cajeBe7BVT7PWT5nBOWj7gPDBiw",
  authDomain: "pw-g201.firebaseapp.com",
  projectId: "pw-g201",
  storageBucket: "pw-g201.firebasestorage.app",
  messagingSenderId: "858778948795",
  appId: "1:858778948795:web:8bb0688f9713fec265c59e",
  measurementId: "G-JWNEDZWNTX"
};

export const app            = initializeApp(firebaseConfig);
export const auth           = getAuth(app);
export const db             = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export const registerWithEmail = async (email, password, displayName) => {
  const { user } = await createUserWithEmailAndPassword(auth, email, password);
  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    displayName,
    email,
    photoURL: null,
    role: "usuario", 
  });
  return user;
};

export const loginWithEmail = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

export const loginWithGoogle = async () => {
  const { user } = await signInWithPopup(auth, googleProvider);
  const ref = doc(db, "users", user.uid);
  if (!(await getDoc(ref)).exists()) {
    await setDoc(ref, {
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      role: "usuario",
    });
  }
  return user;
};

export async function addPerito(DadosPerito) {
  try {
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
