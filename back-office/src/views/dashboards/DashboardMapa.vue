<template>
  <div class="dashboard-container">
    <div class="dashboard-layout">
      <aside class="sidebar-column">
        <nav class="sidebar-nav">
          <div class="sidebar-background">
            <NavigationList />
          </div>
        </nav>
      </aside>
      <main class="main-content">
        <div class="content-wrapper">
          <nav class="navigation-tabs">
            <router-link
              to="/dashboards/auditorias"
              class="tab-link"
              :class="{ active: activeTab === 'auditorias' }"
              @click="activeTab = 'auditorias'"
            >
              Auditorias por região
            </router-link>
            <router-link
              to="/dashboards/ocorrencias"
              class="tab-link"
              :class="{ active: activeTab === 'ocorrencias' }"
              @click="activeTab = 'ocorrencias'"
            >
              Ocorrências por região
            </router-link>
            <router-link
              to="/dashboards/peritos"
              class="tab-link"
              :class="{ active: activeTab === 'peritos' }"
              @click="activeTab = 'peritos'"
            >
              Peritos Ativos e em Espera
            </router-link>
            <router-link
              to="/dashboards/materiais"
              class="tab-link"
              :class="{ active: activeTab === 'materiais' }"
              @click="activeTab = 'materiais'"
            >
              Materiais Usados & Por Usar
            </router-link>
            <router-link
              to="/dashboards/mapa"
              class="tab-link"
              :class="{ active: activeTab === 'mapa' }"
              @click="activeTab = 'mapa'"
            >
              Auditorias e Ocorrências no Terreno
            </router-link>
          </nav>

          <!-- Conteúdo do Mapa -->
          <div v-if="activeTab === 'mapa'" class="map-container">
            <div class="map-controls">
              <div class="map-legend">
                <div class="legend-item">
                  <span class="legend-marker pendente-marker"></span>
                  <span>Ocorrências Pendentes</span>
                </div>
                <div class="legend-item">
                  <span class="legend-marker analise-marker"></span>
                  <span>Auditorias em Andamento</span>
                </div>
                <div class="legend-item">
                  <span class="legend-marker resolvido-marker"></span>
                  <span>Auditorias Finalizadas</span>
                </div>
              </div>
              <div class="map-filters">
                <label class="filter-checkbox">
                  <input
                    type="checkbox"
                    v-model="filtros.mostrarPendentes"
                    @change="
                      limparMarcadores();
                      adicionarMarcadores();
                    "
                  />
                  <span>Ocorrências Pendentes</span>
                </label>
                <label class="filter-checkbox">
                  <input
                    type="checkbox"
                    v-model="filtros.mostrarAnalise"
                    @change="
                      limparMarcadores();
                      adicionarMarcadores();
                    "
                  />
                  <span>Auditorias em Andamento</span>
                </label>
                <label class="filter-checkbox">
                  <input
                    type="checkbox"
                    v-model="filtros.mostrarResolvidos"
                    @change="
                      limparMarcadores();
                      adicionarMarcadores();
                    "
                  />
                  <span>Auditorias Finalizadas</span>
                </label>
              </div>
            </div>
            <div id="google-map" ref="googleMap" class="google-map"></div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import NavigationList from "@/components/NavigationList.vue";
import { db } from "@/firebase.js";
import { collection, getDocs, query, where } from "firebase/firestore";

const activeTab = ref("mapa");
const googleMap = ref(null);
const map = ref(null);
const markers = ref([]);
const dados = ref([]);
const filtros = ref({
  mostrarPendentes: true,
  mostrarAnalise: true,
  mostrarResolvidos: true,
});

// Ícones para os diferentes status
const STATUS_ICONS = {
  Pendente: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
  Analise: "https://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
  Resolvido: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
};

