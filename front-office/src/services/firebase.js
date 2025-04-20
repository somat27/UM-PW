// services/firebase.js
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  updateDoc,
  doc,
  getDocs,
  getDoc,
  serverTimestamp,
  query,
  where,
  getCountFromServer,
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

export async function getEstatisticas() {
  try {
    // 🔸 Pega todas as auditorias
    const auditoriasRef = collection(db, "auditorias");
    const auditoriasSnapshot = await getDocs(auditoriasRef);

    let totalAuditorias = 0;
    let totalTempoResolucao = 0;

    for (const docAuditoria of auditoriasSnapshot.docs) {
      const auditoria = docAuditoria.data();
      const dataFim = auditoria.dataFIM?.toDate?.();
      const ocorrenciaId = auditoria.ocorrencia;

      if (dataFim && ocorrenciaId) {
        // Busca a ocorrência associada
        const ocorrenciaSnap = await getDoc(
          doc(db, "ocorrencias", ocorrenciaId)
        );

        if (ocorrenciaSnap.exists()) {
          const ocorrencia = ocorrenciaSnap.data();
          const dataSubmissao = ocorrencia.dataSubmissao?.toDate?.();

          if (dataSubmissao) {
            const diffMs = dataFim - dataSubmissao;
            const diffDias = diffMs / (1000 * 60 * 60 * 24);
            totalTempoResolucao += diffDias;
            totalAuditorias++;
          }
        }
      }
    }

    const tempoMedioResolucao =
      totalAuditorias > 0
        ? parseFloat((totalTempoResolucao / totalAuditorias).toFixed(2))
        : 0;

    // 🔸 Contagem de auditorias e ocorrências resolvidas
    const ocorrenciasResolvidasQuery = query(
      collection(db, "ocorrencias"),
      where("status", "==", "Resolvido")
    );
    const resolvidasSnapshot = await getCountFromServer(
      ocorrenciasResolvidasQuery
    );
    const numResolvidas = resolvidasSnapshot.data().count;

    const numAuditorias = auditoriasSnapshot.size;

    const feedbacksRef = collection(db, "feedback");
    const feedbacksSnapshot = await getDocs(feedbacksRef);

    let totalRating = 0;
    let totalFeedbacks = 0;

    feedbacksSnapshot.forEach((doc) => {
      const feedback = doc.data();
      if (feedback.avaliacao !== undefined && feedback.avaliacao !== null) {
        totalRating += Number(feedback.avaliacao);
        totalFeedbacks++;
      }
    });

    const mediaAvaliacoes =
      totalFeedbacks > 0
        ? parseFloat((totalRating / totalFeedbacks).toFixed(2))
        : 0;


    return {
      ocorrenciasResolvidas: numResolvidas,
      auditoriasRealizadas: numAuditorias,
      tempoMedioResolucao, // em dias
      mediaAvaliacoes, // média das avaliações (0-100)
    };
  } catch (error) {
    console.error("Erro ao buscar estatísticas:", error);
    return {
      ocorrenciasResolvidas: 0,
      auditoriasRealizadas: 0,
      tempoMedioResolucao: 0,
      mediaAvaliacoes: 0,
      error: error.message,
    };
  }
}

export const saveFeedback = async (feedbackData) => {
  try {
    // Adiciona timestamp do servidor e formata os dados
    const dataToSave = {
      avaliacao: feedbackData.rating,
      comentario: feedbackData.feedback,
      data: serverTimestamp(),
    };

    // Obtém referência da coleção 'feedback'
    const feedbackRef = collection(db, "feedback");

    // Adiciona o documento à coleção
    const docRef = await addDoc(feedbackRef, dataToSave);

    console.log("Feedback salvo com sucesso com ID:", docRef.id);
    return docRef;
  } catch (error) {
    console.error("Erro ao salvar feedback:", error);
    throw error;
  }
};
