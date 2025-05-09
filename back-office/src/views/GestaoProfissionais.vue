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

          <!-- Modal de adicionar/editar -->
          <AddProfissionalModal v-if="showAddModal" :profissional="profissionalParaEditar" @close="showAddModal = false"
            @saved="handleProfissionalSaved" />

          <div v-if="showAddQuantidadeModal" class="modal-overlay">
            <div class="modal-content">
              <h3>Adicionar {{ profissionalParaAdicionarQtd.nome }}</h3>
              <input type="number" v-model.number="quantidadeParaAdicionar" min="1" class="input-quantidade" />
              <div class="modal-actions">
                <button @click="showAddQuantidadeModal = false" class="btn-secondary">Cancelar</button>
                <button @click="confirmarAdicionarQuantidade" class="btn-primary">Confirmar</button>
              </div>
            </div>
          </div>

          <!-- Loading / Erro -->
          <div v-if="loading">A carregar…</div>
          <div v-else>
            <div v-if="erro" class="error">{{ erro }}</div>

            <!-- Cabeçalho -->
            <div class="page-header">
              <h2>Gestão de Profissionais</h2>
            </div>
            <div class="controls">
              <input v-model="searchQuery" type="text" placeholder="Procurar Profissionais..." class="search-input" />

              <select v-model="sortKey" class="sort-select">
                <option value="">Ordenar por</option>
                <option v-for="col in sortColumns" :key="col.key" :value="col.key">
                  {{ col.label }}
                </option>
              </select>

              <button @click="toggleSortOrder" class="sort-button">
                {{ sortOrder === 'asc' ? '↑' : '↓' }}
              </button>

              <button @click="openAddModal" class="btn-add">
                Adicionar Profissional
              </button>
            </div>

            <!-- Tabela genérica -->
            <GenericTable :data="processedProfissionais" :columns="[...profissionalColumns, editColumn]"
              :loading="loading" type="striped" @edit="openEditModal" @add="openAddQuantidadeModal" />
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import NavigationList from '@/components/NavigationList.vue'
import GenericTable from '@/components/GenericTable.vue'
import AddProfissionalModal from '@/components/AddProfissionalModal.vue'
import { db } from '@/firebase.js'
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore'

// Estados reativos
const profissionais = ref([])
const loading = ref(false)
const erro = ref(null)
const searchQuery = ref('')
const sortKey = ref('')
const sortOrder = ref('asc')
const sortColumns = [
  { key: 'nome', label: 'Nome' },
  { key: 'area', label: 'Área/Especialidade' },
  { key: 'preco', label: 'Preço/Hora' },
  { key: 'quantidade', label: 'Quantidade' }
]
const showAddModal = ref(false)
const profissionalParaEditar = ref(null)
const showAddQuantidadeModal = ref(false)
const profissionalParaAdicionarQtd = ref(null)
const quantidadeParaAdicionar = ref(1)
const profissionalColumns = [
  { key: 'nome', label: 'Nome' },
  { key: 'area', label: 'Área/Especialidade' },
  { key: 'preco', label: 'Preço/Hora' },
  { key: 'quantidade', label: 'Quantidade' }
]
const editColumn = { key: 'edit-profissionais', label: 'Ações' }

// Computado equivalente a processedProfissionais
const processedProfissionais = computed(() => {
  let result = profissionais.value

  // filtrar por nome
  if (searchQuery.value) {
    const term = searchQuery.value.toLowerCase()
    result = result.filter(p =>
      p.nome.toLowerCase().includes(term)
    )
  }

  // ordenar se sortKey estiver definido
  if (sortKey.value) {
    result = result.slice().sort((a, b) => {
      let valA = a[sortKey.value]
      let valB = b[sortKey.value]
      if (typeof valA === 'string') valA = valA.toLowerCase()
      if (typeof valB === 'string') valB = valB.toLowerCase()
      if (valA < valB) return sortOrder.value === 'asc' ? -1 : 1
      if (valA > valB) return sortOrder.value === 'asc' ? 1 : -1
      return 0
    })
  }

  return result
})

// Funções/métodos
async function fetchProfissionais() {
  loading.value = true
  erro.value = null
  try {
    const snap = await getDocs(collection(db, 'profissionais'))
    profissionais.value = snap.docs.map(d => ({ id: d.id, ...d.data() }))
  } catch (e) {
    erro.value = 'Não foi possível carregar os profissionais.'
    console.error(e)
  } finally {
    loading.value = false
  }
}

function toggleSortOrder() {
  sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
}

function openAddModal() {
  profissionalParaEditar.value = null
  showAddModal.value = true
}

function openEditModal(item) {
  profissionalParaEditar.value = item
  showAddModal.value = true
}

function openAddQuantidadeModal(item) {
  profissionalParaAdicionarQtd.value = item
  quantidadeParaAdicionar.value = 1
  showAddQuantidadeModal.value = true
}

async function confirmarAdicionarQuantidade() {
  const novaQtd = profissionalParaAdicionarQtd.value.quantidade + quantidadeParaAdicionar.value
  await atualizarQuantidade(profissionalParaAdicionarQtd.value.id, novaQtd)
  showAddQuantidadeModal.value = false
  await fetchProfissionais()
}

async function handleProfissionalSaved() {
  showAddModal.value = false
  await fetchProfissionais()
}

async function atualizarQuantidade(id, novaQtd) {
  try {
    const refDoc = doc(db, 'profissionais', id)
    await updateDoc(refDoc, { quantidade: novaQtd })
    const item = profissionais.value.find(p => p.id === id)
    if (item) item.quantidade = novaQtd
  } catch (e) {
    console.error('Erro ao atualizar quantidade:', e)
  }
}

// Life-cycle
onMounted(fetchProfissionais)
</script>

<style scoped>
html,
body,
#app,
.dashboard-container,
.dashboard-layout {
  height: 100%;
  margin: 0;
  padding: 0;
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

.filters-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  max-width: fit-content;
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
  font-size: 1rem;
}

.sort-button {
  padding: 0.4rem 0.75rem;
  border: 1px solid #ccc;
  border-radius: 0.375rem;
  background: white;
  font-size: 1rem;
  cursor: pointer;
}

.sort-button:hover {
  background: #f0f0f0;
}

.quant-input {
  width: 4rem;
  padding: 0.25rem;
  border: 1px solid #ccc;
  border-radius: 0.25rem;
  text-align: right;
}

.btn-add {
  background-color: #1890ff;
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.btn-add:hover {
  background-color: #167ac6;
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
  width: 300px;
}

.modal-content h3 {
  margin-top: 0;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 15px;
}

.btn-confirm,
.btn-cancel {
  padding: 6px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-confirm {
  background: #4caf50;
  color: #fff;
}

.btn-cancel {
  background: #f44336;
  color: #fff;
}

.btn-primary {
  background: #1890ff;
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  cursor: pointer;
}

.btn-primary:hover {
  background: #167ac6;
}

.btn-secondary {
  background: transparent;
  border: 1px solid #ccc;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  cursor: pointer;
}

.btn-secondary:hover {
  background: #f5f5f5;
}

.form-group {
  margin-bottom: 0.75rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.25rem;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 0.375rem;
}
</style>