// Função para buscar todas as ocorrências com suas auditorias relacionadas
async function getDados() {
  try {
    const ocorrenciasRef = collection(db, "ocorrencias");
    const snapshot = await getDocs(ocorrenciasRef);

    const todosItens = [];

    for (const doc of snapshot.docs) {
      const ocorrencia = { id: doc.id, ...doc.data(), tipo: "ocorrencia" };

      // Adiciona a ocorrência à lista se tiver coordenadas
      if (
        ocorrencia.coordenadas &&
        ocorrencia.coordenadas.latitude &&
        ocorrencia.coordenadas.longitude
      ) {
        todosItens.push(ocorrencia);
      }

      // Busca auditoria relacionada se existir (mesmo ID da ocorrência)
      try {
        const auditoriasRef = collection(db, "auditorias");
        const auditoriaQuery = query(
          auditoriasRef,
          where("ocorrenciaId", "==", doc.id)
        );
        const auditoriaSnapshot = await getDocs(auditoriaQuery);

        if (!auditoriaSnapshot.empty) {
          const auditoriaDoc = auditoriaSnapshot.docs[0];
          const auditoria = {
            id: auditoriaDoc.id,
            ...auditoriaDoc.data(),
            tipo: "auditoria",
            ocorrenciaId: doc.id,
          };

          // Só adiciona a auditoria se tiver coordenadas, ou usa as coordenadas da ocorrência
          if (
            !auditoria.coordenadas ||
            !auditoria.coordenadas.latitude ||
            !auditoria.coordenadas.longitude
          ) {
            auditoria.coordenadas = ocorrencia.coordenadas;
          }

          todosItens.push(auditoria);
        }
      } catch (error) {
        console.error(
          `Erro ao buscar auditoria para ocorrência ${doc.id}:`,
          error
        );
      }
    }

    console.log("Dados carregados:", todosItens.length, "itens");
    return todosItens;
  } catch (error) {
    console.error("Erro ao buscar dados:", error);
    throw error;
  }
}

// Função para inicializar o mapa
function inicializarMapa() {
  // Verificar se o elemento DOM já existe
  const mapElement = document.getElementById("google-map");
  if (!mapElement || !window.google) {
    console.error(
      "Elemento do mapa não encontrado ou API do Google não carregada"
    );
    return;
  }

  console.log("Inicializando mapa com elemento:", mapElement);

  // Centro inicial do mapa (pode ser ajustado conforme necessário)
  const centroInicial = { lat: 38.7223, lng: -9.1393 }; // Lisboa como ponto inicial

  try {
    // Criação do mapa
    map.value = new window.google.maps.Map(mapElement, {
      center: centroInicial,
      zoom: 7,
      mapTypeControl: true,
      streetViewControl: false,
      fullscreenControl: true,
      zoomControl: true,
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
      ],
    });

    console.log("Mapa inicializado com sucesso");
  } catch (error) {
    console.error("Erro ao inicializar o mapa:", error);
  }
}

// Função para carregar os dados e adicionar ao mapa
async function carregarDados() {
  try {
    // Primeiro, limpar todos os marcadores existentes
    limparMarcadores();

    // Buscar dados do Firestore (apenas se dados ainda não estiverem carregados)
    if (dados.value.length === 0) {
      const todosDados = await getDados();
      dados.value = todosDados;
      console.log("Dados iniciais carregados:", dados.value.length);
    }

    // Adicionar marcadores ao mapa
    adicionarMarcadores();
  } catch (error) {
    console.error("Erro ao carregar dados:", error);
  }
}

// Função para determinar a categoria de um item com base no status
function determinarCategoria(item) {
  // Se for uma ocorrência e tiver status Pendente
  if (item.tipo === "ocorrencia" && item.status === "Pendente") {
    return "Pendente";
  }

  // Se for uma auditoria ou ocorrência em análise
  if (item.status === "Analise") {
    return "Analise";
  }

  // Se for uma auditoria ou ocorrência resolvida
  if (item.status === "Resolvido") {
    return "Resolvido";
  }

  // Caso não se encaixe em nenhuma categoria, assume Pendente como padrão
  return "Pendente";
}

