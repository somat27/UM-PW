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

          <StatisticsGridMateriais :cards="materialCards" />

          <div class="radial-chart">
            <apexchart type="radialBar" :options="chartOptions" :series="chartSeries" height="350" />
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted, computed } from 'vue';
import NavigationList from '@/components/NavigationList.vue';
import StatisticsGridMateriais from '@/components/StatisticsGridMateriais.vue';
import { collection, onSnapshot } from 'firebase/firestore'
import { db } from '@/firebase.js'

const activeTab = ref('materiais');

const totalUtilizado = ref({})
const totalDisponivel = ref({})

const unsubAud = onSnapshot(
  collection(db, 'auditorias'),
  snap => {
    let soma = 0
    snap.forEach(doc =>
      doc.data().materiais.forEach(item =>
        soma += item.quantidade
      )
    )
    totalUtilizado.value = soma
  }
)

const unsubMat = onSnapshot(
  collection(db, 'materiais'),
  snap => {
    let soma = 0
    snap.forEach(doc =>
      soma += doc.data().quantidade
    )
    totalDisponivel.value = soma
  }
)

onUnmounted(() => { unsubAud(); unsubMat() })

const materialCards = computed(() => [
  { title: 'Materiais usados', value: totalUtilizado.value },
  { title: 'Materiais por usar', value: totalDisponivel.value }
])

const totalGeral = computed(() =>
  totalUtilizado.value + totalDisponivel.value
)

const pctUsados = computed(() =>
  totalGeral.value
    ? Math.round(totalUtilizado.value / totalGeral.value * 100)
    : 0
)

const pctPorUsar = computed(() =>
  totalGeral.value
    ? 100 - pctUsados.value
    : 0
)

const chartOptions = computed(() => ({
  chart: { id: 'materiais-grafico' },
  labels: ['Por usar', 'Usados'],
  title: { text: 'Materiais Usados & Por Usar' },
  plotOptions: {
    radialBar: {
      dataLabels: {
        name: { fontSize: '16px' },
        value: {
          fontSize: '14px',
          formatter: val => `${val}%`
        }
      }
    }
  }
}))

const chartSeries = computed(() => [
  pctPorUsar.value,
  pctUsados.value,
])
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

.stats-only-grid {
  margin-top: 16px;
}

.radial-chart {
  margin-top: 32px;
  display: flex;
  justify-content: center;
}
</style>
