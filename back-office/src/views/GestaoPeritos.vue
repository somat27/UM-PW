<template>
  <div class="dashboard-container" :space="23">
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
          <div class="page-header">
            <h2>Gestão de Peritos</h2>
          </div>

          <div class="controls">
            <input v-model="searchQuery" type="text" placeholder="Procurar Peritos..." class="search-input" />
            <select v-model="sortKey" class="sort-select">
              <option value="">Ordenar por</option>
              <option v-for="col in sortColumns" :key="col.key" :value="col.key">
                {{ col.label }}
              </option>
            </select>
            <button @click="toggleSortOrder" class="sort-button">
              {{ sortOrder === 'asc' ? '↑' : '↓' }}
            </button>
          </div>

          <template v-if="faltaPerfil.length > 0">
            <div class="table-section">
              <h3 class="table-section-title">Peritos não Registados</h3>
              <GenericTable :data="filteredFaltaPerfil" :loading="aCarregar" :columns="missingColumns" type="striped"
                @add="openAddPeritoModal" />
            </div>
          </template>

          <div class="table-section">
            <h3 class="table-section-title">Peritos Registados</h3>
            <GenericTable :data="filteredComPerfil" :loading="aCarregar" :columns="completeColumns" type="striped" 
              @edit="handleEdit"/>
          </div>

          <AddPeritoModal v-if="showAddModal" :user="selectedUser" @close="showAddModal = false"
            @saved="handlePeritoSaved" />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import NavigationList from '@/components/NavigationList.vue'
import { ref, onMounted, computed } from 'vue';
import GenericTable from '@/components/GenericTable.vue';
import AddPeritoModal from '@/components/AddPeritoModal.vue';
import { getPeritosWithoutProfile, getPeritosWithProfile } from '@/firebase';

const faltaPerfil = ref([]);
const comPerfil = ref([]);
const aCarregar = ref(true);

const searchQuery = ref('');
const sortKey = ref('');
const sortOrder = ref('asc');

const showAddModal = ref(false);
const selectedUser = ref(null);

const missingColumns = [
  { key: 'displayName', label: 'Nome' },
  { key: 'email', label: 'Email' },
  { key: 'add', label: 'Ações' }
];

const completeColumns = [
  { key: 'displayName', label: 'Nome' },
  { key: 'specialty', label: 'Especialidade' },
  { key: 'localidades', label: 'Localidades' },
  { key: 'status', label: 'Status' },
  { key: 'edit', label: 'Editar' }
];

// pega todos os elementos até ao penúltimo
const sortColumns = completeColumns.slice(0, -1);

async function loadData() {
  aCarregar.value = true;
  try {
    faltaPerfil.value = await getPeritosWithoutProfile();
    comPerfil.value = await getPeritosWithProfile();
  } catch (error) {
    console.error('Erro ao carregar peritos:', error);
  } finally {
    aCarregar.value = false;
  }
}

onMounted(loadData);

function openAddPeritoModal(user) {
  selectedUser.value = user;
  showAddModal.value = true;
}

function handlePeritoSaved() {
  showAddModal.value = false;
  loadData();
}

function handleEdit(user) {
  selectedUser.value = user;
  console.log(selectedUser.value);
  showAddModal.value = true;
}

function toggleSortOrder() {
  sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
}

function sortData(arr) {
  if (!sortKey.value) return arr;
  return [...arr].sort((a, b) => {
    const aVal = a[sortKey.value];
    const bVal = b[sortKey.value];
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortOrder.value === 'asc' ? aVal - bVal : bVal - aVal;
    }
    const aStr = Array.isArray(aVal) ? aVal.join(', ') : String(aVal);
    const bStr = Array.isArray(bVal) ? bVal.join(', ') : String(bVal);
    return sortOrder.value === 'asc'
      ? aStr.localeCompare(bStr)
      : bStr.localeCompare(aStr);
  });
}

const filteredFaltaPerfil = computed(() => {
  let data = faltaPerfil.value.filter(u =>
    u.displayName.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
  return sortData(data);
});

const filteredComPerfil = computed(() => {
  let data = comPerfil.value.filter(u =>
    u.displayName.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
  return sortData(data);
});
</script>

<style scoped>
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

.page-header {
  margin-bottom: 16px;
}

.page-header h2 {
  font-size: 1.75rem;
  margin-bottom: 1rem;
}

.controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.search-input {
  flex: 1;
  padding: 0.5rem 1rem;
  border: 1px solid #ccc;
  border-radius: 0.375rem;
  font-size: 1rem;
}

.sort-select {
  padding: 0.5rem 0.75rem;
  border: 1px solid #ccc;
  border-radius: 0.375rem;
  background: #fff;
  font-size: 0.875rem;
}

.sort-button {
  padding: 0.5rem 0.75rem;
  font-size: 1rem;
  border: none;
  background: none;
  cursor: pointer;
}

.add-button {
  padding: 0.5rem 1rem;
  background-color: #1890ff;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-size: 1rem;
  cursor: pointer;
}

.add-button:hover {
  background-color: #167ac6;
}
</style>