// Função para adicionar marcadores no mapa
function adicionarMarcadores() {
  // Garantir que o mapa está inicializado
  if (!map.value || !window.google) {
    console.error("Mapa não inicializado");
    return;
  }

  console.log("Adicionando marcadores...");
  console.log("Filtros atuais:", filtros.value);

  // Limpar marcadores existentes
  limparMarcadores();

  // Contador para verificar quantos marcadores foram adicionados
  let marcadoresAdicionados = 0;

  dados.value.forEach((item) => {
    // Determinar a categoria do item
    const categoria = determinarCategoria(item);

    // Verificar se esta categoria deve ser mostrada com base nos filtros
    if (
      (categoria === "Pendente" && filtros.value.mostrarPendentes) ||
      (categoria === "Analise" && filtros.value.mostrarAnalise) ||
      (categoria === "Resolvido" && filtros.value.mostrarResolvidos)
    ) {
      // Verifica se tem coordenadas válidas
      if (
        item.coordenadas &&
        item.coordenadas.latitude &&
        item.coordenadas.longitude
      ) {
        const titulo =
          item.tipo === "ocorrencia"
            ? item.titulo || "Ocorrência"
            : item.nome || "Auditoria";

        const marker = criarMarcador(
          item.coordenadas.latitude,
          item.coordenadas.longitude,
          titulo,
          categoria,
          item
        );

        if (marker) {
          markers.value.push(marker);
          marcadoresAdicionados++;
        }
      }
    }
  });

  console.log(`Adicionados ${marcadoresAdicionados} marcadores`);

  // Só ajustar o zoom se houver marcadores
  if (marcadoresAdicionados > 0) {
    // Ajustar o zoom para mostrar todos os marcadores
    ajustarZoom();
  }
}

// Função para criar um marcador
function criarMarcador(lat, lng, titulo, categoria, dados) {
  if (!window.google || !map.value) return null;

  const position = { lat: parseFloat(lat), lng: parseFloat(lng) };

  // Validar posição
  if (isNaN(position.lat) || isNaN(position.lng)) {
    console.error("Coordenadas inválidas:", lat, lng);
    return null;
  }

  // Configuração do ícone com base na categoria
  const icone = {
    url: STATUS_ICONS[categoria],
    scaledSize: new window.google.maps.Size(30, 30),
  };

  // Criar marcador
  const marker = new window.google.maps.Marker({
    position,
    map: map.value,
    title: titulo,
    icon: icone,
    animation: window.google.maps.Animation.DROP,
  });

  // Conteúdo da janela de informação
  let conteudo = "";

  if (dados.tipo === "auditoria") {
    // Conteúdo para auditorias
    conteudo = `
      <div class="info-window">
        <h3>${
          dados.nome || "Auditoria"
        } <span class="status-badge ${categoria.toLowerCase()}">${
      dados.status || "N/A"
    }</span></h3>
        <p><strong>Data:</strong> ${formatarData(dados.data)}</p>
        <p><strong>Tipo:</strong> ${dados.tipo || "N/A"}</p>
        <p><strong>Responsável:</strong> ${dados.responsavel || "N/A"}</p>
        <p><strong>Ocorrência associada:</strong> ${
          dados.ocorrenciaId || "N/A"
        }</p>
      </div>
    `;
  } else {
    // Conteúdo para ocorrências
    conteudo = `
      <div class="info-window">
        <h3>${
          dados.titulo || "Ocorrência"
        } <span class="status-badge ${categoria.toLowerCase()}">${
      dados.status || "N/A"
    }</span></h3>
        <p><strong>Data:</strong> ${formatarData(dados.data)}</p>
        <p><strong>Tipo:</strong> ${dados.tipoOcorrencia || "N/A"}</p>
        <p><strong>Prioridade:</strong> ${dados.prioridade || "N/A"}</p>
        <p><strong>Reportado por:</strong> ${dados.reportadoPor || "N/A"}</p>
      </div>
    `;
  }

  // Criar a janela de informação com estilo
  const infoWindow = new window.google.maps.InfoWindow({
    content: conteudo,
    maxWidth: 300,
    pixelOffset: new window.google.maps.Size(0, -5),
  });

  // Adicionar evento de clique ao marcador
  marker.addListener("click", () => {
    // Fechar todas as janelas de informação abertas
    markers.value.forEach((m) => {
      if (m.infoWindow) {
        m.infoWindow.close();
      }
    });

    // Abrir esta janela de informação
    infoWindow.open(map.value, marker);

    // Adicionar animação ao clicar
    marker.setAnimation(window.google.maps.Animation.BOUNCE);
    setTimeout(() => {
      marker.setAnimation(null);
    }, 750);
  });

  // Armazenar a referência da janela de informação
  marker.infoWindow = infoWindow;

  return marker;
}

