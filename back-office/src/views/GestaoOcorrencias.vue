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

          <!-- Cabeçalho -->
          <div class="page-header">
            <h2>Gestão de Ocorrências</h2>
          </div>

          <!-- Controles de pesquisa e ordenação -->
          <div class="controls">
            <input v-model="searchQuery" type="text" placeholder="Procurar Ocorrências..." class="search-input" />
            <select v-model="sortKey" class="sort-select">
              <option value="">Ordenar por</option>
              <option v-for="col in sortColumns" :key="col.key" :value="col.key">{{ col.label }}</option>
            </select>
            <button @click="toggleSortOrder" class="sort-button">{{ sortOrder === 'asc' ? '↑' : '↓' }}</button>
          </div>

          <!-- Tabela de Ocorrências Pendentes -->
          <div class="table-section">
            <h3>Pendentes</h3>
            <GenericTable :columns="columnsPending" :data="pendingOccurrences" :loading="loading" @view="openDetail" />
          </div>

          <!-- Tabela de Outras Ocorrências -->
          <div class="table-section">
            <h3>Outras Ocorrências</h3>
            <GenericTable :columns="columnsOther" :data="otherOccurrences" :loading="loading" @view="openDetail" />
          </div>

          <!-- Modal de Detalhes -->
          <div v-if="showDetailModal" class="modal-overlay large">
            <div class="modal-content">
              <h3>Detalhes da Ocorrência</h3>
              <ul class="detail-list">
                <li><strong>Tipo:</strong> {{ selected.tipoOcorrencia }}</li>
                <li><strong>Estado:</strong> {{ selected.status }}</li>
                <li><strong>Submetido em:</strong> {{ selected.dataSubmissao }}</li>
                <li><strong>Endereço:</strong> {{ selected.endereco }}</li>
                <li><strong>Descrição:</strong> {{ selected.descricao }}</li>
                <li v-if="selected.motivoRejeicao"><strong>Motivo da Rejeição:</strong> {{ selected.motivoRejeicao }}
                </li>
              </ul>

              <!-- Carrossel de mídia -->
              <div v-if="selected.imagemVideo?.length" class="media-carousel">
                <button @click="prevMedia">‹</button>
                <div class="media-item">
                  <img v-if="selected.imagemVideo[mediaIndex].includes('/image/')"
                    :src="selected.imagemVideo[mediaIndex]" />
                  <video v-else controls :src="selected.imagemVideo[mediaIndex]"></video>
                </div>
                <button @click="nextMedia">›</button>
              </div>

              <!-- Mapa -->
              <iframe v-if="selected.coordenadas"
                :src="`https://www.google.com/maps?q=${selected.coordenadas.latitude},${selected.coordenadas.longitude}&output=embed`"
                width="100%" height="300" frameborder="0" style="border:0; margin-top:10px;"></iframe>

              <div class="modal-actions">
                <router-link v-if="selected.status.toLowerCase() === 'pendente'" :to="{ name: 'AprovacaoOcorrencia', params: { id: selected.id } }"
                  class="btn-approve">
                  Aprovar
                </router-link>
                <button v-if="selected.status.toLowerCase() === 'pendente'" class="btn-reject"
                  @click="handleReject(selected)">Rejeitar</button>
                <button class="btn-cancel" @click="closeModals">Fechar</button>
              </div>
            </div>
          </div>

          <!-- Modal de Motivo de Rejeição -->
          <div v-if="showRejectModal" class="modal-overlay">
            <div class="modal-content">
              <h3>Motivo da Rejeição</h3>
              <textarea v-model="rejectReason" rows="4" placeholder="Insere a razão..."></textarea>
              <div class="modal-actions">
                <button class="btn-submit" @click="submitReject">Enviar</button>
                <button class="btn-cancel" @click="closeModals">Cancelar</button>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import NavigationList from '@/components/NavigationList.vue';
import GenericTable from '@/components/GenericTable.vue';
import { db } from '@/firebase.js';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';

// Estado e rótulos
const occurrences = ref([]);
const loading = ref(false);
const selected = ref(null);
const showDetailModal = ref(false);
const showRejectModal = ref(false);
const rejectReason = ref('');
const mediaIndex = ref(0);
const searchQuery = ref('');
const sortKey = ref('');
const sortOrder = ref('asc');

const tipoLabels = { sinals: 'Sinalização em Falta', roads: 'Vias e Passeios', lights: 'Iluminação Pública' };
const sortColumns = [
  { key: 'id', label: 'ID' },
  { key: 'tipoOcorrencia', label: 'Tipo' },
  { key: 'status', label: 'Estado' }
];

