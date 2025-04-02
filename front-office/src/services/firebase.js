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
import axios from "axios";

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
const db = getFirestore(app);

// 🔹 Função para fazer upload de arquivos para o Imgur
export async function uploadToImgur(files) {
  const clientId = '7b650653626ba33'; // Substitua pelo seu Client ID do Imgur
  const uploadedUrls = [];

  for (const file of files) {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axios.post("https://api.imgur.com/3/upload", formData, {
        headers: {
          Authorization: `Client-ID ${clientId}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        uploadedUrls.push(response.data.data.link);
      }
    } catch (error) {
      console.error("Erro ao fazer upload para o Imgur:", error);
    }
  }

  return uploadedUrls;
}

// 🔹 Função para submeter ocorrência ao Firebase
export async function submitOcorrencia(formData) {
  try {
    // Prepara os dados para o Firebase
    const ocorrenciaData = {
      dataSubmissao: serverTimestamp(),
      descricao: formData.observations || "",
      endereco: formData.address || "",
      imagemVideo: "", // Será atualizado após o upload
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

    // Se houver arquivos, faz o upload para o Imgur
    if (formData.files && formData.files.length > 0) {
      const fileUrls = await uploadToImgur(formData.files);

      if (fileUrls.length > 0) {
        // Atualiza o documento com os URLs das imagens
        await updateDoc(doc(db, "ocorrencias", docRef.id), {
          imagemVideo: fileUrls.join(","), // Salva os links das imagens no Firestore
        });
      }
    }

    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Erro ao registrar ocorrência:", error);
    return { success: false, error: error.message };
  }
}

export default { submitOcorrencia, uploadToImgur };
