// services/firebase.js
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDfrWf9cajeBe7BVT7PWT5nBOWj7gPDBiw",
  authDomain: "pw-g201.firebaseapp.com",
  projectId: "pw-g201",
  storageBucket: "pw-g201.firebasestorage.app",
  messagingSenderId: "858778948795",
  appId: "1:858778948795:web:8bb0688f9713fec265c59e",
  measurementId: "G-JWNEDZWNTX",
};

const app = initializeApp(firebaseConfig);

// Inicializa e obtém serviços

const db = getFirestore(app);
const storage = getStorage(app);

// Função para submeter ocorrência ao Firebase
export async function submitOcorrencia(formData) {
  try {
    // Prepara os dados para o Firebase
    const ocorrenciaData = {
      dataSubmissao: serverTimestamp(),
      descricao: formData.observations || "",
      endereco: formData.address || "",
      imagemVideo: "", // Será atualizado após o upload de arquivos
      status: "Pendente",
      tipoOcorrencia: formData.selectedCategory || "",
      coordenadas: formData.userLocation
        ? {
            latitude: formData.userLocation.lat,
            longitude: formData.userLocation.lng,
          }
        : { latitude: 0, longitude: 0 },
    };

    // Adiciona o documento à coleção 'ocorrencias'
    const docRef = await addDoc(collection(db, "ocorrencias"), ocorrenciaData);
    console.log("Ocorrência registrada com ID:", docRef.id);

    // Se houver arquivos, faz o upload
    if (formData.files && formData.files.length > 0) {
      const fileUrls = await uploadFiles(docRef.id, formData.files);

      // Atualiza o documento com os URLs dos arquivos
      await updateDoc(doc(db, "ocorrencias", docRef.id), {
        imagemVideo: fileUrls.join(","),
      });
    }

    return {
      success: true,
      id: docRef.id,
    };
  } catch (error) {
    console.error("Erro ao registrar ocorrência:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

// Função para fazer upload de arquivos
async function uploadFiles(ocorrenciaId, files) {
  const uploadPromises = [];
  const fileUrls = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const fileReference = storageRef(
      storage,
      `ocorrencias/${ocorrenciaId}/${file.name}`
    );

    const uploadPromise = uploadBytes(fileReference, file)
      .then((snapshot) => getDownloadURL(snapshot.ref))
      .then((downloadURL) => {
        fileUrls.push(downloadURL);
        return downloadURL;
      });

    uploadPromises.push(uploadPromise);
  }

  await Promise.all(uploadPromises);
  return fileUrls;
}

export default {
  submitOcorrencia,
};
