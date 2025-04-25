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

          <div class="form-group">
            <input v-model="searchQuery" type="text" placeholder="Pesquisar auditorias..." class="input" />
          </div>

          <GenericTable :columns="columns" :data="filteredData" class="table-scroll">
            <template #cell-acoes="{ row }">
              <button @click="viewAuditoria(row)" class="icon-btn" title="Ver detalhes">
                <img src="@/assets/icons8-eye-forma-light/icons8-eye-24.png" alt="Ver detalhes" />
              </button>
            </template>
          </GenericTable>

          <!-- Modal de detalhes -->
          <div v-if="selectedAuditoria" class="modal-overlay" @click.self="closeModal">
            <div class="modal-box">
              <h3>Auditoria: {{ selectedAuditoria.id }}</h3>

              <!-- Mapa -->
              <div v-if="selectedAuditoria.coordenadas">
                <iframe
                  :src="`https://www.google.com/maps?q=${selectedAuditoria.coordenadas.latitude},${selectedAuditoria.coordenadas.longitude}&hl=pt&z=15&output=embed`"
                  width="100%" height="200" frameborder="0" style="border:0;" allowfullscreen loading="lazy"></iframe>
              </div>

              <div class="modal-body">
                <p v-if="selectedAuditoria.dataInicio">
                  <strong>Data Início:</strong>
                  {{ formatDate(selectedAuditoria.dataInicio) }}
                </p>
                <p v-if="selectedAuditoria.dataFim">
                  <strong>Data Fim:</strong>
                  {{ formatDate(selectedAuditoria.dataFim) }}
                </p>
                <p><strong>Descrição:</strong> {{ selectedAuditoria.descricao }}</p>
                <p><strong>Endereço:</strong> {{ selectedAuditoria.endereco }}</p>
                <p><strong>Tipo:</strong>
                  {{ tipoLabels[selectedAuditoria.tipo] || selectedAuditoria.tipo }}
                </p>
                <p><strong>Estado:</strong> {{ selectedAuditoria.status }}</p>
                <p><strong>Tempo Estimado (h):</strong> {{ selectedAuditoria.tempoEstimado }}</p>

                <h4>Materiais</h4>
                <ul>
                  <li v-for="m in selectedAuditoria.materiais" :key="m.id">
                    {{ m.nome }} — Qtd: {{ m.quantidade }}
                  </li>
                </ul>

                <h4>Profissionais</h4>
                <ul>
                  <li v-for="p in selectedAuditoria.profissionais" :key="p.id">
                    {{ p.nome }} — Qtd: {{ p.quantidade }}
                  </li>
                </ul>

                <p><strong>Perito (ID):</strong> {{ selectedAuditoria.perito }}</p>
              </div>

              <button class="btn-close" @click="closeModal">Fechar</button>
            </div>
          </div>
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

// mapeamento de tipo → label
const tipoLabels = {
  sinals: 'Sinalização em Falta',
  roads: 'Vias e Passeios',
  lights: 'Iluminação Pública'
};

const tableData = ref([]);
const searchQuery = ref('');
const selectedAuditoria = ref(null);

// colunas: só ID, Tipo, Estado + ações
const columns = [
  { key: 'id', label: 'ID', sortable: true, headerClass: 'col-id' },
  { key: 'tipo', label: 'Tipo', sortable: true },
  { key: 'status', label: 'Estado', sortable: true },
  { key: 'acoes', label: 'Ações' }
];

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

// computed com filtro de pesquisa
const filteredData = computed(() => {
  if (!searchQuery.value) return tableData.value;
  const q = searchQuery.value.toLowerCase();
  return tableData.value.filter(item =>
    ['id', 'tipo', 'status']
      .some(key => String(item[key]).toLowerCase().includes(q))
  );
});

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
  background: #fff;
  padding: 1.5em;
  border-radius: 8px;
  max-height: calc(100vh - 120px);
  overflow-y: auto;
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

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease-out;
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

.modal-body p,
.modal-body h4 {
  margin: 0.7em 0;
  line-height: 1.4;
}

.modal-body ul {
  list-style: disc inside;
  margin: 0.5em 0 1em;
  padding-left: 1.2em;
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
</style>
