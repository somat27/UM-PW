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
            <h2>Gestão de Ocorrências</h2>
          </div>

          <div class="content-section">
            <AuditTable title="Tabela de Ocorrências" subTitle="Lista completa de registros de ocorrências"
              :columns="tableColumns" :data="tableData" type="striped">
              <template #column-salary="{ value }">
                <span class="text-success">{{ value }}</span>
              </template>
            </AuditTable>
          </div>
          <div class="details-down">
            <div class="details-wrapper">
              <DetailsOco datetime="19/03/2024, 18:00" category="Infraestruturas" priority="Alta"
                description="Queda de muro devido ao mau tempo, bloqueando parcialmente a via." />
            </div>
            <div class="buttons-container">
              <div class="buttons-column">
                <router-link to="/GestaoOcorrencias/AprovacaoOcorrencia" class="tab-link">
                  <button class="btn-approve">Aprovar</button>
                </router-link>

                <button class="btn-reject">Rejeitar</button>
              </div>
            </div>
            <div class="search-section inline">
              <div class="search-input">
                <input type="text" v-model="searchQuery" placeholder="Pesquisar Localidade..."
                  class="search-container" />
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import NavigationList from "@/components/NavigationList.vue";
import AuditTable from "@/components/AuditTables.vue";
import DetailsOco from "@/components/DetailsOco.vue";

export default {
  name: "GestaoAuditorias",
  components: {
    NavigationList,
    AuditTable,
    DetailsOco
  },
  data() {

    return {
      tableColumns: [
        { key: 'id', label: 'ID', headerClass: 'col-id' },
        { key: 'morada', label: 'Morada' },
        { key: 'localidade', label: 'Localidade', cellClass: 'text-right' },
        { key: 'coordenadas', label: 'Coordenadas' }
      ],
      tableData: [
        {
          id: 1,
          morada: "Rua das Flores, nº45",
          localidade: "Lisboa",
          coordenadas: "função mapa?"
        },
        {
          id: 2,
          morada: "Avenida da Liberdade, nº100",
          localidade: "Lisboa",
          coordenadas: "função mapa?"
        },
        {
          id: 3,
          morada: "Rua Jõao dos Santos, nº12",
          localidade: "Porto",
          coordenadas: "função mapa?"
        },
        {
          id: 4,
          morada: "Rua Gil Vicente, nº67",
          localidade: "Guimarães",
          coordenadas: "função mapa?"
        },
        {
          id: 5,
          morada: "Rua de Santo António, nº45",
          localidade: "Guimarães",
          coordenadas: "função mapa?"
        }
      ]
    };
  },

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

.search-section {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
  position: relative;
  top: -450px;
  left: -900px;
}

.search-input {
  position: relative;
}

.search-container {
  padding: 8px 40px 8px 12px;
  border: 1px solid #13c2c2;
  border-radius: 4px;
  width: 200px;
}

.search-button {
  position: absolute;
  right: 4px;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  background: none;
  cursor: pointer;
}


.buttons-container {
  display: flex;
  justify-content: flex-end;
  padding: 10px 0;
  position: relative;
  top: -220px;
  left: -120px;
}

.buttons-column {
  display: flex;
  flex-direction: column;
  gap: 50px;
  width: fit-content;
}

.btn-approve,
.btn-reject {
  padding: 15px 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  color: white;
  cursor: pointer;
  width: 120px;
}

.btn-approve {
  background-color: #28a745;
}

.btn-approve:hover {
  background-color: #218838;
}

.btn-reject {
  background-color: #f44336;
}

.btn-reject:hover {
  background-color: #d32f2f;
}


.AuditTable {
  position: relative;
  left: -100px;
}
</style>