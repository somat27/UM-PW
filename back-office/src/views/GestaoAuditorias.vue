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
          <div class="page-header">
            <h2>Gestão de Auditorias</h2>
          </div>

          <FiltroTabela v-model:modelSearch="searchQuery" v-model:modelSort="sortKey" v-model:modelOrder="sortOrder"
            :sortColumns="columns" :showAdd="false" :filterOptions="filterOptions" @filter-applied="handleFilterApplied"
            search-placeholder="Procurar Auditorias..." sort-placeholder="Ordenar por…" />


          <GenericTable :columns="[...columns, editColumn]" :data="filteredData" class="table-scroll">
            <template #cell-acoes="{ row }">
              <button @click="viewAuditoria(row)" class="icon-btn" title="Ver detalhes">
                <img src="@/assets/icons8-eye-forma-light/icons8-eye-24.png" alt="Ver detalhes" />
              </button>
            </template>
          </GenericTable>

          <!-- Modal de detalhes -->
          <transition name="modal">
            <div v-if="selectedAuditoria" class="modal-overlay" @click.self="closeModal">
              <div class="modal-container" role="dialog" aria-modal="true">
                <!-- Header -->
                <header class="modal-header">
                  <h3>Auditoria: {{ selectedAuditoria.id }}</h3>
                  <button class="modal-close" @click="closeModal" aria-label="Fechar">×</button>
                </header>

                <!-- Body (scroll se exceder altura) -->
                <div class="modal-body">
                  <!-- Mapa -->
                  <div v-if="selectedAuditoria.coordenadas" class="map-wrapper">
                    <iframe :src="`
                https://www.google.com/maps?q=
                ${selectedAuditoria.coordenadas.latitude},
                ${selectedAuditoria.coordenadas.longitude}
                &hl=pt&z=15&output=embed
              `" class="map-iframe" allowfullscreen loading="lazy"></iframe>
                  </div>

                  <!-- Dados principais em grid -->
                  <div class="info-grid">
                    <div v-if="selectedAuditoria.dataInicio" class="info-item">
                      <span>Data Início:</span>
                      {{ formatDate(selectedAuditoria.dataInicio) }}
                    </div>
                    <div v-if="selectedAuditoria.dataFim" class="info-item">
                      <span>Data Fim:</span>
                      {{ formatDate(selectedAuditoria.dataFim) }}
                    </div>
                    <div class="info-item">
                      <span>Tipo:</span> {{ selectedAuditoria.tipo }}
                    </div>
                    <div class="info-item">
                      <span>Estado:</span> {{ selectedAuditoria.status }}
                    </div>
                  </div>

                  <!-- Descrição -->
                  <div v-if="selectedAuditoria.descricao" class="section">
                    <p class="section-title">Descrição:</p>
                    <p class="description-text">{{ selectedAuditoria.descricao }}</p>
                  </div>

                  <!-- === TABELA DE MATERIAIS === -->
                  <div v-if="selectedAuditoria.materiais" class="section">
                    <div class="section-header">
                      <p class="section-title">Materiais</p>
                      <div>
                        <button class="add-button" @click="addMaterial">+ Novo</button>
                        <button class="save-button" @click="saveMaterials"
                          :disabled="materialsSaving || hasMaterialErrors">
                          {{ materialsSaving ? 'A guardar…' : 'Salvar' }}
                        </button>
                      </div>
                    </div>

                    <table class="materials-table">
                      <thead>
                        <tr>
                          <th>Nome</th>
                          <th class="text-center">Qtd</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="m in selectedAuditoria.materiais" :key="m.id">
                          <td>{{ m.nome }}</td>
                          <td class="text-center">
                            <input type="number" min="0" v-model.number="m.quantidade" @change="onMaterialQtyChange(m)"
                              class="qty-input" />
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    <!-- Erros de stock por material -->
                    <p v-for="(err, mid) in materialErrors" :key="mid" class="error-text">{{ err }}</p>
                  </div>

                  <!-- === TABELA DE PROFISSIONAIS === -->
                  <div v-if="selectedAuditoria.profissionais" class="section">
                    <div class="section-header">
                      <p class="section-title">Profissionais</p>
                      <div>
                        <button class="add-button" @click="addProfissional">+ Novo</button>
                        <button class="save-button" @click="saveProfissionais" :disabled="profsSaving">
                          {{ profsSaving ? 'A guardar…' : 'Salvar' }}
                        </button>
                      </div>
                    </div>

                    <table class="professionals-table">
                      <thead>
                        <tr>
                          <th>Nome</th>
                          <th class="text-center">Qtd</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="p in selectedAuditoria.profissionais" :key="p.id">
                          <td>{{ p.nome }}</td>
                          <td class="text-center">
                            <input type="number" min="0" v-model.number="p.quantidade" class="qty-input" />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import NavigationList from '@/components/NavigationList.vue';
import GenericTable from '@/components/GenericTable.vue';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebase';
import FiltroTabela from '@/components/FiltroTabela.vue';

// mapeamento de tipo → label
const tipoLabels = {
  sinals: 'Sinalização em Falta',
  roads: 'Vias e Passeios',
  lights: 'Iluminação Pública'
};

const tableData = ref([]);
const searchQuery = ref('');
const sortKey = ref('');      // coluna por onde ordenar
const sortOrder = ref('asc');   // 'asc' ou 'desc'
const selectedAuditoria = ref(null);

const appliedFilters = ref({});
const filterOptions = computed(() => {
  // para cada campo que queiras filtrar
  const campos = ['status', 'tipo'];
  const opts = {};
  campos.forEach(key => {
    opts[key] = [
      ...new Set(tableData.value.map(item => item[key] ?? ''))  // retira undefined
    ].filter(v => v !== '');  // opcional: tira valores vazios
  });
  return opts;
});

// 3. lidar com o evento do modal
function handleFilterApplied(filters) {
  appliedFilters.value = filters;
}

// 4. computed que junta pesquisa + filtros + ordenação
const filteredData = computed(() => {
  let data = tableData.value;

  // pesquisa por texto
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    data = data.filter(item => {
      const valores = [
        item.id
      ];
      return valores.some(v =>
        (v ?? '').toString().toLowerCase().includes(q)
      );
    });
  }

  // filtros por checkbox
  Object.entries(appliedFilters.value).forEach(([key, vals]) => {
    if (vals.length) {
      data = data.filter(item => vals.includes(item[key]));
    }
  });

  // ordenação (igual ao que já tinhas)
  if (sortKey.value) {
    data = [...data].sort((a, b) => {
      const A = a[sortKey.value];
      const B = b[sortKey.value];
      if (A < B) return sortOrder.value === 'asc' ? -1 : 1;
      if (A > B) return sortOrder.value === 'asc' ? 1 : -1;
      return 0;
    });
  }

  return data;
});


// colunas: só ID, Tipo, Estado + ações
const columns = [
  { key: 'id', label: 'ID', sortable: true, headerClass: 'col-id' },
  { key: 'tipo', label: 'Tipo', sortable: true },
  { key: 'status', label: 'Estado', sortable: true }
];
const editColumn = { key: 'acoes', label: 'Ações' }

// carrega auditorias da Firestore
async function loadAuditorias() {
  const snap = await getDocs(collection(db, 'auditorias'))
  tableData.value = snap.docs.map(doc => {
    const d = doc.data()
    return {
      id: doc.id,
      tipo: tipoLabels[d.tipo] || d.tipo,
      status: d.status || '',
      coordenadas: d.coordenadas || { latitude: 0, longitude: 0 },
      dataInicio: d.dataInicio || null,
      dataFim: d.dataFim || null,
      descricao: d.descricao || '',
      endereco: d.endereco || '',
      materiais: Array.isArray(d.materiais) ? d.materiais : [],
      profissionais: Array.isArray(d.profissionais) ? d.profissionais : [],
      perito: d.perito || '',
      tempoEstimado: d.tempoEstimado || 0
    }
  })
}

onMounted(loadAuditorias);

// abre modal
function viewAuditoria(row) {
  selectedAuditoria.value = row;
}

// fecha modal
function closeModal() {
  selectedAuditoria.value = null;
}

// formata timestamp Firestore para string PT-PT
function formatDate(ts) {
  const date = ts.toDate ? ts.toDate() : ts;
  return new Intl.DateTimeFormat('pt-PT', {
    dateStyle: 'long',
    timeStyle: 'medium'
  }).format(date) + ` UTC${date.toString().match(/GMT([+-]\d+)/)[1]}`;
}

function addMaterial() {
  this.selectedAuditoria.materiais.push({
    id: Date.now().toString(),
    nome: '',
    quantidade: 0,
    presente: true
  });
}
function addProfissional() {
  this.selectedAuditoria.profissionais.push({
    id: Date.now().toString(),
    nome: '',
    quantidade: 0
  });
}
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

.page-header h2 {
  margin: 0 0 1em;
}

.form-group {
  margin-bottom: 1em;
}

.input {
  width: 100%;
  padding: 0.5em;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.table-scroll {
  margin-top: 1em;
}

.table-scroll .generic-table-wrapper {
  max-height: 400px;
  overflow-y: auto;
}

.icon-btn {
  background: none;
  border: none;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.icon-btn:hover {
  background-color: #f0f0f0;
}

.icon-btn img {
  width: 20px;
  height: 20px;
  object-fit: contain;
}

/* fade-in do overlay */
@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

/* slide + fade do box */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-box {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  padding: 1.5em 2em;
  animation: slideIn 0.3s ease-out forwards;
}

.modal-box h3 {
  margin: 0 0 0.75em;
  font-size: 1.5em;
  font-weight: 600;
}

.btn-close {
  display: inline-block;
  margin-top: 1.5em;
  padding: 0.6em 1.2em;
  font-size: 1em;
  background: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.2s;
}

.btn-close:hover {
  background: #0056b3;
  transform: translateY(-2px);
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-container {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: 600px;
  margin: 0 16px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  max-height: 80vh;
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
  color: #333;
}

.modal-close {
  background: transparent;
  border: none;
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
  color: #666;
  transition: color 0.2s;
}

.modal-close:hover {
  color: #000;
}

.modal-body {
  overflow-y: auto;
  flex: 1;
  margin-bottom: 16px;
}

.map-wrapper {
  margin-bottom: 16px;
}

.map-iframe {
  width: 100%;
  height: 200px;
  border: 0;
  border-radius: 8px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 16px;
}

.info-item {
  font-size: 0.9rem;
  color: #333;
}

.info-item span {
  font-weight: 600;
}

.section-title {
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
}

.materials-list,
.profissionais-list {
  list-style: disc inside;
  margin: 0;
  padding: 0;
}

.materials-list li,
.profissionais-list li {
  margin-bottom: 8px;
  font-size: 0.9rem;
  color: #333;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
}

.primary-button {
  background: #0069d9;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}

.primary-button:hover {
  background: #0053ba;
}

/* Transições suaves */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.description-text {
  font-size: 0.9rem;
  color: #333;
  line-height: 1.4;
  margin: 0 0 8px;
}

.materials-table,
.professionals-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 16px;
  font-size: 0.9rem;
}

.materials-table th,
.materials-table td,
.professionals-table th,
.professionals-table td {
  border: 1px solid #ddd;
  padding: 8px;
}

.materials-table th,
.professionals-table th {
  background: #f5f5f5;
  font-weight: 600;
  text-align: left;
}

.materials-table td.text-center,
.professionals-table td.text-center {
  text-align: center;
}

.section-title {
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
}

@media (max-width: 480px) {

  .materials-table th,
  .materials-table td,
  .professionals-table th,
  .professionals-table td {
    padding: 6px;
    font-size: 0.8rem;
  }
}

.qty-input {
  width: 60px;
  padding: 4px;
  border: 1px solid #ccc;
  border-radius: 4px;
  text-align: center;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.add-button {
  background: transparent;
  border: none;
  font-size: 1rem;
  color: #0069d9;
  cursor: pointer;
  transition: color 0.2s;
}

.add-button:hover {
  color: #0053ba;
}
</style>
