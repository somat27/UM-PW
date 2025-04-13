// services/firebase.js
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  updateDoc,
  doc,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";

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

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/do5hfydb2/upload";
const UPLOAD_PRESET = "EyesEveryWhere";

// 🔹 Função para submeter ocorrência ao Firebase
export async function submitOcorrencia(formData) {
  try {
    // Prepara os dados para o Firebase
    const ocorrenciaData = {
      dataSubmissao: serverTimestamp(),
      descricao: formData.observations || "",
      endereco: formData.address || "",
      imagemVideo: [],
      status: "Pendente",
      tipoOcorrencia: formData.selectedCategory || "",
      coordenadas: formData.userLocation
        ? {
            latitude: formData.userLocation.lat,
            longitude: formData.userLocation.lng,
          }
        : { latitude: 0, longitude: 0 },
    };

    // Adiciona o documento à coleção 'ocorrencias' e obtém o ID
    const docRef = await addDoc(collection(db, "ocorrencias"), ocorrenciaData);
    console.log("Ocorrência registrada com ID:", docRef.id);

    // Se houver arquivos, faz o upload para o Cloudinary
    if (formData.files && formData.files.length > 0) {
      const uploadPromises = formData.files.map((file) =>
        uploadToCloudinary(file)
      ); // Faz upload de todas as imagens

      const fileUrls = await Promise.all(uploadPromises); // Aguarda todos os uploads serem concluídos

      // Atualiza o Firestore com o array de URLs das imagens
      await updateDoc(doc(db, "ocorrencias", docRef.id), {
        imagemVideo: fileUrls.filter((url) => url !== null), // Filtra URLs inválidas
      });

      console.log("Imagens salvas no Firestore:", fileUrls);
    }

    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Erro ao registrar ocorrência:", error);
    return { success: false, error: error.message };
  }
}

// Função para upload de imagens para o Cloudinary
async function uploadToCloudinary(file) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  try {
    const response = await fetch(CLOUDINARY_URL, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Erro no upload: ${response.statusText}`);
    }

    const data = await response.json();
    return data.secure_url; // Retorna a URL do arquivo no Cloudinary
  } catch (error) {
    console.error("Erro ao enviar para Cloudinary:", error);
    return null;
  }
}

export async function getOcorrencias() {
  try {
    const querySnapshot = await getDocs(collection(db, "ocorrencias"));
    const ocorrencias = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.dataSubmissao) {
        data.dataSubmissao = data.dataSubmissao.toDate();
      }
      ocorrencias.push({
        id: doc.id,
        ...data,
      });
    });

    return ocorrencias;
  } catch (error) {
    console.error("Erro ao buscar ocorrências:", error);
    return [];
  }
}

export { uploadToCloudinary };
