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

          <StatisticsGridPeritos>
            <StatisticsCard
              title="Peritos Totais"
              :value="totalPeritos"
              icon="users"
            />
            <StatisticsCard
              title="Peritos ativos"
              :value="countAtivos"
              icon="check-circle"
            />
            <StatisticsCard
              title="Peritos em espera"
              :value="countAguardando"
              icon="clock"
            />
          </StatisticsGridPeritos>

          <div id="chart">
            <apexchart
              type="bar"
              :options="chartOptions"
              :series="chartSeries"
              height="350"
            />
            <div class="dashboard-info" v-if="ultimaAtualizacao">
              <span class="info-text"
                >Dados atualizados em:
                {{ ultimaAtualizacao.toLocaleString() }}</span
              >
              <button class="refresh-button" @click="forcarAtualizacao">
                Atualizar dados
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import NavigationList from "@/components/NavigationList.vue";
import StatisticsGridPeritos from "@/components/StatisticsGridPeritos.vue";
import StatisticsCard from "@/components/StatisticsCard.vue";
import { collection, onSnapshot, getDocs } from "firebase/firestore";
import { db } from "@/firebase";

const activeTab = ref("peritos");

// Refs para dados
const peritos = ref([]);
const auditorias = ref([]);
const dataCarregado = ref(false);
const ultimaAtualizacao = ref(null);

// Configuração do localStorage
const STORAGE_KEY = "dashboard-peritos-data";
const TIMESTAMP_KEY = "dashboard-peritos-timestamp";
const UPDATE_INTERVAL = 5 * 60 * 1000; // 5 minutos em milissegundos

// Contadores por localidade (ativos assíncrono)
const regioes = [
  "Norte",
  "Centro",
  "Lisboa e Vale do Tejo",
  "Alentejo",
  "Algarve",
];
const ativosPorLocalidade = ref({
  Norte: 0,
  Centro: 0,
  "Lisboa e Vale do Tejo": 0,
  Alentejo: 0,
  Algarve: 0,
});

// Mapeamento de distritos para regiões
const distritoRegiaoMap = {
  Porto: "Norte",
  "Viana do Castelo": "Norte",
  Braga: "Norte",
  "Vila Real": "Norte",
  Bragança: "Norte",
  Aveiro: "Centro",
  Coimbra: "Centro",
  Leiria: "Centro",
  "Castelo Branco": "Centro",
  Guarda: "Centro",
  Viseu: "Centro",
  Santarém: "Lisboa e Vale do Tejo",
  Lisboa: "Lisboa e Vale do Tejo",
  Setúbal: "Lisboa e Vale do Tejo",
  Évora: "Alentejo",
  Beja: "Alentejo",
  Portalegre: "Alentejo",
  Faro: "Algarve",
};