// Função para limpar marcadores - REFORÇADA
function limparMarcadores() {
  console.log("Limpando", markers.value.length, "marcadores");

  // 1. Remover todos os marcadores do mapa
  for (const marker of markers.value) {
    if (marker.infoWindow) {
      marker.infoWindow.close();
      marker.infoWindow = null;
    }
    marker.setMap(null);
  }

  // 2. Limpar array de marcadores
  markers.value = [];

  // 3. Recriar o mapa a partir do elemento DOM
  const mapElement = document.getElementById("google-map");
  if (!mapElement) {
    console.warn("Elemento #google-map não encontrado");
    return;
  }

  const centroInicial = { lat: 38.7223, lng: -9.1393 }; // Lisboa

  map.value = new window.google.maps.Map(mapElement, {
    center: centroInicial,
    zoom: 7,
    mapTypeControl: true,
    streetViewControl: false,
    fullscreenControl: true,
    zoomControl: true,
    styles: [
      {
        featureType: "poi",
        elementType: "labels",
        stylers: [{ visibility: "off" }],
      },
    ],
  });

  console.log("Mapa reiniciado com sucesso");
}

// Função para ajustar o zoom para mostrar todos os marcadores
function ajustarZoom() {
  if (!markers.value.length || !window.google || !map.value) return;

  const bounds = new window.google.maps.LatLngBounds();
  let marcadoresValidos = 0;

  markers.value.forEach((marker) => {
    if (marker && marker.getPosition()) {
      bounds.extend(marker.getPosition());
      marcadoresValidos++;
    }
  });

  if (marcadoresValidos > 0) {
    map.value.fitBounds(bounds);

    // Se houver apenas um marcador, ajustar o zoom
    if (marcadoresValidos === 1) {
      map.value.setZoom(12);
    }
  }
}