// Colunas para cada tabela (usam 'view' para abrir modal)
const columnsPending = [
  { key: 'id', label: 'ID' },
  { key: 'tipoOcorrencia', label: 'Tipo' },
  { key: 'status', label: 'Estado' },
  { key: 'actions', label: 'Ver Detalhes' }
];
const columnsOther = [
  { key: 'id', label: 'ID' },
  { key: 'tipoOcorrencia', label: 'Tipo' },
  { key: 'status', label: 'Estado' },
  { key: 'actions', label: 'Ver Detalhes' }
];

// Filtrar e ordenar em comum
const filtered = computed(() => {
  let arr = occurrences.value;
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    arr = arr.filter(i =>
      i.id.includes(q) || i.tipoOcorrencia.toLowerCase().includes(q) || i.status.toLowerCase().includes(q)
    );
  }
  if (sortKey.value) {
    arr = [...arr].sort((a, b) => {
      const aVal = a[sortKey.value], bVal = b[sortKey.value];
      if (typeof aVal === 'string') return sortOrder.value === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      return sortOrder.value === 'asc' ? aVal - bVal : bVal - aVal;
    });
  }
  return arr;
});
const pendingOccurrences = computed(() => filtered.value.filter(i => i.status.toLowerCase() === 'pendente'));
const otherOccurrences = computed(() => filtered.value.filter(i => i.status.toLowerCase() !== 'pendente'));

// Carregar dados
async function loadOccurrences() {
  loading.value = true;
  try {
    const snap = await getDocs(collection(db, 'ocorrencias'));
    occurrences.value = snap.docs.map(d => {
      const data = d.data();
      const raw = data.dataSubmissao;
      const formatted = raw?.toDate ? raw.toDate().toLocaleString('pt-PT') : (raw || '');
      return { id: d.id, ...data, dataSubmissao: formatted, tipoOcorrencia: tipoLabels[data.tipoOcorrencia] || data.tipoOcorrencia };
    });
  } catch (e) { console.error('Erro ao carregar ocorrências:', e); } finally { loading.value = false; }
}

// Ações e modal
function openDetail(item) {
  selected.value = item;
  mediaIndex.value = 0;
  showDetailModal.value = true;
}
function handleReject(item) {
  selected.value = item;
  showRejectModal.value = true;
}
function closeModals() {
  showDetailModal.value = false;
  showRejectModal.value = false;
  rejectReason.value = '';
}
async function submitReject() {
  if (selected.value) {
    await updateDoc(doc(db, 'ocorrencias', selected.value.id),
      { status: 'Rejeitado', motivoRejeicao: rejectReason.value });
    closeModals();
    loadOccurrences();
  }
}
function toggleSortOrder() {
  sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
}
function nextMedia() {
  if (!selected.value?.imagemVideo)
    return;
  mediaIndex.value = (mediaIndex.value + 1) % selected.value.imagemVideo.length;
}
function prevMedia() {
  if (!selected.value?.imagemVideo)
    return;
  mediaIndex.value = (mediaIndex.value - 1 + selected.value.imagemVideo.length) % selected.value.imagemVideo.length;
}

onMounted(loadOccurrences);
</script>

<style scoped>
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

.table-section {
  margin-bottom: 30px;
}

.modal-overlay.large .modal-content {
  width: 800px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 600px;
  max-width: 95%;
  max-height: 95%;
  overflow-y: auto;
}

.detail-list {
  list-style: none;
  padding: 0;
}

.detail-list li {
  margin-bottom: 8px;
}

.media-carousel {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin: 15px 0;
}

.media-carousel button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
}

.media-item img,
.media-item video {
  max-width: 600px;
  max-height: 300px;
  border-radius: 4px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 10px;
}

textarea {
  width: 100%;
  padding: 8px;
  resize: vertical;
}

.btn-approve {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 8px 16px;
  cursor: pointer;
  border-radius: 4px;
}

.btn-reject {
  background-color: #f44336;
  color: white;
  border: none;
  padding: 8px 16px;
  cursor: pointer;
  border-radius: 4px;
}

.btn-cancel {
  background-color: #ccc;
  color: #333;
  border: none;
  padding: 8px 16px;
  cursor: pointer;
  border-radius: 4px;
}

.btn-submit {
  background-color: #2196f3;
  color: white;
  border: none;
  padding: 8px 16px;
  cursor: pointer;
  border-radius: 4px;
}
</style>