// Cache para geocodificação de regiões
const cacheRegiao = {};
async function buscarRegiao(lat, lon) {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1&accept-language=pt`;
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "MeuAppUniversidade/1.0 (email@exemplo.com)" },
    });
    if (!res.ok) throw new Error(`Erro HTTP ${res.status}`);
    const data = await res.json();
    const addr = data.address || {};
    const district = addr.state || addr.county || addr.region || "";
    return distritoRegiaoMap[district] || "Desconhecida";
  } catch (err) {
    console.error("Erro ao buscar região:", err);
    return "Desconhecida";
  }
}

async function buscarRegiaoComCache(lat, lon) {
  const key = `${lat},${lon}`;
  if (cacheRegiao[key]) return cacheRegiao[key];
  try {
    const regiao = await buscarRegiao(lat, lon);
    cacheRegiao[key] = regiao;
    return regiao;
  } catch (err) {
    console.error("Erro geocodificação região", err);
    return "Desconhecida";
  }
}

// Obter peritos mobilizados (ativos em auditorias)
const mobilizadosUids = computed(() => {
  const set = new Set();
  auditorias.value.forEach((a) => {
    if (a.perito) set.add(a.perito);
  });
  return set;
});

// Separar peritos ativos e em espera
const peritosMobilizados = computed(() =>
  peritos.value.filter((p) => mobilizadosUids.value.has(p.uid))
);
const peritosAguardando = computed(() =>
  peritos.value.filter((p) => !mobilizadosUids.value.has(p.uid))
);

// Contagem de peritos em espera por localidade
const esperaPorLocalidade = computed(() => {
  const counts = {
    Norte: 0,
    Centro: 0,
    "Lisboa e Vale do Tejo": 0,
    Alentejo: 0,
    Algarve: 0,
  };

  peritosAguardando.value.forEach((p) => {
    if (Array.isArray(p.localidades)) {
      p.localidades.forEach((loc) => {
        if (counts[loc] !== undefined) counts[loc]++;
      });
    }
  });
  return counts;
});

// Subscrever coleções e atualizar ativosPorLocalidade
let unsubPeritos, unsubAud;

// Funções auxiliares para localStorage
function salvarDadosLocal() {
  try {
    // Estrutura de dados para salvar
    const dadosParaSalvar = {
      peritos: peritos.value,
      auditorias: auditorias.value,
      ativosPorLocalidade: ativosPorLocalidade.value,
      timestamp: Date.now(),
    };

    // Salvar no localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dadosParaSalvar));
    localStorage.setItem(TIMESTAMP_KEY, Date.now().toString());

    console.log("Dados salvos no localStorage com sucesso");
    ultimaAtualizacao.value = new Date();
  } catch (error) {
    console.error("Erro ao salvar dados no localStorage:", error);
  }
}

function carregarDadosLocal() {
  try {
    // Verificar se temos dados no localStorage
    const dadosSalvos = localStorage.getItem(STORAGE_KEY);
    const timestampSalvo = localStorage.getItem(TIMESTAMP_KEY);

    if (!dadosSalvos || !timestampSalvo) {
      console.log("Nenhum dado encontrado no localStorage");
      return false;
    }

    // Verificar se os dados estão vencidos
    const agora = Date.now();
    const dataUltimaAtualizacao = parseInt(timestampSalvo);

    if (agora - dataUltimaAtualizacao > UPDATE_INTERVAL) {
      console.log("Dados do localStorage estão vencidos, buscando novos dados");
      return false;
    }

    // Carregar dados do localStorage
    const dados = JSON.parse(dadosSalvos);
    peritos.value = dados.peritos;
    auditorias.value = dados.auditorias;
    ativosPorLocalidade.value = dados.ativosPorLocalidade;

    ultimaAtualizacao.value = new Date(dataUltimaAtualizacao);
    dataCarregado.value = true;

    console.log("Dados carregados do localStorage com sucesso");
    return true;
  } catch (error) {
    console.error("Erro ao carregar dados do localStorage:", error);
    return false;
  }
}

// Função para forçar a atualização dos dados
async function forcarAtualizacao() {
  console.log("Forçando atualização dos dados...");

  try {
    // Limpar os dados atuais
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(TIMESTAMP_KEY);

    // Buscar novos dados do Firestore
    const peritosSnap = await getDocs(collection(db, "peritos"));
    peritos.value = peritosSnap.docs.map((d) => ({
      ...d.data(),
      id: d.id,
    }));

    const auditoriasSnap = await getDocs(collection(db, "auditorias"));
    auditorias.value = auditoriasSnap.docs.map((d) => ({
      ...d.data(),
      id: d.id,
    }));

    // Recalcular ativos por localidade
    const counts = {
      Norte: 0,
      Centro: 0,
      "Lisboa e Vale do Tejo": 0,
      Alentejo: 0,
      Algarve: 0,
    };

    // Processar cada auditoria para distribuir peritos por região
    for (const auditoria of auditorias.value) {
      if (auditoria.perito && auditoria.coordenadas) {
        const { latitude, longitude } = auditoria.coordenadas;

        if (!latitude || !longitude) continue;

        try {
          const regiao = await buscarRegiaoComCache(latitude, longitude);
          if (counts[regiao] !== undefined) {
            counts[regiao]++;
          }
        } catch (error) {
          console.error("Erro ao processar localização:", error);
        }
      }
    }

    ativosPorLocalidade.value = counts;

    // Salvar os novos dados no localStorage
    salvarDadosLocal();

    console.log("Dados atualizados com sucesso!");
  } catch (error) {
    console.error("Erro ao forçar atualização dos dados:", error);
  }
}

// Configurar observadores para mudanças em dados importantes
watch(
  [peritos, auditorias, ativosPorLocalidade],
  () => {
    if (dataCarregado.value) {
      salvarDadosLocal();
    }
  },
  { deep: true }
);

onMounted(async () => {
  // Tentar carregar dados do localStorage primeiro
  const dadosCarregados = carregarDadosLocal();

  if (!dadosCarregados) {
    // Se não houver dados no localStorage ou estiverem vencidos, buscar do Firestore
    // Carregar peritos
    unsubPeritos = onSnapshot(
      collection(db, "peritos"),
      (snap) => {
        // Simplificando a obtenção de peritos - sem filtros iniciais complexos
        const peritosData = snap.docs.map((d) => ({
          ...d.data(),
          id: d.id,
        }));
        peritos.value = peritosData;

        console.log(`Carregados ${peritos.value.length} peritos`);
        dataCarregado.value = true;
      },
      (err) => console.error("Erro ao carregar peritos:", err)
    );

    // Carregar auditorias e calcular localização dos peritos ativos
    unsubAud = onSnapshot(
      collection(db, "auditorias"),
      async (snap) => {
        auditorias.value = snap.docs.map((d) => ({
          ...d.data(),
          id: d.id,
        }));

        console.log(`Carregadas ${auditorias.value.length} auditorias`);

        // Recalcular ativos por localidade
        const counts = {
          Norte: 0,
          Centro: 0,
          "Lisboa e Vale do Tejo": 0,
          Alentejo: 0,
          Algarve: 0,
        };

        // Processar cada auditoria para distribuir peritos por região
        for (const auditoria of auditorias.value) {
          if (auditoria.perito && auditoria.coordenadas) {
            const { latitude, longitude } = auditoria.coordenadas;

            if (!latitude || !longitude) continue;

            try {
              const regiao = await buscarRegiaoComCache(latitude, longitude);
              if (counts[regiao] !== undefined) {
                counts[regiao]++;
              }
            } catch (error) {
              console.error("Erro ao processar localização:", error);
            }
          }
        }

        ativosPorLocalidade.value = counts;
        console.log("Peritos ativos por localidade:", counts);

        // Salvar os dados atualizados no localStorage
        salvarDadosLocal();
      },
      (err) => console.error("Erro ao carregar auditorias:", err)
    );
  }
});

onUnmounted(() => {
  // Desinscrever dos listeners do Firestore quando o componente for desmontado
  if (unsubPeritos) unsubPeritos();
  if (unsubAud) unsubAud();

  // Salvar os dados atuais no localStorage antes de sair
  if (dataCarregado.value) {
    salvarDadosLocal();
  }
});

// Métricas para cartões
const totalPeritos = computed(() => peritos.value.length);
const countAtivos = computed(() => peritosMobilizados.value.length);
const countAguardando = computed(() => peritosAguardando.value.length);

// Configuração do gráfico com duas séries
const chartOptions = computed(() => ({
  chart: {
    id: "peritos-chart",
    stacked: false,
    animations: {
      enabled: true,
    },
  },
  xaxis: {
    categories: regioes,
    title: {
      text: "Regiões",
    },
  },
  yaxis: {
    title: {
      text: "Número de Peritos",
    },
  },
  colors: ["#33b2df", "#546E7A"],
  dataLabels: {
    enabled: true,
    formatter: function (val) {
      return val || "0";
    },
    style: {
      fontSize: "12px",
    },
  },
  legend: {
    position: "top",
    horizontalAlign: "center",
  },
  tooltip: {
    y: {
      formatter: function (value) {
        return value || "0";
      },
    },
  },
  plotOptions: {
    bar: {
      borderRadius: 3,
      columnWidth: "50%",
    },
  },
  subtitle: {
    text: ultimaAtualizacao.value
      ? `Última atualização: ${ultimaAtualizacao.value.toLocaleString()}`
      : "Carregando dados...",
    align: "right",
    margin: 10,
    offsetY: 5,
    style: {
      fontSize: "12px",
      color: "#9e9e9e",
    },
  },
}));

const chartSeries = computed(() => [
  {
    name: "Peritos Ativos",
    data: regioes.map((loc) => ativosPorLocalidade.value[loc] || 0),
  },
  {
    name: "Peritos em Espera",
    data: regioes.map((loc) => esperaPorLocalidade.value[loc] || 0),
  },
]);
</script>

<style scoped>
.dashboard-container {
  background: #fff;
}

.dashboard-layout {
  display: flex;
  gap: 20px;
}

.sidebar-column {
  width: 20%;
}

.main-content {
  flex: 1;
  margin-right: 10px;
}

.content-wrapper {
  margin-top: 40px;
}

/* Navigation Tabs Styles */
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
  color: #204c6d;
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
  background-color: #204c6d;
  border-radius: 2px 2px 0 0;
}

.tab-link::after {
  content: "";
  position: absolute;
  bottom: -9px;
  left: 50%;
  right: 50%;
  height: 2px;
  background-color: #204c6d;
  transition: all 0.3s ease;
  border-radius: 2px 2px 0 0;
}

.refresh-button {
  background-color: #204c6d;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 14px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  letter-spacing: 0.3px;
}

.refresh-button:hover {
  background-color: #2d6b99;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
  transform: translateY(-1px);
}

.refresh-button:active {
  background-color: #183a54;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  transform: translateY(1px);
}

/* Main chart styling */
#chart {
  margin-top: 24px;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  background-color: #fff;
}
</style>
