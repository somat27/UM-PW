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
          <div v-if="loading">A carregar…</div>
          <div v-else>
            <div v-if="erro" class="mensagem-erro">{{ erro }}</div>
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
            <GenericTable @edit="openEditModal" :data="filteredMateriais" :columns="[...materialColumns, editColumn]" :loading="loading"
              type="striped">
              <template #cell-quantidade="{ row }">
                <input type="number" v-model.number="row.quantidade"
                  @change="atualizarQuantidade(row.id, row.quantidade)" class="quant-input" />
              </template>
            </GenericTable>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import NavigationList from "../components/NavigationList.vue";
import GenericTable from "@/components/GenericTable.vue";
import AddMaterialModal from "@/components/AddMaterialModal.vue";
import { db } from "@/firebase.js";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc
} from "firebase/firestore";

export default {
  name: "GestaoPeritos",
  components: {
    NavigationList,
    GenericTable,
    AddMaterialModal,
  },
  data() {
    return {
      materiais: [],         
      novoMaterial: {        
        nome: "",
        categoria: "",
        preco: 0,
        quantidade: 0
      },
      loading: false,        
      erro: null,
      searchQuery: "",       
      sortKey: "",           
      sortOrder: "asc",      
      sortColumns: [         
        { key: "nome", label: "Nome" },
        { key: "categoria", label: "Categoria" },
        { key: "preco", label: "Preço/Unidade" },
        { key: "quantidade", label: "Quantidade" }
      ],
      materialColumns: [
        { key: "nome", label: "Nome" },
        { key: "categoria", label: "Categoria" },
        { key: "preco", label: "Preço/Unidade" },
        { key: "quantidade", label: "Quantidade", slot: "quantidade" }
      ],
      editColumn: { key: "edit", label: "Editar" },
      showAddModal: false,
      materialParaEditar: null
    };
  },
  mounted() {
    this.fetchMateriais();
  },
  methods: {
    async fetchMateriais() {
      this.loading = true;
      this.erro = null;
      try {
        const snapshot = await getDocs(collection(db, "materiais"));
        this.materiais = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      } catch (e) {
        this.erro = "Não foi possível carregar os materiais.";
        console.error(e);
      } finally {
        this.loading = false;
      }
    },
    async adicionarMaterial() {
      this.loading = true;
      try {
        const ref = await addDoc(collection(db, "materiais"), {
          nome: this.novoMaterial.nome,
          categoria: this.novoMaterial.categoria,
          preco: this.novoMaterial.preco,
          quantidade: this.novoMaterial.quantidade
        });
        // adiciona imediatamente à lista local
        this.materiais.push({ id: ref.id, ...this.novoMaterial });
        // limpa o formulário
        this.novoMaterial = { nome: "", categoria: "", preco: 0, quantidade: 0 };
      } catch (e) {
        this.erro = "Não foi possível adicionar o material.";
        console.error(e);
      } finally {
        this.loading = false;
      }
    },
    async atualizarQuantidade(id, novaQtd) {
      try {
        const refDoc = doc(db, "materiais", id);
        await updateDoc(refDoc, { quantidade: novaQtd });
        // reflete a mudança na lista local
        const item = this.materiais.find(m => m.id === id);
        if (item) item.quantidade = novaQtd;
      } catch (e) {
        console.error("Erro ao atualizar quantidade:", e);
      }
    },
    toggleSortOrder() {
      this.sortOrder = this.sortOrder === "asc" ? "desc" : "asc";
    },
    openAddMaterialModal() {
      this.materialParaEditar = null;
      this.showAddModal = true;
    },
    openEditModal(mat) {
      this.materialParaEditar = mat;
      this.showAddModal = true;
    },
    handleMaterialSaved() {
      this.showAddModal = false;
      this.fetchMateriais();
    }
  },
  computed: {
    filteredMateriais() {
      let list = this.materiais;

      // 1) filtrar pela pesquisa (nome OU categoria)
      if (this.searchQuery) {
        const q = this.searchQuery.toLowerCase();
        list = list.filter(mat =>
          mat.nome.toLowerCase().includes(q) ||
          mat.categoria.toLowerCase().includes(q)
        );
      }

      // 2) ordenar se houver chave definida
      if (this.sortKey) {
        list = [...list].sort((a, b) => {
          let A = a[this.sortKey];
          let B = b[this.sortKey];

          // converter strings para lower case
          if (typeof A === "string") A = A.toLowerCase();
          if (typeof B === "string") B = B.toLowerCase();

          if (A < B) return this.sortOrder === "asc" ? -1 : 1;
          if (A > B) return this.sortOrder === "asc" ? 1 : -1;
          return 0;
        });
      }

      return list;
    }
  }
};
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
</style>