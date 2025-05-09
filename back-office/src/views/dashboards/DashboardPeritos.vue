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
            <router-link to="/dashboards/auditorias" class="tab-link" :class="{ active: activeTab === 'auditorias' }"
              @click="activeTab = 'auditorias'">
              Auditorias por região
            </router-link>
            <router-link to="/dashboards/ocorrencias" class="tab-link" :class="{ active: activeTab === 'ocorrencias' }"
              @click="activeTab = 'ocorrencias'">
              Ocorrências por região
            </router-link>
            <router-link to="/dashboards/peritos" class="tab-link" :class="{ active: activeTab === 'peritos' }"
              @click="activeTab = 'peritos'">
              Peritos Ativos e em Espera
            </router-link>
            <router-link to="/dashboards/materiais" class="tab-link" :class="{ active: activeTab === 'materiais' }"
              @click="activeTab = 'materiais'">
              Materiais Usados & Por Usar
            </router-link>
            <router-link to="/dashboards/mapa" class="tab-link" :class="{ active: activeTab === 'mapa' }"
              @click="activeTab = 'mapa'">
              Auditorias e Ocorrências no Terreno
            </router-link>
          </nav>

          <StatisticsGridPeritos>
            <StatisticsCard title="Peritos Totais" :value="totalPeritos" icon="users" />
            <StatisticsCard title="Cidades sobre vigia" :value="cidadesVigia" icon="map-marker-alt" />
            <StatisticsCard title="Peritos ativos" :value="countAtivos" icon="check-circle" />
            <StatisticsCard title="Peritos em espera" :value="countAguardando" icon="clock" />
          </StatisticsGridPeritos>

          <div id="chart">
            <apexchart type="bar" :options="chartOptions" :series="chartSeries" height="350" />
          </div>

        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import NavigationList from '@/components/NavigationList.vue';