// Função para formatar data
function formatarData(timestamp) {
  if (!timestamp) return "N/A";

  let data;

  if (timestamp.seconds) {
    // Se for um timestamp do Firestore
    data = new Date(timestamp.seconds * 1000);
  } else if (timestamp instanceof Date) {
    data = timestamp;
  } else {
    try {
      data = new Date(timestamp);
    } catch (error) {
      return "Data inválida";
    }
  }

  return data.toLocaleDateString("pt-PT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Carregar script da Google Maps API
function carregarGoogleMapsAPI() {
  return new Promise((resolve, reject) => {
    // Verificar se o script já foi carregado
    if (window.google && window.google.maps) {
      console.log("Google Maps API já está carregada");
      resolve();
      return;
    }

    // Obter API Key do ambiente
    const apiKey = process.env.VUE_APP_API_KEY;

    if (!apiKey) {
      console.error(
        "API Key do Google Maps não encontrada nas variáveis de ambiente"
      );
      reject(new Error("API Key não encontrada"));
      return;
    }

    // Definir callback global para quando a API estiver carregada
    window.initMap = () => {
      console.log("Google Maps API carregada com sucesso");
      resolve();
    };

    // Criar elemento de script
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initMap`;
    script.async = true;
    script.defer = true;

    script.onerror = () => {
      console.error("Falha ao carregar Google Maps API");
      reject(new Error("Falha ao carregar Google Maps API"));
    };

    // Adicionar script ao documento
    document.head.appendChild(script);
  });
}

// Setup do componente ao montar
onMounted(async () => {
  console.log("Componente montado, aba ativa:", activeTab.value);

  // Apenas inicializar o mapa se estiver na aba correta
  if (activeTab.value === "mapa") {
    try {
      console.log("Iniciando carregamento do mapa");
      await carregarGoogleMapsAPI();
      console.log("API carregada, inicializando mapa");

      // Usar setTimeout para garantir que o DOM esteja pronto
      setTimeout(() => {
        inicializarMapa();
        carregarDados();
      }, 200);
    } catch (error) {
      console.error("Erro ao configurar o mapa:", error);
    }
  }
});

// Observar alterações na aba ativa
watch(activeTab, async (novoValor) => {
  console.log("Aba alterada para:", novoValor);

  if (novoValor === "mapa") {
    try {
      console.log("Carregando mapa após troca de aba");

      // Verificar se a API já está carregada
      if (!window.google || !window.google.maps) {
        await carregarGoogleMapsAPI();
      }

      // Verificar se o mapa já está inicializado
      if (!map.value) {
        inicializarMapa();
      }

      // Carregar dados e aplicar os filtros
      setTimeout(() => {
        carregarDados();
      }, 200);
    } catch (error) {
      console.error("Erro ao configurar o mapa após troca de aba:", error);
    }
  }
});

// Observar alterações nos filtros
watch(
  filtros,
  (novoValor) => {
    console.log("Filtros alterados:", novoValor);
    // Apenas recarregar marcadores se o componente estiver na aba mapa
    if (activeTab.value === "mapa") {
      limparMarcadores();
      adicionarMarcadores();
    }
  },
  { deep: true }
);
</script>

<style scoped>
.dashboard-container {
  background: #fff;
}

.dashboard-layout {
  display: flex;
  gap: 20px;
  height: 100%;
}

.sidebar-column {
  width: 20%;
}

.main-content {
  flex: 1;
  margin-right: 10px;
  overflow-y: auto;
}

.content-wrapper {
  margin-top: 40px;
  min-height: 100%;
}

.navigation-tabs {
  margin-top: -15px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: "Public Sans", -apple-system, Roboto, Helvetica, sans-serif;
  padding: 8px 0;
  margin-bottom: 24px;
  border-bottom: 1px solid #f0f0f0;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.tab-link {
  text-decoration: none;
  color: #6c757d;
  font-size: 14px;
  line-height: 1.5;
  padding: 10px 16px;
  border-radius: 6px;
  transition: all 0.3s ease;
  position: relative;
  font-weight: 500;
  letter-spacing: 0.2px;
  white-space: nowrap;
}

.tab-link:hover {
  background-color: #f8f9fa;
  color: #495057;
}

.tab-link.active {
  color: #1890ff;
  background-color: rgba(24, 144, 255, 0.08);
  font-weight: 600;
}

.tab-link.active::after {
  content: "";
  position: absolute;
  bottom: -9px;
  left: 16px;
  right: 16px;
  height: 2px;
  background-color: #1890ff;
  border-radius: 2px 2px 0 0;
}

.tab-link::after {
  content: "";
  position: absolute;
  bottom: -9px;
  left: 50%;
  right: 50%;
  height: 2px;
  background-color: #1890ff;
  transition: all 0.3s ease;
  border-radius: 2px 2px 0 0;
}

/* Estilos específicos do mapa */
.map-container {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 200px);
  min-height: 500px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  border: 1px solid #eaeaea;
}

.google-map {
  flex: 1;
  width: 100%;
  border-radius: 0 0 8px 8px;
}

.map-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #eaeaea;
}

.map-legend {
  display: flex;
  align-items: center;
  gap: 16px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #495057;
}

.legend-marker {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: inline-block;
}

.pendente-marker {
  background-color: #ff4d4f; /* Vermelho */
}

.analise-marker {
  background-color: #faad14; /* Amarelo */
}

.resolvido-marker {
  background-color: #52c41a; /* Verde */
}

.map-filters {
  display: flex;
  gap: 16px;
}

.filter-checkbox {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #495057;
  cursor: pointer;
}

/* Estilo para a janela de informação */
:global(.info-window) {
  padding: 10px;
  max-width: 300px;
  font-family: "Public Sans", -apple-system, Roboto, Helvetica, sans-serif;
}

:global(.info-window h3) {
  margin: 0 0 10px 0;
  font-size: 16px;
  color: #1890ff;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

:global(.info-window p) {
  margin: 6px 0;
  font-size: 13px;
  color: #4a4a4a;
}

:global(.status-badge) {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: normal;
  color: white;
}

:global(.status-badge.pendente) {
  background-color: #ff4d4f;
}

:global(.status-badge.analise) {
  background-color: #faad14;
}

:global(.status-badge.resolvido) {
  background-color: #52c41a;
}

/* Estilos responsivos */
@media (max-width: 768px) {
  .map-controls {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .map-container {
    height: calc(100vh - 160px);
  }

  .map-legend {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .map-filters {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}
</style>
