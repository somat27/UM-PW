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
            <GenericTable :data="profissionais" :columns="[...profissionalColumns, editColumn]" :loading="loading"
              type="striped" @edit="openEditModal">

              <template #cell-quantidade="{ row }">
                <input type="number" v-model.number="row.quantidade" @change="atualizarQuantidade(row.id, row.quantidade)"
                  class="quant-input" />
              </template>

            </GenericTable>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import NavigationList from '@/components/NavigationList.vue'
import GenericTable from '@/components/GenericTable.vue'
import AddProfissionalModal from '@/components/AddProfissionalModal.vue'
import { db } from '@/firebase.js'
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore'

export default {
  name: 'GestaoProfissionais',
  components: {
    NavigationList,
    GenericTable,
    AddProfissionalModal
  },
  data() {
    return {
      profissionais: [],
      loading: false,
      erro: null,
      searchQuery: "",          // texto da pesquisa
      sortKey: "",              // campo por onde ordenar
      sortOrder: "asc",         // ordem: asc ou desc
      sortColumns: [            // opções do dropdown
        { key: "nome", label: "Nome" },
        { key: "area", label: "Área/Especialidade" },
        { key: "quantidade", label: "Quantidade" }
      ],
      showAddModal: false,
      profissionalParaEditar: null,
      profissionalColumns: [
        { key: 'nome', label: 'Nome' },
        { key: 'area', label: 'Área/Especialidade' },
        { key: 'quantidade', label: 'Quantidade' }
      ],
      editColumn: { key: 'edit', label: 'Editar' }
    }
  },
  mounted() {
    this.fetchProfissionais()
  },
  methods: {
    async fetchProfissionais() {
      this.loading = true
      this.erro = null
      try {
        const snap = await getDocs(collection(db, 'profissionais'))
        this.profissionais = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      } catch (e) {
        this.erro = 'Não foi possível carregar os profissionais.'
        console.error(e)
      } finally {
        this.loading = false
      }
    },
    toggleSortOrder() {
      this.sortOrder = this.sortOrder === "asc" ? "desc" : "asc";
    },
    openAddModal() {
      this.profissionalParaEditar = null
      this.showAddModal = true
    },
    openEditModal(item) {
      this.profissionalParaEditar = item
      this.showAddModal = true
    },
    async handleProfissionalSaved() {
      this.showAddModal = false
      await this.fetchProfissionais()
    },
    async atualizarQuantidade(id, novaQtd) {
      try {
        const refDoc = doc(db, 'profissionais', id)
        await updateDoc(refDoc, { quantidade: novaQtd })
        const item = this.profissionais.find(p => p.id === id)
        if (item) item.quantidade = novaQtd
      } catch (e) {
        console.error('Erro ao atualizar quantidade:', e)
      }
    }
  }
}
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
</style>