import StatisticsGridPeritos from '@/components/StatisticsGridPeritos.vue';
import StatisticsCard from '@/components/StatisticsCard.vue';
import { collection, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase';

const activeTab = ref('peritos');

// Refs para dados
const peritos = ref([]);
const auditorias = ref([]);

// Contadores por localidade (ativos assíncrono)
const regioes = ['Norte', 'Centro', 'Lisboa e Vale do Tejo', 'Alentejo', 'Algarve'];
const ativosPorLocalidade = ref({
  Norte: 0,
  Centro: 0,
  'Lisboa e Vale do Tejo': 0,
  Alentejo: 0,
  Algarve: 0
});

// Mapeamento de distritos para regiões
const distritoRegiaoMap = {
  Porto: 'Norte', 'Viana do Castelo': 'Norte', Braga: 'Norte', 'Vila Real': 'Norte', Bragança: 'Norte',
  Aveiro: 'Centro', Coimbra: 'Centro', Leiria: 'Centro', 'Castelo Branco': 'Centro', Guarda: 'Centro', Viseu: 'Centro',
  Santarém: 'Lisboa e Vale do Tejo', Lisboa: 'Lisboa e Vale do Tejo', Setúbal: 'Lisboa e Vale do Tejo',
  Évora: 'Alentejo', Beja: 'Alentejo', Portalegre: 'Alentejo', Faro: 'Algarve'
};

// Cache para geocodificação de regiões
const cacheRegiao = {};
async function buscarRegiao(lat, lon) {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1&accept-language=pt`;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'MeuAppUniversidade/1.0 (email@exemplo.com)' }
  });
  if (!res.ok) throw new Error(`Erro HTTP ${res.status}`);
  const data = await res.json();
  const addr = data.address || {};
  const district = addr.state || addr.county || addr.region || '';
  return distritoRegiaoMap[district] || 'Desconhecida';
}

async function buscarRegiaoComCache(lat, lon) {
  const key = `${lat},${lon}`;
  if (cacheRegiao[key]) return cacheRegiao[key];
  try {
    const regiao = await buscarRegiao(lat, lon);
    cacheRegiao[key] = regiao;
    return regiao;
  } catch (err) {
    console.error('Erro geocodificação região', err);
    return 'Desconhecida';
  }
}

const mobilizadosUids = computed(() => {
  const set = new Set();
  auditorias.value.forEach(a => {
    if (a.perito) set.add(a.perito);
  });
  return set;
});

const peritosMobilizados = computed(() =>
  peritos.value.filter(p => mobilizadosUids.value.has(p.uid))
);
const peritosAguardando = computed(() =>
  peritos.value.filter(p => !mobilizadosUids.value.has(p.uid))
);

// Contagem de peritos em espera por localidade (síncrono)
const esperaPorLocalidade = computed(() => {
  const counts = { Norte: 0, Centro: 0, 'Lisboa e Vale do Tejo': 0, Alentejo: 0, Algarve: 0 };
  peritosAguardando.value.forEach(p => {
    if (Array.isArray(p.localidades)) {
      p.localidades.forEach(loc => {
        if (counts[loc] !== undefined) counts[loc]++;
      });
    }
  });
  return counts;
});

// Subscrever coleções e atualizar ativosPorLocalidade
let unsubPeritos, unsubAud;
onMounted(() => {
  unsubPeritos = onSnapshot(
    collection(db, 'peritos'),
    async snap => {
      const peritosData = await Promise.all(
        snap.docs.map(async d => {
          const data = d.data();
          if (data.status !== 'Ativo') return null;
          const userSnap = await getDoc(doc(db, 'users', data.uid));
          if (!userSnap.exists() || userSnap.data().role !== 'perito') return null;
          return data;
        })
      );
      peritos.value = peritosData.filter(p => p !== null);
    },
    err => console.error('Erro peritos:', err)
  );


  unsubAud = onSnapshot(
    collection(db, 'auditorias'),
    async snap => {
      auditorias.value = snap.docs.map(d => d.data());
      // Recalcular ativos por localidade
      const counts = { Norte: 0, Centro: 0, 'Lisboa e Vale do Tejo': 0, Alentejo: 0, Algarve: 0 };
      for (const a of auditorias.value) {
        if (
          a.perito &&
          a.coordenadas &&
          peritos.value.some(p => p.uid === a.perito)
        ) {
          const { latitude, longitude } = a.coordenadas;
          const reg = await buscarRegiaoComCache(latitude, longitude);
          if (counts[reg] !== undefined) counts[reg]++;
        }
      }
      ativosPorLocalidade.value = counts;
    },
    err => console.error('Erro auditorias:', err)
  );
});

onUnmounted(() => {
  if (unsubPeritos) unsubPeritos();
  if (unsubAud) unsubAud();
});

// Métricas para cartões
const totalPeritos = computed(() => peritos.value.length);
const cidadesVigia = computed(() => new Set(auditorias.value.map(a => {
  if (a.coordenadas) return `${a.coordenadas.latitude},${a.coordenadas.longitude}`;
  return '';
})).size
);
const countAtivos = computed(() => peritosMobilizados.value.length);
const countAguardando = computed(() => peritosAguardando.value.length);

// Configuração do gráfico com duas séries
const chartOptions = computed(() => ({
  chart: { id: 'peritos-chart' },
  xaxis: { categories: regioes },
  dataLabels: { enabled: false },
  legend: { position: 'top' },
  tooltip: { y: { title: { formatter: seriesName => seriesName } } }
}));
const chartSeries = computed(() => [
  {
    name: 'Ativos',
    data: regioes.map(loc => ativosPorLocalidade.value[loc])
  },
  {
    name: 'Em Espera',
    data: regioes.map(loc => esperaPorLocalidade.value[loc])
  }
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
  font-family: 'Public Sans', -apple-system, Roboto, Helvetica, sans-serif;
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
  content: '';
  position: absolute;
  bottom: -9px;
  left: 16px;
  right: 16px;
  height: 2px;
  background-color: #1890ff;
  border-radius: 2px 2px 0 0;
}

.tab-link::after {
  content: '';
  position: absolute;
  bottom: -9px;
  left: 50%;
  right: 50%;
  height: 2px;
  background-color: #1890ff;
  transition: all 0.3s ease;
  border-radius: 2px 2px 0 0;
}

/* Main chart styling */
#chart {
  margin-top: 24px;
}
</style>
