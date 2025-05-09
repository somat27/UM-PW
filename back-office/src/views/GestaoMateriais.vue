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

          <AddMaterialModal v-if="showAddModal" :material="materialParaEditar" @close="showAddModal = false"
            @saved="handleMaterialSaved" />

          <div v-if="showAddQuantidadeModal" class="modal-overlay">
            <div class="modal-content">
              <h3>Adicionar {{ materialParaAdicionarQtd.nome }}</h3>
              <input type="number" v-model.number="quantidadeParaAdicionar" min="1" class="input-quantidade" />
              <div class="modal-actions">
                <button @click="showAddQuantidadeModal = false" class="btn-secondary">Cancelar</button>
                <button @click="confirmarAdicionarQuantidade" class="btn-primary">Confirmar</button>
              </div>
            </div>
          </div>

          <div v-if="loading">A carregar…</div>
          <div v-else>
            <div v-if="erro" class="error">{{ erro }}</div>

            <!-- Cabeçalho -->
            <div class="page-header">
              <h2>Gestão de Materiais</h2>
            </div>

            <div class="controls">
              <input v-model="searchQuery" type="text" placeholder="Procurar Materiais..." class="search-input" />
              <select v-model="sortKey" class="sort-select">
                <option value="">Ordenar por</option>
                <option v-for="col in sortColumns" :key="col.key" :value="col.key">
                  {{ col.label }}
                </option>
              </select>
              <button @click="toggleSortOrder" class="sort-button">
                {{ sortOrder === 'asc' ? '↑' : '↓' }}
              </button>
              <button @click="openAddMaterialModal" class="btn-add-material">
                Adicionar Material
              </button>
            </div>

            <!-- Tabela genérica com colunas e ações -->
            <GenericTable :data="filteredMateriais" :columns="[...materialColumns, editColumn]" :loading="loading"
              type="striped" @edit="openEditModal" @add="openAddQuantidadeModal" />
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
import AddMaterialModal from '@/components/AddMaterialModal.vue'
import { db } from '@/firebase.js'
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore'

// estados
const materiais = ref([])
const loading = ref(false)
const erro = ref(null)
const searchQuery = ref('')       // pesquisa por nome apenas
const sortKey = ref('')
const sortOrder = ref('asc')
const sortColumns = [
  { key: 'nome', label: 'Nome' },
  { key: 'categoria', label: 'Categoria' },
  { key: 'preco', label: 'Preço/Unidade' },
  { key: 'quantidade', label: 'Quantidade' }
]
const materialColumns = [...sortColumns]
const editColumn = { key: 'edit-materiais', label: 'Ações' }
const showAddModal = ref(false)
const materialParaEditar = ref(null)
const showAddQuantidadeModal = ref(false)
const materialParaAdicionarQtd = ref(null)
const quantidadeParaAdicionar = ref(1)

// computados
const filteredMateriais = computed(() => {
  let list = materiais.value

  // filtrar apenas por nome
  if (searchQuery.value) {
    const term = searchQuery.value.toLowerCase()
    list = list.filter(m =>
      m.nome.toLowerCase().includes(term)
    )
  }

  // ordenar
  if (sortKey.value) {
    list = list.slice().sort((a, b) => {
      let valA = a[sortKey.value]
      let valB = b[sortKey.value]
      if (typeof valA === 'string') valA = valA.toLowerCase()
      if (typeof valB === 'string') valB = valB.toLowerCase()
      if (valA < valB) return sortOrder.value === 'asc' ? -1 : 1
      if (valA > valB) return sortOrder.value === 'asc' ? 1 : -1
      return 0
    })
  }

  return list
})

// métodos
async function fetchMateriais() {
  loading.value = true
  erro.value = null
  try {
    const snap = await getDocs(collection(db, 'materiais'))
    materiais.value = snap.docs.map(d => ({ id: d.id, ...d.data() }))
  } catch (e) {
    erro.value = 'Não foi possível carregar os materiais.'
    console.error(e)
  } finally {
    loading.value = false
  }
}

function toggleSortOrder() {
  sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
}

function openAddMaterialModal() {
  materialParaEditar.value = null
  showAddModal.value = true
}

function openEditModal(item) {
  materialParaEditar.value = item
  showAddModal.value = true
}

function openAddQuantidadeModal(item) {
  materialParaAdicionarQtd.value = item
  quantidadeParaAdicionar.value = 1
  showAddQuantidadeModal.value = true
}

async function confirmarAdicionarQuantidade() {
  const novaQtd = materialParaAdicionarQtd.value.quantidade + quantidadeParaAdicionar.value
  await atualizarQuantidade(materialParaAdicionarQtd.value.id, novaQtd)
  showAddQuantidadeModal.value = false
  fetchMateriais()
}

async function handleMaterialSaved() {
  showAddModal.value = false
  fetchMateriais()
}

async function atualizarQuantidade(id, novaQtd) {
  try {
    const refDoc = doc(db, 'materiais', id)
    await updateDoc(refDoc, { quantidade: novaQtd })
    const item = materiais.value.find(m => m.id === id)
    if (item) item.quantidade = novaQtd
  } catch (e) {
    console.error('Erro ao atualizar quantidade:', e)
  }
}

// life-cycle
onMounted(fetchMateriais)
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

.btn-add-material {
  background-color: #1890ff;
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.btn-add-material:hover {
  background-color: #167ac6;
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
</style>