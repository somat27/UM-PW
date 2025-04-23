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

          <div class="content-section">
            <AuditTable title="Tabela de Auditorias" subTitle="Lista completa de registros de auditoria"
              :columns="tableColumns" :data="tableData" type="striped">
              <template #column-salary="{ value }">
                <span class="text-success">{{ value }}</span>
              </template>
              <template #column-acoes="{ item }">
                <div class="action-buttons">
                  <button @click="viewItem(item)" class="icon-btn" title="Visualizar">
                    <img src="@/assets/icons8-eye-forma-light/icons8-eye-24.png" alt="Visualizar">
                  </button>
                  <button @click="editItem(item)" class="icon-btn" title="Editar">
                    <img src="@/assets/icons8-pencil-pastel-glyph/icons8-pencil-24.png" alt="Editar">
                  </button>
                  <button @click="deleteItem(item)" class="icon-btn" title="Eliminar">
                    <img src="@/assets/icons8-trash-ink/icons8-trash-24.png" alt="Eliminar">
                  </button>
                </div>
              </template>
            </AuditTable>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import NavigationList from "@/components/NavigationList.vue";
import AuditTable from "@/components/AuditTables.vue";

export default {
  name: "GestaoAuditorias",
  components: {
    NavigationList,
    AuditTable
  },
  data() {
    return {
      tableColumns: [
        { key: 'id', label: 'ID', headerClass: 'col-id' },
        { key: 'morada', label: 'Morada' },
        { key: 'localidade', label: 'Localidade', cellClass: 'text-right' },
        { key: 'estado', label: 'Estado' },
        { key: 'coordenadas', label: 'Coordenadas' },
        { key: 'acoes', label: 'Ações' }
      ],
      tableData: [
        {
          id: 1,
          morada: "Rua das Flores, nº45",
          localidade: "Lisboa",
          estado: "Finalizada",
          coordenadas: "função mapa?"
        },
        {
          id: 2,
          morada: "Avenida da Liberdade, nº100",
          localidade: "Lisboa",
          estado: "Por confirmar",
          coordenadas: "função mapa?"
        },
        {
          id: 3,
          morada: "Rua Jõao dos Santos, nº12",
          localidade: "Porto",
          estado: "Finalizada",
          coordenadas: "função mapa?"
        },
        {
          id: 4,
          morada: "Rua Gil Vicente, nº67",
          localidade: "Guimarães",
          estado: "Finalizada",
          coordenadas: "função mapa?"
        },
        {
          id: 5,
          morada: "Rua de Santo António, nº45",
          localidade: "Guimarães",
          estado: "Em andamento",
          coordenadas: "função mapa?"
        }
      ]
    };
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

.icon-btn {
  background: none;
  border: none;
  cursor: pointer;
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
</style>